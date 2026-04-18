from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.database import get_async_db
from app.services.streak_service import StreakService
from app.schemas.streak import Streak, StreakCreate, StreakUpdate, StreakResponse, StreakCalculation
from app.core.exceptions import StreakException

router = APIRouter(prefix="/streak", tags=["streak"])

def get_streak_service(db: AsyncSession = Depends(get_async_db)) -> StreakService:
    return StreakService(db)

@router.get("/", response_model=StreakResponse)
async def get_streak(
    user_id: str,  # In production, this would come from JWT token
    streak_service: StreakService = Depends(get_streak_service)
):
    """Get user's current streak"""
    try:
        user_uuid = UUID(user_id)
        streak = await streak_service.get_user_streak(user_uuid)
        
        if not streak:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Streak not found"
            )
        
        return StreakResponse(
            success=True,
            data=streak,
            message="Streak retrieved successfully"
        )
    except StreakException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/", response_model=StreakResponse)
async def create_streak(
    streak_data: StreakCreate,
    streak_service: StreakService = Depends(get_streak_service)
):
    """Create a new streak record"""
    try:
        streak = await streak_service.create_streak(streak_data.user_id, streak_data)
        return StreakResponse(
            success=True,
            data=streak,
            message="Streak created successfully"
        )
    except StreakException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.put("/", response_model=StreakResponse)
async def update_streak(
    streak_data: StreakUpdate,
    user_id: str,  # In production, this would come from JWT token
    streak_service: StreakService = Depends(get_streak_service)
):
    """Update streak information"""
    try:
        user_uuid = UUID(user_id)
        streak = await streak_service.update_streak(user_uuid, streak_data)
        
        if not streak:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Streak not found"
            )
        
        return StreakResponse(
            success=True,
            data=streak,
            message="Streak updated successfully"
        )
    except StreakException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/calculate", response_model=dict)
async def calculate_streak(
    user_id: str,  # In production, this would come from JWT token
    streak_service: StreakService = Depends(get_streak_service)
):
    """Calculate current streak based on activity"""
    try:
        user_uuid = UUID(user_id)
        streak_calculation = await streak_service.calculate_streak(user_uuid)
        return {
            "success": True,
            "data": streak_calculation,
            "message": "Streak calculated successfully"
        }
    except StreakException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/activity", response_model=dict)
async def record_activity(
    user_id: str,  # In production, this would come from JWT token
    streak_service: StreakService = Depends(get_streak_service)
):
    """Record user activity and update streak"""
    try:
        user_uuid = UUID(user_id)
        streak_calculation = await streak_service.record_activity(user_uuid)
        return {
            "success": True,
            "data": streak_calculation,
            "message": "Activity recorded and streak updated"
        }
    except StreakException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/history")
async def get_streak_history(
    user_id: str,  # In production, this would come from JWT token
    days: int = 30,
    streak_service: StreakService = Depends(get_streak_service)
):
    """Get streak history for the last N days"""
    try:
        user_uuid = UUID(user_id)
        history = await streak_service.get_streak_history(user_uuid, days)
        return {
            "success": True,
            "data": history,
            "message": "Streak history retrieved successfully"
        }
    except StreakException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/milestones")
async def get_streak_milestones(
    user_id: str,  # In production, this would come from JWT token
    streak_service: StreakService = Depends(get_streak_service)
):
    """Get streak milestones and achievements"""
    try:
        user_uuid = UUID(user_id)
        milestones = await streak_service.get_streak_milestones(user_uuid)
        return {
            "success": True,
            "data": milestones,
            "message": "Streak milestones retrieved successfully"
        }
    except StreakException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/reset", response_model=dict)
async def reset_streak(
    user_id: str,  # In production, this would come from JWT token
    streak_service: StreakService = Depends(get_streak_service)
):
    """Reset user streak (for testing or admin purposes)"""
    try:
        user_uuid = UUID(user_id)
        streak_calculation = await streak_service.reset_streak(user_uuid)
        return {
            "success": True,
            "data": streak_calculation,
            "message": "Streak reset successfully"
        }
    except StreakException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/badges")
