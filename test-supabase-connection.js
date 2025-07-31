// Simple Supabase connection test
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://leznzqfezoofngumpiqf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxlem56cWZlem9vZm5ndW1waXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwOTI0NTUsImV4cCI6MjA1OTY2ODQ1NX0.5I67qAPpITjoBj2WqOm8e0NX78XPw0rEx54DTICnWME';

console.log('Creating Supabase client...');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Testing basic connectivity...');

// Test 1: Health check
supabase.from('health_metrics').select('count', { count: 'exact', head: true })
  .then(result => {
    console.log('Health metrics count test:', result);
  })
  .catch(error => {
    console.error('Health metrics test failed:', error);
  });

// Test 2: Auth session check
supabase.auth.getSession()
  .then(result => {
    console.log('Auth session test:', result);
  })
  .catch(error => {
    console.error('Auth session test failed:', error);
  });

// Test 3: Direct API test
fetch(`${supabaseUrl}/rest/v1/health_metrics?select=count`, {
  method: 'HEAD',
  headers: {
    'apikey': supabaseAnonKey,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Direct API test - Status:', response.status);
  console.log('Direct API test - Headers:', [...response.headers.entries()]);
})
.catch(error => {
  console.error('Direct API test failed:', error);
});

console.log('Tests initiated...');
