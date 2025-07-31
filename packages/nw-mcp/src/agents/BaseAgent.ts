import OpenAI from 'openai';
import { AgentResult } from '../types';
import { EnvironmentConfig } from '../types';

export abstract class BaseAgent {
  protected openai: OpenAI;
  protected config: EnvironmentConfig;
  protected name: string;

  constructor(config: EnvironmentConfig, name: string) {
    this.config = config;
    this.name = name;
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });
  }

  abstract execute(input: any): Promise<AgentResult>;

  protected async callLLM(
    prompt: string,
    systemPrompt: string,
    temperature: number = 0.7
  ): Promise<AgentResult> {
    const startTime = Date.now();
    
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature,
        max_tokens: 4000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      const duration = Date.now() - startTime;
      const cost = this.calculateCost(response.usage);

      return {
        success: true,
        data: content,
        cost,
        duration
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        cost: 0,
        duration
      };
    }
  }

  private calculateCost(usage: any): number {
    // GPT-4 pricing: $0.03 per 1K input tokens, $0.06 per 1K output tokens
    const inputCost = (usage.prompt_tokens / 1000) * 0.03;
    const outputCost = (usage.completion_tokens / 1000) * 0.06;
    return inputCost + outputCost;
  }

  protected log(message: string, data?: any): void {
    console.log(`[${this.name}] ${message}`, data || '');
  }

  protected error(message: string, error?: any): void {
    console.error(`[${this.name}] ERROR: ${message}`, error || '');
  }
} 