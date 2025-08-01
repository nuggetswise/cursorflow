# CursorFlow - API Specifications (MCP-First Platform)

## 🔌 API Overview

This document outlines all API endpoints, integrations, and data structures for the **MCP-First CursorFlow Platform** - with **MCP (Model Context Protocol) integration as the primary approach**.

> **Note**: CLI option documentation is available in the `../cli-option/` folder for secondary implementation details.

## 🌐 External API Integrations

### **1. Multi-LLM Provider APIs**

#### **Dynamic LLM Provider Selection**
```typescript
// Environment-based provider selection
interface LLMConfig {
  provider: 'openai' | 'gemini' | 'groq' | 'anthropic';
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

// Default models per provider
const DEFAULT_MODELS = {
  openai: 'gpt-4o',
  gemini: 'gemini-pro',
  groq: 'llama3-8b-8192',
  anthropic: 'claude-3-sonnet-20240229'
};
```

#### **PRD Generation API (MCP-First)**
```typescript
// Endpoint: POST /api/openai/generate-prd
interface GeneratePRDRequest {
  approach: 'mcp-integration';
  description: string;
  template?: 'basic' | 'detailed' | 'technical' | 'user-story';
  requirements?: string[];
  targetAudience?: string;
  userId: string;
  projectId?: string;
  provider?: 'openai' | 'gemini' | 'groq' | 'anthropic';
}

interface GeneratePRDResponse {
  prd: {
    id: string;
    title: string;
    description: string;
    approach: 'mcp-integration';
    provider: string;
    generationTime: number;
    features: Feature[];
    userStories: UserStory[];
    technicalRequirements: TechnicalRequirement[];
    orchestrationData?: any; // For MCP integration mode
  };
  success: boolean;
  error?: string;
}
```

#### **V0 Integration API**
```typescript
// Endpoint: POST /api/v0/generate
interface V0GenerateRequest {
  prompt: string;
  targetDir: string;
  context?: any;
  model?: 'v0-1.5-md' | 'v0-1.0-md';
  userId: string;
}

interface V0GenerateResponse {
  success: boolean;
  files: V0File[];
  previewUrl: string;
  performance: {
    generationTime: number;
    tokenCount: number;
    cost: number;
  };
  error?: string;
}

// Endpoint: POST /api/v0/analyze
interface V0AnalyzeRequest {
  workspace: string;
  context?: any;
  userId: string;
}

interface V0AnalyzeResponse {
  success: boolean;
  analysis: {
    existingComponents: string[];
    stylingFramework: string;
    architecture: string;
    suggestions: string[];
  };
  error?: string;
}

// Endpoint: GET /api/v0/history
interface V0HistoryRequest {
  userId: string;
  limit?: number;
  offset?: number;
}

interface V0HistoryResponse {
  success: boolean;
  generations: V0Generation[];
  total: number;
  error?: string;
}
```

#### **MCP Server API**
```typescript
// Endpoint: POST /mcp/tools/v0.generate
interface V0MCPRequest {
  prompt: string;
  targetDir: string;
  context?: any;
}

interface V0MCPResponse {
  success: boolean;
  files: V0File[];
  previewUrl: string;
  performance: V0Performance;
  error?: string;
}

// Endpoint: POST /mcp/tools/v0.analyze
interface V0AnalyzeMCPRequest {
  workspace: string;
  context?: any;
}

interface V0AnalyzeMCPResponse {
  success: boolean;
  analysis: WorkspaceAnalysis;
  error?: string;
}
```

#### **7-Agent Orchestration API (MCP Integration Mode)**
```typescript
// Endpoint: POST /api/mcp/orchestrate
interface OrchestrationRequest {
  idea: string;
  userId: string;
  provider?: 'openai' | 'gemini' | 'groq' | 'anthropic';
  enableV0?: boolean;
}

interface OrchestrationResponse {
  intent: {
    goal: string;
    userRoles: string[];
    coreFeatures: any[];
    constraints: string[];
    platform: string;
    complexity: string;
  };
  uxPatterns: {
    selections: Array<{
      feature: string;
      templateId: string;
      reason: string;
      priority: number;
    }>;
    layout: {
      type: string;
      navigation: string;
      responsive: boolean;
    };
  };
  validation: {
    confidence: number;
    risks: string[];
    mvpMilestones: any[];
    recommendations: string[];
    successMetrics: string[];
  };
  v0Generation?: {
    files: V0File[];
    previewUrl: string;
    performance: V0Performance;
  };
  };
  uiRequirements: {
    components: Array<{
      name: string;
      templateId: string;
      props: any;
      milestone: number;
      dependencies: string[];
      styling: any;
    }>;
    pageStructure: any;
    dataFlow: any;
  };
  v0Prompt: string;
  diffAnalysis: any;
  notification: any;
  success: boolean;
  provider: string;
}
```

### **2. v0 Platform API (Enhanced)**

