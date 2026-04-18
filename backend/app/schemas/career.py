from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

# Career prediction schemas
class CareerPredictionRequest(BaseModel):
    current_skills: List[str]
    interests: List[str]
    current_level: str = Field(..., regex="^(beginner|intermediate|advanced|expert)$")
    target_roles: Optional[List[str]] = None

# Response schemas
class CareerPredictionResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    message: str

# Career prediction result schemas
class SuggestedRole(BaseModel):
    title: str
    match_score: float
    description: str
    required_skills: List[str]
    growth_potential: str

class SalaryRange(BaseModel):
    min: int
    max: int
    currency: str = "USD"
    median: Optional[int] = None

class SkillGapAnalysis(BaseModel):
    skill_name: str
    current_level: Optional[int] = None
    required_level: int
    gap_description: str
    learning_priority: str  # "high", "medium", "low"

class RoadmapStep(BaseModel):
    title: str
    description: str
    estimated_time: str
    skills_required: List[str]
    resources: List[str]
    difficulty: str
    prerequisites: List[str]
    completed: bool = False

class CareerInsight(BaseModel):
    type: str  # "strength", "weakness", "opportunity", "trend"
    title: str
    description: str
    actionable: bool
    priority: str  # "high", "medium", "low"

class CareerPredictionResponse(BaseModel):
    suggested_roles: List[SuggestedRole]
    salary_range: SalaryRange
    roadmap: List[RoadmapStep]
    skill_gap_analysis: List[SkillGapAnalysis]
    confidence_score: float
    insights: List[CareerInsight]
    market_trends: Dict[str, Any]
    next_steps: List[str]

# Dashboard schemas
class DashboardStats(BaseModel):
    total_skills: int
    completed_tasks: int
    current_streak: int
    job_readiness_score: float
    weekly_hours: int

class WeeklyProgress(BaseModel):
    date: str
    hours: int
    tasks_completed: int
