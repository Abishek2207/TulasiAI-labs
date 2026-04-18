from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

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

# --- Endpoints ---

@router.post("/auth/onboard")
async def onboard_user(request: OnboardingRequest):
    # Simulated Supabase DB Insertion
    return {"status": "success", "message": "Profile initialized with predictive baseline.", "data": request.dict()}

@router.get("/user/profile")
async def get_profile(user_id: str):
    # Simulated fetch from "users" table
    return {
        "id": user_id,
        "name": "Tulasi User",
        "role": "professional",
        "experience": "3-5",
        "current_role": "Software Engineer",
        "target_role": "AI Architect",
        "company": "Tech Corp",
        "skills": ["JavaScript", "React", "Node.js"]
    }

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

@router.get("/roadmap/professional")
async def get_professional_roadmap(user_id: str):
    return {
        "user_id": user_id,
        "current_salary_band": "$125,000",
        "predicted_growth": "+45%",
        "tracks": [
            {
                "title": "AI/ML Engineer",
                "salary_us": "$150K-$220K",
                "salary_india": "₹30-60 LPA",
                "growth": "+55%",
                "skills": ["PyTorch", "LLM Fine-tuning", "Transformers"],
                "fit": 88,
                "timeline": "6-12 months"
            },
            {
                "title": "Cloud Architect",
                "salary_us": "$140K-$210K",
                "salary_india": "₹28-55 LPA",
                "growth": "+35%",
                "skills": ["Kubernetes", "AWS Solutions", "Terraform"],
                "fit": 75,
                "timeline": "1-2 years"
            }
        ]
    }

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
async def update_progress(update: ProgressUpdate):
    # Simulated DB Update
    return {"status": "success", "streak_updated": True, "data": update.dict()}
