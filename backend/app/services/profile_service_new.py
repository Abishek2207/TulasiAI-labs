from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, func
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from uuid import UUID

from app.models.profile import Profile
from app.models.skill import Skill
from app.models.task import Task
from app.models.streak import Streak
from app.models.certification import Certification
from app.schemas.profile import Profile, ProfileCreate, ProfileUpdate, ProfileStats
from app.core.exceptions import ProfileException

class ProfileService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_profile(self, user_id: UUID) -> Profile:
        """Get user profile"""
        try:
            result = await self.db.execute(
                select(Profile).where(Profile.user_id == user_id)
            )
            profile = result.scalar_one_or_none()
            if not profile:
                raise ProfileException("Profile not found")
            
            return Profile(
                id=profile.id,
                user_id=profile.user_id,
                name=profile.name,
                email=profile.email,
                experience_level=profile.experience_level,
                current_role=profile.current_role,
                target_role=profile.target_role,
                company=profile.company,
                daily_learning_hours=profile.daily_learning_hours,
                job_readiness_score=profile.job_readiness_score,
                created_at=profile.created_at,
                updated_at=profile.updated_at
            )
        except Exception as e:
            raise ProfileException(f"Failed to get user profile: {str(e)}")

    async def create_user_profile(self, profile_data: ProfileCreate) -> Profile:
        """Create new user profile"""
        try:
            # Check if profile already exists
            result = await self.db.execute(
                select(Profile).where(Profile.user_id == profile_data.user_id)
            )
            existing = result.scalar_one_or_none()
            if existing:
                raise ProfileException("Profile already exists")

            new_profile = Profile(**profile_data.model_dump())
            self.db.add(new_profile)
            await self.db.commit()
            await self.db.refresh(new_profile)
            
            return Profile(
                id=new_profile.id,
                user_id=new_profile.user_id,
                name=new_profile.name,
                email=new_profile.email,
                experience_level=new_profile.experience_level,
                current_role=new_profile.current_role,
                target_role=new_profile.target_role,
                company=new_profile.company,
                daily_learning_hours=new_profile.daily_learning_hours,
                job_readiness_score=new_profile.job_readiness_score,
                created_at=new_profile.created_at,
                updated_at=new_profile.updated_at
            )
        except Exception as e:
            await self.db.rollback()
            raise ProfileException(f"Failed to create user profile: {str(e)}")

    async def update_user_profile(self, user_id: UUID, profile_update: ProfileUpdate) -> Profile:
        """Update user profile"""
        try:
            result = await self.db.execute(
                select(Profile).where(Profile.user_id == user_id)
            )
            profile = result.scalar_one_or_none()
            if not profile:
                raise ProfileException("Profile not found")

            # Update only provided fields
            update_data = profile_update.model_dump(exclude_unset=True)
            await self.db.execute(
                update(Profile)
                .where(Profile.user_id == user_id)
                .values(**update_data)
            )
            await self.db.commit()
            
            return await self.get_user_profile(user_id)
        except Exception as e:
            await self.db.rollback()
            raise ProfileException(f"Failed to update user profile: {str(e)}")

    async def get_profile_stats(self, user_id: UUID) -> ProfileStats:
        """Get comprehensive profile statistics"""
        try:
            # Get profile
            profile_result = await self.db.execute(
                select(Profile).where(Profile.user_id == user_id)
            )
            profile = profile_result.scalar_one_or_none()
            if not profile:
                raise ProfileException("Profile not found")

            # Get skills count
            skills_result = await self.db.execute(
                select(func.count(Skill.id)).where(Skill.user_id == user_id)
            )
            total_skills = skills_result.scalar() or 0

            # Get skills by category
            skills_category_result = await self.db.execute(
                select(Skill.category, func.count(Skill.id).label('count'))
                .where(Skill.user_id == user_id)
                .group_by(Skill.category)
            )
            skills_by_category = {cat: count for cat, count in skills_category_result}

            # Get average skill level
            avg_level_result = await self.db.execute(
                select(func.avg(Skill.proficiency_level)).where(Skill.user_id == user_id)
            )
            avg_level = avg_level_result.scalar() or 0

            # Get completed tasks
            tasks_result = await self.db.execute(
                select(func.count(Task.id)).where(and_(Task.user_id == user_id, Task.completed == True))
            )
            completed_tasks = tasks_result.scalar() or 0

            # Get certifications
            certs_result = await self.db.execute(
                select(func.count(Certification.id)).where(Certification.user_id == user_id)
            )
            certifications = certs_result.scalar() or 0

            # Get streak
            streak_result = await self.db.execute(
                select(Streak).where(Streak.user_id == user_id)
            )
            streak = streak_result.scalar_one_or_none()
            current_streak = streak.current_streak if streak else 0

            # Calculate total learning hours
            hours_result = await self.db.execute(
                select(func.sum(Skill.hours_practiced)).where(Skill.user_id == user_id)
            )
            total_learning_hours = hours_result.scalar() or 0

            # Calculate job readiness score
            job_readiness = self._calculate_job_readiness(
                total_skills, 
                avg_level, 
                current_streak,
                profile.daily_learning_hours
            )

            # Mock weekly progress (can be enhanced later)
            weekly_progress = {
                "hours_this_week": float(total_learning_hours),
                "tasks_completed": completed_tasks,
                "target_hours": float(profile.daily_learning_hours * 7),
                "target_tasks": 10,
                "completion_rate": round((completed_tasks / 10) * 100, 2) if completed_tasks > 0 else 0
            }

            return ProfileStats(
                total_skills=total_skills,
                skills_by_category=skills_by_category,
                average_skill_level=round(float(avg_level), 2),
                current_streak=current_streak,
                total_learning_hours=float(total_learning_hours),
                job_readiness_score=job_readiness,
                completed_tasks=completed_tasks,
                certifications=certifications,
                weekly_progress=weekly_progress
            )
        except Exception as e:
            raise ProfileException(f"Failed to get profile stats: {str(e)}")

    def _calculate_job_readiness(self, skills_count: int, avg_level: float, streak: int, daily_hours: int) -> float:
        """Calculate job readiness score based on multiple factors"""
        # Skills factor (0-40 points)
        skills_score = min(40, skills_count * 4)

        # Skill level factor (0-30 points)
        level_score = min(30, avg_level * 3)

        # Consistency factor (0-20 points)
        consistency_score = min(20, streak * 2)

        # Learning commitment factor (0-10 points)
        commitment_score = min(10, daily_hours * 0.5)

        total_score = skills_score + level_score + consistency_score + commitment_score
        return round(min(100, total_score), 2)
