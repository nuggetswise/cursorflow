#!/usr/bin/env node

/**
 * Test MCP Server Connection
 * 
 * This script tests if the MCP server is working and can be reached.
 */

const { spawn } = require('child_process');
const path = require('path');

async function testMCPConnection() {
  console.log('🧪 Testing MCP Server Connection...\n');
  
  try {
    // Start the MCP server
    const mcpServer = spawn('node', ['packages/nw-mcp/dist/mcp-server.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd()
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
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test if server is responding
    if (serverOutput.includes('Nuggetwise MCP Server started')) {
      console.log('✅ MCP Server started successfully!');
      
      // Try to send a simple MCP request
      const testRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
      };
      
      console.log('📤 Sending test request:', JSON.stringify(testRequest, null, 2));
      mcpServer.stdin.write(JSON.stringify(testRequest) + '\n');
      
      // Wait for response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (serverOutput.includes('v0_generate') || serverOutput.includes('tools')) {
        console.log('✅ MCP Server is responding to requests!');
        console.log('🛠️ Available tools detected');
      } else {
        console.log('⚠️ MCP Server started but not responding to requests');
      }
    } else {
      console.log('❌ MCP Server failed to start properly');
      console.log('📋 Server Output:', serverOutput);
      console.log('❌ Server Error:', serverError);
    }
    
    // Stop the server
    mcpServer.kill();
    
    console.log('\n🎉 MCP Server connection test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testMCPConnection(); 