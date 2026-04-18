# TulasiAI Labs Backend API

A production-ready FastAPI backend for an AI-powered career growth platform with Supabase PostgreSQL integration.

## Features

- **Modular Architecture** - Clean separation of concerns (routers, services, models, schemas)
- **Async SQLAlchemy** - High-performance async database operations with Supabase PostgreSQL
- **UUID Primary Keys** - Scalable database design with proper relations
- **AI Career Prediction** - Real logic-based ML with career matching algorithms
- **Comprehensive Error Handling** - Structured error responses with custom exceptions
- **Pydantic Validation** - Type-safe request/response models with strict validation
- **Row Level Security** - Database-level security with user isolation
- **Streak System** - Real-time learning streak calculation and tracking
- **Task Management** - Complete CRUD operations with priority and due date handling
- **Skill Tracking** - Proficiency levels, hours practiced, category organization
- **Notification System** - Real-time notification management with metadata

## Project Structure

```
backend/
app/
routers/                # API routers
__init__.py
profile.py       # User profile management
skills.py        # Skill tracking CRUD
tasks.py         # Task management
streak.py        # Learning streak system
career.py        # AI career prediction
notifications.py # Notification system
services/              # Business logic
__init__.py
profile_service_new.py # Profile operations
skill_service.py   # Skill management
task_service.py    # Task operations
streak_service.py  # Streak calculation
career_service.py  # AI predictions
models/                # Database models
__init__.py
profile.py       # User profile model
skill.py         # Skill model
task.py          # Task model
streak.py        # Streak model
notification.py # Notification model
certification.py # Certification model
career_prediction.py # Career predictions
schemas/              # Pydantic models
__init__.py
profile.py       # Profile schemas
skill.py         # Skill schemas
task.py          # Task schemas
streak.py        # Streak schemas
career.py        # Career prediction schemas
core/                  # Core utilities
exceptions.py    # Custom exceptions
database.py      # Supabase database configuration
main.py          # FastAPI application
│   │   └── security.py     # Security utilities
│   ├── models/                # Database models
│   │   └── user.py         # User, Skill, Task models
│   ├── schemas/               # Pydantic schemas
│   │   ├── auth.py          # Auth schemas
│   │   ├── career.py        # Career prediction schemas
│   │   └── profile.py       # Profile schemas
│   ├── services/              # Business logic layer
│   │   ├── ai_service.py    # AI prediction logic
│   │   ├── auth_service.py  # Authentication service
│   │   ├── notification_service.py # Notification service
│   │   └── profile_service.py # Profile management
│   ├── database.py            # Database configuration
│   └── main.py              # FastAPI application
├── .env                     # Environment variables
├── requirements.txt           # Python dependencies
└── README.md               # This file
```

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tulasi-ai-labs/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 🗄️ Environment Variables

Create a `.env` file with the following variables:

```env
# FastAPI Configuration
ENV=dev
API_TITLE=TulasiAI Labs API
API_CORS_ORIGINS=http://localhost:3000

# Database Configuration
DATABASE_URL=sqlite:///./tulasi_ai.db
# For production: postgresql://user:password@localhost/tulasi_ai

# JWT Configuration
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI Career Prediction
OPENAI_API_KEY=your-openai-api-key-optional

# Redis Configuration (for caching/sessions)
REDIS_URL=redis://localhost:6379/0

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 🚀 Running the Application

### Development
```bash
python -m app.main
```

### Production with Uvicorn
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 🔐 API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /signup` - User registration
- `POST /login` - User login
- `POST /refresh` - Refresh JWT token
- `POST /logout` - User logout

### Profile (`/api/v1/profile`)
- `GET /me` - Get current user profile
- `PUT /me` - Update user profile
- `GET /skills` - Get user skills
- `POST /skills/{skill_id}` - Add new skill
- `PUT /skills/{skill_id}` - Update skill
- `DELETE /skills/{skill_id}` - Delete skill
- `GET /stats` - Get profile statistics

### Skills (`/api/v1/skills`)
- `GET /` - Get all available skills
- `POST /` - Create new skill
- `GET /{skill_id}` - Get skill details
- `PUT /{skill_id}` - Update skill
- `DELETE /{skill_id}` - Delete skill

