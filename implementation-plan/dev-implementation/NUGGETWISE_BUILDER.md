# Nuggetwise Builder - MCP Server Implementation Guide

## 🚀 **Overview**

Nuggetwise Builder is the **only MCP server** for CursorFlow platform, providing a single `/nw` command interface that generates React/Tailwind UIs in under 30 seconds using V0 AI-powered UI generation. It uses a 7-agent orchestration system to transform spoken ideas into working code with direct file writing capabilities, all within the Cursor IDE environment. CLI and extension options are available as optional future enhancements (commented out at the bottom of this document).

---

## **🎯 Core Features**

### **Single Command Interface**
```bash
/nw build "Job tracker app with dark mode and drag-and-drop"
/nw update "Add user authentication to the login form"
/nw pull "Get the latest design from Figma"
```

### **7-Agent Orchestration System + V0 Integration**
1. **Intent Analysis Agent**: Understands user goals and requirements
2. **UX Pattern Selector**: Chooses appropriate UI patterns
3. **Validation Agent**: Validates feasibility and suggests improvements
4. **UI Requirement Synthesizer**: Converts patterns to component specs
5. **V0 Prompt Builder**: Creates optimized prompts for V0 API
6. **V0 UI Generator**: Generates AI-powered UI components with direct file writing
7. **Diff Detector**: Identifies changes and potential conflicts
8. **Notification Agent**: Sends updates to Slack and other channels

---

## **🏗️ Technical Implementation**

### **MCP Server Architecture**
```typescript
// packages/nw-mcp/src/index.ts
import express from "express";
import { budgetGuard, timeoutGuard } from "./middleware/guards";
import { buildProduct, updateFlow, pullDesigns } from "./handlers";
import { agentOrchestrator } from "./services/orchestrator";
import { v0IntegrationService } from "./services/v0-integration";

const app = express();

// Middleware
app.use(express.json());
app.use(budgetGuard);
app.use(timeoutGuard);

// Routes
app.post("/build_product", buildProduct);
app.post("/update_flow", updateFlow);
app.post("/pull_designs", pullDesigns);

// V0 Integration routes
app.post("/v0/generate", v0IntegrationService.generateUI);
app.post("/v0/analyze", v0IntegrationService.analyzeWorkspace);

// Agent orchestration
app.use("/agents", agentOrchestrator);

app.listen(process.env.PORT || 8787, () => {
  console.log("Nuggetwise MCP Server running on port 8787");
});
```

### **Agent Orchestrator Service**
```typescript
// packages/nw-mcp/src/services/orchestrator.ts
export class AgentOrchestrator {
  private agents = {
    intent: new IntentAnalysisAgent(),
    ux: new UXPatternSelectorAgent(),
    validation: new ValidationAgent(),
    uiReq: new UIRequirementSynthesizerAgent(),
    v0Builder: new V0PromptBuilderAgent(),
    diff: new DiffDetectorAgent(),
    notification: new NotificationAgent()
  };

  async orchestrateBuild(prompt: string): Promise<BuildResult> {
    // Step 1: Intent Analysis
    const intent = await this.agents.intent.analyze(prompt);
    
    // Step 2: UX Pattern Selection
    const uxPatterns = await this.agents.ux.selectPatterns(intent);
    
    // Step 3: Validation
    const validation = await this.agents.validation.validate(intent, uxPatterns);
    
    // Step 4: UI Requirements
    const uiReqs = await this.agents.uiReq.synthesize(uxPatterns, validation);
    
    // Step 5: V0 Prompt Building
    const v0Prompt = await this.agents.v0Builder.buildPrompt(uiReqs);
    
    // Step 6: V0 UI Generation
    const v0Result = await this.v0Service.generateUI(v0Prompt, targetDir);
    
    // Step 7: Generate Code
    const code = await this.generateCode(v0Result);
    
    // Step 7: Notification
    await this.agents.notification.notify({
      event: 'build_completed',
      details: { prompt, components: code.components }
    });

    return {
      components: code.components,
      files: code.files,
      v0Generation: {
        files: v0Result.files,
        previewUrl: v0Result.previewUrl,
        performance: v0Result.performance
      }
      preview: code.preview
    };
  }
}
```

---

## **🤖 Agent Implementations**

### **1. Intent Analysis Agent**
```typescript
// packages/nw-mcp/src/agents/intent-analysis.ts
export class IntentAnalysisAgent {
  async analyze(prompt: string): Promise<IntentAnalysis> {
    const systemPrompt = await this.loadPrompt('intent.json');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt.system },
        { role: 'user', content: JSON.stringify({ idea: prompt }) }
      ],
      response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0].message.content);
  }
}

interface IntentAnalysis {
  goal: string;
  userRoles: string[];
  coreFeatures: Array<{
    name: string;
    description: string;
  }>;
  constraints: string[];
}
```

