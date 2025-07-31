import { createPromptService, LLMProvider } from './prompt.service';

// Audit types
export interface AuditRequest {
  url: string;
  projectId?: string;
  auditType: 'full' | 'performance' | 'accessibility' | 'copy';
  provider?: LLMProvider;
}

export interface FrictionPoint {
  type: 'copy' | 'ux' | 'performance' | 'accessibility';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  suggestion: string;
}

export interface AccessibilityViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  nodes: Array<{
    html: string;
    target: string[];
  }>;
}

export interface AuditSuggestion {
  category: 'copy' | 'ux' | 'performance' | 'accessibility';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  implementation: string;
  estimatedImpact: string;
}

export interface AuditResponse {
  audit: {
    headlineGrade: number;
    frictionPoints: FrictionPoint[];
    performanceScore: number;
    accessibilityViolations: AccessibilityViolation[];
    suggestions: AuditSuggestion[];
    copyAnalysis: {
      readabilityScore: number;
      clarityIssues: string[];
      improvementSuggestions: string[];
    };
    performanceMetrics: {
      firstContentfulPaint: number;
      largestContentfulPaint: number;
      cumulativeLayoutShift: number;
      firstInputDelay: number;
      speedIndex: number;
    };
    accessibilityMetrics: {
      violations: number;
      passes: number;
      incomplete: number;
      inapplicable: number;
    };
  };
  success: boolean;
  error?: string;
  provider: LLMProvider;
}

// Audit Service Class
export class AuditService {
  private promptService: any;

  constructor(provider: LLMProvider = 'openai') {
    this.promptService = createPromptService(provider);
  }

  // Execute comprehensive audit
  async executeAudit(request: AuditRequest): Promise<AuditResponse> {
    try {
      const provider = request.provider || (process.env.DEFAULT_LLM_PROVIDER as LLMProvider) || 'openai';
      this.promptService = createPromptService(provider);

      // Fetch website content
      const websiteContent = await this.fetchWebsiteContent(request.url);
      
      // Execute different audit types
      const results = await Promise.all([
        this.auditCopy(websiteContent, provider),
        this.auditUX(websiteContent, provider),
        this.auditPerformance(request.url, provider),
        this.auditAccessibility(request.url, provider)
      ]);

      const [copyAnalysis, uxAnalysis, performanceAnalysis, accessibilityAnalysis] = results;

      // Calculate overall scores
      const headlineGrade = this.calculateHeadlineGrade(copyAnalysis, uxAnalysis);
      const performanceScore = performanceAnalysis.score;

      // Compile friction points
      const frictionPoints = [
        ...copyAnalysis.frictionPoints,
        ...uxAnalysis.frictionPoints,
        ...performanceAnalysis.frictionPoints,
        ...accessibilityAnalysis.frictionPoints
      ];

      // Compile suggestions
      const suggestions = [
        ...copyAnalysis.suggestions,
        ...uxAnalysis.suggestions,
        ...performanceAnalysis.suggestions,
        ...accessibilityAnalysis.suggestions
      ];

      return {
        audit: {
          headlineGrade,
          frictionPoints,
          performanceScore,
          accessibilityViolations: accessibilityAnalysis.violations,
          suggestions,
          copyAnalysis: copyAnalysis.analysis,
          performanceMetrics: performanceAnalysis.metrics,
          accessibilityMetrics: accessibilityAnalysis.metrics
        },
        success: true,
        provider
      };

    } catch (error) {
      console.error('Audit execution error:', error);
      return {
        audit: {
          headlineGrade: 0,
          frictionPoints: [],
          performanceScore: 0,
          accessibilityViolations: [],
          suggestions: [],
          copyAnalysis: {
            readabilityScore: 0,
            clarityIssues: [],
            improvementSuggestions: []
          },
          performanceMetrics: {
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0,
            speedIndex: 0
          },
          accessibilityMetrics: {
            violations: 0,
            passes: 0,
            incomplete: 0,
            inapplicable: 0
          }
        },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: request.provider || 'openai'
      };
    }
  }

