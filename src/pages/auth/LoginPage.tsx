/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import AdaptiveBackdrop from '../../components/ui/AdaptiveBackdrop'
import ThemeToggle from '../../components/ui/ThemeToggle'
import { supabase } from '../../lib/supabase'

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Debug: Log the attempt
      console.log('Attempting login with Supabase...')
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
      console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
      
      // Test basic connectivity first
      try {
        const healthCheck = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          }
        })
        console.log('Health check status:', healthCheck.status)
      } catch (healthError) {
        console.error('Health check failed:', healthError)
        throw new Error('Cannot connect to Supabase. Please check your internet connection and try again.')
      }
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })
      
      console.log('Sign in response:', { data, error: signInError })
      
      if (signInError) {
        throw signInError;
      }
      
      if (data?.user) {
        console.log('Login successful, redirecting...')
        // Successful login, redirect to dashboard
        navigate('/dashboard')
      } else {
        throw new Error('Login succeeded but no user data received')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      
      // More specific error messages
      let errorMessage = 'Failed to sign in. Please try again.';
      
      if (err.name === 'AuthRetryableFetchError' || err.message?.includes('Failed to fetch')) {
        errorMessage = 'Network connection failed. Please check your internet connection and try again.';
      } else if (err.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (err.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link.';
      } else if (err.message?.includes('Cannot connect')) {
        errorMessage = err.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <AdaptiveBackdrop animationSpeed="medium" overlay={true}>
      <ThemeToggle />
      <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-white/30 dark:bg-black/20 backdrop-blur-sm sm:px-6 lg:px-8">
        <div className="w-full max-w-md p-8 space-y-8 border shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border-white/50 dark:border-gray-700/50">
          <div>
            <h1 className="mt-6 text-3xl font-extrabold text-center text-gray-900 dark:text-white">
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
              Or{' '}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                create a new account
              </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="relative block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="relative block w-full px-3 py-2 pr-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 mt-4 text-sm text-red-700 rounded-lg bg-red-50 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <button 
                type="button"
                className="font-medium text-blue-600 underline bg-transparent border-none cursor-pointer hover:text-blue-500"
                onClick={() => alert('Password reset functionality will be implemented soon.')}
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </div>
    </div>
    </AdaptiveBackdrop>
  )
}

export default LoginPage