# 🤖 TulasiAI Labs

AI-Powered Career Growth Platform - Transform your professional journey with intelligent insights and personalized learning paths.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-production%20ready-brightgreen.svg)

## ✨ Features

### 🧠 AI Career Intelligence
- **Career Prediction**: AI-powered role recommendations based on your skills and interests
- **Salary Insights**: Market-aligned salary ranges for your target roles
- **Personalized Roadmaps**: Step-by-step learning paths to reach your goals
- **Confidence Scoring**: Data-driven assessment of your career readiness

### 📊 Skill Tracking & Analytics
- **Comprehensive Skill Management**: Track 50+ technical and soft skills
- **Progress Visualization**: Beautiful charts showing your learning journey
- **Proficiency Levels**: From beginner to expert with detailed metrics
- **Skill Gap Analysis**: Identify and fill knowledge gaps

### 🎯 Daily Learning System
- **Smart Task Generation**: AI-created daily learning tasks
- **Streak Tracking**: Build consistent learning habits
- **Flexible Scheduling**: 1-3 hours per day customizable
- **Progress Analytics**: Weekly and monthly learning insights

### 🏆 Achievement & Certification System
- **Badge Integration**: Showcase Google, Microsoft, and other certifications
- **Achievement Tracking**: Unlock badges for milestones
- **Portfolio Building**: Display your professional growth
- **Verification System**: Validate and showcase credentials

### 📈 Job Readiness Score
- **Comprehensive Assessment**: Skills, consistency, certifications, experience
- **Real-time Updates**: Watch your score improve as you learn
- **Industry Benchmarks**: Compare against role requirements
- **Actionable Insights**: Specific recommendations to improve your score

### 🔔 Smart Notifications
- **AI Trends**: Stay updated with industry developments
- **Course Recommendations**: Personalized learning opportunities
- **Learning Reminders**: Never miss your daily goals
- **Achievement Alerts**: Celebrate your milestones

## 🏗️ Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom components
- **State Management**: Zustand for efficient state handling
- **UI Components**: Custom components with Lucide icons
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion for smooth interactions

### Backend (FastAPI)
- **Framework**: FastAPI with automatic OpenAPI docs
- **Database**: SQLAlchemy ORM with SQLite/PostgreSQL
- **Authentication**: JWT-based auth with Supabase integration
- **Validation**: Pydantic for request/response validation
- **API Documentation**: Auto-generated Swagger/OpenAPI docs

### Database & Infrastructure
- **Primary DB**: PostgreSQL (production) / SQLite (development)
- **Authentication**: Supabase Auth for secure user management
- **File Storage**: Supabase Storage for certifications
- **Real-time**: Supabase Realtime for live updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Supabase account
- Git

### 1. Clone & Setup
```bash
git clone https://github.com/your-username/tulasi-ai-labs.git
cd tulasi-ai-labs
```

### 2. Backend Setup
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

