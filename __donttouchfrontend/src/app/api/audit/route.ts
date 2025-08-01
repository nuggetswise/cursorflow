import { NextRequest, NextResponse } from 'next/server';
import { AIDesignCritiqueService } from '../services/ai-design-critique.service';
import { validateAuditRequest } from '../middleware/validation';
import { rateLimit } from '../middleware/rate-limit';
import { logger } from '../utils/logger';

const auditService = new AIDesignCritiqueService();

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, 'audit', 10, 60); // 10 requests per minute
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validate request
    const validation = validateAuditRequest(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.errors },
        { status: 400 }
      );
    }

    const { url, projectId, auditType = 'full' } = body;

    logger.info('Starting audit', { url, projectId, auditType });

    // Run the audit
    const audit = await auditService.auditLivePreview(url, auditType);

    // Store audit result if projectId is provided
    if (projectId) {
      await storeAuditResult(projectId, url, audit);
    }

    logger.info('Audit completed successfully', { url, projectId });

    return NextResponse.json({
      success: true,
      audit,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Audit failed', { error: error.message, stack: error.stack });
    
    return NextResponse.json(
      { 
        error: 'Audit failed', 
        message: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const audits = await getAuditHistory(projectId, limit, offset);

    return NextResponse.json({
      success: true,
      audits: audits.data,
      total: audits.total,
      page: Math.floor(offset / limit) + 1,
      limit,
      hasMore: audits.hasMore
    });

  } catch (error) {
    logger.error('Failed to get audit history', { error: error.message });
    
    return NextResponse.json(
      { error: 'Failed to get audit history' },
      { status: 500 }
    );
  }
}

async function storeAuditResult(projectId: string, url: string, audit: any) {
  // Store audit result in Firestore
  const auditDoc = {
    projectId,
    url,
    audit,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // This would be implemented with Firebase Admin SDK
  // await db.collection('audits').add(auditDoc);
  
  logger.info('Audit result stored', { projectId, url });
}

async function getAuditHistory(projectId: string, limit: number, offset: number) {
  // Get audit history from Firestore
  // This would be implemented with Firebase Admin SDK
  // const snapshot = await db.collection('audits')
  //   .where('projectId', '==', projectId)
  //   .orderBy('createdAt', 'desc')
  //   .limit(limit)
  //   .offset(offset)
  //   .get();

  // Mock implementation for now
  return {
    data: [],
    total: 0,
    hasMore: false
  };
} 