import { create } from 'zustand'
import axios from 'axios'

interface Skill {
  id: number
  name: string
  category: string
  description: string | null
  difficulty_level: string | null
}

interface UserSkill {
  id: number
  user_id: number
  skill_id: number
  proficiency_level: number
  hours_practiced: number
  last_practiced: string
  created_at: string
  skill: Skill
}

interface Task {
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

interface DashboardStats {
  total_skills: number
  completed_tasks: number
  current_streak: number
  job_readiness_score: number
  weekly_hours: number
}

interface CareerPrediction {
  suggested_roles: string[]
  salary_range: {
    min: number
    max: number
    currency: string
  }
  roadmap: Array<{
    title: string
    description: string
    estimated_time: string
    skills_required: string[]
    resources: string[]
  }>
  confidence_score: number
  insights: string[]
}

interface CareerState {
  skills: Skill[]
  userSkills: UserSkill[]
  tasks: Task[]
  dashboardStats: DashboardStats | null
  careerPrediction: CareerPrediction | null
  isLoading: boolean
  
  // Actions
  fetchSkills: () => Promise<void>
  fetchUserSkills: () => Promise<void>
  addUserSkill: (skillId: number, proficiencyLevel: number, hoursPracticed: number) => Promise<void>
  updateUserSkill: (skillId: number, updates: { proficiency_level?: number; hours_practiced?: number }) => Promise<void>
  removeUserSkill: (skillId: number) => Promise<void>
  
  fetchTasks: () => Promise<void>
  addTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  updateTask: (taskId: number, updates: { completed?: boolean }) => Promise<void>
  deleteTask: (taskId: number) => Promise<void>
  generateDailyTasks: () => Promise<void>
  
  fetchDashboardStats: () => Promise<void>
  predictCareer: (data: {
    current_skills: string[]
    interests: string[]
    current_level: string
    target_roles?: string[]
  }) => Promise<void>
}

const api = axios.create({
  baseURL: 'http://localhost:8000',
})

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage')
  if (token) {
    const auth = JSON.parse(token)
    if (auth.state?.token) {
      config.headers.Authorization = `Bearer ${auth.state.token}`
    }
  }
  return config
})

export const useCareerStore = create<CareerState>((set, get) => ({
  skills: [],
  userSkills: [],
  tasks: [],
  dashboardStats: null,
  careerPrediction: null,
  isLoading: false,

  fetchSkills: async () => {
    set({ isLoading: true })
    try {
      const response = await api.get('/skills/')
      set({ skills: response.data, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch skills:', error)
      set({ isLoading: false })
    }
  },

  fetchUserSkills: async () => {
    set({ isLoading: true })
    try {
      const response = await api.get('/skills/user')
      set({ userSkills: response.data, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch user skills:', error)
      set({ isLoading: false })
    }
  },

  addUserSkill: async (skillId, proficiencyLevel, hoursPracticed) => {
    try {
      const response = await api.post('/skills/add', {
        skill_id: skillId,
        proficiency_level: proficiencyLevel,
        hours_practiced: hoursPracticed,
      })
      
      set(state => ({
        userSkills: [...state.userSkills, response.data]
      }))
    } catch (error) {
      console.error('Failed to add skill:', error)
    }
  },

  updateUserSkill: async (skillId, updates) => {
    try {
      const response = await api.put(`/skills/${skillId}`, updates)
      
      set(state => ({
        userSkills: state.userSkills.map(skill => 
          skill.skill_id === skillId ? response.data : skill
        )
      }))
    } catch (error) {
      console.error('Failed to update skill:', error)
    }
  },

  removeUserSkill: async (skillId) => {
    try {
      await api.delete(`/skills/${skillId}`)
      
      set(state => ({
        userSkills: state.userSkills.filter(skill => skill.skill_id !== skillId)
      }))
    } catch (error) {
      console.error('Failed to remove skill:', error)
    }
  },

  fetchTasks: async () => {
    set({ isLoading: true })
    try {
      const response = await api.get('/tasks/')
      set({ tasks: response.data, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      set({ isLoading: false })
    }
  },

  addTask: async (task) => {
    try {
      const response = await api.post('/tasks/', task)
      
      set(state => ({
        tasks: [...state.tasks, response.data]
      }))
    } catch (error) {
      console.error('Failed to add task:', error)
    }
  },

  updateTask: async (taskId, updates) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, updates)
      
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? response.data : task
        )
      }))
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  },

  deleteTask: async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`)
      
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== taskId)
      }))
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  },

  generateDailyTasks: async () => {
    try {
      await api.post('/tasks/generate-daily')
      await get().fetchTasks()
    } catch (error) {
      console.error('Failed to generate daily tasks:', error)
    }
  },

  fetchDashboardStats: async () => {
    try {
      const response = await api.get('/career/dashboard-stats')
      set({ dashboardStats: response.data })
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    }
  },

  predictCareer: async (data) => {
    set({ isLoading: true })
    try {
      const response = await api.post('/career/predict', data)
      set({ careerPrediction: response.data, isLoading: false })
    } catch (error) {
      console.error('Failed to predict career:', error)
      set({ isLoading: false })
    }
  },
}))
