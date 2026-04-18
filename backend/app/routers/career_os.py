from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import UUID

from app.database import get_async_db
from app.services.profile_service import ProfileService
from app.services.career_service import CareerService
from app.services.roadmap_service import RoadmapService
from app.schemas.career import CareerPredictionRequest

router = APIRouter()

# --- Schemas ---

class OnboardingRequest(BaseModel):
    user_id: str
    career_stage: str
    is_employed: str
    experience_years: str
    domain: str
    target_role: str
    organization: str
    current_skills: str

class ProgressUpdate(BaseModel):
    user_id: str
    day: int
    completed: bool
    time_spent: int # minutes

class DailyPlanRequest(BaseModel):
    user_id: UUID
    day: int
    duration: int

# --- Endpoints ---

@router.post("/auth/onboard")
async def onboard_user(request: ProfileCreate, db: AsyncSession = Depends(get_async_db)):
    service = ProfileService(db)
    try:
        profile = await service.add_user_profile(request)
        return {"success": True, "message": "Profile initialized with predictive baseline.", "data": profile}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/profile")
async def get_profile(user_id: UUID, db: AsyncSession = Depends(get_async_db)):
    service = ProfileService(db)
    try:
        profile = await service.get_user_profile(user_id)
        return {"success": True, "data": profile}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/career/prediction")
async def get_career_prediction(user_id: UUID, db: AsyncSession = Depends(get_async_db)):
    service = CareerService(db)
    try:
        # For now we create a default request or fetch existing
        request = CareerPredictionRequest(current_skills=[], interests=[], current_level="intermediate")
        prediction = await service.predict_career(user_id, request)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/roadmap/student")
async def get_student_roadmap(user_id: str):
    return {
        "user_id": user_id,
        "phase": "Foundation & Placements",
        "schedule_flexibility": [1, 2, 3],
        "days": [
            {"day": 1, "title": "Memory Layouts & Pointers", "topics": {"DSA": ["Pointers", "Memory"], "Aptitude": ["Number Systems"], "Core": ["OS Basics"]}, "progress": 100, "locked": False},
            {"day": 2, "title": "Arrays & Hashing Engines", "topics": {"DSA": ["Sliding Window", "Hash Maps"], "Aptitude": ["Permutation & Combination"], "Core": ["Database Normalization"]}, "progress": 45, "locked": False},
            {"day": 3, "title": "Graph Disconnects", "topics": {"DSA": ["BFS", "DFS"], "Aptitude": ["Probability"], "Core": ["Networking Models"]}, "progress": 0, "locked": True},
            {"day": 4, "title": "Mock Technical Interview", "topics": {"DSA": ["System Design Basics"], "Aptitude": ["Logical Deductions"], "Core": ["Mock Scenarios"]}, "progress": 0, "locked": True}
        ]
    }

@router.post("/roadmap/daily")
async def get_daily_plan(request: DailyPlanRequest, db: AsyncSession = Depends(get_async_db)):
    service = RoadmapService(db)
    try:
        plan = await service.get_daily_plan(request.user_id, request.day, request.duration)
        return {"success": True, "data": plan}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/skills/recommend")
async def recommend_skills(user_id: str):
    # Live Simulated Skill Triage mapping to external certs
    return [
        {"skill": "Generative AI Architect", "demand": "Critical", "growth": 82, "category": "AI/ML"},
        {"skill": "Cloud Native Orchestration", "demand": "High", "growth": 45, "category": "Cloud"},
        {"skill": "Data Engineering pipelines", "demand": "High", "growth": 42, "category": "Data"},
        {"skill": "LLMOps & Red Teaming", "demand": "Surging", "growth": 120, "category": "Security"}
    ]

@router.get("/certifications")
async def get_certifications():
    return [
        {"title": "Microsoft Certified: Azure AI Engineer", "issuer": "Microsoft Learn", "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer", "badge": "🔷", "salaryBoost": "+30%"},
        {"title": "Google Cloud Professional ML Engineer", "issuer": "Google", "url": "https://cloud.google.com/learn/certification/machine-learning-engineer", "badge": "🤖", "salaryBoost": "+35%"},
        {"title": "AWS Certified Machine Learning – Specialty", "issuer": "AWS", "url": "https://aws.amazon.com/certification/certified-machine-learning-specialty/", "badge": "🚀", "salaryBoost": "+32%"}
    ]

@router.get("/notifications")
async def get_notifications(user_id: str):
    return [
        {"id": "n1", "type": "alert", "message": "Automation Risk Detected: Basic frontend tasks have a 60% probability of disruption in 3 years. Transition to Full-stack AI suggested.", "read": False, "created_at": str(datetime.now())},
        {"id": "n2", "type": "trend", "message": "Market Surge: Demand for 'RAG Architect' profiles just increased 15% this month.", "read": True, "created_at": str(datetime.now())}
    ]

@router.post("/progress/update")
async def update_progress(update: ProgressUpdate, db: AsyncSession = Depends(get_async_db)):
    # In a real scenario, this would call the StreakService
    return {"status": "success", "streak_updated": True, "data": update.dict()}
