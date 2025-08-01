#!/usr/bin/env node

import { spawn } from 'child_process';
import readline from 'readline';
import fetch from 'node-fetch';

// Simple MCP server implementation
class SimpleMCPServer {
  constructor() {
    this.tools = [
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
    ];
  }

  // Send MCP message
  sendMessage(message) {
    console.log(JSON.stringify(message));
  }

  // Handle incoming messages
  async handleMessage(message) {
    try {
      const parsed = JSON.parse(message);
      
      switch (parsed.method) {
        case 'initialize':
          this.sendMessage({
            jsonrpc: '2.0',
            id: parsed.id,
            result: {
              protocolVersion: '2024-11-05',
              capabilities: {
                tools: {},
              },
              serverInfo: {
                name: 'nuggetwise-mcp',
                version: '1.0.0',
              },
            },
          });
          break;

        case 'tools/list':
          this.sendMessage({
            jsonrpc: '2.0',
            id: parsed.id,
            result: {
              tools: this.tools,
            },
          });
          break;

        case 'tools/call':
          await this.handleToolCall(parsed);
          break;

        default:
          console.error('Unknown method:', parsed.method);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  async handleToolCall(message) {
    const { name, arguments: args } = message.params;
    
    try {
      switch (name) {
        case 'v0_generate': {
          const { prompt, modelId = 'v0-1.5-sm', saveToWorkspace = true } = args;
          
          console.error('🚀 MCP V0 Generate:', { prompt, modelId });
          
          // Call the REST API server
          const response = await fetch('http://localhost:3001/tools/v0.generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt,
              options: {
                modelId,
                saveToWorkspace,
              },
            }),
          });

          const result = await response.json();

          if (result.success) {
            const data = result.data;
            this.sendMessage({
              jsonrpc: '2.0',
              id: message.id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: `✅ Component generated successfully!\n\n` +
                          `📝 Generated Code:\n\`\`\`tsx\n${data.components?.[0]?.code || 'No code generated'}\n\`\`\`\n\n` +
                          `🌐 Live Preview: ${data.deploymentUrl || 'Not available'}\n` +
                          `💬 V0 Chat: ${data.projectUrl || 'Not available'}\n\n` +
                          `🎨 V0 AI has created your component!`,
                  },
                ],
              },
            });
          } else {
            this.sendMessage({
              jsonrpc: '2.0',
              id: message.id,
              error: {
                code: -1,
                message: result.error?.message || 'Failed to generate component',
              },
            });
          }
          break;
        }

        case 'v0_continue': {
          const { chatId, message: msg } = args;
          
          console.error('🔄 MCP V0 Continue:', { chatId, message: msg });
          
          // Call the REST API server
          const response = await fetch('http://localhost:3001/tools/v0.continue', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chatId,
              message: msg,
            }),
          });

          const result = await response.json();

          if (result.success) {
            const data = result.data;
            this.sendMessage({
              jsonrpc: '2.0',
              id: message.id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: `✅ Conversation continued successfully!\n\n` +
                          `📝 Updated Code:\n\`\`\`tsx\n${data.components?.[0]?.code || 'No code generated'}\n\`\`\`\n\n` +
                          `🌐 Live Preview: ${data.deploymentUrl || 'Not available'}\n` +
                          `💬 V0 Chat: ${data.projectUrl || 'Not available'}`,
                  },
                ],
              },
            });
          } else {
            this.sendMessage({
              jsonrpc: '2.0',
              id: message.id,
              error: {
                code: -1,
                message: result.error?.message || 'Failed to continue conversation',
              },
            });
          }
          break;
        }

        default:
          this.sendMessage({
            jsonrpc: '2.0',
            id: message.id,
            error: {
              code: -1,
              message: `Unknown tool: ${name}`,
            },
          });
      }
    } catch (error) {
      console.error('❌ MCP Tool error:', error);
      this.sendMessage({
        jsonrpc: '2.0',
        id: message.id,
        error: {
          code: -1,
          message: error.message || 'Unknown error',
        },
      });
    }
  }

  start() {
    console.error('🚀 Simple MCP Server started');
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    rl.on('line', (line) => {
      this.handleMessage(line);
    });

    rl.on('close', () => {
      console.error('MCP Server stopped');
    });
  }
}

// Start the server
const server = new SimpleMCPServer();
server.start(); 