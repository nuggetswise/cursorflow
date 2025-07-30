// Prompt Loader Service
// Loads prompts from separate files based on stakeholder/user type

import fs from 'fs';
import path from 'path';

export interface PromptConfig {
  stakeholder: string;
  task: string;
  context: Record<string, any>;
  data: any;
  explainabilityLevel: 'basic' | 'detailed' | 'expert';
}

export interface LoadedPrompt {
  content: string;
  metadata: {
    stakeholder: string;
    task: string;
    version: string;
    lastModified: Date;
  };
}

export class PromptLoaderService {
  private promptsDir: string;
  private cache: Map<string, LoadedPrompt> = new Map();

  constructor(promptsDir: string = './prompts') {
    this.promptsDir = promptsDir;
  }

  /**
   * Load a prompt for a specific stakeholder and task
   */
  async loadPrompt(config: PromptConfig): Promise<LoadedPrompt> {
    const cacheKey = `${config.stakeholder}-${config.task}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Load from file
    const prompt = await this.loadPromptFromFile(config);
    
    // Cache the result
    this.cache.set(cacheKey, prompt);
    
    return prompt;
  }

  /**
   * Load prompt from file system
   */
  private async loadPromptFromFile(config: PromptConfig): Promise<LoadedPrompt> {
    const filePath = this.getPromptFilePath(config.stakeholder, config.task);
    
    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      
      return {
        content: this.processPromptContent(content, config),
        metadata: {
          stakeholder: config.stakeholder,
          task: config.task,
          version: this.extractVersion(content),
          lastModified: (await fs.promises.stat(filePath)).mtime
        }
      };
    } catch (error) {
      throw new Error(`Failed to load prompt for ${config.stakeholder}/${config.task}: ${error.message}`);
    }
  }

  /**
   * Get the file path for a specific prompt
   */
  private getPromptFilePath(stakeholder: string, task: string): string {
    const stakeholderDir = this.getStakeholderDirectory(stakeholder);
    const fileName = this.getPromptFileName(task);
    
    return path.join(this.promptsDir, stakeholderDir, fileName);
  }

  /**
   * Map stakeholder to directory name
   */
  private getStakeholderDirectory(stakeholder: string): string {
    const stakeholderMap: Record<string, string> = {
      'product-manager': 'prd-generation',
      'ux-designer': 'design-critique',
      'software-architect': 'code-analysis',
      'accessibility-expert': 'accessibility',
      'performance-engineer': 'performance',
      'seo-specialist': 'seo',
      'user-researcher': 'user-behavior',
      'market-analyst': 'market-research',
      'competitive-analyst': 'competitive-analysis'
    };

    return stakeholderMap[stakeholder] || stakeholder;
  }

  /**
   * Get the filename for a specific task
   */
  private getPromptFileName(task: string): string {
    const taskMap: Record<string, string> = {
      'prd-generation': 'product-manager-prompt.md',
      'design-critique': 'ux-designer-prompt.md',
      'code-analysis': 'software-architect-prompt.md',
      'accessibility-audit': 'accessibility-expert-prompt.md',
      'performance-analysis': 'performance-engineer-prompt.md',
      'seo-analysis': 'seo-specialist-prompt.md',
      'user-behavior-analysis': 'user-researcher-prompt.md',
      'market-research': 'market-analyst-prompt.md',
      'competitive-analysis': 'competitive-analyst-prompt.md'
    };

    return taskMap[task] || `${task}-prompt.md`;
  }

  /**
   * Process prompt content with context variables
   */
  private processPromptContent(content: string, config: PromptConfig): string {
    let processedContent = content;

    // Replace context variables
    Object.entries(config.context).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      processedContent = processedContent.replace(new RegExp(placeholder, 'g'), String(value));
    });

    // Replace data placeholder
    processedContent = processedContent.replace('{data}', JSON.stringify(config.data, null, 2));

    // Adjust explainability level
    processedContent = this.adjustExplainabilityLevel(processedContent, config.explainabilityLevel);

    return processedContent;
  }

  /**
   * Adjust explainability level in the prompt
   */
  private adjustExplainabilityLevel(content: string, level: string): string {
    switch (level) {
      case 'basic':
        // Remove detailed reasoning requirements
        return content.replace(/## Explainability Requirements[\s\S]*?(?=##|$)/g, '');
      
      case 'detailed':
        // Keep all explainability requirements
        return content;
      
      case 'expert':
        // Add additional expert-level requirements
        const expertRequirements = `
## Expert-Level Explainability Requirements

In addition to standard explainability requirements, provide:
- Industry-specific insights and benchmarks
- Advanced technical considerations
- Long-term strategic implications
- Cross-functional impact analysis
- Risk assessment with mitigation strategies
`;
        return content.replace('## Explainability Requirements', expertRequirements);
      
      default:
        return content;
    }
  }

  /**
   * Extract version from prompt content
   */
  private extractVersion(content: string): string {
    const versionMatch = content.match(/version:\s*([^\n]+)/i);
    return versionMatch ? versionMatch[1].trim() : '1.0.0';
  }

  /**
   * Get available stakeholders
   */
  async getAvailableStakeholders(): Promise<string[]> {
    try {
      const dirs = await fs.promises.readdir(this.promptsDir);
      return dirs.filter(dir => {
        const stat = fs.statSync(path.join(this.promptsDir, dir));
        return stat.isDirectory();
      });
    } catch (error) {
      console.warn('Could not read prompts directory:', error.message);
      return [];
    }
  }

  /**
   * Get available tasks for a stakeholder
   */
  async getAvailableTasks(stakeholder: string): Promise<string[]> {
    const stakeholderDir = this.getStakeholderDirectory(stakeholder);
    const fullPath = path.join(this.promptsDir, stakeholderDir);
    
    try {
      const files = await fs.promises.readdir(fullPath);
      return files
        .filter(file => file.endsWith('-prompt.md'))
        .map(file => file.replace('-prompt.md', ''));
    } catch (error) {
      console.warn(`Could not read tasks for stakeholder ${stakeholder}:`, error.message);
      return [];
    }
  }

  /**
   * Clear the prompt cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Validate prompt configuration
   */
  async validatePromptConfig(config: PromptConfig): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Check if stakeholder exists
    const stakeholders = await this.getAvailableStakeholders();
    if (!stakeholders.includes(this.getStakeholderDirectory(config.stakeholder))) {
      errors.push(`Stakeholder '${config.stakeholder}' not found. Available: ${stakeholders.join(', ')}`);
    }

    // Check if task exists for stakeholder
    if (config.stakeholder) {
      const tasks = await this.getAvailableTasks(config.stakeholder);
      if (!tasks.includes(config.task)) {
        errors.push(`Task '${config.task}' not found for stakeholder '${config.stakeholder}'. Available: ${tasks.join(', ')}`);
      }
    }

    // Validate context variables
    if (!config.context || typeof config.context !== 'object') {
      errors.push('Context must be a valid object');
    }

    // Validate explainability level
    const validLevels = ['basic', 'detailed', 'expert'];
    if (!validLevels.includes(config.explainabilityLevel)) {
      errors.push(`Invalid explainability level. Must be one of: ${validLevels.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
} 