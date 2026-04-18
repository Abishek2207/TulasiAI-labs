# TulasiAI Labs - Project Summary

## Overview

TulasiAI Labs is a full-stack AI-powered career growth platform that helps students prepare for placements and professionals advance their careers using AI-driven insights.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Auth**: Supabase Auth (Email + Google OAuth)

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (via Supabase)
- **ORM**: SQLAlchemy (Async)
- **Validation**: Pydantic
- **API Docs**: Auto-generated Swagger/OpenAPI

### Database
- **Provider**: Supabase
- **Type**: PostgreSQL
- **Features**: Row Level Security (RLS), Real-time, Storage

## Project Structure

```
tulasi-ai-labs/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/callback/          # OAuth callback handler
│   │   │   ├── onboarding/             # User type selection
│   │   │   ├── student-dashboard/      # Student dashboard
│   │   │   ├── professional-dashboard/ # Professional dashboard
│   │   │   ├── login/                 # Login page
│   │   │   └── signup/                # Signup page
│   │   ├── components/
│   │   │   ├── dashboard/             # Dashboard components
│   │   │   ├── layout/                # Layout components
│   │   │   └── ui/                    # UI components
│   │   ├── lib/
│   │   │   ├── supabase-client.ts     # Supabase client
│   │   │   └── api-client.ts          # API client
│   │   └── store/
│   │       └── store.ts               # Zustand stores
│   ├── vercel.json                    # Vercel config
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── roadmap.py              # AI roadmap generation
│   │   │   ├── notifications.py       # Notifications with trending
│   │   │   ├── streak.py              # Streak with gamification
│   │   │   ├── profile.py
│   │   │   ├── skills.py
│   │   │   ├── tasks.py
│   │   │   └── career.py
│   │   ├── models/                    # Database models
│   │   ├── schemas/                   # Pydantic schemas
│   │   ├── services/                  # Business logic
│   │   └── main.py                    # FastAPI app
│   ├── render.yaml                    # Render config
│   ├── railway.toml                   # Railway config
│   └── requirements.txt
├── database/
│   └── supabase-schema.sql           # Database schema
├── DEPLOYMENT.md                     # Deployment guide
└── README.md                        # Main README
```

## Features Implemented

### 1. Authentication System
- **Email/Password Login**: Traditional authentication via Supabase
- **Google OAuth**: Single sign-on with Google
- **Auth Callback**: OAuth callback handler with proper routing
- **Session Management**: Automatic session handling
- **Protected Routes**: Route protection based on auth state

### 2. Onboarding Flow
- **User Type Selection**: Choose between Student or Professional
- **Dynamic Routing**: Automatic routing based on user type
- **Profile Creation**: Profile creation with user type
- **Skip Option**: Option to change preference later

### 3. Student Dashboard
#### Core Features
- **Daily Roadmap**: 7-day structured learning plan
- **Topic Categories**: DSA, Aptitude, Core Subjects
- **Time Customization**: 1hr, 2hr, 3hr daily learning options
- **Progress Tracking**: Visual progress indicators
- **Task Completion**: Mark tasks as complete
- **Streak Display**: Current streak and stats

#### Roadmap Structure
- **Day 1**: Foundation & Basics (Arrays, Time Complexity, OOPs)
- **Day 2**: Arrays & Strings (Two Pointers, Sliding Window)
- **Day 3**: Linked Lists (Singly, Doubly, Circular)
- **Day 4**: Stacks & Queues (Operations, Implementation)
- **Day 5**: Trees & Recursion (Binary Trees, Traversals)
- **Day 6**: Sorting & Searching (Merge Sort, Binary Search)
- **Day 7**: Hash Maps & Sets (HashMap, HashSet)

#### Mock Interview Section
- **Technical Round**: DSA and coding practice
- **Aptitude Round**: Quantitative aptitude
- **HR Round**: Behavioral questions

### 4. Professional Dashboard
#### Profile Management
- **Current Role**: Input current job title
- **Company**: Current company
- **Experience**: Years of experience (0-1, 1-3, 3-5, 5-10, 10+)
- **Skills**: Add/remove skills dynamically

#### AI-Powered Features
- **Trending Skills**: Top 6 trending skills with growth percentages
- **Certification Recommendations**: Google, Microsoft, AWS, Kubernetes
- **Career Path Suggestions**: Role progression with salary ranges
- **Salary Growth Predictions**: AI-powered salary increase estimates
- **Learning Plan**: Phase-based personalized roadmap

#### Career Paths
- **Senior Software Engineer**: $120K-$180K, +25% growth
- **Engineering Manager**: $150K-$220K, +35% growth
- **Tech Lead**: $130K-$190K, +30% growth

### 5. AI Engine (FastAPI)
#### Roadmap Generation Endpoint
- **Endpoint**: `POST /api/v1/generate-roadmap`
- **Input**: User type, current role, experience, skills
- **Output**: Personalized roadmap with:
  - Recommended skills
  - Career path suggestions
  - Salary growth predictions
  - Learning plan (3 phases)
  - Certification recommendations
  - Next steps

#### Student Roadmap
- 7-day detailed plan with topics
- Estimated hours per day
- Resource links
- Difficulty progression

#### Professional Roadmap
- AI skill recommendations
- Career path suggestions
- Salary growth predictions
- 3-phase learning plan
- Certification recommendations

### 6. Notifications System
#### Trending Updates Endpoint
- **Endpoint**: `GET /api/v1/notifications/trending-updates`
- **Features**:
  - Top 6 trending skills with demand levels
  - Latest tech updates (Python, React, AWS, Kubernetes)
  - Certification updates (Google, Azure, AWS)
  - Automatic notification creation
  - Priority-based notifications

