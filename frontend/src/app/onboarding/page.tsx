'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronRight, ArrowLeft, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/store'
import { supabase } from '@/lib/supabase-client'

type PathType = 'student' | 'professional' | null

const QUESTIONS = [
  {
    id: 'path',
    title: "Are you currently employed in a company?",
    options: [
      { label: "No, I am a Student / Fresher preparing for placements", value: "student" },
      { label: "Yes, I am a Working Professional seeking career growth", value: "professional" }
    ]
  },
  {
    id: 'current_role',
    title: "What is your current domain or field of work?",
    isInput: true,
    placeholder: "e.g., Software Engineer, Data Analyst",
    condition: (state: any) => state.path === 'professional'
  },
  {
    id: 'organization',
    title: "Which company are you currently working for?",
    isInput: true,
    placeholder: "e.g., Google, TCS, Startup Frameworks",
    condition: (state: any) => state.path === 'professional'
  },
  {
    id: 'industry',
    title: "What industry does your company belong to?",
    isInput: true,
    placeholder: "e.g., FinTech, E-commerce, Healthcare",
    condition: (state: any) => state.path === 'professional'
  },
  {
    id: 'experience',
    title: "How many years of professional experience do you possess?",
    options: [
      { label: "Less than 1 year", value: "0-1" },
      { label: "1 to 3 years", value: "1-3" },
      { label: "3 to 5 years", value: "3-5" },
      { label: "Over 5 years", value: "5+" }
    ],
    condition: (state: any) => state.path === 'professional'
  },
  {
    id: 'current_skills',
    title: "List a few of your top technical skills right now.",
    isInput: true,
    placeholder: "e.g., React, Python, AWS, SQL",
    condition: (state: any) => state.path === 'professional'
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [inputValue, setInputValue] = useState("")
  const [isFinishing, setIsFinishing] = useState(false)

  const activeQuestions = QUESTIONS.filter(q => (q.condition ? q.condition(answers) : true))
  const currentQuestion = activeQuestions[currentStepIndex]
  const progress = ((currentStepIndex + 1) / activeQuestions.length) * 100

  const handleNext = async (value: string) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(updatedAnswers)
    
    if (currentStepIndex === activeQuestions.length - 1) {
      await finishOnboarding(updatedAnswers)
    } else {
      setInputValue("")
      setCurrentStepIndex(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
      const prevQuestion = activeQuestions[currentStepIndex - 1]
      setInputValue(answers[prevQuestion.id] || "")
    }
  }

  const finishOnboarding = async (finalAnswers: any) => {
    setIsFinishing(true)
    const userType = finalAnswers.path as PathType
    
    if (user) {
      if (supabase) {
        const { error } = await supabase
          .from('profiles')
          .update({ user_type: userType })
          .eq('user_id', user.id)
        
        if (error && !error.message.includes('not configured')) {
          console.error('Error updating profile:', error)
        }
      }
    }

    setTimeout(() => {
      if (userType === 'student') {
        router.push('/student-dashboard')
      } else {
        router.push('/professional-dashboard')
      }
    }, 1200)
  }

  const slideVariants = {
    enter: { opacity: 0, scale: 0.95, filter: "blur(10px)", y: 20 },
    center: { opacity: 1, scale: 1, filter: "blur(0px)", y: 0 },
    exit: { opacity: 0, scale: 1.05, filter: "blur(10px)", y: -20 }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-white overflow-hidden flex flex-col items-center justify-center relative">
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-primary/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[var(--accent-blue)]/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="absolute top-0 w-full p-8 flex justify-between items-center z-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="w-6 h-6 object-contain" />
          </div>
          <span className="font-semibold text-white/50 tracking-wide text-sm">OS / INITIALIZE</span>
        </div>
        
        <div className="w-1/3 max-w-[200px] hidden md:block">
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)]" 
              initial={{ width: 0 }}
              animate={{ width: progress + "%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        <div>
          <button 
            onClick={() => router.push('/')}
            className="text-white/40 hover:text-white transition-colors text-sm font-medium tracking-wide"
          >
            CANCEL SETUP
          </button>
        </div>
      </div>

      {currentStepIndex > 0 && !isFinishing && (
        <button 
          onClick={handleBack}
          className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors z-50 text-white/50 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      <div className="w-full max-w-2xl px-6 relative z-10 min-h-[400px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isFinishing ? (
            <motion.div
              key="finishing"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center w-full"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl glass flex items-center justify-center mb-8 border border-primary/20 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Personalizing your workspace...
              </h2>
              <p className="text-white/50 font-light text-lg">
                Training models based on your responses.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={currentQuestion.id}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex-col relative"
            >
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] mb-12 text-center md:text-left drop-shadow-sm">
                {currentQuestion.title}
              </h2>

              {currentQuestion.isInput ? (
                <div className="flex flex-col gap-6">
                  <input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-6 text-xl md:text-2xl outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all backdrop-blur-md placeholder:text-white/20"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && inputValue.trim().length > 0) {
                        handleNext(inputValue)
                      }
                    }}
                  />
                  <div className="flex justify-end">
                    <button 
                      onClick={() => handleNext(inputValue)}
                      disabled={inputValue.trim().length === 0}
                      className="bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                      Continue <ChevronRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {currentQuestion.options?.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleNext(opt.value)}
                      className="group flex items-center justify-between w-full text-left bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-6 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                    >
                      <span className="text-xl md:text-2xl font-light text-white/90 group-hover:text-white transition-colors">
                        {opt.label}
                      </span>
                      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="absolute bottom-0 w-full md:hidden h-1 bg-white/10">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary to-[var(--accent-blue)]" 
          initial={{ width: 0 }}
          animate={{ width: progress + "%" }}
        />
      </div>
    </div>
  )
}
