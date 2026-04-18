import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const isValidSupabaseConfig = 
  supabaseUrl.startsWith('https://') && 
  supabaseAnonKey.length > 10

export const supabase = isValidSupabaseConfig 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Auth types
export interface AuthUser {
  id: string
  email?: string
  user_metadata?: Record<string, any>
}

// Auth service
export class AuthService {
  async signUp(email: string, password: string, name: string) {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.' }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) throw error
      
      return { success: true, user: data.user }
    } catch (error: any) {
      console.error('Sign up error:', error)
      return { success: false, error: error.message }
    }
  }

  async signIn(email: string, password: string) {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.' }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      return { success: true, user: data.user, session: data.session }
    } catch (error: any) {
      console.error('Sign in error:', error)
      return { success: false, error: error.message }
    }
  }

  async signOut() {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' }
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      return { success: true }
    } catch (error: any) {
      console.error('Sign out error:', error)
      return { success: false, error: error.message }
    }
  }

  async getCurrentUser() {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' }
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) throw error
      
      return { success: true, user }
    } catch (error: any) {
      console.error('Get current user error:', error)
      return { success: false, error: error.message }
    }
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    if (!supabase) {
      return () => {}
    }

    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null)
    })
  }

  async resetPassword(email: string) {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' }
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      
      return { success: true }
    } catch (error: any) {
      console.error('Reset password error:', error)
      return { success: false, error: error.message }
    }
  }

  async updatePassword(newPassword: string) {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' }
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      if (error) throw error
      
      return { success: true }
    } catch (error: any) {
      console.error('Update password error:', error)
      return { success: false, error: error.message }
    }
  }

  async signInWithGoogle() {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.' }
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
      
      return { success: true, url: data.url }
    } catch (error: any) {
      console.error('Google sign in error:', error)
      return { success: false, error: error.message }
    }
  }
}

export const authService = new AuthService()

// React hook for auth
export const useAuth = () => {
  const getCurrentUser = () => {
    return supabase?.auth.getUser()
  }

  const getSession = () => {
    return supabase?.auth.getSession()
  }

  return {
    supabase,
    getCurrentUser,
    getSession,
    authService,
  }
}
