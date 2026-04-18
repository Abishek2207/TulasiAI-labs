const API_BASE_URL = 'http://localhost:8000'

// Types
export interface User {
  id: number
  email: string
  name: string
  current_role?: string
  target_role?: string
  company?: string
  experience_level?: string
  daily_learning_hours?: number
  streak_count?: number
  last_login?: string
  created_at: string
  updated_at: string
}

export interface Skill {
  id: number
  name: string
  level?: number
  category: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: number
  title: string
  description?: string
  task_type?: string
  difficulty?: string
  estimated_hours?: number
  due_date?: string
  completed: boolean
  completed_at?: string
  created_at: string
}

export interface Notification {
  id: number
  title: string
  message: string
  notification_type: string
  metadata?: any
  is_read: boolean
  created_at: string
}

export interface DashboardStats {
  total_skills: number
  completed_tasks: number
  current_streak: number
  job_readiness_score: number
  weekly_hours: number
  weekly_progress: {
    hours_this_week: number
    tasks_completed: number
    target_hours: number
    target_tasks: number
    completion_rate: number
  }
}

export interface CareerPrediction {
  suggested_roles: Array<{
    title: string
    match_score: number
    description: string
    required_skills: string[]
    growth_potential: string
  }>
  salary_range: {
    min: number
    max: number
    median: number
    currency: string
  }
  roadmap: Array<{
    title: string
    description: string
    estimated_time: string
    skills_required: string[]
    resources: string[]
    difficulty: string
    prerequisites: string[]
    completed: boolean
  }>
  skill_gap_analysis: Array<{
    skill_name: string
    current_level?: number
    required_level: number
    gap_description: string
    learning_priority: string
  }>
  confidence_score: number
  insights: Array<{
    type: string
    title: string
    description: string
    actionable: boolean
    priority: string
  }>
  market_trends: {
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
  next_steps: string[]
}

// API Client
class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API Request Error:', error)
      throw error
    }
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request<{ access_token: string; token_type: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async signup(userData: {
    email: string
    name: string
    current_role?: string
    target_role?: string
    company?: string
    experience_level?: string
    daily_learning_hours?: number
  }) {
    return this.request<{ access_token: string; token_type: string; user: User }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' })
  }

  async getCurrentUser() {
    return this.request<User>('/auth/me')
  }

  // Profile
  async getProfile() {
    return this.request<{ success: boolean; data: User; message: string }>('/profile/me')
  }

  async updateProfile(profileData: Partial<User>) {
    return this.request<{ success: boolean; data: User; message: string }>('/profile/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }

  // Skills
  async getSkills() {
    return this.request<{ success: boolean; data: Skill[]; message: string }>('/skills')
  }

  async getUserSkills() {
    return this.request<{ success: boolean; data: Skill[]; message: string }>('/skills/user')
  }

  async addUserSkill(skillData: { skill_id: number; level: number }) {
    return this.request<{ success: boolean; data: any; message: string }>('/skills/user', {
      method: 'POST',
      body: JSON.stringify(skillData),
    })
  }

  // Tasks
  async getTasks() {
    return this.request<{ success: boolean; data: Task[]; message: string }>('/tasks')
  }

  async createTask(taskData: {
    title: string
    description?: string
    task_type?: string
    difficulty?: string
    estimated_hours?: number
    due_date?: string
  }) {
    return this.request<{ success: boolean; data: Task; message: string }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    })
  }

  async updateTask(taskId: number, taskData: { completed?: boolean }) {
    return this.request<{ success: boolean; data: Task; message: string }>(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    })
  }

  // Career Prediction
  async predictCareer(requestData: {
    current_skills: string[]
    interests: string[]
    current_level: string
    target_roles?: string[]
  }) {
    return this.request<{ success: boolean; data: CareerPrediction; message: string }>('/career/predict', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })
  }

  // Notifications
  async getNotifications() {
    return this.request<{ success: boolean; data: Notification[]; message: string }>('/notifications/')
  }

  async markNotificationRead(notificationId: number) {
    return this.request<{ success: boolean; data: any; message: string }>(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    })
  }

  // Dashboard
  async getDashboardStats() {
    return this.request<{ success: boolean; data: DashboardStats; message: string }>('/dashboard/stats')
  }

  // Health Check
  async healthCheck() {
    return this.request<{ status: string; service: string }>('/health')
  }
}

export const api = new ApiClient()

// Utility functions
export const setAuthToken = (token: string) => {
  localStorage.setItem('access_token', token)
}

export const getAuthToken = () => {
  return localStorage.getItem('access_token')
}

export const removeAuthToken = () => {
  localStorage.removeItem('access_token')
}

export const isAuthenticated = () => {
  return !!getAuthToken()
}
