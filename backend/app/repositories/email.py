from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.email import Email
from app.repositories.base import BaseRepository

class EmailRepository(BaseRepository[Email]):
    def __init__(self, db: AsyncSession):
        super().__init__(Email, db)

    async def get_emails(
        self,
        category: Optional[str] = None,
        priority: Optional[str] = None,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Email]:
        query = select(Email)
        if category:
            query = query.filter(Email.category == category)
        if priority:
            query = query.filter(Email.priority == priority)
        if status:
            query = query.filter(Email.status == status)
        
        # Order by created_at descending to show recent emails first
        query = query.order_by(Email.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())
