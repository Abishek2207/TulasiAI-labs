from sqlalchemy import Column, String, Integer, DateTime, Text, DECIMAL, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.database import Base


class Skill(Base):
    __tablename__ = "skills"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_name = Column(String(255), nullable=False, index=True)
    level = Column(String(20), nullable=False, index=True)  # beginner, intermediate, advanced, expert
    proficiency_level = Column(Integer, default=1, nullable=False)  # 1-10 scale
    hours_practiced = Column(DECIMAL(8, 2), default=0.00, nullable=False)
    category = Column(String(50), nullable=False, index=True)  # Frontend, Backend, AI/ML, DevOps, Cloud, Mobile, Database, Other
    last_practiced = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationship
    profile = relationship("Profile", backref="skills")

    def __repr__(self):
        return f"<Skill(id={self.id}, name={self.skill_name}, level={self.level})>"
