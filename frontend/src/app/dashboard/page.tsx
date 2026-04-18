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

// Modern Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, trend, isLoading = false }: any) => (
  <motion.div
    whileHover={{ y: -2, scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <Card className="border-0 bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50 hover:bg-zinc-900/70 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-zinc-400 mb-1">{title}</p>
            {isLoading ? (
              <div className="h-8 w-20 bg-zinc-800 rounded-lg animate-pulse"></div>
            ) : (
              <p className="text-3xl font-bold text-white mb-2">{value}</p>
            )}
            {trend && !isLoading && (
              <div className="flex items-center gap-1 text-sm">
                <div className="flex items-center gap-1 text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>{trend}</span>
                </div>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)

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
        <div className="pt-20 px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-zinc-800 rounded-xl w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-zinc-800/50 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const incompleteTasks = tasks?.filter(task => !task.completed).slice(0, 5) || []
  const topSkills = skills?.slice(0, 5) || []

  return (
    <Layout>
      <div className="pt-20 px-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{profile?.name || 'User'}</span>
              </h1>
              <p className="text-zinc-400 text-lg">Track your learning progress and career growth</p>
            </div>
            <Button variant="gradient" className="gap-2 px-6 py-3">
              <Plus className="w-5 h-5" />
              Quick Action
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatsCard
            title="Job Readiness Score"
            value={`${stats?.job_readiness_score || 0}%`}
            icon={Target}
            color="from-blue-500 to-cyan-500"
            trend="+5% this week"
            isLoading={profileLoading}
          />
          <StatsCard
            title="Current Streak"
            value={streak?.current_streak || 0}
            icon={Flame}
            color="from-orange-500 to-red-500"
            trend="Keep it up!"
            isLoading={streakLoading}
          />
          <StatsCard
            title="Skills Learned"
            value={skills?.length || 0}
            icon={BookOpen}
            color="from-purple-500 to-pink-500"
            trend="+2 this month"
            isLoading={skillsLoading}
          />
          <StatsCard
            title="Tasks Completed"
            value={stats?.completed_tasks || 0}
            icon={CheckSquare}
            color="from-green-500 to-emerald-500"
            trend="Great progress!"
            isLoading={profileLoading}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  Recent Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {incompleteTasks.length > 0 ? (
                  incompleteTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl hover:bg-zinc-800/70 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full group-hover:scale-125 transition-transform"></div>
                        <div>
                          <p className="font-medium text-white">{task.title}</p>
                          <p className="text-sm text-zinc-400">{task.task_type}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600">
                        Complete
                      </Button>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-6 h-6 text-zinc-600" />
                    </div>
                    <p className="text-zinc-400">No pending tasks. Great job!</p>
                  </div>
                )}
              </CardContent>
              {incompleteTasks.length > 0 && (
                <div className="p-4 border-t border-zinc-800">
                  <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600">
                    View All Tasks
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Top Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-0 bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Brain className="w-5 h-5 text-purple-400" />
                  </div>
                  Top Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topSkills.length > 0 ? (
                  topSkills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl hover:bg-zinc-800/70 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full group-hover:scale-125 transition-transform"></div>
                        <div>
                          <p className="font-medium text-white">{skill.skill_name}</p>
                          <p className="text-sm text-zinc-400">{skill.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">Level {skill.proficiency_level}</p>
                        <p className="text-xs text-zinc-400">{skill.hours_practiced}h</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="w-6 h-6 text-zinc-600" />
                    </div>
                    <p className="text-zinc-400">No skills added yet.</p>
                  </div>
                )}
              </CardContent>
              {topSkills.length > 0 && (
                <div className="p-4 border-t border-zinc-800">
                  <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600">
                    Manage Skills
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-0 bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-24 flex-col gap-3 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-200 group">
                  <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Add Skill</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-3 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-200 group">
                  <Target className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Career Prediction</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-3 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-200 group">
                  <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">View Tasks</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-3 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-200 group">
                  <Settings className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  )
}
