'use client'

import Image from 'next/image'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  Menu, 
  X, 
  LogOut, 
  User,
  GraduationCap,
  Briefcase,
  Settings,
  ChevronDown
} from 'lucide-react'
import { useAuthStore, useNotificationsStore } from '@/store/store'
import { authService } from '@/lib/supabase-client'

interface NavbarProps {
  userType?: 'student' | 'professional' | null
}

export default function Navbar({ userType }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const { notifications, unreadCount, fetchNotifications } = useNotificationsStore()
  
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    if (user?.user_id) {
      fetchNotifications(user.user_id, false)
    }
  }, [user, fetchNotifications])

  const handleLogout = async () => {
    await authService.signOut?.()
    logout()
    router.push('/')
  }

  const mockNotifications = [
    { id: '1', title: '🔥 Streak Update!', message: 'Keep your 7-day streak going today!', time: '2m ago', read: false },
    { id: '2', title: '📈 Trending: AI Skills', message: 'Machine Learning demand up 45% this month', time: '1h ago', read: false },
    { id: '3', title: '🏆 Badge Earned!', message: 'You earned the "Week Warrior" badge', time: '3h ago', read: true },
    { id: '4', title: '💡 New Tech Update', message: 'React 19 stable released — check updated roadmap', time: '1d ago', read: true },
  ]

  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications
  const displayUnreadCount = unreadCount > 0 ? unreadCount : mockNotifications.filter(n => !n.read).length

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden group-hover:scale-110 transition-transform duration-200 bg-white flex items-center justify-center">
              <Image src="/logo.png" alt="TulasiAI Labs" width={36} height={36} className="w-9 h-9 object-contain" />
            </div>
            <span className="text-lg font-bold text-white">
              Tulasi<span className="text-blue-400">AI</span> Labs
            </span>
          </Link>

          {/* Center Nav (Desktop) */}
          {user && (
            <div className="hidden md:flex items-center space-x-1">
              <Link
                href="/student-dashboard"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === '/student-dashboard' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student</span>
              </Link>
              <Link
                href="/professional-dashboard"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === '/professional-dashboard'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Professional</span>
              </Link>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
                    className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {displayUnreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                        {displayUnreadCount > 9 ? '9+' : displayUnreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                      >
                        <div className="p-4 border-b border-white/5">
                          <h3 className="font-semibold text-white">Notifications</h3>
                          <p className="text-xs text-gray-400">{displayUnreadCount} unread</p>
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {displayNotifications.map((notif: any) => (
                            <div
                              key={notif.id}
                              className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                                !notif.read && !notif.is_read ? 'bg-blue-500/5' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-white">{notif.title}</p>
                                <span className="text-xs text-gray-500 ml-2 shrink-0">{notif.time || '1h ago'}</span>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">{notif.message}</p>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 text-center">
                          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                            View all notifications
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="hidden sm:block text-sm text-gray-300 max-w-[100px] truncate">
                      {user.name || user.email?.split('@')[0] || 'User'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                      >
                        <div className="p-3 border-b border-white/5">
                          <p className="text-sm font-medium text-white truncate">{user.name || 'User'}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={() => { setProfileOpen(false); router.push('/student-dashboard') }}
                            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <GraduationCap className="w-4 h-4" />
                            <span>Student Mode</span>
                          </button>
                          <button
                            onClick={() => { setProfileOpen(false); router.push('/professional-dashboard') }}
                            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <Briefcase className="w-4 h-4" />
                            <span>Professional Mode</span>
                          </button>
                          <button
                            onClick={() => { setProfileOpen(false); router.push('/onboarding') }}
                            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </button>
                          <div className="border-t border-white/5 mt-1 pt-1">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              /* Not logged in */
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-black/80 backdrop-blur-xl border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              <Link
                href="/student-dashboard"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <GraduationCap className="w-5 h-5" />
                <span>Student Dashboard</span>
              </Link>
              <Link
                href="/professional-dashboard"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <Briefcase className="w-5 h-5" />
                <span>Professional Dashboard</span>
              </Link>
              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click-outside handler */}
      {(notifOpen || profileOpen) && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => { setNotifOpen(false); setProfileOpen(false) }}
        />
      )}
    </nav>
  )
}