### 3. Frontend Setup
```bash
cd frontend
npm install
cp env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 4. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Access Applications
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📡 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile

### Career & Skills
- `POST /career/predict` - AI career prediction
- `GET /career/dashboard-stats` - Dashboard statistics
- `GET /skills/` - Get all skills
- `POST /skills/add` - Add user skill
- `PUT /skills/{id}` - Update skill proficiency

### Tasks & Learning
- `GET /tasks/` - Get user tasks
- `POST /tasks/` - Create new task
- `PUT /tasks/{id}` - Update task
- `POST /tasks/generate-daily` - Generate daily learning tasks

## 🗄️ Database Schema

### Core Tables
- **users** - User profiles and preferences
- **skills** - Available skills catalog
- **user_skills** - User-skill relationships with proficiency
- **tasks** - Daily learning tasks and activities
- **career_predictions** - AI-generated career insights
- **notifications** - System notifications and alerts
- **certifications** - User achievements and credentials

## 🎨 UI/UX Features

### Modern Design
- **Dark/Light Mode**: Seamless theme switching
- **Responsive Design**: Mobile-first approach
- **Micro-interactions**: Smooth animations and transitions
- **Loading States**: Skeleton screens and progress indicators
- **Error Handling**: User-friendly error messages

### Accessibility
- **WCAG 2.1 AA**: Semantic HTML and ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: Optimized for assistive technologies
- **High Contrast**: Enhanced visibility options

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure session management
- **Password Hashing**: bcrypt for password security
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Comprehensive data validation
- **SQL Injection Prevention**: ORM-based queries

### Data Protection
- **Environment Variables**: Sensitive data protection
- **API Rate Limiting**: Prevent abuse
- **HTTPS Ready**: SSL/TLS support
- **Privacy Controls**: User data management

## 📱 Mobile & Responsive

### Cross-Platform Support
- **PWA Ready**: Progressive Web App capabilities
- **Touch Optimized**: Mobile-friendly interactions
- **Offline Support**: Core functionality offline
- **App Store Ready**: Native app deployment

### Performance
- **Code Splitting**: Optimized bundle sizes
- **Lazy Loading**: On-demand component loading
- **Image Optimization**: WebP and responsive images
- **Caching Strategy**: Efficient data caching

## 🚀 Deployment

### Production Deployment

#### Frontend (Vercel/Netlify)
```bash
# Build for production
cd frontend
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
npm run build
netlify deploy --prod --dir=.next
```

#### Backend (Heroku/Railway/DigitalOcean)
```bash
# Set production environment variables
DATABASE_URL=postgresql://user:pass@host:port/db
SECRET_KEY=your-production-secret
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Deploy to Heroku
heroku create tulasi-ai-labs
git push heroku main

# Or deploy to Railway
railway up
```

### Environment Variables
```bash
# Backend (.env)
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:coverage  # Coverage report
```

### Backend Testing
```bash
cd backend
pytest                 # Unit tests
pytest -v              # Verbose output
pytest --cov=app      # Coverage report
```

## 📊 Monitoring & Analytics

### Application Monitoring
- **Error Tracking**: Sentry integration ready
- **Performance Monitoring**: Web Vitals tracking
- **User Analytics**: Privacy-friendly analytics
- **API Monitoring**: Request/response logging

### Business Metrics
- **User Engagement**: Learning streaks and completion rates
- **Skill Progress**: Most popular skills and learning paths
- **Career Success**: Job placement and advancement tracking
- **Platform Usage**: Feature adoption and retention

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting standards
- **Husky**: Pre-commit hooks for quality

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Lead Developer**: [Your Name](https://github.com/your-username)
- **AI/ML Engineer**: [Team Member](https://github.com/team-member)
- **UI/UX Designer**: [Designer](https://github.com/designer)
- **Product Manager**: [PM](https://github.com/pm)

## 🙏 Acknowledgments

- **Supabase** - Authentication and database services
- **Vercel** - Frontend hosting platform
- **Next.js** - React framework
- **FastAPI** - Python web framework
- **Tailwind CSS** - Utility-first CSS framework

## 📞 Support & Community

- **Documentation**: [docs.tulasi.ai](https://docs.tulasi.ai)
- **Community**: [Discord Server](https://discord.gg/tulasi-ai)
- **Issues**: [GitHub Issues](https://github.com/your-username/tulasi-ai-labs/issues)
- **Email**: support@tulasi.ai

## 🗺️ Roadmap

### Upcoming Features
- [ ] **AI Mentor Chat**: Interactive career guidance
- [ ] **Interview Preparation**: AI-powered mock interviews
- [ ] **Salary Negotiation**: Market-based negotiation tools
- [ ] **Company Matching**: AI-driven job matching
- [ ] **Learning Communities**: Peer learning groups

### Platform Enhancements
- [ ] **Mobile Apps**: Native iOS and Android apps
- [ ] **Advanced Analytics**: Predictive insights
- [ ] **Integration APIs**: LinkedIn, GitHub, etc.
- [ ] **Enterprise Features**: Team management and reporting

---

**Built with ❤️ using Next.js, FastAPI, and AI technologies**

🤖 *Transform your career with intelligent insights* 🚀
