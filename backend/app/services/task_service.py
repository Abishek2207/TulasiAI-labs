from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, and_, func
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from uuid import UUID

from app.models.task import Task
from app.schemas.task import Task, TaskCreate, TaskUpdate
from app.core.exceptions import TaskException

class TaskService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_tasks(self, user_id: UUID, completed: Optional[bool] = None) -> List[Task]:
        """Get all tasks for a user, optionally filtered by completion status"""
        try:
            query = select(Task).where(Task.user_id == user_id)
            
            if completed is not None:
                query = query.where(Task.completed == completed)
            
            query = query.order_by(Task.created_at.desc())
            
            result = await self.db.execute(query)
            tasks = result.scalars().all()
            
            return [
                Task(
                    id=task.id,
                    user_id=task.user_id,
                    title=task.title,
                    description=task.description,
                    task_type=task.task_type,
                    difficulty=task.difficulty,
                    estimated_hours=float(task.estimated_hours),
                    completed=task.completed,
                    completed_at=task.completed_at,
                    due_date=task.due_date,
                    priority=task.priority,
                    created_at=task.created_at,
                    updated_at=task.updated_at
                )
                for task in tasks
            ]
        except Exception as e:
            raise TaskException(f"Failed to get user tasks: {str(e)}")

    async def get_task_by_id(self, task_id: UUID, user_id: UUID) -> Optional[Task]:
        """Get a specific task by ID"""
        try:
            result = await self.db.execute(
                select(Task).where(and_(Task.id == task_id, Task.user_id == user_id))
            )
            task = result.scalar_one_or_none()
            
            if not task:
                return None
                
            return Task(
                id=task.id,
                user_id=task.user_id,
                title=task.title,
                description=task.description,
                task_type=task.task_type,
                difficulty=task.difficulty,
                estimated_hours=float(task.estimated_hours),
                completed=task.completed,
                completed_at=task.completed_at,
                due_date=task.due_date,
                priority=task.priority,
                created_at=task.created_at,
                updated_at=task.updated_at
            )
        except Exception as e:
            raise TaskException(f"Failed to get task: {str(e)}")

    async def create_task(self, user_id: UUID, task_data: TaskCreate) -> Task:
        """Create a new task"""
        try:
            new_task = Task(
                user_id=user_id,
                **task_data.model_dump()
            )
            
            self.db.add(new_task)
            await self.db.commit()
            await self.db.refresh(new_task)
            
            return Task(
                id=new_task.id,
                user_id=new_task.user_id,
                title=new_task.title,
                description=new_task.description,
                task_type=new_task.task_type,
                difficulty=new_task.difficulty,
                estimated_hours=float(new_task.estimated_hours),
                completed=new_task.completed,
                completed_at=new_task.completed_at,
                due_date=new_task.due_date,
                priority=new_task.priority,
                created_at=new_task.created_at,
                updated_at=new_task.updated_at
            )
        except Exception as e:
            await self.db.rollback()
            raise TaskException(f"Failed to create task: {str(e)}")

    async def update_task(self, task_id: UUID, user_id: UUID, task_data: TaskUpdate) -> Optional[Task]:
        """Update an existing task"""
        try:
            result = await self.db.execute(
                select(Task).where(and_(Task.id == task_id, Task.user_id == user_id))
            )
            task = result.scalar_one_or_none()
            if not task:
                return None

            # Update only provided fields
            update_data = task_data.model_dump(exclude_unset=True)
            
            # Handle completion timestamp
            if 'completed' in update_data and update_data['completed'] and not task.completed:
                update_data['completed_at'] = datetime.utcnow()
            elif 'completed' in update_data and not update_data['completed']:
                update_data['completed_at'] = None
            
            if update_data:
                await self.db.execute(
                    update(Task)
                    .where(and_(Task.id == task_id, Task.user_id == user_id))
                    .values(**update_data)
                )
                await self.db.commit()
            
            return await self.get_task_by_id(task_id, user_id)
        except Exception as e:
            await self.db.rollback()
            raise TaskException(f"Failed to update task: {str(e)}")

    async def complete_task(self, task_id: UUID, user_id: UUID) -> Optional[Task]:
        """Mark a task as completed"""
        try:
            result = await self.db.execute(
                select(Task).where(and_(Task.id == task_id, Task.user_id == user_id))
            )
            task = result.scalar_one_or_none()
            if not task:
                return None

            if task.completed:
                return await self.get_task_by_id(task_id, user_id)

            await self.db.execute(
                update(Task)
                .where(and_(Task.id == task_id, Task.user_id == user_id))
                .values(
                    completed=True,
                    completed_at=datetime.utcnow()
                )
            )
            await self.db.commit()
            
            return await self.get_task_by_id(task_id, user_id)
        except Exception as e:
            await self.db.rollback()
            raise TaskException(f"Failed to complete task: {str(e)}")

    async def delete_task(self, task_id: UUID, user_id: UUID) -> bool:
        """Delete a task"""
        try:
            result = await self.db.execute(
                delete(Task).where(and_(Task.id == task_id, Task.user_id == user_id))
            )
            await self.db.commit()
            return result.rowcount > 0
        except Exception as e:
            await self.db.rollback()
            raise TaskException(f"Failed to delete task: {str(e)}")

    async def get_tasks_by_type(self, user_id: UUID, task_type: str) -> List[Task]:
        """Get tasks by type"""
        try:
            result = await self.db.execute(
                select(Task).where(and_(Task.user_id == user_id, Task.task_type == task_type))
                .order_by(Task.created_at.desc())
            )
            tasks = result.scalars().all()
            
            return [
                Task(
                    id=task.id,
                    user_id=task.user_id,
                    title=task.title,
                    description=task.description,
                    task_type=task.task_type,
                    difficulty=task.difficulty,
                    estimated_hours=float(task.estimated_hours),
                    completed=task.completed,
                    completed_at=task.completed_at,
                    due_date=task.due_date,
                    priority=task.priority,
                    created_at=task.created_at,
                    updated_at=task.updated_at
                )
                for task in tasks
            ]
        except Exception as e:
            raise TaskException(f"Failed to get tasks by type: {str(e)}")

    async def get_overdue_tasks(self, user_id: UUID) -> List[Task]:
        """Get overdue tasks"""
        try:
            now = datetime.utcnow()
            result = await self.db.execute(
                select(Task).where(
                    and_(
                        Task.user_id == user_id,
                        Task.due_date < now,
                        Task.completed == False
                    )
                ).order_by(Task.due_date.asc())
            )
            tasks = result.scalars().all()
            
            return [
                Task(
                    id=task.id,
                    user_id=task.user_id,
                    title=task.title,
                    description=task.description,
                    task_type=task.task_type,
                    difficulty=task.difficulty,
                    estimated_hours=float(task.estimated_hours),
                    completed=task.completed,
                    completed_at=task.completed_at,
                    due_date=task.due_date,
                    priority=task.priority,
                    created_at=task.created_at,
                    updated_at=task.updated_at
                )
                for task in tasks
            ]
        except Exception as e:
            raise TaskException(f"Failed to get overdue tasks: {str(e)}")

    async def get_task_statistics(self, user_id: UUID) -> Dict[str, Any]:
        """Get task statistics for a user"""
        try:
            # Total tasks
            total_result = await self.db.execute(
                select(func.count(Task.id)).where(Task.user_id == user_id)
            )
            total_tasks = total_result.scalar() or 0

            # Completed tasks
            completed_result = await self.db.execute(
                select(func.count(Task.id)).where(
                    and_(Task.user_id == user_id, Task.completed == True)
                )
            )
            completed_tasks = completed_result.scalar() or 0

            # Pending tasks
            pending_tasks = total_tasks - completed_tasks

            # Tasks by type
            type_result = await self.db.execute(
                select(Task.task_type, func.count(Task.id).label('count'))
                .where(Task.user_id == user_id)
                .group_by(Task.task_type)
            )
            tasks_by_type = {task_type: count for task_type, count in type_result}

            # Tasks by priority
            priority_result = await self.db.execute(
                select(Task.priority, func.count(Task.id).label('count'))
                .where(Task.user_id == user_id)
                .group_by(Task.priority)
            )
            tasks_by_priority = {priority: count for priority, count in priority_result}

            # Total estimated hours
            hours_result = await self.db.execute(
                select(func.sum(Task.estimated_hours)).where(Task.user_id == user_id)
            )
            total_estimated_hours = hours_result.scalar() or 0

            # Overdue tasks
            now = datetime.utcnow()
            overdue_result = await self.db.execute(
                select(func.count(Task.id)).where(
                    and_(
                        Task.user_id == user_id,
                        Task.due_date < now,
                        Task.completed == False
                    )
                )
            )
            overdue_tasks = overdue_result.scalar() or 0

            # Completion rate
            completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0

            return {
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "pending_tasks": pending_tasks,
                "overdue_tasks": overdue_tasks,
                "tasks_by_type": tasks_by_type,
                "tasks_by_priority": tasks_by_priority,
                "total_estimated_hours": float(total_estimated_hours),
                "completion_rate": round(completion_rate, 2)
            }
        except Exception as e:
            raise TaskException(f"Failed to get task statistics: {str(e)}")

    async def generate_daily_tasks(self, user_id: UUID, daily_hours: int) -> List[Task]:
        """Generate daily tasks based on user profile and learning goals"""
        try:
            # This is a simplified version - can be enhanced with AI
            task_templates = [
                {
                    "title": "Practice coding exercises",
                    "description": "Complete daily coding challenges",
                    "task_type": "practice",
                    "difficulty": "intermediate",
                    "estimated_hours": 1.0,
                    "priority": "high"
                },
                {
                    "title": "Read technical documentation",
                    "description": "Study new technologies and frameworks",
                    "task_type": "learning",
                    "difficulty": "beginner",
                    "estimated_hours": 0.5,
                    "priority": "medium"
                },
                {
                    "title": "Work on personal project",
                    "description": "Build features for your portfolio project",
                    "task_type": "project",
                    "difficulty": "intermediate",
                    "estimated_hours": 2.0,
                    "priority": "high"
                }
            ]

            created_tasks = []
            for template in task_templates:
                task_data = TaskCreate(**template)
                task = await self.create_task(user_id, task_data)
                created_tasks.append(task)

            return created_tasks
        except Exception as e:
            raise TaskException(f"Failed to generate daily tasks: {str(e)}")
