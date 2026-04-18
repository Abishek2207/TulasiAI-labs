from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from app.database import get_db
from app.models.user import User, Notification
from app.schemas.career import NotificationCreate, NotificationResponse
from app.core.security import get_current_user
from app.services.notification_service import NotificationService

router = APIRouter()

@router.get("/", response_model=List[NotificationResponse])
async def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 20,
    offset: int = 0,
    unread_only: bool = False
):
    """Get user notifications with pagination"""
    try:
        notification_service = NotificationService(db)
        notifications = await notification_service.get_user_notifications(
            user_id=current_user.id,
            limit=limit,
            offset=offset,
            unread_only=unread_only
        )
        
        return notifications
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve notifications: {str(e)}"
        )

@router.post("/", response_model=NotificationResponse)
async def create_notification(
    notification_data: NotificationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new notification (system-generated)"""
    try:
        notification_service = NotificationService(db)
        notification = await notification_service.create_notification(
            user_id=current_user.id,
            notification_data=notification_data
        )
        
        return NotificationResponse(
            success=True,
            data=notification,
            message="Notification created successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create notification: {str(e)}"
        )

@router.put("/{notification_id}/read")
async def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark notification as read"""
    try:
        notification_service = NotificationService(db)
        result = await notification_service.mark_notification_read(
            user_id=current_user.id,
            notification_id=notification_id
        )
        
        return {
            "success": True,
            "data": result,
            "message": "Notification marked as read"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to mark notification as read: {str(e)}"
        )

@router.put("/mark-all-read")
async def mark_all_notifications_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark all notifications as read"""
    try:
        notification_service = NotificationService(db)
        result = await notification_service.mark_all_notifications_read(current_user.id)
        
        return {
            "success": True,
            "data": {"marked_count": result},
            "message": "All notifications marked as read"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to mark all notifications as read: {str(e)}"
        )

@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a notification"""
    try:
        notification_service = NotificationService(db)
        result = await notification_service.delete_notification(
            user_id=current_user.id,
            notification_id=notification_id
        )
        
        return {
            "success": True,
            "data": {"deleted_count": 1},
            "message": "Notification deleted successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete notification: {str(e)}"
        )

@router.get("/unread-count")
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get count of unread notifications"""
    try:
        notification_service = NotificationService(db)
        count = await notification_service.get_unread_count(current_user.id)
        
        return {
            "success": True,
            "data": {"unread_count": count},
            "message": "Unread count retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get unread count: {str(e)}"
        )

@router.get("/preferences")
async def get_notification_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's notification preferences"""
    try:
        notification_service = NotificationService(db)
        preferences = await notification_service.get_notification_preferences(current_user.id)
        
        return {
            "success": True,
            "data": preferences,
            "message": "Notification preferences retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get notification preferences: {str(e)}"
        )

@router.put("/preferences")
async def update_notification_preferences(
    preferences: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's notification preferences"""
    try:
        notification_service = NotificationService(db)
        result = await notification_service.update_notification_preferences(
            user_id=current_user.id,
            preferences=preferences
        )
        
        return {
            "success": True,
            "data": result,
            "message": "Notification preferences updated successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update notification preferences: {str(e)}"
        )
