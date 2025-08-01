#!/usr/bin/env node

import { V0Client } from './packages/nw-mcp/dist/services/V0Client.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  v0ApiKey: process.env.V0_API_KEY || '',
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
  cursorWorkspacePath: process.env.CURSOR_WORKSPACE_PATH || process.cwd(),
  budget: {
    maxCost: parseFloat(process.env.MAX_COST || '10.0'),
    maxTime: parseInt(process.env.MAX_TIME || '300000'),
    maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
    costPerToken: parseFloat(process.env.COST_PER_TOKEN || '0.00003'),
  },
  mode: process.env.NODE_ENV || 'development',
};

async function testV0Client() {
  console.log('🧪 Testing V0Client...');
  
  const v0Client = new V0Client(config);
  
  try {
    const result = await v0Client.generateComponents('Create a simple red button', {
      modelId: 'v0-1.5-sm',
      saveToWorkspace: true
    });
    
    console.log('✅ V0 generation successful!');
    console.log('📊 Result structure:', {
      hasFiles: !!result.files,
      filesLength: result.files?.length || 0,
      hasComponents: !!result.components,
      componentsLength: result.components?.length || 0,
      chatId: result.chatId,
      projectUrl: result.projectUrl,
      deploymentUrl: result.deploymentUrl
    });
    
    if (result.files && result.files.length > 0) {
      console.log('📁 Files returned:');
      result.files.forEach((file, index) => {
        console.log(`  ${index + 1}. ${file.name} (${file.content?.length || 0} chars)`);
      });
    } else {
      console.log('⚠️ No files returned from V0 API');
    }
    
    if (result.components && result.components.length > 0) {
      console.log('🎨 Components returned:');
      result.components.forEach((component, index) => {
        console.log(`  ${index + 1}. ${component.name} (${component.code?.length || 0} chars)`);
      });
    } else {
      console.log('⚠️ No components returned from V0 API');
    }
    
  } catch (error) {
    console.error('❌ V0Client test failed:', error);
  }
}

testV0Client(); 