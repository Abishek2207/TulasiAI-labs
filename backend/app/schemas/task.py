from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class Task(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    description: Optional[str] = None
    task_type: str = Field(..., regex="^(learning|project|practice|review|certification)$")
    difficulty: Optional[str] = Field(None, regex="^(beginner|intermediate|advanced|expert)$")
    estimated_hours: float = Field(..., ge=0.5, le=24)
    completed: bool
    completed_at: Optional[datetime] = None
    due_date: Optional[datetime] = None
    priority: str = Field(default="medium", regex="^(low|medium|high|urgent)$")
    created_at: datetime
    updated_at: datetime

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    task_type: str = Field(..., regex="^(learning|project|practice|review|certification)$")
    difficulty: Optional[str] = Field(None, regex="^(beginner|intermediate|advanced|expert)$")
    estimated_hours: float = Field(default=1.0, ge=0.5, le=24)
    due_date: Optional[datetime] = None
    priority: str = Field(default="medium", regex="^(low|medium|high|urgent)$")

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    task_type: Optional[str] = Field(None, regex="^(learning|project|practice|review|certification)$")
    difficulty: Optional[str] = Field(None, regex="^(beginner|intermediate|advanced|expert)$")
    estimated_hours: Optional[float] = Field(None, ge=0.5, le=24)
    completed: Optional[bool] = None
    due_date: Optional[datetime] = None
    priority: Optional[str] = Field(None, regex="^(low|medium|high|urgent)$")

class TaskResponse(BaseModel):
    success: bool
    data: Optional[Task] = None
    message: str

class TasksListResponse(BaseModel):
    success: bool
    data: list[Task]
    message: str
