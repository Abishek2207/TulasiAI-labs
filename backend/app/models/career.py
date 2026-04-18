from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    current_role = Column(String)
    target_role = Column(String)
    company = Column(String)
    experience_level = Column(String)  # beginner, intermediate, advanced
    daily_learning_hours = Column(Integer, default=1)
    streak_count = Column(Integer, default=0)
    last_login = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    skills = relationship("UserSkill", back_populates="user")
    tasks = relationship("Task", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    certifications = relationship("Certification", back_populates="user")

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    description = Column(Text)
    difficulty_level = Column(String)  # beginner, intermediate, advanced
    
    # Relationships
    user_skills = relationship("UserSkill", back_populates="skill")

class UserSkill(Base):
    __tablename__ = "user_skills"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    proficiency_level = Column(Integer, default=0)  # 0-100
    hours_practiced = Column(Integer, default=0)
    last_practiced = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="skills")
    skill = relationship("Skill", back_populates="user_skills")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    task_type = Column(String)  # learning, practice, review
    difficulty = Column(String)
    estimated_hours = Column(Float, default=1.0)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime)
    due_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="tasks")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String)  # trend, course, achievement, reminder
    read = Column(Boolean, default=False)
    metadata = Column(JSON)  # Additional data like course links, etc.
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="notifications")

class Certification(Base):
    __tablename__ = "certifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    issuer = Column(String, nullable=False)  # Google, Microsoft, etc.
    credential_url = Column(String)
    issue_date = Column(DateTime)
    expiry_date = Column(DateTime)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="certifications")

class CareerPrediction(Base):
    __tablename__ = "career_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    current_skills = Column(JSON)
    target_roles = Column(JSON)
    salary_range = Column(JSON)  # min, max, currency
    roadmap = Column(JSON)  # Array of steps
    confidence_score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
