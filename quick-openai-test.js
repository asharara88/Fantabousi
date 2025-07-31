#!/usr/bin/env node

// Quick OpenAI Test
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testOpenAI() {
  console.log('🔍 Testing OpenAI Integration...');
  
  try {
    const { data, error } = await supabase.functions.invoke('openai-proxy', {
      body: {
        messages: [
          { role: 'user', content: 'Say exactly: QUICK TEST 789' }
        ]
      }
    });
    
    console.log('Raw response:', { data, error });
    
    if (error) {
      console.log('❌ Supabase Error:', error);
      return false;
    }
    
    if (data && data.result) {
      console.log('✅ OpenAI Response:', data.result);
      if (data.result.includes('QUICK TEST 789')) {
        console.log('✅ OpenAI is responding correctly to specific requests!');
        return true;
      } else {
        console.log('⚠️ OpenAI responded but not with expected text');
        return false;
      }
    } else {
      console.log('❌ No result in response');
      return false;
    }
  } catch (err) {
    console.log('❌ Exception:', err);
    return false;
  }
}

testOpenAI().then(result => {
  console.log('\n📊 OpenAI Status:', result ? 'WORKING' : 'FAILED');
});
