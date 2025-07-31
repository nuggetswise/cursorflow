import { BaseAgent } from './BaseAgent';
import { AgentResult } from '../types';
import * as fs from 'fs-extra';
import * as path from 'path';

export interface IntentAnalysis {
  primaryIntent: string;
  secondaryIntents: string[];
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedComponents: number;
  features: string[];
  targetAudience: string;
  platform: 'web' | 'mobile' | 'desktop' | 'multi';
  urgency: 'low' | 'medium' | 'high';
}

export class IntentAnalysisAgent extends BaseAgent {
  private systemPrompt: string = '';

  constructor(config: any) {
    super(config, 'IntentAnalysisAgent');
    this.loadSystemPrompt();
  }

  private async loadSystemPrompt(): Promise<void> {
    try {
      const promptPath = path.join(process.cwd(), '../../prompts/nuggetwise/intent-analysis.json');
      const promptData = await fs.readJson(promptPath);
      this.systemPrompt = promptData.systemPrompt;
    } catch (error) {
      this.error('Failed to load intent analysis prompt file', error);
      throw new Error('Intent analysis prompt file not found. Please ensure prompts/nuggetwise/intent-analysis.json exists.');
    }
  }

  async execute(input: { prompt: string }): Promise<AgentResult> {
    this.log('Starting intent analysis', { prompt: input.prompt.substring(0, 100) + '...' });

    if (!this.systemPrompt) {
      return {
        success: false,
        data: null,
        error: 'System prompt not loaded',
        cost: 0,
        duration: 0
      };
    }

    const userPrompt = `Analyze the following user prompt and extract the intent information:

"${input.prompt}"

Return only the JSON object with the analysis results.`;

    const result = await this.callLLM(userPrompt, this.systemPrompt, 0.3);

    if (result.success) {
      try {
        const analysis: IntentAnalysis = JSON.parse(result.data);
        this.log('Intent analysis completed', { 
          primaryIntent: analysis.primaryIntent,
          complexity: analysis.complexity,
          estimatedComponents: analysis.estimatedComponents
        });
        
        return {
          ...result,
          data: analysis
        };
      } catch (parseError) {
        this.error('Failed to parse intent analysis result', parseError);
        return {
          success: false,
          data: null,
          error: 'Failed to parse intent analysis result',
          cost: result.cost,
          duration: result.duration
        };
      }
    }

    return result;
  }
} 