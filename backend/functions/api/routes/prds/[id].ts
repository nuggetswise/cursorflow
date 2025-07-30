import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for update
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

// Get PRD by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'PRD ID is required'
        },
        timestamp: new Date()
      }, { status: 400 });
    }

    // TODO: Fetch from database
    // const prd = await prisma.prd.findUnique({
    //   where: { id }
    // });

    // Mock data for now
    const prd: PRD | null = null;

    if (!prd) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'PRD not found'
        },
        timestamp: new Date()
      }, { status: 404 });
    }

    return NextResponse.json({
      prd,
      success: true
    });

  } catch (error) {
    console.error('Error fetching PRD:', error);
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

// Update PRD
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const validatedData = UpdatePRDRequestSchema.parse(body);

    if (!id) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'PRD ID is required'
        },
        timestamp: new Date()
      }, { status: 400 });
    }

    // TODO: Update in database
    // const prd = await prisma.prd.update({
    //   where: { id },
    //   data: {
    //     ...validatedData,
    //     updatedAt: new Date()
    //   }
    // });

    // Mock data for now
    const prd: PRD | null = null;

    if (!prd) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'PRD not found'
        },
        timestamp: new Date()
      }, { status: 404 });
    }

    return NextResponse.json({
      prd,
      success: true
    });

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

    console.error('Error updating PRD:', error);
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

// Delete PRD
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'PRD ID is required'
        },
        timestamp: new Date()
      }, { status: 400 });
    }

    // TODO: Delete from database
    // await prisma.prd.delete({
    //   where: { id }
    // });

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error('Error deleting PRD:', error);
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