# CursorFlow Deployment Guide

## 🚀 Deploy to Vercel

This guide will help you deploy CursorFlow to Vercel with both marketing website and web application functionality.

## 📋 Prerequisites

1. **GitHub Repository** - Your code should be in a GitHub repo
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Supabase Project** - Set up your Supabase project
4. **API Keys** - OpenAI, v0 Platform, etc.

## 🏗️ Project Structure

```
cursorflow/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Marketing homepage
│   │   ├── app/                  # Web application
│   │   │   ├── layout.tsx        # App layout
│   │   │   ├── page.tsx          # Dashboard
│   │   │   ├── projects/         # Project management
│   │   │   ├── audits/           # AI analysis
│   │   │   └── settings/         # User settings
│   │   ├── api/                  # API routes
│   │   └── auth/                 # Authentication pages
│   ├── components/
│   │   ├── marketing/            # Marketing components
│   │   ├── app/                  # App components
│   │   └── ui/                   # Shared UI components
│   └── lib/                      # Utilities and config
├── public/                       # Static assets
├── next.config.js               # Next.js config
├── vercel.json                  # Vercel config
└── package.json                 # Dependencies
```

## 🔧 Setup Steps

### **1. Prepare Your Repository**

```bash
# Ensure your code is committed to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### **2. Connect to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

### **3. Configure Project Settings**

#### **Framework Preset**
- **Framework Preset**: Next.js
- **Root Directory**: `./` (or `frontend/` if your Next.js app is in a subdirectory)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### **Environment Variables**
Add these environment variables in Vercel:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# AI Services
OPENAI_API_KEY=sk-your-openai-api-key
V0_API_KEY=v0_your-v0-api-key

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-vercel-analytics-id
```

### **4. Deploy**

Click "Deploy" and wait for the build to complete.

## 🌐 Domain Configuration

### **Custom Domain Setup**

1. **Add Custom Domain**
   - Go to your Vercel project dashboard
   - Click "Settings" → "Domains"
   - Add your custom domain (e.g., `cursorflow.com`)

2. **Configure DNS**
   - Add the required DNS records to your domain provider
   - Vercel will provide the exact records needed

### **Subdomain Setup (Optional)**

You can set up subdomains for different sections:

```
cursorflow.com          → Marketing website
app.cursorflow.com      → Web application
api.cursorflow.com      → API endpoints
```

## 🔒 Security Configuration

### **1. Environment Variables**
- Never commit sensitive keys to your repository
- Use Vercel's environment variable system
- Rotate keys regularly

### **2. CORS Configuration**
Your `vercel.json` already includes security headers:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### **3. Supabase Row Level Security**
Ensure your Supabase database has RLS enabled:

```sql
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can only access own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);
```

## 📊 Monitoring & Analytics

### **1. Vercel Analytics**
Enable Vercel Analytics for performance monitoring:

```bash
# Add to your environment variables
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

### **2. Google Analytics**
Add Google Analytics for user tracking:

```bash
# Add to your environment variables
NEXT_PUBLIC_GA_ID=your-ga-id
```

### **3. Error Monitoring**
Consider adding Sentry for error tracking:

```bash
# Add to your environment variables
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## 🔄 Continuous Deployment

### **Automatic Deployments**
Vercel automatically deploys when you push to your main branch:

```bash
# Deploy by pushing to main
git push origin main
```

### **Preview Deployments**
Create preview deployments for pull requests:

```bash
# Create a feature branch
git checkout -b feature/new-feature
git push origin feature/new-feature

# Create a pull request
# Vercel will create a preview deployment
```

## 🚀 Performance Optimization

### **1. Image Optimization**
Your `next.config.js` includes image optimization:

```javascript
images: {
  domains: [
    'your-project.supabase.co',
    'lh3.googleusercontent.com',
  ],
  formats: ['image/webp', 'image/avif'],
}
```

### **2. Caching Strategy**
Configure caching for static assets:

```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### **3. Bundle Optimization**
Use Next.js built-in optimizations:

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@supabase/supabase-js'],
  },
}
```

## 🔧 Troubleshooting

### **Common Issues**

#### **1. Build Failures**
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm install --legacy-peer-deps
# or
npm install --force
```

#### **2. Environment Variables**
```bash
# Verify environment variables are set correctly
# Check Vercel dashboard → Settings → Environment Variables
```

#### **3. Database Connection**
```bash
# Ensure Supabase URL and keys are correct
# Test connection in development first
```

#### **4. API Routes Not Working**
```bash
# Check function timeout settings in vercel.json
# Ensure API routes are in src/app/api/
```

### **Debug Commands**

```bash
# Test build locally
npm run build

# Test production build
npm run start

# Check for TypeScript errors
npm run type-check

# Lint code
npm run lint
```

## 📈 Scaling Considerations

### **Free Tier Limits**
- **Bandwidth**: 100GB/month
- **Function Executions**: 100/month
- **Build Time**: 100 minutes/month

### **Pro Plan ($20/month)**
- **Bandwidth**: Unlimited
- **Function Executions**: 1000/month
- **Build Time**: 400 minutes/month
- **Custom Domains**: Unlimited

### **Enterprise Plan**
- **Custom limits**
- **Priority support**
- **Advanced features**

## 🎯 Next Steps

1. **Deploy to Vercel** using this guide
2. **Set up custom domain** for professional appearance
3. **Configure monitoring** for performance tracking
4. **Set up CI/CD** for automated deployments
5. **Monitor performance** and optimize as needed

Your CursorFlow application is now ready for production deployment on Vercel! 