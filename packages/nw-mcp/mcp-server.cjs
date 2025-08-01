#!/usr/bin/env node

const { createClient } = require('v0-sdk');
const fs = require('fs');
const path = require('path');

// V0 API key
const V0_API_KEY = process.env.V0_API_KEY;

// Initialize V0 client
const v0Client = createClient({
  apiKey: V0_API_KEY,
});

// Simple MCP server implementation
class SimpleMCPServer {
  constructor() {
    this.requestId = 0;
  }

  // Send JSON-RPC response
  sendResponse(id, result, error = null) {
    const response = {
      jsonrpc: '2.0',
      id: id,
    };
    
    if (error) {
      response.error = error;
    } else {
      response.result = result;
    }
    
    console.log(JSON.stringify(response));
  }

  // Handle initialization
  handleInitialize(params) {
    return {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {},
        prompts: {}
      },
      serverInfo: {
        name: 'nuggetwise-v0-simple',
        version: '1.0.0'
      }
    };
  }

  // Handle tools list
  handleListTools() {
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
              }
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
        }
      ]
    };
  }

  // Handle prompts list
  handleListPrompts() {
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
  }

  // Handle tool calls
  async handleCallTool(name, args) {
    try {
      switch (name) {
        case 'generate': {
          const { prompt } = args;
          
          const result = await v0Client.chats.create({
            system: 'You are an expert React developer. Generate clean, modern, accessible components.',
            message: prompt,
            modelConfiguration: {
              modelId: 'v0-1.5-sm',
              imageGenerations: false,
              thinking: false,
            },
          });

          const files = result.latestVersion?.files || [];
          const components = files.map((file, index) => ({
            name: file.name || `Component${index + 1}`,
            code: file.content || '',
            preview: result.latestVersion?.demoUrl || `https://v0.dev/chat/${result.id}`,
          }));

          // Auto-save files to project structure
          let fileInfo = '';
          if (files.length > 0) {
            try {
              const workspacePath = process.env.CURSOR_WORKSPACE_PATH || process.cwd();
              const targetDir = path.join(workspacePath, 'frontend', 'src', 'components');
              
              // Create components directory if it doesn't exist
              if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
              }

              console.error(`📁 Auto-saving ${files.length} files to: ${targetDir}`);

              for (const file of files) {
                if (file.content) {
                  // Generate a clean filename
                  let fileName = file.name || 'Component';
                  
                  // Ensure .tsx extension
                  if (!fileName.endsWith('.tsx') && !fileName.endsWith('.ts')) {
                    fileName += '.tsx';
                  }
                  
                  // Clean up filename (remove special characters, ensure PascalCase)
                  fileName = fileName
                    .replace(/[^a-zA-Z0-9.-]/g, '')
                    .replace(/^([a-z])/, (match) => match.toUpperCase());

                  const filePath = path.join(targetDir, fileName);
                  
                  // Write the file
                  fs.writeFileSync(filePath, file.content, 'utf-8');
                  console.error(`✅ Auto-saved: ${fileName}`);
                }
              }

              fileInfo = `\n\n📁 Files auto-saved to: frontend/src/components/`;
              for (const file of files) {
                fileInfo += `\n  - ${file.name}`;
              }
              console.error(`🎉 Successfully auto-saved ${files.length} component(s) to your project!`);

            } catch (error) {
              console.error('❌ Failed to auto-save files to project:', error);
              fileInfo = '\n\n⚠️ Auto-save failed, but component was generated successfully.';
            }
          }

          return {
            content: [
              {
                type: 'text',
                text: `✅ Component generated successfully!\n\n` +
                      `📝 Generated Code:\n\`\`\`tsx\n${components[0]?.code || 'No code generated'}\n\`\`\`\n\n` +
                      `🌐 Live Preview: ${result.latestVersion?.demoUrl || 'Not available'}\n` +
                      `💬 V0 Chat: ${result.url || 'Not available'}${fileInfo}\n\n` +
                      `🎨 V0 AI has created your component!`,
              },
            ],
          };
        }

        case 'v0_continue': {
          const { chatId, message } = args;
          
          const result = await v0Client.chats.sendMessage({
            chatId,
            message
          });

          const files = result.latestVersion?.files || [];
          const components = files.map((file, index) => ({
            name: file.name || `Component${index + 1}`,
            code: file.content || '',
            preview: result.latestVersion?.demoUrl || `https://v0.dev/chat/${result.id}`,
          }));

          return {
            content: [
              {
                type: 'text',
                text: `✅ Conversation continued successfully!\n\n` +
                      `📝 Updated Code:\n\`\`\`tsx\n${components[0]?.code || 'No code generated'}\n\`\`\`\n\n` +
                      `🌐 Live Preview: ${result.latestVersion?.demoUrl || 'Not available'}\n` +
                      `💬 V0 Chat: ${result.url || 'Not available'}`,
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      throw new Error(`Tool execution failed: ${error.message}`);
    }
  }

  // Main request handler
  async handleRequest(request) {
    const { id, method, params } = request;

    try {
      switch (method) {
        case 'initialize':
          this.sendResponse(id, this.handleInitialize(params));
          break;

        case 'tools/list':
          this.sendResponse(id, this.handleListTools());
          break;

        case 'prompts/list':
          this.sendResponse(id, this.handleListPrompts());
          break;

        case 'tools/call':
          const result = await this.handleCallTool(params.name, params.arguments);
          this.sendResponse(id, result);
          break;

        default:
          this.sendResponse(id, null, {
            code: -32601,
            message: `Method not found: ${method}`
          });
      }
    } catch (error) {
      this.sendResponse(id, null, {
        code: -32603,
        message: error.message
      });
    }
  }

  // Start the server
  start() {
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', async (data) => {
      const lines = data.toString().trim().split('\n');
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const request = JSON.parse(line);
            await this.handleRequest(request);
          } catch (error) {
            console.error('Error parsing request:', error);
          }
        }
      }
    });

    process.stdin.on('end', () => {
      process.exit(0);
    });
  }
}

// Start the server
const server = new SimpleMCPServer();
server.start(); 