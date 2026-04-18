from sqlalchemy import Column, String, Integer, DateTime, Text, DECIMAL, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    task_type = Column(String(50), nullable=False, index=True)  # learning, project, practice, review, certification
    difficulty = Column(String(20), nullable=True)  # beginner, intermediate, advanced, expert
    estimated_hours = Column(DECIMAL(4, 2), default=1.00, nullable=False)
    completed = Column(Boolean, default=False, nullable=False, index=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    due_date = Column(DateTime(timezone=True), nullable=True, index=True)
    priority = Column(String(20), default="medium", nullable=False)  # low, medium, high, urgent
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationship
    profile = relationship("Profile", backref="tasks")

    def __repr__(self):
        return f"<Task(id={self.id}, title={self.title}, completed={self.completed})>"
