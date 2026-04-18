'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import { 
  Briefcase, 
  TrendingUp, 
  Award, 
  DollarSign,
  Target,
  Sparkles,
  ArrowRight,
  Plus,
  ExternalLink,
  Zap,
  BarChart3,
  Globe,
  ChevronRight,
  Terminal,
  Activity,
  Search,
  CheckCircle2,
  Clock
} from 'lucide-react'

const ALL_CERTS = [
  { title: 'Google Cloud Professional Data Engineer', issuer: 'Google', link: 'https://grow.google/certificates/', badge: '🏆', tag: 'Cloud', difficulty: 'Advanced', salaryBoost: '+28%' },
  { title: 'AWS Certified Machine Learning', issuer: 'Amazon', link: 'https://aws.amazon.com/certification/', badge: '🤖', tag: 'AI/ML', difficulty: 'Advanced', salaryBoost: '+35%' },
  { title: 'Certified Kubernetes Administrator', issuer: 'CNCF', link: 'https://training.linuxfoundation.org/certification/', badge: '🚀', tag: 'DevOps', difficulty: 'Advanced', salaryBoost: '+27%' },
  { title: 'Azure Solutions Architect Expert', issuer: 'Microsoft', link: 'https://learn.microsoft.com/en-us/credentials/', badge: '🔷', tag: 'Cloud', difficulty: 'Advanced', salaryBoost: '+30%' }
]

const TRENDING = [
  { skill: 'Generative AI / LLMs', demand: 'high', growth: 78, category: 'AI/ML' },
  { skill: 'Cloud Architecture', demand: 'high', growth: 45, category: 'Cloud' },
  { skill: 'Kubernetes & DevOps', demand: 'high', growth: 38, category: 'DevOps' },
  { skill: 'Data Engineering', demand: 'high', growth: 42, category: 'Data' }
]

const CAREER_PATHS = [
  {
    title: 'Senior Software Engineer',
    salaryIndia: '₹18-35 LPA',
    salaryUS: '$120K-$180K',
    growth: '+25%',
    skills: ['System Design', 'Leadership', 'Architecture'],
    fit: 92,
    timeline: '1-2 years'
  },
  {
    title: 'Engineering Manager',
    salaryIndia: '₹30-60 LPA',
    salaryUS: '$150K-$220K',
    growth: '+35%',
    skills: ['Management', 'Communication', 'Strategy'],
    fit: 75,
    timeline: '2-3 years'
  },
  {
    title: 'AI/ML Engineer',
    salaryIndia: '₹20-45 LPA',
    salaryUS: '$130K-$200K',
    growth: '+55%',
    skills: ['Python', 'TensorFlow', 'MLOps'],
    fit: 68,
    timeline: '6-12 months'
  }
]

