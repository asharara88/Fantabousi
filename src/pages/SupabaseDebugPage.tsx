import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  message: string
  details?: any
}

const SupabaseDebugPage: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const updateTest = (name: string, status: TestResult['status'], message: string, details?: any) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name)
      if (existing) {
        existing.status = status
        existing.message = message
        existing.details = details
        return [...prev]
      }
      return [...prev, { name, status, message, details }]
    })
  }

  const runTest = async (name: string, testFn: () => Promise<void>) => {
    updateTest(name, 'pending', 'Running...')
    try {
      await testFn()
      updateTest(name, 'success', 'Passed')
    } catch (error: any) {
      updateTest(name, 'error', error.message, error)
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTests([])

    // Test 1: Environment Variables
    await runTest('Environment Variables', async () => {
      const url = import.meta.env.VITE_SUPABASE_URL
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (!url) throw new Error('VITE_SUPABASE_URL not set')
      if (!key) throw new Error('VITE_SUPABASE_ANON_KEY not set')
      
      updateTest('Environment Variables', 'success', `URL: ${url.substring(0, 30)}...`)
    })

    // Test 2: Basic Connectivity
    await runTest('Basic Connectivity', async () => {
      const response = await fetch(import.meta.env.VITE_SUPABASE_URL)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    })

    // Test 3: API Endpoint
    await runTest('API Endpoint', async () => {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      })
      
      if (!response.ok) {
        const text = await response.text()
        throw new Error(`API Error ${response.status}: ${text}`)
      }
    })

    // Test 4: Auth Session
    await runTest('Auth Session Check', async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      
      updateTest('Auth Session Check', 'success', 
        data.session ? 'User logged in' : 'No active session')
    })

    // Test 5: Database Query
    await runTest('Database Query', async () => {
      const { error } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true })
      
      if (error) throw error
      updateTest('Database Query', 'success', `Profiles table accessible`)
    })

    // Test 6: Test User Creation
    await runTest('Test User Auth', async () => {
      // Try to sign up a test user
      const testEmail = `test-${Date.now()}@biowell.com`
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'TestPassword123!'
      })
      
      if (error && !error.message.includes('already registered')) {
        throw error
      }
      
      updateTest('Test User Auth', 'success', 
        data.user ? 'Auth system working' : 'Signup may require email confirmation')
    })

    setIsRunning(false)
  }

  useEffect(() => {
    runAllTests()
  }, [])

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'success': return '✅'
      case 'error': return '❌'
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600'
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Supabase Connection Diagnostics
            </h1>
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? 'Running Tests...' : 'Rerun Tests'}
            </Button>
          </div>

          <div className="space-y-4">
            {tests.map((test) => (
              <div 
                key={test.name}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{getStatusIcon(test.status)}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {test.name}
                  </h3>
                </div>
                <p className={`text-sm ${getStatusColor(test.status)}`}>
                  {test.message}
                </p>
                {test.details && test.status === 'error' && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-500 cursor-pointer">
                      Show Error Details
                    </summary>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded mt-2 overflow-auto">
                      {JSON.stringify(test.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>

          {tests.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Troubleshooting Tips:
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• If basic connectivity fails, check your internet connection</li>
                <li>• If API endpoint fails, verify your Supabase URL and keys</li>
                <li>• If auth fails, check if email confirmation is required</li>
                <li>• Try accessing the login page in an incognito/private window</li>
                <li>• Check browser console for additional error details</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SupabaseDebugPage
