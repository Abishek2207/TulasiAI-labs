from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, func, select, update, delete
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
        """Get user profile with all related data"""
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

    async def get_user_skills(self, user_id: UUID) -> List[Dict[str, Any]]:
        """Get all user skills with progress"""
        try:
            result = await self.db.execute(
                select(Skill).where(Skill.user_id == user_id)
            )
            skills = result.scalars().all()
            
            return [
                {
                    "id": str(skill.id),
                    "skill_name": skill.skill_name,
                    "level": skill.level,
                    "proficiency_level": skill.proficiency_level,
                    "hours_practiced": float(skill.hours_practiced),
                    "category": skill.category,
                    "last_practiced": skill.last_practiced.isoformat() if skill.last_practiced else None,
                    "created_at": skill.created_at.isoformat(),
                    "updated_at": skill.updated_at.isoformat(),
                }
                for skill in skills
            ]
        except Exception as e:
            raise ProfileException(f"Failed to get user skills: {str(e)}")

    async def add_user_skill(self, user_id: UUID, skill_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add a new skill for user"""
        try:
            # Check if user already has this skill
            result = await self.db.execute(
                select(Skill).where(and_(Skill.user_id == user_id, Skill.skill_name == skill_data["skill_name"]))
            )
            existing = result.scalar_one_or_none()
            if existing:
                raise ProfileException("User already has this skill")

            # Create new skill
            new_skill = Skill(
                user_id=user_id,
                skill_name=skill_data["skill_name"],
                level=skill_data.get("level", "beginner"),
                proficiency_level=skill_data.get("proficiency_level", 1),
                hours_practiced=skill_data.get("hours_practiced", 0.0),
                category=skill_data["category"],
                last_practiced=datetime.utcnow()
            )
            
            self.db.add(new_skill)
            await self.db.commit()
            await self.db.refresh(new_skill)
            
            return {
                "id": str(new_skill.id),
                "skill_name": new_skill.skill_name,
                "level": new_skill.level,
                "message": "Skill added successfully"
            }
        except Exception as e:
            await self.db.rollback()
            raise ProfileException(f"Failed to add user skill: {str(e)}")

    async def update_user_skill(self, user_id: int, skill_id: int, skill_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update user's skill progress"""
        try:
            user_skill = (
                self.db.query(UserSkill)
                .filter(and_(UserSkill.user_id == user_id, UserSkill.skill_id == skill_id))
                .first()
            )
            if not user_skill:
                raise ProfileException("User skill not found")

            # Update skill level
            if "level" in skill_data:
                user_skill.level = skill_data["level"]
            user_skill.updated_at = datetime.utcnow()
            
            self.db.commit()
            self.db.refresh(user_skill)
            
            return {
                "id": user_skill.id,
                "skill_id": skill_id,
                "level": user_skill.level,
                "message": "Skill updated successfully"
            }
        except Exception as e:
            self.db.rollback()
            raise ProfileException(f"Failed to update user skill: {str(e)}")

    async def delete_user_skill(self, user_id: int, skill_id: int) -> bool:
        """Delete user's skill"""
        try:
            user_skill = (
                self.db.query(UserSkill)
                .filter(and_(UserSkill.user_id == user_id, UserSkill.skill_id == skill_id))
                .first()
            )
            if not user_skill:
                raise ProfileException("User skill not found")

            self.db.delete(user_skill)
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            raise ProfileException(f"Failed to delete user skill: {str(e)}")

    async def get_profile_stats(self, user_id: int) -> ProfileStats:
        """Get comprehensive profile statistics"""
        try:
            # Get user
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                raise ProfileException("User not found")

            # Get skills stats
            skills_count = (
                self.db.query(func.count(UserSkill.id))
                .filter(UserSkill.user_id == user_id)
                .scalar()
            )

            # Get skills by category
            skills_by_category = (
                self.db.query(
                    Skill.category,
                    func.count(UserSkill.id).label('count')
                )
                .join(UserSkill)
                .filter(UserSkill.user_id == user_id)
                .group_by(Skill.category)
                .all()
            )
            
            category_stats = {cat: count for cat, count in skills_by_category}

            # Calculate average skill level
            avg_level = (
                self.db.query(func.avg(UserSkill.level))
                .filter(UserSkill.user_id == user_id)
                .scalar()
            ) or 0

            # Calculate job readiness score
            job_readiness = self._calculate_job_readiness(
                skills_count, 
                avg_level, 
                user.streak_count or 0,
                user.daily_learning_hours or 1
            )

            # Calculate weekly progress (mock data for demo)
            weekly_progress = {
                "hours_this_week": 14,
                "tasks_completed": 7,
                "target_hours": 21,
                "target_tasks": 15,
                "completion_rate": 67.5
            }

            return ProfileStats(
                total_skills=skills_count,
                skills_by_category=category_stats,
                average_skill_level=round(avg_level, 2),
                current_streak=user.streak_count or 0,
                total_learning_hours=user.daily_learning_hours or 1,
                job_readiness_score=job_readiness,
                weekly_progress=weekly_progress
            )
        except Exception as e:
            raise ProfileException(f"Failed to get profile stats: {str(e)}")

    def _calculate_job_readiness(self, skills_count: int, avg_level: float, streak: int, daily_hours: int) -> float:
        """Calculate job readiness score based on multiple factors"""
        # Skills factor (0-40 points)
        skills_score = min(40, skills_count * 4)

        # Skill level factor (0-30 points)
        level_score = min(30, avg_level * 0.3)

        # Consistency factor (0-20 points)
        consistency_score = min(20, streak * 1.5)

        # Learning commitment factor (0-10 points)
        commitment_score = min(10, daily_hours * 2)

        total_score = skills_score + level_score + consistency_score + commitment_score
        return round(min(100, total_score), 2)
