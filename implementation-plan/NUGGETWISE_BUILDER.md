# Nuggetwise Builder - Quick Build Implementation

## 🚀 **Overview**

Nuggetwise Builder is the "Quick Build Mode" of CursorFlow, providing a single `/nw` command interface that generates React/Tailwind frontends in under 30 seconds. It uses a 7-agent orchestration system to transform spoken ideas into working code.

---

## **🎯 Core Features**

### **Single Command Interface**
```bash
/nw build "Job tracker app with dark mode and drag-and-drop"
/nw update "Add user authentication to the login form"
/nw pull "Get the latest design from Figma"
```

### **7-Agent Orchestration System**
1. **Intent Analysis Agent**: Understands user goals and requirements
2. **UX Pattern Selector**: Chooses appropriate UI patterns
3. **Validation Agent**: Validates feasibility and suggests improvements
4. **UI Requirement Synthesizer**: Converts patterns to component specs
5. **v0 Prompt Builder**: Creates optimized prompts for v0.dev
6. **Diff Detector**: Identifies changes and potential conflicts
7. **Notification Agent**: Sends updates to Slack and other channels

---

## **🏗️ Technical Implementation**

### **MCP Server Architecture**
```typescript
// packages/nw-mcp/src/index.ts
import express from "express";
import { budgetGuard, timeoutGuard } from "./middleware/guards";
import { buildProduct, updateFlow, pullDesigns } from "./handlers";
import { agentOrchestrator } from "./services/orchestrator";

const app = express();

// Middleware
app.use(express.json());
app.use(budgetGuard);
app.use(timeoutGuard);

// Routes
app.post("/build_product", buildProduct);
app.post("/update_flow", updateFlow);
app.post("/pull_designs", pullDesigns);

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
    
    // Step 5: v0 Prompt Building
    const v0Prompt = await this.agents.v0Builder.buildPrompt(uiReqs);
    
    // Step 6: Generate Code
    const code = await this.generateCode(v0Prompt);
    
    // Step 7: Notification
    await this.agents.notification.notify({
      event: 'build_completed',
      details: { prompt, components: code.components }
    });

    return {
      components: code.components,
      files: code.files,
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
    description: "Build a React/Tailwind frontend from a description",
    parameters: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "Description of the frontend to build"
        }
      },
      required: ["prompt"]
    }
  },
  
  update_flow: {
    description: "Update an existing frontend with new features",
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
};
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

*This implementation provides a robust foundation for rapid frontend generation with comprehensive monitoring and error handling.* 