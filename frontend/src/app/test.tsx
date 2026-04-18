'use client'

import { useState } from 'react'

export default function TestPage() {
  const [message, setMessage] = useState('Loading...')
  const [signupResult, setSignupResult] = useState('')

  const testBackend = async () => {
    try {
      const response = await fetch('http://localhost:8000/')
      const data = await response.json()
      setMessage(`Backend is working: ${data.message}`)
    } catch (error) {
      setMessage(`Backend error: ${error}`)
    }
  }

  const testSignup = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          name: 'Test User',
          experience_level: 'beginner'
        })
      })
      const data = await response.json()
      setSignupResult(`Signup successful! Token: ${data.access_token.substring(0, 20)}...`)
    } catch (error) {
      setSignupResult(`Signup error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">TulasiAI Labs - Test Page</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Backend Connection Test</h2>
          <button 
            onClick={testBackend}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg mr-4"
          >
            Test Backend
          </button>
          <p className="mt-4 text-green-400">{message}</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Signup Test</h2>
          <button 
            onClick={testSignup}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg mr-4"
          >
            Test Signup
          </button>
          <p className="mt-4 text-green-400">{signupResult}</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
          <div className="space-x-4">
            <a href="/" className="text-blue-400 hover:text-blue-300 underline">Home</a>
            <a href="/auth/signup" className="text-blue-400 hover:text-blue-300 underline">Signup</a>
            <a href="/auth/login" className="text-blue-400 hover:text-blue-300 underline">Login</a>
            <a href="/dashboard" className="text-blue-400 hover:text-blue-300 underline">Dashboard</a>
          </div>
        </div>
      </div>
    </div>
  )
}
