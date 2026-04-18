# TulasiAI Labs - Setup Checklist

Use this checklist to verify your environment is set up correctly before running the application.

## Prerequisites Check

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Python 3.8+ installed (`python --version`)
- [ ] Git installed (`git --version`)
- [ ] Supabase account created
- [ ] Supabase project created

## Supabase Setup

- [ ] Created new Supabase project
- [ ] Ran SQL schema from `database/supabase-schema.sql`
- [ ] Verified all tables created in Table Editor:
  - [ ] profiles
  - [ ] skills
  - [ ] tasks
  - [ ] streaks
  - [ ] notifications
  - [ ] certifications
  - [ ] career_predictions
  - [ ] user_activity_logs
- [ ] Enabled Google OAuth in Authentication > Providers
- [ ] Added redirect URL for Google OAuth:
  - [ ] Local: `http://localhost:3000/auth/callback`
  - [ ] Production: `https://your-domain.vercel.app/auth/callback`
- [ ] Copied credentials from Settings > API:
  - [ ] Project URL
  - [ ] anon public key
  - [ ] service_role secret

## Backend Setup

- [ ] Navigated to `backend/` directory
- [ ] Created Python virtual environment
- [ ] Activated virtual environment
- [ ] Installed dependencies: `pip install -r requirements.txt`
- [ ] Created `.env` file from `.env.example`
- [ ] Configured `.env` with:
  - [ ] DATABASE_URL (correct format)
  - [ ] SECRET_KEY (random string)
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] Started backend server: `python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
- [ ] Verified backend running at http://localhost:8000
- [ ] Tested health check: http://localhost:8000/health
- [ ] Accessed API docs: http://localhost:8000/docs

## Frontend Setup

- [ ] Navigated to `frontend/` directory
- [ ] Installed dependencies: `npm install`
- [ ] Created `.env.local` file from `env.example`
- [ ] Configured `.env.local` with:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] NEXT_PUBLIC_API_URL
- [ ] Started frontend server: `npm run dev`
- [ ] Verified frontend running at http://localhost:3000
- [ ] Checked for build errors in terminal

## Integration Testing

### Authentication Flow
- [ ] Navigate to http://localhost:3000
- [ ] Click "Get Started" or "Sign up"
- [ ] Create account with email/password
- [ ] Verify email (if required by Supabase)
- [ ] Login successfully
- [ ] Redirected to onboarding page

### Onboarding Flow
- [ ] See onboarding page with two options
- [ ] Select "Preparing for placements" (Student)
- [ ] Click "Continue"
- [ ] Redirected to student dashboard
- [ ] Logout and test Professional flow
- [ ] Select "Working professional"
- [ ] Click "Continue"
- [ ] Redirected to professional dashboard

### Student Dashboard
- [ ] See dashboard header with navigation
- [ ] View stats cards (streak, tasks, time, progress)
- [ ] Test time selector (1hr, 2hr, 3hr)
- [ ] See daily roadmap with Day 1-7
- [ ] Click on different days to view topics
- [ ] See DSA, Aptitude, Core subjects sections
- [ ] View mock interview section
- [ ] Test marking day as complete

### Professional Dashboard
- [ ] See dashboard header with navigation
- [ ] View professional information form
- [ ] Test adding skills
- [ ] Test removing skills
- [ ] Click "Generate AI Insights"
- [ ] View AI insights section (if API working)
- [ ] See trending skills section
- [ ] View certification recommendations
- [ ] See career path suggestions
- [ ] View salary growth recommendations

### API Endpoints
- [ ] Test `GET /health` - Returns healthy status
- [ ] Test `GET /docs` - Shows Swagger UI
- [ ] Test `POST /api/v1/generate-roadmap` - Generates roadmap
- [ ] Test `GET /api/v1/notifications/trending-updates` - Returns trending data
- [ ] Test `GET /api/v1/streak/badges` - Returns badge data

### Notifications
- [ ] Check if trending notifications are created
- [ ] View notification center (if implemented)
- [ ] Test marking notifications as read

### Streak System
- [ ] Test recording activity
- [ ] View earned badges
- [ ] Check progress to next milestone
- [ ] Verify streak level display

## Common Issues Verification

### Port Conflicts
- [ ] Port 8000 is available for backend
- [ ] Port 3000 is available for frontend
- [ ] No other services using these ports

### Environment Variables
- [ ] All required env vars are set
- [ ] No typos in env variable names
- [ ] Supabase credentials are correct
- [ ] API URLs are correct (http vs https)

### CORS Configuration
- [ ] Backend CORS includes frontend URL
- [ ] No CORS errors in browser console
- [ ] API calls work from frontend

### Database Connection
- [ ] Backend can connect to Supabase
- [ ] No database connection errors in backend logs
- [ ] Can query database successfully

## File Structure Verification

### Frontend Files
- [ ] `frontend/src/app/onboarding/page.tsx` exists
- [ ] `frontend/src/app/student-dashboard/page.tsx` exists
- [ ] `frontend/src/app/professional-dashboard/page.tsx` exists
- [ ] `frontend/src/app/auth/callback/page.tsx` exists
- [ ] `frontend/src/lib/supabase-client.ts` has Google OAuth
- [ ] `frontend/vercel.json` exists

### Backend Files
- [ ] `backend/app/routers/roadmap.py` exists
- [ ] `backend/app/routers/notifications.py` has trending endpoint
- [ ] `backend/app/routers/streak.py` has badges endpoint
- [ ] `backend/render.yaml` exists
- [ ] `backend/railway.toml` exists

### Database Files
- [ ] `database/supabase-schema.sql` has user_type field
- [ ] Schema includes all required tables

### Documentation Files
- [ ] `README.md` exists
- [ ] `DEPLOYMENT.md` exists
- [ ] `PROJECT_SUMMARY.md` exists
- [ ] `QUICK_START.md` exists

## Performance Check

### Backend Performance
- [ ] Backend starts within 10 seconds
- [ ] API responses are under 500ms
- [ ] No memory leaks in logs
- [ ] Database queries are optimized

### Frontend Performance
- [ ] Page loads within 3 seconds
- [ ] No console errors
- [ ] Images are optimized
- [ ] Bundle size is reasonable

## Security Check

### Environment Variables
- [ ] No secrets committed to git
- [ ] .env files in .gitignore
- [ ] Strong SECRET_KEY used
- [ ] Supabase keys are correct (anon vs service_role)

### Authentication
- [ ] Password hashing is enabled
- [ ] JWT tokens are secure
- [ ] Session management works
- [ ] Protected routes are secure

### API Security
- [ ] CORS is properly configured
- [ ] Rate limiting is considered
- [ ] Input validation is in place
- [ ] SQL injection protection (ORM)

## Deployment Readiness

### Frontend Deployment
- [ ] Vercel account created
- [ ] `vercel.json` is configured
- [ ] Environment variables documented
- [ ] Build command works: `npm run build`

### Backend Deployment
- [ ] Render/Railway account created
- [ ] `render.yaml` or `railway.toml` configured
- [ ] Requirements.txt is complete
- [ ] Start command is correct

### Database Deployment
- [ ] Supabase is production-ready
- [ ] RLS policies are enabled
- [ ] Backups are configured
- [ ] Connection pooling is set

## Final Verification

### End-to-End Test
- [ ] Complete user signup flow
- [ ] Complete onboarding flow
- [ ] Access student dashboard
- [ ] Access professional dashboard
- [ ] Test all major features
- [ ] No critical errors in logs
- [ ] Application is stable

### Documentation
- [ ] All docs are up to date
- [ ] API docs are accurate
- [ ] Deployment guide is complete
- [ ] Quick start guide is tested

## Next Steps After Setup

Once all items are checked:

1. **Customize branding**: Update colors, logos, and content
2. **Add real AI**: Integrate actual AI services for roadmap generation
3. **Add more content**: Expand roadmap topics and professional insights
4. **Set up monitoring**: Add error tracking and analytics
5. **Deploy to production**: Follow DEPLOYMENT.md
6. **Set up CI/CD**: Configure automated testing and deployment

## Troubleshooting

If you encounter issues:

1. **Check logs**: Both backend and frontend terminals
2. **Check browser console**: For frontend errors
3. **Check Supabase logs**: For database errors
4. **Verify env vars**: Ensure all are set correctly
5. **Restart services**: Sometimes a simple restart fixes issues
6. **Clear cache**: Clear browser cache and node_modules

## Support Resources

- Main README: `/README.md`
- Project Summary: `/PROJECT_SUMMARY.md`
- Quick Start: `/QUICK_START.md`
- Deployment Guide: `/DEPLOYMENT.md`
- API Docs: http://localhost:8000/docs
- Supabase Docs: https://supabase.com/docs

---

✅ All checks completed? You're ready to go!
