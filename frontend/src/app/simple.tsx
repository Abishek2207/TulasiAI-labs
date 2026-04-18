import Link from 'next/link'
import { ArrowRight, Brain, Target, BarChart3, Flame } from 'lucide-react'

export default function SimpleHome() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4 max-w-5xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            Upgrade Your Career
            <span className="block text-4xl md:text-5xl mt-2 text-blue-400">
              with AI Daily
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Track skills, learn daily, and predict your future job using AI
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700"
            >
              <span className="mr-2">Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="text-gray-500 text-sm">
              No credit card required
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need to accelerate
            </h2>
            <p className="text-gray-400 text-lg">
              AI-powered features designed for modern career growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Prediction</h3>
              <p className="text-gray-400 text-sm">Get personalized career recommendations based on your skills and interests</p>
            </div>

            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Skill Tracking</h3>
              <p className="text-gray-400 text-sm">Monitor progress and identify skill gaps with detailed analytics</p>
            </div>

            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Daily Streak</h3>
              <p className="text-gray-400 text-sm">Build consistent habits with personalized daily tasks</p>
            </div>

            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Job Readiness</h3>
              <p className="text-gray-400 text-sm">Get comprehensive assessment of your readiness for target roles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Test Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Test Your System</h2>
          <div className="bg-gray-900 rounded-2xl p-8">
            <p className="text-gray-400 mb-6">Click the links below to test different parts of the application:</p>
            <div className="space-x-4 space-y-2">
              <a href="/test" className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white">Test Page</a>
              <a href="/auth/signup" className="inline-block bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white">Signup</a>
              <a href="/auth/login" className="inline-block bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white">Login</a>
              <a href="/dashboard" className="inline-block bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg text-white">Dashboard</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
