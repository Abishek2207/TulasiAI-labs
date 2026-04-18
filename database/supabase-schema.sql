-- ========================================
-- TulasiAI Labs - Supabase Database Schema
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. PROFILES TABLE
-- ========================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('student', 'professional')),
    experience_level TEXT NOT NULL CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    current_role TEXT,
    target_role TEXT,
    company TEXT,
    industry TEXT,
    salary_range TEXT,
    career_goal TEXT,
    daily_learning_hours INTEGER DEFAULT 1 CHECK (daily_learning_hours >= 1 AND daily_learning_hours <= 24),
    job_readiness_score DECIMAL(5,2) DEFAULT 0.00 CHECK (job_readiness_score >= 0 AND job_readiness_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id),
    CHECK (char_length(name) >= 2),
    CHECK (char_length(email) >= 5)
);

-- ========================================
-- 2. SKILLS TABLE
-- ========================================
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    skill_name TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    proficiency_level INTEGER DEFAULT 1 CHECK (proficiency_level >= 1 AND proficiency_level <= 10),
    hours_practiced DECIMAL(8,2) DEFAULT 0.00 CHECK (hours_practiced >= 0),
    category TEXT NOT NULL CHECK (category IN ('Frontend', 'Backend', 'AI/ML', 'DevOps', 'Cloud', 'Mobile', 'Database', 'Other')),
    last_practiced TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, skill_name),
    CHECK (char_length(skill_name) >= 2)
);

-- ========================================
-- 3. TASKS TABLE
-- ========================================
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    task_type TEXT NOT NULL CHECK (task_type IN ('learning', 'project', 'practice', 'review', 'certification')),
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
    estimated_hours DECIMAL(4,2) DEFAULT 1.00 CHECK (estimated_hours >= 0.5 AND estimated_hours <= 24),
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CHECK (char_length(title) >= 3)
);

-- ========================================
-- 4. STREAKS TABLE
-- ========================================
CREATE TABLE streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
    longest_streak INTEGER DEFAULT 0 CHECK (longest_streak >= 0),
    last_active_date DATE,
    total_active_days INTEGER DEFAULT 0 CHECK (total_active_days >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id)
);

-- ========================================
-- 5. NOTIFICATIONS TABLE
-- ========================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT NOT NULL CHECK (notification_type IN ('achievement', 'task_reminder', 'career_insight', 'skill_level_up', 'task_completed', 'streak_milestone', 'certification_added')),
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CHECK (char_length(title) >= 3),
    CHECK (char_length(message) >= 10)
);

-- ========================================
-- 6. CERTIFICATIONS TABLE
-- ========================================
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    credential_url TEXT,
    issue_date DATE,
    expiry_date DATE,
    credential_id TEXT,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    certificate_image_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CHECK (char_length(title) >= 3),
    CHECK (char_length(issuer) >= 2),
    CHECK (issue_date <= COALESCE(expiry_date, '9999-12-31'))
);

-- ========================================
-- 7. CAREER PREDICTIONS TABLE (Optional Enhancement)
-- ========================================
CREATE TABLE career_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    suggested_roles JSONB NOT NULL,
    salary_range JSONB NOT NULL,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    skill_gap_analysis JSONB,
    insights JSONB,
    roadmap JSONB,
    market_trends JSONB,
    prediction_version TEXT DEFAULT '1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CHECK (char_length(prediction_version) >= 1)
);

-- ========================================
-- 8. USER ACTIVITY LOG TABLE (For Analytics)
-- ========================================
CREATE TABLE user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('login', 'skill_added', 'skill_updated', 'task_completed', 'task_created', 'certification_added', 'profile_updated', 'career_prediction_generated')),
    activity_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Profiles indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_experience_level ON profiles(experience_level);

-- Skills indexes
CREATE INDEX idx_skills_user_id ON skills(user_id);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_level ON skills(level);
CREATE INDEX idx_skills_user_skill ON skills(user_id, skill_name);

