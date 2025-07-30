// Shared types for CursorFlow application

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'team_member';
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  userId: string;
  teamMembers: string[];
  industry: string;
  targetAudience: string;
  createdAt: Date;
  updatedAt: Date;
  prd?: PRD;
  generatedCode?: GeneratedCode;
  aiAnalysis?: AIAnalysis;
}

export type ProjectStatus = 'draft' | 'in-progress' | 'review' | 'completed';

export interface PRD {
  id: string;
  projectId: string;
  title: string;
  problem: {
    description: string;
    impact: string;
    evidence: string[];
  };
  solution: {
    overview: string;
    keyFeatures: string[];
    differentiators: string[];
  };
  features: PRDFeature[];
  userStories: UserStory[];
  successMetrics: {
    primary: SuccessMetric[];
    secondary: SuccessMetric[];
  };
  risks: Risk[];
  timeline: TimelinePhase[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PRDFeature {
  name: string;
  description: string;
  priority: 'must-have' | 'should-have' | 'could-have' | 'won\'t-have';
  rationale: string;
  acceptanceCriteria: string[];
  dependencies: string[];
  effort: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
}

export interface UserStory {
  title: string;
  description: string;
  rationale: string;
  acceptanceCriteria: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface SuccessMetric {
  metric: string;
  target: string;
  measurement: string;
  rationale?: string;
}

export interface Risk {
  risk: string;
  probability: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  mitigation: string;
  contingency: string;
}

export interface TimelinePhase {
  name: string;
  duration: string;
  deliverables: string[];
  dependencies: string[];
}

export interface GeneratedCode {
  id: string;
  projectId: string;
  repositoryUrl?: string;
  deploymentUrl?: string;
  status: 'generating' | 'completed' | 'failed';
  files: GeneratedFile[];
  metadata: {
    framework: string;
    language: string;
    dependencies: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'component' | 'page' | 'api' | 'config' | 'style';
}

export interface AIAnalysis {
  id: string;
  projectId: string;
  type: 'design' | 'code' | 'performance' | 'accessibility' | 'comprehensive';
  results: AnalysisResults;
  reasoning: AIReasoning;
  metadata: AIMetadata;
  createdAt: Date;
}

export interface AnalysisResults {
  overallScore: number;
  headlineGrade: number;
  frictionPoints: FrictionPoint[];
  suggestions: Suggestion[];
  strengths: string[];
  opportunities: string[];
}

export interface FrictionPoint {
  type: 'ux' | 'performance' | 'accessibility' | 'content';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  location: string;
  userImpact: string;
  suggestion: string;
  rationale: string;
  effort: 'high' | 'medium' | 'low';
}

export interface Suggestion {
  category: 'ux' | 'performance' | 'accessibility' | 'content';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  implementation: string;
  expectedImpact: string;
  confidence: number;
  evidence: string;
  effort: 'high' | 'medium' | 'low';
}

export interface AIReasoning {
  steps: string[];
  confidence: number;
  alternatives: string[];
  evidence: string[];
  limitations: string[];
}

export interface AIMetadata {
  promptVersion: string;
  modelUsed: string;
  tokensUsed: number;
  processingTime: number;
  timestamp: string;
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Form types
export interface CreateProjectForm {
  title: string;
  description: string;
  industry: string;
  targetAudience: string;
  teamSize: number;
}

export interface UpdateProjectForm extends Partial<CreateProjectForm> {
  status?: ProjectStatus;
  progress?: number;
}

// Filter and search types
export interface ProjectFilters {
  status?: ProjectStatus;
  industry?: string;
  userId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SearchParams {
  query: string;
  filters?: ProjectFilters;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'progress';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
} 