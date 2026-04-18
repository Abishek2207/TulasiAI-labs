import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'

interface User {
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

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (userData: {
    email: string
    password: string
    name: string
    current_role?: string
    target_role?: string
    company?: string
    experience_level?: string
    daily_learning_hours?: number
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>
  refreshUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          // For now, we'll use a mock login since we don't have Supabase auth set up
          // In production, you'd use: const { data, error } = await supabase.auth.signInWithPassword({ email, password })
          
          // Mock API call to backend
          const response = await fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.detail || 'Login failed')
          }

          const data = await response.json()
          
          set({
            user: data.user,
            token: data.access_token,
            isAuthenticated: true,
            isLoading: false,
          })

          return { success: true }
        } catch (error: any) {
          set({ isLoading: false })
          console.error('Login error:', error)
          return { success: false, error: error.message || 'Login failed. Please try again.' }
        }
      },

      signup: async (userData) => {
        set({ isLoading: true })
        try {
          // Mock signup - in production use Supabase auth
          const response = await fetch('http://localhost:8000/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.detail || 'Signup failed')
          }

          const data = await response.json()
          
          set({
            user: data.user,
            token: data.access_token,
            isAuthenticated: true,
            isLoading: false,
          })

          return { success: true }
        } catch (error: any) {
          set({ isLoading: false })
          console.error('Signup error:', error)
          return { success: false, error: error.message || 'Signup failed. Please try again.' }
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      updateProfile: async (userData) => {
        const { token } = get()
        if (!token) return { success: false, error: 'Not authenticated' }

        try {
          const response = await fetch('http://localhost:8000/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
          })

          if (!response.ok) {
            throw new Error('Update failed')
          }

          const updatedUser = await response.json()
          
          set(state => ({
            user: { ...state.user, ...updatedUser }
          }))

          return { success: true }
        } catch (error) {
          return { success: false, error: 'Profile update failed' }
        }
      },

      refreshUser: async () => {
        const { token } = get()
        if (!token) return

        try {
          const response = await fetch('http://localhost:8000/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const user = await response.json()
            set({ user })
          }
        } catch (error) {
          console.error('Failed to refresh user:', error)
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
