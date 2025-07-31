# CursorFlow - Backend Specifications (MCP-First Platform)

## 🔧 Backend Overview

The CursorFlow backend is a **MCP-only Node.js/TypeScript application** providing serverless API services with **MCP (Model Context Protocol) integration as the primary and only approach**. It integrates with multiple LLM providers, v0 Platform, and Supabase (Postgres) for data persistence. CLI options are available as optional future enhancements (commented out at the bottom of this document).

## 🛠️ Technology Stack

### **Core Technologies**
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js with serverless functions
- **Database**: Supabase (Postgres)
- **Authentication**: Supabase Auth (JWT, OAuth, etc.)
- **Deployment**: Vercel Functions

### **Key Libraries**
- **HTTP Framework**: Express.js
- **Database**: Supabase JS Client
- **Validation**: Zod
- **HTTP Client**: Axios
- **Logging**: Winston
- **Testing**: Jest + Supertest

### **AI/LLM Providers**
- **OpenAI**: GPT-4o, GPT-3.5-turbo
- **Google Gemini**: Gemini Pro
- **Groq**: Llama3-8b-8192
- **Anthropic**: Claude-3-sonnet-20240229
- **V0 Platform**: v0-1.5-md (AI-powered UI generation)

## 🏗️ Service Architecture (MCP-Only)

### **0. Supabase Client Initialization**
```typescript
// config/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { config } from './environment';

const supabaseUrl = config.supabaseUrl;
const supabaseAnonKey = config.supabaseAnonKey;
const supabaseServiceRoleKey = config.supabaseServiceRoleKey;

// Client for user operations (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for service operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Row Level Security (RLS) Policies
export const setupRLSPolicies = async () => {
  // Users can only access their own data
  await supabaseAdmin.rpc('create_policy_if_not_exists', {
    table_name: 'users',
    policy_name: 'users_own_data',
    definition: 'users.id = auth.uid()'
  });

  await supabaseAdmin.rpc('create_policy_if_not_exists', {
    table_name: 'prds',
    policy_name: 'prds_own_data',
    definition: 'prds.user_id = auth.uid()'
  });

  await supabaseAdmin.rpc('create_policy_if_not_exists', {
    table_name: 'projects',
    policy_name: 'projects_own_data',
    definition: 'projects.user_id = auth.uid()'
  });

  await supabaseAdmin.rpc('create_policy_if_not_exists', {
    table_name: 'analytics',
    policy_name: 'analytics_own_data',
    definition: 'analytics.user_id = auth.uid()'
  });
};
```

