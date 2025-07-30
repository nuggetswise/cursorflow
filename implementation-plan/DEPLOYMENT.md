# CursorFlow - Deployment & Infrastructure

## ☁️ Cloud Infrastructure Overview

CursorFlow is designed as a cloud-first platform with zero local development setup required. All services are deployed on Vercel with serverless functions, ensuring scalability and ease of maintenance.

## 🏗️ Infrastructure Architecture

### **Deployment Architecture**
```
┌─────────────────────────────────────────────────────────────────┐
│                    CURSORFLOW - CLOUD INFRASTRUCTURE           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Frontend] → [Vercel Edge Network] → [Global CDN]             │
│      ↓              ↓              ↓                           │
│  Next.js App    Edge Functions   Static Assets                 │
│  (React/TS)     (API Routes)     (Images/Fonts)                │
│                                                                 │
│  [Backend] → [Vercel Functions] → [Serverless Runtime]         │
│      ↓              ↓              ↓                           │
│  Node.js/TS     API Endpoints    Auto-scaling                  │
│  (Express)      (REST/GraphQL)   (0-1000 instances)            │
│                                                                 │
│  [Database] → [Firestore] → [Google Cloud]                     │
│      ↓              ↓              ↓                           │
│  NoSQL DB       Real-time        Global Distribution           │
│  (Collections)   Sync            (Multi-region)                │
│                                                                 │
│  [External APIs] → [OpenAI] → [v0 Platform] → [Stripe]         │
│      ↓              ↓              ↓              ↓             │
│  API Gateway    GPT-4 Models    Code Gen        Payments       │
│  (Rate Limiting) (Text Gen)     (Frontend)      (Subscriptions)│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Deployment Platforms

### **1. Vercel (Primary Platform)**

#### **Frontend Deployment**
```json
// vercel.json
{
  "version": 2,
  "name": "cursorflow-frontend",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "api/**/*.ts": {
      "runtime": "nodejs18.x",
      "maxDuration": 30
    }
  }
}
```

#### **Backend API Deployment**
```typescript
// api/index.ts
import express from 'express';
import cors from 'cors';
import { prdRoutes } from './routes/prd';
import { projectRoutes } from './routes/project';
import { authRoutes } from './routes/auth';
import { errorHandler } from './middleware/error-handler';

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://cursorflow.com',
    'https://app.cursorflow.com',
    'http://localhost:3000' // Development only
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/prds', prdRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);

// Error handling
app.use(errorHandler);

export default app;
```

### **2. Firebase (Database & Authentication)**

#### **Firestore Configuration**
```typescript
// config/firebase.ts
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

export const db = getFirestore(app);
```

#### **Firestore Security Rules**
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // PRDs belong to users
    match /prds/{prdId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Projects belong to users
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Analytics are user-specific
    match /analytics/{analyticsId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🔧 Environment Configuration

### **Environment Variables**
```bash
# Production Environment Variables
NODE_ENV=production
PORT=3000

# OpenAI Configuration
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4

# v0 Platform Configuration
V0_API_KEY=v0_...
V0_BASE_URL=https://api.v0.dev

