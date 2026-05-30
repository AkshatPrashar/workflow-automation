from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.repositories.task import TaskRepository
from app.repositories.meeting import MeetingRepository

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("", response_model=List[TaskResponse])
async def list_tasks(
    owner: Optional[str] = None,
    status: Optional[str] = None,
    meeting_id: Optional[int] = None,
    deadline_before: Optional[date] = None,
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieves all tasks / action items, supporting filters and pagination."""
    task_repo = TaskRepository(db)
    return await task_repo.get_tasks(
        owner=owner,
        status=status,
        meeting_id=meeting_id,
        deadline_before=deadline_before,
        skip=skip,
        limit=limit
    )

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_in: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Manually registers a new action item / task linked to a meeting."""
    # Ensure meeting exists
    meeting_repo = MeetingRepository(db)
    meeting_record = await meeting_repo.get(task_in.meeting_id)
    if not meeting_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Meeting with id {task_in.meeting_id} does not exist."
        )

    task_repo = TaskRepository(db)
    new_task = await task_repo.create({
        "meeting_id": task_in.meeting_id,
        "task_name": task_in.task_name,
        "owner": task_in.owner,
        "deadline": task_in.deadline,
        "status": "Pending"
    })
    await db.commit()
    return new_task

@router.put("/{id}", response_model=TaskResponse)
async def update_task(
    id: int,
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Updates properties (owner, deadline, status, name) of a task."""
    task_repo = TaskRepository(db)
    task_record = await task_repo.get(id)
    if not task_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {id} not found."
        )

    # Exclude unset fields from the input schema
    update_data = task_in.model_dump(exclude_unset=True)
    updated_task = await task_repo.update(task_record, update_data)
    await db.commit()
    return updated_task

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Deletes a task / action item from database."""
    task_repo = TaskRepository(db)
    task_record = await task_repo.get(id)
    if not task_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {id} not found."
        )
    await task_repo.delete(id)
    await db.commit()
    return None
