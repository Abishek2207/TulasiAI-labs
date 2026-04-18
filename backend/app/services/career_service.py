from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from typing import List, Dict, Any, Optional
from datetime import datetime
from uuid import UUID

from app.models.profile import Profile
from app.models.skill import Skill
from app.models.career_prediction import CareerPrediction
from app.schemas.career import CareerPredictionRequest, CareerPredictionResponse
from app.core.exceptions import CareerException

class CareerService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def predict_career(self, user_id: UUID, request: CareerPredictionRequest) -> CareerPredictionResponse:
        """Generate AI-powered career prediction based on user skills and profile"""
        try:
            # Get user profile
            profile_result = await self.db.execute(
                select(Profile).where(Profile.user_id == user_id)
            )
            profile = profile_result.scalar_one_or_none()
            if not profile:
                raise CareerException("Profile not found")

            # Get user skills
            skills_result = await self.db.execute(
                select(Skill).where(Skill.user_id == user_id)
            )
            skills = skills_result.scalars().all()
            
            # Extract skill names and levels
            user_skills = [skill.skill_name for skill in skills]
            skill_levels = {skill.skill_name: skill.proficiency_level for skill in skills}

            # Generate career prediction
            prediction_data = self._generate_career_prediction(
                user_skills, 
                skill_levels, 
                profile, 
                request
            )

            # Save prediction to database
            new_prediction = CareerPrediction(
                user_id=user_id,
                suggested_roles=prediction_data["suggested_roles"],
                salary_range=prediction_data["salary_range"],
                confidence_score=prediction_data["confidence_score"],
                skill_gap_analysis=prediction_data["skill_gap_analysis"],
                insights=prediction_data["insights"],
                roadmap=prediction_data["roadmap"],
                market_trends=prediction_data["market_trends"]
            )
            
            self.db.add(new_prediction)
            await self.db.commit()

            return CareerPredictionResponse(
                success=True,
                data=prediction_data,
                message="Career prediction generated successfully"
            )
        except Exception as e:
            await self.db.rollback()
            raise CareerException(f"Failed to predict career: {str(e)}")

    def _generate_career_prediction(self, user_skills: List[str], skill_levels: Dict[str, int], 
                                   profile: Profile, request: CareerPredictionRequest) -> Dict[str, Any]:
        """Generate career prediction using AI logic"""
        
        # Career matching algorithm
        suggested_roles = self._match_career_roles(user_skills, skill_levels, profile)
        
        # Salary calculation
        salary_range = self._calculate_salary(user_skills, skill_levels, profile)
        
        # Generate roadmap
        roadmap = self._generate_roadmap(suggested_roles[0]["title"] if suggested_roles else "Developer", user_skills)
        
        # Skill gap analysis
        skill_gap_analysis = self._analyze_skill_gaps(user_skills, suggested_roles[0]["required_skills"] if suggested_roles else [])
        
        # Generate insights
        insights = self._generate_insights(user_skills, profile, suggested_roles)
        
        # Calculate confidence score
        confidence_score = self._calculate_confidence_score(user_skills, skill_levels, profile)
        
        # Market trends (mock data - can be enhanced with real API)
        market_trends = self._get_market_trends()

        return {
            "suggested_roles": suggested_roles,
            "salary_range": salary_range,
            "roadmap": roadmap,
            "skill_gap_analysis": skill_gap_analysis,
            "confidence_score": confidence_score,
            "insights": insights,
            "market_trends": market_trends,
            "next_steps": self._generate_next_steps(skill_gap_analysis, suggested_roles[0] if suggested_roles else None)
        }

    def _match_career_roles(self, skills: List[str], skill_levels: Dict[str, int], profile: Profile) -> List[Dict[str, Any]]:
        """Match user skills to career roles"""
        
        career_roles = [
            {
                "title": "Full Stack Developer",
                "required_skills": ["JavaScript", "React", "Node.js", "HTML", "CSS"],
                "description": "Build end-to-end web applications using modern JavaScript frameworks and cloud technologies",
                "growth_potential": "High"
            },
            {
                "title": "Data Scientist",
                "required_skills": ["Python", "Statistics", "Machine Learning"],
                "description": "Analyze complex datasets to extract actionable insights and drive business decisions",
                "growth_potential": "Very High"
            },
            {
                "title": "Machine Learning Engineer",
                "required_skills": ["Python", "Machine Learning", "Deep Learning"],
                "description": "Design and deploy ML models at scale with real-world impact",
                "growth_potential": "Very High"
            },
            {
                "title": "DevOps Engineer",
                "required_skills": ["Docker", "Kubernetes", "AWS", "Linux"],
                "description": "Build and maintain scalable infrastructure and deployment pipelines",
                "growth_potential": "High"
            },
            {
                "title": "Frontend Developer",
                "required_skills": ["JavaScript", "React", "CSS", "HTML"],
                "description": "Create beautiful and responsive user interfaces with modern frameworks",
                "growth_potential": "Medium"
            }
        ]

        matched_roles = []
        
        for role in career_roles:
            match_count = len([skill for skill in role["required_skills"] if skill in skills])
            match_score = match_count / len(role["required_skills"])
            
            # Adjust score based on skill levels
            matching_skills = [skill for skill in role["required_skills"] if skill in skills]
            avg_skill_level = sum(skill_levels.get(skill, 0) for skill in matching_skills) / len(matching_skills) if matching_skills else 0
            
            # Experience level bonus
            exp_bonus = {"beginner": 0, "intermediate": 0.1, "advanced": 0.2, "expert": 0.3}.get(profile.experience_level, 0)
            
            final_score = (match_score * 0.6) + (avg_skill_level / 10 * 0.3) + exp_bonus
            
            matched_roles.append({
                **role,
                "match_score": round(min(1.0, final_score), 3)
            })
        
        # Sort by match score
        matched_roles.sort(key=lambda x: x["match_score"], reverse=True)
        
        return matched_roles[:3]  # Return top 3 matches

    def _calculate_salary(self, skills: List[str], skill_levels: Dict[str, int], profile: Profile) -> Dict[str, Any]:
        """Calculate salary range based on skills and experience"""
        
        base_salary = 80000
        
        # Experience multiplier
        exp_multipliers = {
            "beginner": 0.7,
            "intermediate": 1.0,
            "advanced": 1.3,
            "expert": 1.5
        }
        
        exp_multiplier = exp_multipliers.get(profile.experience_level, 1.0)
        
        # Skills bonus
        skills_bonus = len(skills) * 2000
        avg_skill_level = sum(skill_levels.values()) / len(skill_levels) if skill_levels else 1
        level_bonus = avg_skill_level * 5000
        
        # Special skill bonuses
        high_value_skills = ["Python", "Machine Learning", "AWS", "Kubernetes", "React"]
        special_bonus = sum(skill_levels.get(skill, 0) * 1000 for skill in high_value_skills if skill in skills)
        
        median = int((base_salary + skills_bonus + level_bonus + special_bonus) * exp_multiplier)
        
        return {
            "min": int(median * 0.7),
            "max": int(median * 1.5),
            "median": median,
            "currency": "USD"
        }

    def _generate_roadmap(self, target_role: str, current_skills: List[str]) -> List[Dict[str, Any]]:
        """Generate learning roadmap"""
        
        roadmaps = {
            "Full Stack Developer": [
                {
                    "title": "Foundation Building",
                    "description": "Master HTML, CSS, and JavaScript fundamentals",
                    "estimated_time": "2-3 months",
                    "skills_required": ["HTML", "CSS", "JavaScript"],
                    "resources": ["MDN Web Docs", "freeCodeCamp", "JavaScript.info"],
                    "difficulty": "beginner",
                    "prerequisites": [],
                    "completed": "HTML" in current_skills and "CSS" in current_skills and "JavaScript" in current_skills
                },
                {
                    "title": "Frontend Frameworks",
                    "description": "Learn React and modern frontend development",
                    "estimated_time": "3-4 months",
                    "skills_required": ["React", "JavaScript", "CSS"],
                    "resources": ["React Documentation", "Epic React", "React Router"],
                    "difficulty": "intermediate",
                    "prerequisites": ["Foundation Building"],
                    "completed": "React" in current_skills
                },
                {
                    "title": "Backend Development",
                    "description": "Build RESTful APIs with Node.js and Express",
                    "estimated_time": "3-4 months",
                    "skills_required": ["Node.js", "JavaScript", "API Design"],
                    "resources": ["Node.js Docs", "Express.js Guide", "REST API Tutorial"],
                    "difficulty": "intermediate",
                    "prerequisites": ["Frontend Frameworks"],
                    "completed": "Node.js" in current_skills
                }
            ],
            "Data Scientist": [
                {
                    "title": "Python Foundation",
                    "description": "Master Python programming and data analysis libraries",
                    "estimated_time": "2-3 months",
                    "skills_required": ["Python", "NumPy", "Pandas"],
                    "resources": ["Python for Data Analysis", "Kaggle Learn", "DataCamp"],
                    "difficulty": "beginner",
                    "prerequisites": [],
                    "completed": "Python" in current_skills
                },
                {
                    "title": "Statistics & Machine Learning",
                    "description": "Learn statistical concepts and ML algorithms",
                    "estimated_time": "4-6 months",
                    "skills_required": ["Statistics", "Machine Learning", "Python"],
                    "resources": ["Statistical Learning", "Scikit-learn Docs", "Machine Learning Course"],
                    "difficulty": "advanced",
                    "prerequisites": ["Python Foundation"],
                    "completed": "Machine Learning" in current_skills
                }
            ]
        }
        
        return roadmaps.get(target_role, roadmaps["Full Stack Developer"])

    def _analyze_skill_gaps(self, current_skills: List[str], required_skills: List[str]) -> List[Dict[str, Any]]:
        """Analyze skill gaps for target role"""
        
        missing_skills = [skill for skill in required_skills if skill not in current_skills]
        
        return [
            {
                "skill_name": skill,
                "current_level": None,
                "required_level": 3,
                "gap_description": f"Missing {skill} - essential for target role",
                "learning_priority": "high"
            }
            for skill in missing_skills
        ]

    def _generate_insights(self, skills: List[str], profile: Profile, suggested_roles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate career insights"""
        
        insights = []
        
        # Skill diversity insight
        if len(skills) >= 5:
            insights.append({
                "type": "strength",
                "title": "Diverse Skill Set",
                "description": "You have a diverse skill set that provides multiple career paths",
                "actionable": True,
                "priority": "high"
            })
        
        # Experience level insight
        if profile.experience_level == "advanced" or profile.experience_level == "expert":
            insights.append({
                "type": "strength",
                "title": "Strong Experience",
                "description": f"Your {profile.experience_level} experience level positions you for senior roles",
                "actionable": True,
                "priority": "medium"
            })
        
        # Top role match
        if suggested_roles and suggested_roles[0]["match_score"] > 0.7:
            insights.append({
                "type": "opportunity",
                "title": "Strong Career Match",
                "description": f"Excellent match for {suggested_roles[0]['title']} role",
                "actionable": True,
                "priority": "high"
            })
        
        # Learning consistency
        if profile.daily_learning_hours >= 3:
            insights.append({
                "type": "achievement",
                "title": "Consistent Learner",
                "description": f"Dedicated {profile.daily_learning_hours} hours daily for skill development",
                "actionable": False,
                "priority": "medium"
            })
        
        return insights

    def _calculate_confidence_score(self, skills: List[str], skill_levels: Dict[str, int], profile: Profile) -> float:
        """Calculate confidence score for prediction"""
        
        score = 0.5  # Base score
        
        # Skills contribution
        score += min(0.3, len(skills) / 10)
        
        # Skill levels contribution
        avg_level = sum(skill_levels.values()) / len(skill_levels) if skill_levels else 0
        score += min(0.2, avg_level / 10)
        
        # Experience contribution
        exp_scores = {"beginner": 0.05, "intermediate": 0.1, "advanced": 0.15, "expert": 0.2}
        score += exp_scores.get(profile.experience_level, 0)
        
        # Learning commitment
        score += min(0.1, profile.daily_learning_hours / 10)
        
        return round(min(0.95, score), 3)

    def _get_market_trends(self) -> Dict[str, Any]:
        """Get current market trends (mock data)"""
        
        return {
            "hot_skills": [
                {"skill": "Machine Learning", "growth": "+45%", "demand": "Very High"},
                {"skill": "Cloud Computing", "growth": "+38%", "demand": "Very High"},
                {"skill": "DevOps", "growth": "+35%", "demand": "High"},
                {"skill": "Full Stack Development", "growth": "+28%", "demand": "High"},
                {"skill": "Data Science", "growth": "+32%", "demand": "Very High"}
            ],
            "growing_industries": [
                {"industry": "AI/ML", "growth_rate": "+42%"},
                {"industry": "Cloud Services", "growth_rate": "+38%"},
                {"industry": "Cybersecurity", "growth_rate": "+35%"},
                {"industry": "Data Analytics", "growth_rate": "+31%"},
                {"industry": "FinTech", "growth_rate": "+28%"}
            ]
        }

    def _generate_next_steps(self, skill_gaps: List[Dict[str, Any]], top_role: Optional[Dict[str, Any]]) -> List[str]:
        """Generate actionable next steps"""
        
        steps = []
        
        # Skill gap steps
        if skill_gaps:
            top_gaps = skill_gaps[:3]
            steps.append(f"Focus on learning: {', '.join(gap['skill_name'] for gap in top_gaps)}")
        
        # Role-specific steps
        if top_role:
            steps.append(f"Build portfolio projects for {top_role['title']} role")
            steps.append(f"Network with professionals in {top_role['title']} field")
        
        # General steps
        steps.append("Update your resume with new skills and projects")
        steps.append("Prepare for technical interviews")
        steps.append("Consider relevant certifications")
        
        return steps

    async def get_prediction_history(self, user_id: UUID, limit: int = 10) -> List[Dict[str, Any]]:
        """Get user's prediction history"""
        try:
            result = await self.db.execute(
                select(CareerPrediction)
                .where(CareerPrediction.user_id == user_id)
                .order_by(CareerPrediction.created_at.desc())
                .limit(limit)
            )
            predictions = result.scalars().all()
            
            return [
                {
                    "id": str(prediction.id),
                    "suggested_roles": prediction.suggested_roles,
                    "salary_range": prediction.salary_range,
                    "confidence_score": float(prediction.confidence_score),
                    "created_at": prediction.created_at.isoformat(),
                    "prediction_version": prediction.prediction_version
                }
                for prediction in predictions
            ]
        except Exception as e:
            raise CareerException(f"Failed to get prediction history: {str(e)}")
