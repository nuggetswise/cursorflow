import { readFileSync } from 'fs';
import { join } from 'path';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Groq } from 'groq-sdk';

// LLM Provider types
export type LLMProvider = 'openai' | 'gemini' | 'groq' | 'anthropic';

// Prompt types
export type PromptType = 
  | 'intent-analysis'
  | 'ux-pattern-selector'
  | 'validation'
  | 'ui-requirement-synthesizer'
  | 'v0-prompt-builder'
  | 'diff-detector'
  | 'notification'
  | 'product-manager'
  | 'ux-designer'
  | 'software-architect';

// LLM Configuration
interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

// Prompt Service Class
export class PromptService {
  private openai: OpenAI | null = null;
  private gemini: GoogleGenerativeAI | null = null;
  private groq: Groq | null = null;
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
    this.initializeProviders();
  }

  private initializeProviders() {
    switch (this.config.provider) {
      case 'openai':
        this.openai = new OpenAI({
          apiKey: this.config.apiKey,
        });
        break;
      case 'gemini':
        this.gemini = new GoogleGenerativeAI(this.config.apiKey);
        break;
      case 'groq':
        this.groq = new Groq({
          apiKey: this.config.apiKey,
        });
        break;
      case 'anthropic':
        // Anthropic client initialization would go here
        break;
    }
  }

  // Load prompt from file system
  async loadPrompt(promptType: PromptType, mode: 'quick-build' | 'full-platform' = 'full-platform'): Promise<any> {
    try {
      let promptPath: string;
      
      if (mode === 'quick-build') {
        // Load from nuggetwise prompts
        promptPath = join(process.cwd(), 'prompts', 'nuggetwise', `${promptType}.json`);
      } else {
        // Load from full platform prompts
        switch (promptType) {
          case 'product-manager':
            promptPath = join(process.cwd(), 'prompts', 'prd-generation', 'product-manager-prompt.md');
            break;
          case 'ux-designer':
            promptPath = join(process.cwd(), 'prompts', 'design-critique', 'ux-designer-prompt.md');
            break;
          case 'software-architect':
            promptPath = join(process.cwd(), 'prompts', 'code-analysis', 'software-architect-prompt.md');
            break;
          default:
            throw new Error(`Unknown prompt type: ${promptType}`);
        }
      }

      const promptContent = readFileSync(promptPath, 'utf-8');
      
      if (promptPath.endsWith('.json')) {
        return JSON.parse(promptContent);
      } else {
        return { content: promptContent };
      }
    } catch (error) {
      console.error(`Error loading prompt ${promptType}:`, error);
      throw new Error(`Failed to load prompt: ${promptType}`);
    }
  }

  // Generate response using the configured LLM provider
  async generateResponse(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      switch (this.config.provider) {
        case 'openai':
          return await this.generateOpenAIResponse(prompt, systemPrompt);
        case 'gemini':
          return await this.generateGeminiResponse(prompt, systemPrompt);
        case 'groq':
          return await this.generateGroqResponse(prompt, systemPrompt);
        case 'anthropic':
          return await this.generateAnthropicResponse(prompt, systemPrompt);
        default:
          throw new Error(`Unsupported LLM provider: ${this.config.provider}`);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error(`Failed to generate response with ${this.config.provider}`);
    }
  }

  // OpenAI response generation
  private async generateOpenAIResponse(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.openai) throw new Error('OpenAI client not initialized');

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system' as const, content: systemPrompt });
    }
    messages.push({ role: 'user' as const, content: prompt });

    const response = await this.openai.chat.completions.create({
      model: this.config.model,
      messages,
      temperature: this.config.temperature || 0.3,
      max_tokens: this.config.maxTokens || 2000,
    });

    return response.choices[0]?.message?.content || '';
  }

  // Gemini response generation
  private async generateGeminiResponse(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.gemini) throw new Error('Gemini client not initialized');

    const model = this.gemini.getGenerativeModel({ model: this.config.model });
    
    let fullPrompt = prompt;
    if (systemPrompt) {
      fullPrompt = `${systemPrompt}\n\n${prompt}`;
    }

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  }

  // Groq response generation
  private async generateGroqResponse(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.groq) throw new Error('Groq client not initialized');

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system' as const, content: systemPrompt });
    }
    messages.push({ role: 'user' as const, content: prompt });

    const response = await this.groq.chat.completions.create({
      model: this.config.model,
      messages,
      temperature: this.config.temperature || 0.3,
      max_tokens: this.config.maxTokens || 2000,
    });

    return response.choices[0]?.message?.content || '';
  }

  // Anthropic response generation (placeholder)
  private async generateAnthropicResponse(prompt: string, systemPrompt?: string): Promise<string> {
    throw new Error('Anthropic integration not yet implemented');
  }

  // Execute 7-agent orchestration for quick build
  async executeQuickBuildOrchestration(userPrompt: string): Promise<any> {
    try {
      // Step 1: Intent Analysis
      const intentPrompt = await this.loadPrompt('intent-analysis', 'quick-build');
      const intentResponse = await this.generateResponse(
        JSON.stringify({ idea: userPrompt }),
        intentPrompt.system
      );
      const intent = JSON.parse(intentResponse);

      // Step 2: UX Pattern Selection
      const uxPrompt = await this.loadPrompt('ux-pattern-selector', 'quick-build');
      const uxResponse = await this.generateResponse(
        JSON.stringify({ 
          coreFeatures: intent.coreFeatures,
          platform: intent.platform,
          complexity: intent.complexity
        }),
        uxPrompt.system
      );
      const uxPatterns = JSON.parse(uxResponse);

      // Step 3: Validation
      const validationPrompt = await this.loadPrompt('validation', 'quick-build');
      const validationResponse = await this.generateResponse(
        JSON.stringify({
          goal: intent.goal,
          userRoles: intent.userRoles,
          coreFeatures: intent.coreFeatures,
          constraints: intent.constraints
        }),
        validationPrompt.system
      );
      const validation = JSON.parse(validationResponse);

      // Step 4: UI Requirement Synthesis
      const uiReqPrompt = await this.loadPrompt('ui-requirement-synthesizer', 'quick-build');
      const uiReqResponse = await this.generateResponse(
        JSON.stringify({
          uxSelections: uxPatterns.selections,
          mvpMilestones: validation.mvpMilestones,
          layout: uxPatterns.layout
        }),
        uiReqPrompt.system
      );
      const uiRequirements = JSON.parse(uiReqResponse);

      // Step 5: v0 Prompt Building
      const v0Prompt = await this.loadPrompt('v0-prompt-builder', 'quick-build');
      const v0Response = await this.generateResponse(
        v0Prompt.content.replace('{{components}}', JSON.stringify(uiRequirements.components, null, 2))
      );

      // Step 6: Diff Detection
      const diffPrompt = await this.loadPrompt('diff-detector', 'quick-build');
      const diffResponse = await this.generateResponse(
        JSON.stringify({
          currentComponents: [],
          changeRequest: userPrompt,
          existingFiles: []
        }),
        diffPrompt.system
      );
      const diffAnalysis = JSON.parse(diffResponse);

      // Step 7: Notification
      const notificationPrompt = await this.loadPrompt('notification', 'quick-build');
      const notificationResponse = await this.generateResponse(
        JSON.stringify({
          event: 'build_completed',
          details: {
            project: intent.goal,
            components: uiRequirements.components.length,
            time: Date.now(),
            preview: 'https://v0-generated-app.vercel.app'
          },
          user: 'user',
          project: 'quick-build-project'
        }),
        notificationPrompt.system
      );
      const notification = JSON.parse(notificationResponse);

      return {
        intent,
        uxPatterns,
        validation,
        uiRequirements,
        v0Prompt: v0Response,
        diffAnalysis,
        notification,
        success: true
      };

    } catch (error) {
      console.error('Quick build orchestration error:', error);
      throw new Error('Failed to execute quick build orchestration');
    }
  }

  // Execute full platform PRD generation
  async executeFullPlatformPRD(userPrompt: string, template: string = 'detailed'): Promise<any> {
    try {
      const prdPrompt = await this.loadPrompt('product-manager', 'full-platform');
      
      const prompt = prdPrompt.content
        .replace('{industry}', 'Technology')
        .replace('{audience}', 'Product Managers')
        .replace('{goals}', 'Create a comprehensive PRD')
        .replace('{constraints}', 'Web-based application')
        .replace('{market_conditions}', 'Competitive market')
        .replace('{competition}', 'Existing solutions')
        .replace('{data}', userPrompt);

      const response = await this.generateResponse(prompt);
      
      // Parse the response (assuming it returns structured data)
      return {
        prd: response,
        success: true,
        mode: 'full-platform'
      };

    } catch (error) {
      console.error('Full platform PRD generation error:', error);
      throw new Error('Failed to generate full platform PRD');
    }
  }
}

// Factory function to create prompt service
export function createPromptService(provider: LLMProvider): PromptService {
  const config: LLMConfig = {
    provider,
    apiKey: process.env[`${provider.toUpperCase()}_API_KEY`] || '',
    model: process.env[`${provider.toUpperCase()}_MODEL`] || getDefaultModel(provider),
    temperature: parseFloat(process.env[`${provider.toUpperCase()}_TEMPERATURE`] || '0.3'),
    maxTokens: parseInt(process.env[`${provider.toUpperCase()}_MAX_TOKENS`] || '2000'),
  };

  return new PromptService(config);
}

// Get default model for each provider
function getDefaultModel(provider: LLMProvider): string {
  switch (provider) {
    case 'openai':
      return 'gpt-4o';
    case 'gemini':
      return 'gemini-pro';
    case 'groq':
      return 'llama3-8b-8192';
    case 'anthropic':
      return 'claude-3-sonnet-20240229';
    default:
      return 'gpt-4o';
  }
} 