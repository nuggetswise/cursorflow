#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the MCP configuration
const mcpConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../mcp-config.json'), 'utf8'));

// Convert to base64
const configString = JSON.stringify(mcpConfig);
const base64Config = Buffer.from(configString).toString('base64');

// Generate the install link
const installLink = `cursor://anysphere.cursor-deeplink/mcp/install?name=nuggetwise-v0&config=${base64Config}`;

console.log('🚀 V0 MCP Server Install Link');
console.log('================================');
console.log('');
console.log('Click this link to install the V0 MCP server in Cursor:');
console.log('');
console.log(installLink);
console.log('');
console.log('Or copy and paste this link in your browser:');
console.log('');
console.log(installLink);
console.log('');
console.log('📋 Configuration Details:');
console.log('========================');
console.log('Server Name: nuggetwise-v0');
console.log('Command: node');
console.log('Script: packages/nw-mcp/src/simple-mcp-server.js');
console.log('Environment Variables: V0_API_KEY, OPENAI_API_KEY');
console.log('');
console.log('✅ After installation, you can use:');
console.log('   @nuggetwise-v0 v0_generate "your prompt here"'); 