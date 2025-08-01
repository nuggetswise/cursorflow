import { NextRequest, NextResponse } from 'next/server';

// Mock database - in real app this would be Firestore
let projects = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'Modern e-commerce platform with AI-powered recommendations',
    status: 'in-progress',
    progress: 75,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-28',
    teamSize: 5,
    industry: 'E-commerce',
    targetAudience: 'Online Shoppers',
    userId: 'user1'
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'Collaborative task management for remote teams',
    status: 'review',
    progress: 90,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-27',
    teamSize: 3,
    industry: 'SaaS',
    targetAudience: 'Remote Teams',
    userId: 'user1'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let filteredProjects = projects;

    if (userId) {
      filteredProjects = filteredProjects.filter(p => p.userId === userId);
    }

    if (status) {
      filteredProjects = filteredProjects.filter(p => p.status === status);
    }

    return NextResponse.json({
      success: true,
      projects: filteredProjects,
      total: filteredProjects.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newProject = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 0,
      status: 'draft'
    };

    projects.push(newProject);

    return NextResponse.json({
      success: true,
      project: newProject
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      project: projects[projectIndex]
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    projects.splice(projectIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 