'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Target, Clock, Shield, BarChart3, Layers, Compass, Brain, CheckCircle2, GraduationCap } from 'lucide-react'

// WebGL must be dynamically loaded in Next.js to prevent SSR hydration errors
const Experience = dynamic(() => import('@/components/3d/Experience'), { ssr: false })

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[var(--background)] text-white overflow-x-hidden font-sans">
      
      {/* 3D WebGL Background Layer */}
      <Experience />

      {/* Navigation (Fixed above 3D layer) */}
      <nav className="fixed top-0 w-full z-50 glass border-b-0 border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-2xl overflow-hidden bg-white/5 flex items-center justify-center border border-white/10 transition-transform duration-300">
                <Image src="/logo.png" alt="TulasiAI Labs" width={40} height={40} className="w-10 h-10 object-contain drop-shadow-lg" />
              </div>
              <span className="text-xl font-semibold tracking-tight">TulasiAI Labs</span>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link 
                href="/onboarding" 
                className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/90 transition-all shadow-[0_4px_20px_-4px_rgba(255,255,255,0.3)]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* DOM Flow Overlays */}
      <div className="relative z-10">

        {/* Hero Section */}
        <section className="min-h-[100vh] flex items-center justify-center px-4 pt-24 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center">
              <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
                <Compass className="w-4 h-4 text-white/50" />
                <span className="text-sm font-medium text-white/70">Intelligent Progression Engine</span>
              </div>
            </div>

            <h1 className="text-6xl md:text-[6.5rem] font-bold tracking-tighter leading-[1.05] mb-8 drop-shadow-lg mix-blend-plus-lighter">
              Build Your Career.<br/>
              <span className="text-white/60">One Day at a Time.</span>
            </h1>

            <p className="text-xl md:text-2xl font-light text-white/50 mb-12 max-w-2xl mx-auto tracking-tight leading-relaxed">
              A structured learning system designed for students and professionals to stay relevant in a rapidly evolving tech world.
            </p>

            <div className="flex justify-center">
              <Link 
                href="/onboarding" 
                className="group relative inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-5px_rgba(255,255,255,0.5)]"
              >
                <span>Initialize Sequence</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 1: The Problem (Realistic) */}
        <section className="py-40 px-4 bg-gradient-to-b from-transparent via-[#020617]/90 to-[#020617]">
          <div className="max-w-5xl mx-auto relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">The Challenge</h2>
              <p className="text-xl text-white/50 font-light">Why career growth stalls.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass p-8 rounded-3xl border border-white/5 hover:bg-white/[0.08] transition-colors duration-500">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 mb-6">
                  <Layers className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Unstructured Prep</h3>
                <p className="text-white/60 leading-relaxed font-light">Students face fragmented resources with zero clear direction towards placement standards.</p>
              </div>
              <div className="glass p-8 rounded-3xl border border-white/5 hover:bg-white/[0.08] transition-colors duration-500">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 mb-6">
                  <Clock className="w-6 h-6 text-[var(--accent-orange)]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Rapid Evolution</h3>
                <p className="text-white/60 leading-relaxed font-light">Professionals fall behind as AI and tooling advance faster than traditional upskilling methods.</p>
              </div>
              <div className="glass p-8 rounded-3xl border border-white/5 hover:bg-white/[0.08] transition-colors duration-500">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 mb-6">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Zero Personalization</h3>
                <p className="text-white/60 leading-relaxed font-light">Existing platforms offer static courses that fail to adapt to your specific micro-skill gaps.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Solution Architecture */}
        <section className="py-40 px-4 bg-[#020617]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">A Clear Path Forward</h2>
              <p className="text-xl text-white/50 font-light leading-relaxed mb-8">
                We replace guesswork with a daily structured roadmap, AI-based skill suggestions, and an experience completely tailored to your career stage.
              </p>
              <div className="space-y-6">
                {[
                  "Choose your career stage.",
                  "Get a personalized roadmap.",
                  "Learn daily with consistency tracking."
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center gap-4 border border-white/5 bg-white/[0.02] p-4 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                      0{idx + 1}
                    </div>
                    <p className="text-white/80 font-medium">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2">
              {/* Abstract Glass Block simulating a Roadmap */}
              <div className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[60px] translate-x-1/2 -translate-y-1/2" />
                <div className="space-y-4 relative z-10">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={"flex items-center gap-4 p-4 rounded-xl border " + (i === 1 ? "bg-primary/10 border-primary/20" : "bg-white/5 border-transparent")}>
                      <div className={"w-10 h-10 rounded-full flex items-center justify-center border-2 " + (i === 1 ? "border-primary text-primary" : "border-white/20 text-white/40")}>
                        {i === 1 ? "✓" : i}
                      </div>
                      <div className="flex-1">
                        <div className={"h-2 rounded-full mb-2 " + (i === 1 ? "w-full bg-primary" : "w-2/3 bg-white/20")} />
                        <div className={"h-2 w-1/3 rounded-full " + (i === 1 ? "bg-primary/50" : "bg-white/10")} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dual Dashboards Section */}
        <section className="py-40 px-4 bg-[#020617] border-t border-white/5">
          <div className="max-w-6xl mx-auto space-y-40">
            
            {/* For Students */}
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="w-full md:w-1/2">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-8">
                  <GraduationCap className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">For Students</h2>
                <p className="text-xl text-white/50 font-light mb-8">Maintain momentum and eliminate tutorial hell.</p>
                <div className="space-y-6 text-lg text-white/70">
                  <div className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-blue-400 mr-4 flex-shrink-0 mt-0.5" />
                    <p><strong>Placement Roadmap:</strong> Step-by-step guidance covering core concepts, aptitude, and DSA.</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-blue-400 mr-4 flex-shrink-0 mt-0.5" />
                    <p><strong>Structured Learning:</strong> Content broken down into manageable daily blocks.</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-blue-400 mr-4 flex-shrink-0 mt-0.5" />
                    <p><strong>Activity Metrics:</strong> Maintain consistency through streak tracking and simulated assessments.</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="glass p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-br from-blue-500/5 to-transparent">
                   <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                     <div className="h-4 w-32 bg-white/20 rounded-full" />
                     <div className="h-4 w-12 bg-blue-400/50 rounded-full" />
                   </div>
                   <div className="flex gap-2">
                     {Array.from({length: 7}).map((_, i) => (
                       <div key={i} className="flex-1 aspect-square rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/30 font-mono">
                         {i < 4 ? "✓" : "-"}
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>

            {/* For Professionals */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-16">
              <div className="w-full md:w-1/2">
                <div className="w-16 h-16 rounded-2xl bg-[var(--accent-green)]/10 flex items-center justify-center border border-[var(--accent-green)]/20 mb-8">
                  <BarChart3 className="w-8 h-8 text-[var(--accent-green)]" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">For Professionals</h2>
                <p className="text-xl text-white/50 font-light mb-8">Data-driven trajectory calculation.</p>
                <div className="space-y-6 text-lg text-white/70">
                  <div className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-[var(--accent-green)] mr-4 flex-shrink-0 mt-0.5" />
                    <p><strong>Skill Upgrade Paths:</strong> Bridge the massive gap between your current role and your next promotion.</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-[var(--accent-green)] mr-4 flex-shrink-0 mt-0.5" />
                    <p><strong>Trending Technologies:</strong> Real-time mapping of high-demand skills in the current job market.</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-[var(--accent-green)] mr-4 flex-shrink-0 mt-0.5" />
                    <p><strong>Career Insights:</strong> Understand the exact prerequisites of your target domain.</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="glass p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-tr from-[var(--accent-green)]/5 to-transparent">
                  <div className="flex items-end justify-between h-40 gap-3 border-b border-white/10 pb-2">
                    {[30, 45, 60, 50, 70, 85].map((h, i) => (
                      <div key={i} className="w-full bg-white/10 rounded-t-lg relative overflow-hidden transition-all hover:bg-white/20" style={{ height: h + "%" }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent-green)]/40 to-transparent" />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4">
                    <div className="h-2 w-16 bg-white/20 rounded-full" />
                    <div className="h-2 w-16 bg-[var(--accent-green)]/50 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* AI Features */}
        <section className="py-40 px-4 bg-[#020617] border-t border-white/5 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-8 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
              <Brain className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Objectively Intelligent</h2>
            <p className="text-xl text-white/50 mb-16 font-light max-w-2xl mx-auto">
              Our engines focus purely on actionable, data-backed intelligence without the noise.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="glass p-8 rounded-3xl border border-white/5">
                <Shield className="w-6 h-6 text-white/60 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Gap Identification</h3>
                <p className="text-white/50 text-sm">Analyze the exact delta between your current capabilities and target role requirements.</p>
              </div>
              <div className="glass p-8 rounded-3xl border border-white/5">
                <Layers className="w-6 h-6 text-white/60 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Curated Directives</h3>
                <p className="text-white/50 text-sm">Receive concepts mathematically engineered to close highly specific knowledge gaps.</p>
              </div>
              <div className="glass p-8 rounded-3xl border border-white/5">
                <BarChart3 className="w-6 h-6 text-white/60 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Market Awareness</h3>
                <p className="text-white/50 text-sm">Stay alerted to sweeping changes in corporate tooling, languages, and frameworks.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final Assurance */}
        <section className="py-40 px-4 bg-black border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
              A Platform Built on Reality
            </h2>
            <div className="inline-block glass px-6 py-2 rounded-full border border-white/10 mb-8">
              <p className="text-white/60 text-sm font-semibold tracking-widest uppercase">
                Zero fake metrics. Absolute clarity.
              </p>
            </div>
            <p className="text-xl text-white/50 font-light leading-relaxed max-w-2xl mx-auto mb-16">
              Your career is serious. The environments you use to build it should be serious, too. TulasiAI focuses entirely on structurally sound progression, honest skill assessment, and realistic alignment. No gamified bloat—just results.
            </p>
            <Link 
              href="/onboarding" 
              className="inline-flex items-center justify-center bg-white text-black px-12 py-4 rounded-full text-lg font-medium hover:scale-105 transition-all shadow-xl"
            >
              <span>Initialize Workflow</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/5 text-center bg-black">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Image src="/logo.png" alt="Logo" width={24} height={24} className="opacity-50" />
            <span className="font-semibold tracking-tight text-white/50">TulasiAI Labs</span>
          </div>
          <p className="text-xs text-white/30 tracking-wide font-mono">
            © {new Date().getFullYear()} TULASIAI LABS.
          </p>
        </footer>

      </div>
    </div>
  )
}
