#!/usr/bin/env node

// API Integration Test Script for Biowell
// Tests all external API integrations to confirm they're working

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

// Test configuration
const TEST_CONFIG = {
  SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
  RAPIDAPI_KEY: process.env.VITE_RAPIDAPI_MUSCLE_IMAGE_KEY,
  SPOONACULAR_API_KEY: process.env.VITE_SPOONACULAR_API_KEY,
  NUTRITIONIX_API_KEY: process.env.VITE_NUTRITIONIX_API_KEY,
  NUTRITIONIX_APP_ID: process.env.VITE_NUTRITIONIX_APP_ID
};

// Initialize Supabase client
const supabase = createClient(TEST_CONFIG.SUPABASE_URL, TEST_CONFIG.SUPABASE_ANON_KEY);

// Test helper functions
function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logSection(title) {
  log(`\n🔍 ${title}`, 'cyan');
  log('─'.repeat(50), 'cyan');
}

// Test functions
async function testSupabaseConnection() {
  logSection('Testing Supabase Connection');
  
  try {
    if (!TEST_CONFIG.SUPABASE_URL || !TEST_CONFIG.SUPABASE_ANON_KEY) {
      logError('Supabase credentials not found in environment');
      return false;
    }
    
    // Test basic connection
    const { data, error } = await supabase.from('supplements').select('count').limit(1);
    
    if (error) {
      logError(`Supabase connection failed: ${error.message}`);
      return false;
    }
    
    logSuccess('Supabase connection established');
    logInfo(`URL: ${TEST_CONFIG.SUPABASE_URL}`);
    return true;
  } catch (error) {
    logError(`Supabase test failed: ${error.message}`);
    return false;
  }
}

async function testOpenAIIntegration() {
  logSection('Testing OpenAI Integration');
  
  try {
    if (!TEST_CONFIG.OPENAI_API_KEY) {
      logWarning('OpenAI API key not found - testing via Supabase Edge Function');
    }
    
    const { data, error } = await supabase.functions.invoke('openai-proxy', {
      body: {
        messages: [
          { role: 'user', content: 'Hello! This is a test message. Please respond briefly.' }
        ]
      }
    });
    
    if (error) {
      logError(`OpenAI integration failed: ${error.message}`);
      return false;
    }
    
    if (data && data.result) {
      logSuccess('OpenAI integration working');
      logInfo(`Response length: ${data.result.length} characters`);
      return true;
    } else {
      logError('OpenAI integration: No response received');
      return false;
    }
  } catch (error) {
    logError(`OpenAI test failed: ${error.message}`);
    return false;
  }
}

async function testElevenLabsIntegration() {
  logSection('Testing ElevenLabs Integration');
  
  try {
    if (!TEST_CONFIG.ELEVENLABS_API_KEY) {
      logWarning('ElevenLabs API key not found - testing via Supabase Edge Function');
    }
    
    const { data, error } = await supabase.functions.invoke('elevenlabs-proxy', {
      body: {
        endpoint: 'user'
      }
    });
    
    if (error) {
      logError(`ElevenLabs integration failed: ${error.message}`);
      return false;
    }
    
    if (data) {
      logSuccess('ElevenLabs integration working');
      if (data.subscription) {
        logInfo(`Tier: ${data.subscription.tier}`);
        logInfo(`Character limit: ${data.subscription.character_limit}`);
      }
      return true;
    } else {
      logError('ElevenLabs integration: No response received');
      return false;
    }
  } catch (error) {
    logError(`ElevenLabs test failed: ${error.message}`);
    return false;
  }
}

async function testSpoonacularIntegration() {
  logSection('Testing Spoonacular API Integration');
  
  try {
    if (!TEST_CONFIG.SPOONACULAR_API_KEY) {
      logWarning('Spoonacular API key not found - testing via Supabase Edge Function');
    }
    
    const { data, error } = await supabase.functions.invoke('get-personalized-recipes', {
      body: {
        diet: 'vegetarian',
        maxReadyTime: 30
      }
    });
    
    if (error) {
      logError(`Spoonacular integration failed: ${error.message}`);
      return false;
    }
    
    if (data && data.recipes) {
      logSuccess('Spoonacular integration working');
      logInfo(`Found ${data.recipes.length} recipes`);
      return true;
    } else {
      logError('Spoonacular integration: No recipes received');
      return false;
    }
  } catch (error) {
    logError(`Spoonacular test failed: ${error.message}`);
    return false;
  }
}

async function testNutritionixIntegration() {
  logSection('Testing Nutritionix API Integration');
  
  try {
    if (!TEST_CONFIG.NUTRITIONIX_API_KEY || !TEST_CONFIG.NUTRITIONIX_APP_ID) {
      logWarning('Nutritionix credentials not found - testing via Supabase Edge Function');
    }
    
    const { data, error } = await supabase.functions.invoke('nutrition-search', {
      body: {
        query: 'chicken breast'
      }
    });
    
    if (error) {
      logError(`Nutritionix integration failed: ${error.message}`);
      return false;
    }
    
    if (data && data.foods) {
      logSuccess('Nutritionix integration working');
      logInfo(`Found ${data.foods.length} food items`);
      return true;
    } else {
      logError('Nutritionix integration: No food data received');
      return false;
    }
  } catch (error) {
    logError(`Nutritionix test failed: ${error.message}`);
    return false;
  }
}