export default function ProfessionalDashboard() {
  const [showUS, setShowUS] = useState(false)
  const currentSalary = 125000 
  
  return (
    <div className="min-h-screen bg-[var(--background)] text-white font-sans pb-20">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center space-x-2 bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] px-3 py-1 rounded-full text-sm font-semibold mb-4 border border-[var(--accent-blue)]/20">
              <Activity className="w-4 h-4" /> Market Data Synchronized
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
              Career Intelligence
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white/50 text-lg max-w-xl font-light">
              Predictive models indicate your trajectory is strong. Focus on expanding System Design skills to hit the next compensation band.
            </motion.p>
          </div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-xl p-1.5 flex items-center gap-1 shadow-lg border border-white/5">
            <button 
              onClick={() => setShowUS(false)}
              className={"px-6 py-2.5 rounded-lg text-sm font-semibold transition-all " + (!showUS ? "bg-white text-black shadow-sm" : "text-white/50 hover:text-white")}
            >
              India (₹)
            </button>
            <button 
              onClick={() => setShowUS(true)}
              className={"px-6 py-2.5 rounded-lg text-sm font-semibold transition-all " + (showUS ? "bg-white text-black shadow-sm" : "text-white/50 hover:text-white")}
            >
              Global ($)
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[2rem] p-8 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="text-white/50 font-medium mb-1">Projected Salary Growth</h3>
                  <div className="text-4xl md:text-5xl font-bold tracking-tight flex items-center gap-4">
                    {showUS ? "$" + ((currentSalary * 1.45).toLocaleString()) : "₹" + (Math.floor(currentSalary * 1.45 * 83).toLocaleString())}
                    <span className="text-lg bg-[var(--accent-green)]/10 text-[var(--accent-green)] px-3 py-1 rounded-full border border-[var(--accent-green)]/20 font-semibold flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" /> +45% in 2 Yrs
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-[var(--accent-blue)]" />
                </div>
              </div>
              
              <div className="h-64 relative flex items-end justify-between border-b border-white/5 pb-2">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradientPrefix" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M 0 180 Q 100 150 200 120 T 400 90 T 600 50 L 600 300 L 0 300 Z"
                    fill="url(#gradientPrefix)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  />
                  <motion.path
                    d="M 0 180 Q 100 150 200 120 T 400 90 T 600 50"
                    fill="none"
                    stroke="var(--accent-blue)"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                {['Current', '+6 Mo', '+12 Mo', '+18 Mo', '+24 Mo'].map((label, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center flex-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mb-2 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    <span className="text-xs text-white/40">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" /> Career Acceleration Paths
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {CAREER_PATHS.slice(0, 2).map((path, idx) => (
                  <div key={idx} className="glass glass-hover rounded-[1.5rem] p-6 border border-white/5 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-xs font-semibold text-primary mb-2 flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> {path.fit}% Skill Match
                        </div>
                        <h3 className="text-xl font-bold">{path.title}</h3>
                      </div>
                      <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                        <Briefcase className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    
                    <div className="text-2xl font-mono mb-4 text-white/90">
                      {showUS ? path.salaryUS : path.salaryIndia}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {path.skills.map(s => (
                        <span key={s} className="text-xs bg-white/5 px-2 py-1 rounded-md border border-white/10 text-white/70">{s}</span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-sm text-white/40 flex items-center"><Clock className="w-4 h-4 mr-1" /> {path.timeline} transition</span>
                      <button className="text-sm font-semibold text-white/50 group-hover:text-white transition-colors flex items-center">
                        View Gap <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="deep-blur rounded-[2rem] p-6 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] translate-x-1/2 -translate-y-1/2" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Architect</h3>
                  <p className="text-xs text-white/50">Live Intelligence</p>
                </div>
              </div>

              <div className="bg-black/40 rounded-2xl p-4 border border-white/5 mb-4">
                <p className="text-sm text-white/80 leading-relaxed font-light">
                  <span className="text-red-400 font-semibold">Layoff Risk Alert:</span> Your current stack lacks Generative AI integration, which increases redundancy risk. 
                  Mastering <strong className="text-white">AI Tools & LLMs</strong> could drop your layoff risk to <strong className="text-[var(--accent-green)]">near 0%</strong> and secure a premium band.
                </p>
              </div>
              <button className="w-full bg-red-500/10 text-red-400 border border-red-500/20 py-3 rounded-full text-sm font-semibold hover:bg-red-500/20 transition-all flex items-center justify-center">
                Activate AI Skill Protector
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass rounded-[2rem] p-6 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold flex items-center gap-2 text-white/80">
                  <Zap className="w-5 h-5 text-[var(--accent-orange)]" /> Market Signals
                </h3>
              </div>
              <div className="space-y-4">
                {TRENDING.slice(0, 4).map((skill, idx) => (
                  <div key={idx} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white/90 group-hover:text-primary transition-colors">{skill.skill}</span>
                      <span className="text-xs text-white/40">{skill.category}</span>
                    </div>
                    <div className="text-[var(--accent-green)] text-xs font-mono font-medium flex items-center bg-[var(--accent-green)]/10 px-2 py-1 rounded-sm">
                      +{skill.growth}%
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass rounded-[2rem] p-6 border border-white/5">
              <h3 className="font-semibold flex items-center gap-2 text-white/80 mb-6">
                <Award className="w-5 h-5 text-[var(--accent-blue)]" /> High-ROI Credentials
              </h3>
              <div className="space-y-4">
                {ALL_CERTS.slice(0, 3).map((cert, idx) => (
                  <a key={idx} href={cert.link} target="_blank" rel="noopener noreferrer" className="block group p-3 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-medium text-white/90 group-hover:text-white leading-tight pr-4">{cert.title}</h4>
                      <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-primary flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/50">
                      <span>{cert.issuer}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-[var(--accent-green)]">{cert.salaryBoost} Value</span>
                    </div>
                  </a>
                ))}
              </div>
              <button className="w-full mt-4 py-3 rounded-xl border border-white/10 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all text-center">
                View All Recommendations
              </button>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  )
}
