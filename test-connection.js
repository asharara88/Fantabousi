import { supabase } from './src/lib/supabase.ts'

// Test Supabase connectivity
async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test 1: Basic connection
    console.log('URL:', process.env.VITE_SUPABASE_URL || 'Not set')
    console.log('Key present:', !!(process.env.VITE_SUPABASE_ANON_KEY))
    
    // Test 2: Health check
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('Connection test failed:', error)
      return false
    }
    
    console.log('✅ Supabase connection successful')
    return true
    
  } catch (err) {
    console.error('❌ Supabase connection failed:', err)
    return false
  }
}

// Test auth status
async function testAuthStatus() {
  try {
    console.log('Testing auth status...')
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Auth test failed:', error)
      return false
    }
    
    console.log('Auth status:', data.session ? 'Logged in' : 'Not logged in')
    console.log('Session data:', data.session)
    return true
    
  } catch (err) {
    console.error('Auth status check failed:', err)
    return false
  }
}

// Run tests
testSupabaseConnection().then(() => {
  testAuthStatus()
})
