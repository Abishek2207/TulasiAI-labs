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
    role: Optional[str] = None
    experience: Optional[str] = None
    company: Optional[str] = None
    goal: Optional[str] = None

class DailyPlanRequest(BaseModel):
    role: str
    experience: str
    day: int
    duration: int  # 1, 2, or 3 hours

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

def generate_professional_insights(role: str, experience: str, skills: List[str], company: Optional[str] = None, goal: Optional[str] = None) -> dict:
    """
    Simulates the 'Master Prompt' execution for career strategy.
    Returns structured results as requested in the vision.
    """
    # 1. Layoff Risk Calculation
    has_ai_skills = any(s.lower() in ["ai", "ml", "llm", "generative ai", "openai"] for s in skills)
    risk_level = "Low" if has_ai_skills else "Medium"
    risk_reason = "Strong relevance in current market due to AI adoption." if has_ai_skills else "Lack of GenAI integration in current tech stack increases redundancy risk."
    
    if company and company.lower() in ["google", "meta", "amazon", "microsoft"]:
        risk_level = "Low"
        risk_reason = "Stable tier-1 placement, but continuous skill evolution is expected."

    # 2. Market Demand Score
    demand_score = 85 if has_ai_skills else 65

    # 3. Skill Gap Analysis
    trending = ["LLM Orchestration", "System Design", "Cloud Native (K8s)", "Vector Databases", "Prompt Engineering"]
    skill_gaps = [s for s in trending if s not in skills][:5]

    # 4. Salary Growth Strategy (₹ LPA)
    base_salaries = {"0-1": 6, "1-3": 12, "3-5": 22, "5-10": 40, "10+": 65}
    current_est = base_salaries.get(experience, 22)
    target_est = current_est * 1.5

    return {
        "layoff_risk": {"level": risk_level, "reason": risk_reason},
        "market_demand_score": demand_score,
        "skill_gaps": skill_gaps,
        "recommended_path": f"Focus on transitioning to {goal or 'Senior/Lead'} role by mastering distributed systems and AI integration within 6 months.",
        "salary_growth_strategy": f"Your target compensation: ₹{current_est}L → ₹{target_est}L. Strategy: Switch to product-heavy startups or FAANG with specialized AI certifications.",
        "ai_skills_to_learn": ["Claude/OpenAI APIs", "LangChain", "Vector DBs (Pinecone/Weaviate)"],
        "daily_learning_plan_preview": [
            {"day": 1, "topic": "AI-Agentic Workflows"},
            {"day": 2, "topic": "Retrieval Augmented Generation (RAG)"},
            {"day": 3, "topic": "Fine-tuning Foundations"}
        ]
    }

def generate_daily_plan_content(day: int, role: str, experience: str, duration: int) -> dict:
    """
    Simulates the 'Daily Plan Generator' prompt.
    """
    return {
        "day": day,
        "role": role,
        "duration": f"{duration} hours",
        "concept": "Adaptive Scaling in Distributed Systems." if day == 1 else "Optimizing LLM inference costs.",
        "task": "Implement a load balancer that prioritizes critical traffic." if day == 1 else "Benchmark various LLM endpoints for latency.",
        "real_world_application": "Handling million-user traffic bursts during black friday sales." if day == 1 else "Reducing API costs for a customer support chatbot.",
        "ai_tool_usage": "Use GPT-4 to generate terraform scripts and check for security flaws.",
        "communication_task": "Write a weekly sync email to Stakeholders explaining the scaling improvements." if day == 1 else "Explain LLM latency vs cost tradeoffs to the Product Manager."
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
                skills=request.skills or [],
                company=request.company,
                goal=None # Can be added to request schema if needed
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

@app.post("/generate-daily-plan")
async def generate_daily_plan(request: DailyPlanRequest):
    """
    Endpoint for the Daily Adaptive Path generator.
    """
    try:
        plan = generate_daily_plan_content(
            day=request.day,
            role=request.role,
            experience=request.experience,
            duration=request.duration
        )
        return JSONResponse({
            "success": True,
            "data": plan
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