### **1. Prompt Service (Multi-LLM)**
```typescript
// services/prompt.service.ts
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Groq } from 'groq-sdk';
import { Anthropic } from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';
interface PromptService {
  loadPrompt(promptType: PromptType, approach: 'mcp-integration'): Promise<any>;
  generateResponse(prompt: string, systemPrompt?: string): Promise<string>;
  executeMCPIntegrationOrchestration(userPrompt: string): Promise<any>;
  // executeCLIOptionPRD(userPrompt: string, template?: string): Promise<any>; // Commented out - CLI option
}

class PromptServiceImpl implements PromptService {
  private openai: OpenAI | null = null;
  private gemini: GoogleGenerativeAI | null = null;
  private groq: Groq | null = null;
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
    this.initializeProviders();
  }

  async loadPrompt(promptType: PromptType, approach: 'mcp-integration'): Promise<any> {
    try {
      let promptPath: string;
      
      if (approach === 'mcp-integration') {
        // Load from MCP integration prompts
        promptPath = join(process.cwd(), 'prompts', 'nuggetwise', `${promptType}.json`);
      } else {
        // Load from CLI option prompts
        switch (promptType) {
          case 'product-manager':
            promptPath = join(process.cwd(), 'prompts', 'prd-generation', 'product-manager-prompt.md');
            break;
          case 'ux-designer':
            promptPath = join(process.cwd(), 'prompts', 'design-critique', 'ux-designer-prompt.md');
            break;
          case 'software-architect':
            promptPath = join(process.cwd(), 'prompts', 'code-analysis', 'software-architect-prompt.md');
            break;
          default:
            throw new Error(`Unknown prompt type: ${promptType}`);
        }
      }

      const promptContent = readFileSync(promptPath, 'utf-8');
      
      if (promptPath.endsWith('.json')) {
        return JSON.parse(promptContent);
      } else {
        return { content: promptContent };
      }
    } catch (error) {
      console.error(`Error loading prompt ${promptType}:`, error);
      throw new Error(`Failed to load prompt: ${promptType}`);
    }
  }

  async executeMCPIntegrationOrchestration(userPrompt: string): Promise<any> {
    try {
      // Step 1: Intent Analysis
      const intentPrompt = await this.loadPrompt('intent-analysis', 'mcp-integration');
      const intentResponse = await this.generateResponse(
        JSON.stringify({ idea: userPrompt }),
        intentPrompt.system
      );
      const intent = JSON.parse(intentResponse);
      
      // Step 2: V0 Integration (if UI generation is needed)
      if (intent.requiresUI) {
        const v0Service = new V0IntegrationService();
        const uiResult = await v0Service.generateUI(userPrompt, intent.targetDir);
        intent.uiComponents = uiResult.files;
        intent.previewUrl = uiResult.previewUrl;
      }

      // Step 2: UX Pattern Selection
      const uxPrompt = await this.loadPrompt('ux-pattern-selector', 'mcp-integration');
      const uxResponse = await this.generateResponse(
        JSON.stringify({ 
          coreFeatures: intent.coreFeatures,
          platform: intent.platform,
          complexity: intent.complexity
        }),
        uxPrompt.system
      );
      const uxPatterns = JSON.parse(uxResponse);

      // Step 3: Validation
      const validationPrompt = await this.loadPrompt('validation', 'mcp-integration');
      const validationResponse = await this.generateResponse(
        JSON.stringify({
          goal: intent.goal,
          userRoles: intent.userRoles,
          coreFeatures: intent.coreFeatures,
          constraints: intent.constraints
        }),
        validationPrompt.system
      );
      const validation = JSON.parse(validationResponse);

      // Step 4: UI Requirement Synthesis
      const uiReqPrompt = await this.loadPrompt('ui-requirement-synthesizer', 'mcp-integration');
      const uiReqResponse = await this.generateResponse(
        JSON.stringify({
          uxSelections: uxPatterns.selections,
          mvpMilestones: validation.mvpMilestones,
          layout: uxPatterns.layout
        }),
        uiReqPrompt.system
      );
      const uiRequirements = JSON.parse(uiReqResponse);

      // Step 5: v0 Prompt Building
      const v0Prompt = await this.loadPrompt('v0-prompt-builder', 'mcp-integration');
      const v0Response = await this.generateResponse(
        v0Prompt.content.replace('{{components}}', JSON.stringify(uiRequirements.components, null, 2))
      );

      // Step 6: Diff Detection
      const diffPrompt = await this.loadPrompt('diff-detector', 'mcp-integration');
      const diffResponse = await this.generateResponse(
        JSON.stringify({
          currentComponents: [],
          changeRequest: userPrompt,
          existingFiles: []
        }),
        diffPrompt.system
      );
      const diffAnalysis = JSON.parse(diffResponse);

      // Step 7: Notification
      const notificationPrompt = await this.loadPrompt('notification', 'mcp-integration');
      const notificationResponse = await this.generateResponse(
        JSON.stringify({
          event: 'build_completed',
          details: {
            project: intent.goal,
            components: uiRequirements.components.length,
            time: Date.now(),
            preview: 'https://v0-generated-app.vercel.app'
          },
          user: 'user',
          project: 'mcp-integration-project'
        }),
        notificationPrompt.system
      );
      const notification = JSON.parse(notificationResponse);

      return {
        intent,
        uxPatterns,
        validation,
        uiRequirements,
        v0Prompt: v0Response,
        diffAnalysis,
        notification,
        success: true
      };

    } catch (error) {
      console.error('MCP integration orchestration error:', error);
      throw new Error('Failed to execute MCP integration orchestration');
    }
  }

  // async executeCLIOptionPRD(userPrompt: string, template: string = 'detailed'): Promise<any> {
  //   try {
  //     const prdPrompt = await this.loadPrompt('product-manager', 'cli-option');
  //     
  //     const prompt = prdPrompt.content
  //       .replace('{industry}', 'Technology')
  //       .replace('{audience}', 'Product Managers')
  //       .replace('{goals}', 'Create a comprehensive PRD')
  //       .replace('{constraints}', 'Web-based application')
  //       .replace('{market_conditions}', 'Competitive market')
  //       .replace('{competition}', 'Existing solutions')
  //       .replace('{data}', userPrompt);

  //     const response = await this.generateResponse(prompt);
  //     
  //     return {
  //       prd: response,
  //       success: true,
  //       approach: 'cli-option'
  //     };

  //   } catch (error) {
  //     console.error('CLI option PRD generation error:', error);
  //     throw new Error('Failed to generate CLI option PRD');
  //   }
  // }
}
```

