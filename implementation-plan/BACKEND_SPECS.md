# CursorFlow - Backend Specifications

## 🔧 Backend Overview

The CursorFlow backend is a Node.js/TypeScript application providing serverless API services for PRD generation, project management, and code analysis. It integrates with OpenAI APIs, v0 Platform, and Firestore for data persistence.

## 🛠️ Technology Stack

### **Core Technologies**
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js with serverless functions
- **Database**: Firestore (NoSQL)
- **Authentication**: JWT tokens
- **Deployment**: Vercel Functions

### **Key Libraries**
- **HTTP Framework**: Express.js
- **Database**: Firebase Admin SDK
- **Validation**: Zod
- **HTTP Client**: Axios
- **Logging**: Winston
- **Testing**: Jest + Supertest

## 🏗️ Service Architecture

### **1. PRD Service**
```typescript
// services/prd.service.ts
interface PRDService {
  generatePRD(description: string, template: string): Promise<PRD>;
  savePRD(prd: PRD): Promise<string>;
  getPRD(id: string): Promise<PRD | null>;
  updatePRD(id: string, updates: Partial<PRD>): Promise<PRD>;
  deletePRD(id: string): Promise<boolean>;
  listPRDs(userId: string, filters?: PRDFilters): Promise<PRD[]>;
}

class PRDServiceImpl implements PRDService {
  constructor(
    private openaiClient: OpenAI,
    private firestore: Firestore
  ) {}

  async generatePRD(description: string, template: string): Promise<PRD> {
    const prompt = this.buildPRDPrompt(description, template);
    const response = await this.openaiClient.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return this.parsePRDResponse(response.choices[0].message.content);
  }

  private buildPRDPrompt(description: string, template: string): string {
    return `
      Generate a Product Requirements Document (PRD) for the following product:
      
      Description: ${description}
      Template: ${template}
      
      Please structure the response as a JSON object with the following fields:
      - title: string
      - description: string
      - features: array of feature objects
      - userStories: array of user story objects
      - technicalRequirements: array of technical requirement objects
    `;
  }
}
```

### **2. Backend Code Generation Service**
```typescript
// services/backend-generation.service.ts
interface BackendGenerationService {
  generateBackendCode(prd: PRD, requirements: BackendRequirements): Promise<BackendCode>;
  generateEnvironmentVariables(requirements: BackendRequirements): Promise<string>;
  generateDatabaseSchema(requirements: BackendRequirements): Promise<string>;
  generateAPIRoutes(requirements: BackendRequirements): Promise<string>;
}

class BackendGenerationServiceImpl implements BackendGenerationService {
  constructor(private openaiClient: OpenAI) {}

  async generateBackendCode(prd: PRD, requirements: BackendRequirements): Promise<BackendCode> {
    const prompt = this.buildBackendPrompt(prd, requirements);
    const response = await this.openaiClient.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    return this.parseBackendResponse(response.choices[0].message.content);
  }

  private buildBackendPrompt(prd: PRD, requirements: BackendRequirements): string {
    return `
      Generate backend code for the following PRD:
      
      PRD: ${JSON.stringify(prd)}
      Requirements: ${JSON.stringify(requirements)}
      
      Generate the following:
      1. API routes (Express.js)
      2. Database schema (Firestore)
      3. Environment variables
      4. Business logic functions
      
      Return as structured JSON with separate fields for each component.
    `;
  }
}
```

### **3. v0 Integration Service**
```typescript
// services/v0-integration.service.ts
interface V0IntegrationService {
  createChat(prd: string, backendRequirements: string): Promise<V0Chat>;
  generateCode(chatId: string, requirements: string): Promise<V0Code>;
  getProjects(): Promise<V0Project[]>;
  deleteProject(projectId: string): Promise<boolean>;
}

class V0IntegrationServiceImpl implements V0IntegrationService {
  constructor(
    private v0Client: V0Client,
    private config: Config
  ) {}

  async createChat(prd: string, backendRequirements: string): Promise<V0Chat> {
    const response = await this.v0Client.post('/chats', {
      prompt: this.buildV0Prompt(prd, backendRequirements),
      model: 'gpt-4',
      temperature: 0.7,
    });

    return {
      chatId: response.data.id,
      projectUrl: response.data.project_url,
      deploymentUrl: response.data.deployment_url,
    };
  }

  private buildV0Prompt(prd: string, backendRequirements: string): string {
    return `
      Create a full-stack web application based on this PRD:
      
      ${prd}
      
      Backend Requirements:
      ${backendRequirements}
      
      Generate a modern, responsive web application with:
      - Clean, professional UI design
      - Proper component structure
      - Responsive layout
      - Modern styling with Tailwind CSS
    `;
  }
}
```

