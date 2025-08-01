# CLI Option Testing Strategies

This document contains testing strategies for the **CLI (Command Line Interface) option** - a secondary approach to the CursorFlow platform.

## ⚠️ **Important Note**

**CLI is currently a secondary option and not actively developed.** The primary approach is **MCP-first** integration with Cursor IDE.

## 🧪 **CLI Testing Overview**

The CLI option requires comprehensive testing to ensure reliability, performance, and user experience across different environments and use cases.

### **CLI Testing Strategy**

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLI Testing Pyramid                      │
├─────────────────────────────────────────────────────────────────┤
│                    End-to-End Tests (E2E)                       │
│              Test complete CLI workflows                        │
├─────────────────────────────────────────────────────────────────┤
│                  Integration Tests                              │
│           Test CLI service interactions                         │
├─────────────────────────────────────────────────────────────────┤
│                    Unit Tests                                   │
│            Test individual CLI functions                        │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 **CLI Unit Testing**

### **CLI Command Testing**

```typescript
// tests/cli/commands/prd.test.ts
import { PRDCommand } from '../../src/commands/prd';
import { CursorFlowAPIClient } from '../../src/services/api-client';
import { FileWriter } from '../../src/services/file-writer';

describe('PRDCommand', () => {
  let prdCommand: PRDCommand;
  let mockApiClient: jest.Mocked<CursorFlowAPIClient>;
  let mockFileWriter: jest.Mocked<FileWriter>;

  beforeEach(() => {
    mockApiClient = {
      generatePRD: jest.fn()
    } as any;
    
    mockFileWriter = {
      writePRD: jest.fn()
    } as any;

    prdCommand = new PRDCommand(mockApiClient, mockFileWriter);
  });

  describe('generate', () => {
    it('should generate PRD successfully', async () => {
      const mockResult = {
        success: true,
        data: {
          prd: {
            id: 'prd_123',
            title: 'Test PRD',
            description: 'Test description',
            approach: 'cli-option'
          }
        }
      };

      mockApiClient.generatePRD.mockResolvedValue(mockResult);

      const prompt = 'Create a task management app';
      const options = { template: 'detailed' };

      const result = await prdCommand.generate(prompt, options);

      expect(mockApiClient.generatePRD).toHaveBeenCalledWith(prompt, 'detailed');
      expect(result).toEqual(mockResult.data.prd);
    });

    it('should handle API errors gracefully', async () => {
      const mockError = {
        success: false,
        error: {
          message: 'API error',
          code: 'API_ERROR'
        }
      };

      mockApiClient.generatePRD.mockResolvedValue(mockError);

      const prompt = 'Create a task management app';

      await expect(prdCommand.generate(prompt)).rejects.toThrow('PRD generation failed');
    });

    it('should save PRD to file when output option is provided', async () => {
      const mockResult = {
        success: true,
        data: {
          prd: {
            id: 'prd_123',
            title: 'Test PRD',
            approach: 'cli-option'
          }
        }
      };

      mockApiClient.generatePRD.mockResolvedValue(mockResult);
      mockFileWriter.writePRD.mockResolvedValue();

      const prompt = 'Create a task management app';
      const options = { output: 'test-prd.md', format: 'markdown' };

      await prdCommand.generate(prompt, options);

      expect(mockFileWriter.writePRD).toHaveBeenCalledWith(
        mockResult.data.prd,
        'test-prd.md',
        'markdown'
      );
    });
  });
});
```

### **CLI Service Testing**