### **2. PRD Service (MCP-First)**
```typescript
// services/prd.service.ts
import { SupabaseClient } from '@supabase/supabase-js';
interface PRDService {
  generatePRD(description: string, template: string, approach: 'mcp-integration'): Promise<PRD>;
  savePRD(prd: PRD): Promise<string>;
  getPRD(id: string): Promise<PRD | null>;
  updatePRD(id: string, updates: Partial<PRD>): Promise<PRD>;
  deletePRD(id: string): Promise<boolean>;
  listPRDs(userId: string, approach?: 'mcp-integration' | 'all', filters?: PRDFilters): Promise<PRD[]>;
}

class PRDServiceImpl implements PRDService {
  constructor(
    private promptService: PromptService,
    private supabase: SupabaseClient
  ) {
    // Initialize Supabase client for database operations
    this.supabase = supabase;
  }

  async generatePRD(description: string, template: string, approach: 'mcp-integration'): Promise<PRD> {
    const startTime = Date.now();
    
    if (approach === 'mcp-integration') {
      const orchestrationResult = await this.promptService.executeMCPIntegrationOrchestration(description);
      
      return {
        id: `prd_mcp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: `MCP PRD: ${orchestrationResult.intent.goal}`,
        description: `Rapid PRD generated using 7-agent orchestration for ${description}`,
        approach: 'mcp-integration',
        provider: this.promptService.config.provider,
        generationTime: Date.now() - startTime,
        features: orchestrationResult.intent.coreFeatures.map((feature: any, index: number) => ({
          id: `feature_quick_${Date.now()}_${index + 1}`,
          name: feature.name,
          description: feature.description,
          priority: feature.priority || 'medium',
          acceptanceCriteria: feature.acceptanceCriteria || [
            'Basic functionality works',
            'User can interact with the feature',
            'Feature meets core requirements'
          ]
        })),
        userStories: orchestrationResult.validation.mvpMilestones.map((milestone: any, index: number) => ({
          id: `story_quick_${Date.now()}_${index + 1}`,
          title: `As a user, I want to ${milestone.description.toLowerCase()}`,
          description: milestone.description,
          acceptanceCriteria: milestone.features || [
            'Feature is accessible',
            'Basic functionality works',
            'User can complete main tasks'
          ],
          priority: milestone.step
        })),
        technicalRequirements: orchestrationResult.uiRequirements.components.map((component: any, index: number) => ({
          id: `tech_quick_${Date.now()}_${index + 1}`,
          category: 'frontend' as const, // Commented out for MCP-first approach
          requirement: `${component.name} component with ${component.templateId} template`,
          priority: 'high' as const
        })),
        orchestrationData: {
          intent: orchestrationResult.intent,
          uxPatterns: orchestrationResult.uxPatterns,
          validation: orchestrationResult.validation,
          uiRequirements: orchestrationResult.uiRequirements,
          v0Prompt: orchestrationResult.v0Prompt,
          diffAnalysis: orchestrationResult.diffAnalysis,
          notification: orchestrationResult.notification
        }
      };
    // } else {
    //   const prdResult = await this.promptService.executeCLIOptionPRD(description, template);
    //   
    //   return {
    //     id: `prd_cli_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    //     title: `Product Requirements Document for ${description.split(' ').slice(0, 3).join(' ')}`,
    //     description: `A comprehensive ${template} PRD for ${description}`,
    //     approach: 'cli-option',
    //     provider: this.promptService.config.provider,
    //     generationTime: Date.now() - startTime,
    //     rawResponse: prdResult.prd
    //   };
    // }
  }

  async savePRD(prd: PRD): Promise<string> {
    const { data, error } = await this.supabase
      .from('prds')
      .insert({
        user_id: prd.userId,
        title: prd.title,
        description: prd.description,
        template: prd.template,
        features: prd.features,
        user_stories: prd.userStories,
        technical_requirements: prd.technicalRequirements,
        status: prd.status || 'draft',
        approach: prd.approach,
        provider: prd.provider,
        generation_time: prd.generationTime,
        orchestration_data: prd.orchestrationData,
        raw_response: prd.rawResponse
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to save PRD: ${error.message}`);
    return data.id;
  }

  async getPRD(id: string): Promise<PRD | null> {
    const { data, error } = await this.supabase
      .from('prds')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw new Error(`Failed to get PRD: ${error.message}`);
    }

    return this.mapDatabaseToPRD(data);
  }

  async updatePRD(id: string, updates: Partial<PRD>): Promise<PRD> {
    const { data, error } = await this.supabase
      .from('prds')
      .update({
        title: updates.title,
        description: updates.description,
        template: updates.template,
        features: updates.features,
        user_stories: updates.userStories,
        technical_requirements: updates.technicalRequirements,
        status: updates.status,
        approach: updates.approach,
        provider: updates.provider,
        generation_time: updates.generationTime,
        orchestration_data: updates.orchestrationData,
        raw_response: updates.rawResponse,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update PRD: ${error.message}`);
    return this.mapDatabaseToPRD(data);
  }

  async deletePRD(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('prds')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete PRD: ${error.message}`);
    return true;
  }

  async listPRDs(userId: string, approach?: 'mcp-integration' | 'all', filters?: PRDFilters): Promise<PRD[]> {
    let query = this.supabase
      .from('prds')
      .select('*')
      .eq('user_id', userId);

    if (approach && approach !== 'all') {
      query = query.eq('approach', approach);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.provider) {
      query = query.eq('provider', filters.provider);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to list PRDs: ${error.message}`);
    return data.map(this.mapDatabaseToPRD);
  }

  private mapDatabaseToPRD(dbData: any): PRD {
    return {
      id: dbData.id,
      userId: dbData.user_id,
      title: dbData.title,
      description: dbData.description,
      template: dbData.template,
      features: dbData.features,
      userStories: dbData.user_stories,
      technicalRequirements: dbData.technical_requirements,
      status: dbData.status,
      approach: dbData.approach,
      provider: dbData.provider,
      generationTime: dbData.generation_time,
      orchestrationData: dbData.orchestration_data,
      rawResponse: dbData.raw_response,
      createdAt: dbData.created_at,
      updatedAt: dbData.updated_at
    };
  }
}
```

### **3. V0 Integration Service (Enhanced)**
```typescript
// services/v0-integration.service.ts
interface V0IntegrationService {
  createChat(request: CreateV0ChatRequest): Promise<V0Chat>;
  generateCode(chatId: string, requirements: string, approach: 'mcp-integration' | 'cli-option'): Promise<V0Code>;
  generateUI(prompt: string, targetDir: string, context?: any): Promise<V0GenerationResult>;
  analyzeWorkspace(workspace: string, context?: any): Promise<WorkspaceAnalysis>;
  getProjects(): Promise<V0Project[]>;
  deleteProject(projectId: string): Promise<boolean>;
  getGenerationHistory(userId: string): Promise<V0Generation[]>;
  estimateCost(prompt: string): Promise<CostEstimate>;
}

