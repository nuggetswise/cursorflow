# MCP Package Alignment Checklist

## 🎯 **Overview**

This checklist covers the complete alignment of the `packages/nw-mcp` directory with the **MCP-first approach** for CursorFlow. The goal is to update all terminology, configuration, and implementation to reflect **MCP integration as the primary and default approach** for Cursor IDE native integration. CLI option is only available as an optional fallback when specifically required.

---

## 📋 **Terminology Updates (High Priority)**

### **1. Type Definitions Update**
**File**: `packages/nw-mcp/src/types/index.ts`

#### **1.1 BuildRequest Interface**
```typescript
// BEFORE
export interface BuildRequest {
  prompt: string;
  mode: 'quick-build' | 'full-platform';  // ❌ Old terminology
  userId: string;
  projectId?: string | undefined;
  budget?: number | undefined;
  timeout?: number | undefined;
}

// AFTER
export interface BuildRequest {
  prompt: string;
  approach: 'mcp-integration';  // ✅ MCP-first terminology - always MCP integration
  userId: string;
  projectId?: string | undefined;
  budget?: number | undefined;
  timeout?: number | undefined;
}
```

#### **1.2 ValidationAgent Types**
```typescript
// BEFORE
suggestedMode: 'quick-build' | 'full-platform';  // ❌ Old terminology

// AFTER
suggestedApproach: 'mcp-integration';  // ✅ MCP-first terminology - always MCP integration
```

### **2. Validation Schema Update**
**File**: `packages/nw-mcp/src/index.ts`

#### **2.1 BuildRequestSchema**
```typescript
// BEFORE
const BuildRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  mode: z.enum(['quick-build', 'full-platform']).default('quick-build'),  // ❌ Old terminology
  userId: z.string().min(1, 'User ID is required'),
  projectId: z.string().optional(),
  budget: z.number().positive().optional(),
  timeout: z.number().positive().optional()
});

// AFTER
const BuildRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  approach: z.enum(['mcp-integration']).default('mcp-integration'),  // ✅ MCP-first terminology - always MCP integration
  userId: z.string().min(1, 'User ID is required'),
  projectId: z.string().optional(),
  budget: z.number().positive().optional(),
  timeout: z.number().positive().optional()
});
```

### **3. Agent Orchestrator Update**
**File**: `packages/nw-mcp/src/services/AgentOrchestrator.ts`

#### **3.1 Method Names**
```typescript
// BEFORE
async executeQuickBuildOrchestration(request: BuildRequest): Promise<OrchestrationResult>
async executeFullPlatformOrchestration(request: BuildRequest): Promise<OrchestrationResult>

// AFTER
async executeMCPIntegrationOrchestration(request: BuildRequest): Promise<OrchestrationResult>
// async executeCLIOptionOrchestration(request: BuildRequest): Promise<OrchestrationResult>  // COMMENTED OUT - CLI only when required
```

#### **3.2 Validation Logic**
```typescript
// BEFORE
if (validation.suggestedMode === 'full-platform' && request.mode === 'quick-build') {
  console.log('⚠️ Validation suggests upgrading to full platform mode');
}

// AFTER
// Validation always suggests MCP integration - CLI only when explicitly required
console.log('✅ Validation confirms MCP integration approach');
```

---

## 🔧 **Configuration Updates (High Priority)**

### **4. Environment Configuration**
**File**: `packages/nw-mcp/env.example`

#### **4.1 Add Supabase Configuration**
```bash
# BEFORE (Missing Supabase)
# No Supabase configuration

# AFTER (Add Supabase)
# Supabase Configuration (Primary Database)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ENABLE_RLS=true
SUPABASE_AUTO_MIGRATE=true
```

#### **4.2 Add MCP-Specific Configuration**
```bash
# BEFORE (Missing MCP-specific settings)
# No MCP-specific configuration

# AFTER (Add MCP-specific settings)
# MCP Integration Configuration (Primary)
MCP_SERVER_PORT=8788
MCP_SERVER_HOST=localhost
MCP_ENABLE_SSL=false
MCP_ENABLE_CACHING=true
MCP_CACHE_TTL=3600
MCP_AGENT_TIMEOUT=30000
MCP_MAX_TOKENS=10000
MCP_ENABLE_ORCHESTRATION=true

# Cursor IDE Integration
CURSOR_MCP_ENABLED=true
CURSOR_RULES_PATH=.cursor/rules/mcp.yaml

# CLI Option Configuration (Optional - Commented Out)
# ENABLE_CLI_OPTION=false
# CLI_PACKAGE_NAME=nuggetwise-cli
# CLI_ENABLE_AUTOMATION=false
```

