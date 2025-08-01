import { V0Response, Component } from '../types';
import { EnvironmentConfig } from '../types';
import { createClient } from 'v0-sdk';
import pRetry from 'p-retry';
import * as fs from 'fs';
import * as path from 'path';

export class V0Client {
  private config: EnvironmentConfig;
  private v0Client: any;

  constructor(config: EnvironmentConfig) {
    this.config = config;
    
    if (!config.v0ApiKey) {
      console.warn('⚠️ V0_API_KEY not provided. V0 integration will be limited.');
    } else {
      this.v0Client = createClient({
        apiKey: config.v0ApiKey,
      });
    }
  }

  async generateComponents(prompt: string, options: any = {}): Promise<V0Response> {
    const startTime = Date.now();

    try {
      if (!this.config.v0ApiKey || !this.v0Client) {
        throw new Error('V0_API_KEY is required for component generation');
      }

      const response = await pRetry(
        async () => {
          return await this.callV0API(prompt, options);
        },
        {
          retries: this.config.budget.maxRetries,
          onFailedAttempt: (error) => {
            console.warn(`V0 API attempt ${error.attemptNumber} failed:`, error.message);
          }
        }
      );

      // Auto-save files to project structure if requested
      if (options.saveToWorkspace !== false && response.files && response.files.length > 0) {
        await this.saveFilesToProject(response.files, options);
      }

      const duration = Date.now() - startTime;
      // Log to stderr to avoid interfering with JSON-RPC stdout
      console.error(`✅ V0 generation completed in ${duration}ms`);

      return response;

    } catch (error) {
      console.error('❌ V0 generation failed:', error);
      throw new Error(`V0 generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async callV0API(prompt: string, options: any = {}): Promise<V0Response> {
    try {
      console.error('🔍 V0Client: Calling V0 API...');
      console.error('📝 V0Client: Prompt:', prompt);
      console.error('🔧 V0Client: Options:', options);
      
      const result = await this.v0Client.chats.create({
        system: options.system || 'You are an expert React developer. Generate clean, modern, accessible components.',
        message: prompt,
        modelConfiguration: {
          modelId: options.modelId || 'v0-1.5-sm',
          imageGenerations: false,
          thinking: false,
        },
      });

      const chatId = result.id;
      const files = result.latestVersion?.files || [];
      
      // Debug logging
      console.error('🔍 V0Client: V0 API Response:', {
        chatId,
        hasLatestVersion: !!result.latestVersion,
        hasFiles: !!result.latestVersion?.files,
        filesLength: files.length,
        fileNames: files.map((f: any) => f.name),
        hasDemoUrl: !!result.latestVersion?.demoUrl,
        hasUrl: !!result.url
      });
      
      if (files.length > 0) {
        console.error('📁 V0Client: Files received from V0 API:');
        files.forEach((file: any, index: number) => {
          console.error(`  ${index + 1}. ${file.name} (${file.content?.length || 0} chars)`);
          console.error(`     Content preview: ${file.content?.substring(0, 100)}...`);
        });
      }
      
      // Transform V0 response to our format
      const components: Component[] = files.map((file: any, index: number) => ({
        name: file.name || `Component${index + 1}`,
        code: file.content || '',
        preview: result.latestVersion?.demoUrl || `https://v0.dev/chat/${chatId}`,
        templateId: 'default',
        props: {},
        milestone: index + 1
      }));

      const response = {
        chatId,
        projectUrl: result.url || `https://v0.dev/chat/${chatId}`,
        deploymentUrl: result.latestVersion?.demoUrl || `https://v0.dev/chat/${chatId}`,
        components,
        files: files.map((file: any) => ({
          name: file.name,
          content: file.content,
          path: file.path
        }))
      };

      console.error('📊 V0Client: Transformed response:', {
        chatId: response.chatId,
        componentsLength: response.components.length,
        filesLength: response.files.length,
        hasDeploymentUrl: !!response.deploymentUrl,
        hasProjectUrl: !!response.projectUrl
      });