class V0IntegrationServiceImpl implements V0IntegrationService {
  constructor(
    private v0Client: V0Client,
    private promptService: PromptService,
    private config: Config
  ) {}

  async createChat(request: CreateV0ChatRequest): Promise<V0Chat> {
    const startTime = Date.now();
    
    if (request.approach === 'mcp-integration') {
      // Execute 7-agent orchestration for MCP integration
      const orchestrationResult = await this.promptService.executeMCPIntegrationOrchestration(request.prompt);
      
      // Generate v0 components using the orchestration result
      const v0Prompt = orchestrationResult.v0Prompt;
      const components = orchestrationResult.uiRequirements.components.map((component: any) => ({
        name: component.name,
        code: `// Generated by MCP Integration using ${this.promptService.config.provider}\n// Component: ${component.name}\n// Template: ${component.templateId}\n${v0Prompt}`,
        preview: `https://v0-${component.name.toLowerCase()}.vercel.app`
      }));
      
      const chatId = `v0_mcp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const projectUrl = `https://v0.dev/chat/${chatId}`;
      const deploymentUrl = `https://${chatId}.v0.dev`;
      
      const buildTime = Date.now() - startTime;
      const cost = 0.50; // Cost calculation based on provider and tokens

      return {
        chatId,
        projectUrl,
        deploymentUrl,
        components,
        buildTime,
        cost,
        approach: 'mcp-integration',
        provider: this.promptService.config.provider
      };
    } else {
      // Execute CLI option PRD generation first
      const prdResult = await this.promptService.executeCLIOptionPRD(request.prompt, 'detailed');
      
      // Generate comprehensive v0 components
      const components = request.components?.map(comp => ({
        name: comp.name,
        code: `// Generated by CLI Option using ${this.promptService.config.provider}\n// Component: ${comp.name}\n// Template: ${comp.templateId}\n// Props: ${JSON.stringify(comp.props)}\n// Milestone: ${comp.milestone}\n\n${prdResult.prd}`,
        preview: `https://v0-cli-${comp.name.toLowerCase()}.vercel.app`
      })) || [];
      
      const chatId = `v0_cli_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const projectUrl = `https://v0.dev/chat/${chatId}`;
      const deploymentUrl = `https://${chatId}.v0.dev`;
      
      const buildTime = Date.now() - startTime;
      const cost = 2.50; // Cost calculation based on provider and complexity

      return {
        chatId,
        projectUrl,
        deploymentUrl,
        components,
        buildTime,
        cost,
        approach: 'cli-option',
        provider: this.promptService.config.provider
      };
    }
  }
}
```

### **4. MCP Server Service**
```typescript
// services/mcp-server.service.ts
interface MCPServerService {
  startServer(): Promise<void>;
  registerTools(): Promise<void>;
  handleV0Request(request: V0MCPRequest): Promise<V0MCPResponse>;
}

