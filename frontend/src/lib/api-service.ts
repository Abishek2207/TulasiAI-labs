import { supabase } from './supabase'
import type { Database } from './supabase'

type User = Database['public']['Tables']['users']['Row']
type Skill = Database['public']['Tables']['skills']['Row']
type UserSkill = Database['public']['Tables']['user_skills']['Row']
type Task = Database['public']['Tables']['tasks']['Row']
type Notification = Database['public']['Tables']['notifications']['Row']
type Certification = Database['public']['Tables']['certifications']['Row']

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

export class ApiService {
  private static instance: ApiService

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('name')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching skills:', error)
      throw error
    }
  }

  async getUserSkills(userId: number): Promise<(UserSkill & { skills: Skill })[]> {
    try {
      const { data, error } = await supabase
        .from('user_skills')
        .select(`
          *,
          skills (
            name,
            category,
            description,
            difficulty_level
          )
        `)
        .eq('user_id', userId)
        .order('proficiency_level', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user skills:', error)
      throw error
    }
  }

  async addUserSkill(userId: number, skillId: number, proficiencyLevel: number = 1) {
    try {
      const { data, error } = await supabase
        .from('user_skills')
        .upsert({
          user_id: userId,
          skill_id: skillId,
          proficiency_level: proficiencyLevel,
          hours_practiced: 0,
          last_practiced: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding user skill:', error)
      throw error
    }
  }

  async updateUserSkill(userSkillId: number, updates: Partial<UserSkill>) {
    try {
      const { data, error } = await supabase
        .from('user_skills')
        .update({
          ...updates,
          last_practiced: new Date().toISOString()
        })
        .eq('id', userSkillId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating user skill:', error)
      throw error
    }
  }

  async deleteUserSkill(userSkillId: number) {
    try {
      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('id', userSkillId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting user skill:', error)
      throw error
    }
  }

  // Tasks
  async getTasks(userId: number): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw error
    }
  }

  async createTask(userId: number, taskData: Omit<Task, 'id' | 'user_id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          ...taskData
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  async updateTask(taskId: number, updates: Partial<Task>) {
    try {
      const updateData = {
        ...updates,
        ...(updates.completed && { completed_at: new Date().toISOString() })
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  async deleteTask(taskId: number) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  // Notifications
  async getNotifications(userId: number): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  }

  async markNotificationRead(notificationId: number) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  async createNotification(userId: number, notificationData: Omit<Notification, 'id' | 'user_id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          ...notificationData
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  // Certifications
  async getCertifications(userId: number): Promise<Certification[]> {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching certifications:', error)
      throw error
    }
  }

  async addCertification(userId: number, certificationData: Omit<Certification, 'id' | 'user_id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .insert({
          user_id: userId,
          ...certificationData
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error adding certification:', error)
      throw error
    }
  }

  // Career Prediction (Real Logic)
  async predictCareer(userId: number): Promise<CareerPrediction> {
    try {
      // Get user profile and skills
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (userError) throw userError

      const userSkills = await this.getUserSkills(userId)

      // Real AI prediction logic
      const currentSkills = userSkills.map(us => us.skills.name)
      const skillLevels = userSkills.reduce((acc, us) => {
        acc[us.skills.name] = us.proficiency_level
        return acc
      }, {} as Record<string, number>)

      // Career matching algorithm
      const suggestedRoles = this.matchCareerRoles(currentSkills, skillLevels, user)
      
      // Salary calculation based on skills and experience
      const salaryRange = this.calculateSalary(currentSkills, skillLevels, user)
      
      // Generate roadmap
      const roadmap = this.generateRoadmap(suggestedRoles[0]?.title || 'Developer', currentSkills)
      
      // Skill gap analysis
      const skillGapAnalysis = this.analyzeSkillGaps(currentSkills, suggestedRoles[0]?.required_skills || [])
      
      // Generate insights
      const insights = this.generateInsights(currentSkills, user, suggestedRoles)
      
      // Calculate confidence score
      const confidenceScore = this.calculateConfidenceScore(currentSkills, skillLevels, user)
      
      // Market trends (mock for now, but could be from real API)
      const marketTrends = this.getMarketTrends()

      return {
        suggested_roles: suggestedRoles,
        salary_range: salaryRange,
        roadmap: roadmap,
        skill_gap_analysis: skillGapAnalysis,
        confidence_score: confidenceScore,
        insights: insights,
        market_trends: marketTrends,
        next_steps: this.generateNextSteps(skillGapAnalysis, suggestedRoles[0])
      }
    } catch (error) {
      console.error('Error predicting career:', error)
      throw error
    }
  }

  // Real AI Logic Methods
  private matchCareerRoles(skills: string[], skillLevels: Record<string, number>, user: User) {
    const careerRoles = [
      {
        title: 'Full Stack Developer',
        required_skills: ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS'],
        description: 'Build end-to-end web applications using modern JavaScript frameworks and cloud technologies',
        growth_potential: 'High'
      },
      {
        title: 'Data Scientist',
        required_skills: ['Python', 'Statistics', 'Machine Learning'],
        description: 'Analyze complex datasets to extract actionable insights and drive business decisions',
        growth_potential: 'Very High'
      },
      {
        title: 'Machine Learning Engineer',
        required_skills: ['Python', 'Machine Learning', 'Deep Learning'],
        description: 'Design and deploy ML models at scale with real-world impact',
        growth_potential: 'Very High'
      },
      {
        title: 'DevOps Engineer',
        required_skills: ['Docker', 'Kubernetes', 'AWS', 'Linux'],
        description: 'Build and maintain scalable infrastructure and deployment pipelines',
        growth_potential: 'High'
      },
      {
        title: 'Frontend Developer',
        required_skills: ['JavaScript', 'React', 'CSS', 'HTML'],
        description: 'Create beautiful and responsive user interfaces with modern frameworks',
        growth_potential: 'Medium'
      }
    ]

    return careerRoles.map(role => {
      const matchCount = role.required_skills.filter(skill => skills.includes(skill)).length
      const matchScore = matchCount / role.required_skills.length
      
      // Adjust score based on skill levels
      const avgSkillLevel = role.required_skills
        .filter(skill => skillLevels[skill])
        .reduce((sum, skill) => sum + skillLevels[skill], 0) / matchCount || 0
      
      const finalScore = matchScore * 0.7 + (avgSkillLevel / 5) * 0.3

      return {
        ...role,
        match_score: Math.min(1, finalScore)
      }
    }).sort((a, b) => b.match_score - a.match_score)
  }

  private calculateSalary(skills: string[], skillLevels: Record<string, number>, user: User) {
    const baseSalary = 80000
    
    // Experience multiplier
    const experienceMultipliers = {
      'beginner': 0.7,
      'intermediate': 1.0,
      'advanced': 1.3,
      'expert': 1.5
    }
    
    const expMultiplier = experienceMultipliers[user.experience_level as keyof typeof experienceMultipliers] || 1.0
    
    // Skills bonus
    const skillsBonus = skills.length * 2000
    const avgSkillLevel = Object.values(skillLevels).reduce((sum, level) => sum + level, 0) / Object.keys(skillLevels).length || 1
    const levelBonus = avgSkillLevel * 5000
    
    const median = Math.round((baseSalary + skillsBonus + levelBonus) * expMultiplier)
    
    return {
      min: Math.round(median * 0.7),
      max: Math.round(median * 1.5),
      median,
      currency: 'USD'
    }
  }

  private generateRoadmap(targetRole: string, currentSkills: string[]) {
    return [
      {
        title: 'Foundation Building',
        description: `Master core fundamentals for ${targetRole}`,
        estimated_time: '2-3 months',
        skills_required: currentSkills.slice(0, 3),
        resources: ['Coursera', 'Udemy', 'freeCodeCamp'],
        difficulty: 'Beginner',
        prerequisites: [],
        completed: false
      },
      {
        title: 'Skill Specialization',
        description: `Develop advanced ${targetRole} skills`,
        estimated_time: '3-4 months',
        skills_required: currentSkills.slice(0, 5),
        resources: ['Advanced courses', 'Professional certifications'],
        difficulty: 'Intermediate',
        prerequisites: ['Foundation Building'],
        completed: false
      },
      {
        title: 'Portfolio Development',
        description: `Build impressive ${targetRole} projects`,
        estimated_time: '2-3 months',
        skills_required: currentSkills,
        resources: ['GitHub', 'Personal website', 'Hackathons'],
        difficulty: 'Intermediate',
        prerequisites: ['Skill Specialization'],
        completed: false
      }
    ]
  }

  private analyzeSkillGaps(currentSkills: string[], requiredSkills: string[]) {
    const missingSkills = requiredSkills.filter(skill => !currentSkills.includes(skill))
    
    return missingSkills.map(skill => ({
      skill_name: skill,
      current_level: undefined,
      required_level: 3,
      gap_description: `Missing ${skill} - essential for target role`,
      learning_priority: 'high'
    }))
  }

  private generateInsights(skills: string[], user: User, suggestedRoles: any[]) {
    const insights = []
    
    if (skills.length >= 5) {
      insights.push({
        type: 'strength',
        title: 'Strong Technical Foundation',
        description: 'You have a diverse skill set that provides multiple career paths',
        actionable: true,
        priority: 'high'
      })
    }
    
    if (user.streak_count >= 10) {
      insights.push({
        type: 'achievement',
        title: 'Consistent Learning Habit',
        description: `${user.streak_count}-day streak shows excellent dedication`,
        actionable: true,
        priority: 'medium'
      })
    }
    
    if (suggestedRoles.length > 0 && suggestedRoles[0].match_score > 0.8) {
      insights.push({
        type: 'opportunity',
        title: 'High Career Match Potential',
        description: `Excellent match for ${suggestedRoles[0].title} role`,
        actionable: true,
        priority: 'high'
      })
    }
    
    return insights
  }

  private calculateConfidenceScore(skills: string[], skillLevels: Record<string, number>, user: User) {
    let score = 0.5
    
    // Skills count
    score += Math.min(skills.length / 10, 0.2)
    
    // Skill levels
    const avgLevel = Object.values(skillLevels).reduce((sum, level) => sum + level, 0) / Object.keys(skillLevels).length || 0
    score += Math.min(avgLevel / 5, 0.2)
    
    // Experience
    if (user.experience_level === 'advanced') score += 0.1
    if (user.experience_level === 'expert') score += 0.15
    
    // Streak
    if (user.streak_count >= 7) score += 0.05
    
    return Math.min(0.95, score)
  }

  private getMarketTrends() {
    return {
      hot_skills: [
        { skill: 'Machine Learning', growth: '+45%', demand: 'Very High' },
        { skill: 'Cloud Computing', growth: '+38%', demand: 'Very High' },
        { skill: 'DevOps', growth: '+35%', demand: 'High' },
        { skill: 'Full Stack Development', growth: '+28%', demand: 'High' }
      ],
      growing_industries: [
        { industry: 'AI/ML', growth_rate: '+42%' },
        { industry: 'Cloud Services', growth_rate: '+38%' },
        { industry: 'Cybersecurity', growth_rate: '+35%' },
        { industry: 'Data Analytics', growth_rate: '+31%' }
      ]
    }
  }

  private generateNextSteps(skillGaps: any[], topRole: any) {
    const steps = []
    
    if (skillGaps.length > 0) {
      steps.push(`Focus on learning: ${skillGaps.slice(0, 3).map(gap => gap.skill_name).join(', ')}`)
    }
    
    steps.push('Build 2-3 portfolio projects in your target field')
    steps.push('Update your resume with new skills and projects')
    steps.push('Network with professionals in your target industry')
    
    return steps
  }

  // Dashboard Stats
  async getDashboardStats(userId: number) {
    try {
      const [user, userSkills, tasks, notifications, certifications] = await Promise.all([
        supabase.from('users').select('*').eq('id', userId).single(),
        this.getUserSkills(userId),
        this.getTasks(userId),
        this.getNotifications(userId),
        this.getCertifications(userId)
      ])

      const completedTasks = tasks.filter(t => t.completed).length
      const totalHours = userSkills.reduce((sum, us) => sum + us.hours_practiced, 0)
      
      // Calculate job readiness score
      const jobReadinessScore = this.calculateJobReadinessScore(
        user.data,
        userSkills,
        completedTasks,
        certifications.length
      )

      return {
        total_skills: userSkills.length,
        completed_tasks: completedTasks,
        current_streak: user.data.streak_count,
        job_readiness_score: jobReadinessScore,
        weekly_hours: totalHours,
        skills_by_category: this.groupSkillsByCategory(userSkills),
        recent_activity: await this.getRecentActivity(userId)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }

  private calculateJobReadinessScore(user: User, skills: UserSkill[], completedTasks: number, certifications: number) {
    let score = 0
    
    // Skills contribution (40%)
    score += Math.min(skills.length / 10, 0.4)
    
    // Task completion (25%)
    score += Math.min(completedTasks / 50, 0.25)
    
    // Certifications (20%)
    score += Math.min(certifications / 5, 0.2)
    
    // Streak (15%)
    score += Math.min(user.streak_count / 30, 0.15)
    
    return Math.round(score * 100)
  }

  private groupSkillsByCategory(skills: (UserSkill & { skills: Skill })[]) {
    return skills.reduce((acc, us) => {
      const category = us.skills.category
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  private async getRecentActivity(userId: number) {
    const recentTasks = await this.getTasks(userId)
    const recentNotifications = await this.getNotifications(userId)
    
    const activities: Array<{
      type: string
      description: string
      timestamp: string
    }> = []
    
    // Recent task completions
    recentTasks
      .filter(t => t.completed && t.completed_at)
      .slice(0, 3)
      .forEach(task => {
        activities.push({
          type: 'task_completed',
          description: `Completed '${task.title}'`,
          timestamp: task.completed_at!
        })
      })
    
    // Recent notifications
    recentNotifications
      .slice(0, 2)
      .forEach(notification => {
        activities.push({
          type: 'notification',
          description: notification.title,
          timestamp: notification.created_at
        })
      })
    
    return activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 5)
  }
}

export const apiService = ApiService.getInstance()
