from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

class EmailCreate(BaseModel):
    sender: str
    subject: str
    body: str

class EmailUpdateDraft(BaseModel):
    draft_reply: str

class EmailResponse(BaseModel):
    id: int
    sender: str
    subject: str
    body: str
    category: Optional[str] = None
    priority: Optional[str] = None
    draft_reply: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
