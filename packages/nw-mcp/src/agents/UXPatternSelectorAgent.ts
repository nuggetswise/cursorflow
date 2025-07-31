import { BaseAgent } from './BaseAgent';
import { AgentResult } from '../types';
import { IntentAnalysis } from './IntentAnalysisAgent';
import * as fs from 'fs-extra';
import * as path from 'path';

export interface UXPattern {
  name: string;
  description: string;
  components: string[];
  layout: string;
  navigation: string;
  interactions: string[];
  accessibility: string[];
  responsive: boolean;
  darkMode: boolean;
}

export interface UXPatternSelection {
  primaryPattern: UXPattern;
  secondaryPatterns: UXPattern[];
  layoutStrategy: string;
  navigationStrategy: string;
  responsiveStrategy: string;
  accessibilityFeatures: string[];
  recommendedComponents: string[];
}

export class UXPatternSelectorAgent extends BaseAgent {
  private systemPrompt: string = '';

  constructor(config: any) {
    super(config, 'UXPatternSelectorAgent');
    this.loadSystemPrompt();
  }

  private async loadSystemPrompt(): Promise<void> {
    try {
      const promptPath = path.join(process.cwd(), '../../prompts/nuggetwise/ux-pattern-selector.json');
      const promptData = await fs.readJson(promptPath);
      this.systemPrompt = promptData.systemPrompt;
    } catch (error) {
      this.error('Failed to load UX pattern selector prompt file', error);
      throw new Error('UX pattern selector prompt file not found. Please ensure prompts/nuggetwise/ux-pattern-selector.json exists.');
    }
  }

  async execute(input: { intentAnalysis: IntentAnalysis }): Promise<AgentResult> {
    this.log('Starting UX pattern selection', { 
      primaryIntent: input.intentAnalysis.primaryIntent,
      complexity: input.intentAnalysis.complexity
    });

    if (!this.systemPrompt) {
      return {
        success: false,
        data: null,
        error: 'System prompt not loaded',
        cost: 0,
        duration: 0
      };
    }

    const userPrompt = `Based on the following intent analysis, select appropriate UX patterns:

Intent Analysis:
- Primary Intent: ${input.intentAnalysis.primaryIntent}
- Secondary Intents: ${input.intentAnalysis.secondaryIntents.join(', ')}
- Complexity: ${input.intentAnalysis.complexity}
- Estimated Components: ${input.intentAnalysis.estimatedComponents}
- Features: ${input.intentAnalysis.features.join(', ')}
- Target Audience: ${input.intentAnalysis.targetAudience}
- Platform: ${input.intentAnalysis.platform}
- Urgency: ${input.intentAnalysis.urgency}

Return only the JSON object with the UX pattern selection.`;

    const result = await this.callLLM(userPrompt, this.systemPrompt, 0.4);

    if (result.success) {
      try {
        const selection: UXPatternSelection = JSON.parse(result.data);
        this.log('UX pattern selection completed', { 
          primaryPattern: selection.primaryPattern.name,
          recommendedComponents: selection.recommendedComponents.length
        });
        
        return {
          ...result,
          data: selection
        };
      } catch (parseError) {
        this.error('Failed to parse UX pattern selection result', parseError);
        return {
          success: false,
          data: null,
          error: 'Failed to parse UX pattern selection result',
          cost: result.cost,
          duration: result.duration
        };
      }
    }

    return result;
  }
} 