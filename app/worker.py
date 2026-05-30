import asyncio
import logging
from celery import Celery

from app.config import settings
from app.db import AsyncSessionLocal
from app.services.ai import AIService
from app.services.email import EmailService
from app.repositories.email import EmailRepository

logger = logging.getLogger(__name__)

# Initialize Celery app
celery_app = Celery(
    "tasks",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

# Optional configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

async def _process_email_async(email_id: int):
    async with AsyncSessionLocal() as db:
        email_repo = EmailRepository(db)
        email_record = await email_repo.get(email_id)
        if not email_record:
            logger.error(f"Email task received invalid email_id: {email_id}")
            return
            
        logger.info(f"Processing email {email_id} from {email_record.sender}")
        ai_service = AIService()
        
        try:
            # Execute AI analysis tasks in sequence
            category = ai_service.categorize_email(email_record.body)
            priority = ai_service.prioritize_email(email_record.body)
            draft = ai_service.generate_reply(email_record.body)
            
            # Save outcomes to DB
            await email_repo.update(email_record, {
                "category": category,
                "priority": priority,
                "draft_reply": draft,
                "status": "Analyzed"
            })
            await db.commit()
            logger.info(f"Email {email_id} successfully analyzed. Category: {category}, Priority: {priority}")
        except Exception as e:
            logger.error(f"Failed to analyze email {email_id}: {e}")
            await email_repo.update(email_record, {"status": "Failed"})
            await db.commit()

async def _fetch_and_trigger_async():
    async with AsyncSessionLocal() as db:
        email_service = EmailService()
        logger.info("Background job: Scanning inbox for unread emails...")
        new_emails = await email_service.fetch_and_store_unread_emails(db)
        
        logger.info(f"Background job: Found {len(new_emails)} new emails.")
        for email_record in new_emails:
            # Trigger Celery subtask for analysis
            process_email_task.delay(email_record.id)

@celery_app.task(name="app.worker.process_email_task")
def process_email_task(email_id: int):
    """Celery task to run email analysis via OpenAI services."""
    asyncio.run(_process_email_async(email_id))

@celery_app.task(name="app.worker.fetch_emails_and_analyze_task")
def fetch_emails_and_analyze_task():
    """Periodic Celery task to fetch unread emails and queue analysis tasks."""
    asyncio.run(_fetch_and_trigger_async())
