import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '@/lib/auth'
import { apiService } from '@/lib/api-service'
import type { Database } from '@/lib/supabase'
import type { CareerPrediction } from '@/lib/api-service'

type User = Database['public']['Tables']['users']['Row']
type Skill = Database['public']['Tables']['skills']['Row']
type UserSkill = Database['public']['Tables']['user_skills']['Row']
type Task = Database['public']['Tables']['tasks']['Row']
type Notification = Database['public']['Tables']['notifications']['Row']
type Certification = Database['public']['Tables']['certifications']['Row']

interface AppState {
  // User state
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null

  // Data
  skills: Skill[]
  userSkills: (UserSkill & { skills: Skill })[]
  tasks: Task[]
  notifications: Notification[]
  certifications: Certification[]
  dashboardStats: any
  careerPrediction: CareerPrediction | null

  // Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void

  // Authentication
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string, profileData?: Partial<User>) => Promise<boolean>
  logout: () => Promise<void>
  getCurrentUser: () => Promise<void>

  // Profile
  updateProfile: (updates: Partial<User>) => Promise<void>

  // Skills
  fetchSkills: () => Promise<void>
  fetchUserSkills: () => Promise<void>
  addUserSkill: (skillId: number, proficiencyLevel?: number) => Promise<void>
  updateUserSkill: (userSkillId: number, updates: any) => Promise<void>
  deleteUserSkill: (userSkillId: number) => Promise<void>

  // Tasks
  fetchTasks: () => Promise<void>
  createTask: (taskData: any) => Promise<void>
  updateTask: (taskId: number, updates: any) => Promise<void>
  deleteTask: (taskId: number) => Promise<void>

  // Notifications
  fetchNotifications: () => Promise<void>
  markNotificationRead: (notificationId: number) => Promise<void>
  createNotification: (notificationData: any) => Promise<void>

  // Certifications
  fetchCertifications: () => Promise<void>
  addCertification: (certificationData: any) => Promise<void>

  // Dashboard
  fetchDashboardStats: () => Promise<void>
  predictCareer: () => Promise<void>
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Data
      skills: [],
      userSkills: [],
      tasks: [],
      notifications: [],
      certifications: [],
      dashboardStats: null,
      careerPrediction: null,

      // Basic actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Authentication
      login: async (email: string, password: string) => {
        set({ loading: true, error: null })
        try {
          const result = await authService.login(email, password)
          if (result.success) {
            set({ 
              user: result.user, 
              isAuthenticated: true, 
              loading: false 
            })
            // Load user data
            await get().fetchUserSkills()
            await get().fetchTasks()
            await get().fetchNotifications()
            await get().fetchCertifications()
            await get().fetchDashboardStats()
            return true
          } else {
            set({ error: result.error, loading: false })
            return false
          }
        } catch (error: any) {
          set({ error: error.message, loading: false })
          return false
        }
      },

      signup: async (email: string, password: string, name: string, profileData) => {
        set({ loading: true, error: null })
        try {
          const result = await authService.signup(email, password, name, profileData)
          if (result.success) {
            set({ 
              user: result.user, 
              isAuthenticated: true, 
              loading: false 
            })
            return true
          } else {
            set({ error: result.error, loading: false })
            return false
          }
        } catch (error: any) {
          set({ error: error.message, loading: false })
          return false
        }
      },

      logout: async () => {
        try {
          await authService.logout()
          set({ 
            user: null, 
            isAuthenticated: false,
            skills: [],
            userSkills: [],
            tasks: [],
            notifications: [],
            certifications: [],
            dashboardStats: null,
            careerPrediction: null
          })
        } catch (error: any) {
          set({ error: error.message })
        }
      },

      getCurrentUser: async () => {
        try {
          const user = await authService.getCurrentUser()
          if (user) {
            set({ 
              user, 
              isAuthenticated: true 
            })
            // Load user data
            await get().fetchUserSkills()
            await get().fetchTasks()
            await get().fetchNotifications()
            await get().fetchCertifications()
            await get().fetchDashboardStats()
          }
        } catch (error: any) {
          console.error('Error getting current user:', error)
        }
      },

      // Profile
      updateProfile: async (updates) => {
        const { user } = get()
        if (!user) return

        set({ loading: true })
        try {
          const result = await authService.updateProfile(user.id, updates)
          if (result.success) {
            set({ user: result.user, loading: false })
          } else {
            set({ error: result.error, loading: false })
          }
        } catch (error: any) {
          set({ error: error.message, loading: false })
        }
      },

      // Skills
      fetchSkills: async () => {
        try {
          const skills = await apiService.getSkills()
          set({ skills })
        } catch (error: any) {
          set({ error: error.message })
        }
      },

      fetchUserSkills: async () => {
        const { user } = get()
        if (!user) return

        try {
          const userSkills = await apiService.getUserSkills(user.id)
          set({ userSkills })
        } catch (error: any) {
          set({ error: error.message })
        }
      },

      addUserSkill: async (skillId, proficiencyLevel = 1) => {
        const { user } = get()
        if (!user) return

        set({ loading: true })
        try {
          await apiService.addUserSkill(user.id, skillId, proficiencyLevel)
          await get().fetchUserSkills()
          await get().fetchDashboardStats()
          set({ loading: false })
        } catch (error: any) {
          set({ error: error.message, loading: false })
        }
      },

      updateUserSkill: async (userSkillId, updates) => {
        set({ loading: true })
        try {
          await apiService.updateUserSkill(userSkillId, updates)
          await get().fetchUserSkills()
          await get().fetchDashboardStats()
          set({ loading: false })
        } catch (error: any) {
          set({ error: error.message, loading: false })
        }
      },

      deleteUserSkill: async (userSkillId) => {
        set({ loading: true })
        try {
          await apiService.deleteUserSkill(userSkillId)
          await get().fetchUserSkills()
          await get().fetchDashboardStats()
          set({ loading: false })
        } catch (error: any) {
          set({ error: error.message, loading: false })
        }
      },

      // Tasks
      fetchTasks: async () => {
        const { user } = get()
        if (!user) return

        try {
          const tasks = await apiService.getTasks(user.id)
          set({ tasks })
        } catch (error: any) {
          set({ error: error.message })
        }
      },

      createTask: async (taskData) => {
        const { user } = get()
        if (!user) return

        set({ loading: true })
        try {
          await apiService.createTask(user.id, taskData)
          await get().fetchTasks()
          await get().fetchDashboardStats()
          set({ loading: false })
        } catch (error: any) {
          set({ error: error.message, loading: false })
        }
      },

      updateTask: async (taskId, updates) => {
        set({ loading: true })
        try {
          await apiService.updateTask(taskId, updates)
          await get().fetchTasks()
          await get().fetchDashboardStats()
          set({ loading: false })
        } catch (error: any) {
          set({ error: error.message, loading: false })
        }
      },

      deleteTask: async (taskId) => {
        set({ loading: true })
        try {
          await apiService.deleteTask(taskId)
          await get().fetchTasks()
          await get().fetchDashboardStats()
          set({ loading: false })
        } catch (error: any) {
          set({ error: error.message, loading: false })
        }
      },

      // Notifications
      fetchNotifications: async () => {
        const { user } = get()
        if (!user) return

        try {
          const notifications = await apiService.getNotifications(user.id)
          set({ notifications })
        } catch (error: any) {
          set({ error: error.message })
        }
      },

      markNotificationRead: async (notificationId) => {
        try {
          await apiService.markNotificationRead(notificationId)
          await get().fetchNotifications()
        } catch (error: any) {
          set({ error: error.message })
        }
      },

      createNotification: async (notificationData) => {
        const { user } = get()
        if (!user) return

        try {
          await apiService.createNotification(user.id, notificationData)
          await get().fetchNotifications()
        } catch (error: any) {
          set({ error: error.message })
        }
      },

      // Certifications
      fetchCertifications: async () => {
        const { user } = get()
        if (!user) return

        try {
          const certifications = await apiService.getCertifications(user.id)
          set({ certifications })
        } catch (error: any) {
          set({ error: error.message })
        }
      },

      addCertification: async (certificationData) => {
        const { user } = get()
        if (!user) return

        set({ loading: true })
        try {
          await apiService.addCertification(user.id, certificationData)
          await get().fetchCertifications()
          await get().fetchDashboardStats()
          set({ loading: false })
        } catch (error: any) {
          set({ error: error.message, loading: false })
        }
      },

      // Dashboard
      fetchDashboardStats: async () => {
        const { user } = get()
        if (!user) return

        try {
          const stats = await apiService.getDashboardStats(user.id)
          set({ dashboardStats: stats })
        } catch (error: any) {
          set({ error: error.message })
        }
      },

      predictCareer: async () => {
        const { user } = get()
        if (!user) return

        set({ loading: true })
        try {
          const prediction = await apiService.predictCareer(user.id)
          set({ careerPrediction: prediction, loading: false })
        } catch (error: any) {
          set({ error: error.message, loading: false })
        }
      }
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
