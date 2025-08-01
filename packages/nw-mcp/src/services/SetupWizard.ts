import { EnvironmentConfig } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  creditsRemaining?: number;
}

export interface TestResult {
  success: boolean;
  error?: string;
  componentGenerated?: string;
}

export class SetupWizard {
  private config: EnvironmentConfig;

  constructor(config: EnvironmentConfig) {
    this.config = config;
  }

  /**
   * Detect if V0 API key is missing
   */
  async detectMissingApiKey(): Promise<boolean> {
    return !this.config.v0ApiKey || this.config.v0ApiKey.trim() === '';
  }

  /**
   * Get the current API key from environment
   */
  async getApiKey(): Promise<string | null> {
    return this.config.v0ApiKey || null;
  }

  /**
   * Provide setup instructions when API key is missing
   */
  async provideSetupInstructions(): Promise<string> {
    const installationPath = await this.getInstallationPath();
    
    return `
🎉 Welcome to Magic Nuggetwise!

To get started, you need a V0 API key. This only takes 2 minutes!

1. Visit https://v0.dev and sign up (free!)
2. Go to Settings → API Keys → Create New Key
3. Copy your key (starts with "v1:")
4. Add it to your MCP configuration (see below)
5. Try the command again!

**Example:**
Your nuggetwise-v0 server should look like this:
\`\`\`json
{
  "mcpServers": {
    "nuggetwise-v0": {
      "command": "node",
      "args": ["${installationPath}"],
      "env": {
        "V0_API_KEY": "v1:your-actual-v0-api-key-here"
      }
    }
  }
}
\`\`\`

💡 **Quick Setup:**
1. Open Cursor Settings → MCP
2. Find the "nuggetwise-v0" server
3. Add this to the "env" section: \`"V0_API_KEY": "v1:YOUR_ACTUAL_KEY_HERE"\`
4. Replace \`v1:YOUR_ACTUAL_KEY_HERE\` with your V0 API key
5. Save and restart Cursor if needed

**Even Simpler:**
Just add this line to your existing nuggetwise-v0 server's "env" section:
\`\`\`json
"V0_API_KEY": "v1:your-actual-v0-api-key-here"
\`\`\`

Need help? Visit docs.nuggetwise.com/setup
    `;
  }

  /**
   * Detect the actual installation path for the MCP server
   */
  async getInstallationPath(): Promise<string> {
    const possiblePaths = [
      process.cwd() + '/packages/nw-mcp/dist/mcp-server.js',
      process.cwd() + '/node_modules/@cursorflow/nuggetwise-v0/dist/mcp-server.js',
      '/usr/local/lib/node_modules/@cursorflow/nuggetwise-v0/dist/mcp-server.js',
      process.cwd() + '/dist/mcp-server.js'
    ];
    
    // Return the first path that exists, or a default
    for (const path of possiblePaths) {
      if (fs.existsSync(path)) {
        return path;
      }
    }
    
    // Fallback to current working directory
    return process.cwd() + '/packages/nw-mcp/dist/mcp-server.js';
  }

  /**
   * Validate API key format and test connectivity
   */
  async validateApiKey(key: string): Promise<ValidationResult> {
    try {
      // Check if key has correct format
      if (!key.startsWith('v1:')) {
        return {
          isValid: false,
          error: 'Invalid API key format. V0 API keys should start with "v1:"'
        };
      }

      // Test connectivity with a simple API call
      const { createClient } = await import('v0-sdk');
      const testClient = createClient({ apiKey: key });
      
      // Try to get user info or make a simple test call
      try {
        // This is a lightweight test call
        await testClient.chats.create({
          message: 'test',
          modelConfiguration: {
            modelId: 'v0-1.5-sm',
          },
        });
        
        return {
          isValid: true,
          creditsRemaining: 100 // We'll implement actual credit checking later
        };
      } catch (apiError: any) {
        if (apiError.status === 401) {
          return {
            isValid: false,
            error: 'Invalid API key. Please check your key at v0.dev/settings/api-keys'
          };
        } else if (apiError.status === 402) {
          return {
            isValid: false,
            error: 'Insufficient credits. Please add funds to your V0 account at v0.dev'
          };
        } else {
          return {
            isValid: false,
            error: `API connection failed: ${apiError.message || 'Unknown error'}`
          };
        }
      }
    } catch (error) {
      return {
        isValid: false,
        error: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Auto-test setup with simple component generation
   */
  async autoTestSetup(): Promise<TestResult> {
    try {
      const apiKey = await this.getApiKey();
      if (!apiKey) {
        return {
          success: false,
          error: 'No API key found'
        };
      }

      const validation = await this.validateApiKey(apiKey);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || 'API key validation failed'
        };
      }

      // Test with a simple component generation
      const { createClient } = await import('v0-sdk');
      const testClient = createClient({ apiKey });
      
      const result = await testClient.chats.create({
        message: 'Create a simple button component',
        modelConfiguration: {
          modelId: 'v0-1.5-sm',
        },
      });

      const componentCode = result.latestVersion?.files?.[0]?.content || 'Test component generated';
      
      return {
        success: true,
        componentGenerated: componentCode
      };
    } catch (error) {
      return {
        success: false,
        error: `Auto-test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get user-friendly error message for common issues
   */
  getErrorMessage(error: any): string {
    if (error.message?.includes('V0_API_KEY is required')) {
      return 'V0 API Key Required\n\nPlease configure your V0 API key in Cursor MCP settings.';
    }
    
    if (error.message?.includes('Invalid API key')) {
      return 'Invalid API Key\n\nPlease check your key at v0.dev/settings/api-keys and ensure it starts with "v1:".';
    }
    
    if (error.message?.includes('Insufficient credits')) {
      return 'Insufficient Credits\n\nPlease add funds to your V0 account at v0.dev.';
    }
    
    if (error.message?.includes('API connection failed')) {
      return 'Connection Failed\n\nPlease check your internet connection and try again.';
    }
    
    return `Setup Error: ${error.message || 'Unknown error'}`;
  }

    /**
   * Get status information for display in responses
   */
  async getStatusInfo(): Promise<{
    apiKeyStatus: 'connected' | 'disconnected' | 'invalid';
    creditsRemaining?: number;
    error?: string;
  }> {
    const apiKey = await this.getApiKey();

    if (!apiKey) {
      return {
        apiKeyStatus: 'disconnected'
      };
    }

    // Quick format validation without API call
    if (!apiKey.startsWith('v1:')) {
      return {
        apiKeyStatus: 'invalid',
        error: 'Invalid API key format. V0 API keys should start with "v1:"'
      };
    }

    // For status check, we'll assume the key is valid if it has the right format
    // This avoids making API calls that can be slow or fail
    return {
      apiKeyStatus: 'connected',
      creditsRemaining: 100 // Placeholder - we'll implement actual checking later
    };
  }
} 