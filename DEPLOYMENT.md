# TulasiAI Labs - Deployment Guide

This guide covers deploying the TulasiAI Labs platform to production using Vercel for the frontend and Render/Railway for the backend.

## Prerequisites

- Node.js 18+
- Python 3.8+
- Supabase account with project set up
- Git repository with the code
- Vercel account (for frontend)
- Render or Railway account (for backend)

## Environment Variables

### Frontend Environment Variables (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_URL=your-backend-api-url
```

### Backend Environment Variables (.env)
```env
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-secret-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Frontend Deployment (Vercel)

### Option 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from frontend directory:
```bash
cd frontend
vercel
```

4. Set environment variables in Vercel dashboard:
   - Go to Project Settings > Environment Variables
   - Add all frontend environment variables

5. Production deployment:
```bash
vercel --prod
```

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and login
2. Click "Add New Project"
3. Import your Git repository
4. Select the `frontend` directory as root directory
5. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add environment variables
7. Click "Deploy"

### Vercel Configuration

The `vercel.json` file in the frontend directory includes:
- Build and start commands
- Environment variable references
- Security headers
- Region settings

## Backend Deployment (Render)

### Option 1: Render Dashboard

1. Go to [render.com](https://render.com) and login
2. Click "New" > "Web Service"
3. Connect your Git repository
4. Configure service settings:
   - Name: `tulasi-ai-labs-api`
   - Runtime: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - DATABASE_URL
   - SECRET_KEY
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - PORT: 8000
6. Click "Deploy Web Service"

### Option 2: Render CLI

1. Install Render CLI:
```bash
npm install -g @render/cli
```

2. Login:
```bash
render login
```

3. Deploy using render.yaml:
```bash
cd backend
render deploy
```

## Backend Deployment (Railway)

### Option 1: Railway Dashboard

1. Go to [railway.app](https://railway.app) and login
2. Click "New Project" > "Deploy from GitHub repo"
3. Select your repository
4. Configure service:
   - Name: `tulasi-ai-labs-api`
   - Runtime: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in the Variables tab
6. Click "Deploy"

### Option 2: Railway CLI

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login:
```bash
railway login
```

3. Initialize and deploy:
```bash
cd backend
railway init
railway up
```

## Database Setup (Supabase)

1. Go to your Supabase project dashboard
2. Run the SQL schema from `database/supabase-schema.sql`
3. Enable Google OAuth in Authentication > Providers > Google
4. Configure your redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-frontend-domain.com/auth/callback`
5. Get your credentials:
   - Project URL: Settings > API
   - Anon Key: Settings > API
   - Service Role Key: Settings > API

## Post-Deployment Steps

### 1. Update Frontend Environment Variables

After deploying the backend, update your frontend environment variables with the production backend URL.

### 2. Configure CORS

Update the CORS settings in `backend/app/main.py` to include your production frontend URL:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend-domain.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Test the Application

1. Test authentication flow
2. Test onboarding and dashboard routing
3. Test API endpoints
4. Test notifications and streak system

### 4. Set Up Monitoring

- Enable Vercel Analytics for frontend
- Set up Render/Railway logs for backend
- Configure error tracking (Sentry recommended)

## CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend

  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/build-push-action@v2
        with:
          context: ./backend
          push: true
          tags: your-registry/tulasi-ai-labs-api:latest
```

## Troubleshooting

### Frontend Issues

**Build fails:**
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Check environment variables are set

**Runtime errors:**
- Verify API URL is correct
- Check CORS configuration
- Ensure Supabase credentials are valid

### Backend Issues

**Deployment fails:**
- Check Python version (should be 3.8+)
- Verify all dependencies in requirements.txt
- Check environment variables

**Runtime errors:**
- Check database connection string
- Verify Supabase credentials
- Check logs in Render/Railway dashboard

### Database Issues

**Connection errors:**
- Verify DATABASE_URL is correct
- Check Supabase database is active
- Ensure connection pooling is configured

**Schema errors:**
- Run the migration SQL script
- Verify all tables are created
- Check RLS policies

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Enable HTTPS** - Both Vercel and Render/Railway provide free SSL
3. **Set up rate limiting** - Implement in backend
4. **Use strong secret keys** - Generate secure random keys
5. **Enable RLS policies** - Already configured in Supabase schema
6. **Regular updates** - Keep dependencies updated
7. **Monitor logs** - Set up alerting for errors

## Scaling

### Frontend (Vercel)

- Vercel automatically scales
- Edge caching included
- CDN distribution worldwide
- No additional cost for scaling

### Backend (Render/Railway)

- Free tier: 512MB RAM, 0.1 CPU
- Paid tiers available for scaling
- Horizontal scaling with load balancer
- Database scaling through Supabase

## Cost Estimate

### Frontend (Vercel)
- Free tier: 100GB bandwidth/month
- Pro tier: $20/month (unlimited bandwidth)

### Backend (Render)
- Free tier: 750 hours/month
- Starter: $7/month (more CPU/RAM)
- Standard: $25/month (better performance)

### Database (Supabase)
- Free tier: 500MB database
- Pro tier: $25/month (8GB database)

**Total estimated cost for production: ~$50-70/month**

## Support

For issues or questions:
- Check the documentation in `/database/README.md`
- Review API docs at `/docs` endpoint
- Check logs in deployment dashboards
- Open an issue on GitHub
