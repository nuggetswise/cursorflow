# CLI Option Architecture

This document contains the architecture specifications for the **CLI (Command Line Interface) option** - a secondary approach to the CursorFlow platform.

## ⚠️ **Important Note**

**CLI is currently a secondary option and not actively developed.** The primary approach is **MCP-first** integration with Cursor IDE.

## 🏗️ **CLI System Architecture**

### **CLI Architecture Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLI Option Layer                         │
├─────────────────────────────────────────────────────────────────┤
│  NPX CLI Package  │  CLI Service  │  CLI Templates  │  CLI Utils │
│                   │               │                 │            │
│ - PRD Commands    │ - API Client  │ - React TS      │ - Config   │
│ - V0 Commands     │ - V0 Client   │ - Next.js       │ - Logger   │
│ - Project Commands│ - File Writer │ - Vue TS        │ - Validator│
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  API Gateway  │  Auth Service  │  Rate Limiter  │  Analytics   │
│               │                │                │              │
│ - Request     │ - API Key      │ - CLI Limits   │ - Usage      │
│   Routing     │   Validation   │ - Rate         │   Tracking   │
│ - Response    │ - Session      │   Enforcement  │ - Metrics    │
│   Formatting  │   Management   │                │              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Core Service Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  Prompt Service  │  V0 Service  │  Audit Service  │  Auth Service│
│                  │              │                │              │
│ - PRD Generation│ - V0 API      │ - Code Analysis│ - User Mgmt  │
│ - Template      │   Integration │ - Quality      │ - Permissions│
│   Management    │ - Component   │   Metrics      │ - Sessions   │
│ - LLM Provider  │   Generation  │ - Suggestions  │              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                 │
├─────────────────────────────────────────────────────────────────┤
│  Supabase (Postgres)  │  File System  │  External APIs          │
│                       │               │                         │
│ - Users & Sessions    │ - Templates   │ - V0 Platform API       │
│ - PRDs & Projects     │ - Generated   │ - OpenAI API            │
│ - Usage Analytics     │   Files       │ - Other LLM APIs        │
│ - Rate Limiting       │ - Logs        │                         │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 **CLI Service Architecture**

### **CLI Service Implementation**

```typescript
// services/cli-option.service.ts
interface CLIOptionService {
  executeCLIOptionPRD(userPrompt: string, template?: string): Promise<any>;
  generateCLICode(chatId: string, requirements: string): Promise<V0Code>;
  scaffoldCLIProject(projectName: string, template: string): Promise<any>;
}

class CLIOptionServiceImpl implements CLIOptionService {
  constructor(
    private promptService: PromptService,
    private v0Service: V0Service,
    private auditService: AuditService
  ) {}

  async executeCLIOptionPRD(userPrompt: string, template: string = 'detailed'): Promise<any> {
    try {
      // Load CLI-specific prompt template
      const prdPrompt = await this.promptService.loadPrompt('product-manager', 'cli-option');
      
      // Generate PRD using LLM
      const prdResult = await this.promptService.generatePRD({
        prompt: userPrompt,
        template,
        approach: 'cli-option'
      });

      // Audit the generated PRD
      const auditResult = await this.auditService.analyzePRD(prdResult);

      return {
        success: true,
        data: {
          prd: prdResult,
          audit: auditResult,
          approach: 'cli-option'
        }
      };
    } catch (error) {
      console.error('CLI option PRD generation error:', error);
      throw new Error('Failed to generate CLI option PRD');
    }
  }

  async generateCLICode(chatId: string, requirements: string): Promise<V0Code> {
    // Execute CLI option PRD generation first
    const prdResult = await this.promptService.executeCLIOptionPRD(request.prompt, 'detailed');
    
    // Generate V0 component based on PRD
    const v0Result = await this.v0Service.generateComponent(chatId, requirements);
    
    return {
      code: `// Generated by CLI Option using ${this.promptService.config.provider}\n// Component: ${comp.name}\n// Template: ${comp.templateId}\n// Props: ${JSON.stringify(comp.props)}\n// Milestone: ${comp.milestone}\n\n${prdResult.code}`,
      preview: `https://v0-cli-${comp.name.toLowerCase()}.vercel.app`,
      chatId: `v0_cli_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      projectUrl: `https://v0.dev/chat/${chatId}`,
      deploymentUrl: `https://v0-cli-${comp.name.toLowerCase()}.vercel.app`,
      approach: 'cli-option',
      files: prdResult.files || []
    };
  }

  async scaffoldCLIProject(projectName: string, template: string): Promise<any> {
    // Project scaffolding logic for CLI option
    const projectStructure = await this.loadProjectTemplate(template);
    const generatedFiles = await this.generateProjectFiles(projectName, projectStructure);
    
    return {
      success: true,
      data: {
        projectName,
        template,
        files: generatedFiles,
        approach: 'cli-option'
      }
    };
  }
}
```

## 📊 **CLI Database Schema**

### **CLI Usage Tracking Tables**

```sql
-- CLI usage tracking
CREATE TABLE cli_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id UUID REFERENCES sessions(id),
  command VARCHAR(100) NOT NULL,
  approach TEXT CHECK (approach IN ('cli-option')),
  options JSONB,
  execution_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CLI rate limiting
