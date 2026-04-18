from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from typing import List, Dict, Any, Optional
import json
from datetime import datetime

from app.models.user import User, UserSkill, Skill
from app.schemas.career import (
    CareerPredictionResponse,
    SuggestedRole,
    SalaryRange,
    RoadmapStep,
    SkillGapAnalysis,
    CareerInsight
)
from app.core.exceptions import AIServiceException

class AIService:
    def __init__(self, db: Session):
        self.db = db

    async def predict_career(
        self, 
        user_id: int,
        current_skills: List[str],
        interests: List[str],
        current_level: str,
        target_roles: Optional[List[str]] = None
    ) -> CareerPredictionResponse:
        """Generate comprehensive career prediction using rule-based AI logic"""
        try:
            # Get user's existing skills from database
            user_skills_data = self._get_user_skills_data(user_id)
            
            # Generate suggested roles
            suggested_roles = self._generate_suggested_roles(
                current_skills, 
                interests, 
                current_level,
                user_skills_data
            )
            
            # Calculate salary range
            salary_range = self._calculate_salary_range(suggested_roles, current_level)
            
            # Generate roadmap
            roadmap = self._generate_roadmap(suggested_roles, current_skills, current_level)
            
            # Analyze skill gaps
            skill_gap_analysis = self._analyze_skill_gaps(
                current_skills, 
                suggested_roles
            )
            
            # Generate insights
            insights = self._generate_career_insights(
                current_skills, 
                current_level,
                suggested_roles
            )
            
            # Calculate confidence score
            confidence_score = self._calculate_confidence_score(
                current_skills, 
                current_level,
                user_skills_data
            )
            
            # Get market trends
            market_trends = await self._get_market_trends()
            
            return CareerPredictionResponse(
                suggested_roles=suggested_roles,
                salary_range=salary_range,
                roadmap=roadmap,
                skill_gap_analysis=skill_gap_analysis,
                confidence_score=confidence_score,
                insights=insights,
                market_trends=market_trends,
                next_steps=self._generate_next_steps(suggested_roles, skill_gap_analysis)
            )
        except Exception as e:
            raise AIServiceException(f"Failed to predict career: {str(e)}")

    def _get_user_skills_data(self, user_id: int) -> Dict[str, int]:
        """Get user's skills with levels from database"""
        user_skills = (
            self.db.query(UserSkill, Skill.name)
            .join(Skill)
            .filter(UserSkill.user_id == user_id)
            .all()
        )
        return {skill.name: skill.proficiency_level for skill, skill in user_skills}

    def _generate_suggested_roles(
        self, 
        skills: List[str], 
        interests: List[str], 
        level: str,
        user_skills_data: Dict[str, int]
    ) -> List[SuggestedRole]:
        """Generate suggested roles based on skills and interests"""
        
        # Role-skill mapping for matching
        role_requirements = {
            "Full Stack Developer": {
                "required_skills": ["JavaScript", "React", "Node.js", "HTML", "CSS"],
                "preferred_skills": ["Python", "TypeScript", "Docker"],
                "growth_potential": "High"
            },
            "Data Scientist": {
                "required_skills": ["Python", "Statistics", "Machine Learning"],
                "preferred_skills": ["SQL", "R", "TensorFlow"],
                "growth_potential": "Very High"
            },
            "Machine Learning Engineer": {
                "required_skills": ["Python", "Machine Learning", "Deep Learning"],
                "preferred_skills": ["TensorFlow", "PyTorch", "Kubernetes"],
                "growth_potential": "Very High"
            },
            "DevOps Engineer": {
                "required_skills": ["Linux", "Docker", "Kubernetes", "CI/CD"],
                "preferred_skills": ["AWS", "Azure", "Terraform"],
                "growth_potential": "High"
            },
            "Product Manager": {
                "required_skills": ["Communication", "Leadership", "Strategy"],
                "preferred_skills": ["Analytics", "Agile", "SQL"],
                "growth_potential": "Medium"
            },
            "UX/UI Designer": {
                "required_skills": ["Figma", "Adobe XD", "HTML", "CSS"],
                "preferred_skills": ["JavaScript", "React", "Design Systems"],
                "growth_potential": "Medium"
            }
        }
        
        suggested_roles = []
        
        for role_name, requirements in role_requirements.items():
            match_score = self._calculate_role_match_score(
                skills, 
                interests, 
                level,
                requirements,
                user_skills_data
            )
            
            if match_score > 0.3:  # Only include roles with decent match
                suggested_roles.append(SuggestedRole(
                    title=role_name,
                    match_score=match_score,
                    description=self._generate_role_description(role_name, requirements),
                    required_skills=requirements["required_skills"],
                    growth_potential=requirements["growth_potential"]
                ))
        
        # Sort by match score
        suggested_roles.sort(key=lambda x: x.match_score, reverse=True)
        return suggested_roles[:5]  # Return top 5 suggestions

    def _calculate_role_match_score(
        self, 
        skills: List[str], 
        interests: List[str], 
        level: str,
        requirements: Dict[str, Any],
        user_skills_data: Dict[str, int]
    ) -> float:
        """Calculate how well a user matches a role"""
        score = 0.0
        
        # Required skills match (40% weight)
        required_skills = requirements["required_skills"]
        matched_required = sum(1 for skill in required_skills if skill in skills)
        required_score = (matched_required / len(required_skills)) * 0.4
        
        # Preferred skills bonus (20% weight)
        preferred_skills = requirements.get("preferred_skills", [])
        matched_preferred = sum(1 for skill in preferred_skills if skill in skills)
        preferred_score = (matched_preferred / len(preferred_skills)) * 0.2
        
        # Experience level match (20% weight)
        level_match = self._calculate_level_match(level, requirements)
        level_score = level_match * 0.2
        
        # Interest alignment (10% weight)
        interest_bonus = 0.1 if any(interest.lower() in " ".join(interests).lower() for interest in interests) else 0
        
        # Current skill proficiency bonus (10% weight)
        skill_bonus = 0.1
        if user_skills_data:
            avg_proficiency = sum(user_skills_data.values()) / len(user_skills_data)
            skill_bonus = min(0.1, avg_proficiency / 100)
        
        score = required_score + preferred_score + level_score + interest_bonus + skill_bonus
        return min(1.0, score)

    def _calculate_level_match(self, current_level: str, requirements: Dict[str, Any]) -> float:
        """Calculate experience level match for role"""
        level_requirements = {
            "beginner": ["Product Manager", "UX/UI Designer"],
            "intermediate": ["Full Stack Developer", "DevOps Engineer"],
            "advanced": ["Data Scientist", "Machine Learning Engineer"]
        }
        
        for role in level_requirements.get(current_level, []):
            if role in requirements.get("required_skills", []):
                return 1.0
        
        return 0.5  # Partial match

    def _generate_role_description(self, role_name: str, requirements: Dict[str, Any]) -> str:
        """Generate compelling role description"""
        descriptions = {
            "Full Stack Developer": "Build end-to-end web applications using modern JavaScript frameworks and cloud technologies. High demand across all industries.",
            "Data Scientist": "Analyze complex datasets to extract actionable insights. Drive business decisions through statistical analysis and machine learning.",
            "Machine Learning Engineer": "Design and deploy ML models at scale. Work on cutting-edge AI projects with real-world impact.",
            "DevOps Engineer": "Streamline development operations through automation and cloud infrastructure management. Critical for modern tech companies.",
            "Product Manager": "Lead product development from conception to launch. Bridge technical and business teams to deliver user value.",
            "UX/UI Designer": "Create intuitive and beautiful user experiences. Transform complex requirements into elegant, user-friendly designs."
        }
        return descriptions.get(role_name, f"Exciting opportunity in {role_name} with growth potential.")

    def _calculate_salary_range(self, suggested_roles: List[SuggestedRole], current_level: str) -> SalaryRange:
        """Calculate realistic salary range based on roles and experience"""
        if not suggested_roles:
            return SalaryRange(min=50000, max=80000)
        
        # Base salaries by role (2024 data)
        base_salaries = {
            "Full Stack Developer": {"min": 80000, "max": 160000},
            "Data Scientist": {"min": 90000, "max": 180000},
            "Machine Learning Engineer": {"min": 110000, "max": 220000},
            "DevOps Engineer": {"min": 85000, "max": 170000},
            "Product Manager": {"min": 70000, "max": 140000},
            "UX/UI Designer": {"min": 65000, "max": 130000}
        }
        
        # Calculate weighted average based on match scores
        total_weight = sum(role.match_score for role in suggested_roles)
        if total_weight == 0:
            return SalaryRange(min=50000, max=80000)
        
        weighted_min = sum(
            base_salaries.get(role.title, {"min": 50000})["min"] * role.match_score 
            for role in suggested_roles
        ) / total_weight
        
        weighted_max = sum(
            base_salaries.get(role.title, {"max": 80000})["max"] * role.match_score 
            for role in suggested_roles
        ) / total_weight
        
        # Apply experience multiplier
        level_multipliers = {
            "beginner": 0.7,
            "intermediate": 1.0,
            "advanced": 1.3,
            "expert": 1.5
        }
        
        multiplier = level_multipliers.get(current_level, 1.0)
        
        return SalaryRange(
            min=int(weighted_min * multiplier),
            max=int(weighted_max * multiplier),
            median=int((weighted_min + weighted_max) * multiplier / 2)
        )

    def _generate_roadmap(
        self, 
        suggested_roles: List[SuggestedRole], 
        current_skills: List[str], 
        current_level: str
    ) -> List[RoadmapStep]:
        """Generate personalized career roadmap"""
        if not suggested_roles:
            return []
        
        top_role = suggested_roles[0]  # Use top suggested role
        
        roadmap_steps = [
            RoadmapStep(
                title="Foundation Building",
                description=f"Master core {top_role.title} fundamentals and build a strong foundation",
                estimated_time="2-3 months",
                skills_required=self._get_foundation_skills(top_role.title),
                resources=["Coursera", "Udemy", "freeCodeCamp", "YouTube tutorials"],
                difficulty="Beginner",
                prerequisites=[],
                completed=False
            ),
            RoadmapStep(
                title="Skill Specialization",
                description=f"Develop advanced {top_role.title} skills and specialize in high-demand areas",
                estimated_time="3-4 months",
                skills_required=self._get_specialization_skills(top_role.title),
                resources=["Advanced courses", "Professional certifications", "Open source projects"],
                difficulty="Intermediate",
                prerequisites=["Foundation Building"],
                completed=False
            ),
            RoadmapStep(
                title="Portfolio Development",
                description="Build impressive projects showcasing your {top_role.title} expertise",
                estimated_time="2-3 months",
                skills_required=self._get_portfolio_skills(top_role.title),
                resources=["GitHub", "Personal website", "Hackathons", "Freelance projects"],
                difficulty="Intermediate",
                prerequisites=["Skill Specialization"],
                completed=False
            ),
            RoadmapStep(
                title="Professional Networking",
                description="Connect with industry professionals and join {top_role.title} communities",
                estimated_time="Ongoing",
                skills_required=["Communication", "LinkedIn", "Twitter", "Meetups", "Conferences"],
                resources=["LinkedIn", "Industry meetups", "Professional conferences", "Online forums"],
                difficulty="All levels",
                prerequisites=["Portfolio Development"],
                completed=False
            ),
            RoadmapStep(
                title="Job Search & Interview Prep",
                description=f"Prepare for {top_role.title} interviews and optimize your job search strategy",
                estimated_time="1-2 months",
                skills_required=["Resume building", "Interview skills", "Salary negotiation"],
                resources=["Interview preparation platforms", "Resume builders", "Salary research tools"],
                difficulty="Advanced",
                prerequisites=["Professional Networking"],
                completed=False
            )
        ]
        
        return roadmap_steps

    def _get_foundation_skills(self, role: str) -> List[str]:
        """Get foundational skills for a role"""
        foundation_skills = {
            "Full Stack Developer": ["HTML", "CSS", "JavaScript", "Git", "Command Line"],
            "Data Scientist": ["Python", "Statistics", "Excel", "SQL"],
            "Machine Learning Engineer": ["Python", "Linear Algebra", "Calculus", "Probability"],
            "DevOps Engineer": ["Linux", "Networking", "Scripting", "Cloud basics"],
            "Product Manager": ["Communication", "Excel", "PowerPoint", "Project management"],
            "UX/UI Designer": ["Design principles", "Figma", "Adobe XD", "Typography"]
        }
        return foundation_skills.get(role, ["Computer basics"])

    def _get_specialization_skills(self, role: str) -> List[str]:
        """Get specialization skills for a role"""
        specialization_skills = {
            "Full Stack Developer": ["React", "Node.js", "TypeScript", "Docker", "AWS", "Testing"],
            "Data Scientist": ["Machine Learning", "Data visualization", "Advanced statistics", "Big Data"],
            "Machine Learning Engineer": ["Deep Learning", "Neural Networks", "MLOps", "Computer Vision"],
            "DevOps Engineer": ["Kubernetes", "Terraform", "CI/CD", "Monitoring", "Security"],
            "Product Manager": ["Analytics", "A/B testing", "User research", "Agile methodologies"],
            "UX/UI Designer": ["Advanced prototyping", "Design systems", "User research", "Accessibility"]
        }
        return specialization_skills.get(role, ["Technical skills"])

    def _get_portfolio_skills(self, role: str) -> List[str]:
        """Get portfolio-relevant skills for a role"""
        portfolio_skills = {
            "Full Stack Developer": ["Full-stack applications", "APIs", "Databases", "Frontend frameworks"],
            "Data Scientist": ["Data analysis projects", "ML models", "Visualizations", "Research papers"],
            "Machine Learning Engineer": ["ML models", "Deployed applications", "Performance optimization", "Research"],
            "DevOps Engineer": ["Infrastructure automation", "CI/CD pipelines", "Monitoring systems", "Security"],
            "Product Manager": ["Product launches", "Case studies", "Market research", "Growth metrics"],
            "UX/UI Designer": ["Design portfolios", "Case studies", "User research", "Prototypes"]
        }
        return portfolio_skills.get(role, ["Project work"])

    def _analyze_skill_gaps(
        self, 
        current_skills: List[str], 
        suggested_roles: List[SuggestedRole]
    ) -> List[SkillGapAnalysis]:
        """Analyze skill gaps for suggested roles"""
        if not suggested_roles:
            return []
        
        skill_gaps = []
        top_role = suggested_roles[0]
        required_skills = set()
        
        # Collect all required skills from suggested roles
        for role in suggested_roles[:3]:  # Top 3 roles
            required_skills.update(role.required_skills)
        
        for skill in required_skills:
            if skill not in current_skills:
                skill_gaps.append(SkillGapAnalysis(
                    skill_name=skill,
                    current_level=None,
                    required_level=3,  # Assume intermediate level required
                    gap_description=f"Missing {skill} - essential for {top_role.title} roles",
                    learning_priority="high" if skill in top_role.required_skills[:3] else "medium"
                ))
        
        return skill_gaps

    def _generate_career_insights(
        self, 
        current_skills: List[str], 
        current_level: str,
        suggested_roles: List[SuggestedRole]
    ) -> List[CareerInsight]:
        """Generate actionable career insights"""
        insights = []
        
        # Strengths insights
        if len(current_skills) >= 5:
            insights.append(CareerInsight(
                type="strength",
                title="Strong Technical Foundation",
                description="You have a diverse skill set that provides multiple career paths",
                actionable=True,
                priority="high"
            ))
        
        # Weakness insights
        if "Machine Learning" not in current_skills and suggested_roles:
            ml_roles = [r for r in suggested_roles if "Machine" in r.title]
            if ml_roles:
                insights.append(CareerInsight(
                    type="weakness",
                    title="Missing High-Demand ML Skills",
                    description="Machine Learning skills are in high demand and command premium salaries",
                    actionable=True,
                    priority="high"
                ))
        
        # Opportunity insights
        if current_level in ["beginner", "intermediate"]:
            insights.append(CareerInsight(
                type="opportunity",
                title="Growth Potential",
                description="Focus on skill building to unlock senior-level opportunities",
                actionable=True,
                priority="medium"
            ))
        
        # Market trend insights
        if "Full Stack" in " ".join(current_skills):
            insights.append(CareerInsight(
                type="trend",
                title="Full Stack Demand Surge",
                description="Full Stack developers are seeing 35% increase in demand",
                actionable=True,
                priority="medium"
            ))
        
        return insights

    def _calculate_confidence_score(
        self, 
        current_skills: List[str], 
        current_level: str,
        user_skills_data: Dict[str, int]
    ) -> float:
        """Calculate prediction confidence score"""
        score = 0.5  # Base score
        
        # Skill diversity bonus
        if len(current_skills) >= 5:
            score += 0.2
        
        # Skill proficiency bonus
        if user_skills_data:
            avg_proficiency = sum(user_skills_data.values()) / len(user_skills_data)
            if avg_proficiency >= 60:
                score += 0.2
        
        # Experience level bonus
        if current_level in ["intermediate", "advanced"]:
            score += 0.1
        
        return min(0.95, score)

    def _generate_next_steps(
        self, 
        suggested_roles: List[SuggestedRole], 
        skill_gaps: List[SkillGapAnalysis]
    ) -> List[str]:
        """Generate actionable next steps"""
        next_steps = []
        
        if suggested_roles:
            top_role = suggested_roles[0].title
            next_steps.append(f"Focus on learning {top_role} core competencies")
            next_steps.append("Build 2-3 portfolio projects in your target field")
        
        high_priority_gaps = [gap for gap in skill_gaps if gap.learning_priority == "high"]
        if high_priority_gaps:
            next_steps.append(f"Prioritize learning: {', '.join([gap.skill_name for gap in high_priority_gaps[:3]])}")
        
        next_steps.append("Update your resume with new skills and projects")
        next_steps.append("Network with professionals in your target industry")
        
        return next_steps

    async def _get_market_trends(self) -> Dict[str, Any]:
        """Get current market trends (mock data for demo)"""
        return {
            "hot_skills": [
                {"skill": "Machine Learning", "growth": "+45%", "demand": "Very High"},
                {"skill": "Cloud Computing", "growth": "+38%", "demand": "Very High"},
                {"skill": "DevOps", "growth": "+35%", "demand": "High"},
                {"skill": "Full Stack Development", "growth": "+28%", "demand": "High"}
            ],
            "growing_industries": [
                {"industry": "AI/ML", "growth_rate": "+42%"},
                {"industry": "Cloud Services", "growth_rate": "+38%"},
                {"industry": "Cybersecurity", "growth_rate": "+35%"},
                {"industry": "Data Analytics", "growth_rate": "+31%"}
            ],
            "salary_trends": {
                "tech_average": "$95,000",
                "year_over_year": "+8.2%",
                "highest_paying_roles": ["ML Engineer", "DevOps Engineer", "Data Scientist"]
            },
            "in_demand_certifications": [
                {"certification": "AWS Certified Solutions Architect", "salary_boost": "+22%"},
                {"certification": "Google Cloud Professional", "salary_boost": "+18%"},
                {"certification": "Certified Kubernetes Administrator", "salary_boost": "+20%"}
            ]
        }

    async def generate_career_roadmap(self, user_id: int) -> List[RoadmapStep]:
        """Generate personalized career roadmap"""
        user_skills_data = self._get_user_skills_data(user_id)
        current_skills = list(user_skills_data.keys())
        
        # Get user's target role from profile
        user = self.db.query(User).filter(User.id == user_id).first()
        target_role = user.target_role or "Full Stack Developer"
        
        return self._generate_roadmap(
            suggested_roles=[SuggestedRole(
                title=target_role,
                match_score=0.8,
                description=f"Personalized roadmap for {target_role}",
                required_skills=[],
                growth_potential="High"
            )],
            current_skills=current_skills,
            current_level=user.experience_level or "intermediate"
        )

    async def analyze_skills(
        self, 
        user_id: int, 
        skills: List[str], 
        target_role: Optional[str] = None
    ) -> Dict[str, Any]:
        """Analyze user's skills and provide recommendations"""
        user_skills_data = self._get_user_skills_data(user_id)
        
        # Skill analysis
        skill_analysis = {}
        for skill_name, proficiency in user_skills_data.items():
            analysis = {
                "current_level": proficiency,
                "level_category": self._get_level_category(proficiency),
                "improvement_suggestions": self._get_improvement_suggestions(skill_name, proficiency),
                "related_skills": self._get_related_skills(skill_name),
                "learning_resources": self._get_learning_resources(skill_name),
                "market_demand": self._get_skill_demand(skill_name)
            }
            skill_analysis[skill_name] = analysis
        
        # Overall analysis
        strongest_skills = sorted(user_skills_data.items(), key=lambda x: x[1], reverse=True)[:3]
        weakest_skills = sorted(user_skills_data.items(), key=lambda x: x[1])[:3]
        
        return {
            "individual_skills": skill_analysis,
            "strongest_skills": [{"skill": skill, "level": level} for skill, level in strongest_skills],
            "weakest_skills": [{"skill": skill, "level": level} for skill, level in weakest_skills],
            "skill_diversity_score": len(user_skills_data) * 10,  # Diversity bonus
            "overall_assessment": self._get_overall_assessment(user_skills_data),
            "recommendations": self._get_skill_recommendations(user_skills_data, target_role)
        }

    def _get_level_category(self, level: int) -> str:
        """Categorize skill level"""
        if level >= 80:
            return "Expert"
        elif level >= 60:
            return "Advanced"
        elif level >= 40:
            return "Intermediate"
        else:
            return "Beginner"

    def _get_improvement_suggestions(self, skill: str, level: int) -> List[str]:
        """Get improvement suggestions for a skill"""
        if level >= 80:
            return [f"Consider mentoring others in {skill}", "Contribute to open source projects"]
        elif level >= 60:
            return [f"Advanced {skill} courses", "Build complex projects"]
        else:
            return [f"Fundamentals of {skill}", "Practice exercises", "Beginner tutorials"]

    def _get_related_skills(self, skill: str) -> List[str]:
        """Get related skills for learning recommendations"""
        related_skills = {
            "JavaScript": ["TypeScript", "React", "Node.js", "Vue.js"],
            "Python": ["Django", "Flask", "Data Science", "Machine Learning"],
            "React": ["Next.js", "Redux", "GraphQL", "React Native"],
            "Node.js": ["Express.js", "MongoDB", "Docker", "AWS"],
            "Machine Learning": ["Deep Learning", "Neural Networks", "Computer Vision", "NLP"],
            "SQL": ["NoSQL", "Database Design", "Data Warehousing"],
            "AWS": ["Azure", "Google Cloud", "Terraform", "Kubernetes"]
        }
        return related_skills.get(skill, [])

    def _get_learning_resources(self, skill: str) -> List[str]:
        """Get learning resources for a skill"""
        resources = {
            "JavaScript": ["MDN Web Docs", "JavaScript.info", "Eloquent JavaScript", "YouTube: Traversy Media"],
            "Python": ["Python.org", "Real Python", "Coursera Python Courses", "PyPI"],
            "React": ["React Documentation", "React Tutorial", "React Patterns", "React Router"],
            "Machine Learning": ["Coursera ML", "Fast.ai", "Papers with Code", "ArXiv"],
            "AWS": ["AWS Documentation", "AWS Training", "AWS re:Invent", "A Cloud Guru"],
            "Node.js": ["Node.js.org", "Express.js Guide", "Node School", "Node Weekly"]
        }
        return resources.get(skill, ["Online documentation", "Tutorial websites"])

    def _get_skill_demand(self, skill: str) -> str:
        """Get market demand for a skill"""
        demand_levels = {
            "Machine Learning": "Very High",
            "Cloud Computing": "Very High", 
            "DevOps": "High",
            "Full Stack Development": "High",
            "Data Science": "Very High",
            "Cybersecurity": "Very High",
            "Mobile Development": "Medium",
            "UI/UX Design": "Medium"
        }
        return demand_levels.get(skill, "Medium")

    def _get_overall_assessment(self, user_skills_data: Dict[str, int]) -> str:
        """Get overall skills assessment"""
        avg_level = sum(user_skills_data.values()) / len(user_skills_data)
        skill_count = len(user_skills_data)
        
        if avg_level >= 70 and skill_count >= 8:
            return "Excellent - You have a strong, diverse skill set"
        elif avg_level >= 50 and skill_count >= 5:
            return "Good - Solid foundation with room for growth"
        elif avg_level >= 30 and skill_count >= 3:
            return "Developing - Building your skill set"
        else:
            return "Beginning - Focus on fundamentals"

    def _get_skill_recommendations(self, user_skills_data: Dict[str, int], target_role: Optional[str]) -> List[str]:
        """Get personalized skill recommendations"""
        recommendations = []
        
        # Recommend complementary skills
        if "JavaScript" in user_skills_data and "TypeScript" not in user_skills_data:
            recommendations.append("Learn TypeScript to enhance your JavaScript skills")
        
        if "Python" in user_skills_data and "Machine Learning" not in user_skills_data:
            recommendations.append("Explore Machine Learning to leverage your Python knowledge")
        
        if "React" in user_skills_data and "Node.js" not in user_skills_data:
            recommendations.append("Add Node.js to become a full-stack developer")
        
        # Role-specific recommendations
        if target_role:
            role_recommendations = {
                "Data Scientist": ["Statistics", "SQL", "Data Visualization"],
                "Machine Learning Engineer": ["Deep Learning", "Computer Vision", "MLOps"],
                "DevOps Engineer": ["Kubernetes", "Terraform", "Monitoring"],
                "Full Stack Developer": ["TypeScript", "Testing", "Cloud Platforms"]
            }
            recommendations.extend(role_recommendations.get(target_role, []))
        
        return recommendations[:5]  # Return top 5 recommendations

    async def get_salary_insights(self, role: str) -> Dict[str, Any]:
        """Get salary insights for a specific role"""
        salary_data = {
            "Full Stack Developer": {
                "entry_level": {"min": 60000, "median": 80000, "max": 110000},
                "mid_level": {"min": 90000, "median": 120000, "max": 160000},
                "senior_level": {"min": 130000, "median": 170000, "max": 220000},
                "factors": ["Location", "Company size", "Specialization", "Experience"]
            },
            "Data Scientist": {
                "entry_level": {"min": 70000, "median": 95000, "max": 130000},
                "mid_level": {"min": 100000, "median": 140000, "max": 180000},
                "senior_level": {"min": 140000, "median": 180000, "max": 250000},
                "factors": ["Education", "Industry", "Company type", "Specialization"]
            },
            "Machine Learning Engineer": {
                "entry_level": {"min": 90000, "median": 120000, "max": 160000},
                "mid_level": {"min": 130000, "median": 170000, "max": 220000},
                "senior_level": {"min": 160000, "median": 200000, "max": 300000},
                "factors": ["Advanced degree", "Research experience", "Framework expertise", "Publication record"]
            }
        }
        
        base_data = salary_data.get(role, salary_data["Full Stack Developer"])
        
        return {
            "role": role,
            "salary_ranges": base_data,
            "market_trends": {
                "growth_rate": "+15%",
                "demand": "High",
                "outlook": "Very favorable"
            },
            "negotiation_tips": [
                f"Research {role} salaries in your target location",
                "Highlight your unique skills and experience",
                "Consider total compensation including benefits and stock options",
                "Be prepared to discuss technical challenges you've solved"
            ],
            "certification_impact": {
                "aws_certified_solutions_architect": "+22%",
                "google_cloud_professional": "+18%",
                "microsoft_azure": "+15%"
            }
        }
