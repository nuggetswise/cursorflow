import { V0Response, Component } from '../types';
import { EnvironmentConfig } from '../types';
import { createClient } from 'v0-sdk';
import pRetry from 'p-retry';

export class V0Client {
  private config: EnvironmentConfig;
  private v0Client: any;

  constructor(config: EnvironmentConfig) {
    this.config = config;
    
    console.log('🔧 V0Client config:', {
      hasV0ApiKey: !!config.v0ApiKey,
      v0ApiKeyLength: config.v0ApiKey?.length || 0,
      mode: config.mode
    });
    
    if (!config.v0ApiKey) {
      console.warn('⚠️ V0_API_KEY not provided. V0 integration will be limited.');
    } else {
      this.v0Client = createClient({
        apiKey: config.v0ApiKey,
      });
      console.log('✅ V0 client initialized successfully');
    }
  }

  async generateComponents(prompt: string, options: any = {}): Promise<V0Response> {
    const startTime = Date.now();

    try {
      console.log('🚀 Generating components with V0 SDK...');

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

      const duration = Date.now() - startTime;
      console.log(`✅ V0 generation completed in ${duration}ms`);

      return response;

    } catch (error) {
      console.error('❌ V0 generation failed:', error);
      throw new Error(`V0 generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async callV0API(prompt: string, options: any = {}): Promise<V0Response> {
    try {
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
      
      // Transform V0 response to our format
      const components: Component[] = files.map((file: any, index: number) => ({
        name: file.name || `Component${index + 1}`,
        code: file.content || '',
        preview: result.latestVersion?.demoUrl || `https://v0.dev/chat/${chatId}`,
        templateId: 'default',
        props: {},
        milestone: index + 1
      }));

      return {
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
      console.log('🔄 Continuing V0 conversation...');
      
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
      console.log(`📦 Exporting project ${chatId}...`);

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
} 