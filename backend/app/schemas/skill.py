from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class Skill(BaseModel):
    id: UUID
    user_id: UUID
    skill_name: str
    level: str = Field(..., regex="^(beginner|intermediate|advanced|expert)$")
    proficiency_level: int = Field(..., ge=1, le=10)
    hours_practiced: float = Field(..., ge=0)
    category: str = Field(..., regex="^(Frontend|Backend|AI/ML|DevOps|Cloud|Mobile|Database|Other)$")
    last_practiced: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

class SkillCreate(BaseModel):
    skill_name: str = Field(..., min_length=2, max_length=255)
    level: str = Field(..., regex="^(beginner|intermediate|advanced|expert)$")
    proficiency_level: int = Field(default=1, ge=1, le=10)
    hours_practiced: float = Field(default=0.0, ge=0)
    category: str = Field(..., regex="^(Frontend|Backend|AI/ML|DevOps|Cloud|Mobile|Database|Other)$")

class SkillUpdate(BaseModel):
    skill_name: Optional[str] = Field(None, min_length=2, max_length=255)
    level: Optional[str] = Field(None, regex="^(beginner|intermediate|advanced|expert)$")
    proficiency_level: Optional[int] = Field(None, ge=1, le=10)
    hours_practiced: Optional[float] = Field(None, ge=0)
    category: Optional[str] = Field(None, regex="^(Frontend|Backend|AI/ML|DevOps|Cloud|Mobile|Database|Other)$")

class SkillResponse(BaseModel):
    success: bool
    data: Optional[Skill] = None
    message: str

class SkillsListResponse(BaseModel):
    success: bool
    data: list[Skill]
    message: str
