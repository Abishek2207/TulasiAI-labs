import axios, { AxiosInstance, AxiosResponse } from 'axios'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  message: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Profile Types
export interface Profile {
  id: string
  user_id: string
  name: string
  email: string
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  current_role?: string
  target_role?: string
  company?: string
  daily_learning_hours: number
  job_readiness_score: number
  created_at: string
  updated_at: string
}

export interface ProfileCreate {
  user_id: string
  name: string
  email: string
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  current_role?: string
  target_role?: string
  company?: string
  daily_learning_hours: number
}

export interface ProfileUpdate {
  name?: string
  experience_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  current_role?: string
  target_role?: string
  company?: string
  daily_learning_hours?: number
}

export interface ProfileStats {
  total_skills: number
  skills_by_category: Record<string, number>
  average_skill_level: number
  current_streak: number
  total_learning_hours: number
  job_readiness_score: number
  completed_tasks: number
  certifications: number
  weekly_progress: {
    hours_this_week: number
    tasks_completed: number
    target_hours: number
    target_tasks: number
    completion_rate: number
  }
}

// Skill Types
export interface Skill {
  id: string
  user_id: string
  skill_name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  proficiency_level: number
  hours_practiced: number
  category: 'Frontend' | 'Backend' | 'AI/ML' | 'DevOps' | 'Cloud' | 'Mobile' | 'Database' | 'Other'
  last_practiced?: string
  created_at: string
  updated_at: string
}

export interface SkillCreate {
  skill_name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  proficiency_level: number
  hours_practiced: number
  category: 'Frontend' | 'Backend' | 'AI/ML' | 'DevOps' | 'Cloud' | 'Mobile' | 'Database' | 'Other'
}

export interface SkillUpdate {
  skill_name?: string
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  proficiency_level?: number
  hours_practiced?: number
  category?: 'Frontend' | 'Backend' | 'AI/ML' | 'DevOps' | 'Cloud' | 'Mobile' | 'Database' | 'Other'
}

// Task Types
export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  task_type: 'learning' | 'project' | 'practice' | 'review' | 'certification'
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  estimated_hours: number
  completed: boolean
  completed_at?: string
  due_date?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  created_at: string
  updated_at: string
}

export interface TaskCreate {
  title: string
  description?: string
  task_type: 'learning' | 'project' | 'practice' | 'review' | 'certification'
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  estimated_hours: number
  due_date?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
}

export interface TaskUpdate {
  title?: string
  description?: string
  task_type?: 'learning' | 'project' | 'practice' | 'review' | 'certification'
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  estimated_hours?: number
  completed?: boolean
  due_date?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
}

// Streak Types
export interface Streak {
  id: string
  user_id: string
  current_streak: number
  longest_streak: number
  last_active_date?: string
  total_active_days: number
  created_at: string
  updated_at: string
}

export interface StreakCalculation {
  current_streak: number
  longest_streak: number
  total_active_days: number
  last_active_date?: string
  streak_status: 'active' | 'broken' | 'new'
}

// Career Prediction Types
export interface CareerPredictionRequest {
  current_skills: string[]
  interests: string[]
  current_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  target_roles?: string[]
}

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

export interface CareerPrediction {
  suggested_roles: SuggestedRole[]
  salary_range: SalaryRange
  roadmap: RoadmapStep[]
  skill_gap_analysis: SkillGap[]
  confidence_score: number
  insights: Insight[]
  market_trends: MarketTrend
  next_steps: string[]
}

// Notification Types
export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  notification_type: 'achievement' | 'task_reminder' | 'career_insight' | 'skill_level_up' | 'task_completed' | 'streak_milestone' | 'certification_added'
  is_read: boolean
  metadata?: any
  priority: 'low' | 'medium' | 'high'
  created_at: string
  read_at?: string
}

// API Service Class
class ApiService {
  // Profile API
  async getProfile(userId: string): Promise<ApiResponse<Profile>> {
    const response = await apiClient.get(`/api/v1/profile/?user_id=${userId}`)
    return response.data
  }

  async createProfile(profileData: ProfileCreate): Promise<ApiResponse<Profile>> {
    const response = await apiClient.post('/api/v1/profile/', profileData)
    return response.data
  }

  async updateProfile(userId: string, profileData: ProfileUpdate): Promise<ApiResponse<Profile>> {
    const response = await apiClient.put(`/api/v1/profile/?user_id=${userId}`, profileData)
    return response.data
  }

  async getProfileStats(userId: string): Promise<ApiResponse<ProfileStats>> {
    const response = await apiClient.get(`/api/v1/profile/stats?user_id=${userId}`)
    return response.data
  }

  // Skills API
  async getSkills(userId: string): Promise<ApiResponse<Skill[]>> {
    const response = await apiClient.get(`/api/v1/skills/?user_id=${userId}`)
    return response.data
  }

  async createSkill(userId: string, skillData: SkillCreate): Promise<ApiResponse<Skill>> {
    const response = await apiClient.post(`/api/v1/skills/?user_id=${userId}`, skillData)
    return response.data
  }

  async updateSkill(skillId: string, userId: string, skillData: SkillUpdate): Promise<ApiResponse<Skill>> {
    const response = await apiClient.put(`/api/v1/skills/${skillId}?user_id=${userId}`, skillData)
    return response.data
  }

