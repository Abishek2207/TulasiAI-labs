from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List, Dict, Any, Optional
from uuid import UUID

from app.models.task import Task
from app.models.profile import Profile
from app.core.exceptions import CareerException

class RoadmapService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_daily_plan(self, user_id: UUID, day: int, duration: int) -> Dict[str, Any]:
        """
        Simulates the 'Daily Plan Generator' logic for the adaptive path.
        """
        # In a real scenario, this would check if the task exists for the user/day
        # or generate it dynamically using an LLM.
        
        # Get profile for context
        result = await self.db.execute(
            select(Profile).where(Profile.user_id == user_id)
        )
        profile = result.scalar_one_or_none()
        
        # Rule-based generator for MVP
        role = profile.current_role or "Software Engineer"
        
        plans = {
            1: {
                "title": "AI-Augmented Architecture",
                "concept": f"Traditional {role} patterns vs. AI-Agentic Orchestration.",
                "task": "Design a system diagram for a self-healing service.",
                "real_world_application": "Handling production outages with automated diagnosis agents.",
                "ai_tool_usage": "Utilize Cursor/Claude-3.5-Sonnet for boilerplate and V0 for UI.",
                "communication_task": "Explain your AI-first architecture in 2 lines for a non-technical manager."
            },
            2: {
                "title": "Prompt Engineering for Engineering Managers",
                "concept": "Chain-of-Thought vs. Few-Shot Prompting in Code Reviews.",
                "task": "Create a system prompt that audits PRs for security vulnerabilities.",
                "real_world_application": "Reducing PR review time by 40% using automated AI auditing.",
                "ai_tool_usage": "OpenAI Playground / Anthropic Console for prompt testing.",
                "communication_task": "Write a professional email explaining why a 'manual' QA process is now redundant."
            }
        }
        
        content = plans.get(day, plans[1])
        
        return {
            "day": day,
            "duration": f"{duration} hours",
            "content": content
        }
