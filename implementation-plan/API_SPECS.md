# CursorFlow - API Specifications

## 🔌 API Overview

This document outlines all API endpoints, integrations, and data structures for the CursorFlow platform.

## 🌐 External API Integrations

### **1. OpenAI APIs**

#### **PRD Generation API**
```typescript
// Endpoint: POST /api/openai/generate-prd
interface GeneratePRDRequest {
  description: string;
  template: 'basic' | 'detailed' | 'technical' | 'user-story';
  requirements: string[];
  targetAudience: string;
}

interface GeneratePRDResponse {
  prd: {
    id: string;
    title: string;
    description: string;
    features: Feature[];
    userStories: UserStory[];
    technicalRequirements: TechnicalRequirement[];
    createdAt: Date;
  };
  success: boolean;
  error?: string;
}
```

#### **Backend Code Generation API**
```typescript
// Endpoint: POST /api/openai/generate-backend
interface GenerateBackendRequest {
  prdId: string;
  requirements: {
    database: string[];
    apis: string[];
    authentication: boolean;
    externalIntegrations: string[];
  };
}

interface GenerateBackendResponse {
  backendCode: {
    apiRoutes: string;
    databaseSchema: string;
    environmentVariables: string;
    businessLogic: string;
  };
  success: boolean;
  error?: string;
}
```

#### **Code Analysis API**
```typescript
// Endpoint: POST /api/openai/analyze-code
interface AnalyzeCodeRequest {
  frontendCode: string;
  backendCode: string;
  userBehavior: string;
}

interface AnalyzeCodeResponse {
  analysis: {
    uxInsights: UXInsight[];
    designSuggestions: DesignSuggestion[];
    performanceRecommendations: PerformanceRecommendation[];
    userFlowPredictions: UserFlowPrediction[];
  };
  success: boolean;
  error?: string;
}
```

### **2. v0 Platform API**

#### **Chat Creation API**
```typescript
// Endpoint: POST /api/v0/create-chat
interface CreateV0ChatRequest {
  prd: string;
  backendRequirements: string;
  designPreferences: {
    style: 'modern' | 'minimal' | 'corporate' | 'creative';
    colorScheme: string;
    components: string[];
  };
}

interface CreateV0ChatResponse {
  chatId: string;
  projectUrl: string;
  deploymentUrl: string;
  success: boolean;
  error?: string;
}
```

#### **Code Generation API**
```typescript
// Endpoint: POST /api/v0/generate-code
interface GenerateV0CodeRequest {
  chatId: string;
  requirements: string;
  changes?: string;
}

interface GenerateV0CodeResponse {
  code: {
    frontend: string;
    components: Component[];
    styles: string;
  };
  deploymentUrl: string;
  success: boolean;
  error?: string;
}
```

#### **Project Management API**
```typescript
// Endpoint: GET /api/v0/projects
interface GetV0ProjectsResponse {
  projects: {
    id: string;
    name: string;
    url: string;
    createdAt: Date;
    lastModified: Date;
  }[];
  success: boolean;
  error?: string;
}

// Endpoint: DELETE /api/v0/projects/:id
interface DeleteV0ProjectResponse {
  success: boolean;
  error?: string;
}
```

### **3. Stripe API (Billing)**

#### **Subscription Management**
```typescript
// Endpoint: POST /api/stripe/create-subscription
interface CreateSubscriptionRequest {
  customerId: string;
  priceId: string;
  metadata?: Record<string, string>;
}

interface CreateSubscriptionResponse {
  subscriptionId: string;
  status: string;
  currentPeriodEnd: Date;
  success: boolean;
  error?: string;
}

// Endpoint: GET /api/stripe/subscriptions/:id
interface GetSubscriptionResponse {
  subscription: {
    id: string;
    status: string;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
  };
  success: boolean;
  error?: string;
}
```

## 🔧 Internal API Endpoints

### **1. PRD Management**

#### **Create PRD**
```typescript
// Endpoint: POST /api/prds
interface CreatePRDRequest {
  title: string;
  description: string;
  template: string;
  features: Feature[];
  userStories: UserStory[];
  technicalRequirements: TechnicalRequirement[];
  userId: string;
}

interface CreatePRDResponse {
  prd: PRD;
  success: boolean;
  error?: string;
}
```

#### **Get PRDs**
```typescript
// Endpoint: GET /api/prds
interface GetPRDsRequest {
  userId: string;
  limit?: number;
  offset?: number;
  status?: 'draft' | 'active' | 'archived';
}

interface GetPRDsResponse {
  prds: PRD[];
  total: number;
  success: boolean;
  error?: string;
}
```

#### **Update PRD**
```typescript
// Endpoint: PUT /api/prds/:id
interface UpdatePRDRequest {
  title?: string;
  description?: string;
  features?: Feature[];
  userStories?: UserStory[];
  technicalRequirements?: TechnicalRequirement[];
}

interface UpdatePRDResponse {
  prd: PRD;
  success: boolean;
  error?: string;
}
```

### **2. Project Management**

#### **Create Project**
```typescript
// Endpoint: POST /api/projects
interface CreateProjectRequest {
  prdId: string;
  v0ChatId: string;
  deploymentUrl: string;
  userId: string;
}

interface CreateProjectResponse {
  project: Project;
  success: boolean;
  error?: string;
}
```

#### **Get Projects**
```typescript
// Endpoint: GET /api/projects
interface GetProjectsRequest {
  userId: string;
  limit?: number;
  offset?: number;
}

interface GetProjectsResponse {
  projects: Project[];
  total: number;
  success: boolean;
  error?: string;
}
```

