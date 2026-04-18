from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID

from app.database import get_async_db
from app.services.task_service import TaskService
from app.schemas.task import Task, TaskCreate, TaskUpdate, TaskResponse, TasksListResponse
from app.core.exceptions import TaskException

router = APIRouter(prefix="/tasks", tags=["tasks"])

def get_task_service(db: AsyncSession = Depends(get_async_db)) -> TaskService:
    return TaskService(db)

@router.get("/", response_model=TasksListResponse)
async def get_tasks(
    user_id: str,  # In production, this would come from JWT token
    completed: Optional[bool] = None,
    task_service: TaskService = Depends(get_task_service)
):
    """Get all user tasks, optionally filtered by completion status"""
    try:
        user_uuid = UUID(user_id)
        tasks = await task_service.get_user_tasks(user_uuid, completed)
        return TasksListResponse(
            success=True,
            data=tasks,
            message="Tasks retrieved successfully"
        )
    except TaskException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    user_id: str,  # In production, this would come from JWT token
    task_service: TaskService = Depends(get_task_service)
):
    """Get a specific task"""
    try:
        task_uuid = UUID(task_id)
        user_uuid = UUID(user_id)
        task = await task_service.get_task_by_id(task_uuid, user_uuid)
        
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        return TaskResponse(
            success=True,
            data=task,
            message="Task retrieved successfully"
        )
    except TaskException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/", response_model=TaskResponse)
async def create_task(
    task_data: TaskCreate,
    user_id: str,  # In production, this would come from JWT token
    task_service: TaskService = Depends(get_task_service)
):
    """Create a new task"""
    try:
        user_uuid = UUID(user_id)
        task = await task_service.create_task(user_uuid, task_data)
        return TaskResponse(
            success=True,
            data=task,
            message="Task created successfully"
        )
    except TaskException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    user_id: str,  # In production, this would come from JWT token
    task_service: TaskService = Depends(get_task_service)
):
    """Update a task"""
    try:
        task_uuid = UUID(task_id)
        user_uuid = UUID(user_id)
        task = await task_service.update_task(task_uuid, user_uuid, task_data)
        
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        return TaskResponse(
            success=True,
            data=task,
            message="Task updated successfully"
        )
    except TaskException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.put("/{task_id}/complete", response_model=TaskResponse)
async def complete_task(
    task_id: str,
    user_id: str,  # In production, this would come from JWT token
    task_service: TaskService = Depends(get_task_service)
):
    """Mark a task as completed"""
    try:
        task_uuid = UUID(task_id)
        user_uuid = UUID(user_id)
        task = await task_service.complete_task(task_uuid, user_uuid)
        
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        return TaskResponse(
            success=True,
            data=task,
            message="Task completed successfully"
        )
    except TaskException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    user_id: str,  # In production, this would come from JWT token
    task_service: TaskService = Depends(get_task_service)
):
    """Delete a task"""
    try:
        task_uuid = UUID(task_id)
        user_uuid = UUID(user_id)
        success = await task_service.delete_task(task_uuid, user_uuid)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        return {"success": True, "message": "Task deleted successfully"}
    except TaskException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/type/{task_type}", response_model=TasksListResponse)
async def get_tasks_by_type(
    task_type: str,
    user_id: str,  # In production, this would come from JWT token
    task_service: TaskService = Depends(get_task_service)
):
    """Get tasks by type"""
    try:
        user_uuid = UUID(user_id)
        tasks = await task_service.get_tasks_by_type(user_uuid, task_type)
        return TasksListResponse(
            success=True,
            data=tasks,
            message=f"Tasks of type {task_type} retrieved successfully"
        )
    except TaskException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/overdue/list", response_model=TasksListResponse)
async def get_overdue_tasks(
    user_id: str,  # In production, this would come from JWT token
    task_service: TaskService = Depends(get_task_service)
):
    """Get overdue tasks"""
    try:
        user_uuid = UUID(user_id)
        tasks = await task_service.get_overdue_tasks(user_uuid)
        return TasksListResponse(
            success=True,
            data=tasks,
            message="Overdue tasks retrieved successfully"
        )
    except TaskException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/statistics/summary")
async def get_task_statistics(
    user_id: str,  # In production, this would come from JWT token
    task_service: TaskService = Depends(get_task_service)
):
    """Get task statistics"""
    try:
        user_uuid = UUID(user_id)
        stats = await task_service.get_task_statistics(user_uuid)
        return {
            "success": True,
            "data": stats,
            "message": "Task statistics retrieved successfully"
        }
    except TaskException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/generate/daily", response_model=TasksListResponse)
async def generate_daily_tasks(
    user_id: str,  # In production, this would come from JWT token
    daily_hours: int = 2,
    task_service: TaskService = Depends(get_task_service)
):
    """Generate daily tasks based on user profile"""
    try:
        user_uuid = UUID(user_id)
        tasks = await task_service.generate_daily_tasks(user_uuid, daily_hours)
        return TasksListResponse(
            success=True,
            data=tasks,
            message="Daily tasks generated successfully"
        )
    except TaskException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
