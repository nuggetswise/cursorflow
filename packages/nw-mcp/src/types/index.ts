export interface BuildRequest {
  prompt: string;
  approach: 'mcp-integration';
  userId: string;
  projectId?: string | undefined;
  budget?: number | undefined;
  timeout?: number | undefined;
  v0Options?: {
    modelId?: 'v0-1.5-sm' | 'v0-1.5-md' | 'v0-1.5-lg' | undefined;
    saveToWorkspace?: boolean | undefined;
    fileName?: string | undefined;
  } | undefined;
}

export interface BuildResponse {
  success: boolean;
  data?: {
    chatId: string;
    projectUrl: string;
    deploymentUrl: string;
    components: Component[];
    buildTime: number;
    cost: number;
    files: GeneratedFile[];
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface Component {
  name: string;
  code: string;
  preview: string;
  templateId: string;
  props: Record<string, any>;
  milestone: number;
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'component' | 'page' | 'layout' | 'config' | 'style';
}

export interface AgentResult {
  success: boolean;
  data: any;
  error?: string;
  cost: number;
  duration: number;
}

export interface OrchestrationResult {
  intentAnalysis: AgentResult;
  uxPatterns: AgentResult;
  validation: AgentResult;
  uiRequirements: AgentResult;
  v0Prompt: string;
  components: Component[];
  totalCost: number;
  totalDuration: number;
}

export interface V0Response {
  chatId: string;
  projectUrl: string;
  deploymentUrl: string;
  components: Component[];
  files?: Array<{
    name: string;
    content: string;
    path?: string;
  }>;
}

export interface SlackNotification {
  event: 'build_started' | 'build_completed' | 'build_failed' | 'upgrade_prompted';
  userId: string;
  projectId?: string;
  data: any;
  timestamp: Date;
}

export interface BudgetConfig {
  maxCost: number;
  maxTime: number;
  maxRetries: number;
  costPerToken: number;
}

export interface EnvironmentConfig {
  openaiApiKey: string;
  v0ApiKey: string;
  slackWebhookUrl?: string | undefined;
  cursorWorkspacePath: string;
  budget: BudgetConfig;
  mode: 'development' | 'production';
  v0Config?: {
    modelId: 'v0-1.5-sm' | 'v0-1.5-md' | 'v0-1.5-lg';
    saveToWorkspace: boolean;
    enablePreview: boolean;
  };
}

export interface DiffResult {
  changeType: 'addition' | 'modification' | 'deletion' | 'replacement' | 'none';
  linesChanged: number[];
  impact: 'low' | 'medium' | 'high';
  description: string;
  breakingChanges: boolean;
  suggestions: string[];
  warnings?: string[];
}

export interface FileChange {
  filePath: string;
  changeType: 'addition' | 'modification' | 'deletion';
  description: string;
}

export interface ConflictResolution {
  filePath: string;
  conflictType: 'naming' | 'dependency' | 'logic';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestedResolution: string;
}

export interface NotificationData {
  event: string;
  data: any;
  channel?: string;
  channels?: string[];
}

export interface NotificationType {
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
}

export interface NotificationChannel {
  name: string;
  type: 'slack' | 'email' | 'webhook';
  config: any;
} 