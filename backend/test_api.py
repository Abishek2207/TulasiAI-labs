#!/usr/bin/env python3
"""
Test script for TulasiAI Labs API
"""

import requests
import json
import uuid
from datetime import datetime

# Base URL
BASE_URL = "http://localhost:8000"

def test_api():
    """Test all API endpoints"""
    
    # Generate test user ID
    user_id = str(uuid.uuid4())
    print(f"Testing with user_id: {user_id}")
    
    print("\n=== Testing API Endpoints ===")
    
    # 1. Test health check
    print("\n1. Health Check:")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")
    
    # 2. Test profile creation
    print("\n2. Create Profile:")
    profile_data = {
        "user_id": user_id,
        "name": "Test User",
        "email": "test@example.com",
        "experience_level": "intermediate",
        "current_role": "Frontend Developer",
        "target_role": "Full Stack Developer",
        "company": "Tech Corp",
        "daily_learning_hours": 2
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/profile/",
            json=profile_data
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")
    
    # 3. Test get profile
    print("\n3. Get Profile:")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/profile/?user_id={user_id}")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")
    
    # 4. Test create skill
    print("\n4. Create Skill:")
    skill_data = {
        "skill_name": "React",
        "level": "intermediate",
        "proficiency_level": 5,
        "hours_practiced": 25.5,
        "category": "Frontend"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/skills/?user_id={user_id}",
            json=skill_data
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        # Save skill ID for later tests
        skill_response = response.json()
        if skill_response.get("success") and skill_response.get("data"):
            skill_id = skill_response["data"]["id"]
        else:
            skill_id = None
    except Exception as e:
        print(f"Error: {e}")
        skill_id = None
    
    # 5. Test get skills
    print("\n5. Get Skills:")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/skills/?user_id={user_id}")
        print(f"Status: {response.status_code}")
        skills_data = response.json()
        print(f"Skills count: {len(skills_data.get('data', []))}")
    except Exception as e:
        print(f"Error: {e}")
    
    # 6. Test create task
    print("\n6. Create Task:")
    task_data = {
        "title": "Complete React tutorial",
        "description": "Finish the advanced React hooks tutorial",
        "task_type": "learning",
        "difficulty": "intermediate",
        "estimated_hours": 2.5,
        "due_date": "2024-12-31T23:59:59Z",
        "priority": "high"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/tasks/?user_id={user_id}",
            json=task_data
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        # Save task ID for later tests
        task_response = response.json()
        if task_response.get("success") and task_response.get("data"):
            task_id = task_response["data"]["id"]
        else:
            task_id = None
    except Exception as e:
        print(f"Error: {e}")
        task_id = None
    
    # 7. Test get tasks
    print("\n7. Get Tasks:")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/tasks/?user_id={user_id}")
        print(f"Status: {response.status_code}")
        tasks_data = response.json()
        print(f"Tasks count: {len(tasks_data.get('data', []))}")
    except Exception as e:
        print(f"Error: {e}")
    
    # 8. Test complete task
    if task_id:
        print("\n8. Complete Task:")
        try:
            response = requests.put(
                f"{BASE_URL}/api/v1/tasks/{task_id}/complete?user_id={user_id}"
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {response.json()}")
        except Exception as e:
            print(f"Error: {e}")
    
    # 9. Test streak calculation
    print("\n9. Calculate Streak:")
    try:
        response = requests.post(f"{BASE_URL}/api/v1/streak/calculate?user_id={user_id}")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")
    
    # 10. Test career prediction
    print("\n10. Career Prediction:")
    prediction_data = {
        "current_skills": ["JavaScript", "React", "Node.js", "Python"],
        "interests": ["AI", "Web Development"],
        "current_level": "intermediate",
        "target_roles": ["Full Stack Developer"]
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/predict-career/?user_id={user_id}",
            json=prediction_data
        )
        print(f"Status: {response.status_code}")
        prediction_response = response.json()
        if prediction_response.get("success"):
            print(f"Top role: {prediction_response['data']['suggested_roles'][0]['title']}")
            print(f"Match score: {prediction_response['data']['suggested_roles'][0]['match_score']}")
            print(f"Salary range: ${prediction_response['data']['salary_range']['min']} - ${prediction_response['data']['salary_range']['max']}")
        else:
            print(f"Response: {prediction_response}")
    except Exception as e:
        print(f"Error: {e}")
    
    # 11. Test notifications
    print("\n11. Get Notifications:")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/notifications/?user_id={user_id}")
        print(f"Status: {response.status_code}")
        notifications_data = response.json()
        print(f"Notifications count: {len(notifications_data.get('data', []))}")
    except Exception as e:
        print(f"Error: {e}")
    
    # 12. Test profile stats
    print("\n12. Profile Statistics:")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/profile/stats?user_id={user_id}")
        print(f"Status: {response.status_code}")
        stats_data = response.json()
        if stats_data.get("success"):
            stats = stats_data["data"]
            print(f"Total skills: {stats['total_skills']}")
            print(f"Current streak: {stats['current_streak']}")
            print(f"Job readiness score: {stats['job_readiness_score']}")
            print(f"Completed tasks: {stats['completed_tasks']}")
        else:
            print(f"Response: {stats_data}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n=== Test Complete ===")
    print(f"Test user ID: {user_id}")
    print("Check the database to verify all data was created correctly.")

if __name__ == "__main__":
    print("Starting TulasiAI Labs API Test...")
    print("Make sure the API server is running on http://localhost:8000")
    
    try:
        test_api()
    except KeyboardInterrupt:
        print("\nTest interrupted by user")
    except Exception as e:
        print(f"\nUnexpected error: {e}")
