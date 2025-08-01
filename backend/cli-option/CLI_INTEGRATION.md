# CLI Option Integration Guide

This document contains integration details for the **CLI (Command Line Interface) option** - a secondary approach to the CursorFlow platform.

## ⚠️ **Important Note**

**CLI is currently a secondary option and not actively developed.** The primary approach is **MCP-first** integration with Cursor IDE.

## 🔗 **CLI Integration Overview**

The CLI option integrates with the CursorFlow platform through programmatic APIs and command-line interfaces, providing automation and power-user capabilities.

### **CLI Integration Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   NPX CLI       │    │   CLI Service   │    │   Backend API   │
│                 │    │                 │    │                 │
│ - PRD Gen       │───▶│ - Request       │───▶│ - V0 API        │
│ - V0 Gen        │    │   Processing    │    │ - OpenAI API    │
│ - Project       │    │ - Response      │    │ - Supabase      │
│   Scaffolding   │    │   Formatting    │    │ - File System   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 **CLI Package Integration**

### **NPX CLI Package Structure**

```
packages/nuggetwise-cli/
├── src/
│   ├── commands/
│   │   ├── prd.ts          # PRD generation command
│   │   ├── v0.ts           # V0 generation command
│   │   └── project.ts      # Project scaffolding command
│   ├── services/
│   │   ├── api-client.ts   # API client for backend
│   │   ├── v0-client.ts    # V0 API integration
│   │   └── file-writer.ts  # File system operations
│   ├── templates/
│   │   ├── react-ts/       # React TypeScript template
│   │   ├── next-js/        # Next.js template
│   │   └── vue-ts/         # Vue TypeScript template
│   └── utils/
│       ├── config.ts       # Configuration management
│       ├── logger.ts       # Logging utilities
│       └── validator.ts    # Input validation
├── package.json
├── tsconfig.json
└── README.md
```

### **CLI Service Integration**

```typescript
// packages/nuggetwise-cli/src/services/api-client.ts
export class CursorFlowAPIClient {
  constructor(
    private apiKey: string,
    private baseUrl: string = 'https://api.cursorflow.com'
  ) {}

  async generatePRD(prompt: string, template: string = 'detailed'): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/cli/prd/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-Approach': 'cli-option'
      },
      body: JSON.stringify({
        prompt,
        template,
        approach: 'cli-option'
      })
    });

    return response.json();
  }

  async generateV0Component(prompt: string, options: any = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/cli/v0/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-Approach': 'cli-option'
      },
      body: JSON.stringify({
        prompt,
        approach: 'cli-option',
        options
      })
    });

    return response.json();
  }

  async scaffoldProject(projectName: string, template: string, options: any = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/cli/project/scaffold`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-Approach': 'cli-option'
      },
      body: JSON.stringify({
        projectName,
        template,
        approach: 'cli-option',
        options
      })
    });

    return response.json();
  }
}
```

## 🔧 **CLI Command Integration**

### **PRD Generation Command**

```typescript
// packages/nuggetwise-cli/src/commands/prd.ts
import { Command } from 'commander';
import { CursorFlowAPIClient } from '../services/api-client';
import { FileWriter } from '../services/file-writer';

export class PRDCommand {
  constructor(
    private apiClient: CursorFlowAPIClient,
    private fileWriter: FileWriter
  ) {}

  register(program: Command): void {
    program
      .command('prd generate <prompt>')
      .description('Generate a Product Requirements Document')
      .option('-t, --template <template>', 'PRD template to use', 'detailed')
      .option('-o, --output <file>', 'Output file path')
      .option('--format <format>', 'Output format (json|markdown|raw)', 'markdown')
      .action(async (prompt: string, options: any) => {
        try {
          console.log('🚀 Generating PRD...');
          
          const result = await this.apiClient.generatePRD(prompt, options.template);
          
          if (result.success) {
            const prd = result.data.prd;
            
            if (options.output) {
              await this.fileWriter.writePRD(prd, options.output, options.format);
              console.log(`✅ PRD saved to ${options.output}`);
            } else {
              console.log('📋 Generated PRD:');
              console.log(JSON.stringify(prd, null, 2));
            }
          } else {
            console.error('❌ PRD generation failed:', result.error.message);
            process.exit(1);
          }
        } catch (error) {
          console.error('❌ Error generating PRD:', error.message);
          process.exit(1);
        }
      });
  }
}
```

### **V0 Generation Command**

```typescript
// packages/nuggetwise-cli/src/commands/v0.ts
import { Command } from 'commander';
import { CursorFlowAPIClient } from '../services/api-client';
import { FileWriter } from '../services/file-writer';

export class V0Command {
  constructor(
    private apiClient: CursorFlowAPIClient,
    private fileWriter: FileWriter
  ) {}

