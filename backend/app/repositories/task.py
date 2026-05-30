from typing import List, Optional
from datetime import date
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.task import Task
from app.repositories.base import BaseRepository

class TaskRepository(BaseRepository[Task]):
    def __init__(self, db: AsyncSession):
        super().__init__(Task, db)

    async def get_tasks(
        self,
        owner: Optional[str] = None,
        status: Optional[str] = None,
        meeting_id: Optional[int] = None,
        deadline_before: Optional[date] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Task]:
        query = select(Task)
        if owner:
            query = query.filter(Task.owner == owner)
        if status:
            query = query.filter(Task.status == status)
        if meeting_id:
            query = query.filter(Task.meeting_id == meeting_id)
        if deadline_before:
            query = query.filter(Task.deadline <= deadline_before)

        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())
