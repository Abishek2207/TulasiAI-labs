'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { 
  Flame, 
  Target, 
  Award, 
  ArrowRight, 
  Trophy, 
  Lock, 
  ChevronRight,
  TrendingUp,
  Clock,
  Play,
  CheckCircle2,
  CalendarDays,
  Activity
} from 'lucide-react'

interface RoadmapDay {
  day: number
  title: string
  topics: {
    DSA: string[]
    Aptitude: string[]
    Core: string[]
  }
  progress: number
  locked: boolean
}

const TRACKS = [
  { id: 'aptitude', title: 'Aptitude & Verbal', icon: '🧠', progress: 45, color: 'var(--accent-orange)', description: 'Master number systems, probability, and logical puzzles.' },
  { id: 'coding', title: 'Coding & DSA', icon: '💻', progress: 68, color: 'var(--accent-blue)', description: 'Data structures, algorithms, and 500+ placement problems.' },
  { id: 'interview', title: 'Interview Mastery', icon: '🎙️', progress: 12, color: 'var(--primary)', description: 'Mock interviews, body language, and behavioral prep.' },
  { id: 'english', title: 'English & Comm', icon: '🌍', progress: 30, color: 'var(--accent-green)', description: 'Workplace English, presentation skills, and fluency.' }
]

const DAILY_TASKS = [
  { id: 1, track: 'coding', title: 'Solve 2 Sum (HashMap)', time: '45m', type: 'coding' },
  { id: 2, track: 'aptitude', title: 'Permutations & Combinations', time: '30m', type: 'practice' },
  { id: 3, track: 'english', title: 'Record 1-min Self Intro', time: '15m', type: 'soft-skills' }
]

const CircularProgress = ({ progress, size = 60, strokeWidth = 4, color = "var(--primary)" }: any) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {progress === 100 ? (
          <CheckCircle2 className="w-1/3 h-1/3" style={{ color }} />
        ) : (
          <Play className="w-1/3 h-1/3 ml-1 fill-white opacity-50" />
        )}
      </div>
    </div>
  )
}

export default function StudentDashboard() {
  const router = useRouter()
  const [learningHours, setLearningHours] = useState(2)
  const [activeTab, setActiveTab] = useState<'DSA' | 'Aptitude' | 'Core'>('DSA')
  
  const placementScore = 68
  const streakDays = 14

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-6 mb-12"
        >
          <div className="flex-1 glass rounded-[2rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <h1 className="text-4xl font-bold tracking-tight mb-2">Keep the pace up!</h1>
            <p className="text-white/50 text-lg mb-8">You are in the top 15% of consistent learners this week.</p>
            
            <div className="flex items-center gap-4">
              <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-3 border border-white/5">
                <Flame className="w-8 h-8 text-[var(--accent-orange)]" />
                <div>
                  <div className="text-2xl font-bold text-[var(--accent-orange)]">{streakDays}</div>
                  <div className="text-xs text-white/50 uppercase tracking-widest font-semibold">Day Streak</div>
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-3 border border-white/5">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div>
                  <div className="text-2xl font-bold text-yellow-400">Junior Prep</div>
                  <div className="text-xs text-white/50 uppercase tracking-widest font-semibold">Current League</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 glass rounded-[2rem] p-8 flex flex-col justify-center border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-white/70 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--accent-blue)]" /> Daily Free Time
              </h3>
            </div>
            <div className="flex bg-white/5 rounded-full p-1 mb-4 border border-white/5 overflow-hidden">
              {[1, 2, 3, 'Weekend'].map(h => (
                <button 
                  key={h}
                  onClick={() => setLearningHours(h as any)}
                  className={"flex-1 py-2 px-2 text-xs md:text-sm font-semibold transition-all rounded-full " + (learningHours === h ? "bg-primary text-white shadow-lg" : "text-white/50 hover:text-white")}
                >
                  {typeof h === 'number' ? `${h}hr/day` : h}
                </button>
              ))}
            </div>
            <p className="text-xs text-center text-[var(--accent-green)]/80 font-medium tracking-wide">24/7 AI System Active.</p>
            <p className="text-xs text-center text-white/40 mt-1">Adapting Day-by-Day tasks to fit your {learningHours}hr free-time window.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Placement OS Tracks</h2>
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Active Session: Week 4</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {TRACKS.map((track, idx) => (
                <motion.div 
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass glass-hover rounded-[2rem] p-6 flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{track.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg">{track.title}</h3>
                      <p className="text-xs text-white/40 line-clamp-1">{track.description}</p>
                    </div>
                  </div>
                  <CircularProgress progress={track.progress} size={50} strokeWidth={4} color={track.color} />
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Today's Drill</h2>
            </div>
            
            <div className="space-y-4">
              {DAILY_TASKS.map((task, idx) => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  className="glass flex items-center justify-between p-4 px-8 rounded-2xl border border-white/5 hover:border-white/20 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs font-mono group-hover:bg-primary group-hover:text-white transition-all">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold">{task.title}</h4>
                      <p className="text-xs text-white/40 uppercase tracking-widest">{task.track} • {task.time}</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-full glass hover:bg-white text-white hover:text-black transition-all">
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            
            <div className="glass rounded-[2rem] p-6 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-green)]/10 blur-[50px] -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-[var(--accent-green)]" />
                <h3 className="font-semibold">Placement Readiness</h3>
              </div>
              
              <div className="flex items-end gap-2 mb-4">
                <span className="text-6xl font-bold tracking-tighter liquid-text text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">{placementScore}</span>
                <span className="text-xl text-white/40 pb-2">/100</span>
              </div>
              
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: placementScore + "%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-blue)]"
                />
              </div>
              <p className="text-xs text-white/50">Your score rose by 4 points this week. Keep hitting daily goals to reach 85+ (Interview Ready).</p>
            </div>

            <div className="glass rounded-[2rem] p-6 border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <CalendarDays className="w-5 h-5 text-white/70" />
                <h3 className="font-semibold text-white/70">Activity</h3>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
                  const isActive = i < 4
                  const isToday = i === 3
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="text-xs text-white/30 font-medium">{d}</div>
                      <div className={
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all " +
                        (isActive ? "bg-[var(--accent-orange)] text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] " : "bg-white/5 text-white/20 ") +
                        (isToday ? "ring-2 ring-white/20 ring-offset-2 ring-offset-[var(--background)]" : "")
                      }>
                        {isActive ? <Flame className="w-4 h-4" /> : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="glass rounded-[2rem] p-6 border border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 border border-primary/30">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Mock Interview Unlocked</h3>
              <p className="text-sm text-white/60 mb-6">You have completed Module 1. Test your skills against our AI technical interviewer.</p>
              <button className="w-full bg-white text-black py-3 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors">
                Start Mock Interview
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
