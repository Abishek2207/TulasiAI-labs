from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, and_, func
from typing import Optional
from datetime import datetime, date, timedelta
from uuid import UUID

from app.models.streak import Streak
from app.schemas.streak import Streak, StreakCreate, StreakUpdate, StreakCalculation
from app.core.exceptions import StreakException

class StreakService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_streak(self, user_id: UUID) -> Optional[Streak]:
        """Get user's current streak information"""
        try:
            result = await self.db.execute(
                select(Streak).where(Streak.user_id == user_id)
            )
            streak = result.scalar_one_or_none()
            
            if not streak:
                return None
                
            return Streak(
                id=streak.id,
                user_id=streak.user_id,
                current_streak=streak.current_streak,
                longest_streak=streak.longest_streak,
                last_active_date=streak.last_active_date,
                total_active_days=streak.total_active_days,
                created_at=streak.created_at,
                updated_at=streak.updated_at
            )
        except Exception as e:
            raise StreakException(f"Failed to get user streak: {str(e)}")

    async def create_streak(self, user_id: UUID, streak_data: StreakCreate) -> Streak:
        """Create a new streak record"""
        try:
            # Check if streak already exists
            result = await self.db.execute(
                select(Streak).where(Streak.user_id == user_id)
            )
            existing = result.scalar_one_or_none()
            if existing:
                raise StreakException("Streak already exists for this user")

            new_streak = Streak(
                user_id=user_id,
                **streak_data.model_dump(),
                last_active_date=datetime.utcnow().date()
            )
            
            self.db.add(new_streak)
            await self.db.commit()
            await self.db.refresh(new_streak)
            
            return Streak(
                id=new_streak.id,
                user_id=new_streak.user_id,
                current_streak=new_streak.current_streak,
                longest_streak=new_streak.longest_streak,
                last_active_date=new_streak.last_active_date,
                total_active_days=new_streak.total_active_days,
                created_at=new_streak.created_at,
                updated_at=new_streak.updated_at
            )
        except Exception as e:
            await self.db.rollback()
            raise StreakException(f"Failed to create streak: {str(e)}")

    async def update_streak(self, user_id: UUID, streak_data: StreakUpdate) -> Optional[Streak]:
        """Update streak information"""
        try:
            result = await self.db.execute(
                select(Streak).where(Streak.user_id == user_id)
            )
            streak = result.scalar_one_or_none()
            if not streak:
                return None

            # Update only provided fields
            update_data = streak_data.model_dump(exclude_unset=True)
            if update_data:
                await self.db.execute(
                    update(Streak)
                    .where(Streak.user_id == user_id)
                    .values(**update_data)
                )
                await self.db.commit()
            
            return await self.get_user_streak(user_id)
        except Exception as e:
            await self.db.rollback()
            raise StreakException(f"Failed to update streak: {str(e)}")

    async def calculate_streak(self, user_id: UUID) -> StreakCalculation:
        """Calculate current streak based on activity"""
        try:
            today = datetime.utcnow().date()
            
            # Get or create streak record
            streak = await self.get_user_streak(user_id)
            
            if not streak:
                # Create new streak
                new_streak = await self.create_streak(user_id, StreakCreate(current_streak=1, longest_streak=1, total_active_days=1))
                return StreakCalculation(
                    current_streak=1,
                    longest_streak=1,
                    total_active_days=1,
                    last_active_date=today,
                    streak_status="new"
                )
            
            # Calculate streak based on last active date
            last_active = streak.last_active_date.date() if streak.last_active_date else None
            
            if not last_active:
                # First activity
                await self.update_streak(user_id, StreakUpdate(current_streak=1, total_active_days=1, last_active_date=today))
                return StreakCalculation(
                    current_streak=1,
                    longest_streak=streak.longest_streak,
                    total_active_days=1,
                    last_active_date=today,
                    streak_status="new"
                )
            
            days_diff = (today - last_active_date).days
            
            if days_diff == 0:
                # Same day, no change
                return StreakCalculation(
                    current_streak=streak.current_streak,
                    longest_streak=streak.longest_streak,
                    total_active_days=streak.total_active_days,
                    last_active_date=last_active,
                    streak_status="active"
                )
            elif days_diff == 1:
                # Consecutive day
                new_current = streak.current_streak + 1
                new_total = streak.total_active_days + 1
                new_longest = max(streak.longest_streak, new_current)
                
                await self.update_streak(user_id, StreakUpdate(
                    current_streak=new_current,
                    longest_streak=new_longest,
                    total_active_days=new_total,
                    last_active_date=today
                ))
                
                return StreakCalculation(
                    current_streak=new_current,
                    longest_streak=new_longest,
                    total_active_days=new_total,
                    last_active_date=today,
                    streak_status="active"
                )
            else:
                # Streak broken
                await self.update_streak(user_id, StreakUpdate(
                    current_streak=1,
                    total_active_days=streak.total_active_days + 1,
                    last_active_date=today
                ))
                
                return StreakCalculation(
                    current_streak=1,
                    longest_streak=streak.longest_streak,
                    total_active_days=streak.total_active_days + 1,
                    last_active_date=today,
                    streak_status="broken"
                )
                
        except Exception as e:
            raise StreakException(f"Failed to calculate streak: {str(e)}")

    async def record_activity(self, user_id: UUID) -> StreakCalculation:
        """Record user activity and update streak"""
        try:
            return await self.calculate_streak(user_id)
        except Exception as e:
            raise StreakException(f"Failed to record activity: {str(e)}")

    async def get_streak_history(self, user_id: UUID, days: int = 30) -> Dict[str, bool]:
        """Get streak history for the last N days"""
        try:
            streak = await self.get_user_streak(user_id)
            if not streak:
                return {}

            history = {}
            today = datetime.utcnow().date()
            
            for i in range(days):
                check_date = today - timedelta(days=i)
                # This is a simplified version - in reality, you'd store daily activity logs
                # For now, we'll just return the current streak status
                history[check_date.isoformat()] = i < streak.current_streak
            
            return history
        except Exception as e:
            raise StreakException(f"Failed to get streak history: {str(e)}")

    async def get_streak_milestones(self, user_id: UUID) -> Dict[str, Any]:
        """Get streak milestones and achievements"""
        try:
            streak = await self.get_user_streak(user_id)
            if not streak:
                return {
                    "current_milestone": None,
                    "next_milestone": {"days": 7, "name": "Week Warrior"},
                    "achievements": []
                }

            achievements = []
            
            # Check for various achievements
            if streak.current_streak >= 1:
                achievements.append({"name": "Getting Started", "days": 1, "achieved": True})
            if streak.current_streak >= 7:
                achievements.append({"name": "Week Warrior", "days": 7, "achieved": True})
            if streak.current_streak >= 30:
                achievements.append({"name": "Monthly Master", "days": 30, "achieved": True})
            if streak.current_streak >= 100:
                achievements.append({"name": "Century Club", "days": 100, "achieved": True})
            if streak.current_streak >= 365:
                achievements.append({"name": "Yearly Legend", "days": 365, "achieved": True})

            # Determine next milestone
            next_milestone = None
            milestones = [7, 30, 100, 365]
            
            for milestone in milestones:
                if streak.current_streak < milestone:
                    next_milestone = {"days": milestone, "name": f"{milestone} Day Streak"}
                    break

            current_milestone = None
            for milestone in reversed(milestones):
                if streak.current_streak >= milestone:
                    current_milestone = {"days": milestone, "name": f"{milestone} Day Streak"}
                    break

            return {
                "current_streak": streak.current_streak,
                "longest_streak": streak.longest_streak,
                "total_active_days": streak.total_active_days,
                "current_milestone": current_milestone,
                "next_milestone": next_milestone,
                "achievements": achievements
            }
        except Exception as e:
            raise StreakException(f"Failed to get streak milestones: {str(e)}")

    async def reset_streak(self, user_id: UUID) -> StreakCalculation:
        """Reset user streak (for testing or admin purposes)"""
        try:
            await self.update_streak(user_id, StreakUpdate(current_streak=0))
            
            return StreakCalculation(
                current_streak=0,
                longest_streak=0,
                total_active_days=0,
                last_active_date=None,
                streak_status="reset"
            )
        except Exception as e:
            raise StreakException(f"Failed to reset streak: {str(e)}")
