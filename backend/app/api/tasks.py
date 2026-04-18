from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

from app.database import get_db
from app.models.career import User, Task
from app.schemas.career import TaskCreate, TaskUpdate, TaskResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/", response_model=List[TaskResponse])
async def get_user_tasks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's tasks"""
    tasks = db.query(Task).filter(Task.user_id == current_user.id).all()
    return tasks

@router.post("/", response_model=TaskResponse)
async def create_task(
    task: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new task for the user"""
    db_task = Task(
        user_id=current_user.id,
        title=task.title,
        description=task.description,
        task_type=task.task_type,
        difficulty=task.difficulty,
        estimated_hours=task.estimated_hours,
        due_date=task.due_date
    )
    
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    return db_task

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a task"""
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update fields
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field == "completed" and value == True:
            task.completed_at = datetime.utcnow()
        setattr(task, field, value)
    
    db.commit()
    db.refresh(task)
    
    return task

@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a task"""
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(task)
    db.commit()
    
    return {"message": "Task deleted successfully"}

@router.post("/generate-daily")
async def generate_daily_tasks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate daily learning tasks based on user's profile"""
    
    # Mock task generation based on user's experience and goals
    task_templates = {
        "beginner": [
            {"title": "Complete Python basics tutorial", "type": "learning", "hours": 1.5},
            {"title": "Practice basic algorithms", "type": "practice", "hours": 1.0},
            {"title": "Review data structures", "type": "review", "hours": 0.5}
        ],
        "intermediate": [
            {"title": "Build a React component", "type": "practice", "hours": 2.0},
            {"title": "Learn advanced JavaScript concepts", "type": "learning", "hours": 1.5},
            {"title": "Debug existing code", "type": "practice", "hours": 1.0}
        ],
        "advanced": [
            {"title": "Design system architecture", "type": "practice", "hours": 2.5},
            {"title": "Research new technologies", "type": "learning", "hours": 1.0},
            {"title": "Code review and optimization", "type": "practice", "hours": 1.5}
        ]
    }
    
    templates = task_templates.get(current_user.experience_level, task_templates["beginner"])
    
    # Clear existing uncompleted tasks for today
    today = datetime.now().date()
    db.query(Task).filter(
        Task.user_id == current_user.id,
        Task.completed == False,
        Task.due_date >= today,
        Task.due_date < today + timedelta(days=1)
    ).delete()
    
    # Generate new tasks
    created_tasks = []
    for i, template in enumerate(templates[:current_user.daily_learning_hours]):
        due_time = datetime.now() + timedelta(hours=i*2)
        
        task = Task(
            user_id=current_user.id,
            title=template["title"],
            task_type=template["type"],
            estimated_hours=template["hours"],
            due_date=due_time,
            description=f"Daily learning task for {current_user.experience_level} level"
        )
        
        db.add(task)
        created_tasks.append(task)
    
    db.commit()
    
    return {"message": f"Generated {len(created_tasks)} daily tasks", "tasks": len(created_tasks)}

@router.get("/stats")
async def get_task_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get task completion statistics"""
    
    total_tasks = db.query(Task).filter(Task.user_id == current_user.id).count()
    completed_tasks = db.query(Task).filter(
        Task.user_id == current_user.id,
        Task.completed == True
    ).count()
    
    # This week's tasks
    week_start = datetime.now() - timedelta(days=datetime.now().weekday())
    week_tasks = db.query(Task).filter(
        Task.user_id == current_user.id,
        Task.created_at >= week_start
    ).count()
    
    week_completed = db.query(Task).filter(
        Task.user_id == current_user.id,
        Task.completed == True,
        Task.completed_at >= week_start
    ).count()
    
    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "completion_rate": (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
        "week_tasks": week_tasks,
        "week_completed": week_completed,
        "week_completion_rate": (week_completed / week_tasks * 100) if week_tasks > 0 else 0
    }
