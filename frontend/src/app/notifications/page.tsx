'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Layout } from '@/components/layout/Layout'
import { useAuthStore, useNotificationsStore } from '@/store/store'
import { Bell, CheckCircle, AlertCircle, Award, Target, Brain, Calendar, Check, Clock } from 'lucide-react'
import React from 'react'

export default function NotificationsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { notifications, fetchNotifications, markAsRead, fetchUnreadCount, isLoading, error } = useNotificationsStore()
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    fetchNotifications(user.id, filter === 'unread' ? false : undefined)
    fetchUnreadCount(user.id)
  }, [isAuthenticated, user, router, fetchNotifications, fetchUnreadCount, filter])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId, user!.id)
      // Refresh notifications
      fetchNotifications(user!.id, filter === 'unread' ? false : undefined)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    const icons = {
      achievement: Award,
      task_reminder: Calendar,
      career_insight: Brain,
      skill_level_up: Target,
      task_completed: CheckCircle,
      streak_milestone: Bell,
      certification_added: Award
    }
    return icons[type as keyof typeof icons] || Bell
  }

  const getNotificationColor = (type: string) => {
    const colors = {
      achievement: 'from-green-500 to-emerald-500',
      task_reminder: 'from-blue-500 to-cyan-500',
      career_insight: 'from-purple-500 to-pink-500',
      skill_level_up: 'from-orange-500 to-red-500',
      task_completed: 'from-green-500 to-emerald-500',
      streak_milestone: 'from-yellow-500 to-orange-500',
      certification_added: 'from-indigo-500 to-purple-500'
    }
    return colors[type as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    )
  }

  const unreadNotifications = notifications?.filter(n => !n.is_read) || []
  const readNotifications = notifications?.filter(n => n.is_read) || []
  const displayNotifications = filter === 'unread' ? unreadNotifications : notifications

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your learning progress</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All ({notifications?.length || 0})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadNotifications.length})
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Notifications List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : displayNotifications.length > 0 ? (
          <div className="space-y-4">
            {displayNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`border-0 shadow ${!notification.is_read ? 'border-l-4 border-l-blue-500' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-2 rounded-full bg-gradient-to-r ${getNotificationColor(notification.notification_type)}`}>
                          {React.createElement(getNotificationIcon(notification.notification_type), { 
                            className: 'w-5 h-5 text-white' 
                          })}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              notification.priority === 'high' ? 'bg-red-500 text-white' :
                              notification.priority === 'medium' ? 'bg-yellow-500 text-white' :
                              'bg-gray-500 text-white'
                            }`}>
                              {notification.priority}
                            </span>
                            {!notification.is_read && (
                              <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(notification.created_at).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {!notification.is_read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Mark as Read
                        </Button>
                      )}
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
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'unread' 
                  ? 'All your notifications have been read!'
                  : 'You\'ll see notifications here as you progress with your learning journey.'
                }
              </p>
              {filter === 'unread' && (
                <Button variant="outline" onClick={() => setFilter('all')}>
                  View All Notifications
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
