import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAuditService, AuditRequest, LLMProvider } from '../../../../services/audit.service';

// Validation schemas
const AuditRequestSchema = z.object({
  url: z.string().url('Valid URL is required'),
  projectId: z.string().optional(),
  auditType: z.enum(['full', 'performance', 'accessibility', 'copy']).default('full')
});

// Types
interface FrictionPoint {
  type: 'copy' | 'ux' | 'performance' | 'accessibility';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  suggestion: string;
}

interface AccessibilityViolation {
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

interface AuditSuggestion {
  category: 'copy' | 'ux' | 'performance' | 'accessibility';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  implementation: string;
  estimatedImpact: string;
}

interface AuditResponse {
  audit: {
    headlineGrade: number; // 1-10 score
    frictionPoints: FrictionPoint[];
    performanceScore: number; // 0-100
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
}

// Audit endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = AuditRequestSchema.parse(body);

    // Determine LLM provider from request or environment
    const provider: LLMProvider = body.provider || (process.env.DEFAULT_LLM_PROVIDER as LLMProvider) || 'openai';
    
    // Create audit service with specified provider
    const auditService = createAuditService(provider);
    
    // Execute audit
    const auditRequest: AuditRequest = {
      url: validatedData.url,
      projectId: validatedData.projectId,
      auditType: validatedData.auditType,
      provider
    };
    
    const auditResponse = await auditService.executeAudit(auditRequest);

    return NextResponse.json(auditResponse);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Invalid request data',
          details: error.errors
        },
        timestamp: new Date()
      }, { status: 400 });
    }

    console.error('Error executing audit:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'AUDIT_ERROR',
        message: 'Audit execution failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      timestamp: new Date()
    }, { status: 500 });
  }
} 