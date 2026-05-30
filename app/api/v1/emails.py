from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.email import EmailResponse, EmailUpdateDraft
from app.repositories.email import EmailRepository
from app.services.email import EmailService
from app.worker import process_email_task

router = APIRouter(prefix="/emails", tags=["Emails"])

@router.get("", response_model=List[EmailResponse])
async def list_emails(
    category: Optional[str] = None,
    priority: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieves all email metadata, with optional criteria filtering and pagination."""
    email_repo = EmailRepository(db)
    return await email_repo.get_emails(
        category=category,
        priority=priority,
        status=status,
        skip=skip,
        limit=limit
    )

@router.get("/{id}", response_model=EmailResponse)
async def get_email(
    id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Gets detailed info for a single email, including body and generated reply."""
    email_repo = EmailRepository(db)
    email_record = await email_repo.get(id)
    if not email_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Email with id {id} not found."
        )
    return email_record

@router.post("/{id}/analyze", response_model=EmailResponse)
async def analyze_email(
    id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Triggers analysis task using AI service inside Celery."""
    email_repo = EmailRepository(db)
    email_record = await email_repo.get(id)
    if not email_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Email with id {id} not found."
        )
    
    # Mark status as Pending again
    await email_repo.update(email_record, {"status": "Pending"})
    await db.commit()
    
    # Trigger asynchronous Celery worker
    process_email_task.delay(id)
    
    return email_record

@router.post("/{id}/approve", response_model=EmailResponse)
async def approve_email_draft(
    id: int,
    draft_in: Optional[EmailUpdateDraft] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Approves the reply draft, optionally updating the content of the draft reply."""
    email_repo = EmailRepository(db)
    email_record = await email_repo.get(id)
    if not email_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Email with id {id} not found."
        )
        
    update_data = {"status": "Approved"}
    if draft_in and draft_in.draft_reply:
        update_data["draft_reply"] = draft_in.draft_reply
        
    updated_email = await email_repo.update(email_record, update_data)
    await db.commit()
    return updated_email

@router.post("/{id}/send")
async def send_email_reply(
    id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Dispatches the approved reply draft via SMTP configuration."""
    email_service = EmailService()
    success = await email_service.send_approved_reply(db, id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to send email. Verify it is approved and SMTP config is valid."
        )
    return {"message": "Email sent successfully."}
