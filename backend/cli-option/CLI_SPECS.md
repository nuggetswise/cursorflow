# CLI Option API Specifications

This document contains the API specifications for the **CLI (Command Line Interface) option** - a secondary approach to the CursorFlow platform.

## ⚠️ **Important Note**

**CLI is currently a secondary option and not actively developed.** The primary approach is **MCP-first** integration with Cursor IDE.

## 📋 **CLI API Overview**

The CLI option provides programmatic access to CursorFlow functionality through command-line interfaces and automation workflows.

### **CLI Approach Types**

```typescript
type CLIApproach = 'cli-option';
type CLIPlan = 'cli-option' | 'multi-platform';
```

### **CLI Request Structure**

```typescript
interface CLIBuildRequest {
  prompt: string;
  approach: 'cli-option';
  template?: string;
  options?: {
    modelId?: string;
    saveToWorkspace?: boolean;
    outputFormat?: 'json' | 'markdown' | 'raw';
  };
  rawResponse?: string; // For CLI option mode
}
```

### **CLI Response Structure**

```typescript
interface CLIBuildResponse {
  success: boolean;
  data?: {
    prd: {
      id: string;
      title: string;
      description: string;
      features: Feature[];
      approach: 'cli-option';
      createdAt: string;
      updatedAt: string;
    };
    components: V0Component[];
    chatId: string;
    projectUrl: string;
    deploymentUrl: string;
  };
  error?: {
    message: string;
    code: string;
    details?: any;
  };
}
```

## 🔧 **CLI API Endpoints**

### **1. CLI PRD Generation**

```http
POST /api/cli/prd/generate
Content-Type: application/json

{
  "prompt": "Create a task management app",
  "template": "detailed",
  "approach": "cli-option"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "prd": {
      "id": "prd_cli_1234567890_abc123",
      "title": "Task Management Application",
      "description": "A comprehensive task management solution...",
      "approach": "cli-option",
      "features": [...],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### **2. CLI V0 Code Generation**

```http
POST /api/cli/v0/generate
Content-Type: application/json

{
  "prompt": "Create a login form component",
  "approach": "cli-option",
  "options": {
    "modelId": "v0-1.5-md",
    "saveToWorkspace": true,
    "outputFormat": "json"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "components": [
      {
        "name": "LoginForm",
        "code": "import React from 'react'...",
        "templateId": "login-form",
        "props": {...},
        "milestone": "authentication"
      }
    ],
    "chatId": "v0_cli_1234567890_abc123",
    "projectUrl": "https://v0.dev/chat/abc123",
    "deploymentUrl": "https://v0-cli-loginform.vercel.app"
  }
}
```

### **3. CLI Project Scaffolding**

```http
POST /api/cli/project/scaffold
Content-Type: application/json

{
  "projectName": "my-task-app",
  "template": "react-typescript",
  "approach": "cli-option",
  "options": {
    "includeV0": true,
    "includeTests": true,
    "includeDocs": true
  }
}
```

## 📊 **CLI Usage Tracking**

### **CLI Usage Metrics**

```typescript
interface CLIUsageMetrics {
  userId: string;
  approach: 'cli-option';
  cliOptionUsage: number;
  lastUsed: string;
  preferredApproach: 'cli-option';
  subscriptionPlan: 'cli-option' | 'multi-platform';
}
```

### **CLI Rate Limiting**

- **CLI Option Plan**: 1000 requests/hour
- **Multi-Platform Plan**: 5000 requests/hour
- **Enterprise Plan**: Unlimited

## 🔐 **CLI Authentication**

### **CLI API Key Authentication**

```http
Authorization: Bearer cli_api_key_here
X-CLI-Version: 1.0.0
X-Approach: cli-option
```

### **CLI Session Management**

```typescript
interface CLISession {
  sessionId: string;
  userId: string;
  approach: 'cli-option';
  expiresAt: string;
  permissions: string[];
}
```

## 📝 **CLI Error Handling**

### **CLI Error Codes**

```typescript
enum CLIErrorCode {
  INVALID_PROMPT = 'CLI_INVALID_PROMPT',
  RATE_LIMIT_EXCEEDED = 'CLI_RATE_LIMIT_EXCEEDED',
  TEMPLATE_NOT_FOUND = 'CLI_TEMPLATE_NOT_FOUND',
  V0_GENERATION_FAILED = 'CLI_V0_GENERATION_FAILED',
  PROJECT_SCAFFOLDING_FAILED = 'CLI_PROJECT_SCAFFOLDING_FAILED'
}
```

### **CLI Error Response Format**

```json
{
  "success": false,
  "error": {
    "message": "Rate limit exceeded for CLI option",
    "code": "CLI_RATE_LIMIT_EXCEEDED",
    "details": {
      "limit": 1000,
      "resetTime": "2024-01-15T11:00:00Z"
    }
  }
}
```

## 🚀 **CLI Integration Examples**

### **NPX CLI Usage**

```bash
# Install CLI globally
npm install -g @cursorflow/cli

# Generate PRD
cursorflow prd generate "Create a social media app" --template detailed

# Generate V0 component
cursorflow v0 generate "Create a user profile card" --model v0-1.5-md

# Scaffold project
cursorflow project scaffold my-app --template react-typescript --include-v0
```

### **Programmatic CLI Usage**

```typescript
import { CursorFlowCLI } from '@cursorflow/cli';

const cli = new CursorFlowCLI({
  apiKey: process.env.CURSORFLOW_API_KEY,
  approach: 'cli-option'
});

// Generate PRD
const prd = await cli.generatePRD({
  prompt: 'Create a task management app',
  template: 'detailed'
});

// Generate V0 component
const component = await cli.generateV0Component({
  prompt: 'Create a login form',
  modelId: 'v0-1.5-md'
});

// Scaffold project
const project = await cli.scaffoldProject({
  name: 'my-task-app',
  template: 'react-typescript',
  includeV0: true
});
```

## 📚 **Related Documentation**

- **Primary Approach**: `../dev-implementation/` - MCP-first implementation
- **CLI Integration**: `CLI_INTEGRATION.md` - CLI integration details
- **CLI Architecture**: `CLI_ARCHITECTURE.md` - CLI system architecture
- **CLI Testing**: `CLI_TESTING.md` - CLI testing strategies

---

*For the primary MCP-first approach, see the `../dev-implementation/` folder.* 