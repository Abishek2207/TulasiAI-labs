'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useApiStore } from '@/store/apiStore'
import { 
  TrendingUp, 
  Target, 
  Brain, 
  DollarSign,
  Clock,
  Award,
  Lightbulb,
  ArrowRight,
  Star,
  Zap
} from 'lucide-react'

interface CareerInsight {
  type: string
  title: string
  description: string
  actionable: boolean
  priority: string
}

interface SuggestedRole {
  title: string
  match_score: number
  description: string
  required_skills: string[]
  growth_potential: string
}

interface SalaryRange {
  min: number
  max: number
  median: number
  currency: string
}

export function CareerInsights() {
  const [activeTab, setActiveTab] = useState<'roles' | 'insights' | 'salary'>('roles')
  const [isGenerating, setIsGenerating] = useState(false)
  
  const { 
    user, 
    userSkills, 
    careerPrediction, 
    predictCareer 
  } = useApiStore()

  const generateCareerPrediction = async () => {
    setIsGenerating(true)
    try {
      const currentSkills = userSkills.map(skill => skill.name)
      const interests = user?.target_role ? [user.target_role] : ['Technology', 'Growth']
      const currentLevel = user?.experience_level || 'intermediate'
      
      await predictCareer({
        current_skills: currentSkills,
        interests,
        current_level: currentLevel,
        target_roles: user?.target_role ? [user.target_role] : []
      })
    } catch (error) {
      console.error('Failed to generate career prediction:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    if (userSkills.length > 0 && !careerPrediction) {
      generateCareerPrediction()
    }
  }, [userSkills])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength':
        return <Award className="h-4 w-4 text-green-500" />
      case 'weakness':
        return <Target className="h-4 w-4 text-red-500" />
      case 'opportunity':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />
      case 'trend':
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      default:
        return <Brain className="h-4 w-4 text-purple-500" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'strength':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'weakness':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      case 'opportunity':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      case 'trend':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      default:
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
    }
  }

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (!careerPrediction) {
    return (
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            Career Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Generate Your Career Path</h3>
            <p className="text-muted-foreground mb-4">
              Get AI-powered career insights based on your skills and goals
            </p>
            <Button 
              variant="gradient" 
              onClick={generateCareerPrediction}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Career Insights'}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { suggested_roles, insights, salary_range } = careerPrediction

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            Career Insights
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Confidence: {Math.round(careerPrediction.confidence_score * 100)}%
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateCareerPrediction}
              disabled={isGenerating}
            >
              <Zap className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
          {[
            { id: 'roles', label: 'Suggested Roles', icon: Star },
            { id: 'insights', label: 'Insights', icon: Lightbulb },
            { id: 'salary', label: 'Salary Range', icon: DollarSign }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'roles' && (
            <div className="space-y-4">
              {suggested_roles.slice(0, 3).map((role: SuggestedRole, index: number) => (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{role.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm font-medium">
                          {Math.round(role.match_score * 100)}%
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {role.growth_potential} growth
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {role.required_skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {role.required_skills.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                        +{role.required_skills.length - 3} more
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-3">
              {insights.slice(0, 4).map((insight: CareerInsight, index: number) => (
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 border rounded-lg ${getInsightColor(insight.type)}`}
                >
                  <div className="flex items-start space-x-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                      {insight.actionable && (
                        <div className="flex items-center mt-2">
                          <ArrowRight className="h-3 w-3 mr-1" />
                          <span className="text-xs font-medium">Actionable</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        insight.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {insight.priority}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'salary' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-green-600">
                  {formatSalary(salary_range.median)}
                </h3>
                <p className="text-muted-foreground">Median Salary</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Minimum</span>
                  <span className="font-semibold">{formatSalary(salary_range.min)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                    style={{ width: '33%' }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Median</span>
                  <span className="font-semibold">{formatSalary(salary_range.median)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    style={{ width: '50%' }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Maximum</span>
                  <span className="font-semibold">{formatSalary(salary_range.max)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Based on your experience</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Salary estimates are calculated based on your current skills, experience level, and market demand for your target roles.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  )
}
