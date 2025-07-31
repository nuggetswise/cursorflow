import { BaseAgent } from './BaseAgent';
import { AgentResult } from '../types';
import { IntentAnalysis } from './IntentAnalysisAgent';
import { UXPatternSelection } from './UXPatternSelectorAgent';
import * as fs from 'fs-extra';
import * as path from 'path';

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  recommendations: string[];
  complexityAssessment: 'simple' | 'moderate' | 'complex';
  estimatedBuildTime: number; // in minutes
  estimatedCost: number;
  riskLevel: 'low' | 'medium' | 'high';
  suggestedMode: 'quick-build' | 'full-platform';
}

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  component?: string;
  severity: 'low' | 'medium' | 'high';
}

export class ValidationAgent extends BaseAgent {
  private systemPrompt: string = '';

  constructor(config: any) {
    super(config, 'ValidationAgent');
    this.loadSystemPrompt();
  }

  private async loadSystemPrompt(): Promise<void> {
    try {
      const promptPath = path.join(process.cwd(), '../../prompts/nuggetwise/validation.json');
      const promptData = await fs.readJson(promptPath);
      this.systemPrompt = promptData.systemPrompt;
    } catch (error) {
      this.error('Failed to load validation prompt file', error);
      throw new Error('Validation prompt file not found. Please ensure prompts/nuggetwise/validation.json exists.');
    }
  }

  async execute(input: { 
    intentAnalysis: IntentAnalysis; 
    uxPatterns: UXPatternSelection;
    budget?: number;
    timeout?: number;
  }): Promise<AgentResult> {
    this.log('Starting validation', { 
      primaryIntent: input.intentAnalysis.primaryIntent,
      budget: input.budget,
      timeout: input.timeout
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

    const userPrompt = `Validate the following requirements and UX patterns:

Intent Analysis:
- Primary Intent: ${input.intentAnalysis.primaryIntent}
- Complexity: ${input.intentAnalysis.complexity}
- Estimated Components: ${input.intentAnalysis.estimatedComponents}
- Features: ${input.intentAnalysis.features.join(', ')}
- Target Audience: ${input.intentAnalysis.targetAudience}
- Platform: ${input.intentAnalysis.platform}

UX Patterns:
- Primary Pattern: ${input.uxPatterns.primaryPattern.name}
- Recommended Components: ${input.uxPatterns.recommendedComponents.join(', ')}
- Layout Strategy: ${input.uxPatterns.layoutStrategy}
- Navigation Strategy: ${input.uxPatterns.navigationStrategy}

Constraints:
- Budget: ${input.budget || 'unlimited'}
- Timeout: ${input.timeout || 'unlimited'}

Return only the JSON object with the validation results.`;

    const result = await this.callLLM(userPrompt, this.systemPrompt, 0.3);

    if (result.success) {
      try {
        const validation: ValidationResult = JSON.parse(result.data);
        this.log('Validation completed', { 
          isValid: validation.isValid,
          issues: validation.issues.length,
          suggestedMode: validation.suggestedMode
        });
        
        return {
          ...result,
          data: validation
        };
      } catch (parseError) {
        this.error('Failed to parse validation result', parseError);
        return {
          success: false,
          data: null,
          error: 'Failed to parse validation result',
          cost: result.cost,
          duration: result.duration
        };
      }
    }

    return result;
  }
} 