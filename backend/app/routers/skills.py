from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.database import get_async_db
from app.services.skill_service import SkillService
from app.schemas.skill import Skill, SkillCreate, SkillUpdate, SkillResponse, SkillsListResponse
from app.core.exceptions import SkillException

router = APIRouter(prefix="/skills", tags=["skills"])

def get_skill_service(db: AsyncSession = Depends(get_async_db)) -> SkillService:
    return SkillService(db)

@router.get("/", response_model=SkillsListResponse)
async def get_skills(
    user_id: str,  # In production, this would come from JWT token
    skill_service: SkillService = Depends(get_skill_service)
):
    """Get all user skills"""
    try:
        user_uuid = UUID(user_id)
        skills = await skill_service.get_user_skills(user_uuid)
        return SkillsListResponse(
            success=True,
            data=skills,
            message="Skills retrieved successfully"
        )
    except SkillException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/{skill_id}", response_model=SkillResponse)
async def get_skill(
    skill_id: str,
    user_id: str,  # In production, this would come from JWT token
    skill_service: SkillService = Depends(get_skill_service)
):
    """Get a specific skill"""
    try:
        skill_uuid = UUID(skill_id)
        user_uuid = UUID(user_id)
        skill = await skill_service.get_skill_by_id(skill_uuid, user_uuid)
        
        if not skill:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Skill not found"
            )
        
        return SkillResponse(
            success=True,
            data=skill,
            message="Skill retrieved successfully"
        )
    except SkillException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/", response_model=SkillResponse)
async def create_skill(
    skill_data: SkillCreate,
    user_id: str,  # In production, this would come from JWT token
    skill_service: SkillService = Depends(get_skill_service)
):
    """Create a new skill"""
    try:
        user_uuid = UUID(user_id)
        skill = await skill_service.create_skill(user_uuid, skill_data)
        return SkillResponse(
            success=True,
            data=skill,
            message="Skill created successfully"
        )
    except SkillException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.put("/{skill_id}", response_model=SkillResponse)
async def update_skill(
    skill_id: str,
    skill_data: SkillUpdate,
    user_id: str,  # In production, this would come from JWT token
    skill_service: SkillService = Depends(get_skill_service)
):
    """Update a skill"""
    try:
        skill_uuid = UUID(skill_id)
        user_uuid = UUID(user_id)
        skill = await skill_service.update_skill(skill_uuid, user_uuid, skill_data)
        
        if not skill:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Skill not found"
            )
        
        return SkillResponse(
            success=True,
            data=skill,
            message="Skill updated successfully"
        )
    except SkillException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.delete("/{skill_id}")
async def delete_skill(
    skill_id: str,
    user_id: str,  # In production, this would come from JWT token
    skill_service: SkillService = Depends(get_skill_service)
):
    """Delete a skill"""
    try:
        skill_uuid = UUID(skill_id)
        user_uuid = UUID(user_id)
        success = await skill_service.delete_skill(skill_uuid, user_uuid)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Skill not found"
            )
        
        return {"success": True, "message": "Skill deleted successfully"}
    except SkillException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/category/{category}", response_model=SkillsListResponse)
async def get_skills_by_category(
    category: str,
    user_id: str,  # In production, this would come from JWT token
    skill_service: SkillService = Depends(get_skill_service)
):
    """Get skills by category"""
    try:
        user_uuid = UUID(user_id)
        skills = await skill_service.get_skills_by_category(user_uuid, category)
        return SkillsListResponse(
            success=True,
            data=skills,
            message=f"Skills in {category} retrieved successfully"
        )
    except SkillException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/statistics/summary")
async def get_skill_statistics(
    user_id: str,  # In production, this would come from JWT token
    skill_service: SkillService = Depends(get_skill_service)
):
    """Get skill statistics"""
    try:
        user_uuid = UUID(user_id)
        stats = await skill_service.get_skill_statistics(user_uuid)
        return {
            "success": True,
            "data": stats,
            "message": "Skill statistics retrieved successfully"
        }
    except SkillException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
