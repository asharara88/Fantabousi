# Environment Variables Security Guide

## 🔐 Critical Security Information

**IMPORTANT:** Vite exposes ALL environment variables with the `VITE_` prefix to the frontend bundle. This means they become publicly accessible to anyone who inspects your website.

## ✅ Current Secure Configuration

Your `.env` file is correctly configured with the following security model:

### 🌐 Frontend-Safe Variables (VITE_ prefix)
These variables are **safe to expose** to the browser:

```bash
# Supabase public configuration
VITE_SUPABASE_URL=https://leznzqfezoofngumpiqf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google OAuth client ID (public by design)
VITE_GOOGLE_CLIENT_ID=225199092880-5n8dposrskknq6meeunjljm08ukuucbo.apps.googleusercontent.com

# Stripe publishable key (designed to be public)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51RFY6JFv3tc6ecUr...
```

### 🔒 Server-Side Only Variables (NO VITE_ prefix)
These variables are **secure and private**:

```bash
# Database service role key (NEVER expose)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI service API keys (NEVER expose)
OPENAI_API_KEY=sk-proj--jIfoFy9AiPlZg1lPj8KJb9w...
ELEVENLABS_API_KEY=sk_01eeaed9525187140c33a23acadf8ff5...

# Third-party API keys (NEVER expose)
RAPIDAPI_MUSCLE_IMAGE_KEY=dba9c8a49amsh878c00098d43536p137cc4jsn...
SPOONACULAR_API_KEY=e61513f8566d42c2a1c9df0dd7b781d6
NUTRITIONIX_API_KEY=1ca985d6f767db6bb399649431cae307
NUTRITIONIX_APP_ID=0ca630f7

# OAuth secrets (NEVER expose)
GOOGLE_CLIENT_SECRET=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
```

## 🏗️ Architecture for API Security

Since sensitive API keys cannot be used directly in the frontend, you have two options:

### Option 1: Supabase Edge Functions (Recommended)
Create serverless functions that handle API calls with your sensitive keys:

```typescript
// supabase/functions/openai-chat/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { message } = await req.json()
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }]
    })
  })
  
  return new Response(await response.text())
})
```

### Option 2: Backend API Server
Create a separate backend server (Express.js, FastAPI, etc.) that handles sensitive API operations.

## 🚀 Frontend Implementation

In your React components, call your secure backend endpoints instead of APIs directly:

```typescript
// ✅ Secure approach - call your backend
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message })
})

// ❌ NEVER do this - exposes API key
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  headers: { 'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}` }
})
```

## 🔍 Current Status Summary

| Service | Status | Security Level |
|---------|--------|----------------|
| Supabase | ✅ Configured | Secure (anon key safe to expose) |
| Stripe | ✅ Configured | Secure (publishable key safe to expose) |
| Google OAuth | ✅ Configured | Secure (client ID safe to expose) |
| OpenAI | ✅ Secure | Server-side only |
| ElevenLabs | ✅ Secure | Server-side only |
| Spoonacular | ✅ Secure | Server-side only |
| Nutritionix | ✅ Secure | Server-side only |
| RapidAPI | ✅ Secure | Server-side only |

## 🛡️ Security Best Practices

1. **Never add `VITE_` prefix** to sensitive API keys
2. **Use Supabase Edge Functions** or backend APIs for sensitive operations
3. **Regularly rotate API keys** especially if they were ever exposed
4. **Monitor API usage** for unusual activity
5. **Use environment-specific keys** (test keys for development)

## 🚨 If Keys Were Exposed

If you accidentally exposed sensitive keys:

1. **Immediately revoke** the exposed keys in their respective services
2. **Generate new keys** and update your `.env` file
3. **Check API usage logs** for any unauthorized activity
4. **Force redeploy** your application with new keys

## 📞 Support

For security concerns or questions about environment configuration:
- Check service provider documentation for key rotation
- Review Supabase Edge Functions for serverless API handling
- Monitor your API usage dashboards regularly

Your current configuration follows security best practices! 🔐
