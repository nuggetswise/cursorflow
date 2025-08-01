#!/usr/bin/env node

/**
 * Nuggetwise V0 MCP Server
 * A production-ready MCP server for V0 AI component generation
 */

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
import { createClient } from 'v0-sdk';
import * as fs from 'fs';
import * as path from 'path';

// Environment configuration
interface EnvironmentConfig {
  v0ApiKey: string;
  cursorWorkspacePath: string;
}

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

// V0 Client wrapper
class V0Client {
  private client: any;
  private config: EnvironmentConfig;

  constructor(config: EnvironmentConfig) {
    this.config = config;
    this.client = createClient({
      apiKey: config.v0ApiKey,
    });
  }

  async generateComponent(prompt: string, options: any = {}) {
    try {
      console.error('🔍 V0Client: Calling V0 API...');
      console.error(`📝 V0Client: Prompt: ${prompt}`);
      console.error(`🔧 V0Client: Options:`, options);

      const result = await this.client.chats.create({
        system: 'You are an expert React developer. Generate clean, modern, accessible components.',
        message: prompt,
        modelConfiguration: {
          modelId: options.modelId || 'v0-1.5-sm',
          imageGenerations: false,
          thinking: false,
        },
      });

      console.error('🔍 V0Client: V0 API Response:', {
        chatId: result.id,
        hasLatestVersion: !!result.latestVersion,
        hasFiles: !!result.latestVersion?.files,
        filesLength: result.latestVersion?.files?.length || 0,
        fileNames: result.latestVersion?.files?.map((f: any) => f.name) || [],
        hasDemoUrl: !!result.latestVersion?.demoUrl,
        hasUrl: !!result.url
      });

      const files = result.latestVersion?.files || [];
      
      if (files.length > 0) {
        console.error('📁 V0Client: Files received from V0 API:');
        files.forEach((file: any, index: number) => {
          console.error(`  ${index + 1}. ${file.name} (${file.content?.length || 0} chars)`);
          console.error(`     Content preview: ${file.content?.substring(0, 50)}...`);
        });
      }

      const transformedResponse = {
        chatId: result.id,
        componentsLength: files.length,
        filesLength: files.length,
        hasDeploymentUrl: !!result.latestVersion?.demoUrl,
        hasProjectUrl: !!result.url
      };

      console.error('📊 V0Client: Transformed response:', transformedResponse);

      return {
        files,
        projectUrl: result.url,
        deploymentUrl: result.latestVersion?.demoUrl,
        ...transformedResponse
      };
    } catch (error) {
      console.error('❌ V0Client: API call failed:', error);
      throw error;
    }
  }

  async continueChat(chatId: string, message: string) {
    try {
      const result = await this.client.chats.sendMessage({
        chatId,
        message
      });

      return {
        files: result.latestVersion?.files || [],
        chatId: result.id,
        projectUrl: result.url,
        deploymentUrl: result.latestVersion?.demoUrl
      };
    } catch (error) {
      console.error('❌ V0Client: Continue chat failed:', error);
      throw error;
    }
  }
}

// Main MCP Server class
class NuggetwiseMCPServer {
  private server: Server;
  private v0Client: V0Client;
  private fileWriter: FileWriter;