#### **MCP-First Chat Creation API**
```typescript
// Endpoint: POST /api/v0/create-chat
interface CreateV0ChatRequest {
  approach: 'mcp-integration';
  prompt: string;
  components?: Array<{
    name: string;
    templateId: string;
    props: any;
    milestone: number;
  }>;
  projectId?: string;
  userId: string;
  provider?: 'openai' | 'gemini' | 'groq' | 'anthropic';
}

interface CreateV0ChatResponse {
  success: boolean;
  data?: {
    chatId: string;
    projectUrl: string;
    deploymentUrl: string;
    components: Array<{
      name: string;
      code: string;
      preview: string;
    }>;
    buildTime: number;
    cost: number;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  provider: string;
}
```

#### **MCP Server Integration API**
```typescript
// Endpoint: POST /api/mcp/integration
interface MCPIntegrationRequest {
  command: 'mcp_integration';
  idea: string;
  userId: string;
  provider?: 'openai' | 'gemini' | 'groq' | 'anthropic';
}

interface MCPBuildResponse {
  success: boolean;
  data: {
    components: Array<{
      name: string;
      code: string;
      preview: string;
    }>;
    buildTime: number;
    cost: number;
    orchestration: OrchestrationResponse;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### **3. Stripe API (Billing) - Enhanced**

#### **MCP-First Subscription Management**
```typescript
// Endpoint: POST /api/stripe/create-subscription
interface CreateSubscriptionRequest {
  customerId: string;
  priceId: string;
  plan: 'mcp-integration' | 'multi-platform';
  metadata?: Record<string, string>;
}

interface CreateSubscriptionResponse {
  subscriptionId: string;
  status: string;
  currentPeriodEnd: Date;
  plan: string;
  features: {
    mcpIntegration: boolean;
    apiCalls: number;
    prdsPerMonth: number;
  };
  success: boolean;
  error?: string;
}
```

## 🔧 Internal API Endpoints

### **1. PRD Management (MCP-First)**

#### **Create PRD (Enhanced)**
```typescript
// Endpoint: POST /api/prds
interface CreatePRDRequest {
  approach: 'mcp-integration' | 'cli-option';
  title: string;
  description: string;
  template?: string;
  features?: Feature[];
  userStories?: UserStory[];
  technicalRequirements?: TechnicalRequirement[];
  userId: string;
  provider?: 'openai' | 'gemini' | 'groq' | 'anthropic';
}

interface CreatePRDResponse {
  prd: PRD;
  success: boolean;
  error?: string;
  approach: 'mcp-integration' | 'cli-option';
  provider: string;
}
```

#### **Get PRDs (Enhanced)**
```typescript
// Endpoint: GET /api/prds
interface GetPRDsRequest {
  userId: string;
  approach?: 'mcp-integration' | 'cli-option' | 'all';
  limit?: number;
  offset?: number;
  status?: 'draft' | 'active' | 'archived';
  provider?: 'openai' | 'gemini' | 'groq' | 'anthropic';
}

interface GetPRDsResponse {
  prds: PRD[];
  total: number;
  success: boolean;
  error?: string;
  approach: 'mcp-integration' | 'cli-option' | 'all';
}
```

### **2. Project Management (MCP-First)**

#### **Create Project (Enhanced)**
```typescript
// Endpoint: POST /api/projects
interface CreateProjectRequest {
  approach: 'mcp-integration' | 'cli-option';
  prdId: string;
  v0ChatId: string;
  deploymentUrl: string;
  userId: string;
  provider: string;
  buildTime: number;
  cost: number;
}

interface CreateProjectResponse {
  project: Project;
  success: boolean;
  error?: string;
  approach: 'mcp-integration' | 'cli-option';
}
```

### **3. Code Analysis (Enhanced)**

#### **Analyze Project (Multi-LLM)**
```typescript
// Endpoint: POST /api/analysis/analyze
interface AnalyzeProjectRequest {
  projectId: string;
  frontendCode: string;
  backendCode: string;
  provider?: 'openai' | 'gemini' | 'groq' | 'anthropic';
  approach?: 'mcp-integration' | 'cli-option';
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
  provider: string;
  approach: 'mcp-integration' | 'cli-option';
}
```

### **4. AI Design Critique (Enhanced)**

#### **Audit Live Preview (Multi-LLM)**
```typescript
// Endpoint: POST /api/audit/analyze
interface AuditRequest {
  url: string;
  projectId?: string;
  auditType?: 'full' | 'performance' | 'accessibility' | 'copy';
  provider?: 'openai' | 'gemini' | 'groq' | 'anthropic';
  approach?: 'mcp-integration' | 'cli-option';
}