#### **4.3 Update Server Configuration**
```bash
# BEFORE
PORT=3001

# AFTER
PORT=3001
MCP_SERVER_PORT=8788  # Primary MCP server port
# CLI_SERVER_PORT=3001  # Secondary CLI server port (COMMENTED OUT - CLI only when required)
```

### **5. Package.json Updates**
**File**: `packages/nw-mcp/package.json`

#### **5.1 Add Supabase Dependencies**
```json
// BEFORE
"dependencies": {
  "express": "^4.18.2",
  "openai": "^4.20.1",
  // ... existing dependencies
}

// AFTER
"dependencies": {
  "express": "^4.18.2",
  "openai": "^4.20.1",
  "@supabase/supabase-js": "^2.39.0",  // ✅ Add Supabase client
  // ... existing dependencies
}
```

#### **5.2 Update Package Description**
```json
// BEFORE
"description": "Nuggetwise Builder MCP Server for CursorFlow",

// AFTER
"description": "MCP-First Nuggetwise Builder Server for CursorFlow Platform",
```

---

## 📝 **Documentation Updates (Medium Priority)**

### **6. README Updates**
**File**: `packages/nw-mcp/README.md`

#### **6.1 Update Title and Description**
```markdown
# BEFORE
# Nuggetwise MCP Server
The Nuggetwise MCP (Model Context Protocol) Server is the core component of the CursorFlow hybrid platform

# AFTER
# Nuggetwise MCP Server (MCP-First Platform)
The Nuggetwise MCP (Model Context Protocol) Server is the core component of the CursorFlow MCP-first platform
```

#### **6.2 Update Features Section**
```markdown
# BEFORE
- **7-Agent Orchestration**: Intent Analysis → UX Pattern Selection → Validation → UI Requirements → V0 Prompt Building

# AFTER
- **7-Agent Orchestration (MCP Integration)**: Intent Analysis → UX Pattern Selection → Validation → UI Requirements → V0 Prompt Building
- **Cursor IDE Native Integration**: Seamless MCP integration for instant results
- **Supabase Integration**: Primary database with Row Level Security
```

#### **6.3 Update Configuration Section**
```markdown
# BEFORE
| `V0_API_KEY` | V0.dev API key | Optional |

# AFTER
| `V0_API_KEY` | V0.dev API key | Required |
| `SUPABASE_URL` | Supabase project URL | Required |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Required |
| `MCP_SERVER_PORT` | MCP server port | `8788` |
```

### **7. API Documentation Updates**
**File**: `packages/nw-mcp/README.md`

#### **7.1 Update API Endpoints**
```markdown
# BEFORE
{
  "prompt": "Create a todo app with form and list",
  "mode": "quick-build",
  "userId": "user-123",
  "projectId": "optional-project-id"
}

# AFTER
{
  "prompt": "Create a todo app with form and list",
  "approach": "mcp-integration",
  "userId": "user-123",
  "projectId": "optional-project-id"
}
```

---

## 🗄️ **Database Integration (High Priority)**

### **8. Add Supabase Client**
**File**: `packages/nw-mcp/src/services/SupabaseClient.ts` (New File)

