'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Layout } from '@/components/layout/Layout'
import { useAuthStore, useProfileStore, useStreakStore, useSkillsStore, useTasksStore } from '@/store/store'
import { 
  TrendingUp, 
  Target, 
  Brain, 
  Calendar,
  Award,
  Settings,
  Plus,
  CheckCircle,
  Flame,
  BookOpen,
  CheckSquare
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { profile, stats, fetchProfile, fetchStats, isLoading: profileLoading } = useProfileStore()
  const { streak, fetchStreak, isLoading: streakLoading } = useStreakStore()
  const { skills, fetchSkills, isLoading: skillsLoading } = useSkillsStore()
  const { tasks, fetchTasks, isLoading: tasksLoading } = useTasksStore()

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    // Fetch all dashboard data
    const fetchDashboardData = async () => {
      try {
        await Promise.all([
          fetchProfile(user.id),
          fetchStats(user.id),
          fetchStreak(user.id),
          fetchSkills(user.id),
          fetchTasks(user.id, false) // Get incomplete tasks
        ])
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      }
    }

    fetchDashboardData()
  }, [isAuthenticated, user, router, fetchProfile, fetchStats, fetchStreak, fetchSkills, fetchTasks])

  const isLoading = profileLoading || streakLoading || skillsLoading || tasksLoading

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

const mockSkills = [
  { name: 'React', level: 85, progress: 85, color: 'from-blue-500 to-cyan-500' },
  { name: 'TypeScript', level: 72, progress: 72, color: 'from-purple-500 to-pink-500' },
  { name: 'Node.js', level: 68, progress: 68, color: 'from-green-500 to-emerald-500' },
  { name: 'Python', level: 45, progress: 45, color: 'from-orange-500 to-red-500' },
  { name: 'AWS', level: 30, progress: 30, color: 'from-indigo-500 to-purple-500' },
]

const mockTasks = [
  { id: 1, title: 'Complete React Hooks tutorial', completed: true, due: '2024-01-15' },
  { id: 2, title: 'Build TypeScript project', completed: true, due: '2024-01-15' },
  { id: 3, title: 'Read AWS documentation', completed: false, due: '2024-01-16' },
  { id: 4, title: 'Practice Python algorithms', completed: false, due: '2024-01-16' },
  { id: 5, title: 'Deploy portfolio', completed: false, due: '2024-01-17' },
]

const mockHeatmapData = Array.from({ length: 42 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - 41 + i)
  
  // Generate realistic streak data
  const dayOfWeek = date.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  const randomActivity = Math.random()
  
  let count = 0
  let level = 0
  
  if (randomActivity > 0.3 && !isWeekend) {
    count = Math.floor(Math.random() * 5) + 1
    level = Math.min(4, Math.ceil(count / 1.5))
  }
  
  return {
    date: date.toISOString().split('T')[0],
    count,
    level
  }
})

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  
  // API Store
  const {
    user,
    userSkills,
    tasks,
    dashboardStats,
    isLoading,
    error,
    fetchDashboardStats,
    fetchUserSkills,
    fetchTasks
  } = useApiStore()

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardStats()
    fetchUserSkills()
    fetchTasks()
  }, [fetchDashboardStats, fetchUserSkills, fetchTasks])

  // Calculate stats from API data
  const stats = dashboardStats ? {
    jobReadiness: Math.round(dashboardStats.job_readiness_score),
    currentStreak: dashboardStats.current_streak,
    skillsLearned: dashboardStats.total_skills,
    tasksCompleted: dashboardStats.completed_tasks
  } : {
    jobReadiness: 0,
    currentStreak: 0,
    skillsLearned: 0,
    tasksCompleted: 0
  }

  // Process skills data
  const skills = userSkills.map(skill => ({
    name: skill.name,
    level: skill.level || 0,
    progress: skill.level || 0,
    color: skill.category === 'Frontend' ? 'from-blue-500 to-cyan-500' :
            skill.category === 'Backend' ? 'from-green-500 to-emerald-500' :
            skill.category === 'AI/ML' ? 'from-purple-500 to-pink-500' :
            skill.category === 'DevOps' ? 'from-orange-500 to-red-500' :
            'from-indigo-500 to-purple-500'
  }))

  // Process tasks data
  const processedTasks = tasks.map(task => ({
    id: task.id,
    title: task.title,
    completed: task.completed,
    due: task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'
  }))

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your learning progress and career growth
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatsCard
              title="Job Readiness"
              value={`${stats.jobReadiness}%`}
              change="+5%"
              changeType="increase"
              icon={TrendingUp}
              iconColor="text-green-500"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatsCard
              title="Current Streak"
              value={`${stats.currentStreak} days`}
              change="+2 days"
              changeType="increase"
              icon={Calendar}
              iconColor="text-orange-500"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <StatsCard
              title="Skills Learned"
              value={stats.skillsLearned}
              change="+3"
              changeType="increase"
              icon={Brain}
              iconColor="text-blue-500"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <StatsCard
              title="Tasks Completed"
              value={stats.tasksCompleted}
              change="+7%"
              changeType="increase"
              icon={Target}
              iconColor="text-purple-500"
            />
          </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skills Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  Skills Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-500`}
                          style={{ width: `${skill.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Learning Streak Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StreakHeatmap data={mockHeatmapData} />
          </motion.div>

          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ProgressChart 
              data={[
                { day: 'Mon', hours: 3, tasks: 5 },
                { day: 'Tue', hours: 2, tasks: 3 },
                { day: 'Wed', hours: 4, tasks: 7 },
                { day: 'Thu', hours: 1, tasks: 2 },
                { day: 'Fri', hours: 3, tasks: 4 },
                { day: 'Sat', hours: 1, tasks: 1 },
                { day: 'Sun', hours: 0, tasks: 0 },
              ]}
            />
          </motion.div>
        </div>

        {/* Career Insights Section */}
        <div className="grid grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CareerInsights />
          </motion.div>
        </div>

        {/* Task Manager Section */}
        <div className="grid grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <TaskManager />
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center space-x-4 mt-8"
        >
          <Button variant="gradient" size="lg">
            <Award className="mr-2 h-5 w-5" />
            Generate Career Path
          </Button>
          <Button variant="outline">
            <Plus className="mr-2 h-5 w-5" />
            Add New Skill
          </Button>
        </motion.div>
      </div>
    </Layout>
  )
}
