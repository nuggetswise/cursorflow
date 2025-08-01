# Deployment & Infrastructure
*Team: DevOps Team*

## 🚀 **Deployment Strategy**

### **Infrastructure Overview**

#### **Multi-Environment Setup**
```
┌─────────────────────────────────────────────────────────────┐
│                    🏗️ Infrastructure Architecture          │
│                                                             │
│  🌐 **Production**                                         │
│  • Frontend: Vercel (nuggetwise.com)                      │
│  • Backend: Railway/Heroku (API services)                 │
│  • Database: Supabase (PostgreSQL)                        │
│  • Cache: Redis Cloud                                      │
│  • CDN: Cloudflare                                         │
│                                                             │
│  🧪 **Staging**                                            │
│  • Frontend: Vercel Preview                                │
│  • Backend: Railway/Heroku (staging)                      │
│  • Database: Supabase (staging)                           │
│  • Cache: Redis Cloud (staging)                           │
│                                                             │
│  🔧 **Development**                                        │
│  • Local development environment                          │
│  • Docker containers                                       │
│  • Local databases                                         │
└─────────────────────────────────────────────────────────────┘
```

### **Frontend Deployment (nuggetwise.com)**

#### **Vercel Configuration**
```json
// vercel.json
{
  "version": 2,
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
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.nuggetwise.com",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": "@stripe-publishable-key"
  }
}
```

#### **Environment Variables**
```bash
# Production
NEXT_PUBLIC_API_URL=https://api.nuggetwise.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=XXXXXXXXXX

# Staging
NEXT_PUBLIC_API_URL=https://api-staging.nuggetwise.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### **Build Process**
```yaml
# GitHub Actions - Frontend
name: Deploy Frontend
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build application
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### **Backend Deployment (API Services)**

#### **Railway Configuration**
```json
// railway.json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### **Docker Configuration**
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### **Environment Variables**
```bash
# Production
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
V0_API_KEY=your-v0-api-key
SENTRY_DSN=https://...
```

### **Database Setup (Supabase)**

#### **Database Schema**
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  v0_api_key VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  subscription_status VARCHAR(50) DEFAULT 'free',
  subscription_plan VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Installations table
CREATE TABLE installations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  mcp_config JSONB,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Usage table
CREATE TABLE usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feature VARCHAR(100) NOT NULL,
  usage_count INTEGER DEFAULT 1,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_installations_user_id ON installations(user_id);
CREATE INDEX idx_usage_user_id ON usage(user_id);
CREATE INDEX idx_usage_created_at ON usage(created_at);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
```

#### **Row Level Security (RLS)**
```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Installations policy
CREATE POLICY "Users can view own installations" ON installations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own installations" ON installations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usage policy
CREATE POLICY "Users can view own usage" ON usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own usage" ON usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions policy
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### **Monitoring & Observability**

#### **Application Monitoring**
```typescript
// Sentry configuration
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
  ],
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
    services: {
      database: await checkDatabaseConnection(),
      redis: await checkRedisConnection(),
      stripe: await checkStripeConnection(),
      v0: await checkV0API()
    }
  };
  
  const isHealthy = Object.values(health.services).every(service => service.status === 'healthy');
  res.status(isHealthy ? 200 : 503).json(health);
});
```

#### **Performance Monitoring**
```typescript
// Prometheus metrics
import prometheus from 'prom-client';

const collectDefaultMetrics = prometheus.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Custom metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const componentGenerations = new prometheus.Counter({
  name: 'component_generations_total',
  help: 'Total number of component generations'
});

// Metrics endpoint
app.get('/api/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});
```

#### **Logging Strategy**
```typescript
// Winston logger configuration
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'nuggetwise-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### **CI/CD Pipeline**

#### **GitHub Actions Workflow**
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
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL_TEST }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY_TEST }}
      
      - name: Run type check
        run: npm run type-check

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.0.0
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: nuggetwise-api
```

### **Security & Compliance**

#### **Security Headers**
```typescript
// Security middleware
import helmet from 'helmet';
import cors from 'cors';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

#### **Rate Limiting**
```typescript
// Rate limiting middleware
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Stricter limits for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later.',
});

app.use('/api/auth/', authLimiter);
```

#### **Data Encryption**
```typescript
// Encryption utilities
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = process.env.ENCRYPTION_KEY;

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, secretKey);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

export const decrypt = (text: string): string => {
  const [ivHex, encrypted] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipher(algorithm, secretKey);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
```

### **Backup & Disaster Recovery**

#### **Database Backups**
```bash
#!/bin/bash
# backup.sh

# Daily backup script
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_URL="postgresql://user:pass@host:port/db"

# Create backup
pg_dump $DB_URL > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Upload to cloud storage
aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://nuggetwise-backups/

# Clean up old backups (keep last 30 days)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

#### **Disaster Recovery Plan**
```markdown
# Disaster Recovery Plan

## 1. Database Failure
- **Detection**: Health check endpoint returns 503
- **Recovery**: Restore from latest backup
- **Time to Recovery**: 15 minutes

## 2. Application Server Failure
- **Detection**: Health check endpoint timeout
- **Recovery**: Auto-restart via Railway/Heroku
- **Time to Recovery**: 2 minutes

## 3. Frontend Failure
- **Detection**: Vercel deployment failure
- **Recovery**: Rollback to previous deployment
- **Time to Recovery**: 5 minutes

## 4. Complete System Failure
- **Detection**: All health checks failing
- **Recovery**: Manual intervention required
- **Time to Recovery**: 30 minutes
```

### **Performance Optimization**

#### **Caching Strategy**
```typescript
// Redis caching
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache middleware
const cache = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      // Store original send function
      const originalSend = res.json;
      
      // Override send function
      res.json = function(data) {
        redis.setex(key, duration, JSON.stringify(data));
        return originalSend.call(this, data);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};

// Usage
app.get('/api/analytics', cache(300), async (req, res) => {
  // Analytics data cached for 5 minutes
});
```

#### **Database Optimization**
```sql
-- Query optimization
EXPLAIN ANALYZE SELECT 
  u.email,
  COUNT(ug.id) as generation_count
FROM users u
LEFT JOIN usage ug ON u.id = ug.user_id 
  AND ug.feature = 'component_generation'
  AND ug.created_at >= NOW() - INTERVAL '30 days'
WHERE u.subscription_status = 'pro'
GROUP BY u.id, u.email
ORDER BY generation_count DESC;

-- Index optimization
CREATE INDEX CONCURRENTLY idx_usage_user_feature_date 
ON usage(user_id, feature, created_at);

-- Partitioning for large tables
CREATE TABLE usage_partitioned (
  LIKE usage INCLUDING ALL
) PARTITION BY RANGE (created_at);

CREATE TABLE usage_2025_01 PARTITION OF usage_partitioned
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

### **Scaling Strategy**

#### **Horizontal Scaling**
```yaml
# Docker Compose for local scaling
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - api
```

#### **Load Balancing**
```nginx
# nginx.conf
upstream api_servers {
    server api:3000;
    server api:3001;
    server api:3002;
}

server {
    listen 80;
    server_name api.nuggetwise.com;

    location / {
        proxy_pass http://api_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

*This document is part of the Magic Nuggetwise implementation plan. See `magicnuggetwiseaug1.md` for the complete overview.* 