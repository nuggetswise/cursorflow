#!/usr/bin/env node

/**
 * Simple MCP Server for V0 Integration
 * 
 * This is a simplified version that should work reliably with Cursor IDE.
 */

const { spawn } = require('child_process');
const path = require('path');

// Simple V0 client
class SimpleV0Client {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://v0.dev/api';
  }

  async generateComponent(prompt) {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          prompt: prompt,
          model: 'v0-1.5-sm'
        })
      });

      if (!response.ok) {
        throw new Error(`V0 API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        component: data.component,
        message: 'Component generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// MCP Server
class SimpleMCPServer {
  constructor() {
    this.v0Client = new SimpleV0Client(process.env.V0_API_KEY || 'v1:qt5y5M4jsKNedp3U50FTPCB4:XitMdXVldFLzmmpl4tKdV07c');
    this.requestId = 1;
  }

  // Send JSON-RPC response
  sendResponse(id, result, error = null) {
    const response = {
      jsonrpc: '2.0',
      id: id
    };

    if (error) {
      response.error = error;
    } else {
      response.result = result;
    }

    console.log(JSON.stringify(response));
  }

  // Handle initialize request
  handleInitialize(request) {
    this.sendResponse(request.id, {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {}
      },
      serverInfo: {
        name: 'nuggetwise-v0-simple',
        version: '1.0.0'
      }
    });
  }

  // Handle tools/list request
  handleListTools(request) {
    this.sendResponse(request.id, {
      tools: [
        {
          name: 'v0_generate',
          description: 'Generate React components using V0 AI',
          inputSchema: {
            type: 'object',
            properties: {
              prompt: {
                type: 'string',
                description: 'The prompt describing the component to generate'
              }
            },
            required: ['prompt']
          }
        }
      ]
    });
  }

  // Handle tools/call request
  async handleCallTool(request) {
    const { name, arguments: args } = request.params;

    if (name === 'v0_generate') {
      try {
        const result = await this.v0Client.generateComponent(args.prompt);
        
        if (result.success) {
          this.sendResponse(request.id, {
            content: [
              {
                type: 'text',
                text: `✅ Component generated successfully!\n\n${result.component}`
              }
            ]
          });
        } else {
          this.sendResponse(request.id, null, {
            code: -32603,
            message: `Failed to generate component: ${result.error}`
          });
        }
      } catch (error) {
        this.sendResponse(request.id, null, {
          code: -32603,
          message: `Error generating component: ${error.message}`
        });
      }
    } else {
      this.sendResponse(request.id, null, {
        code: -32601,
        message: `Unknown tool: ${name}`
      });
    }
  }

  // Main request handler
  async handleRequest(line) {
    try {
      const request = JSON.parse(line);
      
      switch (request.method) {
        case 'initialize':
          this.handleInitialize(request);
          break;
        case 'tools/list':
          this.handleListTools(request);
          break;
        case 'tools/call':
          await this.handleCallTool(request);
          break;
        default:
          this.sendResponse(request.id, null, {
            code: -32601,
            message: `Unknown method: ${request.method}`
          });
      }
    } catch (error) {
      this.sendResponse(this.requestId++, null, {
        code: -32700,
        message: `Parse error: ${error.message}`
      });
    }
  }

  // Start the server
  start() {
    // Set up stdin/stdout handling
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', (chunk) => {
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.trim()) {
          this.handleRequest(line);
        }
      }
    });

    process.stdin.on('end', () => {
      process.exit(0);
    });

    // Handle process termination
    process.on('SIGINT', () => {
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      process.exit(0);
    });
  }
}

// Start the server
const server = new SimpleMCPServer();
server.start(); 