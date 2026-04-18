from sqlalchemy import Column, String, Integer, DateTime, Text, DECIMAL, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.database import Base


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, unique=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    experience_level = Column(String(20), nullable=False, index=True)  # beginner, intermediate, advanced, expert
    current_role = Column(String(255), nullable=True)
    target_role = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    daily_learning_hours = Column(Integer, default=1, nullable=False)
    job_readiness_score = Column(DECIMAL(5, 2), default=0.00, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<Profile(id={self.id}, name={self.name}, email={self.email})>"
