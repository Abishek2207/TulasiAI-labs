'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Layout } from '@/components/layout/Layout'
import { useAuthStore, useSkillsStore } from '@/store/store'
import { Plus, Edit2, Trash2, TrendingUp, Clock, Award } from 'lucide-react'

export default function SkillsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { skills, fetchSkills, createSkill, updateSkill, deleteSkill, isLoading, error } = useSkillsStore()
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSkill, setEditingSkill] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    skill_name: '',
    level: 'beginner' as const,
    proficiency_level: 1,
    hours_practiced: 0,
    category: 'Frontend' as const
  })

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    fetchSkills(user.id)
  }, [isAuthenticated, user, router, fetchSkills])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingSkill) {
        await updateSkill(editingSkill, user.id, formData)
      } else {
        await createSkill(user.id, formData)
      }
      
      // Reset form
      setFormData({
        skill_name: '',
        level: 'beginner',
        proficiency_level: 1,
        hours_practiced: 0,
        category: 'Frontend'
      })
      setShowAddForm(false)
      setEditingSkill(null)
    } catch (error) {
      console.error('Failed to save skill:', error)
    }
  }

  const handleEdit = (skill: any) => {
    setFormData({
      skill_name: skill.skill_name,
      level: skill.level,
      proficiency_level: skill.proficiency_level,
      hours_practiced: skill.hours_practiced,
      category: skill.category
    })
    setEditingSkill(skill.id)
    setShowAddForm(true)
  }

  const handleDelete = async (skillId: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteSkill(skillId, user.id)
      } catch (error) {
        console.error('Failed to delete skill:', error)
      }
    }
  }

  const getLevelColor = (level: string) => {
    const colors = {
      beginner: 'from-green-500 to-emerald-500',
      intermediate: 'from-blue-500 to-cyan-500',
      advanced: 'from-purple-500 to-pink-500',
      expert: 'from-orange-500 to-red-500'
    }
    return colors[level as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Frontend': 'bg-blue-100 text-blue-800',
      'Backend': 'bg-green-100 text-green-800',
      'AI/ML': 'bg-purple-100 text-purple-800',
      'DevOps': 'bg-orange-100 text-orange-800',
      'Cloud': 'bg-cyan-100 text-cyan-800',
      'Mobile': 'bg-pink-100 text-pink-800',
      'Database': 'bg-indigo-100 text-indigo-800',
      'Other': 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Layout>
      <div className="pt-20 px-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Skills <span className="text-zinc-400">Management</span>
              </h1>
              <p className="text-zinc-400 text-lg">Track and improve your technical expertise</p>
            </div>
            <Button 
              variant="gradient" 
              className="gap-2 px-6 py-3"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-5 h-5" />
              Add Skill
            </Button>
          </div>
        </motion.div>

        {/* Add/Edit Skill Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-white">
                  {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Skill Name</label>
                      <input
                        type="text"
                        value={formData.skill_name}
                        onChange={(e) => setFormData({...formData, skill_name: e.target.value})}
                        className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                        placeholder="e.g., React, Python, AWS"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                        className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                      >
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="AI/ML">AI/ML</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Cloud">Cloud</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Database">Database</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Level</label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({...formData, level: e.target.value as any})}
                        className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Proficiency (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.proficiency_level}
                        onChange={(e) => setFormData({...formData, proficiency_level: parseInt(e.target.value)})}
                        className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Hours Practiced</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={formData.hours_practiced}
                        onChange={(e) => setFormData({...formData, hours_practiced: parseFloat(e.target.value)})}
                        className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" variant="gradient" className="px-6">
                      {editingSkill ? 'Update Skill' : 'Add Skill'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false)
                        setEditingSkill(null)
                        setFormData({
                          skill_name: '',
                          level: 'beginner',
                          proficiency_level: 1,
                          hours_practiced: 0,
                          category: 'Frontend'
                        })
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Skills Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-zinc-800/50 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : skills && skills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Card className="border-0 bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50 hover:bg-zinc-900/70 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{skill.skill_name}</h3>
                        <span className={`inline-block px-3 py-1 text-xs rounded-full ${getCategoryColor(skill.category)}`}>
                          {skill.category}
                        </span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(skill)}
                          className="border-zinc-700 hover:bg-zinc-800"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(skill.id)}
                          className="border-zinc-700 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-zinc-400">Level</span>
                          <span className="text-sm font-medium text-white capitalize">{skill.level}</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2">
                          <motion.div 
                            className={`h-2 rounded-full bg-gradient-to-r ${getLevelColor(skill.level)}`}
                            style={{ width: `${(skill.proficiency_level / 10) * 100}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(skill.proficiency_level / 10) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                          ></motion.div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-zinc-300">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span>Level {skill.proficiency_level}/10</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-300">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span>{skill.hours_practiced}h</span>
                        </div>
                      </div>
                      
                      {skill.last_practiced && (
                        <div className="text-xs text-zinc-500">
                          Last practiced: {new Date(skill.last_practiced).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-0 bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50">
              <CardContent className="p-16 text-center">
                <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-10 h-10 text-zinc-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">No skills yet</h3>
                <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                  Start tracking your technical skills to monitor your progress and get personalized career insights.
                </p>
                <Button 
                  variant="gradient"
                  onClick={() => setShowAddForm(true)}
                  className="px-8"
                >
                  Add Your First Skill
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
