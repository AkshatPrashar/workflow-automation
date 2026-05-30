from sqlalchemy.ext.asyncio import AsyncSession
from app.models.meeting import Meeting
from app.repositories.base import BaseRepository

class MeetingRepository(BaseRepository[Meeting]):
    def __init__(self, db: AsyncSession):
        super().__init__(Meeting, db)
