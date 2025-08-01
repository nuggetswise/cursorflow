# Backend Implementation
*Team: Backend Team*

## 🎯 **Section 3: Business Architecture & Revenue**

### **Complete Business Architecture**

#### **Frontend + Backend = Revenue Generation**
```
┌─────────────────────────────────────────────────────────────┐
│                    💰 Monetization Strategy                │
│                                                             │
│  🎯 **Frontend (nuggetwise.com)**                         │
│  • Landing page with "Add to Cursor" button               │
│  • User onboarding flow                                   │
│  • Documentation & tutorials                              │
│  • Premium features showcase                              │
│                                                             │
│  🔧 **Backend (API Services)**                            │
│  • Installation tracking & analytics                      │
│  • User onboarding progress                               │
│  • MCP server validation                                  │
│  • Premium feature management                             │
│  • Subscription & billing                                 │
│                                                             │
│  💳 **Revenue Streams**                                   │
│  • Freemium model (basic free, premium paid)              │
│  • Usage-based pricing                                    │
│  • Enterprise features                                    │
│  • Support & consulting                                    │
└─────────────────────────────────────────────────────────────┘
```

### **Backend API Services**

#### **Core API Endpoints**

##### **Installation Tracking**
```typescript
// Track installation attempts
app.post('/api/onboarding/track-installation', async (req, res) => {
  const { userId, timestamp } = req.body;
  await db.installations.create({
    userId,
    timestamp,
    status: 'attempted'
  });
});

// Validate MCP installation
app.post('/api/onboarding/validate-mcp', async (req, res) => {
  const { userId, mcpConfig } = req.body;
  const isValid = await validateMCPInstallation(mcpConfig);
  await db.installations.update({
    userId,
    status: isValid ? 'success' : 'failed'
  });
});
```

##### **User Management**
```typescript
// User registration
app.post('/api/auth/register', async (req, res) => {
  const { email, password, v0ApiKey } = req.body;
  const user = await createUser({ email, password, v0ApiKey });
  res.json({ userId: user.id, token: generateToken(user) });
});

// User authentication
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticateUser(email, password);
  res.json({ userId: user.id, token: generateToken(user) });
});

// Update user profile
app.put('/api/users/profile', auth, async (req, res) => {
  const { v0ApiKey, preferences } = req.body;
  await updateUserProfile(req.user.id, { v0ApiKey, preferences });
  res.json({ success: true });
});
```

##### **Usage Analytics**
```typescript
// Track component generation
app.post('/api/analytics/track-usage', async (req, res) => {
  const { userId, feature, usage, metadata } = req.body;
  await db.usage.create({
    userId,
    feature,
    usage,
    metadata,
    timestamp: Date.now()
  });
});

// Get user analytics
app.get('/api/analytics/user/:userId', auth, async (req, res) => {
  const analytics = await getUserAnalytics(req.params.userId);
  res.json(analytics);
});
```

##### **Premium Feature Management**
```typescript
// Check feature access
app.get('/api/features/check/:feature', auth, async (req, res) => {
  const hasAccess = await checkFeatureAccess(req.user.id, req.params.feature);
  res.json({ hasAccess });
});

// Upgrade to premium
app.post('/api/premium/upgrade', auth, async (req, res) => {
  const { plan } = req.body;
  const subscription = await stripe.subscriptions.create({
    customer: req.user.stripeCustomerId,
    items: [{ price: plan }]
  });
  await updateUserSubscription(req.user.id, subscription);
  res.json({ success: true });
});
```

### **Database Schema**

#### **Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  v0_api_key VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  subscription_status VARCHAR(50) DEFAULT 'free',
  subscription_plan VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Installations Table**
```sql
CREATE TABLE installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  status VARCHAR(50) NOT NULL,
  mcp_config JSONB,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Usage Table**
```sql
CREATE TABLE usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  feature VARCHAR(100) NOT NULL,
  usage_count INTEGER DEFAULT 1,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **Subscriptions Table**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Business Model & Revenue Streams**

#### **Freemium Model**
```
┌─────────────────────────────────────────────────────────────┐
│                    💰 Pricing Tiers                        │
│                                                             │
│  🆓 **Free Tier**                                         │
│  • 10 component generations per month                      │
│  • Basic V0 integration                                   │
│  • Community support                                      │
│  • Standard response time                                 │
│                                                             │
│  💎 **Pro Tier ($19/month)**                              │
│  • Unlimited component generations                         │
│  • Advanced V0 features                                   │
│  • Priority support                                       │
│  • Custom project templates                               │
│  • Usage analytics                                        │
│                                                             │
│  🏢 **Enterprise ($99/month)**                            │
│  • Team collaboration                                     │
│  • Custom integrations                                    │
│  • Dedicated support                                      │
│  • Advanced analytics                                     │
│  • White-label options                                    │
└─────────────────────────────────────────────────────────────┘
```

