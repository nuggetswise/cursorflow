#!/usr/bin/env node

/**
 * MCP Install Link Generator
 * 
 * This script generates a Cursor MCP install link for the V0 integration
 * following the official Cursor MCP deeplink format.
 * 
 * Usage: node scripts/generate-mcp-link.js
 */

const fs = require('fs');
const path = require('path');

// MCP Server Configuration
const MCP_CONFIG = {
  "nuggetwise-v0": {
    "command": "node",
    "args": ["${workspaceFolder}/packages/nw-mcp/dist/mcp-server.js"],
    "env": {
      "NODE_ENV": "development",
      "V0_API_KEY": "${env:V0_API_KEY}",
      "OPENAI_API_KEY": "${env:OPENAI_API_KEY}"
    }
  }
};

// Cursor MCP Install Link Format
const CURSOR_MCP_BASE = "cursor://anysphere.cursor-deeplink/mcp/install";

function generateInstallLink() {
  try {
    console.log('🚀 Generating Cursor MCP Install Link...\n');
    
    // Convert config to JSON string
    const configJson = JSON.stringify(MCP_CONFIG, null, 2);
    
    // Base64 encode the configuration
    const configBase64 = Buffer.from(configJson).toString('base64');
    
    // Generate the install link
    const installLink = `${CURSOR_MCP_BASE}?name=nuggetwise-v0&config=${configBase64}`;
    
    // Create the output
    const output = {
      installLink,
      configJson,
      configBase64,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
    
    // Display the results
    console.log('✅ MCP Install Link Generated Successfully!\n');
    console.log('🔗 Install Link:');
    console.log(installLink);
    console.log('\n📋 Configuration:');
    console.log(configJson);
    console.log('\n🔧 Base64 Config:');
    console.log(configBase64);
    
    // Save to file
    const outputPath = path.join(__dirname, '../mcp-install-link.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`\n💾 Saved to: ${outputPath}`);
    
    // Generate markdown for README
    generateMarkdownOutput(output);
    
    return output;
    
  } catch (error) {
    console.error('❌ Error generating MCP install link:', error.message);
    process.exit(1);
  }
}

function generateMarkdownOutput(output) {
  const markdown = `# Cursor MCP Install Link

Generated on: ${output.timestamp}
Version: ${output.version}

## 🚀 Quick Install

Click the button below to install the V0 MCP server in Cursor:

[![Add to Cursor](https://img.shields.io/badge/Add_to_Cursor-Install_V0_MCP_Server-blue?style=for-the-badge&logo=cursor)](${output.installLink})

## 📋 Manual Installation

If the button doesn't work, copy and paste this link into your browser:

\`\`\`
${output.installLink}
\`\`\`

## 🔧 Configuration

\`\`\`json
${output.configJson}
\`\`\`

## 📝 Usage

After installation, you can use the V0 MCP server in Cursor:

\`\`\`
@nuggetwise-v0 v0_generate "Create a green dot on white screen"
@nuggetwise-v0 v0_continue "Make the dot bigger"
@nuggetwise-v0 v0_get_project_status
\`\`\`

## 🛠️ Prerequisites

- Cursor IDE (latest version)
- V0 API Key (get from [v0.dev](https://v0.dev))
- Node.js 18+ (for server functionality)

## 📚 Documentation

- [Complete Setup Guide](../implementation-plan/dev-implementation/NUGGETWISE_BUILDER.md)
- [API Reference](../implementation-plan/dev-implementation/API_SPECS.md)
- [Architecture Overview](../implementation-plan/dev-implementation/HYBRID_ARCHITECTURE.md)
`;

  const markdownPath = path.join(__dirname, '../MCP_INSTALL_LINK.md');
  fs.writeFileSync(markdownPath, markdown);
  console.log(`📝 Generated markdown: ${markdownPath}`);
}

// Generate badges for README
function generateBadges() {
  const badges = [
    '![Add to Cursor](https://img.shields.io/badge/Add_to_Cursor-Install_V0_MCP_Server-blue?style=for-the-badge&logo=cursor)',
    '![MCP Server](https://img.shields.io/badge/MCP_Server-V0_Integration-green?style=for-the-badge)',
    '![V0 Integration](https://img.shields.io/badge/V0_Integration-AI_Generated_UI-orange?style=for-the-badge)',
    '![Cursor IDE](https://img.shields.io/badge/Cursor_IDE-Native_Integration-purple?style=for-the-badge)'
  ];
  
  console.log('\n🛡️ Badges for README:');
  badges.forEach(badge => console.log(badge));
}

// Main execution
if (require.main === module) {
  const result = generateInstallLink();
  generateBadges();
  
  console.log('\n🎉 MCP Install Link Generation Complete!');
  console.log('\n📖 Next Steps:');
  console.log('1. Test the install link in Cursor IDE');
  console.log('2. Update README.md with the generated badges');
  console.log('3. Share the install link with users');
  console.log('4. Monitor installation analytics');
}

module.exports = { generateInstallLink, generateMarkdownOutput, generateBadges }; 