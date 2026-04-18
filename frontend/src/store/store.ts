import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import type { 
  Profile, 
  Skill, 
  Task, 
  Streak, 
  CareerPrediction, 
  Notification,
  ProfileStats,
  ProfileCreate,
  ProfileUpdate,
  SkillCreate,
  SkillUpdate,
  TaskCreate,
  TaskUpdate,
  CareerPredictionRequest
} from '@/lib/api-client'
import apiService from '@/lib/api-client'

// Store interfaces
interface AuthState {
  user: Profile | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (userId: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

interface ProfileState {
  profile: Profile | null
  stats: ProfileStats | null
  isLoading: boolean
  error: string | null
  fetchProfile: (userId: string) => Promise<void>
  createProfile: (profileData: ProfileCreate) => Promise<void>
  updateProfile: (profileData: ProfileUpdate) => Promise<void>
  fetchStats: (userId: string) => Promise<void>
  clearError: () => void
}

interface SkillsState {
  skills: Skill[]
  statistics: any | null
  isLoading: boolean
  error: string | null
  fetchSkills: (userId: string) => Promise<void>
  createSkill: (userId: string, skillData: SkillCreate) => Promise<void>
  updateSkill: (skillId: string, userId: string, skillData: SkillUpdate) => Promise<void>
  deleteSkill: (skillId: string, userId: string) => Promise<void>
  fetchStatistics: (userId: string) => Promise<void>
  clearError: () => void
}

interface TasksState {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  fetchTasks: (userId: string, completed?: boolean) => Promise<void>
  createTask: (userId: string, taskData: TaskCreate) => Promise<void>
  updateTask: (taskId: string, userId: string, taskData: TaskUpdate) => Promise<void>
  completeTask: (taskId: string, userId: string) => Promise<void>
  deleteTask: (taskId: string, userId: string) => Promise<void>
  generateDailyTasks: (userId: string, dailyHours?: number) => Promise<void>
  clearError: () => void
}

interface StreakState {
  streak: Streak | null
  calculation: any | null
  milestones: any | null
  isLoading: boolean
  error: string | null
  fetchStreak: (userId: string) => Promise<void>
  calculateStreak: (userId: string) => Promise<void>
  recordActivity: (userId: string) => Promise<void>
  fetchMilestones: (userId: string) => Promise<void>
  clearError: () => void
}

interface CareerState {
  prediction: CareerPrediction | null
  history: any[]
  isLoading: boolean
  error: string | null
  predictCareer: (userId: string, request: CareerPredictionRequest) => Promise<void>
  fetchHistory: (userId: string) => Promise<void>
  clearError: () => void
}

interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  fetchNotifications: (userId: string, isRead?: boolean) => Promise<void>
  markAsRead: (notificationId: string, userId: string) => Promise<void>
  createNotification: (userId: string, notificationData: any) => Promise<void>
  fetchUnreadCount: (userId: string) => Promise<void>
  clearError: () => void
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (userId: string) => {
          set({ isLoading: true, error: null })
          try {
            const response = await apiService.getProfile(userId)
            if (response.success) {
              set({ 
                user: response.data, 
                isAuthenticated: true, 
                isLoading: false 
              })
            } else {
              set({ 
                error: 'Profile not found. Please create a profile first.', 
                isLoading: false 
              })
            }
          } catch (error: any) {
            set({ 
              error: error.message || 'Login failed', 
              isLoading: false 
            })
          }
        },

        logout: () => {
          set({ 
            user: null, 
            isAuthenticated: false, 
            error: null 
          })
        },

        clearError: () => set({ error: null })
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ 
          user: state.user, 
          isAuthenticated: state.isAuthenticated 
        })
      }
    ),
    { name: 'auth-store' }
  )
)

