#!/usr/bin/env node

/**
 * Simple MCP Server Test
 * 
 * This script tests if the MCP server can start and respond to basic requests.
 */

const { spawn } = require('child_process');
const path = require('path');

async function testMCPServer() {
  console.log('🧪 Testing MCP Server Startup...\n');
  
  try {
    // Start the MCP server
    const mcpServer = spawn('node', ['packages/nw-mcp/dist/mcp-server.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd(),
      env: {
        ...process.env,
        V0_API_KEY: 'v1:qt5y5M4jsKNedp3U50FTPCB4:XitMdXVldFLzmmpl4tKdV07c',
        NODE_ENV: 'development'
      }
    });
    
    let serverOutput = '';
    let serverError = '';
    
    // Collect server output
    mcpServer.stdout.on('data', (data) => {
      serverOutput += data.toString();
      console.log('📤 Server Output:', data.toString());
    });
    
    mcpServer.stderr.on('data', (data) => {
      serverError += data.toString();
      console.log('❌ Server Error:', data.toString());
    });
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Send a simple initialization request
    const initRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      }
    };
    
    console.log('📤 Sending initialization request...');
    mcpServer.stdin.write(JSON.stringify(initRequest) + '\n');
    
    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    if (serverOutput.includes('"jsonrpc"') || serverOutput.includes('"result"')) {
      console.log('✅ MCP Server is responding to requests!');
    } else {
      console.log('⚠️ MCP Server started but not responding properly');
      console.log('📋 Server Output:', serverOutput);
      console.log('❌ Server Error:', serverError);
    }
    
    // Stop the server
    mcpServer.kill();
    
    console.log('\n🎉 MCP Server test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testMCPServer(); 