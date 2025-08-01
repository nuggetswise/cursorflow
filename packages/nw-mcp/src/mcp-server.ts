import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  InitializeRequestSchema,
  ListPromptsRequestSchema,
  Tool,
  CallToolRequest,
} from '@modelcontextprotocol/sdk/types.js';
import { V0Client } from './services/V0Client.js';
import { EnvironmentConfig } from './types/index.js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from the correct path
dotenv.config({ path: './packages/nw-mcp/.env' });

// File writing utility
class FileWriter {
  private workspacePath: string;

  constructor(workspacePath: string) {
    this.workspacePath = workspacePath;
  }

  async writeV0Files(files: any[], options: any = {}): Promise<{ success: boolean; files: any[]; directory?: string; error?: string }> {
    const timestamp = Date.now();
    const savedFiles: any[] = [];

    try {
      // Create a unique directory for this generation
      const dirName = options.fileName 
        ? `${options.fileName}-${timestamp}`
        : `v0-generated-${timestamp}`;
      
      const dirPath = path.join(this.workspacePath, dirName);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Write each file with a unique name
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name || `component-${i + 1}.tsx`;
        const filePath = path.join(dirPath, fileName);
        
        try {
          fs.writeFileSync(filePath, file.content);
          savedFiles.push({
            name: fileName,
            path: filePath,
            content: file.content
          });
          console.error(`✅ Saved file: ${filePath}`);
        } catch (error) {
          console.error(`❌ Failed to save file: ${fileName}`, error);
        }
      }

      return {
        success: true,
        files: savedFiles,
        directory: dirPath
      };
    } catch (error) {
      console.error('❌ File writing failed:', error);
      return {
        success: false,
        files: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

class NuggetwiseMCPServer {
  private server: Server;
  private v0Client: V0Client;
  private fileWriter: FileWriter;

  constructor(config: EnvironmentConfig) {
    this.server = new Server({
      name: 'nuggetwise-mcp',
      version: '1.0.0',
    });

    this.v0Client = new V0Client(config);
    this.fileWriter = new FileWriter(config.cursorWorkspacePath);

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // Handle server info request
    this.server.setRequestHandler(InitializeRequestSchema, async () => {
      return {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
          prompts: {}
        },
        serverInfo: {
          name: 'nuggetwise-v0',
          version: '1.0.0'
        }
      };
    });

    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'generate',
            description: 'Generate React components using V0 AI',
            inputSchema: {
              type: 'object',
              properties: {
                prompt: {
                  type: 'string',
                  description: 'Description of the component to generate',
                },
                modelId: {
                  type: 'string',
                  enum: ['v0-1.5-sm', 'v0-1.5-md', 'v0-1.5-lg'],
                  default: 'v0-1.5-sm',
                  description: 'V0 model to use for generation',
                },
                saveToWorkspace: {
                  type: 'boolean',
                  default: true,
                  description: 'Whether to save generated files to workspace',
                },
                fileName: {
                  type: 'string',
                  description: 'Optional name for the generated directory',
                },
              },
              required: ['prompt'],
            },
          },
          {
            name: 'v0_continue',
            description: 'Continue a V0 conversation',
            inputSchema: {
              type: 'object',
              properties: {
                chatId: {
                  type: 'string',
                  description: 'V0 chat ID to continue',
                },
                message: {
                  type: 'string',
                  description: 'Message to send to continue the conversation',
                },
              },
              required: ['chatId', 'message'],
            },
          },
        ],
      };
    });

    // List available prompts
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: [
          {
            name: 'generate',
            description: 'Generate React components from a natural-language prompt using V0',
            arguments: [
              {
                name: 'prompt',
                description: 'What you want to build',
                type: 'string',
                required: true
              }
            ]
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'generate': {
            const { prompt, modelId = 'v0-1.5-sm', saveToWorkspace = true, fileName } = args as any;
            
            console.error('🚀 MCP: Starting V0 generation...');
            console.error('📝 MCP: Prompt:', prompt);
            console.error('🔧 MCP: Options:', { modelId, saveToWorkspace, fileName });
            
            const result = await this.v0Client.generateComponents(prompt as string, {
              modelId,
              saveToWorkspace,
            });

            // Debug logging
            console.error('🔍 MCP: V0 Result received:', {
              hasFiles: !!result.files,
              filesLength: result.files?.length || 0,
              hasComponents: !!result.components,
              componentsLength: result.components?.length || 0,
              saveToWorkspace,
              chatId: result.chatId,
              projectUrl: result.projectUrl,
              deploymentUrl: result.deploymentUrl
            });

            if (result.files && result.files.length > 0) {
              console.error('📁 MCP: Files received:');
              result.files.forEach((file, index) => {
                console.error(`  ${index + 1}. ${file.name} (${file.content?.length || 0} chars)`);
                console.error(`     Content preview: ${file.content?.substring(0, 100)}...`);
              });
            }

            let fileInfo = '';
            if (saveToWorkspace) {
              console.error('📝 MCP: Auto-save enabled - files will be saved to project structure');
              if (result.files && result.files.length > 0) {
                fileInfo = `\n\n📁 Files auto-saved to: frontend/src/components/`;
                for (const file of result.files) {
                  fileInfo += `\n  - ${file.name}`;
                }
                console.error('✅ MCP: Files auto-saved to project structure');
              } else {
                console.error('⚠️ MCP: No files to auto-save');
              }
            } else {
              console.error('⚠️ MCP: Auto-save disabled');
            }

            return {
              content: [
                {
                  type: 'text',
                  text: `✅ Component generated successfully!\n\n` +
                        `📝 Generated Code:\n\`\`\`tsx\n${result.components?.[0]?.code || 'No code generated'}\n\`\`\`\n\n` +
                        `🌐 Live Preview: ${result.deploymentUrl || 'Not available'}\n` +
                        `💬 V0 Chat: ${result.projectUrl || 'Not available'}${fileInfo}\n\n` +
                        `🎨 V0 AI has created your component!`,
                },
              ],
            };
          }

          case 'v0_continue': {
            const { chatId, message } = args as any;
            
            const result = await this.v0Client.continueConversation(chatId as string, message as string);

            return {
              content: [
                {
                  type: 'text',
                  text: `✅ Conversation continued successfully!\n\n` +
                        `📝 Updated Code:\n\`\`\`tsx\n${result.components?.[0]?.code || 'No code generated'}\n\`\`\`\n\n` +
                        `🌐 Live Preview: ${result.deploymentUrl || 'Not available'}\n` +
                        `💬 V0 Chat: ${result.projectUrl || 'Not available'}`,
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        console.error('❌ MCP Tool error:', error);
        return {
          content: [
            {
              type: 'text',
              text: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    // Don't log to stdout - it interferes with JSON-RPC
    // console.log('🚀 Nuggetwise MCP Server started');
  }
}

// Initialize and run the server
const config: EnvironmentConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  v0ApiKey: process.env.V0_API_KEY || '',
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
  cursorWorkspacePath: process.env.CURSOR_WORKSPACE_PATH || process.cwd(),
  budget: {
    maxCost: parseFloat(process.env.MAX_COST || '10.0'),
    maxTime: parseInt(process.env.MAX_TIME || '300000'),
    maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
    costPerToken: parseFloat(process.env.COST_PER_TOKEN || '0.00003'),
  },
  mode: (process.env.NODE_ENV as 'development' | 'production') || 'development',
};

const server = new NuggetwiseMCPServer(config);
server.run().catch((error) => {
  console.error('MCP Server Error:', error);
}); 