async def get_user_badges(
    user_id: str,  # In production, this would come from JWT token
    streak_service: StreakService = Depends(get_streak_service)
):
    """Get user's earned badges and achievements"""
    try:
        user_uuid = UUID(user_id)
        streak = await streak_service.get_user_streak(user_uuid)
        
        if not streak:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Streak not found"
            )
        
        # Define badge system
        badges = []
        current_streak = streak.current_streak if streak else 0
        
        # Streak-based badges
        if current_streak >= 1:
            badges.append({
                "id": "first_step",
                "name": "First Step",
                "description": "Started your learning journey",
                "icon": "🚀",
                "earned": True,
                "earned_at": streak.created_at.isoformat() if streak else None,
                "rarity": "common"
            })
        
        if current_streak >= 7:
            badges.append({
                "id": "week_warrior",
                "name": "Week Warrior",
                "description": "Maintained a 7-day streak",
                "icon": "🔥",
                "earned": True,
                "rarity": "rare"
            })
        
        if current_streak >= 30:
            badges.append({
                "id": "month_master",
                "name": "Month Master",
                "description": "Maintained a 30-day streak",
                "icon": "💎",
                "earned": True,
                "rarity": "epic"
            })
        
        if current_streak >= 100:
            badges.append({
                "id": "century_club",
                "name": "Century Club",
                "description": "Achieved a 100-day streak",
                "icon": "🏆",
                "earned": True,
                "rarity": "legendary"
            })
        
        if streak and streak.longest_streak >= 50:
            badges.append({
                "id": "streak_legend",
                "name": "Streak Legend",
                "description": "Longest streak of 50+ days",
                "icon": "👑",
                "earned": True,
                "rarity": "legendary"
            })
        
        # Next badges to earn
        next_badges = []
        if current_streak < 7:
            next_badges.append({
                "id": "week_warrior",
                "name": "Week Warrior",
                "description": "Maintain a 7-day streak",
                "icon": "🔥",
                "progress": f"{current_streak}/7",
                "rarity": "rare"
            })
        elif current_streak < 30:
            next_badges.append({
                "id": "month_master",
                "name": "Month Master",
                "description": "Maintain a 30-day streak",
                "icon": "💎",
                "progress": f"{current_streak}/30",
                "rarity": "epic"
            })
        elif current_streak < 100:
            next_badges.append({
                "id": "century_club",
                "name": "Century Club",
                "description": "Achieve a 100-day streak",
                "icon": "🏆",
                "progress": f"{current_streak}/100",
                "rarity": "legendary"
            })
        
        return {
            "success": True,
            "data": {
                "earned_badges": badges,
                "next_badges": next_badges,
                "total_badges": len(badges),
                "current_streak": current_streak,
                "longest_streak": streak.longest_streak if streak else 0,
                "total_active_days": streak.total_active_days if streak else 0
            },
            "message": "Badges retrieved successfully"
        }
    except StreakException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/progress")
async def get_streak_progress(
    user_id: str,  # In production, this would come from JWT token
    streak_service: StreakService = Depends(get_streak_service)
):
    """Get detailed streak progress with visual indicators"""
    try:
        user_uuid = UUID(user_id)
        streak = await streak_service.get_user_streak(user_uuid)
        
        if not streak:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Streak not found"
            )
        
        current_streak = streak.current_streak
        longest_streak = streak.longest_streak
        total_active_days = streak.total_active_days
        
        # Calculate progress to next milestone
        milestones = [7, 14, 30, 60, 100, 365]
        current_milestone = milestones[0]
        next_milestone = milestones[0]
        
        for milestone in milestones:
            if current_streak >= milestone:
                current_milestone = milestone
            else:
                next_milestone = milestone
                break
        
        progress_to_next = (current_streak / next_milestone) * 100 if next_milestone > 0 else 100
        
        # Generate weekly activity pattern (last 7 days)
        weekly_pattern = []
        for i in range(7):
            weekly_pattern.append({
                "day": i,
                "active": i < current_streak % 7 or current_streak >= 7
            })
        
        return {
            "success": True,
            "data": {
                "current_streak": current_streak,
                "longest_streak": longest_streak,
                "total_active_days": total_active_days,
                "current_milestone": current_milestone,
                "next_milestone": next_milestone,
                "progress_to_next": round(progress_to_next, 2),
                "days_to_next_milestone": next_milestone - current_streak,
                "weekly_pattern": weekly_pattern,
                "streak_level": get_streak_level(current_streak)
            },
            "message": "Streak progress retrieved successfully"
        }
    except StreakException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

def get_streak_level(streak: int) -> str:
    """Determine streak level based on days"""
    if streak < 7:
        return "Beginner"
    elif streak < 30:
        return "Intermediate"
    elif streak < 60:
        return "Advanced"
    elif streak < 100:
        return "Expert"
    else:
        return "Legend"
