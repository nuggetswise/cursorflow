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
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = request.fileName 
            ? `${request.fileName}-${i + 1}-${file.name}`
            : `v0-generated-${Date.now()}-${i + 1}-${file.name}`;
          
          const filePath = path.join(this.workspacePath, fileName);
          
          try {
            fs.writeFileSync(filePath, file.content);
            savedFiles.push({
              name: file.name,
              content: file.content,
              path: filePath
            });
            console.log('✅ Saved file:', fileName);
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