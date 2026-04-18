from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class Profile(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    email: str
    experience_level: str = Field(..., pattern="^(beginner|intermediate|advanced|expert)$")
    current_role: Optional[str] = None
    target_role: Optional[str] = None
    company: Optional[str] = None
    industry: Optional[str] = None
    salary_range: Optional[str] = None
    career_goal: Optional[str] = None
    daily_learning_hours: int = Field(default=1, ge=1, le=24, description="Daily learning hours (1-24)")
    job_readiness_score: float = Field(default=0.0, ge=0, le=100)
    created_at: datetime
    updated_at: datetime

class ProfileCreate(BaseModel):
    user_id: UUID
    name: str = Field(..., min_length=2, max_length=255)
    email: str = Field(..., min_length=5, max_length=255)
    experience_level: str = Field(..., pattern="^(beginner|intermediate|advanced|expert)$")
    current_role: Optional[str] = Field(None, max_length=255)
    target_role: Optional[str] = Field(None, max_length=255)
    company: Optional[str] = Field(None, max_length=255)
    industry: Optional[str] = Field(None, max_length=255)
    salary_range: Optional[str] = Field(None, max_length=100)
    career_goal: Optional[str] = None
    daily_learning_hours: int = Field(default=1, ge=1, le=24)

class ProfileUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    experience_level: Optional[str] = Field(None, pattern="^(beginner|intermediate|advanced|expert)$")
    current_role: Optional[str] = Field(None, max_length=255)
    target_role: Optional[str] = Field(None, max_length=255)
    company: Optional[str] = Field(None, max_length=255)
    industry: Optional[str] = Field(None, max_length=255)
    salary_range: Optional[str] = Field(None, max_length=100)
    career_goal: Optional[str] = None
    daily_learning_hours: Optional[int] = Field(None, ge=1, le=24)

# Response schemas
class ProfileResponse(BaseModel):
    success: bool
    data: Optional[Profile] = None
    message: str

class ProfileStats(BaseModel):
    total_skills: int
    skills_by_category: Dict[str, int]
    average_skill_level: float
    current_streak: int
    total_learning_hours: float
    job_readiness_score: float
    completed_tasks: int
    certifications: int
    weekly_progress: Dict[str, Any]

class ProfileStatsResponse(BaseModel):
    success: bool
    data: ProfileStats
    message: str
