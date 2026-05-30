from datetime import date
from typing import Optional
from pydantic import BaseModel

class TaskCreate(BaseModel):
    meeting_id: int
    task_name: str
    owner: Optional[str] = None
    deadline: Optional[date] = None

class TaskUpdate(BaseModel):
    task_name: Optional[str] = None
    owner: Optional[str] = None
    deadline: Optional[date] = None
    status: Optional[str] = None

class TaskResponse(BaseModel):
    id: int
    meeting_id: int
    task_name: str
    owner: Optional[str] = None
    deadline: Optional[date] = None
    status: str

    class Config:
        from_attributes = True
