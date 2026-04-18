from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.database import get_async_db
from app.services.profile_service_new import ProfileService
from app.schemas.profile import Profile, ProfileCreate, ProfileUpdate, ProfileResponse, ProfileStatsResponse
from app.core.exceptions import ProfileException

router = APIRouter(prefix="/profile", tags=["profile"])

def get_profile_service(db: AsyncSession = Depends(get_async_db)) -> ProfileService:
    return ProfileService(db)

@router.get("/", response_model=ProfileResponse)
async def get_profile(
    user_id: str,  # In production, this would come from JWT token
    profile_service: ProfileService = Depends(get_profile_service)
):
    """Get user profile"""
    try:
        user_uuid = UUID(user_id)
        profile = await profile_service.get_user_profile(user_uuid)
        return ProfileResponse(
            success=True,
            data=profile,
            message="Profile retrieved successfully"
        )
    except ProfileException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/", response_model=ProfileResponse)
async def create_profile(
    profile_data: ProfileCreate,
    profile_service: ProfileService = Depends(get_profile_service)
):
    """Create new user profile"""
    try:
        profile = await profile_service.create_user_profile(profile_data)
        return ProfileResponse(
            success=True,
            data=profile,
            message="Profile created successfully"
        )
    except ProfileException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.put("/", response_model=ProfileResponse)
async def update_profile(
    profile_data: ProfileUpdate,
    user_id: str,  # In production, this would come from JWT token
    profile_service: ProfileService = Depends(get_profile_service)
):
    """Update user profile"""
    try:
        user_uuid = UUID(user_id)
        profile = await profile_service.update_user_profile(user_uuid, profile_data)
        return ProfileResponse(
            success=True,
            data=profile,
            message="Profile updated successfully"
        )
    except ProfileException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/stats", response_model=ProfileStatsResponse)
async def get_profile_stats(
    user_id: str,  # In production, this would come from JWT token
    profile_service: ProfileService = Depends(get_profile_service)
):
    """Get user profile statistics"""
    try:
        user_uuid = UUID(user_id)
        stats = await profile_service.get_profile_stats(user_uuid)
        return ProfileStatsResponse(
            success=True,
            data=stats,
            message="Profile statistics retrieved successfully"
        )
    except ProfileException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
