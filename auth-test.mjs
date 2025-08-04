import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://leznzqfezoofngumpiqf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxlem56cWZlem9vZm5ndW1waXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwOTI0NTUsImV4cCI6MjA1OTY2ODQ1NX0.5I67qAPpITjoBj2WqOm8e0NX78XPw0rEx54DTICnWME'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testLogin() {
  console.log('Testing Supabase login...')
  
  try {
    // Test with a demo user - you can create one in Supabase dashboard
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword123'
    })
    
    if (error) {
      console.error('Login error:', error)
      return
    }
    
    console.log('Login successful:', data)
    
  } catch (err) {
    console.error('Login test failed:', err)
  }
}

// Test connectivity first
async function testConnectivity() {
  try {
    console.log('Testing basic connectivity to Supabase...')
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      console.log('✅ Connectivity test passed')
    } else {
      console.log('❌ Connectivity test failed')
    }
    
  } catch (err) {
    console.error('❌ Network error:', err)
  }
}

testConnectivity().then(() => {
  return testLogin()
})