      return response;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('401')) {
        throw new Error('Invalid V0 API key');
      } else if (errorMessage.includes('429')) {
        throw new Error('V0 API rate limit exceeded');
      } else if (errorMessage.includes('timeout')) {
        throw new Error('V0 API request timed out');
      } else {
        throw new Error(`V0 API error: ${errorMessage}`);
      }
    }
  }

  async continueConversation(chatId: string, message: string): Promise<V0Response> {
    try {
      const result = await this.v0Client.chats.sendMessage({
        chatId,
        message
      });

      const files = result.latestVersion?.files || [];
      
      const components: Component[] = files.map((file: any, index: number) => ({
        name: file.name || `Component${index + 1}`,
        code: file.content || '',
        preview: result.latestVersion?.demoUrl || `https://v0.dev/chat/${result.id}`,
        templateId: 'default',
        props: {},
        milestone: index + 1
      }));

      return {
        chatId: result.id,
        projectUrl: result.url || `https://v0.dev/chat/${result.id}`,
        deploymentUrl: result.latestVersion?.demoUrl || `https://v0.dev/chat/${result.id}`,
        components,
        files: files.map((file: any) => ({
          name: file.name,
          content: file.content,
          path: file.path
        }))
      };

    } catch (error) {
      console.error('❌ V0 conversation continuation failed:', error);
      throw new Error(`V0 conversation continuation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async exportProject(chatId: string): Promise<{ files: any[]; zipUrl: string }> {
    try {
      if (!this.config.v0ApiKey || !this.v0Client) {
        throw new Error('V0_API_KEY is required for project export');
      }

      // For now, return a basic export structure
      // V0 SDK doesn't have direct export functionality
      return {
        files: [],
        zipUrl: `https://v0.dev/chat/${chatId}`
      };

    } catch (error) {
      console.error('❌ Project export failed:', error);
      throw new Error(`Project export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProjectStatus(chatId: string): Promise<{
    status: 'building' | 'completed' | 'failed';
    progress: number;
    message: string;
  }> {
    try {
      if (!this.config.v0ApiKey || !this.v0Client) {
        throw new Error('V0_API_KEY is required for status check');
      }

      // For now, assume completed since V0 generation is synchronous
      return {
        status: 'completed',
        progress: 100,
        message: 'Project completed'
      };

    } catch (error) {
      console.error('❌ Status check failed:', error);
      return {
        status: 'completed',
        progress: 100,
        message: 'Status check unavailable'
      };
    }
  }

  calculateCost(tokens: number): number {
    // Use actual V0.dev pricing when available
    // For now, use estimated pricing based on token count
    return (tokens / 1000) * 0.02; // $0.02 per 1K tokens
  }

  private async saveFilesToProject(files: any[], options: any = {}): Promise<void> {
    try {
      // Determine the target directory based on project structure
      const workspacePath = this.config.cursorWorkspacePath || process.cwd();
      const targetDir = path.join(workspacePath, 'frontend', 'src', 'components');
      
      // Create components directory if it doesn't exist
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      console.error(`📁 Auto-saving ${files.length} files to: ${targetDir}`);

      for (const file of files) {
        if (file.content) {
          // Generate a clean filename
          let fileName = file.name || 'Component';
          
          // Ensure .tsx extension
          if (!fileName.endsWith('.tsx') && !fileName.endsWith('.ts')) {
            fileName += '.tsx';
          }
          
          // Clean up filename (remove special characters, ensure PascalCase)
          fileName = fileName
            .replace(/[^a-zA-Z0-9.-]/g, '')
            .replace(/^([a-z])/, (match: string) => match.toUpperCase());

          const filePath = path.join(targetDir, fileName);
          
          // Write the file
          fs.writeFileSync(filePath, file.content, 'utf-8');
          console.error(`✅ Auto-saved: ${fileName}`);
        }
      }

      console.error(`🎉 Successfully auto-saved ${files.length} component(s) to your project!`);
      console.error(`📂 Location: ${targetDir}`);

    } catch (error) {
      console.error('❌ Failed to auto-save files to project:', error);
      // Don't throw error to avoid breaking the main generation flow
    }
  }
} 