### **4. Code Analysis Service**
```typescript
// services/code-analysis.service.ts
interface CodeAnalysisService {
  analyzeFrontendCode(code: string): Promise<FrontendAnalysis>;
  analyzeBackendCode(code: string): Promise<BackendAnalysis>;
  generateDesignSuggestions(analysis: CodeAnalysis): Promise<DesignSuggestion[]>;
  predictUserBehavior(analysis: CodeAnalysis): Promise<UserBehaviorPrediction[]>;
}

class CodeAnalysisServiceImpl implements CodeAnalysisService {
  constructor(private openaiClient: OpenAI) {}

  async analyzeFrontendCode(code: string): Promise<FrontendAnalysis> {
    const prompt = this.buildAnalysisPrompt(code, 'frontend');
    const response = await this.openaiClient.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    return this.parseFrontendAnalysis(response.choices[0].message.content);
  }

  private buildAnalysisPrompt(code: string, type: 'frontend' | 'backend'): string {
    return `
      Analyze the following ${type} code and provide insights:
      
      Code:
      ${code}
      
      Please analyze:
      1. Code structure and organization
      2. Performance considerations
      3. Security implications
      4. User experience impact
      5. Potential improvements
      
      Return as structured JSON with specific recommendations.
    `;
  }
}

### **5. AI Design Critique Service**
```typescript
// services/ai-design-critique.service.ts
interface AIDesignCritiqueService {
  auditLivePreview(url: string, auditType?: AuditType): Promise<DesignAudit>;
  extractSignals(pageData: PageData): Promise<AuditSignals>;
  generateInsights(signals: AuditSignals): Promise<AuditInsights>;
  capturePage(url: string): Promise<PageData>;
}

class AIDesignCritiqueServiceImpl implements AIDesignCritiqueService {
  constructor(
    private openaiClient: OpenAI,
    private puppeteer: Puppeteer,
    private lighthouse: Lighthouse,
    private axe: AxeCore
  ) {}

  async auditLivePreview(url: string, auditType: AuditType = 'full'): Promise<DesignAudit> {
    // 1. Capture page with Puppeteer
    const pageData = await this.capturePage(url);
    
    // 2. Extract signals
    const signals = await this.extractSignals(pageData);
    
    // 3. Generate insights with LLM
    const insights = await this.generateInsights(signals);
    
    return {
      headlineGrade: insights.headlineGrade,
      frictionPoints: insights.frictionPoints,
      performanceScore: signals.performanceScore,
      accessibilityViolations: signals.accessibilityViolations,
      suggestions: insights.suggestions,
      copyAnalysis: signals.copyAnalysis,
      performanceMetrics: signals.performanceMetrics,
      accessibilityMetrics: signals.accessibilityMetrics,
    };
  }

  async capturePage(url: string): Promise<PageData> {
    const browser = await this.puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    const html = await page.content();
    const screenshot = await page.screenshot({ fullPage: true });
    const title = await page.title();
    
    await browser.close();
    
    return { html, screenshot, title, url };
  }

  async extractSignals(pageData: PageData): Promise<AuditSignals> {
    // Extract copy using Readability.js
    const copyAnalysis = await this.extractCopy(pageData.html);
    
    // Run Lighthouse for performance
    const performanceMetrics = await this.lighthouse.analyze(pageData.url);
    
    // Run axe-core for accessibility
    const accessibilityViolations = await this.axe.analyze(pageData.html);
    
    return {
      copyAnalysis,
      performanceMetrics,
      accessibilityViolations,
      performanceScore: this.calculatePerformanceScore(performanceMetrics),
      accessibilityMetrics: this.calculateAccessibilityMetrics(accessibilityViolations)
    };
  }

  async generateInsights(signals: AuditSignals): Promise<AuditInsights> {
    const prompt = this.buildInsightPrompt(signals);
    const response = await this.openaiClient.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    return this.parseInsightResponse(response.choices[0].message.content);
  }

