// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  subscription: {
    plan: 'free' | 'pro' | 'team';
    status: 'active' | 'canceled' | 'past_due';
    currentPeriodEnd: Date;
    stripeCustomerId: string;
  };
  usage: {
    prdsCreated: number;
    projectsGenerated: number;
    apiCalls: number;
    lastResetDate: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// PRD Types
export interface PRD {
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

export interface Feature {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  acceptanceCriteria: string[];
}

export interface UserStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: number;
}

export interface TechnicalRequirement {
  id: string;
  category: 'frontend' | 'backend' | 'database' | 'integration';
  requirement: string;
  priority: 'low' | 'medium' | 'high';
}

// Project Types
export interface Project {
  id: string;
  prdId: string;
  v0ChatId: string;
  deploymentUrl: string;
  userId: string;
  status: 'generating' | 'active' | 'archived';
  versions: ProjectVersion[];
  analysis: CodeAnalysis;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectVersion {
  id: string;
  version: number;
  deploymentUrl: string;
  changes: string;
  createdAt: Date;
}

export interface CodeAnalysis {
  uxScore: number;
  performanceScore: number;
  suggestions: Suggestion[];
  userFlow: UserFlow[];
}

export interface Suggestion {
  id: string;
  type: 'ux' | 'performance' | 'accessibility' | 'seo';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UserFlow {
  id: string;
  name: string;
  steps: UserFlowStep[];
  predictedCompletion: number;
}

export interface UserFlowStep {
  id: string;
  action: string;
  expectedOutcome: string;
  potentialIssues: string[];
}

// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  name: string;
}

export interface PRDForm {
  title: string;
  description: string;
  template: string;
  features: Feature[];
  userStories: UserStory[];
  technicalRequirements: TechnicalRequirement[];
}

// v0 Integration Types
export interface V0Chat {
  chatId: string;
  projectUrl: string;
  deploymentUrl: string;
}

export interface V0Code {
  frontend: string;
  components: Component[];
  styles: string;
}

export interface Component {
  name: string;
  code: string;
  props: ComponentProp[];
}

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
}

// Analytics Types
export interface Analytics {
  prdsCreated: number;
  projectsGenerated: number;
  successRate: number;
  activeUsers: number;
  prdTrend: AnalyticsPoint[];
  projectTrend: AnalyticsPoint[];
}

export interface AnalyticsPoint {
  date: string;
  value: number;
}

// Environment Types
// AI Design Critique Types
export interface DesignAudit {
  headlineGrade: number; // 1-10 score
  frictionPoints: FrictionPoint[];
  performanceScore: number; // 0-100
  accessibilityViolations: AccessibilityViolation[];
  suggestions: AuditSuggestion[];
  copyAnalysis: CopyAnalysis;
  performanceMetrics: PerformanceMetrics;
  accessibilityMetrics: AccessibilityMetrics;
}

export interface FrictionPoint {
  type: 'copy' | 'ux' | 'performance' | 'accessibility';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  suggestion: string;
}

export interface AccessibilityViolation {
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

export interface AuditSuggestion {
  category: 'copy' | 'ux' | 'performance' | 'accessibility';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  implementation: string;
  estimatedImpact: string;
}

export interface CopyAnalysis {
  readabilityScore: number;
  clarityIssues: string[];
  improvementSuggestions: string[];
}

export interface PerformanceMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  speedIndex: number;
}

export interface AccessibilityMetrics {
  violations: number;
  passes: number;
  incomplete: number;
  inapplicable: number;
}

export interface AuditType {
  type: 'full' | 'performance' | 'accessibility' | 'copy';
}

export interface PageData {
  html: string;
  screenshot: Buffer;
  title: string;
  url: string;
}

export interface AuditSignals {
  copyAnalysis: CopyAnalysis;
  performanceMetrics: PerformanceMetrics;
  accessibilityViolations: AccessibilityViolation[];
  performanceScore: number;
  accessibilityMetrics: AccessibilityMetrics;
}

export interface AuditInsights {
  headlineGrade: number;
  frictionPoints: FrictionPoint[];
  suggestions: AuditSuggestion[];
}

export interface Environment {
  nodeEnv: string;
  isProduction: boolean;
  isDevelopment: boolean;
  appUrl: string;
  apiUrl: string;
  openai: {
    apiKey: string;
    model: string;
    maxTokens: number;
  };
  v0: {
    apiKey: string;
    baseUrl: string;
  };
  firebase: {
    projectId: string;
    privateKey: string;
    clientEmail: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  stripe: {
    secretKey: string;
    webhookSecret: string;
  };
} 