### **2. UX Pattern Selector Agent**
```typescript
// packages/nw-mcp/src/agents/ux-pattern-selector.ts
export class UXPatternSelectorAgent {
  private patternLibrary = {
    'authentication': ['login-form', 'signup-form', 'password-reset'],
    'data-display': ['table', 'card-grid', 'list-view'],
    'navigation': ['navbar', 'sidebar', 'breadcrumbs'],
    'forms': ['multi-step-form', 'inline-form', 'modal-form'],
    'feedback': ['toast', 'modal', 'inline-validation']
  };

  async selectPatterns(intent: IntentAnalysis): Promise<UXSelection[]> {
    const systemPrompt = await this.loadPrompt('ux_selector.json');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt.system },
        { role: 'user', content: JSON.stringify({ coreFeatures: intent.coreFeatures }) }
      ],
      response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0].message.content).selections;
  }
}
```

### **3. Validation Agent**
```typescript
// packages/nw-mcp/src/agents/validation.ts
export class ValidationAgent {
  async validate(intent: IntentAnalysis, uxPatterns: UXSelection[]): Promise<ValidationResult> {
    const systemPrompt = await this.loadPrompt('validation.json');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt.system },
        { 
          role: 'user', 
          content: JSON.stringify({ 
            goal: intent.goal, 
            userRoles: intent.userRoles, 
            coreFeatures: intent.coreFeatures 
          }) 
        }
      ],
      response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0].message.content);
  }
}
```

---

## **🔧 Middleware & Guards**

### **Budget Guard**
```typescript
// packages/nw-mcp/src/middleware/budget-guard.ts
export const budgetGuard = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'] as string;
  const weeklyBudget = process.env.BUDGET_WEEKLY_USD || 50;
  
  const currentSpend = await getWeeklySpend(userId);
  
  if (currentSpend >= weeklyBudget) {
    return res.status(402).json({
      error: 'budget_exceeded',
      message: 'Weekly budget limit reached',
      currentSpend,
      weeklyBudget
    });
  }
  
  next();
};
```

### **Timeout Guard**
```typescript
// packages/nw-mcp/src/middleware/timeout-guard.ts
export const timeoutGuard = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeout = setTimeout(() => {
      res.status(408).json({
        error: 'timeout',
        message: 'Request timed out',
        timeoutMs
      });
    }, timeoutMs);

    res.on('finish', () => clearTimeout(timeout));
    next();
  };
};
```

---

## **📁 File Structure**

```
packages/nw-mcp/
├── src/
│   ├── index.ts                 # MCP server entry point
│   ├── handlers/
│   │   ├── build-product.ts     # /nw build handler
│   │   ├── update-flow.ts       # /nw update handler
│   │   └── pull-designs.ts      # /nw pull handler
│   ├── agents/
│   │   ├── intent-analysis.ts
│   │   ├── ux-pattern-selector.ts
│   │   ├── validation.ts
│   │   ├── ui-requirement-synthesizer.ts
│   │   ├── v0-prompt-builder.ts
│   │   ├── diff-detector.ts
│   │   └── notification.ts
│   ├── services/
│   │   ├── orchestrator.ts
│   │   ├── v0-client.ts
│   │   ├── file-puller.ts
│   │   └── slack-notifier.ts
│   ├── middleware/
│   │   ├── budget-guard.ts
│   │   ├── timeout-guard.ts
│   │   └── auth-guard.ts
│   ├── utils/
│   │   ├── prompt-loader.ts
│   │   ├── cost-calculator.ts
│   │   └── file-writer.ts
│   └── types/
│       ├── index.ts
│       ├── agents.ts
│       └── responses.ts
├── prompts/
│   ├── intent.json
│   ├── ux_selector.json
│   ├── validation.json
│   ├── ui_req.json
│   ├── v0_builder.txt
│   ├── diff.json
│   └── notify.json
├── tests/
│   ├── agents/
│   ├── handlers/
│   └── integration/
├── package.json
└── tsconfig.json
```

---

## **🔗 Cursor Integration**

### **Cursor Rules Configuration**
```yaml
# .cursor/rules/nw.yaml
- when: /^\/nw\s+build /
  tool: build_product
  passArgsAs: { prompt: $message.stripCommand("nw build") }

- when: /^\/nw\s+update /
  tool: update_flow
  passArgsAs: { change: $message.stripCommand("nw update") }

- when: /^\/nw\s+pull/
  tool: pull_designs
```

### **MCP Tool Definitions**
```typescript
// packages/nw-mcp/src/tools/index.ts
export const tools = {
  build_product: {
    description: "Build a React/Tailwind UI from a description (MCP-only approach)",
    parameters: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "Description of the UI to build"
        }
      },
      required: ["prompt"]
    }
  },
  
  update_flow: {
    description: "Update an existing UI with new features (MCP-only approach)",
    parameters: {
      type: "object",
      properties: {
        change: {
          type: "string",
          description: "Description of the changes to make"
        }
      },
      required: ["change"]
    }
  },
  
  pull_designs: {
    description: "Pull latest designs from external sources",
    parameters: {
      type: "object",
      properties: {}
    }
  }
}

### **V0 Integration Service**
```typescript
// packages/nw-mcp/src/services/v0-integration.ts
export class V0IntegrationService {
  private v0Client: V0Client;
  private fileManager: FileManager;

