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

const DAILY_PLAN = [
  {
    day: 1,
    title: "AI-Augmented Architecture",
    concept: "Traditional Microservices vs. AI-Agentic Orchestration",
    task: "Design a system diagram for a self-healing service.",
    miniProject: "Build a basic LLM wrapper that monitors logs and suggests fixes.",
    aiTool: "Utilize Cursor/Claude-3.5-Sonnet for boilerplate and V0 for UI.",
    softSkill: "Explain your AI-first architecture in 2 lines for a non-technical manager."
  },
  {
    day: 2,
    title: "Prompt Engineering for Engineering Managers",
    concept: "Chain-of-Thought vs. Few-Shot Prompting in Code Reviews",
    task: "Create a system prompt that audits PRs for security vulnerabilities.",
    miniProject: "CLI tool that takes a Git Diff and returns a risk score.",
    aiTool: "OpenAI Playground / Anthropic Console for prompt testing.",
    softSkill: "Write a professional email explaining why a 'manual' QA process is now redundant."
  },
  {
    day: 3,
    title: "Cloud Infrastructure as Code (AI-Assisted)",
    concept: "Terraform/Pulumi optimization using GenAI",
    task: "Generate a production-ready AWS VPC config using AI prompts.",
    miniProject: "Automated cost-optimization script using AI analysis of billing CSV.",
    aiTool: "AWS SageMaker / Bedrock for infrastructure monitoring.",
    softSkill: "Handle a workplace conversation where a colleague feels threatened by AI automation."
  }
]

const CAREER_PATHS = [
  {
    title: 'Senior Software Engineer',
    salaryIndia: '₹18-35 LPA',
    salaryUS: '$120K-$180K',
    growth: '+25%',
    risk: 12,
    skills: ['System Design', 'Leadership', 'Architecture'],
    fit: 92,
    timeline: '1-2 years'
  },
  {
    title: 'Engineering Manager',
    salaryIndia: '₹30-60 LPA',
    salaryUS: '$150K-$220K',
    growth: '+35%',
    risk: 5,
    skills: ['Management', 'Communication', 'Strategy'],
    fit: 75,
    timeline: '2-3 years'
  }
]

export default function ProfessionalDashboard() {
  const [showUS, setShowUS] = useState(false)
  const [activeDay, setActiveDay] = useState(1)
  const currentSalary = 125000 
  
  return (
    <div className="min-h-screen bg-[var(--background)] text-white font-sans pb-20 overflow-x-hidden">
      
      {/* Live Market Ticker */}
      <div className="h-10 bg-black/50 backdrop-blur-md border-b border-white/5 flex items-center overflow-hidden whitespace-nowrap z-[100] fixed top-16 w-full">
        <div className="flex animate-marquee gap-12 text-xs font-mono text-white/40">
          <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" /> Manual QA jobs decreasing in Bengaluru (-12%)</span>
          <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" /> React AI tools demand up 78% this quarter</span>
          <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" /> AWS Bedrock certifications boosting packages by ₹4.5L Avg</span>
          <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" /> Mid-career risk high for Non-AI Architects</span>
        </div>
      </div>
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
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Zap className="w-6 h-6 text-[var(--accent-orange)]" /> Daily Adaptive Path
                </h2>
                <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                  {[1, 2, 3, 4, 5, 6, 7].map(d => (
                    <button 
                      key={d}
                      onClick={() => setActiveDay(d)}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${activeDay === d ? "bg-white text-black" : "text-white/40 hover:bg-white/10"}`}
                    >
                      D{d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass rounded-[2rem] p-8 border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8">
                    <div className="w-16 h-16 rounded-full border-4 border-white/5 border-t-primary animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  <h4 className="text-primary font-bold uppercase tracking-widest text-xs mb-4">Focus of the Day</h4>
                  <h3 className="text-3xl font-bold mb-6">{DAILY_PLAN.find(p => p.day === activeDay)?.title || "Advanced AI Integration"}</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-white/50 text-xs font-semibold uppercase mb-2">Concept</h5>
                      <p className="font-light text-white/80">{DAILY_PLAN.find(p => p.day === activeDay)?.concept || "System Scale with LLMs"}</p>
                    </div>
                    <div>
                      <h5 className="text-white/50 text-xs font-semibold uppercase mb-2">Hands-on Task</h5>
                      <p className="font-light text-white/80">{DAILY_PLAN.find(p => p.day === activeDay)?.task || "Update schema for RAG"}</p>
                    </div>
                    <div className="pt-4 flex gap-4">
                      <button className="flex-1 bg-white text-black py-3 rounded-xl font-bold text-sm hover:scale-[1.02] transition-all">Start Project</button>
                      <button className="w-12 h-12 glass rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/5"><Terminal className="w-5 h-5" /></button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                   <div className="glass p-6 rounded-[1.5rem] border border-white/5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent-blue)]/20 flex items-center justify-center">
                          <Globe className="w-4 h-4 text-[var(--accent-blue)]" />
                        </div>
                        <h4 className="font-bold text-sm">Communication Task</h4>
                      </div>
                      <p className="text-sm text-white/60 font-light italic mb-4">"{DAILY_PLAN.find(p => p.day === activeDay)?.softSkill}"</p>
                      <button className="text-xs font-bold text-primary flex items-center gap-1">Open Editor <ChevronRight className="w-4 h-4" /></button>
                   </div>
                   
                   <div className="glass p-6 rounded-[1.5rem] border border-white/5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent-green)]/20 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-[var(--accent-green)]" />
                        </div>
                        <h4 className="font-bold text-sm">AI Leverage</h4>
                      </div>
                      <p className="text-sm text-white/60 font-light">{DAILY_PLAN.find(p => p.day === activeDay)?.aiTool}</p>
                   </div>
                </div>
              </div>
            </motion.div>

          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="deep-blur rounded-[2rem] p-6 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] translate-x-1/2 -translate-y-1/2" />
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Architect</h3>
                    <p className="text-xs text-white/50">Risk Analysis Engine</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <div className="text-2xl font-bold text-red-400">High</div>
                   <div className="text-[10px] text-white/40 uppercase tracking-tighter">Current Risk Level</div>
                </div>
              </div>

              <div className="relative h-4 bg-white/5 rounded-full overflow-hidden mb-6 border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                />
                <div className="absolute inset-0 flex justify-around items-center px-4">
                  {[1,2,3,4,5].map(i => <div key={i} className="w-px h-1 bg-white/20" />)}
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-5 border border-white/5 mb-6">
                <p className="text-sm text-white/80 leading-relaxed font-light">
                  <span className="text-red-400 font-semibold block mb-1">Reason for High Risk:</span>
                  Your role has <span className="text-white font-medium">85% overlap</span> with current LLM capabilities and you lack cloud-native microservices exposure.
                </p>
              </div>
              <button className="w-full bg-red-500/10 text-red-400 border border-red-500/20 py-4 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 group">
                <Activity className="w-4 h-4 group-hover:scale-110 transition-transform" /> Activate AI Skill Protector
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
