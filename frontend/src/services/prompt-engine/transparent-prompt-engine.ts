// Transparent Prompt Engine for CursorFlow
// Makes AI reasoning visible and explainable

export interface TransparentPromptConfig {
  task: string;
  context: Record<string, any>;
  data: any;
  reasoningSteps: string[];
  outputFormat: string;
  explainabilityLevel: 'basic' | 'detailed' | 'expert';
  showReasoning: boolean;
  showConfidence: boolean;
  showAlternatives: boolean;
}

export interface TransparentResponse<T = any> {
  result: T;
  reasoning: {
    steps: string[];
    confidence: number;
    alternatives: string[];
    evidence: string[];
    limitations: string[];
  };
  metadata: {
    promptVersion: string;
    modelUsed: string;
    tokensUsed: number;
    processingTime: number;
    timestamp: string;
  };
}

import { PromptLoaderService, PromptConfig } from './prompt-loader.service';

export class TransparentPromptEngine {
  private promptLoader: PromptLoaderService;

  constructor() {
    this.promptLoader = new PromptLoaderService();
  }

  private initializeTemplates() {
    // PRD Generation Template
    this.promptTemplates.set('prd-generation', `
You are a senior product manager with 10+ years of experience in software development.

TASK: Generate a comprehensive Product Requirements Document (PRD)

CONTEXT:
- Industry: {industry}
- Target Audience: {audience}
- Business Goals: {goals}
- Technical Constraints: {constraints}

INPUT DATA:
{data}

REASONING FRAMEWORK:
1. Analyze the business problem and user needs
2. Identify key stakeholders and their requirements
3. Define success metrics and KPIs
4. Prioritize features based on impact and effort
5. Consider technical feasibility and constraints
6. Plan for scalability and future growth

OUTPUT FORMAT:
{
  "title": "string",
  "problem": "string",
  "solution": "string",
  "features": [
    {
      "name": "string",
      "description": "string",
      "priority": "high|medium|low",
      "rationale": "string",
      "acceptanceCriteria": ["string"]
    }
  ],
  "userStories": [
    {
      "title": "string",
      "description": "string",
      "rationale": "string"
    }
  ],
  "successMetrics": {
    "primary": ["string"],
    "secondary": ["string"]
  },
  "risks": [
    {
      "risk": "string",
      "mitigation": "string",
      "probability": "high|medium|low"
    }
  ]
}

EXPLAINABILITY REQUIREMENTS:
- Show your reasoning for each feature priority
- Explain why certain user stories are critical
- Justify success metrics choices
- Identify potential risks and mitigation strategies
`);

    // Code Analysis Template
    this.promptTemplates.set('code-analysis', `
You are a senior software architect with expertise in {technologies}.

TASK: Analyze code quality and provide improvement recommendations

CONTEXT:
- Project Type: {projectType}
- Codebase Size: {size}
- Team Experience: {experience}
- Performance Requirements: {performance}

INPUT DATA:
{data}

REASONING FRAMEWORK:
1. Assess code structure and organization
2. Evaluate performance implications
3. Identify security vulnerabilities
4. Analyze maintainability and scalability
5. Consider user experience impact
6. Recommend specific improvements

OUTPUT FORMAT:
{
  "overallScore": "number (1-10)",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "recommendations": [
    {
      "category": "performance|security|maintainability|ux",
      "issue": "string",
      "impact": "high|medium|low",
      "solution": "string",
      "rationale": "string",
      "effort": "high|medium|low"
    }
  ],
  "priorityOrder": ["string"],
  "estimatedTimeline": "string"
}

EXPLAINABILITY REQUIREMENTS:
- Explain why each issue has its specific impact level
- Justify the priority order of recommendations
- Provide evidence for your assessments
- Acknowledge any limitations in your analysis
`);

    // Design Critique Template
    this.promptTemplates.set('design-critique', `
You are a senior UX/UI designer with expertise in {domains}.

TASK: Provide comprehensive design critique and improvement suggestions

CONTEXT:
- Website URL: {url}
- Target Audience: {audience}
- Business Goals: {goals}
- Industry: {industry}

INPUT DATA:
{data}

REASONING FRAMEWORK:
1. Analyze visual hierarchy and information architecture
2. Evaluate user flow and interaction patterns
3. Assess accessibility and inclusivity
4. Consider performance impact on user experience
5. Analyze content clarity and effectiveness
6. Identify conversion optimization opportunities

OUTPUT FORMAT:
{
  "overallScore": "number (1-10)",
  "headlineGrade": "number (1-10)",
  "frictionPoints": [
    {
      "type": "ux|performance|accessibility|content",
      "severity": "critical|high|medium|low",
      "description": "string",
      "location": "string",
      "userImpact": "string",
      "suggestion": "string",
      "rationale": "string"
    }
  ],
  "suggestions": [
    {
      "category": "ux|performance|accessibility|content",
      "priority": "critical|high|medium|low",
      "title": "string",
      "description": "string",
      "implementation": "string",
      "expectedImpact": "string",
      "confidence": "number (0-1)",
      "evidence": "string"
    }
  ],
  "strengths": ["string"],
  "opportunities": ["string"]
}

EXPLAINABILITY REQUIREMENTS:
- Explain the reasoning behind each severity assessment
- Justify priority levels with user impact analysis
- Provide evidence for your recommendations
- Acknowledge subjective aspects of design evaluation
- Consider different user perspectives and needs
`);
  }

