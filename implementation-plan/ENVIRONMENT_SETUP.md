# Environment Setup Guide

## 📋 Overview

This guide helps you set up all environment variables for the CursorFlow project. The project uses three environment files:

1. **Root `.env`** - Project-wide configuration
2. **Frontend `.env.local`** - Next.js specific variables
3. **Backend `.env`** - API server configuration

## 🚀 Quick Setup

### **Step 1: Copy Environment Files**
```bash
# Copy all environment files
cp env.example .env
cp frontend/env.example frontend/.env.local
cp backend/env.example backend/.env
```

### **Step 2: Configure Essential Variables**

#### **Root Configuration (.env)**
```bash
# Edit .env file
nano .env

# Essential variables to configure:
PRIMARY_LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-actual-openai-key
V0_API_KEY=v0_your_actual_v0_key
FIREBASE_PROJECT_ID=your-firebase-project-id
```

#### **Frontend Configuration (.env.local)**
```bash
# Edit frontend/.env.local
nano frontend/.env.local

# Essential variables:
NEXT_PUBLIC_API_URL=http://localhost:3001
OPENAI_API_KEY=sk-your-actual-openai-key
V0_API_KEY=v0_your_actual_v0_key
FIREBASE_PROJECT_ID=your-firebase-project-id
```

#### **Backend Configuration (.env)**
```bash
# Edit backend/.env
nano backend/.env

# Essential variables:
PORT=3001
OPENAI_API_KEY=sk-your-actual-openai-key
V0_API_KEY=v0_your_actual_v0_key
FIREBASE_PROJECT_ID=your-firebase-project-id
```

## 🔑 Required API Keys

### **1. OpenAI API Key**
- **Purpose**: AI-powered analysis and PRD generation
- **Get it**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **Cost**: Pay-per-use (typically $0.01-0.10 per analysis)

### **2. v0 Platform API Key**
- **Purpose**: Code generation from PRDs
- **Get it**: [v0 Platform](https://v0.dev/)
- **Cost**: Free tier available

### **3. Supabase Configuration**
- **Purpose**: Authentication, database, and file storage
- **Get it**: [Supabase Dashboard](https://supabase.com/dashboard)
- **Cost**: Generous free tier

### **4. Stripe Keys (Optional)**
- **Purpose**: Payment processing
- **Get it**: [Stripe Dashboard](https://dashboard.stripe.com/)
- **Cost**: Free to set up, fees on transactions

## 🏗️ Detailed Configuration

### **AI Services Configuration**

#### **OpenAI Setup**
```bash
# In all three .env files:
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.3
```

#### **Alternative LLM Providers**
```bash
# Optional: Use Groq or Anthropic instead
GROQ_API_KEY=your-groq-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
USE_GROQ=false
USE_ANTHROPIC=false
```

### **Firebase Setup**

#### **1. Create Supabase Project**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Enable Authentication (Email/Password, OAuth providers)
4. Create PostgreSQL database (automatically included)

#### **2. Get API Keys**
1. Go to Project Settings > API
2. Copy the Project URL and API keys
3. Configure the values:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### **v0 Platform Setup**

#### **1. Get API Key**
1. Go to [v0 Platform](https://v0.dev/)
2. Sign up/Login
3. Go to API settings
4. Generate API key

#### **2. Configure**
```bash
V0_API_KEY=v0_your_api_key
V0_BASE_URL=https://api.v0.dev
```

### **Supabase Setup**

#### **1. Create Supabase Project**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Enable Authentication (Email/Password, OAuth providers)
4. Create PostgreSQL database (automatically included)

#### **2. Get API Keys**
1. Go to Project Settings > API
2. Copy the Project URL and API keys
3. Configure the values:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

#### **3. Set up Database Schema**
1. Go to SQL Editor in Supabase Dashboard
2. Run the database schema from `backend/config/database.sql`
3. This creates all necessary tables, policies, and functions

## 🔧 Development Configuration

### **Feature Flags**
```bash
# Enable/disable specific features
ENABLE_ACCESSIBILITY_ANALYSIS=true
ENABLE_PERFORMANCE_ANALYSIS=true
ENABLE_CONTENT_ANALYSIS=true
ENABLE_COMPREHENSIVE_ANALYSIS=true
ENABLE_MULTI_STAGE_ANALYSIS=true
```

### **Debug Settings**
```bash
# Development debugging
DEBUG=false
VERBOSE_LOGGING=false
SHOW_PROMPT_DEBUG=false
TEST_MODE=false
```

### **Performance Settings**
```bash
# Rate limiting and caching
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CACHE_TTL=3600
MAX_ANALYSIS_TIME=60000
```

## 🚀 Production Configuration

### **Environment Variables**
```bash
# Production settings
NODE_ENV=production
LOG_LEVEL=warn
ENABLE_ANALYTICS=true
SENTRY_DSN=your_sentry_dsn
```

### **Security Settings**
```bash
# Production security
JWT_SECRET=your-super-secure-jwt-secret
CORS_ORIGIN=https://yourdomain.com
STRIPE_SECRET_KEY=sk_live_your_stripe_key
```

## 🔍 Validation

### **Check Configuration**
```bash
# Validate environment setup
npm run validate:env

# Test API connections
npm run test:connections
```

### **Common Issues**

#### **1. Missing API Keys**
```bash
Error: OPENAI_API_KEY is not set
Solution: Add your OpenAI API key to all three .env files
```

#### **2. Firebase Configuration**
```bash
Error: Firebase project not found
Solution: Verify FIREBASE_PROJECT_ID and service account credentials
```

#### **3. CORS Issues**
```bash
Error: CORS policy blocked request
Solution: Update CORS_ORIGIN in backend/.env
```

## 📊 Environment File Structure

```
cursorflow/
├── .env                    # Root configuration
├── frontend/
│   ├── .env.local         # Next.js configuration
│   └── env.example        # Frontend template
├── backend/
│   ├── .env               # API server configuration
│   └── env.example        # Backend template
└── env.example            # Root template
```

## 🔒 Security Best Practices

### **1. Never Commit .env Files**
```bash
# Ensure .env files are in .gitignore
echo ".env" >> .gitignore
echo "frontend/.env.local" >> .gitignore
echo "backend/.env" >> .gitignore
```

### **2. Use Strong Secrets**
```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### **3. Rotate API Keys Regularly**
- OpenAI: Every 90 days
- Firebase: Every 6 months
- Stripe: As needed

### **4. Environment-Specific Configs**
```bash
# Development
NODE_ENV=development
DEBUG=true

# Production
NODE_ENV=production
DEBUG=false
```

## 🚀 Deployment Configuration

### **Vercel Deployment**
```bash
# Add environment variables in Vercel dashboard
vercel env add OPENAI_API_KEY
vercel env add V0_API_KEY
vercel env add FIREBASE_PROJECT_ID
```

### **Docker Deployment**
```bash
# Use environment file with Docker
docker run --env-file .env cursorflow
```

## 📝 Troubleshooting

### **Environment Variable Issues**
```bash
# Check if variables are loaded
node -e "console.log(process.env.OPENAI_API_KEY)"

# Debug environment loading
DEBUG=* npm run dev
```

### **API Connection Issues**
```bash
# Test OpenAI connection
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models

# Test v0 connection
curl -H "Authorization: Bearer $V0_API_KEY" \
  https://api.v0.dev/v1/chat
```

This setup guide ensures you have all the necessary environment variables configured correctly for development and production use. 