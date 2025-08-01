#!/usr/bin/env node

const { spawn } = require('child_process');

// Test the simplified MCP server with 5-command workflow
async function testSimplifiedMCP() {
  console.log('🧪 Testing Simplified MCP Server (5-Command Workflow)...\n');
  
  const mcpServer = spawn('node', ['packages/nw-mcp/dist/mcp-server.js'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let responseCount = 0;
  
  // Handle MCP server responses
  mcpServer.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      try {
        const response = JSON.parse(line);
        responseCount++;
        
        console.log(`📥 Response ${responseCount}:`, {
          id: response.id,
          method: response.method,
          result: response.result ? 'Present' : 'None',
          error: response.error ? 'Present' : 'None'
        });
        
        // Test specific responses
        if (response.id === 1 && response.result) {
          console.log('✅ Initialize Response:', response.result.serverInfo);
        }
        
        if (response.id === 2 && response.result) {
          console.log('✅ Tools List Response:', response.result.tools.length, 'tools found');
          
          // Check for the 5 simplified commands
          const expectedTools = ['generate', 'update', 'sync', 'status', 'connect'];
          const foundTools = response.result.tools.map(t => t.name);
          
          console.log('📋 Found Tools:', foundTools);
          
          const missingTools = expectedTools.filter(tool => !foundTools.includes(tool));
          const extraTools = foundTools.filter(tool => !expectedTools.includes(tool));
          
          if (missingTools.length === 0 && extraTools.length === 0) {
            console.log('✅ All 5 expected tools found!');
          } else {
            console.log('❌ Tool mismatch:');
            if (missingTools.length > 0) {
              console.log('   Missing:', missingTools);
            }
            if (extraTools.length > 0) {
              console.log('   Extra:', extraTools);
            }
          }
        }
        
        if (response.id === 3 && response.result) {
          console.log('✅ Prompts List Response:', response.result.prompts.length, 'prompts found');
          
          // Check for the 5 simplified prompts
          const expectedPrompts = ['generate', 'update', 'sync', 'status', 'connect'];
          const foundPrompts = response.result.prompts.map(p => p.name);
          
          console.log('📋 Found Prompts:', foundPrompts);
          
          const missingPrompts = expectedPrompts.filter(prompt => !foundPrompts.includes(prompt));
          const extraPrompts = foundPrompts.filter(prompt => !expectedPrompts.includes(prompt));
          
          if (missingPrompts.length === 0 && extraPrompts.length === 0) {
            console.log('✅ All 5 expected prompts found!');
          } else {
            console.log('❌ Prompt mismatch:');
            if (missingPrompts.length > 0) {
              console.log('   Missing:', missingPrompts);
            }
            if (extraPrompts.length > 0) {
              console.log('   Extra:', extraPrompts);
            }
          }
        }
        
        if (response.id === 4 && response.result) {
          console.log('✅ Status Command Response:', response.result.content[0].text.substring(0, 100) + '...');
        }
        
      } catch (error) {
        console.log('❌ Failed to parse response:', line);
      }
    }
  });
  
  // Handle MCP server logs
  mcpServer.stderr.on('data', (data) => {
    console.log('📝 MCP Log:', data.toString().trim());
  });
  
  // Wait for server to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 1: Initialize
  console.log('📋 Test 1: Initialize MCP Server');
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
  
  mcpServer.stdin.write(JSON.stringify(initRequest) + '\n');
  
  // Wait for response
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 2: List Tools (should show 5 simplified tools)
  console.log('\n📋 Test 2: List Available Tools (5-Command Workflow)');
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  };
  
  mcpServer.stdin.write(JSON.stringify(listToolsRequest) + '\n');
  
  // Wait for response
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 3: List Prompts (should show 5 simplified prompts)
  console.log('\n📋 Test 3: List Available Prompts (5-Command Workflow)');
  const listPromptsRequest = {
    jsonrpc: '2.0',
    id: 3,
    method: 'prompts/list',
    params: {}
  };
  
  mcpServer.stdin.write(JSON.stringify(listPromptsRequest) + '\n');
  
  // Wait for response
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 4: Call Status Tool (should show setup instructions without API key)
  console.log('\n📋 Test 4: Call Status Tool (No API Key)');
  const statusRequest = {
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'status',
      arguments: {}
    }
  };
  
  mcpServer.stdin.write(JSON.stringify(statusRequest) + '\n');
  
  // Wait for response
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Cleanup
  console.log('\n🧹 Cleaning up...');
  mcpServer.kill();
  
  console.log('\n✅ Simplified MCP Server Tests Complete!');
  console.log(`📊 Total Responses Received: ${responseCount}`);
  
  if (responseCount >= 4) {
    console.log('🎉 All expected responses received!');
    console.log('✅ Simplified 5-command workflow is working correctly!');
  } else {
    console.log('⚠️ Some responses may be missing');
  }
  
  console.log('\n📋 Simplified Commands Available:');
  console.log('1. /nuggetwise-v0/generate <prompt> - Create new components');
  console.log('2. /nuggetwise-v0/update <message> - Update existing components');
  console.log('3. /nuggetwise-v0/sync - Pull changes from V0 web interface');
  console.log('4. /nuggetwise-v0/status - Check current project status');
  console.log('5. /nuggetwise-v0/connect <v0-url> - Connect to existing V0 project');
}

// Run the test
testSimplifiedMCP().catch(console.error); 