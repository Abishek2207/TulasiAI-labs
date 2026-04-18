'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useApiStore } from '@/store/apiStore'
import { 
  CheckCircle, 
  Circle, 
  Plus, 
  Calendar, 
  Clock, 
  Target,
  AlertCircle,
  Edit,
  Trash2,
  Filter,
  Brain
} from 'lucide-react'

interface Task {
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

interface TaskFormData {
  title: string
  description?: string
  task_type?: string
  difficulty?: string
  estimated_hours?: number
  due_date?: string
}

export function TaskManager() {
  const [isCreating, setIsCreating] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    task_type: 'learning',
    difficulty: 'Intermediate',
    estimated_hours: 2,
    due_date: ''
  })
  
  const { 
    tasks, 
    fetchTasks, 
    createTask, 
    updateTask, 
    isLoading 
  } = useApiStore()

  useEffect(() => {
    fetchTasks()
  }, [])

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const handleCreateTask = async () => {
    if (!formData.title.trim()) return
    
    await createTask(formData)
    setFormData({
      title: '',
      description: '',
      task_type: 'learning',
      difficulty: 'Intermediate',
      estimated_hours: 2,
      due_date: ''
    })
    setIsCreating(false)
  }

  const handleUpdateTask = async (taskId: number, completed: boolean) => {
    await updateTask(taskId, { completed })
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description || '',
      task_type: task.task_type || 'learning',
      difficulty: task.difficulty || 'Intermediate',
      estimated_hours: task.estimated_hours || 2,
      due_date: task.due_date || ''
    })
  }

  const handleSaveEdit = async () => {
    if (!editingTask || !formData.title.trim()) return
    
    await updateTask(editingTask.id, { 
      ...formData,
      completed: editingTask.completed 
    })
    setEditingTask(null)
    setFormData({
      title: '',
      description: '',
      task_type: 'learning',
      difficulty: 'Intermediate',
      estimated_hours: 2,
      due_date: ''
    })
  }

  const getTaskIcon = (type?: string) => {
    switch (type) {
      case 'learning':
        return <Brain className="h-4 w-4" />
      case 'project':
        return <Target className="h-4 w-4" />
      case 'practice':
        return <Clock className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'Advanced':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const formatDueDate = (dateString?: string) => {
    if (!dateString) return 'No due date'
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Overdue'
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays <= 7) return `In ${diffDays} days`
    
    return date.toLocaleDateString()
  }

  const completedCount = tasks.filter(t => t.completed).length
  const activeCount = tasks.filter(t => !t.completed).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Task Manager
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs">
                {completedCount} completed
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs">
                {activeCount} active
              </span>
            </div>
            <Button
              variant="gradient"
              size="sm"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-1 mt-3">
          {[
            { id: 'all', label: 'All', count: tasks.length },
            { id: 'active', label: 'Active', count: activeCount },
            { id: 'completed', label: 'Completed', count: completedCount }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-colors ${
                filter === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Create Task Form */}
        <AnimatePresence>
          {(isCreating || editingTask) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 border border-border rounded-lg bg-muted/30"
            >
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                
                <textarea
                  placeholder="Description (optional)..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  rows={2}
                />
                
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={formData.task_type}
                    onChange={(e) => setFormData({ ...formData, task_type: e.target.value })}
                    className="px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="learning">Learning</option>
                    <option value="project">Project</option>
                    <option value="practice">Practice</option>
                  </select>
                  
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  
                  <input
                    type="number"
                    placeholder="Hours"
                    value={formData.estimated_hours}
                    onChange={(e) => setFormData({ ...formData, estimated_hours: parseInt(e.target.value) || 1 })}
                    className="px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    min="1"
                    max="8"
                  />
                </div>
                
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsCreating(false)
                      setEditingTask(null)
                      setFormData({
                        title: '',
                        description: '',
                        task_type: 'learning',
                        difficulty: 'Intermediate',
                        estimated_hours: 2,
                        due_date: ''
                      })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={editingTask ? handleSaveEdit : handleCreateTask}
                    disabled={!formData.title.trim()}
                  >
                    {editingTask ? 'Save' : 'Create'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task List */}
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                {filter === 'completed' ? 'No completed tasks yet' : 
                 filter === 'active' ? 'No active tasks' : 
                 'No tasks yet. Create your first task!'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task: Task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => handleUpdateTask(task.id, !task.completed)}
                    className="flex-shrink-0 mt-1"
                  >
                    {task.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center space-x-2 ml-2">
                        {getTaskIcon(task.task_type)}
                        <button
                          onClick={() => handleEditTask(task)}
                          className="opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(task.difficulty)}`}>
                        {task.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full">
                        {task.estimated_hours}h
                      </span>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDueDate(task.due_date)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
