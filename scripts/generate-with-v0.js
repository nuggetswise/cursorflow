#!/usr/bin/env node

const { createClient } = require('v0-sdk');
const fs = require('fs-extra');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '../backend/.env') });

class V0Generator {
  constructor() {
    this.v0Client = createClient({
      apiKey: process.env.V0_API_KEY,
    });
    this.workspacePath = process.env.CURSOR_WORKSPACE_PATH || process.cwd();
  }

  async generateComponent(prompt, options = {}) {
    try {
      console.log('🚀 Generating component with V0...');
      console.log('📝 Prompt:', prompt);

      const result = await this.v0Client.chats.create({
        system: options.system || 'You are an expert React developer. Generate clean, modern, accessible components.',
        message: prompt,
        modelConfiguration: {
          modelId: options.modelId || 'v0-1.5-sm',
          imageGenerations: false,
          thinking: false,
        },
      });

      console.log('✅ V0 generation successful!');
      console.log('📄 Chat ID:', result.id);
      console.log('🔗 Preview URL:', result.latestVersion?.demoUrl);

      // Write files to workspace
      const files = result.latestVersion?.files || [];
      const savedFiles = [];

      if (files.length > 0) {
        console.log('📝 Writing files to workspace...');
        
        // Create a unique directory for this generation
        const timestamp = Date.now();
        const dirName = options.fileName 
          ? `${options.fileName}-${timestamp}`
          : `v0-generated-${timestamp}`;
        
        const dirPath = path.join(this.workspacePath, dirName);
        
        // Create directory if it doesn't exist
        await fs.ensureDir(dirPath);
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = file.name || `component-${i + 1}.tsx`;
          const filePath = path.join(dirPath, fileName);
          
          try {
            // Write file
            await fs.writeFile(filePath, file.content);
            savedFiles.push({
              name: file.name,
              path: filePath,
              content: file.content
            });
            
            console.log(`✅ Saved: ${fileName}`);
          } catch (error) {
            console.error(`❌ Failed to save file: ${fileName}`, error);
          }
        }
      }

      return {
        success: true,
        chatId: result.id,
        previewUrl: result.latestVersion?.demoUrl,
        chatUrl: result.url,
        files: savedFiles,
        totalFiles: files.length
      };

    } catch (error) {
      console.error('❌ V0 generation failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async continueConversation(chatId, message) {
    try {
      console.log('🔄 Continuing V0 conversation...');
      
      const result = await this.v0Client.chats.sendMessage({
        chatId,
        message
      });

      console.log('✅ Conversation continued successfully');
      
      return {
        success: true,
        chatId: result.id,
        previewUrl: result.latestVersion?.demoUrl,
        files: result.latestVersion?.files || []
      };

    } catch (error) {
      console.error('❌ Conversation continuation failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node generate-with-v0.js "<prompt>" [options]');
    console.log('Example: node generate-with-v0.js "Create a login form" --model v0-1.5-md --name login-form');
    process.exit(1);
  }

  const prompt = args[0];
  const options = {
    modelId: args.includes('--model') ? args[args.indexOf('--model') + 1] : 'v0-1.5-sm',
    fileName: args.includes('--name') ? args[args.indexOf('--name') + 1] : null,
    system: args.includes('--system') ? args[args.indexOf('--system') + 1] : null
  };

  const generator = new V0Generator();
  const result = await generator.generateComponent(prompt, options);

  if (result.success) {
    console.log('\n🎉 Generation completed successfully!');
    console.log('📂 Files saved to workspace');
    console.log('🌐 Preview:', result.previewUrl);
    console.log('💬 Chat:', result.chatUrl);
  } else {
    console.error('💥 Generation failed:', result.error);
    process.exit(1);
  }
}

// Export for use as module
module.exports = V0Generator;

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
} 