#### **8.1 Create Supabase Client Service**
```typescript
import { createClient } from '@supabase/supabase-js';
import { EnvironmentConfig } from '../types';

export class SupabaseClient {
  private client: any;
  private adminClient: any;
  private config: EnvironmentConfig;

  constructor(config: EnvironmentConfig) {
    this.config = config;
    this.client = createClient(config.supabaseUrl, config.supabaseAnonKey);
    this.adminClient = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);
  }

  async saveBuildResult(buildData: any): Promise<string> {
    const { data, error } = await this.client
      .from('projects')
      .insert({
        user_id: buildData.userId,
        approach: buildData.approach,
        prompt: buildData.prompt,
        result: buildData.result,
        cost: buildData.cost,
        duration: buildData.duration
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to save build result: ${error.message}`);
    return data.id;
  }

  async getBuildHistory(userId: string): Promise<any[]> {
    const { data, error } = await this.client
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to get build history: ${error.message}`);
    return data;
  }
}
```

### **9. Update Environment Config Type**
**File**: `packages/nw-mcp/src/types/index.ts`

#### **9.1 Add Supabase Configuration**
```typescript
// BEFORE
export interface EnvironmentConfig {
  openaiApiKey: string;
  v0ApiKey: string;
  slackWebhookUrl?: string | undefined;
  cursorWorkspacePath: string;
  budget: BudgetConfig;
  mode: 'development' | 'production';
}

// AFTER
export interface EnvironmentConfig {
  openaiApiKey: string;
  v0ApiKey: string;
  slackWebhookUrl?: string | undefined;
  cursorWorkspacePath: string;
  budget: BudgetConfig;
  mode: 'development' | 'production';
  // Supabase Configuration
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  // MCP Configuration
  mcpServerPort: number;
  mcpEnableCaching: boolean;
  mcpAgentTimeout: number;
}
```

---

## 🔄 **Code Logic Updates (High Priority)**

### **10. Update Main Server File**
**File**: `packages/nw-mcp/src/index.ts`

#### **10.1 Update Environment Configuration**
```typescript
// BEFORE
const config: EnvironmentConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  v0ApiKey: process.env.V0_API_KEY || '',
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
  cursorWorkspacePath: process.env.CURSOR_WORKSPACE_PATH || '/workspace',
  budget: {
    maxCost: parseFloat(process.env.MAX_COST || '10.0'),
    maxTime: parseInt(process.env.MAX_TIME || '300000'),
    maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
    costPerToken: parseFloat(process.env.COST_PER_TOKEN || '0.00003')
  },
  mode: (process.env.NODE_ENV as 'development' | 'production') || 'development'
};

// AFTER
const config: EnvironmentConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  v0ApiKey: process.env.V0_API_KEY || '',
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
  cursorWorkspacePath: process.env.CURSOR_WORKSPACE_PATH || '/workspace',
  budget: {
    maxCost: parseFloat(process.env.MAX_COST || '10.0'),
    maxTime: parseInt(process.env.MAX_TIME || '300000'),
    maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
    costPerToken: parseFloat(process.env.COST_PER_TOKEN || '0.00003')
  },
  mode: (process.env.NODE_ENV as 'development' | 'production') || 'development',
  // Supabase Configuration
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  // MCP Configuration
  mcpServerPort: parseInt(process.env.MCP_SERVER_PORT || '8788'),
  mcpEnableCaching: process.env.MCP_ENABLE_CACHING === 'true',
  mcpAgentTimeout: parseInt(process.env.MCP_AGENT_TIMEOUT || '30000')
};
```

#### **10.2 Update Server Port**
```typescript
// BEFORE
const PORT = process.env.PORT || 3001;

// AFTER
const PORT = process.env.MCP_SERVER_PORT || 8788;  // MCP server port
```

### **11. Update Agent Orchestrator**
**File**: `packages/nw-mcp/src/services/AgentOrchestrator.ts`

#### **11.1 Update Method Names and Logic**
```typescript
// BEFORE
async executeQuickBuildOrchestration(request: BuildRequest): Promise<OrchestrationResult> {
  // ... existing logic
}

async executeFullPlatformOrchestration(request: BuildRequest): Promise<OrchestrationResult> {
  // ... existing logic
}

// AFTER
async executeMCPIntegrationOrchestration(request: BuildRequest): Promise<OrchestrationResult> {
  // ... existing logic with MCP-specific optimizations
}

async executeCLIOptionOrchestration(request: BuildRequest): Promise<OrchestrationResult> {
  // ... existing logic with CLI-specific optimizations
}
```

---

## 🧪 **Testing Updates (Medium Priority)**

### **12. Update Test Files**
**File**: `packages/nw-mcp/test-build.js`

#### **12.1 Update Test Data**
```javascript
// BEFORE
const testData = {
  prompt: "Create a todo app",
  mode: "quick-build",  // ❌ Old terminology
  userId: "test-user"
};

// AFTER
const testData = {
  prompt: "Create a todo app",
  approach: "mcp-integration",  // ✅ MCP-first terminology
  userId: "test-user"
};
```

### **13. Update Jest Tests**
**File**: `packages/nw-mcp/src/__tests__/` (All test files)

#### **13.1 Update Test Cases**
```typescript
// BEFORE
describe('Quick Build Orchestration', () => {
  it('should execute quick build mode', async () => {
    const request = {
      prompt: 'Create a todo app',
      mode: 'quick-build'  // ❌ Old terminology
    };
  });
});

// AFTER
describe('MCP Integration Orchestration', () => {
  it('should execute MCP integration mode', async () => {
    const request = {
      prompt: 'Create a todo app',
      approach: 'mcp-integration'  // ✅ MCP-first terminology
    };
  });
});
```

---

## 📊 **Implementation Priority Matrix**

| Task | Priority | Effort | Impact | Dependencies |
|------|----------|--------|--------|--------------|
| 1. Update Type Definitions | High | Low | High | None |
| 2. Update Validation Schema | High | Low | High | Task 1 |
| 3. Update Environment Config | High | Medium | High | None |
| 4. Add Supabase Integration | High | High | High | Task 3 |
| 5. Update Agent Orchestrator | High | Medium | High | Tasks 1, 2 |
| 6. Update README | Medium | Low | Medium | None |
| 7. Update Tests | Medium | Medium | Medium | Tasks 1, 2, 5 |
| 8. Update Package.json | Low | Low | Low | None |

---

## ✅ **Success Criteria**

### **Primary Success Metrics**
- [ ] **Terminology Consistency**: 100% of code uses MCP-first terminology
- [ ] **Supabase Integration**: All database operations use Supabase
- [ ] **Configuration Alignment**: All environment variables match MCP-first approach
- [ ] **Test Coverage**: All tests pass with updated terminology

### **Secondary Success Metrics**
- [ ] **Documentation Accuracy**: README and comments reflect MCP-first approach
- [ ] **Type Safety**: All TypeScript interfaces use correct terminology
- [ ] **Backward Compatibility**: Existing functionality preserved during transition

---

## 🚀 **Implementation Steps**

### **Phase 1: Core Updates (Week 1)**
1. Update type definitions and interfaces
2. Update validation schemas
3. Update environment configuration
4. Update main server file

### **Phase 2: Database Integration (Week 1)**
1. Add Supabase dependencies
2. Create Supabase client service
3. Update environment config types
4. Integrate database operations

### **Phase 3: Logic Updates (Week 2)**
1. Update agent orchestrator methods
2. Update validation logic
3. Update error handling
4. Update logging and monitoring

### **Phase 4: Documentation & Testing (Week 2)**
1. Update README and documentation
2. Update test files and test data
3. Update package.json and metadata
4. Final validation and testing

---

## 🚫 **CLI Option Implementation (Commented Out - Only When Required)**

> **Note**: CLI option is only implemented when explicitly required. MCP integration is always the primary and default approach.

### **CLI-Related Updates (Commented Out)**

#### **CLI Type Definitions (Optional)**
```typescript
// COMMENTED OUT - CLI only when required
/*
export interface CLIBuildRequest {
  prompt: string;
  approach: 'cli-option';
  userId: string;
  projectId?: string;
  automation?: boolean;
  scripting?: boolean;
}
*/
```

#### **CLI Environment Configuration (Optional)**
```bash
# COMMENTED OUT - CLI only when required
# CLI Option Configuration
# ENABLE_CLI_OPTION=false
# CLI_PACKAGE_NAME=nuggetwise-cli
# CLI_SERVER_PORT=3001
# CLI_ENABLE_AUTOMATION=false
# CLI_ENABLE_SCRIPTING=false
```

#### **CLI Agent Orchestrator (Optional)**
```typescript
// COMMENTED OUT - CLI only when required
/*
async executeCLIOptionOrchestration(request: BuildRequest): Promise<OrchestrationResult> {
  // CLI-specific orchestration logic
  // Only implemented when CLI is explicitly required
}
*/
```

#### **CLI Validation Logic (Optional)**
```typescript
// COMMENTED OUT - CLI only when required
/*
if (validation.suggestedApproach === 'cli-option') {
  console.log('⚠️ CLI option suggested for complex requirements');
  // CLI-specific handling
}
*/
```

#### **CLI Testing (Optional)**
```typescript
// COMMENTED OUT - CLI only when required
/*
describe('CLI Option Orchestration', () => {
  it('should execute CLI option mode', async () => {
    const request = {
      prompt: 'Create a complex enterprise system',
      approach: 'cli-option'
    };
  });
});
*/
```

---

*This checklist ensures complete alignment with the MCP-first approach, updating all terminology, configuration, and implementation to reflect MCP integration as the primary and default approach. CLI option is only implemented when explicitly required.* 