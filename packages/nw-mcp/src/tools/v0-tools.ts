import { V0Client } from '../services/V0Client';
import { EnvironmentConfig } from '../types';

export interface V0MCPTool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
  handler: (params: any) => Promise<any>;
}

export class V0MCPTools {
  private v0Client: V0Client;

  constructor(config: EnvironmentConfig) {
    this.v0Client = new V0Client(config);
  }

  getTools(): V0MCPTool[] {
    return [
      {
        name: 'v0_generate_component',
        description: 'Generate React components using V0 AI',
        parameters: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'Description of the component to generate (e.g., "Create a green dot on white screen")'
            },
            modelId: {
              type: 'string',
              enum: ['v0-1.5-sm', 'v0-1.5-md', 'v0-1.5-lg'],
              description: 'V0 model to use for generation',
              default: 'v0-1.5-sm'
            },
            saveToWorkspace: {
              type: 'boolean',
              description: 'Whether to save the generated component to the workspace',
              default: true
            },
            fileName: {
              type: 'string',
              description: 'Name for the generated file (optional)'
            }
          },
          required: ['prompt']
        },
        handler: async (params: any) => {
          try {
            console.log('🚀 V0 MCP Tool: Generating component...', params);
            
            const result = await this.v0Client.generateComponents(params.prompt, {
              modelId: params.modelId || 'v0-1.5-sm',
              saveToWorkspace: params.saveToWorkspace !== false,
              fileName: params.fileName
            });

            return {
              success: true,
              data: {
                chatId: result.chatId,
                projectUrl: result.projectUrl,
                deploymentUrl: result.deploymentUrl,
                components: result.components,
                files: result.files
              }
            };
          } catch (error) {
            console.error('❌ V0 MCP Tool error:', error);
            return {
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        }
      },
      {
        name: 'v0_continue_conversation',
        description: 'Continue a V0 chat conversation',
        parameters: {
          type: 'object',
          properties: {
            chatId: {
              type: 'string',
              description: 'The V0 chat ID to continue'
            },
            message: {
              type: 'string',
              description: 'The message to send to continue the conversation'
            }
          },
          required: ['chatId', 'message']
        },
        handler: async (params: any) => {
          try {
            console.log('🔄 V0 MCP Tool: Continuing conversation...', params);
            
            const result = await this.v0Client.continueConversation(params.chatId, params.message);

            return {
              success: true,
              data: {
                chatId: result.chatId,
                projectUrl: result.projectUrl,
                deploymentUrl: result.deploymentUrl,
                components: result.components,
                files: result.files
              }
            };
          } catch (error) {
            console.error('❌ V0 MCP Tool error:', error);
            return {
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        }
      },
      {
        name: 'v0_get_project_status',
        description: 'Get the status of a V0 project',
        parameters: {
          type: 'object',
          properties: {
            chatId: {
              type: 'string',
              description: 'The V0 chat ID to check status for'
            }
          },
          required: ['chatId']
        },
        handler: async (params: any) => {
          try {
            console.log('📊 V0 MCP Tool: Getting project status...', params);
            
            const status = await this.v0Client.getProjectStatus(params.chatId);

            return {
              success: true,
              data: status
            };
          } catch (error) {
            console.error('❌ V0 MCP Tool error:', error);
            return {
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        }
      }
    ];
  }
} 