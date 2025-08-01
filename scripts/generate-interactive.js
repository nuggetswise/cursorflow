#!/usr/bin/env node

const { V0Client } = require('../packages/nw-mcp/dist/services/V0Client');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function generateInteractive() {
  console.log('🎨 V0 Component Generator');
  console.log('========================\n');

  try {
    const prompt = await askQuestion('Describe the component you want to create: ');
    
    if (!prompt.trim()) {
      console.log('❌ No description provided. Exiting...');
      rl.close();
      return;
    }

    console.log('\n🚀 Generating component...');
    
    const v0Client = new V0Client(config);
    const result = await v0Client.generateComponents(prompt, {
      saveToWorkspace: true,
      modelId: 'v0-1.5-sm'
    });

    console.log('\n✅ Component generated successfully!');
    console.log('📁 Files auto-saved to: frontend/src/components/');
    console.log('🔗 Preview:', result.deploymentUrl);
    
    if (result.files && result.files.length > 0) {
      console.log('\n📄 Generated files:');
      result.files.forEach(file => {
        console.log(`  - ${file.name}`);
      });
    }

    const continueGenerating = await askQuestion('\nGenerate another component? (y/n): ');
    
    if (continueGenerating.toLowerCase() === 'y' || continueGenerating.toLowerCase() === 'yes') {
      console.log('\n' + '='.repeat(50) + '\n');
      await generateInteractive();
    } else {
      console.log('👋 Happy coding!');
      rl.close();
    }

  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    rl.close();
  }
}

generateInteractive(); 