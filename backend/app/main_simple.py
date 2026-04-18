from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv

load_dotenv()

# ─── App Init ─────────────────────────────────────────────────────────────────

app = FastAPI(
    title="TulasiAI Labs API",
    description="AI-powered career growth platform – FastAPI backend",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ─── CORS ─────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Allow all for dev; restrict to vercel URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Schemas ──────────────────────────────────────────────────────────────────

class RoadmapRequest(BaseModel):
    user_type: str                # "student" | "professional"
    current_role: Optional[str] = None
    company: Optional[str] = None
    experience: Optional[str] = None
    skills: Optional[List[str]] = []
    daily_hours: Optional[int] = 2

class CareerPredictRequest(BaseModel):
    current_skills: Optional[List[str]] = []
    interests: Optional[List[str]] = []
    current_level: Optional[str] = "intermediate"

# ─── Helpers ──────────────────────────────────────────────────────────────────

def generate_student_roadmap(daily_hours: int) -> dict:
    """Generate a student placement roadmap adjusted by daily hours."""
    base_topics = {
        "DSA": ["Arrays", "Strings", "Linked Lists", "Stacks & Queues", "Trees", "Graphs", "DP", "Sorting"],
        "Aptitude": ["Number Systems", "Percentages", "Time & Work", "Probability", "Logical Reasoning"],
        "Core": ["OOPs", "DBMS", "OS Concepts", "Computer Networks", "SQL"]
    }
    
    # Adjust topic count based on hours
    daily_map = {1: 2, 2: 3, 3: 4}
    topics_per_session = daily_map.get(daily_hours, 3)
    
    days = []
    for i in range(1, 31):
        day = {
            "day": i,
            "title": f"Day {i}: Placement Preparation",
            "DSA": base_topics["DSA"][:min(topics_per_session, len(base_topics["DSA"]))],
            "Aptitude": base_topics["Aptitude"][:min(2, len(base_topics["Aptitude"]))],
            "Core": base_topics["Core"][:min(2, len(base_topics["Core"]))],
            "completed": False,
            "estimated_hours": daily_hours,
        }
        days.append(day)
    
    return {"days": days[:10], "total_days": 30}

def generate_professional_insights(role: str, experience: str, skills: List[str]) -> dict:
    """Generate AI career insights for professionals (rule-based)."""
    
    # Skill gap analysis
    trending = ["Machine Learning", "Cloud Architecture", "Kubernetes", "GenAI", "DevOps", "Data Engineering"]
    missing = [s for s in trending if s not in skills]
    recommended = missing[:4] if missing else trending[:4]
    
    # Salary based on experience
    salary_map = {
        "0-1":  ("₹4-8 LPA",   "+45% in 2 years with upskilling"),
        "1-3":  ("₹8-18 LPA",  "+35% in 18 months with cloud certs"),
        "3-5":  ("₹18-32 LPA", "+30% in 12 months with leadership skills"),
        "5-10": ("₹30-55 LPA", "+40% by transitioning to lead/architect"),
        "10+":  ("₹50-80 LPA", "+25% by targeting FAANG or startups"),
    }
    current_salary, growth_path = salary_map.get(experience or "3-5", ("₹15-30 LPA", "+30% potential"))
    
    # Career path based on role + experience
    if experience and experience in ["5-10", "10+"]:
        career_path = "You're positioned for Senior Engineering, Tech Lead, or Engineering Manager roles. Focus on system design and team leadership."
    elif experience and experience in ["3-5"]:
        career_path = "Strong mid-career position. Cloud + AI skill additions will accelerate you to senior roles within 12-18 months."
    else:
        career_path = "Build a solid foundation with certifications. 1-3 years of consistent learning will open premium tech opportunities."
    
    # Action items
    action_items = [
        "Get AWS/GCP cloud certification (3-4 months, high ROI)",
        "Build 2-3 GenAI projects and publish on GitHub",
        f"Practice system design weekly (for {'lead' if experience in ['5-10','10+'] else 'senior'} level interviews)",
        "Contribute to open source to build industry credibility",
        "Apply strategically to FAANG or top product companies"
    ]
    
    return {
        "recommended_skills": recommended,
        "career_path": career_path,
        "salary_growth": f"{current_salary} → {growth_path}",
        "summary": f"Your profile shows strong potential. With {experience or '3-5'} years of experience in {role or 'tech'}, you are well-positioned for growth. Adding AI/ML and cloud skills will maximize your market value in 2025.",
        "action_items": action_items,
        "market_trends": {
            "hot_skills": [
                {"skill": "Generative AI / LLMs", "growth": "+78%", "demand": "Very High"},
                {"skill": "Cloud Architecture", "growth": "+45%", "demand": "Very High"},
                {"skill": "Kubernetes / DevOps", "growth": "+38%", "demand": "High"},
            ]
        }
    }

# ─── Health Endpoints ───────────────────────────────────────────────────────

@app.get("/")
async def root():
    return JSONResponse({
        "message": "Welcome to TulasiAI Labs API",
        "version": "2.0.0",
        "status": "running",
        "docs": "/docs",
    })

@app.get("/health")
async def health():
    return JSONResponse({"status": "healthy", "service": "TulasiAI Labs API"})

# ─── Roadmap / AI Endpoint ──────────────────────────────────────────────────

@app.post("/generate-roadmap")
async def generate_roadmap(request: RoadmapRequest):
    """
    Core AI endpoint – generates personalized roadmap or career insights.
    
    For students: returns daily roadmap
    For professionals: returns career insights, skill recommendations, salary data
    """
    try:
        if request.user_type == "student":
            roadmap_data = generate_student_roadmap(request.daily_hours or 2)
            return JSONResponse({
                "success": True,
                "data": {
                    "user_type": "student",
                    "roadmap": roadmap_data,
                    "next_skills": ["Arrays", "Recursion", "OOPs Concepts"],
                    "suggested_learning_plan": f"{request.daily_hours or 2}hr/day → 30-day placement prep"
                }
            })
        
        elif request.user_type == "professional":
            insights = generate_professional_insights(
                role=request.current_role or "",
                experience=request.experience or "3-5",
                skills=request.skills or []
            )
            return JSONResponse({
                "success": True,
                "data": insights
            })
        
        else:
            raise HTTPException(status_code=400, detail="user_type must be 'student' or 'professional'")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


# ─── Legacy Mock Endpoints (backwards compatibility) ────────────────────────

@app.post("/api/v1/auth/login")
async def login(creds: dict):
    if creds.get("email") == "demo@tulasi.ai" and creds.get("password") == "demo123":
        return {"success": True, "data": {"access_token": "mock-token", "user": {"id": 1, "email": "demo@tulasi.ai", "name": "Demo User"}}}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/v1/profile/me")
async def get_profile():
    return {"success": True, "data": {
        "id": 1, "email": "demo@tulasi.ai", "name": "Demo User",
        "current_role": "Software Engineer", "company": "TulasiAI",
        "streak_count": 12, "job_readiness_score": 78.5
    }}

@app.get("/api/v1/skills")
async def get_skills():
    return {"success": True, "data": [
        {"id": 1, "name": "JavaScript", "category": "Frontend", "level": 85},
        {"id": 2, "name": "Python", "category": "Backend", "level": 72},
        {"id": 3, "name": "React", "category": "Frontend", "level": 68},
    ]}

@app.get("/api/v1/notifications/")
async def get_notifs():
    return {"success": True, "data": [
        {"id": 1, "title": "🔥 Streak Update!", "message": "Keep your streak going today!", "is_read": False, "created_at": "2025-04-18T10:00:00Z"},
        {"id": 2, "title": "📈 Trending: AI Skills", "message": "Machine Learning demand up 45%", "is_read": False, "created_at": "2025-04-18T09:00:00Z"},
        {"id": 3, "title": "🏆 Badge Earned!", "message": "You earned the Week Warrior badge", "is_read": True, "created_at": "2025-04-17T12:00:00Z"},
    ]}

@app.post("/api/v1/predict-career/")
async def predict_career(req: CareerPredictRequest):
    insights = generate_professional_insights("Software Engineer", "3-5", req.current_skills or [])
    return {"success": True, "data": insights}

@app.get("/api/v1/dashboard/stats")
async def dashboard_stats():
    return {"success": True, "data": {
        "total_skills": 24, "completed_tasks": 47, "current_streak": 12,
        "job_readiness_score": 78.5, "weekly_hours": 14
    }}

# ─── Entry Point ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run("app.main_simple:app", host="0.0.0.0", port=8000, reload=True, log_level="info")
