import * as fs from 'fs-extra';
import * as path from 'path';
import { EnvironmentConfig } from '../types';

export interface FileWriteResult {
  success: boolean;
  files: string[];
  errors: string[];
  previewUrl?: string;
}

export class FileWriter {
  private config: EnvironmentConfig;
  private workspacePath: string;

  constructor(config: EnvironmentConfig) {
    this.config = config;
    this.workspacePath = config.cursorWorkspacePath || process.cwd();
  }

  async writeV0Files(chatId: string, components: any[]): Promise<FileWriteResult> {
    const result: FileWriteResult = {
      success: false,
      files: [],
      errors: []
    };

    try {
      console.log(`📁 Writing V0 files to workspace: ${this.workspacePath}`);

      // Create a unique directory for this generation
      const timestamp = Date.now();
      const dirName = `v0-generated-${timestamp}`;
      const dirPath = path.join(this.workspacePath, dirName);
      
      // Create directory if it doesn't exist
      await fs.ensureDir(dirPath);

      // Create components directory within the unique directory
      const componentsPath = path.join(dirPath, 'components');
      await fs.ensureDir(componentsPath);

      // Write each component
      for (const component of components) {
        if (component.code) {
          const fileName = `${component.name || 'Component'}.tsx`;
          const filePath = path.join(componentsPath, fileName);
          
          await fs.writeFile(filePath, component.code, 'utf-8');
          result.files.push(filePath);
          
          console.log(`✅ Written: ${fileName}`);
        }
      }

      // Create or update main page within the unique directory
      const mainPagePath = path.join(dirPath, 'page.tsx');
      const mainPageContent = this.generateMainPage(components);
      await fs.writeFile(mainPagePath, mainPageContent, 'utf-8');
      result.files.push(mainPagePath);

      // Generate preview URL
      result.previewUrl = `https://v0.dev/chat/${chatId}`;
      result.success = true;

      console.log(`✅ Successfully wrote ${result.files.length} files to ${dirPath}`);
      console.log(`🔗 Preview URL: ${result.previewUrl}`);

    } catch (error) {
      console.error('❌ File writing failed:', error);
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
    }

    return result;
  }

  private generateMainPage(components: any[]): string {
    const imports = components.map(comp => 
      `import { ${comp.name || 'Component'} } from './components/${comp.name || 'Component'}.tsx';`
    ).join('\n');

    const componentUsage = components.map(comp => 
      `      <${comp.name || 'Component'} />`
    ).join('\n');

    return `import React from 'react';
${imports}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Generated with Nuggetwise + V0
        </h1>
        
        <div className="space-y-8">
${componentUsage}
        </div>
      </div>
    </div>
  );
}`;
  }

  async backupExistingFiles(): Promise<void> {
    try {
      const frontendPath = path.join(this.workspacePath, 'frontend');
      if (await fs.pathExists(frontendPath)) {
        const backupPath = path.join(this.workspacePath, 'frontend.backup.' + Date.now());
        await fs.copy(frontendPath, backupPath);
        console.log(`📦 Backup created: ${backupPath}`);
      }
    } catch (error) {
      console.warn('⚠️ Backup failed:', error);
    }
  }

  async restoreFromBackup(backupPath: string): Promise<boolean> {
    try {
      const frontendPath = path.join(this.workspacePath, 'frontend');
      await fs.remove(frontendPath);
      await fs.copy(backupPath, frontendPath);
      console.log(`🔄 Restored from backup: ${backupPath}`);
      return true;
    } catch (error) {
      console.error('❌ Restore failed:', error);
      return false;
    }
  }
} 