import { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import type { Database } from './supabase'

type User = Database['public']['Tables']['users']['Row']

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export class AuthService {
  private static instance: AuthService
  private authState: AuthState = {
    user: null,
    loading: false,
    error: null
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async signup(email: string, password: string, name: string, profileData?: Partial<User>) {
    this.authState.loading = true
    this.authState.error = null

    try {
      // Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        // Create user profile in database
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert({
            email,
            name,
            ...profileData
          })
          .select()
          .single()

        if (userError) throw userError

        this.authState.user = userData
        return { success: true, user: userData }
      }

      throw new Error('Failed to create user')
    } catch (error: any) {
      this.authState.error = error.message
      return { success: false, error: error.message }
    } finally {
      this.authState.loading = false
    }
  }

  async login(email: string, password: string) {
    this.authState.loading = true
    this.authState.error = null

    try {
      // Sign in with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError

      if (authData.user) {
        // Get user profile from database
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single()

        if (userError) throw userError

        // Update last login
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', userData.id)

        this.authState.user = userData
        return { success: true, user: userData }
      }

      throw new Error('Login failed')
    } catch (error: any) {
      this.authState.error = error.message
      return { success: false, error: error.message }
    } finally {
      this.authState.loading = false
    }
  }

  async logout() {
    try {
      await supabase.auth.signOut()
      this.authState.user = null
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email!)
          .single()

        if (error) throw error

        this.authState.user = userData
        return userData
      }

      return null
    } catch (error: any) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  async updateProfile(userId: number, updates: Partial<User>) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      this.authState.user = data
      return { success: true, user: data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  getAuthState(): AuthState {
    return { ...this.authState }
  }

  // Listen to auth changes
  onAuthChange(callback: (user: User | null) => void) {
    if (!supabase) return () => {}
    return supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        const userData = await this.getCurrentUser()
        callback(userData || null)
      } else {
        callback(null)
      }
    })
  }
}

export const authService = AuthService.getInstance()