  private buildInsightPrompt(signals: AuditSignals): string {
    return `
      Analyze this web application and provide design insights:
      
      Copy Analysis: ${JSON.stringify(signals.copyAnalysis)}
      Performance Metrics: ${JSON.stringify(signals.performanceMetrics)}
      Accessibility Violations: ${JSON.stringify(signals.accessibilityViolations)}
      
      Provide structured feedback with:
      1. Headline grade (1-10)
      2. Friction points with severity levels
      3. Actionable suggestions
      4. Priority recommendations
      
      Return as JSON with the specified structure.
    `;
  }
}
```

## 🗄️ Database Schema

### **Firestore Collections**

#### **Users Collection**
```typescript
interface UserDocument {
  id: string;
  email: string;
  name: string;
  subscription: {
    plan: 'free' | 'pro' | 'team';
    status: 'active' | 'canceled' | 'past_due';
    currentPeriodEnd: Timestamp;
    stripeCustomerId: string;
  };
  usage: {
    prdsCreated: number;
    projectsGenerated: number;
    apiCalls: number;
    lastResetDate: Timestamp;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### **PRDs Collection**
```typescript
interface PRDDocument {
  id: string;
  userId: string;
  title: string;
  description: string;
  template: string;
  features: Feature[];
  userStories: UserStory[];
  technicalRequirements: TechnicalRequirement[];
  status: 'draft' | 'active' | 'archived';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### **Projects Collection**
```typescript
interface ProjectDocument {
  id: string;
  userId: string;
  prdId: string;
  v0ChatId: string;
  deploymentUrl: string;
  status: 'generating' | 'active' | 'archived';
  versions: ProjectVersion[];
  analysis: CodeAnalysis;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### **Analytics Collection**
```typescript
interface AnalyticsDocument {
  id: string;
  userId: string;
  type: 'prd_created' | 'project_generated' | 'api_call';
  metadata: Record<string, any>;
  timestamp: Timestamp;
}
```

## 🔐 Authentication & Authorization

### **JWT Token Management**
```typescript
// middleware/auth.middleware.ts
interface JWTPayload {
  userId: string;
  email: string;
  plan: string;
  iat: number;
  exp: number;
}

class AuthMiddleware {
  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

  static async checkPlan(req: Request, res: Response, next: NextFunction) {
    const { plan } = req.user;
    const requiredPlan = req.route.meta?.requiredPlan;
    
    if (requiredPlan && !this.hasPlanAccess(plan, requiredPlan)) {
      return res.status(403).json({ error: 'Plan upgrade required' });
    }
    
    next();
  }
}
```

### **Rate Limiting**
```typescript
// middleware/rate-limit.middleware.ts
import rateLimit from 'express-rate-limit';

const planLimits = {
  free: 100,
  pro: 1000,
  team: 5000,
};

export const createRateLimiter = (plan: string) => {
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
  });
};
```

## 🚨 Error Handling

### **Global Error Handler**
```typescript
// middleware/error-handler.middleware.ts
interface AppError extends Error {
  statusCode: number;
  code: string;
  details?: any;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  const code = error.code || 'INTERNAL_ERROR';

  logger.error({
    error: message,
    code,
    statusCode,
    url: req.url,
    method: req.method,
    userId: req.user?.userId,
    stack: error.stack,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details: error.details,
    },
    timestamp: new Date().toISOString(),
  });
};
```

### **Custom Error Classes**
```typescript
// errors/app-errors.ts
export class ValidationError extends Error {
  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.code = 'VALIDATION_ERROR';
    this.details = details;
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
    this.code = 'AUTH_REQUIRED';
  }
}

export class RateLimitError extends Error {
  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
    this.statusCode = 429;
    this.code = 'RATE_LIMITED';
  }
}
```

## 📊 Monitoring & Logging

### **Winston Logger Configuration**
```typescript
// utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'cursorflow-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

### **Performance Monitoring**
```typescript
// middleware/performance.middleware.ts
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info({
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userId: req.user?.userId,
    });
    
    // Track slow requests
    if (duration > 1000) {
      logger.warn({
        message: 'Slow request detected',
        method: req.method,
        url: req.url,
        duration,
      });
    }
  });
  
  next();
};
```

## 🧪 Testing Strategy

### **Unit Tests**
```typescript
// tests/services/prd.service.test.ts
describe('PRDService', () => {
  let prdService: PRDService;
  let mockOpenAI: jest.Mocked<OpenAI>;
  let mockFirestore: jest.Mocked<Firestore>;

  beforeEach(() => {
    mockOpenAI = createMockOpenAI();
    mockFirestore = createMockFirestore();
    prdService = new PRDServiceImpl(mockOpenAI, mockFirestore);
  });

  describe('generatePRD', () => {
    it('should generate PRD from description', async () => {
      const description = 'A task management app';
      const template = 'basic';
      
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{
          message: { content: JSON.stringify(mockPRDResponse) },
        }],
      });

      const result = await prdService.generatePRD(description, template);
      
      expect(result).toEqual(expect.objectContaining({
        title: expect.any(String),
        description: expect.any(String),
        features: expect.any(Array),
      }));
    });
  });
});
```

### **Integration Tests**
```typescript
// tests/integration/api.test.ts
describe('PRD API', () => {
  let app: Express;
  let authToken: string;

  beforeAll(async () => {
    app = createTestApp();
    authToken = await createTestUser();
  });

  describe('POST /api/prds', () => {
    it('should create PRD with valid data', async () => {
      const prdData = {
        title: 'Test PRD',
        description: 'Test description',
        template: 'basic',
      };

      const response = await request(app)
        .post('/api/prds')
        .set('Authorization', `Bearer ${authToken}`)
        .send(prdData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.prd).toMatchObject(prdData);
    });
  });
});
```

## 🔧 Environment Configuration

### **Environment Variables**
```typescript
// config/environment.ts
export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  // OpenAI
  openaiApiKey: process.env.OPENAI_API_KEY!,
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4',
  
  // v0 Platform
  v0ApiKey: process.env.V0_API_KEY!,
  v0BaseUrl: process.env.V0_BASE_URL || 'https://api.v0.dev',
  
  // Firebase
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID!,
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY!,
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  
  // JWT
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};
```

## 🚀 Deployment Configuration

### **Vercel Configuration**
```json
// vercel.json
{
  "version": 2,
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
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://cursorflow.com"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

---

**Next Steps**: Review [`CURSOR_EXTENSION.md`](./CURSOR_EXTENSION.md) for Cursor IDE extension development and [`DEPLOYMENT.md`](./DEPLOYMENT.md) for deployment and infrastructure setup. 