CREATE TABLE cli_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  approach TEXT CHECK (approach IN ('cli-option')),
  requests_count INTEGER DEFAULT 0,
  reset_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CLI analytics
CREATE TABLE cli_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  event_type TEXT CHECK (event_type IN ('prd_created', 'project_generated', 'api_call', 'cli-option')),
  approach TEXT CHECK (approach IN ('cli-option')),
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔐 **CLI Authentication Architecture**

### **CLI API Key Management**

```typescript
// middleware/cli-auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

export async function cliAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const apiKey = req.headers.authorization?.replace('Bearer ', '');
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'API key required for CLI access',
          code: 'CLI_API_KEY_REQUIRED'
        }
      });
    }

    // Validate API key
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, subscription_plan, cli_option_enabled')
      .eq('api_key', apiKey)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid API key',
          code: 'CLI_INVALID_API_KEY'
        }
      });
    }

    // Check CLI access
    if (!user.cli_option_enabled) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'CLI option not enabled for this account',
          code: 'CLI_ACCESS_DENIED'
        }
      });
    }

    // Add user to request
    req.user = user;
    req.approach = 'cli-option';
    
    next();
  } catch (error) {
    console.error('CLI auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Authentication error',
        code: 'CLI_AUTH_ERROR'
      }
    });
  }
}
```

## 📈 **CLI Rate Limiting Architecture**

### **CLI Rate Limiter Implementation**

```typescript
// middleware/cli-rate-limiter.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

const CLI_RATE_LIMITS = {
  'cli-option': { requests: 1000, window: 3600000 }, // 1000 requests/hour
  'multi-platform': { requests: 5000, window: 3600000 } // 5000 requests/hour
};

export async function cliRateLimiterMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const approach = 'cli-option';
    const plan = req.user.subscription_plan;
    
    const limit = CLI_RATE_LIMITS[plan] || CLI_RATE_LIMITS['cli-option'];
    
    // Check current usage
    const { data: usage, error } = await supabase
      .from('cli_rate_limits')
      .select('requests_count, reset_time')
      .eq('user_id', userId)
      .eq('approach', approach)
      .single();

    const now = new Date();
    
    if (usage && usage.reset_time && new Date(usage.reset_time) < now) {
      // Reset window
      await supabase
        .from('cli_rate_limits')
        .update({
          requests_count: 1,
          reset_time: new Date(now.getTime() + limit.window),
          updated_at: now
        })
        .eq('user_id', userId)
        .eq('approach', approach);
    } else if (usage && usage.requests_count >= limit.requests) {
      return res.status(429).json({
        success: false,
        error: {
          message: `Rate limit exceeded for CLI option (${limit.requests} requests/hour)`,
          code: 'CLI_RATE_LIMIT_EXCEEDED',
          details: {
            limit: limit.requests,
            resetTime: usage.reset_time
          }
        }
      });
    } else {
      // Increment usage
      await supabase
        .from('cli_rate_limits')
        .upsert({
          user_id: userId,
          approach,
          requests_count: (usage?.requests_count || 0) + 1,
          reset_time: usage?.reset_time || new Date(now.getTime() + limit.window),
          updated_at: now
        });
    }
    
    next();
  } catch (error) {
    console.error('CLI rate limiter error:', error);
    next(); // Continue on error to avoid blocking
  }
}
```

