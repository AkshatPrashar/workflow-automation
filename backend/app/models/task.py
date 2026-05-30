from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    task_name = Column(String, nullable=False)
    owner = Column(String, nullable=True)
    deadline = Column(Date, nullable=True)
    status = Column(String, default="Pending", nullable=False)  # Pending, In_Progress, Completed

    # Relationship to meeting
    meeting = relationship("Meeting", back_populates="tasks")
