import { NextRequest, NextResponse } from 'next/server';
import { TransparentPromptEngine } from '@/services/prompt-engine/transparent-prompt-engine';

const promptEngine = new TransparentPromptEngine();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, context } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'Project description is required' },
        { status: 400 }
      );
    }

    // Generate PRD using transparent prompt engine
    const prdResponse = await promptEngine.generatePRD(description, {
      industry: context?.industry || 'general',
      audience: context?.audience || 'general users',
      goals: context?.goals || ['create value for users'],
      constraints: context?.constraints || 'none specified'
    });

    return NextResponse.json({
      success: true,
      prd: prdResponse.result,
      reasoning: prdResponse.reasoning,
      metadata: prdResponse.metadata
    });

  } catch (error) {
    console.error('PRD generation failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate PRD',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // In a real app, this would fetch from database
    // For now, return mock data
    const mockPRD = {
      id: projectId,
      title: 'Sample PRD',
      problem: 'Users need a way to manage tasks efficiently',
      solution: 'A collaborative task management application',
      features: [
        {
          name: 'Task Creation',
          description: 'Users can create and assign tasks',
          priority: 'must-have',
          rationale: 'Core functionality required for task management'
        }
      ],
      userStories: [
        {
          title: 'As a user, I want to create tasks',
          description: 'I want to create new tasks with title and description',
          rationale: 'Basic task management functionality'
        }
      ],
      successMetrics: {
        primary: ['User adoption rate', 'Task completion rate'],
        secondary: ['Time to create task', 'User satisfaction score']
      },
      risks: [
        {
          risk: 'Low user adoption',
          probability: 'medium',
          impact: 'high',
          mitigation: 'User research and iterative design'
        }
      ]
    };

    return NextResponse.json({
      success: true,
      prd: mockPRD
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch PRD' },
      { status: 500 }
    );
  }
} 