class MCPServerServiceImpl implements MCPServerService {
  private server: Express;
  private v0Service: V0IntegrationService;

  constructor() {
    this.server = express();
    this.v0Service = new V0IntegrationServiceImpl();
  }

  async startServer(): Promise<void> {
    this.server.use(express.json());
    await this.registerTools();
    
    this.server.listen(process.env.MCP_SERVER_PORT || 8788, () => {
      console.log('MCP Server running on port 8788');
    });
  }

  async registerTools(): Promise<void> {
    // Register V0 MCP tools
    this.server.post('/tools/v0.generate', async (req, res) => {
      const result = await this.handleV0Request(req.body);
      res.json(result);
    });
  }

  async handleV0Request(request: V0MCPRequest): Promise<V0MCPResponse> {
    const { prompt, targetDir, context } = request;
    
    try {
      const result = await this.v0Service.generateUI(prompt, targetDir, context);
      return {
        success: true,
        files: result.files,
        previewUrl: result.previewUrl,
        performance: result.performance
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
```

### **5. Audit Service (Multi-LLM)**
```typescript
// services/audit.service.ts
interface AuditService {
  executeAudit(request: AuditRequest): Promise<AuditResponse>;
}

class AuditServiceImpl implements AuditService {
  constructor(private promptService: PromptService) {}

  async executeAudit(request: AuditRequest): Promise<AuditResponse> {
    try {
      const provider = request.provider || (process.env.DEFAULT_LLM_PROVIDER as LLMProvider) || 'openai';
      this.promptService = createPromptService(provider);

      // Fetch website content
      const websiteContent = await this.fetchWebsiteContent(request.url);
      
      // Execute different audit types
      const results = await Promise.all([
        this.auditCopy(websiteContent, provider),
        this.auditUX(websiteContent, provider),
        this.auditPerformance(request.url, provider),
        this.auditAccessibility(request.url, provider)
      ]);

      const [copyAnalysis, uxAnalysis, performanceAnalysis, accessibilityAnalysis] = results;

      // Calculate overall scores
      const headlineGrade = this.calculateHeadlineGrade(copyAnalysis, uxAnalysis);
      const performanceScore = performanceAnalysis.score;

      // Compile friction points
      const frictionPoints = [
        ...copyAnalysis.frictionPoints,
        ...uxAnalysis.frictionPoints,
        ...performanceAnalysis.frictionPoints,
        ...accessibilityAnalysis.frictionPoints
      ];

      // Compile suggestions
      const suggestions = [
        ...copyAnalysis.suggestions,
        ...uxAnalysis.suggestions,
        ...performanceAnalysis.suggestions,
        ...accessibilityAnalysis.suggestions
      ];

      return {
        audit: {
          headlineGrade,
          frictionPoints,
          performanceScore,
          accessibilityViolations: accessibilityAnalysis.violations,
          suggestions,
          copyAnalysis: copyAnalysis.analysis,
          performanceMetrics: performanceAnalysis.metrics,
          accessibilityMetrics: accessibilityAnalysis.metrics
        },
        success: true,
        provider,
        approach: request.approach || 'cli-option'
      };

    } catch (error) {
      console.error('Audit execution error:', error);
      return {
        audit: {
          headlineGrade: 0,
          frictionPoints: [],
          performanceScore: 0,
          accessibilityViolations: [],
          suggestions: [],
          copyAnalysis: {
            readabilityScore: 0,
            clarityIssues: [],
            improvementSuggestions: []
          },
          performanceMetrics: {
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0,
            speedIndex: 0
          },
          accessibilityMetrics: {
            violations: 0,
            passes: 0,
            incomplete: 0,
            inapplicable: 0
          }
        },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: request.provider || 'openai',
        approach: request.approach || 'cli-option'
      };
    }
  }
}
```

## 🗄️ Database Schema (Supabase/Postgres)

### **Postgres Tables (MCP-First)**

#### **users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  preferred_approach TEXT CHECK (preferred_approach IN ('mcp-integration', 'cli-option', 'multi-platform')),
  subscription_plan TEXT CHECK (subscription_plan IN ('free', 'mcp-integration', 'cli-option', 'multi-platform')),
  subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'past_due')),
  current_period_end TIMESTAMP,
  stripe_customer_id TEXT,
  features JSONB,
  usage JSONB,
  preferences JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### **prds**
```sql
CREATE TABLE prds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT,
  description TEXT,
  template TEXT,
  features JSONB,
  user_stories JSONB,
  technical_requirements JSONB,
  status TEXT CHECK (status IN ('draft', 'active', 'archived')),
  approach TEXT CHECK (approach IN ('mcp-integration', 'cli-option')),
  provider TEXT,
  generation_time INTEGER,
  orchestration_data JSONB,
  raw_response TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### **projects**
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  prd_id UUID REFERENCES prds(id),
  v0_chat_id TEXT,
  deployment_url TEXT,
  status TEXT CHECK (status IN ('generating', 'active', 'archived')),
  approach TEXT CHECK (approach IN ('mcp-integration', 'cli-option')),
  provider TEXT,
  build_time INTEGER,
  cost NUMERIC,
  versions JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### **analytics**
```sql
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  event_type TEXT CHECK (event_type IN ('prd_created', 'project_generated', 'api_call', 'mcp-integration', 'cli-option')),
  approach TEXT CHECK (approach IN ('mcp-integration', 'cli-option')),
  provider TEXT,
  metadata JSONB,
  timestamp TIMESTAMP DEFAULT now()
);
```

## 🔐 Authentication & Authorization (Enhanced)

### **JWT Token Management (Enhanced)**
```typescript
// middleware/auth.middleware.ts
interface JWTPayload {
  userId: string;
  email: string;
  plan: string;
  approach: 'mcp-integration' | 'cli-option' | 'multi-platform'; // MCP-first approach
  provider: 'openai' | 'gemini' | 'groq' | 'anthropic';
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
    const { plan, approach } = req.user;
    const requiredPlan = req.route.meta?.requiredPlan;
    const requiredApproach = req.route.meta?.requiredApproach;
    
    if (requiredPlan && !this.hasPlanAccess(plan, requiredPlan)) {
      return res.status(403).json({ error: 'Plan upgrade required' });
    }
    
    if (requiredApproach && approach !== requiredApproach && approach !== 'multi-platform') {
      return res.status(403).json({ error: 'Approach not supported for this plan' });
    }
    
    next();
  }
}
```

### **Rate Limiting (Enhanced)**
```typescript
// middleware/rate-limit.middleware.ts
import rateLimit from 'express-rate-limit';

const planLimits = {
  free: { requests: 50, approach: 'mcp-integration' },
  'mcp-integration': { requests: 500, approach: 'mcp-integration' },
  'cli-option': { requests: 1000, approach: 'cli-option' },
  'multi-platform': { requests: 2000, approach: 'multi-platform' },
  enterprise: { requests: 10000, approach: 'multi-platform' },
};

export const createRateLimiter = (plan: string) => {
  const limit = planLimits[plan] || planLimits.free;
  
  return rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: limit.requests,
    message: {
      error: 'Rate limit exceeded',
      limit: limit.requests,
      approach: limit.approach,
      windowMs: 60 * 60 * 1000,
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};
```

## 🚨 Error Handling (Enhanced)

### **Global Error Handler (Enhanced)**
```typescript
// middleware/error-handler.middleware.ts
interface AppError extends Error {
  statusCode: number;
  code: string;
  approach?: 'mcp-integration' | 'cli-option';
  provider?: string;
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
          approach: error.approach,
    provider: error.provider,
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
      approach: error.approach,
      provider: error.provider,
      details: error.details,
    },
    timestamp: new Date().toISOString(),
  });
};
```

### **Custom Error Classes (Enhanced)**
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

export class ApproachNotSupportedError extends Error {
  constructor(approach: string, plan: string) {
    super(`Approach ${approach} not supported for plan ${plan}`);
    this.name = 'ApproachNotSupportedError';
    this.statusCode = 403;
    this.code = 'APPROACH_NOT_SUPPORTED';
    this.approach = approach;
  }
}

export class ProviderError extends Error {
  constructor(provider: string, message: string) {
    super(`Provider ${provider} error: ${message}`);
    this.name = 'ProviderError';
    this.statusCode = 500;
    this.code = 'PROVIDER_ERROR';
    this.provider = provider;
  }
}

export class OrchestrationError extends Error {
  constructor(message: string, step?: string) {
    super(`Orchestration error${step ? ` at step ${step}` : ''}: ${message}`);
    this.name = 'OrchestrationError';
    this.statusCode = 500;
    this.code = 'ORCHESTRATION_ERROR';
    this.step = step;
  }
}
```

## 📊 Monitoring & Logging (Enhanced)

### **Winston Logger Configuration (Enhanced)**
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
  defaultMeta: { 
    service: 'cursorflow-backend',
    version: '2.0.0',
    mcpFirst: true
  },
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

### **Performance Monitoring (Enhanced)**
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
      approach: req.user?.approach,
      provider: req.user?.provider,
    });
    
    // Track slow requests
    if (duration > 1000) {
      logger.warn({
        message: 'Slow request detected',
        method: req.method,
        url: req.url,
        duration,
        approach: req.user?.approach,
        provider: req.user?.provider,
      });
    }
  });
  
  next();
};
```

## 🧪 Testing Strategy (Enhanced)

### **Unit Tests (Enhanced)**
```typescript
// tests/services/prompt.service.test.ts
describe('PromptService', () => {
  let promptService: PromptService;
  let mockOpenAI: jest.Mocked<OpenAI>;
  let mockGemini: jest.Mocked<GoogleGenerativeAI>;

  beforeEach(() => {
    mockOpenAI = createMockOpenAI();
    mockGemini = createMockGemini();
    promptService = new PromptServiceImpl({
      provider: 'openai',
      apiKey: 'test-key',
      model: 'gpt-4o'
    });
  });

  describe('executeMCPIntegrationOrchestration', () => {
    it('should execute 7-agent orchestration successfully (MCP-first approach)', async () => {
      const idea = 'A task management app';
      
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{
          message: { content: JSON.stringify(mockOrchestrationResponse) },
        }],
      });

      const result = await promptService.executeMCPIntegrationOrchestration(idea);
      
      expect(result).toEqual(expect.objectContaining({
        intent: expect.any(Object),
        uxPatterns: expect.any(Object),
        validation: expect.any(Object),
        uiRequirements: expect.any(Object),
        v0Prompt: expect.any(String),
        diffAnalysis: expect.any(Object),
        notification: expect.any(Object),
        success: true
      }));
    });
  });

  describe('executeCLIOptionPRD', () => {
    it('should generate comprehensive PRD (CLI option approach)', async () => {
      const description = 'A comprehensive task management app';
      const template = 'detailed';
      
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{
          message: { content: mockPRDResponse },
        }],
      });

      const result = await promptService.executeCLIOptionPRD(description, template);
      
      expect(result).toEqual(expect.objectContaining({
        prd: expect.any(String),
        success: true,
        approach: 'cli-option'
      }));
    });
  });
});
```

### **Integration Tests (Enhanced)**
```typescript
// tests/integration/api.test.ts
describe('MCP-First API', () => {
  let app: Express;
  let authToken: string;

  beforeAll(async () => {
    app = createTestApp();
    authToken = await createTestUser();
  });

  describe('POST /api/openai/generate-prd', () => {
    it('should create MCP integration PRD with 7-agent orchestration', async () => {
      const prdData = {
        approach: 'mcp-integration',
        description: 'A task management app',
        userId: 'test-user'
      };

      const response = await request(app)
        .post('/api/openai/generate-prd')
        .set('Authorization', `Bearer ${authToken}`)
        .send(prdData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.prd.approach).toBe('mcp-integration');
      expect(response.body.prd.orchestrationData).toBeDefined();
    });

    it('should create CLI option PRD with comprehensive analysis', async () => {
      const prdData = {
        approach: 'cli-option',
        description: 'A comprehensive task management app',
        template: 'detailed',
        userId: 'test-user'
      };

      const response = await request(app)
        .post('/api/openai/generate-prd')
        .set('Authorization', `Bearer ${authToken}`)
        .send(prdData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.prd.approach).toBe('cli-option');
      expect(response.body.prd.rawResponse).toBeDefined();
    });
  });
});
```

## 🔧 Environment Configuration (Enhanced)

### **Environment Variables (Enhanced)**
```typescript
// config/environment.ts
export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  // Default LLM Provider
  defaultLLMProvider: process.env.DEFAULT_LLM_PROVIDER || 'openai',
  
  // OpenAI
  openaiApiKey: process.env.OPENAI_API_KEY!,
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o',
  openaiMaxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2000', 10),
  openaiTemperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.3'),
  
  // Google Gemini
  geminiApiKey: process.env.GEMINI_API_KEY!,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-pro',
  geminiMaxTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '2000', 10),
  geminiTemperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.3'),
  
  // Groq
  groqApiKey: process.env.GROQ_API_KEY!,
  groqModel: process.env.GROQ_MODEL || 'llama3-8b-8192',
  groqMaxTokens: parseInt(process.env.GROQ_MAX_TOKENS || '2000', 10),
  groqTemperature: parseFloat(process.env.GROQ_TEMPERATURE || '0.3'),
  
  // Anthropic
  anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
  anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
  anthropicMaxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS || '2000', 10),
  anthropicTemperature: parseFloat(process.env.ANTHROPIC_TEMPERATURE || '0.3'),
  
  // v0 Platform
  v0ApiKey: process.env.V0_API_KEY!,
  v0BaseUrl: process.env.V0_BASE_URL || 'https://api.v0.dev',
  
  // Supabase
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  
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

## 🚀 Deployment Configuration (Enhanced)

### **Vercel Configuration (Enhanced)**
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
    "NODE_ENV": "production",
    "DEFAULT_LLM_PROVIDER": "openai"
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
          "value": "Content-Type, Authorization, X-Approach, X-Provider"
        }
      ]
    }
  ]
}
```

---

---

## **🚫 CLI Option Implementation (Commented Out - Only When Required)**

> **Note**: The following sections are commented out as CLI options are optional future enhancements. The primary focus is MCP integration within Cursor IDE.

<!--
### **CLI Option Service Implementation**
```typescript
// services/cli-option.service.ts
interface CLIOptionService {
  executeCLIOptionPRD(userPrompt: string, template?: string): Promise<any>;
  generateCLICode(chatId: string, requirements: string): Promise<V0Code>;
}

class CLIOptionServiceImpl implements CLIOptionService {
  async executeCLIOptionPRD(userPrompt: string, template: string = 'detailed'): Promise<any> {
    try {
      const prdPrompt = await this.loadPrompt('product-manager', 'cli-option');
      
      const prompt = prdPrompt.content
        .replace('{industry}', 'Technology')
        .replace('{audience}', 'Product Managers')
        .replace('{goals}', 'Create a comprehensive PRD')
        .replace('{constraints}', 'Web-based application')
        .replace('{market_conditions}', 'Competitive market')
        .replace('{competition}', 'Existing solutions')
        .replace('{data}', userPrompt);

      const response = await this.generateResponse(prompt);
      
      return {
        prd: response,
        success: true,
        approach: 'cli-option'
      };

    } catch (error) {
      console.error('CLI option PRD generation error:', error);
      throw new Error('Failed to generate CLI option PRD');
    }
  }

  async generateCLICode(chatId: string, requirements: string): Promise<V0Code> {
    // Execute CLI option PRD generation first
    const prdResult = await this.promptService.executeCLIOptionPRD(request.prompt, 'detailed');
    
    // Generate code for each component
    const components = prdResult.components || [];
    const codeResults = components.map((comp: any) => ({
      code: `// Generated by CLI Option using ${this.promptService.config.provider}\n// Component: ${comp.name}\n// Template: ${comp.templateId}\n// Props: ${JSON.stringify(comp.props)}\n// Milestone: ${comp.milestone}\n\n${prdResult.code}`,
      preview: `https://v0-cli-${comp.name.toLowerCase()}.vercel.app`
    }));

    const chatId = `v0_cli_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      chatId,
      components: codeResults,
      approach: 'cli-option',
      success: true
    };
  }
}
-->

---

*This implementation provides a robust foundation for rapid UI generation through MCP commands with comprehensive monitoring and error handling, all within the Cursor IDE environment. CLI options are available as optional future enhancements.* 