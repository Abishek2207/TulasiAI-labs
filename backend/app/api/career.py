from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import random
from datetime import datetime

from app.database import get_db
from app.models.career import User, UserSkill, Skill, Task, CareerPrediction
from app.schemas.career import (
    CareerPredictionRequest, 
    CareerPredictionResponse,
    SalaryRange,
    RoadmapStep,
    DashboardStats,
    WeeklyProgress
)
from app.api.auth import get_current_user

router = APIRouter(prefix="/career", tags=["career"])

# Mock data for career predictions
CAREER_ROLES = [
    "Full Stack Developer", "Data Scientist", "Machine Learning Engineer",
    "DevOps Engineer", "Cloud Architect", "Product Manager",
    "UX Designer", "Frontend Developer", "Backend Engineer",
    "AI Research Engineer", "Blockchain Developer", "Cybersecurity Analyst"
]

SKILL_MAPPINGS = {
    "python": ["Full Stack Developer", "Data Scientist", "Machine Learning Engineer", "Backend Engineer"],
    "javascript": ["Full Stack Developer", "Frontend Developer", "UX Designer"],
    "react": ["Frontend Developer", "Full Stack Developer"],
    "aws": ["Cloud Architect", "DevOps Engineer"],
    "docker": ["DevOps Engineer", "Cloud Architect"],
    "sql": ["Data Scientist", "Backend Engineer", "Full Stack Developer"],
    "machine learning": ["Machine Learning Engineer", "AI Research Engineer", "Data Scientist"],
    "tensorflow": ["Machine Learning Engineer", "AI Research Engineer"],
    "nodejs": ["Full Stack Developer", "Backend Engineer"],
    "typescript": ["Frontend Developer", "Full Stack Developer"]
}