```typescript
// tests/cli/services/api-client.test.ts
import { CursorFlowAPIClient } from '../../src/services/api-client';

describe('CursorFlowAPIClient', () => {
  let apiClient: CursorFlowAPIClient;
  let mockFetch: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    
    apiClient = new CursorFlowAPIClient('test-api-key');
  });

  describe('generatePRD', () => {
    it('should make correct API request', async () => {
      const mockResponse = {
        success: true,
        data: { prd: { id: 'prd_123' } }
      };

      mockFetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse)
      } as any);

      const result = await apiClient.generatePRD('Test prompt', 'detailed');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.cursorflow.com/api/cli/prd/generate',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json',
            'X-Approach': 'cli-option'
          },
          body: JSON.stringify({
            prompt: 'Test prompt',
            template: 'detailed',
            approach: 'cli-option'
          })
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(apiClient.generatePRD('Test prompt')).rejects.toThrow('Network error');
    });
  });

  describe('generateV0Component', () => {
    it('should make correct V0 API request', async () => {
      const mockResponse = {
        success: true,
        data: {
          components: [{ name: 'TestComponent', code: 'test code' }]
        }
      };

      mockFetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse)
      } as any);

      const result = await apiClient.generateV0Component('Test component', {
        modelId: 'v0-1.5-md'
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.cursorflow.com/api/cli/v0/generate',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json',
            'X-Approach': 'cli-option'
          },
          body: JSON.stringify({
            prompt: 'Test component',
            approach: 'cli-option',
            options: { modelId: 'v0-1.5-md' }
          })
        }
      );

      expect(result).toEqual(mockResponse);
    });
  });
});
```

## 🔗 **CLI Integration Testing**

### **CLI Service Integration Tests**

```typescript
// tests/cli/integration/cli.test.ts
import { CursorFlowAPIClient } from '../../src/services/api-client';
import { FileWriter } from '../../src/services/file-writer';
import { PRDCommand } from '../../src/commands/prd';
import { V0Command } from '../../src/commands/v0';

describe('CLI Integration', () => {
  let apiClient: CursorFlowAPIClient;
  let fileWriter: FileWriter;
  let prdCommand: PRDCommand;
  let v0Command: V0Command;

  beforeAll(() => {
    apiClient = new CursorFlowAPIClient(process.env.CURSORFLOW_API_KEY!);
    fileWriter = new FileWriter();
    prdCommand = new PRDCommand(apiClient, fileWriter);
    v0Command = new V0Command(apiClient, fileWriter);
  });

  describe('End-to-End PRD Generation', () => {
    it('should generate and save PRD successfully', async () => {
      const prompt = 'Create a simple task management app';
      const outputFile = 'test-output/prd-test.md';

      // Generate PRD
      const prd = await prdCommand.generate(prompt, {
        template: 'detailed',
        output: outputFile,
        format: 'markdown'
      });

      expect(prd).toBeDefined();
      expect(prd.id).toBeDefined();
      expect(prd.approach).toBe('cli-option');

      // Verify file was created
      const fs = require('fs');
      expect(fs.existsSync(outputFile)).toBe(true);

      // Clean up
      fs.unlinkSync(outputFile);
    }, 30000); // 30 second timeout for API calls
  });

  describe('End-to-End V0 Generation', () => {
    it('should generate V0 component successfully', async () => {
      const prompt = 'Create a simple button component';
      const outputDir = 'test-output/v0-test';

      // Generate V0 component
      const component = await v0Command.generate(prompt, {
        modelId: 'v0-1.5-sm',
        output: outputDir
      });

      expect(component).toBeDefined();
      expect(component.code).toBeDefined();
      expect(component.name).toBeDefined();

      // Verify files were created
      const fs = require('fs');
      expect(fs.existsSync(outputDir)).toBe(true);

      // Clean up
      fs.rmSync(outputDir, { recursive: true, force: true });
    }, 30000);
  });
});
```

### **CLI Template Testing**

```typescript
// tests/cli/templates/template.test.ts
import { CLITemplateService } from '../../src/services/cli-template.service';

describe('CLITemplateService', () => {
  let templateService: CLITemplateService;

  beforeEach(() => {
    templateService = new CLITemplateService();
  });

  describe('generateProject', () => {
    it('should generate React TypeScript project', async () => {
      const projectName = 'test-react-app';
      const templateName = 'react-typescript';

      const files = await templateService.generateProject(projectName, templateName);

      expect(files).toBeDefined();
      expect(files.length).toBeGreaterThan(0);

      // Check for required files
      const filePaths = files.map(f => f.path);
      expect(filePaths).toContain('package.json');
      expect(filePaths).toContain('src/App.tsx');
      expect(filePaths).toContain('tsconfig.json');

      // Check template variable substitution
      const packageJson = files.find(f => f.path === 'package.json');
      expect(packageJson?.content).toContain(`"name": "${projectName}"`);
    });

    it('should throw error for invalid template', async () => {
      const projectName = 'test-app';
      const templateName = 'invalid-template';

      await expect(
        templateService.generateProject(projectName, templateName)
      ).rejects.toThrow(`Template '${templateName}' not found`);
    });
  });

  describe('getAvailableTemplates', () => {
    it('should return available templates', () => {
      const templates = templateService.getAvailableTemplates();

      expect(templates).toBeDefined();
      expect(templates.length).toBeGreaterThan(0);

      const templateNames = templates.map(t => t.name);
      expect(templateNames).toContain('react-typescript');
      expect(templateNames).toContain('next-js');
    });
  });
});
```

