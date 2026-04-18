import { create } from 'zustand'
import { api, User, Skill, Task, Notification, DashboardStats, CareerPrediction } from '@/lib/api'

interface ApiState {
  // User state
  user: User | null
  isLoading: boolean
  error: string | null

  // Data
  skills: Skill[]
  userSkills: Skill[]
  tasks: Task[]
  notifications: Notification[]
  dashboardStats: DashboardStats | null
  careerPrediction: CareerPrediction | null

  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // API Actions
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  signup: (userData: any) => Promise<boolean>
  fetchProfile: () => Promise<void>
  updateProfile: (profileData: Partial<User>) => Promise<void>
  
  fetchSkills: () => Promise<void>
  fetchUserSkills: () => Promise<void>
  addSkill: (skillData: { skill_id: number; level: number }) => Promise<void>
  
  fetchTasks: () => Promise<void>
  createTask: (taskData: any) => Promise<void>
  updateTask: (taskId: number, taskData: { completed?: boolean }) => Promise<void>
  
  fetchNotifications: () => Promise<void>
  markNotificationRead: (notificationId: number) => Promise<void>
  
  fetchDashboardStats: () => Promise<void>
  predictCareer: (requestData: any) => Promise<void>
}

export const useApiStore = create<ApiState>((set, get) => ({
  // Initial state
  user: null,
  isLoading: false,
  error: null,
  skills: [],
  userSkills: [],
  tasks: [],
  notifications: [],
  dashboardStats: null,
  careerPrediction: null,

  // Basic actions
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Authentication
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.login(email, password)
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token)
        set({ user: response.user, isLoading: false })
        return true
      }
      return false
    } catch (error) {
      set({ error: 'Login failed', isLoading: false })
      return false
    }
  },

  logout: async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('access_token')
      set({ 
        user: null, 
        skills: [], 
        userSkills: [], 
        tasks: [], 
        notifications: [],
        dashboardStats: null,
        careerPrediction: null 
      })
    }
  },

  signup: async (userData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.signup(userData)
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token)
        set({ user: response.user, isLoading: false })
        return true
      }
      return false
    } catch (error) {
      set({ error: 'Signup failed', isLoading: false })
      return false
    }
  },

  // Profile
  fetchProfile: async () => {
    set({ isLoading: true })
    try {
      const response = await api.getProfile()
      if (response.success) {
        set({ user: response.data, isLoading: false })
      }
    } catch (error) {
      set({ error: 'Failed to fetch profile', isLoading: false })
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true })
    try {
      const response = await api.updateProfile(profileData)
      if (response.success) {
        set({ user: response.data, isLoading: false })
      }
    } catch (error) {
      set({ error: 'Failed to update profile', isLoading: false })
    }
  },

  // Skills
  fetchSkills: async () => {
    set({ isLoading: true })
    try {
      const response = await api.getSkills()
      if (response.success) {
        set({ skills: response.data, isLoading: false })
      }
    } catch (error) {
      set({ error: 'Failed to fetch skills', isLoading: false })
    }
  },

  fetchUserSkills: async () => {
    set({ isLoading: true })
    try {
      const response = await api.getUserSkills()
      if (response.success) {
        set({ userSkills: response.data, isLoading: false })
      }
    } catch (error) {
      set({ error: 'Failed to fetch user skills', isLoading: false })
    }
  },

  addSkill: async (skillData) => {
    set({ isLoading: true })
    try {
      const response = await api.addUserSkill(skillData)
      if (response.success) {
        // Refresh user skills
        get().fetchUserSkills()
        set({ isLoading: false })
      }
    } catch (error) {
      set({ error: 'Failed to add skill', isLoading: false })
    }
  },

  // Tasks
  fetchTasks: async () => {
    set({ isLoading: true })
    try {
      const response = await api.getTasks()
      if (response.success) {
        set({ tasks: response.data, isLoading: false })
      }
    } catch (error) {
      set({ error: 'Failed to fetch tasks', isLoading: false })
    }
  },

  createTask: async (taskData) => {
    set({ isLoading: true })
    try {
      const response = await api.createTask(taskData)
      if (response.success) {
        // Refresh tasks
        get().fetchTasks()
        set({ isLoading: false })
      }
    } catch (error) {
      set({ error: 'Failed to create task', isLoading: false })
    }
  },

  updateTask: async (taskId, taskData) => {
    set({ isLoading: true })
    try {
      const response = await api.updateTask(taskId, taskData)
      if (response.success) {
        // Update local task
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId ? { ...task, ...taskData } : task
          ),
          isLoading: false
        }))
      }
    } catch (error) {
      set({ error: 'Failed to update task', isLoading: false })
    }
  },

  // Notifications
  fetchNotifications: async () => {
    set({ isLoading: true })
    try {
      const response = await api.getNotifications()
      if (response.success) {
        set({ notifications: response.data, isLoading: false })
      }
    } catch (error) {
      set({ error: 'Failed to fetch notifications', isLoading: false })
    }
  },

  markNotificationRead: async (notificationId) => {
    try {
      await api.markNotificationRead(notificationId)
      // Update local notification
      set(state => ({
        notifications: state.notifications.map(notification =>
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      }))
    } catch (error) {
      set({ error: 'Failed to mark notification as read' })
    }
  },

  // Dashboard
  fetchDashboardStats: async () => {
    set({ isLoading: true })
    try {
      const response = await api.getDashboardStats()
      if (response.success) {
        set({ dashboardStats: response.data, isLoading: false })
      }
    } catch (error) {
      set({ error: 'Failed to fetch dashboard stats', isLoading: false })
    }
  },

  // Career Prediction
  predictCareer: async (requestData) => {
    set({ isLoading: true })
    try {
      const response = await api.predictCareer(requestData)
      if (response.success) {
        set({ careerPrediction: response.data, isLoading: false })
      }
    } catch (error) {
      set({ error: 'Failed to predict career', isLoading: false })
    }
  },
}))
