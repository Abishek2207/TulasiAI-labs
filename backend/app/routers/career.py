from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.database import get_async_db
from app.services.career_service import CareerService
from app.schemas.career import CareerPredictionRequest, CareerPredictionResponse
from app.core.exceptions import CareerException

router = APIRouter(prefix="/predict-career", tags=["career"])

def get_career_service(db: AsyncSession = Depends(get_async_db)) -> CareerService:
    return CareerService(db)

@router.post("/", response_model=CareerPredictionResponse)
async def predict_career(
    request: CareerPredictionRequest,
    user_id: str,  # In production, this would come from JWT token
    career_service: CareerService = Depends(get_career_service)
):
    """Generate AI-powered career prediction"""
    try:
        user_uuid = UUID(user_id)
        prediction = await career_service.predict_career(user_uuid, request)
        return prediction
    except CareerException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/history")
async def get_prediction_history(
    user_id: str,  # In production, this would come from JWT token
    limit: int = 10,
    career_service: CareerService = Depends(get_career_service)
):
    """Get user's prediction history"""
    try:
        user_uuid = UUID(user_id)
        history = await career_service.get_prediction_history(user_uuid, limit)
        return {
            "success": True,
            "data": history,
            "message": "Prediction history retrieved successfully"
        }
    except CareerException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