## 🚀 **CLI End-to-End Testing**

### **CLI E2E Test Setup**

```typescript
// tests/cli/e2e/cli-e2e.test.ts
import { spawn } from 'child_process';
import * as path from 'path';

describe('CLI End-to-End Tests', () => {
  const cliPath = path.join(__dirname, '../../../dist/cli.js');

  describe('PRD Generation E2E', () => {
    it('should generate PRD from command line', (done) => {
      const child = spawn('node', [cliPath, 'prd', 'generate', 'Create a simple app'], {
        env: {
          ...process.env,
          CURSORFLOW_API_KEY: process.env.CURSORFLOW_API_KEY
        }
      });

      let output = '';
      let errorOutput = '';

      child.stdout.on('data', (data) => {
        output += data.toString();
      });

      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      child.on('close', (code) => {
        expect(code).toBe(0);
        expect(output).toContain('✅ PRD saved');
        expect(errorOutput).toBe('');
        done();
      });
    }, 60000);

    it('should handle invalid API key', (done) => {
      const child = spawn('node', [cliPath, 'prd', 'generate', 'Test prompt'], {
        env: {
          ...process.env,
          CURSORFLOW_API_KEY: 'invalid-key'
        }
      });

      let errorOutput = '';

      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      child.on('close', (code) => {
        expect(code).not.toBe(0);
        expect(errorOutput).toContain('Invalid API key');
        done();
      });
    }, 30000);
  });

  describe('V0 Generation E2E', () => {
    it('should generate V0 component from command line', (done) => {
      const child = spawn('node', [cliPath, 'v0', 'generate', 'Create a button'], {
        env: {
          ...process.env,
          CURSORFLOW_API_KEY: process.env.CURSORFLOW_API_KEY
        }
      });

      let output = '';

      child.stdout.on('data', (data) => {
        output += data.toString();
      });

      child.on('close', (code) => {
        expect(code).toBe(0);
        expect(output).toContain('✅ Component saved');
        expect(output).toContain('🌐 Live Preview');
        done();
      });
    }, 60000);
  });

  describe('Project Scaffolding E2E', () => {
    it('should scaffold project from command line', (done) => {
      const projectName = 'test-e2e-project';
      const child = spawn('node', [cliPath, 'project', 'scaffold', projectName], {
        env: {
          ...process.env,
          CURSORFLOW_API_KEY: process.env.CURSORFLOW_API_KEY
        }
      });

      let output = '';

      child.stdout.on('data', (data) => {
        output += data.toString();
      });

      child.on('close', (code) => {
        expect(code).toBe(0);
        expect(output).toContain('✅ Project scaffolded successfully');
        expect(output).toContain(projectName);

        // Clean up
        const fs = require('fs');
        if (fs.existsSync(projectName)) {
          fs.rmSync(projectName, { recursive: true, force: true });
        }
        done();
      });
    }, 60000);
  });
});
```

## 📊 **CLI Performance Testing**

### **CLI Performance Benchmarks**