async function testRapidAPIIntegration() {
  logSection('Testing RapidAPI Integration');
  
  try {
    if (!TEST_CONFIG.RAPIDAPI_KEY) {
      logWarning('RapidAPI key not found - testing via Supabase Edge Function');
    }
    
    const { data, error } = await supabase.functions.invoke('ai-workout-planner', {
      body: {
        endpoint: 'workout-plan',
        data: {
          goals: ['muscle_gain'],
          experience: 'beginner',
          equipment: ['bodyweight']
        }
      }
    });
    
    if (error) {
      logError(`RapidAPI integration failed: ${error.message}`);
      return false;
    }
    
    if (data) {
      logSuccess('RapidAPI integration working');
      logInfo('Workout planner API accessible');
      return true;
    } else {
      logError('RapidAPI integration: No response received');
      return false;
    }
  } catch (error) {
    logError(`RapidAPI test failed: ${error.message}`);
    return false;
  }
}

async function testEnvironmentVariables() {
  logSection('Environment Variables Check');
  
  const envVars = [
    { name: 'VITE_SUPABASE_URL', value: TEST_CONFIG.SUPABASE_URL, required: true },
    { name: 'VITE_SUPABASE_ANON_KEY', value: TEST_CONFIG.SUPABASE_ANON_KEY, required: true },
    { name: 'OPENAI_API_KEY', value: TEST_CONFIG.OPENAI_API_KEY, required: false },
    { name: 'ELEVENLABS_API_KEY', value: TEST_CONFIG.ELEVENLABS_API_KEY, required: false },
    { name: 'VITE_RAPIDAPI_MUSCLE_IMAGE_KEY', value: TEST_CONFIG.RAPIDAPI_KEY, required: false },
    { name: 'VITE_SPOONACULAR_API_KEY', value: TEST_CONFIG.SPOONACULAR_API_KEY, required: false },
    { name: 'VITE_NUTRITIONIX_API_KEY', value: TEST_CONFIG.NUTRITIONIX_API_KEY, required: false },
    { name: 'VITE_NUTRITIONIX_APP_ID', value: TEST_CONFIG.NUTRITIONIX_APP_ID, required: false }
  ];
  
  let allRequired = true;
  let allOptional = true;
  
  envVars.forEach(envVar => {
    if (envVar.value) {
      logSuccess(`${envVar.name}: Set (${envVar.value.substring(0, 20)}...)`);
    } else {
      if (envVar.required) {
        logError(`${envVar.name}: Missing (REQUIRED)`);
        allRequired = false;
      } else {
        logWarning(`${envVar.name}: Missing (optional)`);
        allOptional = false;
      }
    }
  });
  
  return { allRequired, allOptional };
}

// Main test runner
async function runAllTests() {
  log('\n🧪 Biowell API Integration Test Suite', 'magenta');
  log('═'.repeat(50), 'magenta');
  
  const results = {
    environment: await testEnvironmentVariables(),
    supabase: await testSupabaseConnection(),
    openai: await testOpenAIIntegration(),
    elevenlabs: await testElevenLabsIntegration(),
    spoonacular: await testSpoonacularIntegration(),
    nutritionix: await testNutritionixIntegration(),
    rapidapi: await testRapidAPIIntegration()
  };
  
  // Summary
  logSection('Test Results Summary');
  
  const passed = Object.entries(results).filter(([key, value]) => {
    if (key === 'environment') return value.allRequired;
    return value === true;
  }).length;
  
  const total = Object.keys(results).length;
  
  log(`\n📊 Test Results: ${passed}/${total} APIs working`, 'cyan');
  
  if (results.environment.allRequired && results.supabase) {
    logSuccess('✅ Core infrastructure working (Supabase + Environment)');
  } else {
    logError('❌ Core infrastructure issues detected');
  }
  
  const workingAPIs = [];
  const failingAPIs = [];
  
  if (results.openai) workingAPIs.push('OpenAI');
  else failingAPIs.push('OpenAI');
  
  if (results.elevenlabs) workingAPIs.push('ElevenLabs');
  else failingAPIs.push('ElevenLabs');
  
  if (results.spoonacular) workingAPIs.push('Spoonacular');
  else failingAPIs.push('Spoonacular');
  
  if (results.nutritionix) workingAPIs.push('Nutritionix');
  else failingAPIs.push('Nutritionix');
  
  if (results.rapidapi) workingAPIs.push('RapidAPI');
  else failingAPIs.push('RapidAPI');
  
  if (workingAPIs.length > 0) {
    logSuccess(`Working APIs: ${workingAPIs.join(', ')}`);
  }
  
  if (failingAPIs.length > 0) {
    logError(`Failing APIs: ${failingAPIs.join(', ')}`);
  }
  
  // Deployment readiness
  if (results.environment.allRequired && results.supabase) {
    logSuccess('\n🚀 DEPLOYMENT READY: Core functionality working');
  } else {
    logError('\n❌ DEPLOYMENT BLOCKED: Core issues need fixing');
  }
  
  if (!results.environment.allOptional) {
    logWarning('Some optional APIs not configured - app will use fallback data');
  }
  
  return results;
}

// Run the tests
runAllTests().catch(error => {
  logError(`Test suite failed: ${error.message}`);
  process.exit(1);
});
