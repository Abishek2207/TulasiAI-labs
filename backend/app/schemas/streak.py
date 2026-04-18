from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date
from uuid import UUID

class Streak(BaseModel):
    id: UUID
    user_id: UUID
    current_streak: int = Field(..., ge=0)
    longest_streak: int = Field(..., ge=0)
    last_active_date: Optional[datetime] = None
    total_active_days: int = Field(..., ge=0)
    created_at: datetime
    updated_at: datetime

class StreakCreate(BaseModel):
    user_id: UUID
    current_streak: int = Field(default=0, ge=0)
    longest_streak: int = Field(default=0, ge=0)
    total_active_days: int = Field(default=0, ge=0)

class StreakUpdate(BaseModel):
    current_streak: Optional[int] = Field(None, ge=0)
    longest_streak: Optional[int] = Field(None, ge=0)
    total_active_days: Optional[int] = Field(None, ge=0)

class StreakResponse(BaseModel):
    success: bool
    data: Optional[Streak] = None
    message: str

class StreakCalculation(BaseModel):
    current_streak: int
    longest_streak: int
    total_active_days: int
    last_active_date: Optional[date]
    streak_status: str  # "active", "broken", "new"
