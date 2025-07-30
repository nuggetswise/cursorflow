import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schemas
const CreatePRDRequestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  template: z.string().min(1, 'Template is required'),
  features: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Feature name is required'),
    description: z.string().min(1, 'Feature description is required'),
    priority: z.enum(['low', 'medium', 'high']),
    acceptanceCriteria: z.array(z.string())
  })),
  userStories: z.array(z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'User story title is required'),
    description: z.string().min(1, 'User story description is required'),
    acceptanceCriteria: z.array(z.string()),
    priority: z.number().min(1)
  })),
  technicalRequirements: z.array(z.object({
    id: z.string().optional(),
    category: z.enum(['frontend', 'backend', 'database', 'integration']),
    requirement: z.string().min(1, 'Requirement is required'),
    priority: z.enum(['low', 'medium', 'high'])
  })),
  userId: z.string().min(1, 'User ID is required')
});

const UpdatePRDRequestSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  features: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1),
    description: z.string().min(1),
    priority: z.enum(['low', 'medium', 'high']),
    acceptanceCriteria: z.array(z.string())
  })).optional(),
  userStories: z.array(z.object({
    id: z.string().optional(),
    title: z.string().min(1),
    description: z.string().min(1),
    acceptanceCriteria: z.array(z.string()),
    priority: z.number().min(1)
  })).optional(),
  technicalRequirements: z.array(z.object({
    id: z.string().optional(),
    category: z.enum(['frontend', 'backend', 'database', 'integration']),
    requirement: z.string().min(1),
    priority: z.enum(['low', 'medium', 'high'])
  })).optional()
});

// Types
interface PRD {
  id: string;
  title: string;
  description: string;
  template: string;
  features: Feature[];
  userStories: UserStory[];
  technicalRequirements: TechnicalRequirement[];
  userId: string;
  status: 'draft' | 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

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

// Create PRD endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreatePRDRequestSchema.parse(body);

    // Generate IDs for features, user stories, and technical requirements
    const features = validatedData.features.map(feature => ({
      ...feature,
      id: feature.id || `feature_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }));

    const userStories = validatedData.userStories.map(story => ({
      ...story,
      id: story.id || `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }));

    const technicalRequirements = validatedData.technicalRequirements.map(req => ({
      ...req,
      id: req.id || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }));

    const prd: PRD = {
      id: `prd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: validatedData.title,
      description: validatedData.description,
      template: validatedData.template,
      features,
      userStories,
      technicalRequirements,
      userId: validatedData.userId,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // TODO: Save to database
    // await prisma.prd.create({ data: prd });

    return NextResponse.json({
      prd,
      success: true
    }, { status: 201 });

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

    console.error('Error creating PRD:', error);
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

// Get PRDs endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status') as 'draft' | 'active' | 'archived' | undefined;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'User ID is required'
        },
        timestamp: new Date()
      }, { status: 400 });
    }

    // TODO: Fetch from database with filters
    // const prds = await prisma.prd.findMany({
    //   where: {
    //     userId,
    //     ...(status && { status })
    //   },
    //   skip: offset,
    //   take: limit,
    //   orderBy: { createdAt: 'desc' }
    // });

    // Mock data for now
    const prds: PRD[] = [];
    const total = 0;

    return NextResponse.json({
      prds,
      total,
      success: true
    });

  } catch (error) {
    console.error('Error fetching PRDs:', error);
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