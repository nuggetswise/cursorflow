import { NextRequest, NextResponse } from 'next/server';

// Get Audit History endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!projectId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Project ID is required'
        },
        timestamp: new Date()
      }, { status: 400 });
    }

    // TODO: Fetch from database
    // const audits = await prisma.audit.findMany({
    //   where: { projectId },
    //   skip: offset,
    //   take: limit,
    //   orderBy: { createdAt: 'desc' },
    //   select: {
    //     id: true,
    //     projectId: true,
    //     url: true,
    //     createdAt: true,
    //     results: {
    //       select: {
    //         headlineGrade: true,
    //         performanceScore: true,
    //         accessibilityViolations: true,
    //         suggestions: true
    //       }
    //     }
    //   }
    // });

    // Mock data for now
    const audits = [
      {
        id: 'audit_1',
        projectId,
        url: 'https://example.com',
        createdAt: new Date('2024-01-15T10:30:00Z'),
        headlineGrade: 7,
        performanceScore: 85,
        accessibilityViolations: 3,
        suggestionsCount: 5
      },
      {
        id: 'audit_2',
        projectId,
        url: 'https://example.com',
        createdAt: new Date('2024-01-10T14:20:00Z'),
        headlineGrade: 6,
        performanceScore: 78,
        accessibilityViolations: 5,
        suggestionsCount: 8
      }
    ];

    const total = audits.length;

    return NextResponse.json({
      audits,
      total,
      success: true
    });

  } catch (error) {
    console.error('Error fetching audit history:', error);
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