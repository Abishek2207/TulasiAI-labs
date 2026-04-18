'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Brain, 
  Target, 
  CheckSquare, 
  User, 
  Bell,
  TrendingUp,
  BookOpen,
  Award,
  Flame,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    current: 'dashboard'
  },
  {
    name: 'Skills',
    href: '/skills',
    icon: Brain,
    current: 'skills'
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: CheckSquare,
    current: 'tasks'
  },
  {
    name: 'Career',
    href: '/career',
    icon: Target,
    current: 'career'
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: Bell,
    current: 'notifications'
  }
]

interface SidebarProps {
  className?: string
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ className, collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "relative h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <span className="text-white font-semibold text-lg">TulasiAI</span>
            )}
          </motion.div>
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
              pathname === item.href
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <motion.span
              initial={{ opacity: 1, width: 'auto' }}
              animate={{ 
                opacity: collapsed ? 0 : 1,
                width: collapsed ? 0 : 'auto'
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              {item.name}
            </motion.span>
            {pathname === item.href && (
              <motion.div
                layoutId="activeTab"
                className="absolute right-2 w-1 h-6 bg-blue-500 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-t border-zinc-800">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: collapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Overview
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/50">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs text-zinc-300">Readiness</span>
              </div>
              <span className="text-xs font-semibold text-green-400">78%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/50">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-zinc-300">Streak</span>
              </div>
              <span className="text-xs font-semibold text-orange-400">12d</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/50">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-zinc-300">Skills</span>
              </div>
              <span className="text-xs font-semibold text-blue-400">24</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