### Tasks (`/api/v1/tasks`)
- `GET /` - Get user tasks
- `POST /` - Create new task
- `GET /{task_id}` - Get task details
- `PUT /{task_id}` - Update task
- `DELETE /{task_id}` - Delete task
- `POST /{task_id}/complete` - Mark task complete

### Career Prediction (`/api/v1/predict-career`)
- `POST /` - Generate AI career prediction
- `GET /roadmap/{user_id}` - Get career roadmap
- `GET /market-trends` - Get market trends
- `POST /skill-analysis` - Analyze skills
- `GET /salary-insights/{role}` - Get salary insights

### Notifications (`/api/v1/notifications`)
- `GET /` - Get user notifications
- `POST /` - Create notification
- `PUT /{notification_id}/read` - Mark notification read
- `PUT /mark-all-read` - Mark all notifications read
- `DELETE /{notification_id}` - Delete notification
- `GET /unread-count` - Get unread count
- `GET /preferences` - Get notification preferences
- `PUT /preferences` - Update notification preferences

## 🤖 AI Career Prediction Features

### Rule-Based Prediction Logic
- **Skill Matching Algorithm** - Matches user skills to role requirements
- **Experience Level Analysis** - Considers beginner/intermediate/advanced levels
- **Interest Alignment** - Factors in user interests for better matches
- **Market Demand Integration** - Real-time market trend analysis
- **Salary Estimation** - Realistic salary ranges based on roles and experience

### Prediction Outputs
- **Suggested Roles** - Top 5 matching roles with confidence scores
- **Salary Ranges** - Min/max/median salaries by role and experience
- **Career Roadmap** - Step-by-step learning path with timelines
- **Skill Gap Analysis** - Detailed analysis of missing skills
- **Actionable Insights** - Personalized recommendations for growth
- **Market Trends** - Current industry trends and demand data

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt password hashing
- **CORS Configuration** - Proper cross-origin resource sharing
- **Input Validation** - Pydantic schema validation
- **SQL Injection Prevention** - SQLAlchemy ORM protection
- **Rate Limiting** - Configurable rate limiting per endpoint

## 📊 Database Schema

### Core Tables
- **users** - User accounts and profiles
- **skills** - Available skills with categories
- **user_skills** - User skill proficiency tracking
- **tasks** - Task management with completion tracking
- **notifications** - User notifications with metadata
- **certifications** - User certifications and achievements

### Relationships
- Users → Skills (many-to-many through user_skills)
- Users → Tasks (one-to-many)
- Users → Notifications (one-to-many)

## 🧪 Testing

### Running Tests
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest tests/ -v
```

### Test Coverage
```bash
# Generate coverage report
pytest --cov=app tests/
```

## 🚀 Production Deployment

### Docker Deployment
```dockerfile
FROM python:3.11

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment-Specific Configuration
- **Development**: SQLite database, debug mode enabled
- **Staging**: PostgreSQL database, extensive logging
- **Production**: PostgreSQL with connection pooling, monitoring enabled

## 📈 Performance Features

### Caching Strategy
- **Redis Integration** - Session storage and API response caching
- **Database Query Optimization** - Indexed queries and eager loading
- **Async Database Operations** - Non-blocking database calls

### Monitoring
- **Structured Logging** - Request/response logging with correlation IDs
- **Health Check Endpoints** - Service health monitoring
- **Performance Metrics** - Response time tracking

## 🔄 Scalability Considerations

### Horizontal Scaling
- **Stateless API Design** - Supports multiple instances
- **Database Connection Pooling** - Efficient database connections
- **Load Balancer Ready** - Multiple instance support

### Vertical Scaling
- **Background Task Processing** - Celery for async tasks
- **Microservice Architecture** - Modular design for service separation
- **API Rate Limiting** - Prevents abuse and ensures fair usage

## 🛠️ Development Guidelines

### Code Standards
- **Type Hints** - Full type annotation coverage
- **Docstrings** - Comprehensive function documentation
- **Error Handling** - Consistent error response format
- **Validation** - Input validation at all entry points

### Git Workflow
- **Feature Branches** - Isolated development per feature
- **Pull Request Templates** - Standardized review process
- **Automated Testing** - CI/CD pipeline integration

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Email: support@tulasi-ai-labs.com
- Documentation: [Link to docs]

---

**Built with ❤️ for the TulasiAI Labs community**
