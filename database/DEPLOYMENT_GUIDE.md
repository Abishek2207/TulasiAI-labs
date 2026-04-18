# TulasiAI Labs - Supabase Deployment Guide

## Overview
This guide will help you set up the complete Supabase database schema for TulasiAI Labs SaaS platform.

## Prerequisites
- Supabase account (https://supabase.com)
- Basic understanding of SQL and PostgreSQL
- Access to Supabase project dashboard

## Step 1: Create Supabase Project

1. **Sign up/login to Supabase**
   - Go to https://supabase.com
   - Create account or login

2. **Create new project**
   - Click "New Project"
   - Choose organization
   - Set project name: `tulasi-ai-labs`
   - Set database password (save it securely)
   - Choose region closest to your users
   - Click "Create new project"

3. **Wait for setup**
   - Wait 1-2 minutes for project to be ready
   - Note down your project URL and anon key

## Step 2: Set up Authentication

1. **Enable authentication**
   - Go to Authentication > Settings
   - Ensure "Enable email signups" is ON
   - Configure email templates if needed

2. **Set up redirect URLs**
   - Go to Authentication > URL Configuration
   - Add your frontend URLs:
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)

## Step 3: Execute Database Schema

1. **Open SQL Editor**
   - Go to Database > SQL Editor
   - Click "New query"

2. **Execute the schema**
   - Copy the entire content of `supabase-schema.sql`
   - Paste into the SQL Editor
   - Click "Run" or press `Ctrl+Enter`

3. **Verify tables created**
   - Go to Database > Tables
   - You should see all tables:
     - `profiles`
     - `skills`
     - `tasks`
     - `streaks`
     - `notifications`
     - `certifications`
     - `career_predictions`
     - `user_activity_logs`

## Step 4: Configure Environment Variables

Create a `.env.local` file in your frontend project:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Where to find these values:**
- Go to Project Settings > API
- Copy the Project URL and anon key
- Service role key is also available there (keep this secret!)

## Step 5: Test Database Connection

1. **Create test user**
   ```sql
   -- Test user creation (this will be done through the app)
   INSERT INTO profiles (user_id, name, email, experience_level, daily_learning_hours)
   VALUES ('test-user-id', 'Test User', 'test@example.com', 'beginner', 2);
   ```

2. **Verify RLS policies**
   - Try to query as different users
   - Ensure users can only access their own data

## Step 6: Set up Database Functions (Optional)

For advanced features, you might want to add these functions:

```sql
-- Function to calculate job readiness score
CREATE OR REPLACE FUNCTION calculate_job_readiness_score(user_uuid UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    score DECIMAL(5,2) := 0;
    skill_count INTEGER;
    completed_tasks INTEGER;
    certifications_count INTEGER;
    streak_days INTEGER;
BEGIN
    -- Get user data
    SELECT 
        COUNT(DISTINCT s.id) as skill_count,
        COUNT(DISTINCT CASE WHEN t.completed = TRUE THEN t.id END) as completed_tasks,
        COUNT(DISTINCT c.id) as certifications_count,
        COALESCE(st.current_streak, 0) as streak_days
    INTO skill_count, completed_tasks, certifications_count, streak_days
    FROM profiles p
    LEFT JOIN skills s ON p.id = s.user_id
    LEFT JOIN tasks t ON p.id = t.user_id
    LEFT JOIN certifications c ON p.id = c.user_id
    LEFT JOIN streaks st ON p.id = st.user_id
    WHERE p.id = user_uuid;
    
    -- Calculate score
    score := (
        (LEAST(skill_count, 10) / 10.0 * 40) +  -- Skills: 40%
        (LEAST(completed_tasks, 50) / 50.0 * 25) +  -- Tasks: 25%
        (LEAST(certifications_count, 5) / 5.0 * 20) +  -- Certifications: 20%
        (LEAST(streak_days, 30) / 30.0 * 15)  -- Streak: 15%
    );
    
    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Function to update streak
CREATE OR REPLACE FUNCTION update_user_streak(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    last_active DATE;
    current_date DATE := CURRENT_DATE;
    new_streak INTEGER;
BEGIN
    -- Get last active date
    SELECT last_active_date INTO last_active
    FROM streaks
    WHERE user_id = user_uuid;
    
    -- Handle different cases
    IF last_active IS NULL THEN
        -- First time user
        INSERT INTO streaks (user_id, current_streak, last_active_date, total_active_days)
        VALUES (user_uuid, 1, current_date, 1);
    ELSIF last_active = current_date - INTERVAL '1 day' THEN
        -- Consecutive day
        UPDATE streaks 
        SET 
            current_streak = current_streak + 1,
            longest_streak = GREATEST(longest_streak, current_streak + 1),
            last_active_date = current_date,
            total_active_days = total_active_days + 1
        WHERE user_id = user_uuid;
    ELSIF last_active = current_date THEN
        -- Same day, no change
        RETURN;
    ELSE
        -- Streak broken
        UPDATE streaks 
        SET 
            current_streak = 1,
            last_active_date = current_date,
            total_active_days = total_active_days + 1
        WHERE user_id = user_uuid;
    END IF;
END;
$$ LANGUAGE plpgsql;
```

