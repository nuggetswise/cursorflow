import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  InitializeRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  Tool,
  CallToolRequest,
} from '@modelcontextprotocol/sdk/types.js';
import { V0Client } from './services/V0Client.js';
import { SetupWizard } from './services/SetupWizard.js';
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
  private setupWizard: SetupWizard;
  private fileWriter: FileWriter;
  private currentChatId: string | null = null;
  private currentProjectName: string | null = null;
  private currentProjectId: string | null = null;
  private stateFile: string;

  constructor(config: EnvironmentConfig) {
    this.server = new Server({
      name: 'nuggetwise-mcp',
      version: '1.0.0',
    });

    this.v0Client = new V0Client(config);
    this.setupWizard = new SetupWizard(config);
    this.fileWriter = new FileWriter(config.cursorWorkspacePath);
    this.stateFile = path.join(config.cursorWorkspacePath, '.mcp-state.json');
    
    // Load existing state
    this.loadState();

    this.setupToolHandlers();
  }

  private loadState() {
    try {
      if (fs.existsSync(this.stateFile)) {
        const state = JSON.parse(fs.readFileSync(this.stateFile, 'utf-8'));
        this.currentChatId = state.chatId || null;
        this.currentProjectName = state.projectName || null;
        this.currentProjectId = state.projectId || null;
      }
    } catch (error) {
      console.error('Failed to load state:', error);
    }
  }

  private saveState() {
    try {
      const state = {
        chatId: this.currentChatId,
        projectName: this.currentProjectName,
        projectId: this.currentProjectId,
        timestamp: new Date().toISOString()
      };
      fs.writeFileSync(this.stateFile, JSON.stringify(state, null, 2));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
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

    // List available tools (Simplified 5-command workflow)
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
              },
              required: ['prompt'],
            },
          },
          {
            name: 'update',
            description: 'Update existing components with new requirements',
            inputSchema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'What changes or updates you want to make',
                },
              },
              required: ['message'],
            },
          },
          {
            name: 'sync',
            description: 'Pull changes from V0 web interface',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'status',
            description: 'Check current project status and connection',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'connect',
            description: 'Connect to existing V0 project',
            inputSchema: {
              type: 'object',
              properties: {
                v0Url: {
                  type: 'string',
                  description: 'V0 project URL to connect to',
                },
              },
              required: ['v0Url'],
            },
          },
        ],
      };
    });

    // List available prompts (Simplified 5-command workflow)
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
          },
          {
            name: 'update',
            description: 'Update existing components with new requirements',
            arguments: [
              {
                name: 'message',
                description: 'What changes or updates you want to make',
                type: 'string',
                required: true
              }
            ]
          },
          {
            name: 'sync',
            description: 'Pull changes from V0 web interface',
            arguments: []
          },
          {
            name: 'status',
            description: 'Check current project status and connection',
            arguments: []
          },
          {
            name: 'connect',
            description: 'Connect to existing V0 project',
            arguments: [
              {
                name: 'v0Url',
                description: 'V0 project URL to connect to',
                type: 'string',
                required: true
              }
            ]
          }
        ]
      };
    });

    // Handle prompt requests (Simplified 5-command workflow)
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      console.error('🔍 MCP Prompt Request:', { name, args });
      
      if (name === 'generate') {
        console.error('🔍 MCP Prompt Request - Full params:', JSON.stringify(request.params, null, 2));
        
        // Simple argument extraction
        let prompt = 'Create a React component';
        
        if (args) {
          if (typeof args === 'string') {
            prompt = args;
          } else if (args.prompt) {
            prompt = args.prompt;
          } else if (Object.keys(args).length > 0) {
            // Take the first string value found
            const firstStringValue = Object.values(args).find(v => typeof v === 'string');
            if (firstStringValue) {
              prompt = firstStringValue;
            }
          }
        }
        
        // Validate prompt
        if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
          return {
            description: 'Generate React components from a natural-language prompt using V0',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: '❌ Error: A valid prompt is required. Please provide a description of the component you want to generate.'
                }
              }
            ]
          };
        }
        
        prompt = prompt.trim();
        console.error('🎯 Final prompt:', prompt);
        
        // Instead of just returning a message, let's actually execute the V0 generation
        try {
          console.error('🚀 Executing V0 generation from prompt...');
          
          // Check for API key and provide setup instructions if missing
          if (await this.setupWizard.detectMissingApiKey()) {
            const setupInstructions = await this.setupWizard.provideSetupInstructions();
            return {
              description: 'Generate React components from a natural-language prompt using V0',
              messages: [
                {
                  role: 'user',
                  content: {
                    type: 'text',
                    text: setupInstructions
                  }
                }
              ]
            };
          }

          // Validate API key
          const apiKey = await this.setupWizard.getApiKey();
          if (apiKey) {
            const validation = await this.setupWizard.validateApiKey(apiKey);
            if (!validation.isValid) {
              return {
                description: 'Generate React components from a natural-language prompt using V0',
                messages: [
                  {
                    role: 'user',
                    content: {
                      type: 'text',
                      text: `❌ ${validation.error}\n\n💡 Please check your V0 API key configuration and try again.`
                    }
                  }
                ]
              };
            }
          }
          
          const result = await this.v0Client.generateComponents(prompt, {
            modelId: 'v0-1.5-sm',
            saveToWorkspace: false,
          });

          // Save files to workspace
          let fileInfo = '';
          if (result.files && result.files.length > 0) {
            const fileResult = await this.fileWriter.writeV0Files(result.files, {
              fileName: 'generated-component'
            });
            
            if (fileResult.success) {
              fileInfo = `\n\n📁 Files saved to workspace:\n`;
              for (const file of result.files) {
                fileInfo += `  - ${file.name}\n`;
              }
            }
          }

          return {
            description: 'Generate React components from a natural-language prompt using V0',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `✅ Generated React component: ${prompt}\n\n🔗 Project URL: ${result.projectUrl}\n🚀 Demo URL: ${result.deploymentUrl}${fileInfo}`
                }
              }
            ]
          };
          
        } catch (error) {
          console.error('❌ Error executing V0 generation from prompt:', error);
          return {
            description: 'Generate React components from a natural-language prompt using V0',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `❌ Failed to generate component: ${error instanceof Error ? error.message : 'Unknown error'}`
                }
              }
            ]
          };
        }
      }
      
      if (name === 'update') {
        const message = args?.message || 'Update the component';
        return {
          description: 'Update existing components with new requirements',
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Update the component: ${message}`
              }
            }
          ]
        };
      }
      
      if (name === 'sync') {
        return {
          description: 'Pull changes from V0 web interface',
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: 'Sync changes from V0 web interface'
              }
            }
          ]
        };
      }
      
      if (name === 'status') {
        return {
          description: 'Check current project status and connection',
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: 'Check the current project status and connection to V0'
              }
            }
          ]
        };
      }
      
      if (name === 'connect') {
        const v0Url = args?.v0Url || '';
        return {
          description: 'Connect to existing V0 project',
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Connect to V0 project: ${v0Url}`
              }
            }
          ]
        };
      }
      
      throw new Error(`Unknown prompt: ${name}`);
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      console.error('🔧 MCP Tool Call:', { name, args });
      console.error('🔧 MCP Tool Call - Full request params:', JSON.stringify(request.params, null, 2));

      try {
        switch (name) {
          case 'generate': {
            console.error('🚀 MCP: Starting V0 generation...');
            console.error('🔍 MCP: Raw args:', args);
            
            // Extract prompt from various possible argument formats
            let prompt = 'Create a React component';
            let modelId = 'v0-1.5-sm';
            
            if (args) {
              if (typeof args === 'string') {
                prompt = args;
              } else if (typeof args === 'object' && args !== null) {
                if ('description' in args && typeof args.description === 'string') {
                  prompt = args.description;
                } else if ('prompt' in args && typeof args.prompt === 'string') {
                  prompt = args.prompt;
                }
                if ('modelId' in args && typeof args.modelId === 'string') {
                  modelId = args.modelId;
                }
                if (Object.keys(args).length > 0) {
                  // Look for any string value that could be the prompt
                  const stringValues = Object.values(args).filter(v => typeof v === 'string') as string[];
                  if (stringValues.length > 0 && stringValues[0]) {
                    prompt = stringValues[0];
                  }
                }
              }
            }
            
            console.error('📝 MCP: Extracted prompt:', prompt);
            console.error('🔧 MCP: Model ID:', modelId);

            // Check for API key and provide setup instructions if missing
            if (await this.setupWizard.detectMissingApiKey()) {
              const setupInstructions = await this.setupWizard.provideSetupInstructions();
              return {
                content: [
                  {
                    type: 'text',
                    text: setupInstructions,
                  },
                ],
                isError: true,
              };
            }

            // Validate API key
            const apiKey = await this.setupWizard.getApiKey();
            if (apiKey) {
              const validation = await this.setupWizard.validateApiKey(apiKey);
              if (!validation.isValid) {
                return {
                  content: [
                    {
                      type: 'text',
                      text: `❌ ${validation.error}\n\n💡 Please check your V0 API key configuration and try again.`,
                    },
                  ],
                  isError: true,
                };
              }
            }
            
            const result = await this.v0Client.generateComponents(prompt as string, {
              modelId,
              saveToWorkspace: false, // We'll handle file saving ourselves
            });

            // Debug logging
            console.error('🔍 MCP: V0 Result received:', {
              hasFiles: !!result.files,
              filesLength: result.files?.length || 0,
              hasComponents: !!result.components,
              componentsLength: result.components?.length || 0,
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

            // Save files to workspace
            let fileInfo = '';
            if (result.files && result.files.length > 0) {
              const fileResult = await this.fileWriter.writeV0Files(result.files, {
                fileName: 'generated-component'
              });
              
              if (fileResult.success) {
                fileInfo = `\n\n📁 Files saved to workspace:\n`;
                for (const file of result.files) {
                  fileInfo += `  - ${file.name}\n`;
                }
                console.error('✅ MCP: Files saved to workspace');
              }
            }

            // Store the current chat ID for future updates
            this.currentChatId = result.chatId;
            this.currentProjectName = 'Generated Component';
            this.saveState();
            
            return {
              content: [
                {
                  type: 'text',
                  text: `✅ Component generated successfully!\n\n` +
                        `📝 Generated Code:\n\`\`\`tsx\n${result.components?.[0]?.code || 'No code generated'}\n\`\`\`\n\n` +
                        `🌐 Live Preview: ${result.deploymentUrl || 'Not available'}\n` +
                        `💬 V0 Chat: ${result.projectUrl || 'Not available'}${fileInfo}\n\n` +
                        `🎨 V0 AI has created your component!\n\n` +
                        `💡 To update this component, simply use:\n` +
                        `   /nuggetwise-v0/update your changes here`,
                },
              ],
            };
          }

          case 'update': {
            const { message } = args as any;
            
            // Check for API key and provide setup instructions if missing
            if (await this.setupWizard.detectMissingApiKey()) {
              const setupInstructions = await this.setupWizard.provideSetupInstructions();
              return {
                content: [
                  {
                    type: 'text',
                    text: setupInstructions,
                  },
                ],
                isError: true,
              };
            }

            // Validate API key
            const apiKey = await this.setupWizard.getApiKey();
            if (apiKey) {
              const validation = await this.setupWizard.validateApiKey(apiKey);
              if (!validation.isValid) {
                return {
                  content: [
                    {
                      type: 'text',
                      text: `❌ ${validation.error}\n\n💡 Please check your V0 API key configuration and try again.`,
                    },
                  ],
                  isError: true,
                };
              }
            }
            
            // Check if we have an active chat
            if (!this.currentChatId) {
              return {
                content: [
                  {
                    type: 'text',
                    text: `❌ No active project found!\n\n` +
                          `💡 Please generate a component first using:\n` +
                          `   /nuggetwise-v0/generate your component description`,
                  },
                ],
                isError: true,
              };
            }
            
            console.error('🔄 MCP: Updating component...');
            console.error('📝 MCP: Chat ID:', this.currentChatId);
            console.error('💬 MCP: Message:', message);
            
            const result = await this.v0Client.continueConversation(this.currentChatId, message);

            // Update stored chat ID and save state
            this.currentChatId = result.chatId;
            this.saveState();

            // Save updated files to workspace
            if (result.files && result.files.length > 0) {
              const fileResult = await this.fileWriter.writeV0Files(result.files, {
                fileName: 'updated-component'
              });
              
              if (fileResult.success) {
                console.error('✅ MCP: Updated files saved to workspace');
              }
            }

            return {
              content: [
                {
                  type: 'text',
                  text: `✅ Component updated successfully!\n\n` +
                        `📝 Updated Code:\n\`\`\`tsx\n${result.components?.[0]?.code || 'No code generated'}\n\`\`\`\n\n` +
                        `🌐 Live Preview: ${result.deploymentUrl || 'Not available'}\n` +
                        `💬 V0 Chat: ${result.projectUrl || 'Not available'}\n\n` +
                        `💡 To make more changes, use:\n` +
                        `   /nuggetwise-v0/update your next changes`,
                },
              ],
            };
          }

          case 'sync': {
            // Check for API key and provide setup instructions if missing
            if (await this.setupWizard.detectMissingApiKey()) {
              const setupInstructions = await this.setupWizard.provideSetupInstructions();
              return {
                content: [
                  {
                    type: 'text',
                    text: setupInstructions,
                  },
                ],
                isError: true,
              };
            }

            // Check if we have an active chat
            if (!this.currentChatId) {
              return {
                content: [
                  {
                    type: 'text',
                    text: `❌ No active project found!\n\n` +
                          `💡 Please generate a component first using:\n` +
                          `   /nuggetwise-v0/generate your component description`,
                  },
                ],
                isError: true,
              };
            }

            try {
              console.error('🔄 MCP: Syncing with V0 web interface...');
              console.error('📝 MCP: Chat ID:', this.currentChatId);
              
              // Get the latest version from V0
              const result = await this.v0Client.getProjectStatus(this.currentChatId);
              
              if (result.status === 'completed') {
                // Pull the latest files
                const files = await this.v0Client.exportProject(this.currentChatId);
                
                if (files.files && files.files.length > 0) {
                  const fileResult = await this.fileWriter.writeV0Files(files.files, {
                    fileName: 'synced-component'
                  });
                  
                  if (fileResult.success) {
                    console.error('✅ MCP: Synced files saved to workspace');
                  }
                }

                return {
                  content: [
                    {
                      type: 'text',
                      text: `✅ Successfully synced with V0 web interface!\n\n` +
                            `📁 Files updated in workspace\n` +
                            `🌐 V0 Project: ${this.currentProjectName || 'Current Project'}\n\n` +
                            `💡 Continue working with:\n` +
                            `   /nuggetwise-v0/update your changes`,
                    },
                  ],
                };
              } else {
                return {
                  content: [
                    {
                      type: 'text',
                      text: `⏳ Project is still building...\n\n` +
                            `Status: ${result.status}\n` +
                            `Progress: ${result.progress}%\n\n` +
                            `💡 Try syncing again in a moment.`,
                    },
                  ],
                };
              }
            } catch (error) {
              return {
                content: [
                  {
                    type: 'text',
                    text: `❌ Failed to sync: ${error instanceof Error ? error.message : 'Unknown error'}`,
                  },
                ],
                isError: true,
              };
            }
          }

          case 'connect': {
            const { v0Url } = args as any;
            
            // Check for API key and provide setup instructions if missing
            if (await this.setupWizard.detectMissingApiKey()) {
              const setupInstructions = await this.setupWizard.provideSetupInstructions();
              return {
                content: [
                  {
                    type: 'text',
                    text: setupInstructions,
                  },
                ],
                isError: true,
              };
            }

            try {
              console.error('🔗 MCP: Connecting to V0 project...');
              console.error('📝 MCP: URL:', v0Url);
              
              // Extract chat ID from V0 URL
              const chatIdMatch = v0Url.match(/\/chat\/([a-zA-Z0-9]+)/);
              if (!chatIdMatch) {
                return {
                  content: [
                    {
                      type: 'text',
                      text: `❌ Invalid V0 URL format.\n\n` +
                            `💡 Please provide a valid V0 project URL like:\n` +
                            `   https://v0.dev/chat/abc123`,
                    },
                  ],
                  isError: true,
                };
              }
              
              const chatId = chatIdMatch[1];
              
              // Test the connection by getting project status
              const status = await this.v0Client.getProjectStatus(chatId);
              
              // Set as current project
              this.currentChatId = chatId;
              this.currentProjectName = 'Connected Project';
              this.saveState();

              return {
                content: [
                  {
                    type: 'text',
                    text: `✅ Successfully connected to V0 project!\n\n` +
                          `📝 Chat ID: ${chatId}\n` +
                          `🌐 Project URL: ${v0Url}\n` +
                          `📊 Status: ${status.status}\n\n` +
                          `💡 Start working with:\n` +
                          `   /nuggetwise-v0/update your changes`,
                  },
                ],
              };
            } catch (error) {
              return {
                content: [
                  {
                    type: 'text',
                    text: `❌ Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`,
                  },
                ],
                isError: true,
              };
            }
          }

          case 'status': {
            try {
              const statusInfo = await this.setupWizard.getStatusInfo();
              
              let statusText = '';
              let isError = false;
              
              // API Key Status
              switch (statusInfo.apiKeyStatus) {
                case 'connected':
                  statusText = `🔑 API Key: Connected ✅\n\n`;
                  if (statusInfo.creditsRemaining !== undefined) {
                    statusText += `💰 Credits Remaining: ${statusInfo.creditsRemaining}\n\n`;
                  }
                  break;
                  
                case 'disconnected':
                  statusText = `🔑 API Key: Not Connected ❌\n\n`;
                  const setupInstructions = await this.setupWizard.provideSetupInstructions();
                  statusText += setupInstructions;
                  isError = true;
                  break;
                  
                case 'invalid':
                  statusText = `🔑 API Key: Invalid ❌\n\n❌ ${statusInfo.error}\n\n💡 Please check your V0 API key configuration.`;
                  isError = true;
                  break;
              }
              
              // Project Status
              if (statusInfo.apiKeyStatus === 'connected') {
                if (this.currentChatId) {
                  statusText += `📁 Current Project: Active ✅\n`;
                  statusText += `💬 Chat ID: ${this.currentChatId}\n`;
                  if (this.currentProjectName) {
                    statusText += `📝 Project Name: ${this.currentProjectName}\n`;
                  }
                  statusText += `\n💡 Available commands:\n`;
                  statusText += `   /nuggetwise-v0/update your changes\n`;
                  statusText += `   /nuggetwise-v0/sync\n`;
                  statusText += `   /nuggetwise-v0/connect <v0-url>\n`;
                } else {
                  statusText += `📁 Current Project: None\n\n`;
                  statusText += `💡 Start by generating a component:\n`;
                  statusText += `   /nuggetwise-v0/generate create a button\n`;
                  statusText += `   /nuggetwise-v0/connect <v0-url>`;
                }
              }
              
              return {
                content: [
                  {
                    type: 'text',
                    text: statusText,
                  },
                ],
                isError,
              };
            } catch (error) {
              return {
                content: [
                  {
                    type: 'text',
                    text: `❌ Status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                  },
                ],
                isError: true,
              };
            }
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