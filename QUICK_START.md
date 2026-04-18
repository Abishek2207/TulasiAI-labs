# TulasiAI Labs - Quick Start Guide

This guide will help you get the TulasiAI Labs platform running locally in under 10 minutes.

## Prerequisites

Make sure you have these installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://www.python.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Supabase Account** - [Sign up free](https://supabase.com/)

## Step 1: Set Up Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com/) and sign in/create account
2. Click "New Project" and create a new project
3. Wait for the project to be created (1-2 minutes)
4. Go to the SQL Editor in the left sidebar
5. Copy and paste the contents of `database/supabase-schema.sql`
6. Click "Run" to create all tables
7. Go to Authentication > Providers > Google
8. Enable Google OAuth and add your redirect URL:
   - For local: `http://localhost:3000/auth/callback`
9. Go to Settings > API and copy these credentials:
   - Project URL
   - anon public key
   - service_role secret

## Step 2: Backend Setup (3 minutes)

Open a terminal in the project directory:

```bash
cd backend
```

Create a virtual environment:

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` file with your Supabase credentials:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
SECRET_KEY=your-secret-key-here-generate-a-random-string
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Start the backend server:

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend is now running at: http://localhost:8000

## Step 3: Frontend Setup (2 minutes)

Open a new terminal in the project directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env.local` file:

```bash
cp env.example .env.local
```

Edit `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the frontend server:

```bash
npm run dev
```

Frontend is now running at: http://localhost:3000

## Step 4: Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Get Started" to sign up
3. Create an account with email/password or use Google sign-in
4. Complete the onboarding to select your user type (Student or Professional)
5. Explore your dashboard!

## Verify Everything Works

### Backend API
- Go to http://localhost:8000/docs
- You should see the Swagger API documentation
- Try the health check: http://localhost:8000/health

### Frontend
- Go to http://localhost:3000
- You should see the landing page
- Try signing up/logging in
- Navigate to the onboarding page
- Access your dashboard

### Database
- Go to your Supabase project dashboard
- Check the Table Editor
- Verify all tables are created (profiles, skills, tasks, streaks, notifications, etc.)

## Common Issues & Solutions

### Issue: Backend won't start
**Solution**: Make sure you're in the virtual environment and all dependencies are installed
```bash
pip install -r requirements.txt
```

### Issue: Frontend won't start
**Solution**: Delete node_modules and reinstall
```bash
rm -rf node_modules
npm install
```

### Issue: Database connection error
**Solution**: Verify your DATABASE_URL in .env file matches Supabase credentials

### Issue: Google OAuth not working
**Solution**: 
- Make sure Google OAuth is enabled in Supabase
- Check redirect URL matches exactly (including http/https and port)
- Verify your Google Cloud Console has the correct OAuth credentials

### Issue: CORS errors
**Solution**: The backend CORS is configured for localhost:3000. If using a different port, update `backend/app/main.py`

## Next Steps

Once everything is running:

1. **Test Student Dashboard**:
   - Sign up as a student
   - Explore the 7-day roadmap
   - Try the time selector
   - Mark tasks as complete
   - Check the streak system

2. **Test Professional Dashboard**:
   - Sign up as a professional
   - Add your skills and experience
   - Generate AI insights
   - View trending skills
   - Check certification recommendations

3. **Test API Endpoints**:
   - Go to http://localhost:8000/docs
   - Try the roadmap generation endpoint
   - Test the notifications endpoint
   - Check the streak badges endpoint

## Development Tips

### Hot Reload
- Backend: Auto-reloads on file changes
- Frontend: Auto-reloads on file changes

### Debugging
- Backend: Check terminal for errors
- Frontend: Check browser console (F12)
- Database: Check Supabase logs

### Reset Database
If you want to start fresh:
```sql
-- In Supabase SQL Editor
DROP TABLE IF EXISTS user_activity_logs CASCADE;
DROP TABLE IF EXISTS career_predictions CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS streaks CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```
Then re-run the schema SQL.

## Useful Commands

### Backend
```bash
# Start server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests
pytest

# Check Python version
python --version
```

### Frontend
```bash
# Start server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

### Database
```bash
# Connect to Supabase database via psql
psql postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
```

## Need Help?

- Check the main README.md
- Review the DEPLOYMENT.md
- Look at PROJECT_SUMMARY.md
- Check API docs at http://localhost:8000/docs
- Open an issue on GitHub

## What's Next?

After getting the app running locally:

1. **Customize the UI**: Modify the Tailwind colors and components
2. **Add More Features**: Extend the roadmap, add more topics
3. **Connect Real AI**: Replace mock AI with actual AI services
4. **Deploy to Production**: Follow DEPLOYMENT.md
5. **Add Tests**: Write unit and integration tests

---

Happy coding! 🚀
