import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const isValidSupabaseConfig = 
  supabaseUrl.startsWith('https://') && 
  supabaseAnonKey.length > 10

export const supabase = isValidSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any


// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          email: string
          name: string
          current_role: string | null
          target_role: string | null
          company: string | null
          experience_level: string | null
          daily_learning_hours: number
          streak_count: number
          last_login: string
          created_at: string
          updated_at: string
        }
        Insert: {
          email: string
          name: string
          current_role?: string | null
          target_role?: string | null
          company?: string | null
          experience_level?: string | null
          daily_learning_hours?: number
        }
        Update: {
          email?: string
          name?: string
          current_role?: string | null
          target_role?: string | null
          company?: string | null
          experience_level?: string | null
          daily_learning_hours?: number
        }
      }
      skills: {
        Row: {
          id: number
          name: string
          category: string
          description: string | null
          difficulty_level: string | null
        }
        Insert: {
          name: string
          category: string
          description?: string | null
          difficulty_level?: string | null
        }
        Update: {
          name?: string
          category?: string
          description?: string | null
          difficulty_level?: string | null
        }
      }
      user_skills: {
        Row: {
          id: number
          user_id: number
          skill_id: number
          proficiency_level: number
          hours_practiced: number
          last_practiced: string
          created_at: string
        }
        Insert: {
          user_id: number
          skill_id: number
          proficiency_level?: number
          hours_practiced?: number
        }
        Update: {
          proficiency_level?: number
          hours_practiced?: number
        }
      }
      tasks: {
        Row: {
          id: number
          user_id: number
          title: string
          description: string | null
          task_type: string | null
          difficulty: string | null
          estimated_hours: number
          completed: boolean
          completed_at: string | null
          due_date: string | null
          created_at: string
        }
        Insert: {
          user_id: number
          title: string
          description?: string | null
          task_type?: string | null
          difficulty?: string | null
          estimated_hours?: number
          due_date?: string | null
        }
        Update: {
          title?: string
          description?: string | null
          task_type?: string | null
          difficulty?: string | null
          estimated_hours?: number
          completed?: boolean
          due_date?: string | null
        }
      }
      notifications: {
        Row: {
          id: number
          user_id: number
          title: string
          message: string
          notification_type: string | null
          read: boolean
          metadata: any | null
          created_at: string
        }
        Insert: {
          user_id: number
          title: string
          message: string
          notification_type?: string | null
          metadata?: any | null
        }
        Update: {
          read?: boolean
        }
      }
      certifications: {
        Row: {
          id: number
          user_id: number
          name: string
          issuer: string
          credential_url: string | null
          issue_date: string | null
          expiry_date: string | null
          verified: boolean
          created_at: string
        }
        Insert: {
          user_id: number
          name: string
          issuer: string
          credential_url?: string | null
          issue_date?: string | null
          expiry_date?: string | null
        }
        Update: {
          name?: string
          issuer?: string
          credential_url?: string | null
          issue_date?: string | null
          expiry_date?: string | null
          verified?: boolean
        }
      }
    }
  }
}