  register(program: Command): void {
    program
      .command('v0 generate <prompt>')
      .description('Generate React components using V0 AI')
      .option('-m, --model <model>', 'V0 model to use', 'v0-1.5-sm')
      .option('-o, --output <dir>', 'Output directory')
      .option('--save-to-workspace', 'Save files to workspace', true)
      .action(async (prompt: string, options: any) => {
        try {
          console.log('🎨 Generating V0 component...');
          
          const result = await this.apiClient.generateV0Component(prompt, {
            modelId: options.model,
            saveToWorkspace: options.saveToWorkspace
          });
          
          if (result.success) {
            const component = result.data.components[0];
            
            if (options.output) {
              await this.fileWriter.writeV0Component(component, options.output);
              console.log(`✅ Component saved to ${options.output}`);
            } else {
              console.log('📝 Generated Component:');
              console.log(component.code);
            }
            
            console.log(`🌐 Live Preview: ${result.data.deploymentUrl}`);
            console.log(`💬 V0 Chat: ${result.data.projectUrl}`);
          } else {
            console.error('❌ V0 generation failed:', result.error.message);
            process.exit(1);
          }
        } catch (error) {
          console.error('❌ Error generating V0 component:', error.message);
          process.exit(1);
        }
      });
  }
}
```

### **Project Scaffolding Command**

```typescript
// packages/nuggetwise-cli/src/commands/project.ts
import { Command } from 'commander';
import { CursorFlowAPIClient } from '../services/api-client';
import { FileWriter } from '../services/file-writer';

export class ProjectCommand {
  constructor(
    private apiClient: CursorFlowAPIClient,
    private fileWriter: FileWriter
  ) {}

  register(program: Command): void {
    program
      .command('project scaffold <name>')
      .description('Scaffold a new project')
      .option('-t, --template <template>', 'Project template', 'react-typescript')
      .option('--include-v0', 'Include V0 integration', false)
      .option('--include-tests', 'Include test setup', false)
      .option('--include-docs', 'Include documentation', false)
      .action(async (name: string, options: any) => {
        try {
          console.log(`🚀 Scaffolding project: ${name}`);
          
          const result = await this.apiClient.scaffoldProject(name, options.template, {
            includeV0: options.includeV0,
            includeTests: options.includeTests,
            includeDocs: options.includeDocs
          });
          
          if (result.success) {
            const project = result.data;
            
            await this.fileWriter.writeProject(project, name);
            
            console.log(`✅ Project scaffolded successfully!`);
            console.log(`📁 Location: ${process.cwd()}/${name}`);
            console.log(`🚀 Next steps:`);
            console.log(`   cd ${name}`);
            console.log(`   npm install`);
            console.log(`   npm run dev`);
          } else {
            console.error('❌ Project scaffolding failed:', result.error.message);
            process.exit(1);
          }
        } catch (error) {
          console.error('❌ Error scaffolding project:', error.message);
          process.exit(1);
        }
      });
  }
}
```

## 🔄 **CLI Template Integration**

### **React TypeScript Template**

```typescript
// packages/nuggetwise-cli/src/templates/react-ts/index.ts
export const reactTypeScriptTemplate = {
  name: 'react-typescript',
  description: 'React with TypeScript template',
  files: [
    {
      path: 'package.json',
      content: `{
  "name": "{{projectName}}",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}`
    },
    {
      path: 'src/App.tsx',
      content: `import React from 'react';

function App() {
  return (
    <div className="App">
      <h1>{{projectName}}</h1>
    </div>
  );
}

export default App;`
    },
    {
      path: 'tsconfig.json',
      content: `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`
    }
  ]
};
```

## 📊 **CLI Analytics Integration**

### **CLI Usage Tracking**

```typescript
// packages/nuggetwise-cli/src/services/analytics.ts
export class CLIAnalytics {
  constructor(private apiClient: CursorFlowAPIClient) {}

  async trackCommand(command: string, options: any = {}): Promise<void> {
    try {
      await fetch(`${this.apiClient.baseUrl}/api/cli/analytics/track`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiClient.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          command,
          options,
          approach: 'cli-option',
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      // Analytics failures shouldn't break CLI functionality
      console.warn('Warning: Failed to track analytics:', error.message);
    }
  }
}
```

## 🔐 **CLI Authentication Integration**

### **CLI Configuration Management**

```typescript
// packages/nuggetwise-cli/src/utils/config.ts
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class CLIConfig {
  private configPath: string;

  constructor() {
    this.configPath = path.join(os.homedir(), '.cursorflow', 'config.json');
  }

  async load(): Promise<any> {
    try {
      if (fs.existsSync(this.configPath)) {
        const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        return config;
      }
      return {};
    } catch (error) {
      console.warn('Warning: Failed to load config:', error.message);
      return {};
    }
  }

  async save(config: any): Promise<void> {
    try {
      const configDir = path.dirname(this.configPath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
    } catch (error) {
      console.error('Error saving config:', error.message);
    }
  }

  async getApiKey(): Promise<string | null> {
    const config = await this.load();
    return config.apiKey || process.env.CURSORFLOW_API_KEY || null;
  }

  async setApiKey(apiKey: string): Promise<void> {
    const config = await this.load();
    config.apiKey = apiKey;
    await this.save(config);
  }
}
```

## 📚 **Related Documentation**

- **Primary Approach**: `../dev-implementation/` - MCP-first implementation
- **CLI API Specs**: `CLI_SPECS.md` - CLI API specifications
- **CLI Architecture**: `CLI_ARCHITECTURE.md` - CLI system architecture
- **CLI Testing**: `CLI_TESTING.md` - CLI testing strategies

---

*For the primary MCP-first approach, see the `../dev-implementation/` folder.* 