  private initializeReasoningFrameworks() {
    this.reasoningFrameworks.set('prd-generation', [
      'Business Problem Analysis',
      'Stakeholder Requirements',
      'Feature Prioritization',
      'Technical Feasibility',
      'Success Metrics Definition',
      'Risk Assessment'
    ]);

    this.reasoningFrameworks.set('code-analysis', [
      'Code Structure Assessment',
      'Performance Analysis',
      'Security Evaluation',
      'Maintainability Review',
      'User Experience Impact',
      'Improvement Prioritization'
    ]);

    this.reasoningFrameworks.set('design-critique', [
      'Visual Hierarchy Analysis',
      'User Flow Evaluation',
      'Accessibility Assessment',
      'Performance Impact',
      'Content Effectiveness',
      'Conversion Optimization'
    ]);
  }

  async generateTransparentPrompt<T>(
    config: TransparentPromptConfig
  ): Promise<TransparentResponse<T>> {
    const template = this.promptTemplates.get(config.task);
    if (!template) {
      throw new Error(`No template found for task: ${config.task}`);
    }

    const reasoningFramework = this.reasoningFrameworks.get(config.task) || [];
    
    const enhancedPrompt = this.buildEnhancedPrompt(template, config, reasoningFramework);
    
    // Call LLM with transparent prompt
    const response = await this.callLLMWithTransparency(enhancedPrompt, config);
    
    return this.parseTransparentResponse(response, config);
  }

  private buildEnhancedPrompt(
    template: string,
    config: TransparentPromptConfig,
    reasoningFramework: string[]
  ): string {
    let prompt = template;

    // Replace placeholders
    prompt = prompt.replace('{data}', JSON.stringify(config.data, null, 2));
    
    // Add context
    Object.entries(config.context).forEach(([key, value]) => {
      prompt = prompt.replace(`{${key}}`, value);
    });

    // Add explainability requirements
    if (config.showReasoning) {
      prompt += `

EXPLAINABILITY REQUIREMENTS:
Please show your reasoning for each major decision:

${reasoningFramework.map((step, index) => `${index + 1}. ${step}`).join('\n')}

For each assessment, provide:
- The reasoning behind your evaluation
- Evidence or criteria used
- Confidence level in your assessment
- Alternative perspectives to consider
- Limitations of your analysis

OUTPUT FORMAT:
Please structure your response as:
{
  "result": { /* your main analysis result */ },
  "reasoning": {
    "steps": ["step 1 reasoning", "step 2 reasoning", ...],
    "confidence": 0.85,
    "alternatives": ["alternative approach 1", "alternative approach 2"],
    "evidence": ["evidence 1", "evidence 2"],
    "limitations": ["limitation 1", "limitation 2"]
  }
}`;
    }

    return prompt;
  }

  private async callLLMWithTransparency(
    prompt: string,
    config: TransparentPromptConfig
  ): Promise<any> {
    // This would integrate with your actual LLM service
    // For now, returning a mock response structure
    return {
      result: {},
      reasoning: {
        steps: [],
        confidence: 0.85,
        alternatives: [],
        evidence: [],
        limitations: []
      }
    };
  }

  private parseTransparentResponse<T>(
    response: any,
    config: TransparentPromptConfig
  ): TransparentResponse<T> {
    return {
      result: response.result as T,
      reasoning: {
        steps: response.reasoning?.steps || [],
        confidence: response.reasoning?.confidence || 0.5,
        alternatives: response.reasoning?.alternatives || [],
        evidence: response.reasoning?.evidence || [],
        limitations: response.reasoning?.limitations || []
      },
      metadata: {
        promptVersion: '1.0',
        modelUsed: 'gpt-4',
        tokensUsed: 0, // Would be calculated
        processingTime: 0, // Would be measured
        timestamp: new Date().toISOString()
      }
    };
  }

  // Specialized methods for different tasks
  async generatePRD(description: string, context: any): Promise<TransparentResponse<any>> {
    return this.generateTransparentPrompt({
      task: 'prd-generation',
      context,
      data: { description },
      reasoningSteps: [],
      outputFormat: '',
      explainabilityLevel: 'detailed',
      showReasoning: true,
      showConfidence: true,
      showAlternatives: true
    });
  }

  async analyzeCode(code: string, context: any): Promise<TransparentResponse<any>> {
    return this.generateTransparentPrompt({
      task: 'code-analysis',
      context,
      data: { code },
      reasoningSteps: [],
      outputFormat: '',
      explainabilityLevel: 'detailed',
      showReasoning: true,
      showConfidence: true,
      showAlternatives: true
    });
  }

  async critiqueDesign(auditData: any, context: any): Promise<TransparentResponse<any>> {
    return this.generateTransparentPrompt({
      task: 'design-critique',
      context,
      data: auditData,
      reasoningSteps: [],
      outputFormat: '',
      explainabilityLevel: 'detailed',
      showReasoning: true,
      showConfidence: true,
      showAlternatives: true
    });
  }
} 