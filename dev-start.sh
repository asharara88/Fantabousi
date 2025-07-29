#!/bin/bash

# Biowell Development Server Startup Script
# This script ensures clean development environment startup

echo "🚀 Starting Biowell Development Environment..."

# Kill any existing processes on common development ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
lsof -ti:5174 | xargs kill -9 2>/dev/null || true

# Clear any cached Vite config
echo "🗂️ Clearing Vite cache..."
rm -rf node_modules/.vite 2>/dev/null || true

# Check environment configuration
echo "🔧 Checking environment configuration..."
if [ ! -f ".env.local" ]; then
    echo "⚠️ .env.local not found, creating from template..."
    cp .env.example .env.local 2>/dev/null || echo "No .env.example found"
fi

# Check for required environment variables
if grep -q "your-project" .env.local 2>/dev/null; then
    echo "⚠️ Warning: Environment contains placeholder values"
    echo "📝 Please configure your API keys in .env.local for full functionality"
    echo "🎭 Running in demo mode with fallbacks"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start development server with proper configuration
echo "🌟 Starting Vite development server..."
echo "🔗 Server will be available at: http://localhost:5173"
echo "📡 WebSocket HMR on: ws://localhost:5173"

# Set environment variables for better WebSocket handling
export VITE_HMR_PORT=5173
export VITE_HMR_HOST=localhost

# Start the server
npm run dev --host=localhost --port=5173 --force

echo "✅ Development server started successfully!"