#### **Revenue Tracking & Analytics**
```typescript
// Key metrics to track
const businessMetrics = {
  // User acquisition
  installations: 'Number of MCP server installations',
  onboardingCompletion: 'Users who complete setup',
  
  // User engagement
  monthlyActiveUsers: 'Users generating components',
  componentGenerations: 'Total components created',
  
  // Revenue
  conversionRate: 'Free to paid conversion',
  monthlyRecurringRevenue: 'MRR from subscriptions',
  customerLifetimeValue: 'CLV per customer'
};
```

#### **Monetization Strategy**
1. **Land & Expand**: Free tier to get users hooked
2. **Value-Based Pricing**: Charge for advanced features
3. **Usage-Based**: Pay per component generation
4. **Enterprise Sales**: Custom solutions for teams
5. **Marketplace**: Premium templates and components

### **Payment Integration**

#### **Stripe Integration**
```typescript
// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create customer
app.post('/api/stripe/create-customer', auth, async (req, res) => {
  const customer = await stripe.customers.create({
    email: req.user.email,
    metadata: { userId: req.user.id }
  });
  await updateUserStripeCustomerId(req.user.id, customer.id);
  res.json({ customerId: customer.id });
});

// Create subscription
app.post('/api/stripe/create-subscription', auth, async (req, res) => {
  const { priceId } = req.body;
  const subscription = await stripe.subscriptions.create({
    customer: req.user.stripeCustomerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent']
  });
  res.json({ subscriptionId: subscription.id });
});
```

#### **Usage-Based Billing**
```typescript
// Track usage for billing
app.post('/api/billing/track-usage', auth, async (req, res) => {
  const { usage } = req.body;
  
  // Record usage
  await db.usage.create({
    userId: req.user.id,
    feature: 'component_generation',
    usage: usage
  });
  
  // Check if user exceeded free tier
  const monthlyUsage = await getMonthlyUsage(req.user.id);
  if (monthlyUsage > 10 && req.user.subscriptionStatus === 'free') {
    // Trigger upgrade prompt
    await sendUpgradeEmail(req.user.email);
  }
  
  res.json({ success: true });
});
```

### **Analytics & Monitoring**

#### **Key Performance Indicators**
```typescript
// Track KPIs
const kpis = {
  // User Acquisition
  installations: await countInstallations(),
  onboardingCompletion: await calculateOnboardingRate(),
  
  // User Engagement
  dailyActiveUsers: await getDailyActiveUsers(),
  monthlyActiveUsers: await getMonthlyActiveUsers(),
  averageSessionDuration: await getAverageSessionDuration(),
  
  // Revenue
  monthlyRecurringRevenue: await calculateMRR(),
  conversionRate: await calculateConversionRate(),
  churnRate: await calculateChurnRate(),
  
  // Product Usage
  componentGenerations: await countComponentGenerations(),
  averageComponentsPerUser: await getAverageComponentsPerUser(),
  featureUsage: await getFeatureUsage()
};
```

#### **Real-time Monitoring**
```typescript
// Health check endpoint
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabaseConnection(),
      stripe: await checkStripeConnection(),
      v0: await checkV0API()
    }
  };
  res.json(health);
});

// Error tracking
app.use((error, req, res, next) => {
  // Log error to monitoring service
  logger.error({
    error: error.message,
    stack: error.stack,
    userId: req.user?.id,
    endpoint: req.path,
    method: req.method
  });
  
  res.status(500).json({ error: 'Internal server error' });
});
```

### **Security & Compliance**

#### **Authentication & Authorization**
```typescript
// JWT middleware
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Rate limiting
const rateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

#### **Data Protection**
```typescript
// Encrypt sensitive data
const encryptV0ApiKey = (apiKey: string): string => {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(apiKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// Decrypt sensitive data
const decryptV0ApiKey = (encryptedApiKey: string): string => {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let decrypted = decipher.update(encryptedApiKey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
```

### **Implementation Tasks**

#### **Phase 3: Backend API Services**
- [ ] **Set up backend APIs** - Installation tracking, user analytics
- [ ] **Implement user management** - Registration, authentication, profiles
- [ ] **Add usage tracking** - Monitor component generations, feature usage
- [ ] **Create subscription system** - Stripe integration for payments
- [ ] **Build analytics dashboard** - Track key business metrics
- [ ] **Add premium features** - Advanced V0 integration, custom templates

### **Technology Stack**

#### **Backend Framework**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions

#### **Authentication & Security**
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **rate-limiter** - API rate limiting

#### **Payment & Billing**
- **Stripe** - Payment processing
- **Stripe Webhooks** - Real-time payment events
- **Usage-based billing** - Pay per component generation

#### **Monitoring & Analytics**
- **Winston** - Logging
- **Sentry** - Error tracking
- **Prometheus** - Metrics collection
- **Grafana** - Metrics visualization

### **Deployment & Infrastructure**

#### **Environment Configuration**
```bash
# Production environment variables
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
V0_API_KEY=your-v0-api-key
```

#### **Docker Configuration**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

#### **CI/CD Pipeline**
```yaml
# GitHub Actions workflow
name: Deploy Backend
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
      - name: Deploy to production
        run: npm run deploy
```

---

*This document is part of the Magic Nuggetwise implementation plan. See `magicnuggetwiseaug1.md` for the complete overview.* 