-- Tasks indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_type ON tasks(task_type);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

-- Streaks indexes
CREATE INDEX idx_streaks_user_id ON streaks(user_id);
CREATE INDEX idx_streaks_last_active ON streaks(last_active_date);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Certifications indexes
CREATE INDEX idx_certifications_user_id ON certifications(user_id);
CREATE INDEX idx_certifications_verification_status ON certifications(verification_status);
CREATE INDEX idx_certifications_issuer ON certifications(issuer);

-- Career predictions indexes
CREATE INDEX idx_career_predictions_user_id ON career_predictions(user_id);
CREATE INDEX idx_career_predictions_confidence ON career_predictions(confidence_score);

-- Activity logs indexes
CREATE INDEX idx_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_activity_logs_type ON user_activity_logs(activity_type);
CREATE INDEX idx_activity_logs_created_at ON user_activity_logs(created_at);

-- ========================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON streaks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Skills policies
CREATE POLICY "Users can view own skills" ON skills
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own skills" ON skills
    FOR ALL USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can view own tasks" ON tasks
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own tasks" ON tasks
    FOR ALL USING (auth.uid() = user_id);

-- Streaks policies
CREATE POLICY "Users can view own streaks" ON streaks
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own streaks" ON streaks
    FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own notifications" ON notifications
    FOR ALL USING (auth.uid() = user_id);

-- Certifications policies
CREATE POLICY "Users can view own certifications" ON certifications
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own certifications" ON certifications
    FOR ALL USING (auth.uid() = user_id);

-- Career predictions policies
CREATE POLICY "Users can view own career predictions" ON career_predictions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own career predictions" ON career_predictions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activity logs policies
CREATE POLICY "Users can view own activity logs" ON user_activity_logs
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity logs" ON user_activity_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================
-- VIEWS FOR COMMON QUERIES
-- ========================================

-- User dashboard stats view
CREATE VIEW user_dashboard_stats AS
SELECT 
    p.id as user_id,
    p.name,
    p.email,
    p.current_streak,
    p.job_readiness_score,
    COUNT(DISTINCT s.id) as total_skills,
    COUNT(DISTINCT CASE WHEN s.level = 'advanced' THEN s.id END) as advanced_skills,
    COUNT(DISTINCT CASE WHEN s.level = 'expert' THEN s.id END) as expert_skills,
    COUNT(DISTINCT CASE WHEN t.completed = TRUE THEN t.id END) as completed_tasks,
    COUNT(DISTINCT CASE WHEN t.completed = FALSE THEN t.id END) as pending_tasks,
    COUNT(DISTINCT c.id) as certifications,
    COALESCE(s.total_hours_practiced, 0) as total_hours_practiced,
    COALESCE(n.unread_count, 0) as unread_notifications
FROM profiles p
LEFT JOIN (
    SELECT user_id, COUNT(*) as total_skills, SUM(hours_practiced) as total_hours_practiced
    FROM skills GROUP BY user_id
) s ON p.id = s.user_id
LEFT JOIN tasks t ON p.id = t.user_id
LEFT JOIN certifications c ON p.id = c.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) as unread_count
    FROM notifications WHERE is_read = FALSE GROUP BY user_id
) n ON p.id = n.user_id
GROUP BY p.id, p.name, p.email, p.current_streak, p.job_readiness_score, s.total_skills, s.total_hours_practiced, n.unread_count;

-- ========================================
-- SAMPLE DATA INSERTIONS (Optional)
-- ========================================

-- This would be populated through the application, not here

-- ========================================
-- NOTES FOR DEPLOYMENT
-- ========================================

/*
1. Run this SQL in Supabase SQL Editor
2. Make sure Supabase Auth is enabled
3. Set up proper environment variables
4. Test RLS policies with actual user authentication
5. Consider adding database functions for complex calculations
6. Set up proper backup strategies
7. Monitor performance with the indexes provided
8. Consider adding materialized views for heavy analytics queries
*/
