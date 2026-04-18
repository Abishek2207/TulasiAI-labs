'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import { Brain } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      if (!supabase) {
        router.push('/login')
        return
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error

        if (session?.user) {
          // Check if profile exists
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('user_id', session.user.id)
            .single()

          if (profile?.user_type === 'student') {
            router.push('/student-dashboard')
          } else if (profile?.user_type === 'professional') {
            router.push('/professional-dashboard')
          } else {
            router.push('/onboarding')
          }
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/login')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Authenticating...</h2>
        <p className="text-gray-400">Please wait while we set up your account</p>
        <div className="flex justify-center mt-6 space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
