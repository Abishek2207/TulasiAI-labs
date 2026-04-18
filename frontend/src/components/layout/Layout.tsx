'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'
import { useAuthStore } from '@/store/store'
import Navbar from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuthStore()
  const [isDark, setIsDark] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark')
    document.body.classList.add('bg-zinc-950')
  }, [])

  if (!isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <div className="flex">
        <AnimatePresence mode="wait">
          <Sidebar 
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </AnimatePresence>
        <main className={`flex-1 overflow-hidden transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="h-full"
          >
            <div className="h-full bg-zinc-950">
              {children}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