@router.post("/predict", response_model=CareerPredictionResponse)
async def predict_career(
    request: CareerPredictionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Analyze skills and suggest careers
    suggested_roles = []
    skill_matches = {}
    
    for skill in request.current_skills:
        skill_lower = skill.lower()
        if skill_lower in SKILL_MAPPINGS:
            for role in SKILL_MAPPINGS[skill_lower]:
                skill_matches[role] = skill_matches.get(role, 0) + 1
    
    # Get top matching roles
    sorted_roles = sorted(skill_matches.items(), key=lambda x: x[1], reverse=True)
    suggested_roles = [role for role, _ in sorted_roles[:3]]
    
    # If no matches, suggest based on experience level
    if not suggested_roles:
        if request.current_level == "beginner":
            suggested_roles = ["Junior Frontend Developer", "Junior Backend Developer", "Junior Data Analyst"]
        elif request.current_level == "intermediate":
            suggested_roles = ["Full Stack Developer", "Data Scientist", "DevOps Engineer"]
        else:
            suggested_roles = ["Senior Full Stack Developer", "Machine Learning Engineer", "Cloud Architect"]
    
    # Generate salary range based on role and level
    base_salary = {
        "beginner": (60000, 90000),
        "intermediate": (90000, 140000),
        "advanced": (140000, 200000)
    }
    
    salary_min, salary_max = base_salary.get(request.current_level, (60000, 90000))
    salary_range = SalaryRange(
        min=salary_min + random.randint(-10000, 10000),
        max=salary_max + random.randint(-10000, 10000),
        currency="USD"
    )
    
    # Generate roadmap
    roadmap = []
    if request.current_level == "beginner":
        roadmap = [
            RoadmapStep(
                title="Build Foundation",
                description="Master programming fundamentals and data structures",
                estimated_time="2-3 months",
                skills_required=request.current_skills[:2] if len(request.current_skills) >= 2 else ["Python", "JavaScript"],
                resources=["Coursera Programming Fundamentals", "FreeCodeCamp"]
            ),
            RoadmapStep(
                title="Specialize",
                description=f"Focus on {suggested_roles[0] if suggested_roles else 'Software Development'} skills",
                estimated_time="3-4 months",
                skills_required=["Advanced " + skill for skill in request.current_skills[:2]],
                resources=["Udemy Advanced Courses", "LinkedIn Learning"]
            ),
            RoadmapStep(
                title="Build Portfolio",
                description="Create 3-5 projects showcasing your skills",
                estimated_time="2-3 months",
                skills_required=request.current_skills,
                resources=["GitHub", "Portfolio Templates"]
            )
        ]
    else:
        roadmap = [
            RoadmapStep(
                title="Advanced Skills",
                description="Master advanced concepts and frameworks",
                estimated_time="3-4 months",
                skills_required=["Advanced " + skill for skill in request.current_skills[:3]],
                resources=["Advanced Courses", "Documentation"]
            ),
            RoadmapStep(
                title="System Design",
                description="Learn to design scalable systems",
                estimated_time="2-3 months",
                skills_required=["System Design", "Architecture"],
                resources=["System Design Primer", "Grokking System Design"]
            )
        ]
    
    # Calculate confidence score
    confidence_score = min(0.95, 0.4 + (len(request.current_skills) * 0.1) + (len(request.interests) * 0.05))
    
    # Generate insights
    insights = [
        f"You have {len(request.current_skills)} relevant skills for {suggested_roles[0] if suggested_roles else 'tech roles'}",
        f"Your experience level suggests a {salary_min/1000:.0f}k-{salary_max/1000:.0f}k salary range",
        "Focus on building projects to demonstrate practical skills",
        "Consider networking with professionals in your target role"
    ]
    
    # Save prediction to database
    prediction = CareerPrediction(
        user_id=current_user.id,
        current_skills=request.current_skills,
        target_roles=suggested_roles,
        salary_range={"min": salary_range.min, "max": salary_range.max, "currency": salary_range.currency},
        roadmap=[step.dict() for step in roadmap],
        confidence_score=confidence_score
    )
    db.add(prediction)
    db.commit()
    
    return CareerPredictionResponse(
        suggested_roles=suggested_roles,
        salary_range=salary_range,
        roadmap=roadmap,
        confidence_score=confidence_score,
        insights=insights
    )

@router.get("/dashboard-stats", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get user's skills count
    skills_count = db.query(UserSkill).filter(UserSkill.user_id == current_user.id).count()
    
    # Get completed tasks count
    completed_tasks = db.query(Task).filter(
        Task.user_id == current_user.id,
        Task.completed == True
    ).count()
    
    # Get current streak (from user table)
    current_streak = current_user.streak_count
    
    # Calculate job readiness score
    job_readiness_score = calculate_job_readiness_score(current_user, db)
    
    # Get weekly hours (mock data for now)
    weekly_hours = current_user.daily_learning_hours * 7
    
    return DashboardStats(
        total_skills=skills_count,
        completed_tasks=completed_tasks,
        current_streak=current_streak,
        job_readiness_score=job_readiness_score,
        weekly_hours=weekly_hours
    )

@router.get("/weekly-progress", response_model=List[WeeklyProgress])
async def get_weekly_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Mock weekly progress data
    weekly_data = []
    for i in range(7):
        date = datetime.now().strftime("%Y-%m-%d")
        weekly_data.append(WeeklyProgress(
            date=date,
            hours=random.randint(1, current_user.daily_learning_hours + 1),
            tasks_completed=random.randint(0, 3)
        ))
    
    return weekly_data

def calculate_job_readiness_score(user: User, db: Session) -> float:
    """Calculate job readiness score based on various factors"""
    score = 0.0
    
    # Skills completeness (40%)
    skills_count = db.query(UserSkill).filter(UserSkill.user_id == user.id).count()
    skills_score = min(40, skills_count * 5)  # 5 points per skill, max 40
    score += skills_score
    
    # Consistency/streak (30%)
    streak_score = min(30, user.streak_count * 2)  # 2 points per streak day, max 30
    score += streak_score
    
    # Certifications (20%)
    # This would be calculated based on actual certifications
    cert_score = 10  # Mock score
    score += cert_score
    
    # Experience level (10%)
    experience_scores = {"beginner": 5, "intermediate": 8, "advanced": 10}
    experience_score = experience_scores.get(user.experience_level, 5)
    score += experience_score
    
    return min(100, score)
