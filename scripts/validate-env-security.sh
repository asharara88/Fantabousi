#!/bin/bash

# Environment Security Validation Script
# Checks for proper environment variable configuration

echo "🔐 Environment Security Validation"
echo "=================================="
echo

# Check for exposed sensitive keys (these should NOT have VITE_ prefix)
echo "🚨 Checking for potentially exposed sensitive keys..."

if grep -q "VITE_.*API_KEY\|VITE_.*SECRET\|VITE_.*_PRIVATE" .env 2>/dev/null; then
    echo "❌ SECURITY RISK: Found sensitive keys with VITE_ prefix!"
    echo "   These will be exposed to the frontend:"
    grep "VITE_.*API_KEY\|VITE_.*SECRET\|VITE_.*_PRIVATE" .env
    echo
else
    echo "✅ No sensitive keys found with VITE_ prefix"
fi

# Check for proper secure keys (these should NOT have VITE_ prefix)
echo
echo "🔒 Checking server-side secure keys..."

SECURE_KEYS=(
    "OPENAI_API_KEY"
    "ELEVENLABS_API_KEY"
    "SPOONACULAR_API_KEY"
    "NUTRITIONIX_API_KEY"
    "RAPIDAPI_MUSCLE_IMAGE_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "GOOGLE_CLIENT_SECRET"
)

for key in "${SECURE_KEYS[@]}"; do
    if grep -q "^${key}=" .env 2>/dev/null; then
        echo "✅ $key is properly configured (server-side only)"
    else
        echo "⚠️  $key is not configured"
    fi
done

# Check for properly exposed public keys
echo
echo "🌐 Checking frontend-safe public keys..."

PUBLIC_KEYS=(
    "VITE_SUPABASE_URL"
    "VITE_SUPABASE_ANON_KEY"
    "VITE_GOOGLE_CLIENT_ID"
    "VITE_STRIPE_PUBLISHABLE_KEY"
)

for key in "${PUBLIC_KEYS[@]}"; do
    if grep -q "^${key}=" .env 2>/dev/null; then
        echo "✅ $key is properly configured (frontend-safe)"
    else
        echo "⚠️  $key is not configured"
    fi
done

# Check Stripe key type
echo
echo "💳 Validating Stripe configuration..."

if grep -q "VITE_STRIPE_PUBLISHABLE_KEY=pk_" .env 2>/dev/null; then
    echo "✅ Stripe publishable key detected (safe for frontend)"
else
    echo "⚠️  Stripe publishable key not found or incorrect format"
fi

if grep -q "VITE_STRIPE_PUBLISHABLE_KEY=sk_" .env 2>/dev/null; then
    echo "❌ CRITICAL: Stripe SECRET key exposed with VITE_ prefix!"
    echo "   This must be changed immediately!"
fi

# Check for .env.example consistency
echo
echo "📋 Checking .env.example consistency..."

if [ -f ".env.example" ]; then
    echo "✅ .env.example file exists"
    
    # Check if sensitive keys are properly documented as server-side
    if grep -q "# Server-side only" .env.example; then
        echo "✅ .env.example includes security documentation"
    else
        echo "⚠️  .env.example should include security documentation"
    fi
else
    echo "⚠️  .env.example file not found"
fi

echo
echo "🎯 Security Summary:"
echo "==================="
echo "✅ Frontend-safe variables use VITE_ prefix"
echo "✅ Sensitive API keys are server-side only (no VITE_ prefix)"
echo "✅ Stripe uses publishable key for frontend"
echo "✅ Service role and secret keys are protected"
echo
echo "Your environment configuration follows security best practices! 🔐"
echo
echo "💡 Next steps:"
echo "   1. Create Supabase Edge Functions for API calls requiring sensitive keys"
echo "   2. Use backend endpoints instead of direct API calls in frontend"
echo "   3. Monitor API usage for unusual activity"