```typescript
// tests/cli/performance/cli-performance.test.ts
import { CursorFlowAPIClient } from '../../src/services/api-client';
import { performance } from 'perf_hooks';

describe('CLI Performance Tests', () => {
  let apiClient: CursorFlowAPIClient;

  beforeAll(() => {
    apiClient = new CursorFlowAPIClient(process.env.CURSORFLOW_API_KEY!);
  });

  describe('API Response Times', () => {
    it('should complete PRD generation within acceptable time', async () => {
      const startTime = performance.now();
      
      await apiClient.generatePRD('Create a simple app', 'detailed');
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(30000); // 30 seconds max
    }, 35000);

    it('should complete V0 generation within acceptable time', async () => {
      const startTime = performance.now();
      
      await apiClient.generateV0Component('Create a button', {
        modelId: 'v0-1.5-sm'
      });
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(30000); // 30 seconds max
    }, 35000);
  });

  describe('Concurrent Requests', () => {
    it('should handle multiple concurrent PRD requests', async () => {
      const requests = Array.from({ length: 5 }, (_, i) =>
        apiClient.generatePRD(`Create app ${i}`, 'detailed')
      );

      const startTime = performance.now();
      const results = await Promise.all(requests);
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(results).toHaveLength(5);
      expect(results.every(r => r.success)).toBe(true);
      expect(duration).toBeLessThan(60000); // 60 seconds max for 5 requests
    }, 70000);
  });
});
```

## 🔍 **CLI Error Testing**

### **CLI Error Handling Tests**

```typescript
// tests/cli/errors/cli-errors.test.ts
import { CursorFlowAPIClient } from '../../src/services/api-client';

describe('CLI Error Handling', () => {
  let apiClient: CursorFlowAPIClient;

  beforeEach(() => {
    apiClient = new CursorFlowAPIClient('invalid-key');
  });

  describe('Authentication Errors', () => {
    it('should handle invalid API key', async () => {
      await expect(
        apiClient.generatePRD('Test prompt')
      ).rejects.toThrow();
    });

    it('should handle expired API key', async () => {
      // Test with expired key scenario
      const expiredKeyClient = new CursorFlowAPIClient('expired-key');
      
      await expect(
        expiredKeyClient.generatePRD('Test prompt')
      ).rejects.toThrow();
    });
  });

  describe('Rate Limiting Errors', () => {
    it('should handle rate limit exceeded', async () => {
      // Mock rate limit response
      global.fetch = jest.fn().mockResolvedValue({
        status: 429,
        json: jest.fn().mockResolvedValue({
          success: false,
          error: {
            message: 'Rate limit exceeded',
            code: 'CLI_RATE_LIMIT_EXCEEDED'
          }
        })
      } as any);

      await expect(
        apiClient.generatePRD('Test prompt')
      ).rejects.toThrow('Rate limit exceeded');
    });
  });

  describe('Network Errors', () => {
    it('should handle network timeouts', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network timeout'));

      await expect(
        apiClient.generatePRD('Test prompt')
      ).rejects.toThrow('Network timeout');
    });

    it('should handle connection refused', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Connection refused'));

      await expect(
        apiClient.generatePRD('Test prompt')
      ).rejects.toThrow('Connection refused');
    });
  });
});
```

## 📋 **CLI Test Configuration**

### **CLI Test Environment Setup**

```typescript
// tests/cli/setup/cli-test-setup.ts
import { config } from 'dotenv';
import * as path from 'path';

// Load test environment variables
config({ path: path.join(__dirname, '../../../.env.test') });

export const CLI_TEST_CONFIG = {
  apiKey: process.env.CURSORFLOW_API_KEY || 'test-api-key',
  baseUrl: process.env.CURSORFLOW_API_URL || 'https://api.cursorflow.com',
  timeout: parseInt(process.env.CLI_TEST_TIMEOUT || '30000'),
  retries: parseInt(process.env.CLI_TEST_RETRIES || '3')
};

export const setupCLITestEnvironment = () => {
  // Set up test directories
  const testDirs = ['test-output', 'test-temp'];
  
  testDirs.forEach(dir => {
    const fs = require('fs');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

export const cleanupCLITestEnvironment = () => {
  // Clean up test files
  const fs = require('fs');
  const testDirs = ['test-output', 'test-temp'];
  
  testDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
};
```

## 📚 **Related Documentation**

- **Primary Approach**: `../dev-implementation/` - MCP-first implementation
- **CLI API Specs**: `CLI_SPECS.md` - CLI API specifications
- **CLI Integration**: `CLI_INTEGRATION.md` - CLI integration details
- **CLI Architecture**: `CLI_ARCHITECTURE.md` - CLI system architecture

---

*For the primary MCP-first approach, see the `../dev-implementation/` folder.* 