  constructor() {
    this.v0Client = new V0Client(process.env.V0_API_KEY);
    this.fileManager = new FileManager();
  }

  async generateUI(prompt: string, targetDir: string): Promise<V0GenerationResult> {
    // Generate UI using V0 API
    const result = await this.v0Client.generate(prompt, {
      model: process.env.V0_MODEL || 'v0-1.5-md'
    });
    
    // Write files to target directory
    const writtenFiles = await this.fileManager.writeFiles(result.files, targetDir);
    
    return {
      files: writtenFiles,
      previewUrl: result.previewUrl,
      performance: {
        generationTime: result.generationTime,
        tokenCount: result.tokenCount,
        cost: result.cost
      }
    };
  }

  async analyzeWorkspace(workspace: string): Promise<WorkspaceAnalysis> {
    // Analyze existing workspace for context-aware generation
    return this.v0Client.analyzeWorkspace(workspace);
  }
}
```;
```

---

## **🚀 Deployment**

### **Local Development**
```bash
# Install dependencies
cd packages/nw-mcp
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

### **Production Deployment**
```bash
# Build the package
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy as Docker container
docker build -t nuggetwise-mcp .
docker run -p 8787:8787 nuggetwise-mcp
```

---

## **📊 Monitoring & Analytics**

### **Key Metrics**
- **Build Success Rate**: Percentage of successful builds
- **Average Build Time**: Time from command to working code
- **Cost per Build**: API costs and resource usage
- **User Satisfaction**: Feedback and ratings

### **Error Tracking**
```typescript
// packages/nw-mcp/src/utils/error-tracker.ts
export class ErrorTracker {
  async trackError(error: Error, context: BuildContext) {
    await analytics.track('build_error', {
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
  }
}
```

---

## **🔧 Configuration**

### **Environment Variables**
```bash
# Core Configuration
NODE_ENV=production
PORT=8787
LOG_LEVEL=info

# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# v0 Integration
V0_API_KEY=v0_...
V0_BASE_URL=https://api.v0.dev

# External Services
SLACK_WEBHOOK_URL=https://...
SLACK_CHANNEL=#nuggetwise-builds

# Budget & Limits
BUDGET_WEEKLY_USD=50
MAX_BUILD_TIME=30000
MAX_TOKENS_PER_BUILD=10000

# Monitoring
SENTRY_DSN=https://...
ANALYTICS_KEY=...
```

---

---

## **🚫 CLI & Extension Implementation (Commented Out - Only When Required)**

> **Note**: The following sections are commented out as CLI and VS Code extension are optional future enhancements. The primary focus is MCP integration within Cursor IDE.

<!--
## **📦 CLI Package Development (Optional Future)**

### **CLI Package Structure**
```bash
# Create CLI package
mkdir packages/nuggetwise-cli
cd packages/nuggetwise-cli
npm init

# Configure package.json
{
  "name": "nuggetwise-cli",
  "bin": {
    "nw": "./bin/nw.js"
  },
  "files": ["bin/", "templates/"]
}
```

### **CLI Implementation**
```javascript
#!/usr/bin/env node
// bin/nw.js

const { program } = require('commander');
const { buildProduct, updateFlow, pullDesigns } = require('../src/commands');

program
  .command('build <prompt>')
  .description('Build a new application from description')
  .action(buildProduct);

program
  .command('update <change>')
  .description('Update existing application with new features')
  .action(updateFlow);

program
  .command('pull <source>')
  .description('Pull latest design from external sources')
  .action(pullDesigns);

program.parse();
```

### **VS Code Extension Development (Optional Future)**

### **Extension Configuration**
```json
{
  "name": "nuggetwise-vscode",
  "displayName": "Nuggetwise Builder",
  "description": "Generate UI components with V0",
  "version": "1.0.0",
  "engines": { "vscode": "^1.60.0" },
  "categories": ["Other"],
  "activationEvents": ["onCommand:nuggetwise.build"],
  "contributes": {
    "commands": [
      {
        "command": "nuggetwise.build",
        "title": "Build UI with Nuggetwise"
      }
    ]
  }
}
```

### **Extension Implementation**
```typescript
// src/extension.ts
import * as vscode from 'vscode';
import { NuggetwiseBuilder } from './builder';

export function activate(context: vscode.ExtensionContext) {
  const builder = new NuggetwiseBuilder();
  
  let disposable = vscode.commands.registerCommand('nuggetwise.build', async () => {
    const prompt = await vscode.window.showInputBox({
      prompt: 'Describe the UI you want to generate'
    });
    
    if (prompt) {
      const result = await builder.build(prompt);
      vscode.window.showInformationMessage(`Generated ${result.files.length} files`);
    }
  });
  
  context.subscriptions.push(disposable);
}
-->
---

*This implementation provides a robust foundation for rapid UI generation through MCP commands with comprehensive monitoring and error handling, all within the Cursor IDE environment. CLI and extension options are available as optional future enhancements.* 