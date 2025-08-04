// Debug Supabase Connection Issues
// This script helps identify common Supabase authentication problems

console.log('🔍 Supabase Connection Debugger')
console.log('================================')

// Check environment variables
console.log('\n📝 Environment Variables:')
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL || '❌ NOT SET')
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '✅ SET' : '❌ NOT SET')

const url = 'https://leznzqfezoofngumpiqf.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxlem56cWZlem9vZm5ndW1waXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwOTI0NTUsImV4cCI6MjA1OTY2ODQ1NX0.5I67qAPpITjoBj2WqOm8e0NX78XPw0rEx54DTICnWME'

// Test 1: Basic connectivity
async function testConnectivity() {
  console.log('\n🌐 Testing Basic Connectivity...')
  try {
    const response = await fetch(url)
    console.log('✅ Can reach Supabase domain')
    console.log('Status:', response.status)
  } catch (error) {
    console.log('❌ Cannot reach Supabase domain')
    console.log('Error:', error.message)
    return false
  }
  return true
}

// Test 2: API endpoint accessibility  
async function testAPIEndpoint() {
  console.log('\n🔌 Testing API Endpoint...')
  try {
    const response = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    })
    
    if (response.ok) {
      console.log('✅ API endpoint accessible')
    } else {
      console.log('❌ API endpoint returned error:', response.status)
      const text = await response.text()
      console.log('Response:', text)
    }
  } catch (error) {
    console.log('❌ API endpoint test failed')
    console.log('Error:', error.message)
    return false
  }
  return true
}

// Test 3: Auth endpoint
async function testAuthEndpoint() {
  console.log('\n🔐 Testing Auth Endpoint...')
  try {
    const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'nonexistent@test.com',
        password: 'test123'
      })
    })
    
    // We expect a 400 error for invalid credentials, which means auth is working
    if (response.status === 400) {
      console.log('✅ Auth endpoint is working (expected 400 for invalid creds)')
    } else {
      console.log('Status:', response.status)
      const text = await response.text()
      console.log('Response:', text.substring(0, 200))
    }
  } catch (error) {
    console.log('❌ Auth endpoint test failed')
    console.log('Error:', error.message)
    return false
  }
  return true
}

// Test 4: Network timing
async function testNetworkTiming() {
  console.log('\n⏱️  Testing Network Timing...')
  const start = Date.now()
  try {
    await fetch(url)
    const duration = Date.now() - start
    console.log(`✅ Network latency: ${duration}ms`)
    if (duration > 5000) {
      console.log('⚠️  High latency detected - this might cause timeouts')
    }
  } catch (error) {
    console.log('❌ Network timing test failed')
    console.log('Error:', error.message)
  }
}

// Run all tests
async function runAllTests() {
  const results = await Promise.all([
    testConnectivity(),
    testAPIEndpoint(), 
    testAuthEndpoint(),
    testNetworkTiming()
  ])
  
  console.log('\n📊 Summary:')
  console.log('Basic connectivity:', results[0] ? '✅' : '❌')
  console.log('API endpoint:', results[1] ? '✅' : '❌') 
  console.log('Auth endpoint:', results[2] ? '✅' : '❌')
  
  if (results.every(r => r)) {
    console.log('\n🎉 All tests passed! Supabase should be working.')
    console.log('💡 The login issue might be:')
    console.log('   - Invalid user credentials')
    console.log('   - User email not confirmed')
    console.log('   - Browser blocking cookies/localStorage')
    console.log('   - CORS issues in development')
  } else {
    console.log('\n⚠️  Some tests failed. Check network/firewall settings.')
  }
}

runAllTests()