## Step 7: Set up Real-time Subscriptions (Optional)

Enable real-time for tables that need live updates:

```sql
-- Enable real-time for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Enable real-time for tasks
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;

-- Enable real-time for skills
ALTER PUBLICATION supabase_realtime ADD TABLE skills;
```

## Step 8: Create Database Backups

1. **Set up automatic backups**
   - Go to Database > Backups
   - Enable scheduled backups
   - Set backup frequency (daily recommended)

2. **Manual backup**
   - Go to Database > Backups
   - Click "Create backup"
   - Download and store securely

## Step 9: Monitor Performance

1. **Check query performance**
   - Go to Database > Logs
   - Monitor slow queries
   - Optimize indexes if needed

2. **Monitor storage**
   - Go to Database > Usage
   - Track storage usage
   - Set up alerts for limits

## Step 10: Security Checklist

- [ ] RLS policies enabled on all tables
- [ ] No public access to sensitive data
- [ ] API keys properly secured
- [ ] Database backups configured
- [ ] Audit logging enabled
- [ ] Rate limiting configured

## Common Issues and Solutions

### Issue: "Permission denied for table"
**Solution:** Ensure RLS policies are properly set up and user is authenticated

### Issue: "UUID generation error"
**Solution:** Ensure `uuid-ossp` extension is enabled (it's in the schema)

### Issue: "Foreign key constraint violation"
**Solution:** Ensure parent record exists before creating child records

### Issue: "RLS policy too restrictive"
**Solution:** Review and adjust RLS policies for proper access

## Testing the Setup

1. **Test user registration**
   - Create a new user through your app
   - Verify profile is created in database

2. **Test data operations**
   - Add skills, tasks, certifications
   - Verify they appear in dashboard

3. **Test security**
   - Try to access other users' data (should fail)
   - Verify RLS policies work correctly

## Production Considerations

1. **Environment Variables**
   - Never commit `.env.local` to git
   - Use different keys for development/production

2. **Database Pooling**
   - Configure connection pooling for high traffic
   - Monitor connection limits

3. **Scaling**
   - Monitor database size growth
   - Plan for data archiving if needed

4. **Compliance**
   - Ensure GDPR compliance if storing EU data
   - Set up data retention policies

## Support Resources

- **Supabase Documentation**: https://supabase.com/docs
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Community Forum**: https://github.com/supabase/supabase/discussions

---

## Quick Start Commands

```sql
-- Test the setup
SELECT COUNT(*) FROM profiles;
SELECT COUNT(*) FROM skills;
SELECT COUNT(*) FROM tasks;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename IN ('profiles', 'skills', 'tasks');

-- Test user creation (through app, not SQL)
-- This should be handled by your authentication flow
```

Your TulasiAI Labs database is now ready for production use!
