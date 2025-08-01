import { createClient } from 'v0-sdk';
import * as fs from 'fs';
import * as path from 'path';

export interface V0GenerationRequest {
  prompt: string;
  system?: string;
  modelId?: 'v0-1.5-sm' | 'v0-1.5-md' | 'v0-1.5-lg';
  saveToWorkspace?: boolean;
  fileName?: string;
}

export interface V0GenerationResponse {
  success: boolean;
  chatId?: string;
  previewUrl?: string;
  files?: Array<{
    name: string;
    content: string;
    path?: string;
  }>;
  error?: string;
}

export class V0IntegrationService {
  private v0Client: any;
  private workspacePath: string;

  constructor(apiKey: string, workspacePath: string) {
    this.v0Client = createClient({ apiKey });
    this.workspacePath = workspacePath;
  }

  async generateComponent(request: V0GenerationRequest): Promise<V0GenerationResponse> {
    try {
      console.log('🚀 Generating component with V0:', request.prompt);

      const result = await this.v0Client.chats.create({
        system: request.system || 'You are an expert React developer. Generate clean, modern, accessible components.',
        message: request.prompt,
        modelConfiguration: {
          modelId: request.modelId || 'v0-1.5-sm',
          imageGenerations: false,
          thinking: false,
        },
      });

      console.log('✅ V0 generation successful:', result.id);

      const files = result.latestVersion?.files || [];
      const savedFiles: Array<{ name: string; content: string; path?: string }> = [];

      // Save files to workspace if requested
      if (request.saveToWorkspace && files.length > 0) {
        // Create a unique directory for this generation
        const timestamp = Date.now();
        const dirName = request.fileName 
          ? `${request.fileName}-${timestamp}`
          : `v0-generated-${timestamp}`;
        
        const dirPath = path.join(this.workspacePath, dirName);
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = file.name || `component-${i + 1}.tsx`;
          const filePath = path.join(dirPath, fileName);
          
          try {
            fs.writeFileSync(filePath, file.content);
            savedFiles.push({
              name: file.name,
              content: file.content,
              path: filePath
            });
            console.log('✅ Saved file:', filePath);
          } catch (error) {
            console.error('❌ Failed to save file:', fileName, error);
          }
        }
      }

      return {
        success: true,
        chatId: result.id,
        previewUrl: result.latestVersion?.demoUrl,
        files: savedFiles.length > 0 ? savedFiles : files.map((f: any) => ({ name: f.name, content: f.content }))
      };

    } catch (error) {
      console.error('❌ V0 generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async continueConversation(chatId: string, message: string): Promise<V0GenerationResponse> {
    try {
      console.log('🔄 Continuing V0 conversation:', chatId);

      const result = await this.v0Client.chats.sendMessage({
        chatId,
        message
      });

      console.log('✅ V0 conversation continued successfully');

      const files = result.latestVersion?.files || [];

      return {
        success: true,
        chatId: result.id,
        previewUrl: result.latestVersion?.demoUrl,
        files: files.map((f: any) => ({ name: f.name, content: f.content }))
      };

    } catch (error) {
      console.error('❌ V0 conversation continuation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getChatHistory(chatId: string): Promise<any> {
    try {
      const result = await this.v0Client.chats.getById({ chatId });
      return result;
    } catch (error) {
      console.error('❌ Failed to get chat history:', error);
      throw error;
    }
  }
} 