interface AuditResponse {
  audit: {
    headlineGrade: number;
    frictionPoints: FrictionPoint[];
    performanceScore: number;
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
  provider: string;
  approach: 'mcp-integration' | 'cli-option';
}
```

### **5. User Management (Enhanced)**

#### **Authentication (MCP-First)**
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
  features: {
    mcpIntegration: boolean;
    cliOption: boolean;
    apiCalls: number;
    prdsPerMonth: number;
  };
}

// Endpoint: POST /api/auth/register
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  preferredApproach?: 'mcp-integration' | 'cli-option' | 'multi-platform';
}

interface RegisterResponse {
  user: User;
  token: string;
  success: boolean;
  error?: string;
  welcomeApproach: 'mcp-integration' | 'cli-option';
}
```

## 📊 Data Models (Enhanced)

### **PRD Model (MCP-First)**
```typescript
interface PRD {
  id: string;
  title: string;
  description: string;
  template?: string;
  features?: Feature[];
  userStories?: UserStory[];
  technicalRequirements?: TechnicalRequirement[];
  userId: string;
  status: 'draft' | 'active' | 'archived';
  approach: 'mcp-integration' | 'cli-option';
  provider: 'openai' | 'gemini' | 'groq' | 'anthropic';
  generationTime: number;
  orchestrationData?: any; // For MCP integration mode
  rawResponse?: string; // For CLI option mode
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

### **Project Model (MCP-First)**
```typescript
interface Project {
  id: string;
  prdId: string;
  v0ChatId: string;
  deploymentUrl: string;
  userId: string;
  status: 'generating' | 'active' | 'archived';
  approach: 'mcp-integration' | 'cli-option';
  provider: 'openai' | 'gemini' | 'groq' | 'anthropic';
  buildTime: number;
  cost: number;
  versions: ProjectVersion[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectVersion {
  id: string;
  version: number;
  deploymentUrl: string;
  changes: string;
  approach: 'mcp-integration' | 'cli-option';
  provider: string;
  createdAt: Date;
}
```

### **User Model (Enhanced)**
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  preferredApproach: 'mcp-integration' | 'cli-option' | 'multi-platform';
  subscription: {
    plan: 'free' | 'mcp-integration' | 'cli-option' | 'multi-platform';
    status: 'active' | 'canceled' | 'past_due';
    currentPeriodEnd: Date;
    features: {
      mcpIntegration: boolean;
      cliOption: boolean;
      apiCalls: number;
      prdsPerMonth: number;
    };
  };
  usage: {
    prdsCreated: number;
    projectsGenerated: number;
    apiCalls: number;
    mcpIntegrationUsage: number;
    cliOptionUsage: number;
    lastResetDate: Date;
  };
  preferences: {
    defaultProvider: 'openai' | 'gemini' | 'groq' | 'anthropic';
    defaultApproach: 'mcp-integration';
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔐 Authentication & Security (Enhanced)

### **JWT Token Structure (Enhanced)**
```typescript
interface JWTPayload {
  userId: string;
  email: string;
  plan: string;
  approach: 'mcp-integration' | 'multi-platform';
  provider: 'openai' | 'gemini' | 'groq' | 'anthropic';
  iat: number;
  exp: number;
}
```

### **API Rate Limiting (MCP-First)**
- **Free Plan**: 50 requests/hour (MCP Integration only)
- **MCP Integration Plan**: 500 requests/hour
- **Multi-Platform Plan**: 2000 requests/hour
- **Enterprise Plan**: 10000 requests/hour

> **Note**: CLI option rate limiting is documented in `../cli-option/CLI_SPECS.md`

### **CORS Configuration (Enhanced)**
```typescript
const corsOptions = {
  origin: [
    'https://cursorflow.com',
    'https://app.cursorflow.com',
    'https://nuggetwise.cursorflow.com',
    'http://localhost:3000' // Development only
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Mode', 'X-Provider']
};
```

## 🚨 Error Handling (Enhanced)

### **Standard Error Response (Enhanced)**
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    approach?: 'mcp-integration';
    provider?: string;
  };
  timestamp: Date;
}
```

### **Error Codes (Enhanced)**
- `AUTH_REQUIRED`: Authentication required
- `INVALID_INPUT`: Invalid request data
- `RATE_LIMITED`: Rate limit exceeded
- `API_ERROR`: External API error
- `NOT_FOUND`: Resource not found
- `PERMISSION_DENIED`: Insufficient permissions
- `APPROACH_NOT_SUPPORTED`: Approach not supported for this plan
- `PROVIDER_ERROR`: LLM provider error
- `ORCHESTRATION_ERROR`: 7-agent orchestration error
- `MCP_ERROR`: MCP server error

## 📈 Monitoring & Analytics (Enhanced)

### **API Metrics (MCP-First)**
- Request count by endpoint and approach
- Response times by provider
- Error rates by approach and provider
- User activity patterns by approach
- Cost tracking by provider and approach

### **Usage Tracking (Enhanced)**
- PRDs created per user and approach
- Projects generated per user and approach
- API calls per user, provider, and approach
- Feature usage statistics by approach
- Cost analysis by provider and approach

### **Performance Metrics (Enhanced)**
- Build times by approach and provider
- Success rates by approach
- User satisfaction by approach
- Conversion rates between approaches
- Retention rates by approach

---

**Next Steps**: Review [`FRONTEND_SPECS.md`](./FRONTEND_SPECS.md) for frontend implementation details and [`BACKEND_SPECS.md`](./BACKEND_SPECS.md) for backend service specifications.

---

> **CLI Option Documentation**: For CLI-specific API specifications, see [`../cli-option/CLI_SPECS.md`](../cli-option/CLI_SPECS.md). 