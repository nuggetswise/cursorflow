#!/usr/bin/env node

const { V0Client } = require('../packages/nw-mcp/dist/services/V0Client');

// Simple component generator script
async function generateComponent() {
  const prompt = process.argv[2];
  
  if (!prompt) {
    console.log('🚀 Usage: node scripts/generate-component.js "your component description"');
    console.log('📝 Example: node scripts/generate-component.js "login form with email and password"');
    process.exit(1);
  }

  const config = {
    v0ApiKey: process.env.V0_API_KEY,
    cursorWorkspacePath: process.cwd(),
    budget: {
      maxCost: 10,
      maxTime: 30000,
      maxRetries: 3,
      costPerToken: 0.0001
    },
    mode: 'development'
  };

  try {
    console.log('🎨 Generating component:', prompt);
    
    const v0Client = new V0Client(config);
    const result = await v0Client.generateComponents(prompt, {
      saveToWorkspace: true,
      modelId: 'v0-1.5-sm'
    });

    console.log('✅ Component generated successfully!');
    console.log('📁 Files auto-saved to: frontend/src/components/');
    console.log('🔗 Preview:', result.deploymentUrl);
    console.log('💬 Chat:', result.projectUrl);
    
    if (result.files && result.files.length > 0) {
      console.log('📄 Generated files:');
      result.files.forEach(file => {
        console.log(`  - ${file.name}`);
      });
    }

  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    process.exit(1);
  }
}

generateComponent(); 