### **3. Code Analysis**

#### **Analyze Project**
```typescript
// Endpoint: POST /api/analysis/analyze
interface AnalyzeProjectRequest {
  projectId: string;
  frontendCode: string;
  backendCode: string;
}

interface AnalyzeProjectResponse {
  analysis: {
    uxScore: number;
    performanceScore: number;
    suggestions: Suggestion[];
    userFlow: UserFlow[];
  };
  success: boolean;
  error?: string;
}
```

### **4. AI Design Critique**

#### **Audit Live Preview**
```typescript
// Endpoint: POST /api/audit/analyze
interface AuditRequest {
  url: string;
  projectId?: string;
  auditType?: 'full' | 'performance' | 'accessibility' | 'copy';
}

interface AuditResponse {
  audit: {
    headlineGrade: number; // 1-10 score
    frictionPoints: FrictionPoint[];
    performanceScore: number; // 0-100
    accessibilityViolations: AccessibilityViolation[];
    suggestions: AuditSuggestion[];
    copyAnalysis: {
      readabilityScore: number;
      clarityIssues: string[];
      improvementSuggestions: string[];
    };
    performanceMetrics: {
      firstContentfulPaint: number;
      largestContentfulPaint: number;
      cumulativeLayoutShift: number;
      firstInputDelay: number;
      speedIndex: number;
    };
    accessibilityMetrics: {
      violations: number;
      passes: number;
      incomplete: number;
      inapplicable: number;
    };
  };
  success: boolean;
  error?: string;
}

interface FrictionPoint {
  type: 'copy' | 'ux' | 'performance' | 'accessibility';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  suggestion: string;
}

interface AccessibilityViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  nodes: Array<{
    html: string;
    target: string[];
  }>;
}

interface AuditSuggestion {
  category: 'copy' | 'ux' | 'performance' | 'accessibility';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  implementation: string;
  estimatedImpact: string;
}
```

#### **Get Audit History**
```typescript
// Endpoint: GET /api/audit/history
interface GetAuditHistoryRequest {
  projectId: string;
  limit?: number;
  offset?: number;
}

interface GetAuditHistoryResponse {
  audits: Array<{
    id: string;
    projectId: string;
    url: string;
    createdAt: Date;
    headlineGrade: number;
    performanceScore: number;
    accessibilityViolations: number;
    suggestionsCount: number;
  }>;
  total: number;
  success: boolean;
  error?: string;
}
```

### **4. User Management**

#### **Authentication**
```typescript
// Endpoint: POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
  success: boolean;
  error?: string;
}

// Endpoint: POST /api/auth/register
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface RegisterResponse {
  user: User;
  token: string;
  success: boolean;
  error?: string;
}
```

## 📊 Data Models

### **PRD Model**
```typescript
interface PRD {
  id: string;
  title: string;
  description: string;
  template: string;
  features: Feature[];
  userStories: UserStory[];
  technicalRequirements: TechnicalRequirement[];
  userId: string;
  status: 'draft' | 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

interface Feature {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  acceptanceCriteria: string[];
}

interface UserStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: number;
}

interface TechnicalRequirement {
  id: string;
  category: 'frontend' | 'backend' | 'database' | 'integration';
  requirement: string;
  priority: 'low' | 'medium' | 'high';
}
```

### **Project Model**
```typescript
interface Project {
  id: string;
  prdId: string;
  v0ChatId: string;
  deploymentUrl: string;
  userId: string;
  status: 'generating' | 'active' | 'archived';
  versions: ProjectVersion[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectVersion {
  id: string;
  version: number;
  deploymentUrl: string;
  changes: string;
  createdAt: Date;
}
```

### **User Model**
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  subscription: {
    plan: 'free' | 'pro' | 'team';
    status: 'active' | 'canceled' | 'past_due';
    currentPeriodEnd: Date;
  };
  usage: {
    prdsCreated: number;
    projectsGenerated: number;
    apiCalls: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔐 Authentication & Security

### **JWT Token Structure**
```typescript
interface JWTPayload {
  userId: string;
  email: string;
  plan: string;
  iat: number;
  exp: number;
}
```

### **API Rate Limiting**
- **Free Plan**: 100 requests/hour
- **Pro Plan**: 1000 requests/hour
- **Team Plan**: 5000 requests/hour

### **CORS Configuration**
```typescript
const corsOptions = {
  origin: [
    'https://cursorflow.com',
    'https://app.cursorflow.com',
    'http://localhost:3000' // Development only
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

## 🚨 Error Handling

### **Standard Error Response**
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: Date;
}
```

### **Error Codes**
- `AUTH_REQUIRED`: Authentication required
- `INVALID_INPUT`: Invalid request data
- `RATE_LIMITED`: Rate limit exceeded
- `API_ERROR`: External API error
- `NOT_FOUND`: Resource not found
- `PERMISSION_DENIED`: Insufficient permissions

## 📈 Monitoring & Analytics

### **API Metrics**
- Request count by endpoint
- Response times
- Error rates
- User activity patterns

### **Usage Tracking**
- PRDs created per user
- Projects generated per user
- API calls per user
- Feature usage statistics

---

**Next Steps**: Review [`FRONTEND_SPECS.md`](./FRONTEND_SPECS.md) for frontend implementation details and [`BACKEND_SPECS.md`](./BACKEND_SPECS.md) for backend service specifications. 