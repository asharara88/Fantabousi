#!/bin/bash

# Biowell AI Health Coach - Environment Configuration Script
# This script helps configure environment variables for different deployment scenarios

set -e

echo "🏥 Biowell AI Health Coach - Environment Configuration"
echo "========================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if .env file exists
if [ -f ".env" ]; then
    print_status ".env file found"
else
    print_warning ".env file not found"
    echo "Creating .env file from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_status "Created .env file from template"
    else
        print_error ".env.example file not found!"
        exit 1
    fi
fi

echo ""
echo "📋 Environment Variables Checklist"
echo "==================================="

# Required environment variables
declare -a required_vars=(
    "VITE_SUPABASE_URL"
    "VITE_SUPABASE_ANON_KEY"
    "VITE_STRIPE_PUBLISHABLE_KEY"
)

# Optional but recommended variables
declare -a optional_vars=(
    "VITE_OPENAI_API_KEY"
    "VITE_SPOONACULAR_API_KEY"
    "VITE_NUTRITIONIX_API_KEY"
    "VITE_NUTRITIONIX_APP_ID"
    "VITE_GOOGLE_CLIENT_ID"
    "VITE_RAPIDAPI_MUSCLE_IMAGE_KEY"
    "ELEVENLABS_API_KEY"
)

# Check required variables
echo ""
echo "🔑 Required Variables:"
missing_required=0
for var in "${required_vars[@]}"; do
    if grep -q "^${var}=" .env 2>/dev/null && [ -n "$(grep "^${var}=" .env | cut -d'=' -f2)" ]; then
        value=$(grep "^${var}=" .env | cut -d'=' -f2)
        if [[ "$value" != *"your_"* ]] && [[ "$value" != *"_here"* ]]; then
            print_status "$var is configured"
        else
            print_warning "$var has placeholder value"
            ((missing_required++))
        fi
    else
        print_error "$var is missing or empty"
        ((missing_required++))
    fi
done

# Check optional variables
echo ""
echo "🔧 Optional Variables:"
for var in "${optional_vars[@]}"; do
    if grep -q "^${var}=" .env 2>/dev/null && [ -n "$(grep "^${var}=" .env | cut -d'=' -f2)" ]; then
        value=$(grep "^${var}=" .env | cut -d'=' -f2)
        if [[ "$value" != *"your_"* ]] && [[ "$value" != *"_here"* ]]; then
            print_status "$var is configured"
        else
            print_warning "$var has placeholder value"
        fi
    else
        print_warning "$var is not set"
    fi
done

echo ""
echo "📊 Configuration Summary"
echo "========================"

if [ $missing_required -eq 0 ]; then
    print_status "All required environment variables are configured!"
    echo ""
    print_info "Your application is ready for deployment 🚀"
    
    echo ""
    echo "🌐 Deployment URLs:"
    echo "  • Production: https://bwsalsa.netlify.app"
    echo "  • Admin: https://app.netlify.com/projects/bwsalsa"
    
    echo ""
    echo "🛠️ Next Steps:"
    echo "  1. Run 'npm run build' to test build locally"
    echo "  2. Run 'netlify deploy --prod' to deploy to production"
    echo "  3. Test payment flows with configured Stripe keys"
    echo "  4. Monitor application logs in Netlify dashboard"
    
else
    print_error "$missing_required required variables need configuration"
    echo ""
    print_info "To configure missing variables:"
    echo "  1. Edit the .env file: nano .env"
    echo "  2. Replace placeholder values with actual credentials"
    echo "  3. For Netlify deployment, also set these in:"
    echo "     https://app.netlify.com/projects/bwsalsa/settings/env"
fi

echo ""
echo "📚 Documentation:"
echo "  • Deployment Guide: ./NETLIFY_DEPLOYMENT.md"
echo "  • Environment Setup: ./.env.example"
echo "  • API Documentation: ./docs/openapi.yaml"

echo ""
print_info "Configuration check complete!"