  // Fetch website content
  private async fetchWebsiteContent(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      
      // Extract text content (simplified)
      const textContent = html
        .replace(/<script[^>]*>.*?<\/script>/gs, '')
        .replace(/<style[^>]*>.*?<\/style>/gs, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      return textContent;
    } catch (error) {
      console.error('Error fetching website content:', error);
      throw new Error('Failed to fetch website content');
    }
  }

  // Audit copy and content
  private async auditCopy(content: string, provider: LLMProvider): Promise<any> {
    try {
      const prompt = `Analyze the following website content for copy quality, clarity, and effectiveness:

Content: ${content.substring(0, 2000)}

Please provide:
1. Readability score (1-10)
2. Clarity issues found
3. Improvement suggestions
4. Friction points
5. Specific suggestions for improvement

Format the response as JSON with the following structure:
{
  "analysis": {
    "readabilityScore": number,
    "clarityIssues": [string],
    "improvementSuggestions": [string]
  },
  "frictionPoints": [
    {
      "type": "copy",
      "severity": "low|medium|high|critical",
      "description": string,
      "location": string,
      "suggestion": string
    }
  ],
  "suggestions": [
    {
      "category": "copy",
      "priority": "low|medium|high|critical",
      "title": string,
      "description": string,
      "implementation": string,
      "estimatedImpact": string
    }
  ]
}`;

      const response = await this.promptService.generateResponse(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Copy audit error:', error);
      return this.getDefaultCopyAnalysis();
    }
  }

  // Audit UX and design
  private async auditUX(content: string, provider: LLMProvider): Promise<any> {
    try {
      const prompt = `Analyze the following website content for UX and design issues:

Content: ${content.substring(0, 2000)}

Please identify:
1. UX friction points
2. Design issues
3. User flow problems
4. Call-to-action effectiveness
5. Visual hierarchy issues

Format the response as JSON with friction points and suggestions.`;

      const response = await this.promptService.generateResponse(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('UX audit error:', error);
      return this.getDefaultUXAnalysis();
    }
  }

  // Audit performance
  private async auditPerformance(url: string, provider: LLMProvider): Promise<any> {
    try {
      const prompt = `Analyze the performance of this website: ${url}

Please provide:
1. Performance score (0-100)
2. Key performance metrics
3. Performance issues
4. Optimization suggestions

Format the response as JSON.`;

      const response = await this.promptService.generateResponse(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Performance audit error:', error);
      return this.getDefaultPerformanceAnalysis();
    }
  }

  // Audit accessibility
  private async auditAccessibility(url: string, provider: LLMProvider): Promise<any> {
    try {
      const prompt = `Analyze the accessibility of this website: ${url}

Please provide:
1. Accessibility violations
2. WCAG compliance issues
3. Accessibility metrics
4. Improvement suggestions

Format the response as JSON.`;

      const response = await this.promptService.generateResponse(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Accessibility audit error:', error);
      return this.getDefaultAccessibilityAnalysis();
    }
  }

  // Calculate headline grade
  private calculateHeadlineGrade(copyAnalysis: any, uxAnalysis: any): number {
    const copyScore = copyAnalysis.analysis?.readabilityScore || 5;
    const uxScore = 7; // Mock UX score
    return Math.round((copyScore + uxScore) / 2);
  }

  // Default analysis responses
  private getDefaultCopyAnalysis() {
    return {
      analysis: {
        readabilityScore: 5,
        clarityIssues: ['Content analysis failed'],
        improvementSuggestions: ['Review content manually']
      },
      frictionPoints: [],
      suggestions: []
    };
  }

  private getDefaultUXAnalysis() {
    return {
      frictionPoints: [],
      suggestions: []
    };
  }

  private getDefaultPerformanceAnalysis() {
    return {
      score: 50,
      metrics: {
        firstContentfulPaint: 2000,
        largestContentfulPaint: 3000,
        cumulativeLayoutShift: 0.1,
        firstInputDelay: 100,
        speedIndex: 2500
      },
      frictionPoints: [],
      suggestions: []
    };
  }

  private getDefaultAccessibilityAnalysis() {
    return {
      violations: [],
      metrics: {
        violations: 0,
        passes: 0,
        incomplete: 0,
        inapplicable: 0
      },
      frictionPoints: [],
      suggestions: []
    };
  }
}

// Factory function
export function createAuditService(provider?: LLMProvider): AuditService {
  return new AuditService(provider);
} 