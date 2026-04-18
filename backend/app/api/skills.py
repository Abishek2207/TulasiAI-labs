from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.career import User, UserSkill, Skill
from app.schemas.career import UserSkillCreate, UserSkillUpdate, UserSkillResponse, SkillResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/skills", tags=["skills"])

# Mock skills data
DEFAULT_SKILLS = [
    {"name": "Python", "category": "Programming", "difficulty_level": "beginner"},
    {"name": "JavaScript", "category": "Programming", "difficulty_level": "beginner"},
    {"name": "TypeScript", "category": "Programming", "difficulty_level": "intermediate"},
    {"name": "React", "category": "Frontend", "difficulty_level": "intermediate"},
    {"name": "Node.js", "category": "Backend", "difficulty_level": "intermediate"},
    {"name": "SQL", "category": "Database", "difficulty_level": "beginner"},
    {"name": "MongoDB", "category": "Database", "difficulty_level": "intermediate"},
    {"name": "Docker", "category": "DevOps", "difficulty_level": "intermediate"},
    {"name": "AWS", "category": "Cloud", "difficulty_level": "advanced"},
    {"name": "TensorFlow", "category": "AI/ML", "difficulty_level": "advanced"},
    {"name": "Machine Learning", "category": "AI/ML", "difficulty_level": "advanced"},
    {"name": "Git", "category": "Tools", "difficulty_level": "beginner"},
]

@router.get("/", response_model=List[SkillResponse])
async def get_all_skills(db: Session = Depends(get_db)):
    """Get all available skills"""
    skills = db.query(Skill).all()
    
    # If no skills in database, add default skills
    if not skills:
        for skill_data in DEFAULT_SKILLS:
            skill = Skill(**skill_data)
            db.add(skill)
        db.commit()
        skills = db.query(Skill).all()
    
    return skills

@router.get("/user", response_model=List[UserSkillResponse])
async def get_user_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's skills"""
    user_skills = db.query(UserSkill).filter(UserSkill.user_id == current_user.id).all()
    return user_skills

@router.post("/add", response_model=UserSkillResponse)
async def add_user_skill(
    user_skill: UserSkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a skill to user's profile"""
    # Check if skill exists
    skill = db.query(Skill).filter(Skill.id == user_skill.skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    # Check if user already has this skill
    existing_skill = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id,
        UserSkill.skill_id == user_skill.skill_id
    ).first()
    
    if existing_skill:
        raise HTTPException(status_code=400, detail="Skill already added to profile")
    
    # Create new user skill
    db_user_skill = UserSkill(
        user_id=current_user.id,
        skill_id=user_skill.skill_id,
        proficiency_level=user_skill.proficiency_level,
        hours_practiced=user_skill.hours_practiced
    )
    
    db.add(db_user_skill)
    db.commit()
    db.refresh(db_user_skill)
    
    return db_user_skill

@router.put("/{skill_id}", response_model=UserSkillResponse)
async def update_user_skill(
    skill_id: int,
    skill_update: UserSkillUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's skill proficiency"""
    user_skill = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id,
        UserSkill.skill_id == skill_id
    ).first()
    
    if not user_skill:
        raise HTTPException(status_code=404, detail="User skill not found")
    
    # Update fields
    update_data = skill_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user_skill, field, value)
    
    db.commit()
    db.refresh(user_skill)
    
    return user_skill

@router.delete("/{skill_id}")
async def delete_user_skill(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a skill from user's profile"""
    user_skill = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id,
        UserSkill.skill_id == skill_id
    ).first()
    
    if not user_skill:
        raise HTTPException(status_code=404, detail="User skill not found")
    
    db.delete(user_skill)
    db.commit()
    
    return {"message": "Skill removed successfully"}
