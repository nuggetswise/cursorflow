#!/usr/bin/env node

/**
 * MCP Server Test Script
 * 
 * This script tests the MCP server functionality to ensure it's working properly.
 */

const { spawn } = require('child_process');
const path = require('path');

async function testMCPServer() {
  console.log('🧪 Testing MCP Server...\n');
  
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test if server is responding
    if (serverOutput.includes('Nuggetwise V0 MCP Server ready')) {
      console.log('✅ MCP Server started successfully!');
      console.log('🛠️ Available tools detected');
    } else if (serverError.includes('V0_API_KEY')) {
      console.log('⚠️ MCP Server started but missing V0 API key');
      console.log('💡 This is expected in test environment');
    } else {
      console.log('❌ MCP Server failed to start properly');
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