  async deleteSkill(skillId: string, userId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/api/v1/skills/${skillId}?user_id=${userId}`)
    return response.data
  }

  async getSkillsByCategory(userId: string, category: string): Promise<ApiResponse<Skill[]>> {
    const response = await apiClient.get(`/api/v1/skills/category/${category}?user_id=${userId}`)
    return response.data
  }

  async getSkillStatistics(userId: string): Promise<{ success: boolean; data: any; message: string }> {
    const response = await apiClient.get(`/api/v1/skills/statistics/summary?user_id=${userId}`)
    return response.data
  }

  // Tasks API
  async getTasks(userId: string, completed?: boolean): Promise<ApiResponse<Task[]>> {
    const params = new URLSearchParams({ user_id: userId })
    if (completed !== undefined) {
      params.append('completed', completed.toString())
    }
    const response = await apiClient.get(`/api/v1/tasks?${params}`)
    return response.data
  }

  async createTask(userId: string, taskData: TaskCreate): Promise<ApiResponse<Task>> {
    const response = await apiClient.post(`/api/v1/tasks/?user_id=${userId}`, taskData)
    return response.data
  }

  async updateTask(taskId: string, userId: string, taskData: TaskUpdate): Promise<ApiResponse<Task>> {
    const response = await apiClient.put(`/api/v1/tasks/${taskId}?user_id=${userId}`, taskData)
    return response.data
  }

  async completeTask(taskId: string, userId: string): Promise<ApiResponse<Task>> {
    const response = await apiClient.put(`/api/v1/tasks/${taskId}/complete?user_id=${userId}`)
    return response.data
  }

  async deleteTask(taskId: string, userId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/api/v1/tasks/${taskId}?user_id=${userId}`)
    return response.data
  }

  async getTasksByType(userId: string, taskType: string): Promise<ApiResponse<Task[]>> {
    const response = await apiClient.get(`/api/v1/tasks/type/${taskType}?user_id=${userId}`)
    return response.data
  }

  async getOverdueTasks(userId: string): Promise<ApiResponse<Task[]>> {
    const response = await apiClient.get(`/api/v1/tasks/overdue/list?user_id=${userId}`)
    return response.data
  }

  async generateDailyTasks(userId: string, dailyHours: number = 2): Promise<ApiResponse<Task[]>> {
    const response = await apiClient.post(`/api/v1/tasks/generate/daily?user_id=${userId}&daily_hours=${dailyHours}`)
    return response.data
  }

  // Streak API
  async getStreak(userId: string): Promise<ApiResponse<Streak>> {
    const response = await apiClient.get(`/api/v1/streak/?user_id=${userId}`)
    return response.data
  }

  async calculateStreak(userId: string): Promise<{ success: boolean; data: StreakCalculation; message: string }> {
    const response = await apiClient.post(`/api/v1/streak/calculate?user_id=${userId}`)
    return response.data
  }

  async recordActivity(userId: string): Promise<{ success: boolean; data: StreakCalculation; message: string }> {
    const response = await apiClient.post(`/api/v1/streak/activity?user_id=${userId}`)
    return response.data
  }

  async getStreakHistory(userId: string, days: number = 30): Promise<{ success: boolean; data: Record<string, boolean>; message: string }> {
    const response = await apiClient.get(`/api/v1/streak/history?user_id=${userId}&days=${days}`)
    return response.data
  }

  async getStreakMilestones(userId: string): Promise<{ success: boolean; data: any; message: string }> {
    const response = await apiClient.get(`/api/v1/streak/milestones?user_id=${userId}`)
    return response.data
  }

  // Career Prediction API
  async predictCareer(userId: string, request: CareerPredictionRequest): Promise<ApiResponse<CareerPrediction>> {
    const response = await apiClient.post(`/api/v1/predict-career/?user_id=${userId}`, request)
    return response.data
  }

  async getPredictionHistory(userId: string, limit: number = 10): Promise<{ success: boolean; data: any[]; message: string }> {
    const response = await apiClient.get(`/api/v1/predict-career/history?user_id=${userId}&limit=${limit}`)
    return response.data
  }

  // Notifications API
  async getNotifications(userId: string, isRead?: boolean, limit: number = 50): Promise<ApiResponse<Notification[]>> {
    const params = new URLSearchParams({ user_id: userId, limit: limit.toString() })
    if (isRead !== undefined) {
      params.append('is_read', isRead.toString())
    }
    const response = await apiClient.get(`/api/v1/notifications?${params}`)
    return response.data
  }

  async markNotificationRead(notificationId: string, userId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put(`/api/v1/notifications/${notificationId}/read?user_id=${userId}`)
    return response.data
  }

  async createNotification(userId: string, notificationData: {
    title: string
    message: string
    notification_type: string
    metadata?: any
    priority?: string
  }): Promise<{ success: boolean; data: any; message: string }> {
    const response = await apiClient.post(`/api/v1/notifications/?user_id=${userId}`, notificationData)
    return response.data
  }

  async deleteNotification(notificationId: string, userId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/api/v1/notifications/${notificationId}?user_id=${userId}`)
    return response.data
  }

  async getUnreadCount(userId: string): Promise<{ success: boolean; data: { unread_count: number }; message: string }> {
    const response = await apiClient.get(`/api/v1/notifications/unread/count?user_id=${userId}`)
    return response.data
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; service: string; version: string }> {
    const response = await apiClient.get('/health')
    return response.data
  }
}

export const apiService = new ApiService()
export default apiService
