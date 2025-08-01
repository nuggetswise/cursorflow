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
          {
            name: 'status',
            description: 'Check V0 API key status and connection',
            inputSchema: {
              type: 'object',
              properties: {},
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
          },
          {
            name: 'update',
            description: 'Update the current project with new requirements or changes',
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
            name: 'list_projects',
            description: 'List all V0 projects in your workspace',
            arguments: []
          },
          {
            name: 'switch_project',
            description: 'Switch to a different V0 project',
            arguments: [
              {
                name: 'projectId',
                description: 'ID of the project to switch to',
                type: 'string',
                required: true
              }
            ]
          },
          {
            name: 'create_project',
            description: 'Create a new V0 project',
            arguments: [
              {
                name: 'name',
                description: 'Name of the project to create',
                type: 'string',
                required: true
              },
              {
                name: 'description',
                description: 'Optional description of the project',
                type: 'string',
                required: false
              }
            ]
          },
          {
            name: 'status',
            description: 'Check V0 API key status and connection',
            arguments: []
          }
        ]
      };
    });

    // Handle prompt requests
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name } = request.params;
      
      if (name === 'generate') {
        return {
          prompt: {
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
        };
      }
      
      if (name === 'update') {
        return {
          prompt: {
            name: 'update',
            description: 'Update the current project with new requirements or changes',
            arguments: [
              {
                name: 'message',
                description: 'What changes or updates you want to make',
                type: 'string',
                required: true
              }
            ]
          }
        };
      }
      
      if (name === 'status') {
        return {
          prompt: {
            name: 'status',
            description: 'Check V0 API key status and connection',
            arguments: []
          }
        };
      }
      
      throw new Error(`Unknown prompt: ${name}`);
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'generate': {
            const { prompt, modelId = 'v0-1.5-sm', saveToWorkspace = true, fileName, projectName = 'New Project' } = args as any;
            
            console.error('🚀 MCP: Starting V0 generation...');
            console.error('📝 MCP: Prompt:', prompt);
            console.error('🔧 MCP: Options:', { modelId, saveToWorkspace, fileName, projectName });

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

            // Create or find V0 project
            let projectId = this.currentProjectId;
            if (!projectId) {
              try {
                const project = await this.v0Client.createProject(projectName, `Project for: ${prompt}`);
                projectId = project.id;
                this.currentProjectId = projectId;
                this.currentProjectName = project.name;
                console.error(`✅ MCP: Created V0 project: ${project.name} (ID: ${projectId})`);
              } catch (error) {
                console.error('⚠️ MCP: Could not create V0 project, continuing without project organization');
              }
            }
            
            const result = await this.v0Client.generateComponents(prompt as string, {
              modelId,
              saveToWorkspace,
              projectName: this.currentProjectName || 'new-project',
            });

            // Debug logging
            console.error('🔍 MCP: V0 Result received:', {
              hasFiles: !!result.files,
              filesLength: result.files?.length || 0,
              hasComponents: !!result.components,
              componentsLength: result.components?.length || 0,
              saveToWorkspace,
              chatId: result.chatId,
              projectId,
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

            // Store the current chat ID and project info for future updates
            this.currentChatId = result.chatId;
            if (!this.currentProjectName) {
              this.currentProjectName = projectName;
            }
            this.saveState();

            // Assign chat to project if we have a project ID
            if (projectId && result.chatId) {
              try {
                await this.v0Client.assignChatToProject(result.chatId, projectId);
                console.error(`✅ MCP: Chat ${result.chatId} assigned to project ${projectId}`);
              } catch (error) {
                console.error('⚠️ MCP: Could not assign chat to project');
              }
            }
            
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

          case 'v0_continue':
          case 'continue':
          case 'update': {
            const { chatId, message } = args as any;
            
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
            
            // Use stored chat ID if not provided
            const targetChatId = chatId || this.currentChatId;
            
            if (!targetChatId) {
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
            
            console.error('🔄 MCP: Updating V0 project...');
            console.error('📝 MCP: Chat ID:', targetChatId);
            console.error('💬 MCP: Message:', message);
            
            const result = await this.v0Client.continueConversation(targetChatId as string, message as string);

            // Update stored chat ID and save state
            this.currentChatId = result.chatId;
            this.saveState();

            // Auto-save updated files using the same logic as generate
            if (result.files && result.files.length > 0) {
              await this.v0Client.saveFilesToProject(result.files, {
                projectName: this.currentProjectName || 'current-project',
              });
            }

            return {
              content: [
                {
                  type: 'text',
                  text: `✅ Project updated successfully!\n\n` +
                        `📝 Updated Code:\n\`\`\`tsx\n${result.components?.[0]?.code || 'No code generated'}\n\`\`\`\n\n` +
                        `🌐 Live Preview: ${result.deploymentUrl || 'Not available'}\n` +
                        `💬 V0 Chat: ${result.projectUrl || 'Not available'}\n\n` +
                        `💡 To make more changes, use:\n` +
                        `   /nuggetwise-v0/update your next changes`,
                },
              ],
            };
          }

          case 'list_projects': {
            try {
              const projects = await this.v0Client.findProjects();
              
              if (projects.length === 0) {
                return {
                  content: [
                    {
                      type: 'text',
                      text: `📁 No V0 projects found.\n\n💡 Create your first project with:\n   /nuggetwise-v0/create_project name: "My Project"`,
                    },
                  ],
                };
              }

              const projectList = projects.map((project, index) => {
                const isCurrent = project.id === this.currentProjectId;
                const status = isCurrent ? '🟢 CURRENT' : '⚪';
                return `${index + 1}. ${status} ${project.name}\n   ID: ${project.id}\n   Created: ${new Date(project.createdAt).toLocaleDateString()}\n   URL: ${project.webUrl}`;
              }).join('\n\n');

              return {
                content: [
                  {
                    type: 'text',
                    text: `📁 V0 Projects (${projects.length}):\n\n${projectList}\n\n💡 Switch to a project with:\n   /nuggetwise-v0/switch_project projectId: "project-id"`,
                  },
                ],
              };
            } catch (error) {
              return {
                content: [
                  {
                    type: 'text',
                    text: `❌ Failed to list projects: ${error instanceof Error ? error.message : 'Unknown error'}`,
                  },
                ],
                isError: true,
              };
            }
          }

          case 'switch_project': {
            const { projectId } = args as any;
            
            try {
              const project = await this.v0Client.getProjectById(projectId);
              
              // Update current project
              this.currentProjectId = project.id;
              this.currentProjectName = project.name;
              this.currentChatId = null; // Reset chat ID when switching projects
              this.saveState();

              return {
                content: [
                  {
                    type: 'text',
                    text: `✅ Switched to project: ${project.name}\n\n📁 Project ID: ${project.id}\n🌐 Project URL: ${project.webUrl}\n💬 Chats: ${project.chats.length}\n\n💡 Generate components in this project with:\n   /nuggetwise-v0/generate your component description`,
                  },
                ],
              };
            } catch (error) {
              return {
                content: [
                  {
                    type: 'text',
                    text: `❌ Failed to switch project: ${error instanceof Error ? error.message : 'Unknown error'}`,
                  },
                ],
                isError: true,
              };
            }
          }

          case 'create_project': {
            const { name, description } = args as any;
            
            try {
              const project = await this.v0Client.createProject(name, description);
              
              // Set as current project
              this.currentProjectId = project.id;
              this.currentProjectName = project.name;
              this.currentChatId = null; // Reset chat ID for new project
              this.saveState();

              return {
                content: [
                  {
                    type: 'text',
                    text: `✅ Created new V0 project: ${project.name}\n\n📁 Project ID: ${project.id}\n🌐 Project URL: ${project.webUrl}\n\n💡 Start generating components with:\n   /nuggetwise-v0/generate your component description`,
                  },
                ],
              };
            } catch (error) {
              return {
                content: [
                  {
                    type: 'text',
                    text: `❌ Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
              
              switch (statusInfo.apiKeyStatus) {
                case 'connected':
                  statusText = `🔑 API Key: Connected ✅\n\n`;
                  if (statusInfo.creditsRemaining !== undefined) {
                    statusText += `💰 Credits Remaining: ${statusInfo.creditsRemaining}\n\n`;
                  }
                  statusText += `🎉 You're all set! Try generating a component:\n   /nuggetwise-v0/generate create a button`;
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