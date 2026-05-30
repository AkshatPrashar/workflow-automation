from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from app.schemas.task import TaskResponse

class MeetingUpload(BaseModel):
    title: str
    transcript: str

class MeetingResponse(BaseModel):
    id: int
    title: str
    transcript: str
    summary: Optional[str] = None
    created_at: datetime
    tasks: List[TaskResponse] = []

    class Config:
        from_attributes = True
