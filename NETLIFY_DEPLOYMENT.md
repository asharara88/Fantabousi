# Netlify Deployment Guide for Biowell AI Health Coach

This guide walks you through deploying the Biowell AI Health Coach application to Netlify.

## 📋 Prerequisites

- [Netlify account](https://app.netlify.com/)
- GitHub repository with your code
- Environment variables from `.env.example`

## 🚀 Quick Deployment

### Option 1: Deploy from Git (Recommended)

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Choose GitHub and authorize Netlify
   - Select your `biowell-fanta-ready` repository

2. **Configure Build Settings**
   - Branch to deploy: `main`
   - Build command: `npm run build`
   - Publish directory: `dist`
   - These are already configured in `netlify.toml`

3. **Set Environment Variables**
   - Go to Site settings > Environment variables
   - Add all required variables from `.env.example`:

   ```bash
   # Required for core functionality
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
   
   # Optional but recommended
   VITE_OPENAI_API_KEY=your_openai_key
   VITE_SPOONACULAR_API_KEY=your_spoonacular_key
   NODE_ENV=production
   CI=true
   ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your app

### Option 2: Manual Deploy

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to Netlify
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

## 🔧 Configuration Details

### Build Settings (netlify.toml)

The `netlify.toml` file includes:
- ✅ Build command and publish directory
- ✅ Node.js version (18)
- ✅ Security headers with Stripe support
- ✅ SPA routing redirects
- ✅ Asset caching rules
- ✅ Environment-specific builds
- ✅ API proxy redirects

### Security Headers

Enhanced security headers include:
- CSP with Stripe domains whitelisted
- XSS protection
- Frame options
- Content type sniffing protection

### Redirects

Configured redirects handle:
- SPA routing (all routes → index.html)
- API proxying to backend
- Custom domain redirects
- Stripe webhook proxying

## 🌍 Custom Domain Setup

1. **Add Custom Domain**
   - Site settings > Domain management
   - Add domain: `biowell.ai`
   - Follow DNS configuration instructions

2. **SSL Certificate**
   - Netlify automatically provisions SSL
   - Force HTTPS in Site settings

3. **DNS Configuration**
   ```
   Type: A
   Name: @
   Value: Netlify's IP (provided in dashboard)
   
   Type: CNAME
   Name: www
   Value: your-site-name.netlify.app
   ```

## 🔒 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_live_xxx` or `pk_test_xxx` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_OPENAI_API_KEY` | OpenAI for AI features | - |
| `VITE_SPOONACULAR_API_KEY` | Nutrition data | - |
| `VITE_ENV` | Environment identifier | `production` |
| `NODE_ENV` | Build environment | `production` |

## 🔄 Deploy Previews

Netlify automatically creates deploy previews for:
- Pull requests
- Branch deploys
- Draft deploys

Preview URLs: `https://deploy-preview-{pr-number}--your-site.netlify.app`

## 📊 Performance Optimization

The configuration includes:
- Asset compression and caching
- Code splitting
- Source map removal in production
- Image optimization
- Bundle analysis

## 🐛 Troubleshooting

### Build Failures

1. **Check build logs** in Netlify dashboard
2. **Verify Node.js version** (should be 18)
3. **Check environment variables** are set correctly
4. **Test build locally**:
   ```bash
   npm run build
   npm run preview
   ```

### Runtime Issues

1. **Check browser console** for errors
2. **Verify API endpoints** are accessible
3. **Check Stripe keys** are correct for environment
4. **Validate environment variables** in browser:
   ```javascript
   console.log(import.meta.env)
   ```

### Common Issues

| Issue | Solution |
|-------|----------|
| SPA routes 404 | Check `_redirects` or `netlify.toml` redirects |
| Stripe not loading | Verify CSP headers include Stripe domains |
| API calls failing | Check CORS and API proxy settings |
| Build out of memory | Increase Node.js memory limit |

## 📞 Support

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Community](https://community.netlify.com/)
- [GitHub Issues](https://github.com/asharara88/biowell-fanta-ready/issues)

## 🔄 Automatic Deployments

Once connected to Git:
- ✅ Push to `main` → Production deploy
- ✅ Pull requests → Deploy previews
- ✅ Other branches → Branch deploys

## 🎯 Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All routes work (SPA routing)
- [ ] Stripe payment flow works
- [ ] API calls successful
- [ ] Authentication working
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Analytics tracking (if enabled)
- [ ] Performance score check
