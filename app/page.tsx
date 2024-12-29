'use client'

import React, { useState, useEffect } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

function ResetPassword() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Supabase credentials are not set')
        }

        const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
        setSupabase(supabaseClient)

        // Get the hash fragment from the URL
        const hash = window.location.hash
        if (hash) {
          const params = new URLSearchParams(hash.substring(1))
          const access_token = params.get('access_token')

          if (access_token) {
            // Set session with just the access token
            const { error } = await supabaseClient.auth.setSession({
              access_token,
              refresh_token: access_token // Use access_token as refresh_token instead of null
            })
            
            if (error) {
              throw error
            }
            
            console.log('Session set successfully')
          }
        }

      } catch (error) {
        console.error('Error initializing Supabase client:', error)
        setError(error instanceof Error ? error.message : 'Failed to initialize Supabase client')
      }
    }

    initializeSupabase()
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!supabase) {
      setError('Supabase client not initialized')
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    try {
      const { data, error } = await supabase.auth.updateUser({ password })
      
      if (error) throw error

      setMessage('Password updated successfully')
      // Redirect to your app's login page after successful password reset
      setTimeout(() => {
        window.location.href = 'com.theprepperapp://login'
      }, 3000)
    } catch (error) {
      console.error('Password reset error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8 border-2 border-yellow-400">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-2 border-yellow-400">
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
              >
                Reset Password
              </button>
            </div>
          </form>

          {message && (
            <div className="mt-4 text-sm text-green-600">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword