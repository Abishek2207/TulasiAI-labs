from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database import get_db
from app.models.user import User
from app.schemas.career import (
    CareerPredictionRequest, 
    CareerPredictionResponse, 
    SuggestedRole,
    SalaryRange,
    RoadmapStep,
    SkillGapAnalysis,
    CareerInsight
)
from app.core.security import get_current_user
from app.services.ai_service import AIService

router = APIRouter()

@router.post("/", response_model=CareerPredictionResponse)
async def predict_career_path(
    request: CareerPredictionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate AI-powered career prediction based on user's skills, interests, and experience
    """
    try:
        ai_service = AIService(db)
        prediction = await ai_service.predict_career(
            user_id=current_user.id,
            current_skills=request.current_skills,
            interests=request.interests,
            current_level=request.current_level,
            target_roles=request.target_roles
        )
        
        return CareerPredictionResponse(
            success=True,
            data=prediction,
            message="Career prediction generated successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate career prediction: {str(e)}"
        )

@router.get("/roadmap/{user_id}")
async def get_career_roadmap(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get personalized career roadmap for user"""
    try:
        # Users can only get their own roadmap
        if current_user.id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )

        ai_service = AIService(db)
        roadmap = await ai_service.generate_career_roadmap(user_id)
        
        return {
            "success": True,
            "data": roadmap,
            "message": "Career roadmap retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get career roadmap: {str(e)}"
        )

@router.get("/market-trends")
async def get_market_trends(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current market trends and insights"""
    try:
        ai_service = AIService(db)
        trends = await ai_service.get_market_trends()
        
        return {
            "success": True,
            "data": trends,
            "message": "Market trends retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get market trends: {str(e)}"
        )

@router.post("/skill-analysis")
async def analyze_skills(
    skill_data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze user's skills and provide recommendations"""
    try:
        ai_service = AIService(db)
        analysis = await ai_service.analyze_skills(
            user_id=current_user.id,
            skills=skill_data.get("skills", []),
            target_role=skill_data.get("target_role")
        )
        
        return {
            "success": True,
            "data": analysis,
            "message": "Skill analysis completed successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze skills: {str(e)}"
        )

@router.get("/salary-insights/{role}")
async def get_salary_insights(
    role: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get salary insights for a specific role"""
    try:
        ai_service = AIService(db)
        insights = await ai_service.get_salary_insights(role)
        
        return {
            "success": True,
            "data": insights,
            "message": "Salary insights retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get salary insights: {str(e)}"
        )
