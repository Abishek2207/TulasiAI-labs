from sqlalchemy import Column, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), nullable=False, index=True)  # achievement, task_reminder, career_insight, skill_level_up, task_completed, streak_milestone, certification_added
    is_read = Column(Boolean, default=False, nullable=False, index=True)
    metadata = Column(JSONB, nullable=True)
    priority = Column(String(20), default="medium", nullable=False)  # low, medium, high
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    read_at = Column(DateTime(timezone=True), nullable=True)

    # Relationship
    profile = relationship("Profile", backref="notifications")

    def __repr__(self):
        return f"<Notification(id={self.id}, title={self.title}, is_read={self.is_read})>"
