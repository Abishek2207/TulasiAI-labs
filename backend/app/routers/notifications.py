from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, and_, func
from typing import List, Optional
from datetime import datetime
from uuid import UUID

from app.database import get_async_db
from app.models.notification import Notification
from app.core.exceptions import NotificationException

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/")
async def get_notifications(
    user_id: str,  # In production, this would come from JWT token
    is_read: Optional[bool] = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_async_db)
):
    """Get user notifications"""
    try:
        user_uuid = UUID(user_id)
        query = select(Notification).where(Notification.user_id == user_uuid)
        
        if is_read is not None:
            query = query.where(Notification.is_read == is_read)
        
        query = query.order_by(Notification.created_at.desc()).limit(limit)
        
        result = await db.execute(query)
        notifications = result.scalars().all()
        
        return {
            "success": True,
            "data": [
                {
                    "id": str(notification.id),
                    "user_id": str(notification.user_id),
                    "title": notification.title,
                    "message": notification.message,
                    "notification_type": notification.notification_type,
                    "is_read": notification.is_read,
                    "metadata": notification.metadata,
                    "priority": notification.priority,
                    "created_at": notification.created_at.isoformat(),
                    "read_at": notification.read_at.isoformat() if notification.read_at else None
                }
                for notification in notifications
            ],
            "message": "Notifications retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.put("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    user_id: str,  # In production, this would come from JWT token
    db: AsyncSession = Depends(get_async_db)
):
    """Mark notification as read"""
    try:
        notification_uuid = UUID(notification_id)
        user_uuid = UUID(user_id)
        
        result = await db.execute(
            select(Notification).where(and_(Notification.id == notification_uuid, Notification.user_id == user_uuid))
        )
        notification = result.scalar_one_or_none()
        
        if not notification:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found"
            )
        
        await db.execute(
            update(Notification)
            .where(and_(Notification.id == notification_uuid, Notification.user_id == user_uuid))
            .values(is_read=True, read_at=datetime.utcnow())
        )
        await db.commit()
        
        return {"success": True, "message": "Notification marked as read"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/")
async def create_notification(
    user_id: str,  # In production, this would come from JWT token
    title: str,
    message: str,
    notification_type: str,
    metadata: Optional[dict] = None,
    priority: str = "medium",
    db: AsyncSession = Depends(get_async_db)
):
    """Create a new notification"""
    try:
        user_uuid = UUID(user_id)
        
        new_notification = Notification(
            user_id=user_uuid,
            title=title,
            message=message,
            notification_type=notification_type,
            metadata=metadata,
            priority=priority
        )
        
        db.add(new_notification)
        await db.commit()
        await db.refresh(new_notification)
        
        return {
            "success": True,
            "data": {
                "id": str(new_notification.id),
                "title": new_notification.title,
                "message": new_notification.message,
                "notification_type": new_notification.notification_type,
                "is_read": new_notification.is_read,
                "created_at": new_notification.created_at.isoformat()
            },
            "message": "Notification created successfully"
        }
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    user_id: str,  # In production, this would come from JWT token
    db: AsyncSession = Depends(get_async_db)
):
    """Delete a notification"""
    try:
        notification_uuid = UUID(notification_id)
        user_uuid = UUID(user_id)
        
        from sqlalchemy import delete
        result = await db.execute(
            delete(Notification).where(and_(Notification.id == notification_uuid, Notification.user_id == user_uuid))
        )
        await db.commit()
        
        if result.rowcount == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found"
            )
        
        return {"success": True, "message": "Notification deleted successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/unread/count")
async def get_unread_count(
    user_id: str,  # In production, this would come from JWT token
    db: AsyncSession = Depends(get_async_db)
):
    """Get count of unread notifications"""
    try:
        user_uuid = UUID(user_id)
        
        result = await db.execute(
            select(func.count(Notification.id)).where(and_(Notification.user_id == user_uuid, Notification.is_read == False))
        )
        count = result.scalar() or 0
        
        return {
            "success": True,
            "data": {"unread_count": count},
            "message": "Unread count retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/trending-updates")
