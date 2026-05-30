from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.meeting import MeetingUpload, MeetingResponse
from app.repositories.meeting import MeetingRepository
from app.repositories.task import TaskRepository
from app.services.ai import AIService

router = APIRouter(prefix="/meetings", tags=["Meetings"])

@router.post("/upload", response_model=MeetingResponse, status_code=status.HTTP_201_CREATED)
async def upload_meeting(
    meeting_in: MeetingUpload,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Submits a new meeting transcript, saving it to database."""
    meeting_repo = MeetingRepository(db)
    new_meeting = await meeting_repo.create({
        "title": meeting_in.title,
        "transcript": meeting_in.transcript,
        "summary": None
    })
    await db.commit()
    # Refresh to load empty tasks relationship properly
    await db.refresh(new_meeting)
    return new_meeting

@router.get("/{id}", response_model=MeetingResponse)
async def get_meeting(
    id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Fetches details of a meeting, including generated summary and action tasks."""
    meeting_repo = MeetingRepository(db)
    meeting_record = await meeting_repo.get(id)
    if not meeting_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id {id} not found."
        )
    return meeting_record

@router.post("/{id}/analyze", response_model=MeetingResponse)
async def analyze_meeting(
    id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generates summary and extracts action items from transcript, creating database Tasks."""
    meeting_repo = MeetingRepository(db)
    meeting_record = await meeting_repo.get(id)
    if not meeting_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting with id {id} not found."
        )

    ai_service = AIService()
    
    # 1. Generate summary
    summary = ai_service.summarize_meeting(meeting_record.transcript)
    
    # 2. Extract action items
    extracted_tasks = ai_service.extract_action_items(meeting_record.transcript)
    
    # 3. Delete old tasks for this meeting to prevent duplicate analysis runs
    task_repo = TaskRepository(db)
    old_tasks = await task_repo.get_tasks(meeting_id=id, limit=500)
    for task_record in old_tasks:
        await task_repo.delete(task_record.id)
        
    # 4. Insert newly extracted tasks
    for task_item in extracted_tasks:
        # Resolve owner and deadline safely
        deadline_date = None
        if task_item.get("deadline"):
            try:
                from datetime import datetime
                # Handle string conversion YYYY-MM-DD
                deadline_date = datetime.strptime(task_item["deadline"], "%Y-%m-%d").date()
            except Exception:
                deadline_date = None
                
        await task_repo.create({
            "meeting_id": id,
            "task_name": task_item["task_name"],
            "owner": task_item.get("owner"),
            "deadline": deadline_date,
            "status": "Pending"
        })

    # 5. Update meeting summary
    updated_meeting = await meeting_repo.update(meeting_record, {"summary": summary})
    await db.commit()
    
    # Refresh to load newly created tasks in lazy relationship
    await db.refresh(updated_meeting)
    return updated_meeting
