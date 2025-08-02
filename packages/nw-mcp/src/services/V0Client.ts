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

      // Validate prompt before attempting API calls
      if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        throw new Error('Prompt is required and cannot be empty');
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
        message: prompt.trim(),
        modelConfiguration: {
          modelId: options.modelId || 'v0-1.5-sm',
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
      // Validate inputs
      if (!chatId || typeof chatId !== 'string' || chatId.trim().length === 0) {
        throw new Error('Chat ID is required and cannot be empty');
      }
      
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        throw new Error('Message is required and cannot be empty');
      }
      
      const result = await this.v0Client.chats.sendMessage({
        chatId: chatId.trim(),
        message: message.trim()
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

  // V0 Project Management Methods
  async createProject(name: string, description?: string): Promise<{ id: string; name: string; webUrl: string }> {
    try {
      if (!this.config.v0ApiKey || !this.v0Client) {
        throw new Error('V0_API_KEY is required for project creation');
      }

      console.error(`🔧 V0Client: Creating project: ${name}`);
      
      const result = await this.v0Client.projects.create({
        name,
        description: description || `Project created via MCP: ${name}`,
      });

      console.error(`✅ V0Client: Project created: ${result.name} (ID: ${result.id})`);
      
      return {
        id: result.id,
        name: result.name,
        webUrl: result.webUrl,
      };
    } catch (error) {
      console.error('❌ Failed to create V0 project:', error);
      throw new Error(`Failed to create V0 project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findProjects(): Promise<Array<{ id: string; name: string; webUrl: string; createdAt: string }>> {
    try {
      if (!this.config.v0ApiKey || !this.v0Client) {
        throw new Error('V0_API_KEY is required for project listing');
      }

      console.error('🔍 V0Client: Finding projects...');
      
      const result = await this.v0Client.projects.find();
      
      console.error(`✅ V0Client: Found ${result.data?.length || 0} projects`);
      
      return (result.data || []).map((project: any) => ({
        id: project.id,
        name: project.name,
        webUrl: project.webUrl,
        createdAt: project.createdAt,
      }));
    } catch (error) {
      console.error('❌ Failed to find V0 projects:', error);
      throw new Error(`Failed to find V0 projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProjectById(projectId: string): Promise<{ id: string; name: string; webUrl: string; chats: any[] }> {
    try {
      if (!this.config.v0ApiKey || !this.v0Client) {
        throw new Error('V0_API_KEY is required for project retrieval');
      }

      console.error(`🔍 V0Client: Getting project: ${projectId}`);
      
      const result = await this.v0Client.projects.getById({ projectId });
      
      console.error(`✅ V0Client: Project found: ${result.name} with ${result.chats?.length || 0} chats`);
      
      return {
        id: result.id,
        name: result.name,
        webUrl: result.webUrl,
        chats: result.chats || [],
      };
    } catch (error) {
      console.error('❌ Failed to get V0 project:', error);
      throw new Error(`Failed to get V0 project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async assignChatToProject(chatId: string, projectId: string): Promise<void> {
    try {
      if (!this.config.v0ApiKey || !this.v0Client) {
        throw new Error('V0_API_KEY is required for chat assignment');
      }

      console.error(`🔧 V0Client: Assigning chat ${chatId} to project ${projectId}`);
      
      await this.v0Client.projects.assign({
        projectId,
        chatId,
      });
      
      console.error(`✅ V0Client: Chat assigned to project successfully`);
    } catch (error) {
      console.error('❌ Failed to assign chat to project:', error);
      throw new Error(`Failed to assign chat to project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async saveFilesToProject(files: any[], options: any = {}): Promise<void> {
    try {
      const workspacePath = this.config.cursorWorkspacePath || process.cwd();
      const projectName = options.projectName || 'project';
      const projectDir = path.join(workspacePath, 'projects', projectName);
      
      console.error(`📁 Auto-saving ${files.length} files to project: ${projectName}`);

      // Create project directory
      if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir, { recursive: true });
      }

      for (const file of files) {
        if (file.content) {
          // Use the original file path from V0
          let filePath = file.name || 'Component.tsx';
          
          // Ensure proper extension
          if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.jsx') && !filePath.endsWith('.js')) {
            filePath += '.tsx';
          }
          
          // Create full path in project directory
          const fullPath = path.join(projectDir, filePath);
          
          // Create directory structure if needed
          const dirPath = path.dirname(fullPath);
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }
          
          // Check if file already exists and compare content
          if (fs.existsSync(fullPath)) {
            const existingContent = fs.readFileSync(fullPath, 'utf-8');
            if (existingContent === file.content) {
              console.error(`⏭️ Skipped (no changes): ${filePath}`);
              continue;
            }
            
            // Create backup before overwriting
            const backupPath = fullPath + '.backup.' + Date.now();
            fs.copyFileSync(fullPath, backupPath);
            console.error(`📋 Created backup: ${filePath} → ${path.basename(backupPath)}`);
            console.error(`🔄 Updating existing file: ${filePath}`);
          } else {
            console.error(`🆕 Creating new file: ${filePath}`);
          }
          
          // Write the file
          fs.writeFileSync(fullPath, file.content, 'utf-8');
          console.error(`✅ Auto-saved: ${filePath}`);
        }
      }

      console.error(`🎉 Successfully auto-saved ${files.length} file(s) to project: ${projectName}`);
      console.error(`📂 Location: ${projectDir}`);

    } catch (error) {
      console.error('❌ Failed to auto-save files to project:', error);
      // Don't throw error to avoid breaking the main generation flow
    }
  }
} 