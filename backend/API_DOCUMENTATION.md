# TulasiAI Labs API Documentation

## Overview

The TulasiAI Labs API is a production-ready FastAPI backend that provides endpoints for an AI-powered career growth platform. All endpoints use real database operations with Supabase PostgreSQL.

## Base URL

```
Development: http://localhost:8000
Production: https://api.tulasi-ai-labs.com
```

## Authentication

Currently, the API uses a simple `user_id` parameter for testing. In production, this will be replaced with JWT authentication from Supabase.

## API Endpoints

### 1. Profile Management (`/api/v1/profile`)

#### Get User Profile
```http
GET /api/v1/profile/?user_id={user_id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "experience_level": "intermediate",
    "current_role": "Frontend Developer",
    "target_role": "Full Stack Developer",
    "company": "Tech Corp",
    "daily_learning_hours": 2,
    "job_readiness_score": 75.5,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "message": "Profile retrieved successfully"
}
```

#### Create Profile
```http
POST /api/v1/profile/
Content-Type: application/json

{
  "user_id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "experience_level": "intermediate",
  "current_role": "Frontend Developer",
  "target_role": "Full Stack Developer",
  "company": "Tech Corp",
  "daily_learning_hours": 2
}
```

#### Update Profile
```http
PUT /api/v1/profile/?user_id={user_id}
Content-Type: application/json

{
  "name": "John Smith",
  "experience_level": "advanced",
  "daily_learning_hours": 3
}
```

#### Get Profile Statistics
```http
GET /api/v1/profile/stats?user_id={user_id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_skills": 8,
    "skills_by_category": {
      "Frontend": 4,
      "Backend": 2,
      "AI/ML": 2
    },
    "average_skill_level": 4.5,
    "current_streak": 15,
    "total_learning_hours": 120.5,
    "job_readiness_score": 78.2,
    "completed_tasks": 25,
    "certifications": 2,
    "weekly_progress": {
      "hours_this_week": 14.0,
      "tasks_completed": 7,
      "target_hours": 21.0,
      "target_tasks": 10,
      "completion_rate": 70.0
    }
  },
  "message": "Profile statistics retrieved successfully"
}
```

### 2. Skills Management (`/api/v1/skills`)

#### Get All Skills
```http
GET /api/v1/skills/?user_id={user_id}
```

#### Get Specific Skill
```http
GET /api/v1/skills/{skill_id}?user_id={user_id}
```

#### Create Skill
```http
POST /api/v1/skills/?user_id={user_id}
Content-Type: application/json

{
  "skill_name": "React",
  "level": "intermediate",
  "proficiency_level": 5,
  "hours_practiced": 25.5,
  "category": "Frontend"
}
```

#### Update Skill
```http
PUT /api/v1/skills/{skill_id}?user_id={user_id}
Content-Type: application/json

{
  "proficiency_level": 6,
  "hours_practiced": 30.0
}
```

#### Delete Skill
```http
DELETE /api/v1/skills/{skill_id}?user_id={user_id}
```

#### Get Skills by Category
```http
GET /api/v1/skills/category/{category}?user_id={user_id}
```

#### Get Skill Statistics
```http
GET /api/v1/skills/statistics/summary?user_id={user_id}
```

### 3. Tasks Management (`/api/v1/tasks`)

#### Get All Tasks
```http
GET /api/v1/tasks/?user_id={user_id}&completed={boolean}
```

#### Create Task
```http
POST /api/v1/tasks/?user_id={user_id}
Content-Type: application/json

{
  "title": "Complete React tutorial",
  "description": "Finish the advanced React hooks tutorial",
  "task_type": "learning",
  "difficulty": "intermediate",
  "estimated_hours": 2.5,
  "due_date": "2024-01-15T00:00:00Z",
  "priority": "high"
}
```

#### Update Task
```http
PUT /api/v1/tasks/{task_id}?user_id={user_id}
Content-Type: application/json

{
  "completed": true
}
```

#### Complete Task
```http
PUT /api/v1/tasks/{task_id}/complete?user_id={user_id}
```

#### Delete Task
```http
DELETE /api/v1/tasks/{task_id}?user_id={user_id}
```

#### Get Tasks by Type
```http
GET /api/v1/tasks/type/{task_type}?user_id={user_id}
```

#### Get Overdue Tasks
```http
GET /api/v1/tasks/overdue/list?user_id={user_id}
```

#### Generate Daily Tasks
```http
POST /api/v1/tasks/generate/daily?user_id={user_id}&daily_hours=2
```

### 4. Streak Management (`/api/v1/streak`)

#### Get Current Streak
```http
GET /api/v1/streak/?user_id={user_id}
```

#### Calculate Streak
```http
POST /api/v1/streak/calculate?user_id={user_id}
```

#### Record Activity
```http
POST /api/v1/streak/activity?user_id={user_id}
```

#### Get Streak History
```http
GET /api/v1/streak/history?user_id={user_id}&days=30
```

#### Get Streak Milestones
```http
GET /api/v1/streak/milestones?user_id={user_id}
```

### 5. Career Prediction (`/api/v1/predict-career`)

