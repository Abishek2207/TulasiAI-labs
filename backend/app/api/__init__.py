from .auth import router as auth_router
from .profile import router as profile_router
from .skills import router as skills_router
from .tasks import router as tasks_router
from .predict_career import router as predict_career_router
from .notifications import router as notifications_router

__all__ = [
    "auth_router",
    "profile_router", 
    "skills_router",
    "tasks_router",
    "predict_career_router",
    "notifications_router"
]
