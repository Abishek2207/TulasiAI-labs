'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useNotificationsStore, useAuthStore } from '@/store/store'
import { 
  Bell, 
  CheckCircle, 
  X, 
  Award,
  Target,
  Brain,
  Calendar,
  TrendingUp,
  Settings
} from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  notification_type: string
  metadata?: any
  is_read: boolean
  created_at: string
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const { user } = useAuthStore()
  
  const { 
    notifications, 
    fetchNotifications, 
    markAsRead,
    isLoading 
  } = useNotificationsStore()

  useEffect(() => {
    if (user) {
      fetchNotifications(user.id)
    }
  }, [user, fetchNotifications])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Award className="h-4 w-4 text-yellow-500" />
      case 'task_reminder':
        return <Calendar className="h-4 w-4 text-blue-500" />
      case 'career_insight':
        return <Brain className="h-4 w-4 text-purple-500" />
      case 'task_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'skill_level_up':
        return <TrendingUp className="h-4 w-4 text-orange-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      case 'task_reminder':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      case 'career_insight':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
      case 'task_completed':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'skill_level_up':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const filteredNotifications = notifications?.filter((notification: any) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.is_read
    return true
  }) || []

  const unreadCount = notifications?.filter((n: any) => !n.is_read).length || 0

  const handleMarkAsRead = async (notificationId: string) => {
    if (user) {
      await markAsRead(notificationId, user.id)
    }
  }

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications?.filter((n: any) => !n.is_read) || []
    if (user) {
      await Promise.all(unreadNotifications.map((n: any) => markAsRead(n.id, user.id)))
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-background border border-border rounded-lg shadow-2xl z-50 max-h-96 overflow-hidden"
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Notifications</CardTitle>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                      >
                        Mark all read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Filter Tabs */}
                <div className="flex space-x-1 mt-3">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'unread', label: 'Unread' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilter(tab.id as any)}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${
                        filter === tab.id
                          ? 'bg-blue-500 text-white'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="max-h-64 overflow-y-auto">
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredNotifications.map((notification: any) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-3 border-b border-border last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors ${
                            !notification.is_read ? 'bg-muted/30' : ''
                          }`}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.notification_type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium truncate">
                                  {notification.title}
                                </h4>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {formatTimeAgo(notification.created_at)}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              {notification.metadata && (
                                <div className="mt-2">
                                  {notification.metadata.skill_name && (
                                    <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                      {notification.metadata.skill_name} Level {notification.metadata.new_level}
                                    </span>
                                  )}
                                  {notification.metadata.task_title && (
                                    <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full ml-1">
                                      {notification.metadata.task_title}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            {!notification.is_read && (
                              <div className="flex-shrink-0">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
