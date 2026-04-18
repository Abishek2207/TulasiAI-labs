'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Layout } from '@/components/layout/Layout'
import { useAuthStore, useCareerStore, useSkillsStore } from '@/store/store'
import { Brain, TrendingUp, DollarSign, Target, BookOpen, Award, Clock, ArrowRight } from 'lucide-react'
import React from 'react'

export default function CareerPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { prediction, predictCareer, history, isLoading, error } = useCareerStore()
  const { skills, fetchSkills, isLoading: skillsLoading } = useSkillsStore()
  
  const [formData, setFormData] = useState({
    current_skills: [] as string[],
    interests: [] as string[],
    current_level: 'intermediate' as const,
    target_roles: [] as string[]
  })

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    fetchSkills(user!.id)
  }, [isAuthenticated, user, router, fetchSkills])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.current_skills.length === 0) {
      alert('Please select at least one skill')
      return
    }
    
    try {
      if (user?.id) {
        await predictCareer(user.id, formData)
      } else {
        throw new Error("User not authenticated")
      }
    } catch (error) {
      console.error('Failed to predict career:', error)
    }
  }

  const handleSkillToggle = (skillName: string) => {
    setFormData(prev => ({
      ...prev,
      current_skills: prev.current_skills.includes(skillName)
        ? prev.current_skills.filter(s => s !== skillName)
        : [...prev.current_skills, skillName]
    }))
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const availableSkills = skills?.map(s => s.skill_name) || []
  const commonInterests = ['Web Development', 'Mobile Development', 'AI/ML', 'Data Science', 'Cloud Computing', 'DevOps', 'Blockchain', 'Game Development']

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    )
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Career Prediction</h1>
            <p className="text-muted-foreground">AI-powered career insights based on your skills</p>
          </div>
        </div>

        {/* Prediction Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Analyze Your Career Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Skills */}
              <div>
                <label className="block text-sm font-medium mb-3">Your Current Skills</label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.length > 0 ? (
                    availableSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          formData.current_skills.includes(skill)
                            ? 'bg-blue-500 text-white'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {skill}
                      </button>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No skills added yet. Add some skills first!</p>
                  )}
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium mb-3">Areas of Interest</label>
                <div className="flex flex-wrap gap-2">
                  {commonInterests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        formData.interests.includes(interest)
                          ? 'bg-purple-500 text-white'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium mb-2">Current Experience Level</label>
                <select
                  value={formData.current_level}
                  onChange={(e) => setFormData({...formData, current_level: e.target.value as any})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <Button type="submit" variant="gradient" className="w-full" disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Generate Career Prediction'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Prediction Results */}
        {prediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Suggested Roles */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Suggested Career Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prediction.suggested_roles.map((role, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{role.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Match:</span>
                          <div className="flex items-center gap-1">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div 
                                className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                style={{ width: `${role.match_score * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{Math.round(role.match_score * 100)}%</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">{role.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-600 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {role.growth_potential} growth
                        </span>
                        <span className="text-blue-600">
                          {role.required_skills.length} required skills
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-1">Required Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {role.required_skills.map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-muted rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Salary Range */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Salary Expectations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    ${prediction.salary_range.min.toLocaleString()} - ${prediction.salary_range.max.toLocaleString()}
                  </div>
                  <p className="text-muted-foreground">Median: ${prediction.salary_range.median.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Based on your skills and experience level
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Learning Roadmap */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Learning Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prediction.roadmap.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{step.title}</h4>
                          <span className="text-sm text-muted-foreground">{step.estimated_time}</span>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">{step.description}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-1 bg-muted rounded">{step.difficulty}</span>
                          <span className="text-muted-foreground">{step.skills_required.length} skills</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skill Gaps */}
            {prediction.skill_gap_analysis.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Skill Gaps to Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {prediction.skill_gap_analysis.map((gap, index) => (
                      <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{gap.skill_name}</h4>
                          <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded">
                            {gap.learning_priority}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{gap.gap_description}</p>
                        <div className="flex items-center gap-2 text-xs mt-1">
                          <span>Current: {gap.current_level || 'None'}</span>
                          <span>Required: {gap.required_level}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Insights */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Career Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prediction.insights.map((insight, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{insight.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded ${
                          insight.priority === 'high' ? 'bg-red-500 text-white' :
                          insight.priority === 'medium' ? 'bg-yellow-500 text-white' :
                          'bg-green-500 text-white'
                        }`}>
                          {insight.priority}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      {insight.actionable && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-blue-600">
                          <ArrowRight className="w-3 h-3" />
                          Actionable
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recommended Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {prediction.next_steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Confidence Score */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Prediction Confidence</h3>
                  <div className="text-4xl font-bold text-blue-600">
                    {Math.round(prediction.confidence_score * 100)}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Based on your current skills and experience
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