  constructor(config: EnvironmentConfig) {
    this.server = new Server({
      name: 'nuggetwise-v0-mcp',
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
          name: 'nuggetwise-v0-mcp',
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
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'generate': {
            if (!args || typeof args !== 'object') {
              throw new Error('Invalid arguments provided');
            }
            
            const prompt = (args as any).prompt;
            if (!prompt || typeof prompt !== 'string') {
              throw new Error('Prompt is required and must be a string');
            }

            console.error('🚀 MCP: Starting V0 generation...');
            console.error(`📝 MCP: Prompt: ${prompt}`);
            console.error(`🔧 MCP: Options:`, args);

            const result = await this.v0Client.generateComponent(prompt, args);
            
            console.error('✅ V0 generation completed');
                          console.error('🔍 MCP: V0 Result received:', {
                hasFiles: !!result.files,
                filesLength: result.filesLength,
                hasComponents: !!result.componentsLength,
                componentsLength: result.componentsLength,
                saveToWorkspace: (args as any).saveToWorkspace !== false,
                chatId: result.chatId,
                projectUrl: result.projectUrl,
                deploymentUrl: result.deploymentUrl
              });

            if (result.files && result.files.length > 0) {
              console.error('📁 MCP: Files received:');
              result.files.forEach((file: any, index: number) => {
                console.error(`  ${index + 1}. ${file.name} (${file.content?.length || 0} chars)`);
                console.error(`     Content preview: ${file.content?.substring(0, 50)}...`);
              });

              // Auto-save files if enabled
              if ((args as any).saveToWorkspace !== false) {
                console.error('📝 MCP: Auto-save enabled - files will be saved to project structure');
                
                try {
                  const saveResult = await this.fileWriter.writeV0Files(result.files, {
                    fileName: (args as any).fileName
                  });
                  
                  if (saveResult.success) {
                    console.error('✅ MCP: Files auto-saved to project structure');
                  } else {
                    console.error('❌ MCP: Failed to auto-save files:', saveResult.error);
                  }
                } catch (error) {
                  console.error('❌ MCP: Auto-save error:', error);
                }
              }
            }

            const components = result.files?.map((file: any, index: number) => ({
              name: file.name || `Component${index + 1}`,
              code: file.content || '',
              preview: result.deploymentUrl || `https://v0.dev/chat/${result.chatId}`,
            })) || [];

            let fileInfo = '';
            if (result.files && result.files.length > 0 && (args as any).saveToWorkspace !== false) {
              fileInfo = `\n\n📁 Files auto-saved to: frontend/src/components/`;
              result.files.forEach((file: any) => {
                fileInfo += `\n  - ${file.name}`;
              });
            }

            return {
              content: [
                {
                  type: 'text',
                  text: `✅ Component generated successfully!\n\n` +
                        `📝 Generated Code:\n\`\`\`tsx\n${components[0]?.code || 'No code generated'}\n\`\`\`\n\n` +
                        `🌐 Live Preview: ${result.deploymentUrl || 'Not available'}\n` +
                        `💬 V0 Chat: ${result.projectUrl || 'Not available'}${fileInfo}\n\n` +
                        `🎨 V0 AI has created your component!`,
                },
              ],
            };
          }

          case 'v0_continue': {
            if (!args || typeof args !== 'object') {
              throw new Error('Invalid arguments provided');
            }
            
            const chatId = (args as any).chatId;
            const message = (args as any).message;
            
            if (!chatId || typeof chatId !== 'string') {
              throw new Error('chatId is required and must be a string');
            }
            if (!message || typeof message !== 'string') {
              throw new Error('message is required and must be a string');
            }

            const result = await this.v0Client.continueChat(chatId, message);

            const files = result.files || [];
            const components = files.map((file: any, index: number) => ({
              name: file.name || `Component${index + 1}`,
              code: file.content || '',
              preview: result.deploymentUrl || `https://v0.dev/chat/${result.chatId}`,
            }));

            return {
              content: [
                {
                  type: 'text',
                  text: `✅ Conversation continued successfully!\n\n` +
                        `📝 Updated Code:\n\`\`\`tsx\n${components[0]?.code || 'No code generated'}\n\`\`\`\n\n` +
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
        console.error('❌ MCP: Tool execution failed:', error);
        throw new Error(`Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('🚀 Nuggetwise V0 MCP Server started');
  }
}

// Main execution
async function main() {
  try {
    // Get configuration from environment
    const v0ApiKey = process.env.V0_API_KEY;
    if (!v0ApiKey) {
      throw new Error('V0_API_KEY environment variable is required');
    }

    const cursorWorkspacePath = process.env.CURSOR_WORKSPACE_PATH || process.cwd();
    
    const config: EnvironmentConfig = {
      v0ApiKey,
      cursorWorkspacePath
    };

    const server = new NuggetwiseMCPServer(config);
    await server.run();
  } catch (error) {
    console.error('❌ Failed to start MCP server:', error);
    process.exit(1);
  }
}

// Run the server
main().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
}); 