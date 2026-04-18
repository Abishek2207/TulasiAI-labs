from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, and_
from typing import List, Dict, Any, Optional
from datetime import datetime
from uuid import UUID

from app.models.skill import Skill
from app.schemas.skill import Skill, SkillCreate, SkillUpdate
from app.core.exceptions import SkillException

class SkillService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_skills(self, user_id: UUID) -> List[Skill]:
        """Get all skills for a user"""
        try:
            result = await self.db.execute(
                select(Skill).where(Skill.user_id == user_id).order_by(Skill.created_at.desc())
            )
            skills = result.scalars().all()
            
            return [
                Skill(
                    id=skill.id,
                    user_id=skill.user_id,
                    skill_name=skill.skill_name,
                    level=skill.level,
                    proficiency_level=skill.proficiency_level,
                    hours_practiced=float(skill.hours_practiced),
                    category=skill.category,
                    last_practiced=skill.last_practiced,
                    created_at=skill.created_at,
                    updated_at=skill.updated_at
                )
                for skill in skills
            ]
        except Exception as e:
            raise SkillException(f"Failed to get user skills: {str(e)}")

    async def get_skill_by_id(self, skill_id: UUID, user_id: UUID) -> Optional[Skill]:
        """Get a specific skill by ID"""
        try:
            result = await self.db.execute(
                select(Skill).where(and_(Skill.id == skill_id, Skill.user_id == user_id))
            )
            skill = result.scalar_one_or_none()
            
            if not skill:
                return None
                
            return Skill(
                id=skill.id,
                user_id=skill.user_id,
                skill_name=skill.skill_name,
                level=skill.level,
                proficiency_level=skill.proficiency_level,
                hours_practiced=float(skill.hours_practiced),
                category=skill.category,
                last_practiced=skill.last_practiced,
                created_at=skill.created_at,
                updated_at=skill.updated_at
            )
        except Exception as e:
            raise SkillException(f"Failed to get skill: {str(e)}")

    async def create_skill(self, user_id: UUID, skill_data: SkillCreate) -> Skill:
        """Create a new skill"""
        try:
            # Check if skill already exists
            result = await self.db.execute(
                select(Skill).where(and_(Skill.user_id == user_id, Skill.skill_name == skill_data.skill_name))
            )
            existing = result.scalar_one_or_none()
            if existing:
                raise SkillException("Skill with this name already exists")

            new_skill = Skill(
                user_id=user_id,
                **skill_data.model_dump(),
                last_practiced=datetime.utcnow()
            )
            
            self.db.add(new_skill)
            await self.db.commit()
            await self.db.refresh(new_skill)
            
            return Skill(
                id=new_skill.id,
                user_id=new_skill.user_id,
                skill_name=new_skill.skill_name,
                level=new_skill.level,
                proficiency_level=new_skill.proficiency_level,
                hours_practiced=float(new_skill.hours_practiced),
                category=new_skill.category,
                last_practiced=new_skill.last_practiced,
                created_at=new_skill.created_at,
                updated_at=new_skill.updated_at
            )
        except Exception as e:
            await self.db.rollback()
            raise SkillException(f"Failed to create skill: {str(e)}")

    async def update_skill(self, skill_id: UUID, user_id: UUID, skill_data: SkillUpdate) -> Optional[Skill]:
        """Update an existing skill"""
        try:
            result = await self.db.execute(
                select(Skill).where(and_(Skill.id == skill_id, Skill.user_id == user_id))
            )
            skill = result.scalar_one_or_none()
            if not skill:
                return None

            # Update only provided fields
            update_data = skill_data.model_dump(exclude_unset=True)
            if update_data:
                update_data['last_practiced'] = datetime.utcnow()
                await self.db.execute(
                    update(Skill)
                    .where(and_(Skill.id == skill_id, Skill.user_id == user_id))
                    .values(**update_data)
                )
                await self.db.commit()
            
            return await self.get_skill_by_id(skill_id, user_id)
        except Exception as e:
            await self.db.rollback()
            raise SkillException(f"Failed to update skill: {str(e)}")

    async def delete_skill(self, skill_id: UUID, user_id: UUID) -> bool:
        """Delete a skill"""
        try:
            result = await self.db.execute(
                delete(Skill).where(and_(Skill.id == skill_id, Skill.user_id == user_id))
            )
            await self.db.commit()
            return result.rowcount > 0
        except Exception as e:
            await self.db.rollback()
            raise SkillException(f"Failed to delete skill: {str(e)}")

    async def update_skill_hours(self, skill_id: UUID, user_id: UUID, additional_hours: float) -> Optional[Skill]:
        """Add hours to a skill"""
        try:
            result = await self.db.execute(
                select(Skill).where(and_(Skill.id == skill_id, Skill.user_id == user_id))
            )
            skill = result.scalar_one_or_none()
            if not skill:
                return None

            new_hours = float(skill.hours_practiced) + additional_hours
            await self.db.execute(
                update(Skill)
                .where(and_(Skill.id == skill_id, Skill.user_id == user_id))
                .values(
                    hours_practiced=new_hours,
                    last_practiced=datetime.utcnow()
                )
            )
            await self.db.commit()
            
            return await self.get_skill_by_id(skill_id, user_id)
        except Exception as e:
            await self.db.rollback()
            raise SkillException(f"Failed to update skill hours: {str(e)}")

    async def get_skills_by_category(self, user_id: UUID, category: str) -> List[Skill]:
        """Get skills by category"""
        try:
            result = await self.db.execute(
                select(Skill).where(and_(Skill.user_id == user_id, Skill.category == category))
            )
            skills = result.scalars().all()
            
            return [
                Skill(
                    id=skill.id,
                    user_id=skill.user_id,
                    skill_name=skill.skill_name,
                    level=skill.level,
                    proficiency_level=skill.proficiency_level,
                    hours_practiced=float(skill.hours_practiced),
                    category=skill.category,
                    last_practiced=skill.last_practiced,
                    created_at=skill.created_at,
                    updated_at=skill.updated_at
                )
                for skill in skills
            ]
        except Exception as e:
            raise SkillException(f"Failed to get skills by category: {str(e)}")

    async def get_skill_statistics(self, user_id: UUID) -> Dict[str, Any]:
        """Get skill statistics for a user"""
        try:
            # Total skills
            total_result = await self.db.execute(
                select(func.count(Skill.id)).where(Skill.user_id == user_id)
            )
            total_skills = total_result.scalar() or 0

            # Skills by category
            category_result = await self.db.execute(
                select(Skill.category, func.count(Skill.id).label('count'))
                .where(Skill.user_id == user_id)
                .group_by(Skill.category)
            )
            skills_by_category = {cat: count for cat, count in category_result}

            # Skills by level
            level_result = await self.db.execute(
                select(Skill.level, func.count(Skill.id).label('count'))
                .where(Skill.user_id == user_id)
                .group_by(Skill.level)
            )
            skills_by_level = {level: count for level, count in level_result}

            # Average proficiency
            avg_result = await self.db.execute(
                select(func.avg(Skill.proficiency_level)).where(Skill.user_id == user_id)
            )
            avg_proficiency = avg_result.scalar() or 0

            # Total hours practiced
            hours_result = await self.db.execute(
                select(func.sum(Skill.hours_practiced)).where(Skill.user_id == user_id)
            )
            total_hours = hours_result.scalar() or 0

            return {
                "total_skills": total_skills,
                "skills_by_category": skills_by_category,
                "skills_by_level": skills_by_level,
                "average_proficiency": round(float(avg_proficiency), 2),
                "total_hours_practiced": float(total_hours)
            }
        except Exception as e:
            raise SkillException(f"Failed to get skill statistics: {str(e)}")
