from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

from app.models.user import User, Notification
from app.schemas.career import NotificationCreate, NotificationResponse
from app.core.exceptions import NotificationException

class NotificationService:
    def __init__(self, db: Session):
        self.db = db

    async def get_user_notifications(
        self, 
        user_id: int, 
        limit: int = 20, 
        offset: int = 0, 
        unread_only: bool = False
    ) -> List[NotificationResponse]:
        """Get user notifications with pagination and filtering"""
        try:
            query = self.db.query(Notification).filter(Notification.user_id == user_id)
            
            if unread_only:
                query = query.filter(Notification.is_read == False)
            
            notifications = (
                query.order_by(Notification.created_at.desc())
                .offset(offset)
                .limit(limit)
                .all()
            )
            
            return [
                NotificationResponse(
                    id=notification.id,
                    title=notification.title,
                    message=notification.message,
                    notification_type=notification.notification_type,
                    metadata=notification.metadata,
                    is_read=notification.is_read,
                    created_at=notification.created_at,
                    user_id=notification.user_id
                )
                for notification in notifications
            ]
        except Exception as e:
            raise NotificationException(f"Failed to get notifications: {str(e)}")

    async def create_notification(
        self, 
        user_id: int, 
        notification_data: NotificationCreate
    ) -> NotificationResponse:
        """Create a new notification"""
        try:
            notification = Notification(
                user_id=user_id,
                title=notification_data.title,
                message=notification_data.message,
                notification_type=notification_data.notification_type,
                metadata=notification_data.metadata or {},
                is_read=False,
                created_at=datetime.utcnow()
            )
            
            self.db.add(notification)
            self.db.commit()
            self.db.refresh(notification)
            
            return NotificationResponse(
                id=notification.id,
                title=notification.title,
                message=notification.message,
                notification_type=notification.notification_type,
                metadata=notification.metadata,
                is_read=False,
                created_at=notification.created_at,
                user_id=user_id
            )
        except Exception as e:
            self.db.rollback()
            raise NotificationException(f"Failed to create notification: {str(e)}")

    async def mark_notification_read(self, user_id: int, notification_id: int) -> bool:
        """Mark a specific notification as read"""
        try:
            notification = (
                self.db.query(Notification)
                .filter(and_(Notification.id == notification_id, Notification.user_id == user_id))
                .first()
            )
            
            if not notification:
                raise NotificationException("Notification not found")
            
            notification.is_read = True
            notification.read_at = datetime.utcnow()
            self.db.commit()
            
            return True
        except Exception as e:
            self.db.rollback()
            raise NotificationException(f"Failed to mark notification as read: {str(e)}")

    async def mark_all_notifications_read(self, user_id: int) -> int:
        """Mark all user notifications as read"""
        try:
            count = (
                self.db.query(Notification)
                .filter(and_(Notification.user_id == user_id, Notification.is_read == False))
                .update({"is_read": True, "read_at": datetime.utcnow()})
            )
            self.db.commit()
            
            return count
        except Exception as e:
            self.db.rollback()
            raise NotificationException(f"Failed to mark all notifications as read: {str(e)}")

    async def delete_notification(self, user_id: int, notification_id: int) -> bool:
        """Delete a notification"""
        try:
            notification = (
                self.db.query(Notification)
                .filter(and_(Notification.id == notification_id, Notification.user_id == user_id))
                .first()
            )
            
            if not notification:
                raise NotificationException("Notification not found")
            
            self.db.delete(notification)
            self.db.commit()
            
            return True
        except Exception as e:
            self.db.rollback()
            raise NotificationException(f"Failed to delete notification: {str(e)}")

    async def get_unread_count(self, user_id: int) -> int:
        """Get count of unread notifications"""
        try:
            count = (
                self.db.query(func.count(Notification.id))
                .filter(and_(Notification.user_id == user_id, Notification.is_read == False))
                .scalar()
            )
            return count or 0
        except Exception as e:
            raise NotificationException(f"Failed to get unread count: {str(e)}")

    async def get_notification_preferences(self, user_id: int) -> Dict[str, Any]:
        """Get user's notification preferences"""
        try:
            # Mock preferences for demo - in production, this would come from database
            return {
                "email_notifications": True,
                "push_notifications": True,
                "in_app_notifications": True,
                "notification_types": {
                    "task_reminders": True,
                    "skill_updates": True,
                    "career_insights": True,
                    "achievement_alerts": True,
                    "system_updates": False
                },
                "frequency": "daily",
                "quiet_hours": {
                    "start": "22:00",
                    "end": "08:00"
                }
            }
        except Exception as e:
            raise NotificationException(f"Failed to get notification preferences: {str(e)}")

    async def update_notification_preferences(self, user_id: int, preferences: Dict[str, Any]) -> Dict[str, Any]:
        """Update user's notification preferences"""
        try:
            # In production, this would update the database
            # For demo, return the updated preferences
            updated_preferences = {
                "email_notifications": preferences.get("email_notifications", True),
                "push_notifications": preferences.get("push_notifications", True),
                "in_app_notifications": preferences.get("in_app_notifications", True),
                "notification_types": preferences.get("notification_types", {
                    "task_reminders": True,
                    "skill_updates": True,
                    "career_insights": True,
                    "achievement_alerts": True,
                    "system_updates": False
                }),
                "frequency": preferences.get("frequency", "daily"),
                "quiet_hours": preferences.get("quiet_hours", {
                    "start": "22:00",
                    "end": "08:00"
                })
            }
            
            return updated_preferences
        except Exception as e:
            raise NotificationException(f"Failed to update notification preferences: {str(e)}")

    async def create_system_notification(self, user_id: int, title: str, message: str, metadata: Optional[Dict[str, Any]] = None):
        """Create a system-generated notification"""
        return await self.create_notification(
            user_id=user_id,
            notification_data=NotificationCreate(
                title=title,
                message=message,
                notification_type="system",
                metadata=metadata
            )
        )

    async def create_task_reminder(self, user_id: int, task_title: str, due_date: datetime):
        """Create a task reminder notification"""
        return await self.create_notification(
            user_id=user_id,
            notification_data=NotificationCreate(
                title="Task Due Soon",
                message=f"Your task '{task_title}' is due on {due_date.strftime('%Y-%m-%d')}",
                notification_type="task_reminder",
                metadata={
                    "task_title": task_title,
                    "due_date": due_date.isoformat(),
                    "priority": "medium"
                }
            )
        )

    async def create_skill_update_notification(self, user_id: int, skill_name: str, level: int):
        """Create a skill achievement notification"""
        return await self.create_notification(
            user_id=user_id,
            notification_data=NotificationCreate(
                title="Skill Level Up!",
                message=f"Congratulations! You've reached level {level} in {skill_name}",
                notification_type="achievement",
                metadata={
                    "skill_name": skill_name,
                    "new_level": level,
                    "achievement_type": "skill_level_up"
                }
            )
        )

    async def create_career_insight_notification(self, user_id: int, insight: str):
        """Create a career insight notification"""
        return await self.create_notification(
            user_id=user_id,
            notification_data=NotificationCreate(
                title="Career Insight Available",
                message=f"New AI-powered career insight: {insight}",
                notification_type="career_insight",
                metadata={
                    "insight": insight,
                    "generated_at": datetime.utcnow().isoformat()
                }
            )
        )
