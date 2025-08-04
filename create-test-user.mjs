import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://leznzqfezoofngumpiqf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxlem56cWZlem9vZm5ndW1waXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwOTI0NTUsImV4cCI6MjA1OTY2ODQ1NX0.5I67qAPpITjoBj2WqOm8e0NX78XPw0rEx54DTICnWME'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createTestUser() {
  console.log('Creating test user...')
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'test@biowell.com',
      password: 'TestPassword123!',
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User'
        }
      }
    })
    
    if (error) {
      console.error('Failed to create test user:', error)
      return
    }
    
    console.log('✅ Test user created successfully:', data)
    console.log('📧 Check email for confirmation link if email confirmation is enabled')
    
    // Try to sign in immediately (might fail if email confirmation required)
    console.log('\nTesting immediate sign-in...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'test@biowell.com',
      password: 'TestPassword123!'
    })
    
    if (signInError) {
      console.log('❌ Sign-in failed (expected if email confirmation required):', signInError.message)
    } else {
      console.log('✅ Sign-in successful:', signInData)
    }
    
  } catch (err) {
    console.error('Error during test user creation:', err)
  }
}

async function testExistingUser() {
  console.log('\nTesting sign-in with existing user...')
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@biowell.com',
      password: 'TestPassword123!'
    })
    
    if (error) {
      console.log('❌ Sign-in failed:', error.message)
      
      // Try to create the user if it doesn't exist
      if (error.message.includes('Invalid login credentials')) {
        console.log('User may not exist, creating...')
        await createTestUser()
      }
    } else {
      console.log('✅ Sign-in successful:', data)
    }
    
  } catch (err) {
    console.error('Error during sign-in test:', err)
  }
}

// Run tests
console.log('🧪 Testing Supabase Authentication')
console.log('==================================')

testExistingUser()