#### Notification Types
- **Trending Skills**: High-demand skills notifications
- **Tech Updates**: Latest technology news
- **Certification Updates**: New exam patterns
- **Achievement Alerts**: Badge unlocks
- **Task Reminders**: Daily learning reminders

### 7. Streak System with Gamification
#### Badge System
- **First Step** (Common): Started learning journey
- **Week Warrior** (Rare): 7-day streak
- **Month Master** (Epic): 30-day streak
- **Century Club** (Legendary): 100-day streak
- **Streak Legend** (Legendary): 50+ day longest streak

#### Progress Tracking
- **Current Streak**: Daily streak count
- **Longest Streak**: Personal best
- **Total Active Days**: Cumulative active days
- **Streak Level**: Beginner → Expert → Legend
- **Progress to Next Milestone**: Visual progress bar
- **Weekly Pattern**: Last 7 days activity

#### Endpoints
- **Badges**: `GET /api/v1/streak/badges`
- **Progress**: `GET /api/v1/streak/progress`
- **Activity**: `POST /api/v1/streak/activity`
- **History**: `GET /api/v1/streak/history`

### 8. UI/UX Design
#### Design Principles
- **Dark Mode Default**: Modern dark theme
- **Gradient Accents**: Blue to purple gradients
- **Smooth Animations**: Framer Motion transitions
- **Card-Based Layout**: Clean card design
- **Responsive**: Mobile-first approach
- **SaaS Style**: Stripe/Linear inspired design

#### Components
- **Navigation**: Fixed header with blur effect
- **Stats Cards**: Key metrics display
- **Progress Bars**: Visual progress indicators
- **Topic Cards**: Topic display with action buttons
- **Badge Display**: Emoji-based badges with rarity
- **Form Inputs**: Modern input fields with icons

## Database Schema

### Tables
- **profiles**: User profiles with user_type
- **skills**: User skills with proficiency
- **tasks**: Daily learning tasks
- **streaks**: Streak tracking
- **notifications**: System notifications
- **certifications**: User certifications
- **career_predictions**: AI career insights
- **user_activity_logs**: Activity tracking

### Key Fields Added
- **profiles.user_type**: 'student' or 'professional'
- **notifications.notification_type**: 'trending_update', etc.
- **streaks.badges**: Badge tracking (JSON)

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile

### Roadmap
- `POST /api/v1/generate-roadmap` - AI roadmap generation

### Notifications
- `GET /api/v1/notifications/` - Get notifications
- `GET /api/v1/notifications/trending-updates` - Trending updates
- `POST /api/v1/notifications/` - Create notification
- `PUT /api/v1/notifications/{id}/read` - Mark as read

### Streak
- `GET /api/v1/streak/` - Get streak
- `GET /api/v1/streak/badges` - Get badges
- `GET /api/v1/streak/progress` - Get progress
- `POST /api/v1/streak/activity` - Record activity

### Profile
- `GET /api/v1/profile/{id}` - Get profile
- `POST /api/v1/profile/` - Create profile
- `PUT /api/v1/profile/{id}` - Update profile

### Skills
- `GET /api/v1/skills/` - Get skills
- `POST /api/v1/skills/` - Add skill
- `PUT /api/v1/skills/{id}` - Update skill
- `DELETE /api/v1/skills/{id}` - Delete skill

### Tasks
- `GET /api/v1/tasks/` - Get tasks
- `POST /api/v1/tasks/` - Create task
- `PUT /api/v1/tasks/{id}` - Update task
- `DELETE /api/v1/tasks/{id}` - Delete task

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- Supabase account
- Git

### Local Development

#### 1. Clone Repository
```bash
git clone <repository-url>
cd tulasi-ai-labs
```

#### 2. Set Up Supabase
- Create a new project in Supabase
- Run the SQL schema from `database/supabase-schema.sql`
- Enable Google OAuth in Authentication > Providers
- Get your credentials from Settings > API

#### 3. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Supabase credentials
```

#### 4. Frontend Setup
```bash
cd frontend
npm install
cp env.example .env.local
# Edit .env.local with your Supabase credentials
```

#### 5. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### 6. Access Applications
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Backend (.env)
```env
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Deployment

See `DEPLOYMENT.md` for detailed deployment instructions.

### Quick Deploy
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Render or Railway
- **Database**: Supabase (already hosted)

## Testing

### Frontend
```bash
cd frontend
npm run dev
```
Test the application at http://localhost:3000

### Backend
```bash
cd backend
python -m uvicorn app.main:app --reload
```
Test API at http://localhost:8000/docs

## Key Features Summary

### For Students
- ✅ 7-day structured learning roadmap
- ✅ DSA, Aptitude, Core subjects coverage
- ✅ Customizable daily learning time
- ✅ Progress tracking with streaks
- ✅ Mock interview preparation
- ✅ Gamified learning experience

### For Professionals
- ✅ AI-powered skill recommendations
- ✅ Certification suggestions with links
- ✅ Salary growth predictions
- ✅ Career path guidance
- ✅ Personalized learning plans
- ✅ Trending skills updates

### Platform Features
- ✅ Email + Google OAuth authentication
- ✅ Dynamic user routing
- ✅ Real-time notifications
- ✅ Badge system with gamification
- ✅ Modern dark-mode UI
- ✅ Responsive design
- ✅ API documentation
- ✅ Deployment ready

## Future Enhancements

Potential features to add:
- AI Mentor Chat (interactive guidance)
- Advanced analytics dashboard
- LinkedIn integration
- Job matching system
- Mobile apps (iOS/Android)
- Community features
- Advanced AI predictions
- Video interview preparation

## Support

For issues or questions:
- Check the documentation
- Review API docs at `/docs`
- Check deployment guide
- Open an issue on GitHub

## License

MIT License

---

Built with ❤️ using Next.js, FastAPI, and AI technologies
