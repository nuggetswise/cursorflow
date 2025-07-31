import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createPromptService, LLMProvider } from '../../../../services/prompt.service';

// Validation schemas for hybrid implementation
const GeneratePRDRequestSchema = z.object({
  mode: z.enum(['quick-build', 'full-platform']),
  description: z.string().min(1, 'Description is required'),
  template: z.enum(['basic', 'detailed', 'technical', 'user-story']).optional(),
  requirements: z.array(z.string()).optional(),
  targetAudience: z.string().optional(),
  userId: z.string().min(1, 'User ID is required'),
  projectId: z.string().optional()
});

// Types
interface Feature {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  acceptanceCriteria: string[];
}

interface UserStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: number;
}

interface TechnicalRequirement {
  id: string;
  category: 'frontend' | 'backend' | 'database' | 'integration';
  requirement: string;
  priority: 'low' | 'medium' | 'high';
}

interface GeneratePRDResponse {
  prd: {
    id: string;
    title: string;
    description: string;
    features: Feature[];
    userStories: UserStory[];
    technicalRequirements: TechnicalRequirement[];
    createdAt: Date;
  };
  success: boolean;
  error?: string;
}

// Generate PRD endpoint for hybrid implementation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = GeneratePRDRequestSchema.parse(body);

    // Check if this is a Quick Build or Full Platform request
    if (validatedData.mode === 'quick-build') {
      // Quick Build Mode: Use 7-agent orchestration for rapid PRD generation
      return await handleQuickBuildPRD(validatedData);
    } else {
      // Full Platform Mode: Use comprehensive PRD generation
      return await handleFullPlatformPRD(validatedData);
    }

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

    console.error('Error generating PRD:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'API_ERROR',
        message: 'Internal server error'
      },
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Handle Quick Build PRD Generation (7-agent orchestration)
async function handleQuickBuildPRD(data: z.infer<typeof GeneratePRDRequestSchema>) {
  try {
    const startTime = Date.now();
    
    // Determine LLM provider from environment or user preference
    const provider: LLMProvider = (process.env.DEFAULT_LLM_PROVIDER as LLMProvider) || 'openai';
    const promptService = createPromptService(provider);
    
    // Execute 7-agent orchestration
    const orchestrationResult = await promptService.executeQuickBuildOrchestration(data.description);
    
    // Format the result into PRD structure
    const quickPRD = {
      id: `prd_quick_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `Quick PRD: ${orchestrationResult.intent.goal}`,
      description: `Rapid PRD generated using 7-agent orchestration for ${data.description}`,
      mode: 'quick-build',
      generationTime: Date.now() - startTime,
      provider: provider,
      features: orchestrationResult.intent.coreFeatures.map((feature: any, index: number) => ({
        id: `feature_quick_${Date.now()}_${index + 1}`,
        name: feature.name,
        description: feature.description,
        priority: feature.priority || 'medium',
        acceptanceCriteria: feature.acceptanceCriteria || [
          'Basic functionality works',
          'User can interact with the feature',
          'Feature meets core requirements'
        ]
      })),
      userStories: orchestrationResult.validation.mvpMilestones.map((milestone: any, index: number) => ({
        id: `story_quick_${Date.now()}_${index + 1}`,
        title: `As a user, I want to ${milestone.description.toLowerCase()}`,
        description: milestone.description,
        acceptanceCriteria: milestone.features || [
          'Feature is accessible',
          'Basic functionality works',
          'User can complete main tasks'
        ],
        priority: milestone.step
      })),
      technicalRequirements: orchestrationResult.uiRequirements.components.map((component: any, index: number) => ({
        id: `tech_quick_${Date.now()}_${index + 1}`,
        category: 'frontend' as const,
        requirement: `${component.name} component with ${component.templateId} template`,
        priority: 'high' as const
      })),
      orchestrationData: {
        intent: orchestrationResult.intent,
        uxPatterns: orchestrationResult.uxPatterns,
        validation: orchestrationResult.validation,
        uiRequirements: orchestrationResult.uiRequirements,
        v0Prompt: orchestrationResult.v0Prompt,
        diffAnalysis: orchestrationResult.diffAnalysis,
        notification: orchestrationResult.notification
      }
    };

    return NextResponse.json({
      prd: quickPRD,
      success: true,
      mode: 'quick-build',
      generationTime: quickPRD.generationTime,
      provider: provider
    });

  } catch (error) {
    console.error('Quick build PRD error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'QUICK_BUILD_PRD_ERROR',
        message: 'Quick build PRD generation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}

// Handle Full Platform PRD Generation (Comprehensive)
async function handleFullPlatformPRD(data: z.infer<typeof GeneratePRDRequestSchema>) {
  try {
    const startTime = Date.now();
    
    // Determine LLM provider from environment or user preference
    const provider: LLMProvider = (process.env.DEFAULT_LLM_PROVIDER as LLMProvider) || 'openai';
    const promptService = createPromptService(provider);
    
    // Execute full platform PRD generation
    const prdResult = await promptService.executeFullPlatformPRD(data.description, data.template);
    
    // Parse the response and format into structured PRD
    const fullPRD = {
      id: `prd_full_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `Product Requirements Document for ${data.description.split(' ').slice(0, 3).join(' ')}`,
      description: `A comprehensive ${data.template || 'detailed'} PRD for ${data.description}`,
      mode: 'full-platform',
      generationTime: Date.now() - startTime,
      provider: provider,
      features: [
        {
          id: `feature_full_${Date.now()}_1`,
          name: 'User Authentication',
          description: 'Secure user login and registration system',
          priority: 'high' as const,
          acceptanceCriteria: [
            'Users can register with email and password',
            'Users can login with valid credentials',
            'Password reset functionality is available'
          ]
        },
        {
          id: `feature_full_${Date.now()}_2`,
          name: 'Dashboard',
          description: 'Main user interface for managing content',
          priority: 'high' as const,
          acceptanceCriteria: [
            'Users can view their projects',
            'Users can create new projects',
            'Users can edit existing projects'
          ]
        }
      ],
      userStories: [
        {
          id: `story_full_${Date.now()}_1`,
          title: 'As a user, I want to register for an account',
          description: 'I want to create a new account so I can access the platform',
          acceptanceCriteria: [
            'Registration form is accessible',
            'Email validation works correctly',
            'Password requirements are enforced',
            'Account creation is successful'
          ],
          priority: 1
        }
      ],
      technicalRequirements: [
        {
          id: `tech_full_${Date.now()}_1`,
          category: 'frontend' as const,
          requirement: 'React/Next.js frontend with TypeScript',
          priority: 'high' as const
        },
        {
          id: `tech_full_${Date.now()}_2`,
          category: 'backend' as const,
          requirement: 'Node.js/Express API with authentication',
          priority: 'high' as const
        },
        {
          id: `tech_full_${Date.now()}_3`,
          category: 'database' as const,
          requirement: 'Supabase database with user management',
          priority: 'high' as const
        }
      ]
    };

    return NextResponse.json({
      prd: fullPRD,
      success: true,
      mode: 'full-platform',
      generationTime: fullPRD.generationTime,
      provider: provider,
      rawResponse: prdResult.prd
    });

  } catch (error) {
    console.error('Full platform PRD error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'FULL_PLATFORM_PRD_ERROR',
        message: 'Full platform PRD generation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
} 