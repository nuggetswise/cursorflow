import { BaseAgent } from './BaseAgent';
import { AgentResult, Component } from '../types';
import { IntentAnalysis } from './IntentAnalysisAgent';
import { UXPatternSelection } from './UXPatternSelectorAgent';
import { ValidationResult } from './ValidationAgent';
import * as fs from 'fs-extra';
import * as path from 'path';

export interface UIRequirement {
  components: Component[];
  layout: {
    type: string;
    structure: string;
    responsive: boolean;
    darkMode: boolean;
  };
  navigation: {
    type: string;
    structure: string[];
    breadcrumbs: boolean;
  };
  styling: {
    theme: string;
    colors: string[];
    typography: string;
    spacing: string;
  };
  interactions: {
    animations: string[];
    transitions: string[];
    hoverEffects: string[];
  };
  accessibility: {
    features: string[];
    ariaLabels: boolean;
    keyboardNavigation: boolean;
    screenReader: boolean;
  };
  responsive: {
    breakpoints: string[];
    mobileFirst: boolean;
    adaptiveLayout: boolean;
  };
}

export class UIRequirementSynthesizerAgent extends BaseAgent {
  private systemPrompt: string = '';

  constructor(config: any) {
    super(config, 'UIRequirementSynthesizerAgent');
    this.loadSystemPrompt();
  }

  private async loadSystemPrompt(): Promise<void> {
    try {
      const promptPath = path.join(process.cwd(), '../../prompts/nuggetwise/ui-requirement-synthesizer.json');
      const promptData = await fs.readJson(promptPath);
      this.systemPrompt = promptData.systemPrompt;
    } catch (error) {
      // Fallback to hardcoded prompt if file not found
      this.systemPrompt = `You are a UI Requirement Synthesizer Agent for Nuggetwise Builder. Your job is to synthesize comprehensive UI requirements from all previous agent analyses.

Synthesize the requirements and return a JSON object with the following structure:
{
  "components": [
    {
      "name": "string - component name",
      "templateId": "string - template identifier",
      "props": "object - component properties",
      "milestone": "number - development milestone"
    }
  ],
  "layout": {
    "type": "string - layout type",
    "structure": "string - layout structure",
    "responsive": "boolean",
    "darkMode": "boolean"
  },
  "navigation": {
    "type": "string - navigation type",
    "structure": ["array of navigation items"],
    "breadcrumbs": "boolean"
  },
  "styling": {
    "theme": "string - theme name",
    "colors": ["array of color codes"],
    "typography": "string - typography system",
    "spacing": "string - spacing system"
  },
  "interactions": {
    "animations": ["array of animation types"],
    "transitions": ["array of transition types"],
    "hoverEffects": ["array of hover effects"]
  },
  "accessibility": {
    "features": ["array of accessibility features"],
    "ariaLabels": "boolean",
    "keyboardNavigation": "boolean",
    "screenReader": "boolean"
  },
  "responsive": {
    "breakpoints": ["array of breakpoint values"],
    "mobileFirst": "boolean",
    "adaptiveLayout": "boolean"
  }
}

Create detailed, actionable requirements that can be used to generate code.`;
    }
  }

  async execute(input: {
    intentAnalysis: IntentAnalysis;
    uxPatterns: UXPatternSelection;
    validation: ValidationResult;
  }): Promise<AgentResult> {
    this.log('Starting UI requirement synthesis', { 
      primaryIntent: input.intentAnalysis.primaryIntent,
      suggestedMode: input.validation.suggestedMode
    });

    const userPrompt = `Synthesize UI requirements from the following analyses:

Intent Analysis:
- Primary Intent: ${input.intentAnalysis.primaryIntent}
- Features: ${input.intentAnalysis.features.join(', ')}
- Target Audience: ${input.intentAnalysis.targetAudience}
- Platform: ${input.intentAnalysis.platform}

UX Patterns:
- Primary Pattern: ${input.uxPatterns.primaryPattern.name}
- Layout Strategy: ${input.uxPatterns.layoutStrategy}
- Navigation Strategy: ${input.uxPatterns.navigationStrategy}
- Recommended Components: ${input.uxPatterns.recommendedComponents.join(', ')}

Validation:
- Complexity: ${input.validation.complexityAssessment}
- Suggested Mode: ${input.validation.suggestedMode}
- Issues: ${input.validation.issues.map(i => i.message).join(', ')}

Create comprehensive UI requirements that address all the above inputs and are ready for code generation.

Return only the JSON object with the UI requirements.`;

    const result = await this.callLLM(userPrompt, this.systemPrompt, 0.5);

    if (result.success) {
      try {
        const requirements: UIRequirement = JSON.parse(result.data);
        this.log('UI requirement synthesis completed', { 
          components: requirements.components.length,
          layout: requirements.layout.type
        });
        
        return {
          ...result,
          data: requirements
        };
      } catch (parseError) {
        this.error('Failed to parse UI requirement synthesis result', parseError);
        return {
          success: false,
          data: null,
          error: 'Failed to parse UI requirement synthesis result',
          cost: result.cost,
          duration: result.duration
        };
      }
    }

    return result;
  }
} 