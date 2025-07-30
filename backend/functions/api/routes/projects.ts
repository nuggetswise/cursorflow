import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schemas
const CreateProjectRequestSchema = z.object({
  prdId: z.string().min(1, 'PRD ID is required'),
  v0ChatId: z.string().min(1, 'V0 Chat ID is required'),
  deploymentUrl: z.string().url('Valid deployment URL is required'),
  userId: z.string().min(1, 'User ID is required')
});

// Types
interface Project {
  id: string;
  prdId: string;
  v0ChatId: string;
  deploymentUrl: string;
  userId: string;
  status: 'generating' | 'active' | 'archived';
  versions: ProjectVersion[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectVersion {
  id: string;
  version: number;
  deploymentUrl: string;
  changes: string;
  createdAt: Date;
}

// Create Project endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateProjectRequestSchema.parse(body);

    const project: Project = {
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      prdId: validatedData.prdId,
      v0ChatId: validatedData.v0ChatId,
      deploymentUrl: validatedData.deploymentUrl,
      userId: validatedData.userId,
      status: 'generating',
      versions: [{
        id: `version_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        version: 1,
        deploymentUrl: validatedData.deploymentUrl,
        changes: 'Initial project creation',
        createdAt: new Date()
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // TODO: Save to database
    // await prisma.project.create({ data: project });

    return NextResponse.json({
      project,
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

    console.error('Error creating project:', error);
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

// Get Projects endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

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
    // const projects = await prisma.project.findMany({
    //   where: { userId },
    //   skip: offset,
    //   take: limit,
    //   orderBy: { createdAt: 'desc' },
    //   include: {
    //     versions: {
    //       orderBy: { version: 'desc' },
    //       take: 1
    //     }
    //   }
    // });

    // Mock data for now
    const projects: Project[] = [];
    const total = 0;

    return NextResponse.json({
      projects,
      total,
      success: true
    });

  } catch (error) {
    console.error('Error fetching projects:', error);
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