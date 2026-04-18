from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import random

router = APIRouter()

class RoadmapRequest(BaseModel):
    user_type: str
    current_role: Optional[str] = None
    company: Optional[str] = None
    experience: Optional[str] = None
    skills: List[str] = []

class RoadmapResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: str

@router.post("/generate-roadmap", response_model=RoadmapResponse)
async def generate_roadmap(request: RoadmapRequest):
    """
    Generate AI-powered personalized roadmap based on user profile
    """
    try:
        if request.user_type == "student":
            # Generate student roadmap
            roadmap_data = {
                "roadmap_type": "student",
                "daily_plan": generate_student_roadmap(request.skills),
                "recommended_skills": ["DSA", "System Design", "DBMS", "OS", "Networking"],
                "next_milestone": "Complete Day 7 roadmap",
                "estimated_completion": "30 days",
                "difficulty": "intermediate"
            }
        elif request.user_type == "professional":
            # Generate professional roadmap
            roadmap_data = generate_professional_roadmap(request)
        else:
            raise HTTPException(status_code=400, detail="Invalid user type")

        return RoadmapResponse(
            success=True,
            data=roadmap_data,
            message="Roadmap generated successfully"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def generate_student_roadmap(skills: List[str]) -> Dict[str, Any]:
    """Generate student-specific roadmap"""
    return {
        "day_1": {
            "title": "Foundation & Basics",
            "topics": {
                "DSA": ["Arrays", "Time Complexity", "Space Complexity"],
                "Aptitude": ["Number Systems", "Percentages"],
                "Core": ["OOPs Concepts", "Data Types"]
            },
            "estimated_hours": 2,
            "resources": [
                "https://leetcode.com/problems/two-sum/",
                "https://www.geeksforgeeks.org/array-data-structure/"
            ]
        },
        "day_2": {
            "title": "Arrays & Strings",
            "topics": {
                "DSA": ["Two Pointers", "Sliding Window", "String Manipulation"],
                "Aptitude": ["Ratio & Proportion", "Time & Work"],
                "Core": ["Control Structures", "Functions"]
            },
            "estimated_hours": 2,
            "resources": [
                "https://leetcode.com/tag/array/",
                "https://leetcode.com/tag/string/"
            ]
        },
        "day_3": {
            "title": "Linked Lists",
            "topics": {
                "DSA": ["Singly Linked List", "Doubly Linked List", "Circular Linked List"],
                "Aptitude": ["Profit & Loss", "Simple Interest"],
                "Core": ["Exception Handling", "File I/O"]
            },
            "estimated_hours": 2,
            "resources": [
                "https://leetcode.com/tag/linked-list/",
                "https://www.geeksforgeeks.org/data-structures/linked-list/"
            ]
        },
        "day_4": {
            "title": "Stacks & Queues",
            "topics": {
                "DSA": ["Stack Operations", "Queue Operations", "Implementation"],
                "Aptitude": ["Compound Interest", "Averages"],
                "Core": ["Memory Management", "Pointers"]
            },
            "estimated_hours": 2,
            "resources": [
                "https://leetcode.com/tag/stack/",
                "https://leetcode.com/tag/queue/"
            ]
        },
        "day_5": {
            "title": "Trees & Recursion",
            "topics": {
                "DSA": ["Binary Trees", "Tree Traversals", "Recursion Basics"],
                "Aptitude": ["Probability", "Permutations"],
                "Core": ["Classes & Objects", "Inheritance"]
            },
            "estimated_hours": 2,
            "resources": [
                "https://leetcode.com/tag/tree/",
                "https://www.geeksforgeeks.org/binary-tree-data-structure/"
            ]
        },
        "day_6": {
            "title": "Sorting & Searching",
            "topics": {
                "DSA": ["Bubble Sort", "Merge Sort", "Binary Search"],
                "Aptitude": ["Combinations", "Series"],
                "Core": ["Polymorphism", "Abstraction"]
            },
            "estimated_hours": 2,
            "resources": [
                "https://leetcode.com/tag/binary-search/",
                "https://www.geeksforgeeks.org/sorting-algorithms/"
            ]
        },
        "day_7": {
            "title": "Hash Maps & Sets",
            "topics": {
                "DSA": ["HashMap Operations", "HashSet", "Collision Handling"],
                "Aptitude": ["Speed, Time & Distance", "Trains"],
                "Core": ["Interfaces", "Abstract Classes"]
            },
            "estimated_hours": 2,
            "resources": [
                "https://leetcode.com/tag/hash-table/",
                "https://www.geeksforgeeks.org/hashing-data-structure/"
            ]
        }
    }

def generate_professional_roadmap(request: RoadmapRequest) -> Dict[str, Any]:
    """Generate professional-specific roadmap with AI insights"""
    
    # AI-powered skill recommendations based on current skills and experience
    skill_recommendations = get_ai_skill_recommendations(request.skills, request.experience)
    
    # Career path suggestions
    career_path = suggest_career_path(request.current_role, request.experience, request.skills)
    
    # Salary growth predictions
    salary_growth = predict_salary_growth(request.experience, skill_recommendations)
    
    return {
        "roadmap_type": "professional",
        "recommended_skills": skill_recommendations,
        "career_path": career_path,
        "salary_growth": salary_growth,
        "learning_plan": generate_learning_plan(skill_recommendations),
        "certifications": [
            {
                "name": "Google Cloud Professional",
                "link": "https://cloud.google.com/certification",
                "priority": "high"
            },
            {
                "name": "Azure Solutions Architect",
                "link": "https://learn.microsoft.com/en-us/certifications/",
                "priority": "high"
            },
            {
                "name": "AWS Solutions Architect",
                "link": "https://aws.amazon.com/certification/",
                "priority": "medium"
            },
            {
                "name": "Kubernetes Administrator",
                "link": "https://www.cncf.io/certification/",
                "priority": "medium"
            }
        ],
        "next_steps": [
            "Complete recommended courses",
            "Work on portfolio projects",
            "Apply for certifications",
            "Network with industry professionals"
        ]
    }

def get_ai_skill_recommendations(current_skills: List[str], experience: str) -> List[str]:
    """AI-powered skill recommendations"""
    trending_skills = [
        "Machine Learning", "Cloud Architecture", "DevOps", "Data Engineering",
        "Cybersecurity", "React/Next.js", "Python", "Go", "Kubernetes",
        "Docker", "Terraform", "GraphQL", "Microservices", "System Design"
    ]
    
    # Filter out skills user already has
    recommended = [skill for skill in trending_skills if skill not in current_skills]
    
    # Return top 5 recommendations
    return recommended[:5]

def suggest_career_path(current_role: str, experience: str, skills: List[str]) -> str:
    """Suggest optimal career path based on profile"""
    if not current_role:
        return "Software Engineer → Senior Engineer → Tech Lead → Engineering Manager"
    
    if "senior" in current_role.lower():
        return f"{current_role} → Tech Lead → Engineering Manager → Director of Engineering"
    elif "lead" in current_role.lower():
        return f"{current_role} → Engineering Manager → Director of Engineering → VP of Engineering"
    else:
        return f"{current_role} → Senior {current_role} → Tech Lead → Engineering Manager"

def predict_salary_growth(experience: str, new_skills: List[str]) -> str:
    """Predict salary growth based on skills and experience"""
    base_growth = "20-25%"
    
    if experience and "5+" in experience:
        base_growth = "30-40%"
    elif experience and "3-5" in experience:
        base_growth = "25-35%"
    
    # Additional growth for high-demand skills
    high_demand_skills = ["Machine Learning", "Cloud Architecture", "DevOps", "Cybersecurity"]
    if any(skill in new_skills for skill in high_demand_skills):
        base_growth = f"{int(base_growth.split('-')[0]) + 10}-{int(base_growth.split('-')[1]) + 15}%"
    
    return base_growth

def generate_learning_plan(skills: List[str]) -> Dict[str, Any]:
    """Generate personalized learning plan"""
    return {
        "phase_1": {
            "duration": "1-2 months",
            "focus": "Foundation",
            "skills": skills[:2],
            "resources": [
                "Official documentation",
                "Online courses (Coursera, Udemy)",
                "Practice projects"
            ]
        },
        "phase_2": {
            "duration": "2-3 months",
            "focus": "Advanced Concepts",
            "skills": skills[2:4],
            "resources": [
                "Advanced courses",
                "Open source contributions",
                "Building portfolio projects"
            ]
        },
        "phase_3": {
            "duration": "1-2 months",
            "focus": "Certification & Application",
            "skills": skills[4:],
            "resources": [
                "Certification exams",
                "Interview preparation",
                "Job applications"
            ]
        }
    }
