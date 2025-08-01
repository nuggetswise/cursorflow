#!/usr/bin/env node

import { createClient } from 'v0-sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testV0API() {
  console.log('🧪 Testing V0 API response structure...');
  
  if (!process.env.V0_API_KEY) {
    console.error('❌ V0_API_KEY not found in environment');
    process.exit(1);
  }

  const v0Client = createClient({
    apiKey: process.env.V0_API_KEY,
  });

  try {
    console.log('📡 Calling V0 API with complex prompt...');
    
    const result = await v0Client.chats.create({
      system: 'You are an expert React developer. Generate clean, modern, accessible components.',
      message: 'Create a login form with email and password fields, a submit button, and inbox with tags like gmail has and proper styling',
      modelConfiguration: {
        modelId: 'v0-1.5-sm',
        imageGenerations: false,
        thinking: false,
      },
    });

    console.log('✅ V0 API call successful!');
    console.log('📊 Response structure:');
    console.log('  - chatId:', result.id);
    console.log('  - has latestVersion:', !!result.latestVersion);
    
    if (result.latestVersion) {
      console.log('  - has files:', !!result.latestVersion.files);
      console.log('  - files length:', result.latestVersion.files?.length || 0);
      console.log('  - has demoUrl:', !!result.latestVersion.demoUrl);
      console.log('  - demoUrl:', result.latestVersion.demoUrl);
      
      if (result.latestVersion.files && result.latestVersion.files.length > 0) {
        console.log('  - File names:');
        result.latestVersion.files.forEach((file, index) => {
          console.log(`    ${index + 1}. ${file.name} (${file.content?.length || 0} chars)`);
          console.log(`       Content preview: ${file.content?.substring(0, 100)}...`);
          console.log(`       File structure:`, Object.keys(file));
        });
      }
    }
    
    console.log('  - has url:', !!result.url);
    console.log('  - url:', result.url);
    
    // Test continuing the conversation
    console.log('\n🔄 Testing conversation continuation...');
    
    const updateResult = await v0Client.chats.sendMessage({
      chatId: result.id,
      message: 'Add a dark mode toggle button to the login form'
    });

    console.log('✅ V0 API update successful!');
    console.log('📊 Update response structure:');
    console.log('  - chatId:', updateResult.id);
    console.log('  - has latestVersion:', !!updateResult.latestVersion);
    
    if (updateResult.latestVersion) {
      console.log('  - has files:', !!updateResult.latestVersion.files);
      console.log('  - files length:', updateResult.latestVersion.files?.length || 0);
      console.log('  - has demoUrl:', !!updateResult.latestVersion.demoUrl);
      console.log('  - demoUrl:', updateResult.latestVersion.demoUrl);
      
      if (updateResult.latestVersion.files && updateResult.latestVersion.files.length > 0) {
        console.log('  - Updated file names:');
        updateResult.latestVersion.files.forEach((file, index) => {
          console.log(`    ${index + 1}. ${file.name} (${file.content?.length || 0} chars)`);
          console.log(`       Content preview: ${file.content?.substring(0, 100)}...`);
          console.log(`       File structure:`, Object.keys(file));
        });
      }
    }
    
    console.log('  - has url:', !!updateResult.url);
    console.log('  - url:', updateResult.url);
    
    // Log the full response structure for analysis
    console.log('\n🔍 Full response keys:', Object.keys(result));
    if (result.latestVersion) {
      console.log('🔍 latestVersion keys:', Object.keys(result.latestVersion));
    }
    
  } catch (error) {
    console.error('❌ V0 API error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testV0API(); 