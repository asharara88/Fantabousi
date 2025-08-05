/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { GlassCard, GlassButton, GlassInput } from '../../components/ui/GlassComponents'
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
        <GlassCard variant="frosted" className="w-full max-w-md p-8 space-y-8">
          <div>
            <h1 className="mt-6 text-3xl font-extrabold text-center text-text">
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-center text-text-light">
              Or{' '}
              <Link
                to="/signup"
                className="font-medium text-primary hover:text-primary-dark transition-colors"
              >
                create a new account
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <GlassInput
                label="Email address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleChange(e)}
                variant="glass"
              />
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-light mb-2">
                  Password
                </label>
                <div className="relative">
                  <GlassInput
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleChange(e)}
                    variant="glass"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-text-light hover:text-text transition-colors" />
                    ) : (
                      <Eye className="w-4 h-4 text-text-light hover:text-text transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 mt-4 text-sm text-error rounded-lg bg-error/10 border border-error/20">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="remember-me" className="block ml-2 text-sm text-text">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button 
                  type="button"
                  className="font-medium text-primary underline bg-transparent border-none cursor-pointer hover:text-primary-dark transition-colors"
                  onClick={() => alert('Password reset functionality will be implemented soon.')}
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            <div>
              <GlassButton
                type="submit"
                disabled={isLoading}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </AdaptiveBackdrop>
  )
}

export default LoginPage