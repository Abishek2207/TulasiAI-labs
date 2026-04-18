// ========================================
// TulasiAI Labs - Database Types
// Matches Supabase Schema
// ========================================

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          current_role: string | null
          target_role: string | null
          company: string | null
          daily_learning_hours: number
          job_readiness_score: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      skills: {
        Row: {
          id: string
          user_id: string
          skill_name: string
          level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          proficiency_level: number
          hours_practiced: number
          category: 'Frontend' | 'Backend' | 'AI/ML' | 'DevOps' | 'Cloud' | 'Mobile' | 'Database' | 'Other'
          last_practiced: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['skills']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['skills']['Row']>
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          task_type: 'learning' | 'project' | 'practice' | 'review' | 'certification'
          difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
          estimated_hours: number
          completed: boolean
          completed_at: string | null
          due_date: string | null
          priority: 'low' | 'medium' | 'high' | 'urgent'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['tasks']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tasks']['Row']>
      }
      streaks: {
        Row: {
          id: string
          user_id: string
          current_streak: number
          longest_streak: number
          last_active_date: string | null
          total_active_days: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['streaks']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['streaks']['Row']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          notification_type: 'achievement' | 'task_reminder' | 'career_insight' | 'skill_level_up' | 'task_completed' | 'streak_milestone' | 'certification_added'
          is_read: boolean
          metadata: any | null
          priority: 'low' | 'medium' | 'high'
          created_at: string
          read_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Row']>
      }
      certifications: {
        Row: {
          id: string
          user_id: string
          title: string
          issuer: string
          credential_url: string | null
          issue_date: string | null
          expiry_date: string | null
          credential_id: string | null
          verification_status: 'pending' | 'verified' | 'rejected'
          certificate_image_url: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['certifications']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['certifications']['Row']>
      }
      career_predictions: {
        Row: {
          id: string
          user_id: string
          suggested_roles: any
          salary_range: any
          confidence_score: number
          skill_gap_analysis: any
          insights: any
          roadmap: any
          market_trends: any
          prediction_version: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['career_predictions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['career_predictions']['Row']>
      }
      user_activity_logs: {
        Row: {
          id: string
          user_id: string
          activity_type: 'login' | 'skill_added' | 'skill_updated' | 'task_completed' | 'task_created' | 'certification_added' | 'profile_updated' | 'career_prediction_generated'
          activity_data: any
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_activity_logs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['user_activity_logs']['Row']>
      }
    }
    Views: {
      user_dashboard_stats: {
        Row: {
          user_id: string
          name: string
          email: string
          current_streak: number
          job_readiness_score: number
          total_skills: number
          advanced_skills: number
          expert_skills: number
          completed_tasks: number
          pending_tasks: number
          certifications: number
          total_hours_practiced: number
          unread_notifications: number
        }
      }
    }
    Functions: {
      update_updated_at_column: () => void
    }
    Enums: {
      // Add any enums if needed
    }
  }
}

// ========================================
// Common Type Aliases for Ease of Use
// ========================================

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Skill = Database['public']['Tables']['skills']['Row']
export type SkillInsert = Database['public']['Tables']['skills']['Insert']
export type SkillUpdate = Database['public']['Tables']['skills']['Update']

export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export type Streak = Database['public']['Tables']['streaks']['Row']
export type StreakInsert = Database['public']['Tables']['streaks']['Insert']
export type StreakUpdate = Database['public']['Tables']['streaks']['Update']

export type Notification = Database['public']['Tables']['notifications']['Row']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update']

export type Certification = Database['public']['Tables']['certifications']['Row']
export type CertificationInsert = Database['public']['Tables']['certifications']['Insert']
export type CertificationUpdate = Database['public']['Tables']['certifications']['Update']

export type CareerPrediction = Database['public']['Tables']['career_predictions']['Row']
export type CareerPredictionInsert = Database['public']['Tables']['career_predictions']['Insert']
export type CareerPredictionUpdate = Database['public']['Tables']['career_predictions']['Update']

export type UserActivityLog = Database['public']['Tables']['user_activity_logs']['Row']
export type UserActivityLogInsert = Database['public']['Tables']['user_activity_logs']['Insert']
export type UserActivityLogUpdate = Database['public']['Tables']['user_activity_logs']['Update']

export type DashboardStatsView = Database['public']['Views']['user_dashboard_stats']['Row']

// ========================================
// Enhanced Types for Application Logic
// ========================================

export interface UserSkill extends Skill {
  // This would be populated with JOIN queries
}

export interface UserTask extends Task {
  // This would be populated with JOIN queries
}

export interface UserNotification extends Notification {
  // This would be populated with JOIN queries
}

export interface UserCertification extends Certification {
  // This would be populated with JOIN queries
}

// ========================================
// API Response Types
// ========================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  success: boolean
  message: string
}

// ========================================
// Career Prediction Types (for frontend)
// ========================================

export interface SuggestedRole {
  title: string
  match_score: number
  description: string
  required_skills: string[]
  growth_potential: string
}

export interface SalaryRange {
  min: number
  max: number
  median: number
  currency: string
}

export interface RoadmapStep {
  title: string
  description: string
  estimated_time: string
  skills_required: string[]
  resources: string[]
  difficulty: string
  prerequisites: string[]
  completed: boolean
}

export interface SkillGap {
  skill_name: string
  current_level?: number
  required_level: number
  gap_description: string
  learning_priority: string
}

export interface Insight {
  type: string
  title: string
  description: string
  actionable: boolean
  priority: string
}

export interface MarketTrend {
  hot_skills: Array<{
    skill: string
    growth: string
    demand: string
  }>
  growing_industries: Array<{
    industry: string
    growth_rate: string
  }>
}

export interface CareerPredictionResponse {
  suggested_roles: SuggestedRole[]
  salary_range: SalaryRange
  roadmap: RoadmapStep[]
  skill_gap_analysis: SkillGap[]
  confidence_score: number
  insights: Insight[]
  market_trends: MarketTrend
  next_steps: string[]
}

// ========================================
// Utility Types
// ========================================

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type SkillCategory = 'Frontend' | 'Backend' | 'AI/ML' | 'DevOps' | 'Cloud' | 'Mobile' | 'Database' | 'Other'
export type TaskType = 'learning' | 'project' | 'practice' | 'review' | 'certification'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type NotificationType = 'achievement' | 'task_reminder' | 'career_insight' | 'skill_level_up' | 'task_completed' | 'streak_milestone' | 'certification_added'
export type VerificationStatus = 'pending' | 'verified' | 'rejected'
export type ActivityType = 'login' | 'skill_added' | 'skill_updated' | 'task_completed' | 'task_created' | 'certification_added' | 'profile_updated' | 'career_prediction_generated'

// ========================================
// Form Types
// ========================================

export interface ProfileFormData {
  name: string
  experience_level: ExperienceLevel
  current_role?: string
  target_role?: string
  company?: string
  daily_learning_hours: number
}

export interface SkillFormData {
  skill_name: string
  level: ExperienceLevel
  proficiency_level: number
  category: SkillCategory
}

export interface TaskFormData {
  title: string
  description?: string
  task_type: TaskType
  difficulty?: ExperienceLevel
  estimated_hours: number
  due_date?: string
  priority?: TaskPriority
}

export interface CertificationFormData {
  title: string
  issuer: string
  credential_url?: string
  issue_date?: string
  expiry_date?: string
  credential_id?: string
  description?: string
}

// ========================================
// Dashboard Stats Types
// ========================================

export interface DashboardStats {
  total_skills: number
  completed_tasks: number
  current_streak: number
  job_readiness_score: number
  weekly_hours: number
  skills_by_category: Record<string, number>
  recent_activity: Array<{
    type: string
    description: string
    timestamp: string
  }>
}
