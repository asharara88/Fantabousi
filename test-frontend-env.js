// Frontend Environment Variables Test
// Tests if VITE_ prefixed variables are accessible in the browser

console.log('🔍 Testing Frontend Environment Variables Access');
console.log('═'.repeat(50));

const frontendEnvVars = {
  'VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL,
  'VITE_SUPABASE_ANON_KEY': import.meta.env.VITE_SUPABASE_ANON_KEY,
  'VITE_RAPIDAPI_MUSCLE_IMAGE_KEY': import.meta.env.VITE_RAPIDAPI_MUSCLE_IMAGE_KEY,
  'VITE_SPOONACULAR_API_KEY': import.meta.env.VITE_SPOONACULAR_API_KEY,
  'VITE_NUTRITIONIX_API_KEY': import.meta.env.VITE_NUTRITIONIX_API_KEY,
  'VITE_NUTRITIONIX_APP_ID': import.meta.env.VITE_NUTRITIONIX_APP_ID,
  'VITE_GOOGLE_CLIENT_ID': import.meta.env.VITE_GOOGLE_CLIENT_ID
};

let allAccessible = true;

Object.entries(frontendEnvVars).forEach(([name, value]) => {
  if (value) {
    console.log(`✅ ${name}: Accessible (${value.substring(0, 20)}...)`);
  } else {
    console.log(`❌ ${name}: Not accessible`);
    allAccessible = false;
  }
});

console.log('\n📊 Frontend Environment Variables Status:');
if (allAccessible) {
  console.log('✅ All VITE_ prefixed variables accessible in frontend');
} else {
  console.log('❌ Some VITE_ prefixed variables not accessible');
}

export { frontendEnvVars };
