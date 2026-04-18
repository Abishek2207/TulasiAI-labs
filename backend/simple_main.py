from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import jwt
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="TulasiAI Labs API",
    description="AI-powered career growth platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory storage for demo
users_db = {}
next_user_id = 1

SECRET_KEY = os.getenv("SECRET_KEY", "tulasi-ai-labs-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Models
class User(BaseModel):
    id: int
    email: str
    name: str
    current_role: Optional[str] = None
    target_role: Optional[str] = None
    company: Optional[str] = None
    experience_level: Optional[str] = None
    daily_learning_hours: int = 1
    streak_count: int = 0
    last_login: Optional[str] = None
    created_at: str
    updated_at: str

class UserCreate(BaseModel):
    email: str
    name: str
    current_role: Optional[str] = None
    target_role: Optional[str] = None
    company: Optional[str] = None
    experience_level: Optional[str] = None
    daily_learning_hours: int = 1

class LoginRequest(BaseModel):
    email: str
    password: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.get("/")
async def root():
    return JSONResponse({
        "message": "Welcome to TulasiAI Labs API",
        "version": "1.0.0",
        "status": "running"
    })

@app.get("/health")
async def health_check():
    return JSONResponse({
        "status": "healthy",
        "service": "TulasiAI Labs API"
    })

@app.post("/auth/signup")
async def signup(user_data: UserCreate):
    global next_user_id
    
    # Check if user already exists
    for user in users_db.values():
        if user.email == user_data.email:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    now = datetime.datetime.utcnow().isoformat()
    new_user = User(
        id=next_user_id,
        email=user_data.email,
        name=user_data.name,
        current_role=user_data.current_role,
        target_role=user_data.target_role,
        company=user_data.company,
        experience_level=user_data.experience_level,
        daily_learning_hours=user_data.daily_learning_hours,
        created_at=now,
        updated_at=now
    )
    
    users_db[next_user_id] = new_user
    next_user_id += 1
    
    # Create access token
    access_token = create_access_token(data={"sub": user_data.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@app.post("/auth/login")
async def login(login_data: LoginRequest):
    # Find user by email
    user = None
    for u in users_db.values():
        if u.email == login_data.email:
            user = u
            break
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Update last login
    user.last_login = datetime.datetime.utcnow().isoformat()
    
    # Create access token
    access_token = create_access_token(data={"sub": login_data.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.get("/auth/me")
async def get_current_user():
    # For demo purposes, return first user
    if users_db:
        return list(users_db.values())[0]
    raise HTTPException(status_code=404, detail="User not found")

# Career prediction endpoint
class CareerPredictionRequest(BaseModel):
    current_skills: List[str]
    interests: List[str]
    current_level: str
    target_roles: Optional[List[str]] = None

@app.post("/career/predict")
async def predict_career(request: CareerPredictionRequest):
    # Mock career prediction
    suggested_roles = ["Full Stack Developer", "Data Scientist", "Machine Learning Engineer"]
    
    return {
        "suggested_roles": suggested_roles,
        "salary_range": {
            "min": 80000,
            "max": 150000,
            "currency": "USD"
        },
        "roadmap": [
            {
                "title": "Build Foundation",
                "description": "Master programming fundamentals",
                "estimated_time": "2-3 months",
                "skills_required": ["Python", "JavaScript"],
                "resources": ["Coursera", "FreeCodeCamp"]
            },
            {
                "title": "Specialize",
                "description": f"Focus on {suggested_roles[0]} skills",
                "estimated_time": "3-4 months",
                "skills_required": ["Advanced " + skill for skill in request.current_skills[:2]],
                "resources": ["Udemy", "LinkedIn Learning"]
            }
        ],
        "confidence_score": 0.85,
        "insights": [
            f"You have {len(request.current_skills)} relevant skills",
            "Your experience level suggests good career prospects",
            "Focus on building practical projects"
        ]
    }

@app.get("/career/dashboard-stats")
async def get_dashboard_stats():
    return {
        "total_skills": 12,
        "completed_tasks": 28,
        "current_streak": 7,
        "job_readiness_score": 75.5,
        "weekly_hours": 14
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("simple_main:app", host="0.0.0.0", port=8000, reload=True)