async def get_trending_updates(
    user_id: str,  # In production, this would come from JWT token
    db: AsyncSession = Depends(get_async_db)
):
    """Get trending skills and tech updates"""
    try:
        # Simulated trending data - in production, this would come from external APIs
        trending_data = {
            "trending_skills": [
                {
                    "skill": "Machine Learning",
                    "growth": 45,
                    "demand": "high",
                    "companies": ["Google", "Microsoft", "Amazon", "Meta"]
                },
                {
                    "skill": "Cloud Architecture",
                    "growth": 38,
                    "demand": "high",
                    "companies": ["AWS", "Azure", "Google Cloud"]
                },
                {
                    "skill": "DevOps",
                    "growth": 35,
                    "demand": "high",
                    "companies": ["Netflix", "Spotify", "Uber"]
                },
                {
                    "skill": "Data Engineering",
                    "growth": 28,
                    "demand": "medium",
                    "companies": ["Airbnb", "LinkedIn", "Twitter"]
                },
                {
                    "skill": "Cybersecurity",
                    "growth": 32,
                    "demand": "high",
                    "companies": ["CrowdStrike", "Palo Alto Networks", "Zscaler"]
                },
                {
                    "skill": "React/Next.js",
                    "growth": 30,
                    "demand": "high",
                    "companies": ["Vercel", "Meta", "Netflix"]
                }
            ],
            "tech_updates": [
                {
                    "title": "Python 3.13 Released",
                    "description": "New features include improved error messages, better performance, and new typing features",
                    "impact": "medium",
                    "link": "https://www.python.org/downloads/"
                },
                {
                    "title": "React 19 RC Available",
                    "description": "React 19 introduces new hooks, improved server components, and better performance",
                    "impact": "high",
                    "link": "https://react.dev/blog/2024/12/05/react-19"
                },
                {
                    "title": "AWS Announces New AI Services",
                    "description": "Amazon Web Services launches new generative AI capabilities and machine learning tools",
                    "impact": "high",
                    "link": "https://aws.amazon.com/"
                },
                {
                    "title": "Kubernetes 1.30 Released",
                    "description": "Latest version includes dynamic resource allocation, improved security, and better scalability",
                    "impact": "medium",
                    "link": "https://kubernetes.io/"
                }
            ],
            "certification_updates": [
                {
                    "certification": "Google Cloud Professional",
                    "new_exams": ["Cloud Digital Leader", "Professional Cloud Architect"],
                    "expiry_updates": "Some certifications now valid for 3 years instead of 2"
                },
                {
                    "certification": "Azure Solutions Architect",
                    "new_exams": ["AZ-305 updated"],
                    "expiry_updates": "Exam updated with new AI and ML content"
                },
                {
                    "certification": "AWS Solutions Architect",
                    "new_exams": ["SAA-C03"],
                    "expiry_updates": "New exam pattern with more scenario-based questions"
                }
            ]
        }

        # Create notifications for trending updates if they don't exist
        user_uuid = UUID(user_id)
        
        # Check if user already has trending notifications
        existing_result = await db.execute(
            select(Notification).where(
                and_(
                    Notification.user_id == user_uuid,
                    Notification.notification_type == "trending_update"
                )
            )
        )
        existing = existing_result.scalars().all()
        
        # Only create new notifications if none exist today
        if not existing:
            for skill in trending_data["trending_skills"][:3]:  # Top 3 skills
                new_notification = Notification(
                    user_id=user_uuid,
                    title=f"Trending: {skill['skill']}",
                    message=f"{skill['skill']} is trending with {skill['growth']}% growth. High demand at {', '.join(skill['companies'][:2])}",
                    notification_type="trending_update",
                    metadata={"skill": skill["skill"], "growth": skill["growth"]},
                    priority="medium"
                )
                db.add(new_notification)
            
            await db.commit()

        return {
            "success": True,
            "data": trending_data,
            "message": "Trending updates retrieved successfully"
        }
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