// Profile Store
export const useProfileStore = create<ProfileState>()(
  devtools(
    (set, get) => ({
      profile: null,
      stats: null,
      isLoading: false,
      error: null,

      fetchProfile: async (userId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiService.getProfile(userId)
          if (response.success) {
            set({ profile: response.data, isLoading: false })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      createProfile: async (profileData: ProfileCreate) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiService.createProfile(profileData)
          if (response.success) {
            set({ profile: response.data, isLoading: false })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      updateProfile: async (profileData: ProfileUpdate) => {
        const { profile } = get()
        if (!profile) return

        set({ isLoading: true, error: null })
        try {
          const response = await apiService.updateProfile(profile.user_id, profileData)
          if (response.success) {
            set({ profile: response.data, isLoading: false })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      fetchStats: async (userId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiService.getProfileStats(userId)
          if (response.success) {
            set({ stats: response.data, isLoading: false })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      clearError: () => set({ error: null })
    }),
    { name: 'profile-store' }
  )
)

// Skills Store
export const useSkillsStore = create<SkillsState>()(
  devtools(
    (set, get) => ({
      skills: [],
      statistics: null,
      isLoading: false,
      error: null,

      fetchSkills: async (userId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiService.getSkills(userId)
          if (response.success) {
            set({ skills: response.data, isLoading: false })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      createSkill: async (userId: string, skillData: SkillCreate) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiService.createSkill(userId, skillData)
          if (response.success) {
            const { skills } = get()
            set({ 
              skills: [response.data, ...skills], 
              isLoading: false 
            })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      updateSkill: async (skillId: string, userId: string, skillData: SkillUpdate) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiService.updateSkill(skillId, userId, skillData)
          if (response.success) {
            const { skills } = get()
            const updatedSkills = skills.map(skill => 
              skill.id === skillId ? response.data : skill
            )
            set({ skills: updatedSkills, isLoading: false })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      deleteSkill: async (skillId: string, userId: string) => {
        set({ isLoading: true, error: null })
        try {
          await apiService.deleteSkill(skillId, userId)
          const { skills } = get()
          const filteredSkills = skills.filter(skill => skill.id !== skillId)
          set({ skills: filteredSkills, isLoading: false })
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      fetchStatistics: async (userId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiService.getSkillStatistics(userId)
          if (response.success) {
            set({ statistics: response.data, isLoading: false })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      clearError: () => set({ error: null })
    }),
    { name: 'skills-store' }
  )
)

// Tasks Store
export const useTasksStore = create<TasksState>()(
  devtools(
    (set, get) => ({
      tasks: [],
      isLoading: false,
      error: null,

      fetchTasks: async (userId: string, completed?: boolean) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiService.getTasks(userId, completed)
          if (response.success) {
            set({ tasks: response.data, isLoading: false })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      createTask: async (userId: string, taskData: TaskCreate) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiService.createTask(userId, taskData)
          if (response.success) {
            const { tasks } = get()
            set({ 
              tasks: [response.data, ...tasks], 
              isLoading: false 
            })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      updateTask: async (taskId: string, userId: string, taskData: TaskUpdate) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiService.updateTask(taskId, userId, taskData)
          if (response.success) {
            const { tasks } = get()
            const updatedTasks = tasks.map(task => 
              task.id === taskId ? response.data : task
            )
            set({ tasks: updatedTasks, isLoading: false })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      completeTask: async (taskId: string, userId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiService.completeTask(taskId, userId)
          if (response.success) {
            const { tasks } = get()
            const updatedTasks = tasks.map(task => 
              task.id === taskId ? response.data : task
            )
            set({ tasks: updatedTasks, isLoading: false })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      deleteTask: async (taskId: string, userId: string) => {
        set({ isLoading: true, error: null })
        try {
          await apiService.deleteTask(taskId, userId)
          const { tasks } = get()
          const filteredTasks = tasks.filter(task => task.id !== taskId)
          set({ tasks: filteredTasks, isLoading: false })
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      generateDailyTasks: async (userId: string, dailyHours?: number) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiService.generateDailyTasks(userId, dailyHours)
          if (response.success) {
            set({ tasks: response.data, isLoading: false })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      clearError: () => set({ error: null })
    }),
    { name: 'tasks-store' }
  )
)

// Streak Store
export const useStreakStore = create<StreakState>()(
  devtools(
    (set, get) => ({
      streak: null,
      calculation: null,
      milestones: null,
      isLoading: false,
      error: null,

      fetchStreak: async (userId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiService.getStreak(userId)
          if (response.success) {
            set({ streak: response.data, isLoading: false })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      calculateStreak: async (userId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiService.calculateStreak(userId)
          if (response.success) {
            set({ calculation: response.data, isLoading: false })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      recordActivity: async (userId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiService.recordActivity(userId)
          if (response.success) {
            set({ calculation: response.data, isLoading: false })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      fetchMilestones: async (userId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiService.getStreakMilestones(userId)
          if (response.success) {
            set({ milestones: response.data, isLoading: false })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      clearError: () => set({ error: null })
    }),
    { name: 'streak-store' }
  )
)

// Career Store
export const useCareerStore = create<CareerState>()(
  devtools(
    (set, get) => ({
      prediction: null,
      history: [],
      isLoading: false,
      error: null,

      predictCareer: async (userId: string, request: CareerPredictionRequest) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiService.predictCareer(userId, request)
          if (response.success) {
            set({ prediction: response.data, isLoading: false })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      fetchHistory: async (userId: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiService.getPredictionHistory(userId)
          if (response.success) {
            set({ history: response.data, isLoading: false })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      clearError: () => set({ error: null })
    }),
    { name: 'career-store' }
  )
)

// Notifications Store
export const useNotificationsStore = create<NotificationsState>()(
  devtools(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,

      fetchNotifications: async (userId: string, isRead?: boolean) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiService.getNotifications(userId, isRead)
          if (response.success) {
            set({ notifications: response.data, isLoading: false })
          } else {
            set({ error: response.message, isLoading: false })
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      markAsRead: async (notificationId: string, userId: string) => {
        try {
          await apiService.markNotificationRead(notificationId, userId)
          const { notifications } = get()
          const updatedNotifications = notifications.map(notification =>
            notification.id === notificationId 
              ? { ...notification, is_read: true }
              : notification
          )
          set({ notifications: updatedNotifications })
        } catch (error: any) {
          set({ error: error.message })
        }
      },

      createNotification: async (userId: string, notificationData: any) => {
        try {
          const response = await apiService.createNotification(userId, notificationData)
          if (response.success) {
            const { notifications } = get()
            set({ 
              notifications: [response.data, ...notifications] 
            })
          }
        } catch (error: any) {
          set({ error: error.message })
        }
      },

      fetchUnreadCount: async (userId: string) => {
        try {
          const response = await apiService.getUnreadCount(userId)
          if (response.success) {
            set({ unreadCount: response.data.unread_count })
          }
        } catch (error: any) {
          set({ error: error.message })
        }
      },

      clearError: () => set({ error: null })
    }),
    { name: 'notifications-store' }
  )
)
