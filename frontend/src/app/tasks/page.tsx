'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Layout } from '@/components/layout/Layout'
import { useAuthStore, useTasksStore } from '@/store/store'
import { Plus, CheckCircle2, Circle, Calendar, Clock, Target, BookOpen, Code, Award } from 'lucide-react'
import React from 'react'

export default function TasksPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { tasks, fetchTasks, createTask, completeTask, deleteTask, generateDailyTasks, isLoading, error } = useTasksStore()
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    task_type: 'learning' as const,
    difficulty: 'beginner' as const,
    estimated_hours: 1,
    due_date: '',
    priority: 'medium' as const
  })

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    fetchTasks(user!.id, filter === 'completed' ? true : filter === 'pending' ? false : undefined)
  }, [isAuthenticated, user, router, fetchTasks, filter])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    try {
      const taskData = {
        ...formData,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : undefined
      }
      
      await createTask(user.id, taskData)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        task_type: 'learning',
        difficulty: 'beginner',
        estimated_hours: 1,
        due_date: '',
        priority: 'medium'
      })
      setShowAddForm(false)
      
      // Refresh tasks
      fetchTasks(user.id, filter === 'completed' ? true : filter === 'pending' ? false : undefined)
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleComplete = async (taskId: string) => {
    if (!user) return
    try {
      await completeTask(taskId, user.id)
      fetchTasks(user.id, filter === 'completed' ? true : filter === 'pending' ? false : undefined)
    } catch (error) {
      console.error('Failed to complete task:', error)
    }
  }

  const handleDelete = async (taskId: string) => {
    if (!user) return
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId, user.id)
        fetchTasks(user.id, filter === 'completed' ? true : filter === 'pending' ? false : undefined)
      } catch (error) {
        console.error('Failed to delete task:', error)
      }
    }
  }

  const handleGenerateDaily = async () => {
    if (!user) return
    try {
      await generateDailyTasks(user.id, 2)
      fetchTasks(user.id, filter === 'completed' ? true : filter === 'pending' ? false : undefined)
    } catch (error) {
      console.error('Failed to generate daily tasks:', error)
    }
  }

  const getTaskIcon = (taskType: string) => {
    const icons = {
      learning: BookOpen,
      project: Code,
      practice: Target,
      review: Award,
      certification: CheckCircle2
    }
    return icons[taskType as keyof typeof icons] || BookOpen
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    }
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'from-green-500 to-emerald-500',
      intermediate: 'from-blue-500 to-cyan-500',
      advanced: 'from-purple-500 to-pink-500',
      expert: 'from-orange-500 to-red-500'
    }
    return colors[difficulty as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  const filteredTasks = tasks?.filter(task => {
    if (filter === 'completed') return task.completed
    if (filter === 'pending') return !task.completed
    return true
  }) || []

  const completedCount = tasks?.filter(t => t.completed).length || 0
  const pendingCount = tasks?.filter(t => !t.completed).length || 0

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="text-muted-foreground">Manage your daily learning tasks</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleGenerateDaily}
              className="gap-2"
            >
              <Target className="w-4 h-4" />
              Generate Daily
            </Button>
            <Button 
              variant="gradient" 
              className="gap-2"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold">{tasks?.length || 0}</p>
                </div>
                <Target className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All ({tasks?.length || 0})
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            Pending ({pendingCount})
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedCount})
          </Button>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Add New Task</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full p-2 border rounded-lg"
                        placeholder="Task title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <select
                        value={formData.task_type}
                        onChange={(e) => setFormData({...formData, task_type: e.target.value as any})}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="learning">Learning</option>
                        <option value="project">Project</option>
                        <option value="practice">Practice</option>
                        <option value="review">Review</option>
                        <option value="certification">Certification</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Difficulty</label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData({...formData, difficulty: e.target.value as any})}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Estimated Hours</label>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={formData.estimated_hours}
                        onChange={(e) => setFormData({...formData, estimated_hours: parseFloat(e.target.value)})}
                        className="w-full p-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Due Date</label>
                      <input
                        type="date"
                        value={formData.due_date}
                        onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      rows={3}
                      placeholder="Task description (optional)"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" variant="gradient">
                      Add Task
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false)
                        setFormData({
                          title: '',
                          description: '',
                          task_type: 'learning',
                          difficulty: 'beginner',
                          estimated_hours: 1,
                          due_date: '',
                          priority: 'medium'
                        })
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Tasks List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`border-0 shadow ${task.completed ? 'opacity-75' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <button
                          onClick={() => !task.completed && handleComplete(task.id)}
                          className="mt-1"
                          disabled={task.completed}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400 hover:text-blue-600 transition-colors" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(task.difficulty || 'beginner')} bg-gradient-to-r text-white`}>
                              {task.difficulty}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-muted-foreground mb-2">{task.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              {React.createElement(getTaskIcon(task.task_type || 'learning'), { className: 'w-4 h-4' })}
                              <span className="capitalize">{task.task_type}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{task.estimated_hours}h</span>
                            </div>
                            {task.due_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{task.due_date ? new Date(task.due_date).toLocaleDateString() : ''}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No tasks {filter === 'completed' ? 'completed yet' : filter === 'pending' ? 'pending' : 'found'}</h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'completed' 
                  ? 'Start completing some tasks to see them here.'
                  : filter === 'pending'
                  ? 'All tasks are completed! Great job!'
                  : 'Create your first task to start tracking your progress.'
                }
              </p>
              {filter === 'all' && (
                <Button 
                  variant="gradient"
                  onClick={() => setShowAddForm(true)}
                >
                  Create Your First Task
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