#### Generate Career Prediction
```http
POST /api/v1/predict-career/?user_id={user_id}
Content-Type: application/json

{
  "current_skills": ["JavaScript", "React", "Node.js", "Python"],
  "interests": ["AI", "Web Development"],
  "current_level": "intermediate",
  "target_roles": ["Full Stack Developer"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggested_roles": [
      {
        "title": "Full Stack Developer",
        "match_score": 0.85,
        "description": "Build end-to-end web applications",
        "required_skills": ["JavaScript", "React", "Node.js"],
        "growth_potential": "High"
      }
    ],
    "salary_range": {
      "min": 90000,
      "max": 150000,
      "median": 120000,
      "currency": "USD"
    },
    "roadmap": [
      {
        "title": "Foundation Building",
        "description": "Master core concepts",
        "estimated_time": "2-3 months",
        "skills_required": ["JavaScript", "HTML", "CSS"],
        "resources": ["MDN Docs", "freeCodeCamp"],
        "difficulty": "beginner",
        "prerequisites": [],
        "completed": false
      }
    ],
    "skill_gap_analysis": [
      {
        "skill_name": "GraphQL",
        "current_level": null,
        "required_level": 3,
        "gap_description": "Missing GraphQL - essential for modern APIs",
        "learning_priority": "high"
      }
    ],
    "confidence_score": 0.78,
    "insights": [
      {
        "type": "strength",
        "title": "Strong Technical Foundation",
        "description": "You have a solid foundation in web technologies",
        "actionable": true,
        "priority": "high"
      }
    ],
    "market_trends": {
      "hot_skills": [
        {
          "skill": "Machine Learning",
          "growth": "+45%",
          "demand": "Very High"
        }
      ],
      "growing_industries": [
        {
          "industry": "AI/ML",
          "growth_rate": "+42%"
        }
      ]
    },
    "next_steps": [
      "Focus on learning: GraphQL, TypeScript",
      "Build portfolio projects for Full Stack role",
      "Update your resume with new skills"
    ]
  },
  "message": "Career prediction generated successfully"
}
```

#### Get Prediction History
```http
GET /api/v1/predict-career/history?user_id={user_id}&limit=10
```

### 6. Notifications (`/api/v1/notifications`)

#### Get Notifications
```http
GET /api/v1/notifications/?user_id={user_id}&is_read={boolean}&limit=50
```

#### Mark Notification as Read
```http
PUT /api/v1/notifications/{notification_id}/read?user_id={user_id}
```

#### Create Notification
```http
POST /api/v1/notifications/?user_id={user_id}
Content-Type: application/json

{
  "title": "Task Completed!",
  "message": "You completed 'React Tutorial' task",
  "notification_type": "task_completed",
  "metadata": {
    "task_id": "uuid"
  },
  "priority": "medium"
}
```

#### Delete Notification
```http
DELETE /api/v1/notifications/{notification_id}?user_id={user_id}
```

#### Get Unread Count
```http
GET /api/v1/notifications/unread/count?user_id={user_id}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error description",
  "status_code": 400
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Data Types

### Experience Levels
- `beginner`
- `intermediate`
- `advanced`
- `expert`

### Skill Categories
- `Frontend`
- `Backend`
- `AI/ML`
- `DevOps`
- `Cloud`
- `Mobile`
- `Database`
- `Other`

### Task Types
- `learning`
- `project`
- `practice`
- `review`
- `certification`

### Task Priorities
- `low`
- `medium`
- `high`
- `urgent`

### Notification Types
- `achievement`
- `task_reminder`
- `career_insight`
- `skill_level_up`
- `task_completed`
- `streak_milestone`
- `certification_added`

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing rate limiting to prevent abuse.

## Pagination

Most list endpoints support pagination through query parameters:
- `limit` - Maximum number of items to return (default: 50)
- `offset` - Number of items to skip (for pagination)

## Testing

### Example cURL Commands

```bash
# Get profile
curl -X GET "http://localhost:8000/api/v1/profile/?user_id=your-uuid"

# Create skill
curl -X POST "http://localhost:8000/api/v1/skills/?user_id=your-uuid" \
  -H "Content-Type: application/json" \
  -d '{
    "skill_name": "Python",
    "level": "intermediate",
    "proficiency_level": 5,
    "hours_practiced": 20.0,
    "category": "Backend"
  }'

# Generate career prediction
curl -X POST "http://localhost:8000/api/v1/predict-career/?user_id=your-uuid" \
  -H "Content-Type: application/json" \
  -d '{
    "current_skills": ["Python", "JavaScript", "React"],
    "interests": ["Web Development", "AI"],
    "current_level": "intermediate"
  }'
```

## Database Schema

The API uses Supabase PostgreSQL with the following main tables:
- `profiles` - User profile information
- `skills` - User skill tracking
- `tasks` - Task management
- `streaks` - Learning streak tracking
- `notifications` - User notifications
- `certifications` - Professional certifications
- `career_predictions` - AI prediction results

All tables use UUID primary keys and include proper foreign key relationships with row-level security.

## Development

### Running the Server

```bash
# Using Python
python run.py

# Using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Health Check

```bash
curl http://localhost:8000/health
```

## Production Considerations

1. **Authentication**: Replace user_id parameter with JWT authentication
2. **Rate Limiting**: Implement rate limiting for all endpoints
3. **Logging**: Add comprehensive logging and monitoring
4. **Caching**: Implement Redis caching for frequently accessed data
5. **Background Tasks**: Use Celery for background job processing
6. **Database Optimization**: Add proper indexing and query optimization
7. **Security**: Implement proper input validation and sanitization

## Support

For API support and questions, please refer to the project documentation or create an issue in the repository.