## 📊 **CLI Analytics Architecture**

### **CLI Analytics Service**

```typescript
// services/cli-analytics.service.ts
export class CLIAnalyticsService {
  constructor(private supabase: SupabaseClient) {}

  async trackCLIEvent(userId: string, eventType: string, metadata: any = {}): Promise<void> {
    try {
      await this.supabase
        .from('cli_analytics')
        .insert({
          user_id: userId,
          event_type: eventType,
          approach: 'cli-option',
          metadata
        });
    } catch (error) {
      console.error('CLI analytics tracking error:', error);
    }
  }

  async getCLIUsageStats(userId: string, timeframe: string = '30d'): Promise<any> {
    const { data, error } = await this.supabase
      .from('cli_analytics')
      .select('event_type, metadata, timestamp')
      .eq('user_id', userId)
      .eq('approach', 'cli-option')
      .gte('timestamp', new Date(Date.now() - this.getTimeframeMs(timeframe)))
      .order('timestamp', { ascending: false });

    if (error) {
      throw new Error('Failed to get CLI usage stats');
    }

    return this.aggregateCLIStats(data);
  }

  private aggregateCLIStats(events: any[]): any {
    const stats = {
      totalEvents: events.length,
      eventTypes: {},
      commandUsage: {},
      averageExecutionTime: 0
    };

    events.forEach(event => {
      // Aggregate by event type
      stats.eventTypes[event.event_type] = (stats.eventTypes[event.event_type] || 0) + 1;
      
      // Aggregate command usage
      if (event.metadata?.command) {
        stats.commandUsage[event.metadata.command] = (stats.commandUsage[event.metadata.command] || 0) + 1;
      }
    });

    return stats;
  }

  private getTimeframeMs(timeframe: string): number {
    const timeframes = {
      '1d': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000
    };
    return timeframes[timeframe] || timeframes['30d'];
  }
}
```

## 🔄 **CLI Template Architecture**

### **CLI Template System**

```typescript
// services/cli-template.service.ts
export class CLITemplateService {
  private templates: Map<string, CLITemplate> = new Map();

  constructor() {
    this.loadTemplates();
  }

  private loadTemplates(): void {
    // Load React TypeScript template
    this.templates.set('react-typescript', {
      name: 'react-typescript',
      description: 'React with TypeScript template',
      files: [
        {
          path: 'package.json',
          content: this.getReactTSPackageJson()
        },
        {
          path: 'src/App.tsx',
          content: this.getReactTSAppContent()
        },
        {
          path: 'tsconfig.json',
          content: this.getReactTSTsConfig()
        }
      ]
    });

    // Load Next.js template
    this.templates.set('next-js', {
      name: 'next-js',
      description: 'Next.js with TypeScript template',
      files: [
        {
          path: 'package.json',
          content: this.getNextJSPackageJson()
        },
        {
          path: 'pages/index.tsx',
          content: this.getNextJSIndexContent()
        }
      ]
    });
  }

  async generateProject(projectName: string, templateName: string): Promise<GeneratedFile[]> {
    const template = this.templates.get(templateName);
    
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }

    const files: GeneratedFile[] = [];
    
    for (const fileTemplate of template.files) {
      const content = this.processTemplate(fileTemplate.content, { projectName });
      
      files.push({
        path: fileTemplate.path,
        content,
        size: content.length
      });
    }

    return files;
  }

  private processTemplate(content: string, variables: any): string {
    return content.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
      return variables[variable] || match;
    });
  }

  getAvailableTemplates(): CLITemplate[] {
    return Array.from(this.templates.values());
  }
}
```

## 📚 **Related Documentation**

- **Primary Approach**: `../dev-implementation/` - MCP-first implementation
- **CLI API Specs**: `CLI_SPECS.md` - CLI API specifications
- **CLI Integration**: `CLI_INTEGRATION.md` - CLI integration details
- **CLI Testing**: `CLI_TESTING.md` - CLI testing strategies

---

*For the primary MCP-first approach, see the `../dev-implementation/` folder.* 