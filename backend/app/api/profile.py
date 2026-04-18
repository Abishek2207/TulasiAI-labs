from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.user import User
from app.schemas.profile import UserProfile, UserProfileUpdate, UserProfileResponse
from app.core.security import get_current_user
from app.services.profile_service import ProfileService

router = APIRouter()

@router.get("/me", response_model=UserProfileResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's profile"""
    try:
        profile_service = ProfileService(db)
        profile = await profile_service.get_user_profile(current_user.id)
        return UserProfileResponse(
            success=True,
            data=profile,
            message="Profile retrieved successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve profile: {str(e)}"
        )

@router.put("/me", response_model=UserProfileResponse)
async def update_user_profile(
    profile_update: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile"""
    try:
        profile_service = ProfileService(db)
        updated_profile = await profile_service.update_user_profile(
            current_user.id, 
            profile_update
        )
        return UserProfileResponse(
            success=True,
            data=updated_profile,
            message="Profile updated successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )

@router.get("/skills", response_model=List[dict])
async def get_user_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's skills with progress"""
    try:
        profile_service = ProfileService(db)
        skills = await profile_service.get_user_skills(current_user.id)
        return skills
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve skills: {str(e)}"
        )

@router.post("/skills/{skill_id}")
async def add_user_skill(
    skill_id: int,
    skill_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a new skill for user"""
    try:
        profile_service = ProfileService(db)
        result = await profile_service.add_user_skill(
            current_user.id,
            skill_id,
            skill_data
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add skill: {str(e)}"
        )

@router.put("/skills/{skill_id}")
async def update_user_skill(
    skill_id: int,
    skill_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's skill progress"""
    try:
        profile_service = ProfileService(db)
        result = await profile_service.update_user_skill(
            current_user.id,
            skill_id,
            skill_data
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update skill: {str(e)}"
        )

@router.delete("/skills/{skill_id}")
async def delete_user_skill(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete user's skill"""
    try:
        profile_service = ProfileService(db)
        await profile_service.delete_user_skill(current_user.id, skill_id)
        return {"success": True, "message": "Skill deleted successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete skill: {str(e)}"
        )

@router.get("/stats")
async def get_profile_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's profile statistics"""
    try:
        profile_service = ProfileService(db)
        stats = await profile_service.get_profile_stats(current_user.id)
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve profile stats: {str(e)}"
        )
