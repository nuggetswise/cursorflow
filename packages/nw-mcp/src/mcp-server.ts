import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  CallToolRequest,
} from '@modelcontextprotocol/sdk/types.js';
import { V0Client } from './services/V0Client.js';
import { EnvironmentConfig } from './types/index.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class NuggetwiseMCPServer {
  private server: Server;
  private v0Client: V0Client;

  constructor(config: EnvironmentConfig) {
    this.server = new Server({
      name: 'nuggetwise-mcp',
      version: '1.0.0',
    });

    this.v0Client = new V0Client(config);

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'v0_generate',
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

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'v0_generate': {
            const { prompt, modelId = 'v0-1.5-sm', saveToWorkspace = true } = args as any;
            
            console.log('🚀 MCP V0 Generate:', { prompt, modelId });
            
            const result = await this.v0Client.generateComponents(prompt as string, {
              modelId,
              saveToWorkspace,
            });

            return {
              content: [
                {
                  type: 'text',
                  text: `✅ Component generated successfully!\n\n` +
                        `📝 Generated Code:\n\`\`\`tsx\n${result.components?.[0]?.code || 'No code generated'}\n\`\`\`\n\n` +
                        `🌐 Live Preview: ${result.deploymentUrl || 'Not available'}\n` +
                        `💬 V0 Chat: ${result.projectUrl || 'Not available'}\n\n` +
                        `🎨 V0 AI has created your component!`,
                },
              ],
            };
          }

          case 'v0_continue': {
            const { chatId, message } = args as any;
            
            console.log('🔄 MCP V0 Continue:', { chatId, message });
            
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
    console.log('🚀 Nuggetwise MCP Server started');
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
server.run().catch(console.error); 