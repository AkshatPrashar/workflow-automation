from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.db import Base

class Email(Base):
    __tablename__ = "emails"

    id = Column(Integer, primary_key=True, index=True)
    sender = Column(String, nullable=False, index=True)
    subject = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    category = Column(String, nullable=True)  # Support, Sales, HR, Finance, Internal, Other
    priority = Column(String, nullable=True)  # High, Medium, Low
    draft_reply = Column(Text, nullable=True)
    status = Column(String, default="Pending", nullable=False)  # Pending, Analyzed, Approved, Sent, Failed
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
