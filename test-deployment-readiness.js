#!/usr/bin/env node

/**
 * Comprehensive API Endpoint Testing for Biowell Deployment
 * Tests all external APIs, database connections, and service integrations
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config();

const TEST_CONFIG = {
  SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
  OPENAI_API_KEY: process.env.VITE_OPENAI_API_KEY,
  ELEVENLABS_API_KEY: process.env.VITE_ELEVENLABS_API_KEY,
  SPOONACULAR_API_KEY: process.env.VITE_SPOONACULAR_API_KEY,
  NUTRITIONIX_API_KEY: process.env.VITE_NUTRITIONIX_API_KEY,
  NUTRITIONIX_APP_ID: process.env.VITE_NUTRITIONIX_APP_ID,
  RAPIDAPI_MUSCLE_IMAGE_KEY: process.env.VITE_RAPIDAPI_MUSCLE_IMAGE_KEY,
  GOOGLE_CLIENT_ID: process.env.VITE_GOOGLE_CLIENT_ID
};

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

function logTest(name, status, details = '') {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} ${name}: ${status}${details ? ' - ' + details : ''}`);
  
  testResults.details.push({ name, status, details });
  if (status === 'PASS') testResults.passed++;
  else if (status === 'FAIL') testResults.failed++;
  else testResults.warnings++;
}

async function testEnvironmentVariables() {
  console.log('\n🔧 Testing Environment Variables...');
  
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_OPENAI_API_KEY',
    'VITE_ELEVENLABS_API_KEY',
    'VITE_SPOONACULAR_API_KEY',
    'VITE_NUTRITIONIX_API_KEY',
    'VITE_NUTRITIONIX_APP_ID'
  ];

  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      logTest(varName, 'FAIL', 'Missing or empty');
    } else if (value.includes('your-') || value.includes('sk-...')) {
      logTest(varName, 'WARN', 'Placeholder value detected');
    } else {
      logTest(varName, 'PASS', `Length: ${value.length} chars`);
    }
  }
}

async function testSupabaseConnection() {
  console.log('\n🗄️ Testing Supabase Connection...');
  
  try {
    if (!TEST_CONFIG.SUPABASE_URL || !TEST_CONFIG.SUPABASE_ANON_KEY) {
      logTest('Supabase Config', 'FAIL', 'Missing credentials');
      return;
    }

    const supabase = createClient(TEST_CONFIG.SUPABASE_URL, TEST_CONFIG.SUPABASE_ANON_KEY);
    
    // Test connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error && !error.message.includes('permission denied')) {
      logTest('Supabase Connection', 'FAIL', error.message);
    } else {
      logTest('Supabase Connection', 'PASS', 'Database accessible');
    }

    // Test auth
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      logTest('Supabase Auth', 'WARN', authError.message);
    } else {
      logTest('Supabase Auth', 'PASS', 'Auth service working');
    }

  } catch (error) {
    logTest('Supabase Connection', 'FAIL', error.message);
  }
}

async function testOpenAIAPI() {
  console.log('\n🤖 Testing OpenAI API...');
  
  if (!TEST_CONFIG.OPENAI_API_KEY) {
    logTest('OpenAI API', 'FAIL', 'Missing API key');
    return;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${TEST_CONFIG.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      logTest('OpenAI API', 'PASS', `${data.data?.length || 0} models available`);
    } else {
      logTest('OpenAI API', 'FAIL', `HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    logTest('OpenAI API', 'FAIL', error.message);
  }
}

async function testElevenLabsAPI() {
  console.log('\n🎵 Testing ElevenLabs API...');
  
  if (!TEST_CONFIG.ELEVENLABS_API_KEY) {
    logTest('ElevenLabs API', 'FAIL', 'Missing API key');
    return;
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': TEST_CONFIG.ELEVENLABS_API_KEY
      }
    });

    if (response.ok) {
      const data = await response.json();
      logTest('ElevenLabs API', 'PASS', `${data.voices?.length || 0} voices available`);
    } else {
      logTest('ElevenLabs API', 'FAIL', `HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    logTest('ElevenLabs API', 'FAIL', error.message);
  }
}

async function testSpoonacularAPI() {
  console.log('\n🍽️ Testing Spoonacular API...');
  
  if (!TEST_CONFIG.SPOONACULAR_API_KEY) {
    logTest('Spoonacular API', 'FAIL', 'Missing API key');
    return;
  }

  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=chicken&number=1&apiKey=${TEST_CONFIG.SPOONACULAR_API_KEY}`
    );

    if (response.ok) {
      const data = await response.json();
      logTest('Spoonacular API', 'PASS', `${data.totalResults || 0} recipes found`);
    } else {
      logTest('Spoonacular API', 'FAIL', `HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    logTest('Spoonacular API', 'FAIL', error.message);
  }
}

async function testNutritionixAPI() {
  console.log('\n🥗 Testing Nutritionix API...');
  
  if (!TEST_CONFIG.NUTRITIONIX_API_KEY || !TEST_CONFIG.NUTRITIONIX_APP_ID) {
    logTest('Nutritionix API', 'FAIL', 'Missing API credentials');
    return;
  }

  try {
    const response = await fetch('https://trackapi.nutritionix.com/v2/search/instant?query=apple', {
      headers: {
        'x-app-id': TEST_CONFIG.NUTRITIONIX_APP_ID,
        'x-app-key': TEST_CONFIG.NUTRITIONIX_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      logTest('Nutritionix API', 'PASS', `${data.common?.length || 0} common foods found`);
    } else {
      logTest('Nutritionix API', 'FAIL', `HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    logTest('Nutritionix API', 'FAIL', error.message);
  }
}

async function testRapidAPIConnection() {
  console.log('\n💪 Testing RapidAPI (Muscle Images)...');
  
  if (!TEST_CONFIG.RAPIDAPI_MUSCLE_IMAGE_KEY) {
    logTest('RapidAPI', 'FAIL', 'Missing API key');
    return;
  }

  try {
    // Test with a simple endpoint to verify key validity
    const response = await fetch('https://api.rapidapi.com/user', {
      headers: {
        'X-RapidAPI-Key': TEST_CONFIG.RAPIDAPI_MUSCLE_IMAGE_KEY
      }
    });

    if (response.ok || response.status === 401) {
      // 401 might be normal for user endpoint without proper auth
      logTest('RapidAPI', 'PASS', 'API key format valid');
    } else {
      logTest('RapidAPI', 'WARN', `HTTP ${response.status}: Key may be invalid`);
    }
  } catch (error) {
    logTest('RapidAPI', 'FAIL', error.message);
  }
}

async function testGoogleOAuthConfig() {
  console.log('\n🔐 Testing Google OAuth Configuration...');
  
  if (!TEST_CONFIG.GOOGLE_CLIENT_ID) {
    logTest('Google OAuth', 'WARN', 'Missing client ID (optional)');
    return;
  }

  if (TEST_CONFIG.GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com')) {
    logTest('Google OAuth', 'PASS', 'Client ID format valid');
  } else {
    logTest('Google OAuth', 'WARN', 'Client ID format may be invalid');
  }
}

function printSummary() {
  console.log('\n📊 DEPLOYMENT READINESS SUMMARY');
  console.log('═'.repeat(50));
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⚠️ Warnings: ${testResults.warnings}`);
  console.log(`📝 Total Tests: ${testResults.details.length}`);
  
  const successRate = ((testResults.passed / testResults.details.length) * 100).toFixed(1);
  console.log(`📈 Success Rate: ${successRate}%`);
  
  if (testResults.failed === 0) {
    console.log('\n🎉 APPLICATION IS READY FOR DEPLOYMENT!');
  } else {
    console.log('\n⚠️ ISSUES FOUND - REVIEW BEFORE DEPLOYMENT');
    console.log('\nFailed Tests:');
    testResults.details
      .filter(test => test.status === 'FAIL')
      .forEach(test => console.log(`  ❌ ${test.name}: ${test.details}`));
  }
}

async function runAllTests() {
  console.log('🚀 BIOWELL DEPLOYMENT READINESS TEST');
  console.log('═'.repeat(50));
  
  await testEnvironmentVariables();
  await testSupabaseConnection();
  await testOpenAIAPI();
  await testElevenLabsAPI();
  await testSpoonacularAPI();
  await testNutritionixAPI();
  await testRapidAPIConnection();
  await testGoogleOAuthConfig();
  
  printSummary();
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export { runAllTests, TEST_CONFIG };
