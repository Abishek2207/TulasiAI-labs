from sqlalchemy import Column, String, DateTime, ForeignKey, DECIMAL
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.database import Base


class CareerPrediction(Base):
    __tablename__ = "career_predictions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    suggested_roles = Column(JSONB, nullable=False)
    salary_range = Column(JSONB, nullable=False)
    confidence_score = Column(DECIMAL(3, 2), nullable=False, index=True)
    skill_gap_analysis = Column(JSONB, nullable=True)
    insights = Column(JSONB, nullable=True)
    roadmap = Column(JSONB, nullable=True)
    market_trends = Column(JSONB, nullable=True)
    prediction_version = Column(String(20), default="1.0", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)

    # Relationship
    profile = relationship("Profile", backref="career_predictions")

    def __repr__(self):
        return f"<CareerPrediction(id={self.id}, confidence_score={self.confidence_score})>"