# Firebase Configuration
FIREBASE_PROJECT_ID=cursorflow-prod
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@cursorflow-prod.iam.gserviceaccount.com

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Application Configuration
NEXT_PUBLIC_APP_URL=https://cursorflow.com
NEXT_PUBLIC_API_URL=https://api.cursorflow.com
```

### **Environment Management**
```typescript
// config/environment.ts
export const config = {
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // URLs
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  
  // OpenAI
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
    model: process.env.OPENAI_MODEL || 'gpt-4',
    maxTokens: 4000,
  },
  
  // v0 Platform
  v0: {
    apiKey: process.env.V0_API_KEY!,
    baseUrl: process.env.V0_BASE_URL || 'https://api.v0.dev',
  },
  
  // Firebase
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
};
```

## 🔄 CI/CD Pipeline

### **GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run linting
        run: npm run lint
      
      - name: Type check
        run: npm run type-check

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_APP_URL: ${{ secrets.NEXT_PUBLIC_APP_URL }}
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### **Vercel Configuration**
```json
// vercel.json
{
  "version": 2,
  "name": "cursorflow",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1",
      "headers": {
        "Access-Control-Allow-Origin": "https://cursorflow.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    }
  ],
  "functions": {
    "api/**/*.ts": {
      "runtime": "nodejs18.x",
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  },
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
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## 📊 Monitoring & Observability

### **Vercel Analytics**
```typescript
// utils/analytics.ts
import { Analytics } from '@vercel/analytics/react';

export function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
```

### **Error Tracking with Sentry**
```typescript
// utils/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', 'cursorflow.com'],
    }),
  ],
});

export { Sentry };
```

### **Performance Monitoring**
```typescript
// middleware/performance.ts
import { NextApiRequest, NextApiResponse } from 'next';

export function performanceMiddleware(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const start = Date.now();
    
    try {
      await handler(req, res);
    } finally {
      const duration = Date.now() - start;
      
      // Log performance metrics
      console.log({
        method: req.method,
        url: req.url,
        duration,
        statusCode: res.statusCode,
      });
      
      // Track slow requests
      if (duration > 1000) {
        console.warn(`Slow request: ${req.method} ${req.url} took ${duration}ms`);
      }
    }
  };
}
```

## 🔒 Security Configuration

### **CORS Configuration**
```typescript
// middleware/cors.ts
import cors from 'cors';

const corsOptions = {
  origin: [
    'https://cursorflow.com',
    'https://app.cursorflow.com',
    'http://localhost:3000' // Development only
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
};

export const corsMiddleware = cors(corsOptions);
```

### **Rate Limiting**
```typescript
// middleware/rate-limit.ts
import rateLimit from 'express-rate-limit';

const planLimits = {
  free: 100,
  pro: 1000,
  team: 5000,
};

export const createRateLimiter = (plan: string = 'free') => {
  const limit = planLimits[plan] || planLimits.free;
  
  return rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: limit,
    message: {
      error: 'Rate limit exceeded',
      limit,
      windowMs: 60 * 60 * 1000,
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.userId || req.ip,
  });
};
```

## 🚀 Deployment Commands

### **Local Development**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### **Production Deployment**
```bash
# Deploy to Vercel
vercel --prod

# Deploy with environment variables
vercel --prod --env NODE_ENV=production

# Deploy specific functions
vercel --prod --scope api
```

### **Database Migration**
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# Deploy all Firebase resources
firebase deploy
```

## 📈 Scaling Strategy

### **Auto-scaling Configuration**
```typescript
// config/scaling.ts
export const scalingConfig = {
  // Vercel Functions
  functions: {
    maxDuration: 30, // seconds
    maxInstances: 1000,
    minInstances: 0,
  },
  
  // Database
  firestore: {
    maxConnections: 100,
    timeout: 30000, // 30 seconds
  },
  
  // External APIs
  openai: {
    maxConcurrent: 10,
    timeout: 60000, // 60 seconds
  },
  
  v0: {
    maxConcurrent: 5,
    timeout: 120000, // 2 minutes
  },
};
```

### **Caching Strategy**
```typescript
// utils/cache.ts
import { LRUCache } from 'lru-cache';

const cache = new LRUCache({
  max: 500, // Maximum number of items
  ttl: 1000 * 60 * 5, // 5 minutes
  updateAgeOnGet: true,
});

export const cacheMiddleware = (duration: number = 300) => {
  return (req: any, res: any, next: any) => {
    const key = `${req.method}:${req.url}`;
    const cached = cache.get(key);
    
    if (cached) {
      return res.json(cached);
    }
    
    const originalSend = res.json;
    res.json = function(data: any) {
      cache.set(key, data, { ttl: duration * 1000 });
      return originalSend.call(this, data);
    };
    
    next();
  };
};
```

---

**Next Steps**: Review [`TESTING.md`](./TESTING.md) for comprehensive testing strategy and [`BUSINESS_MODEL.md`](./BUSINESS_MODEL.md) for business model and go-to-market plan. 