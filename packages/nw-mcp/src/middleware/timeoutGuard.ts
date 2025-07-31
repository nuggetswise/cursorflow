import { Request, Response, NextFunction } from 'express';
import { BudgetConfig } from '../types';

export class TimeoutGuard {
  private maxTime: number;
  private activeRequests: Map<string, NodeJS.Timeout> = new Map();

  constructor(maxTime: number) {
    this.maxTime = maxTime;
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const requestId = this.generateRequestId();
      const userId = req.headers['x-user-id'] as string || 'anonymous';

      // Set timeout for this request
      const timeout = setTimeout(() => {
        this.handleTimeout(requestId, res);
      }, this.maxTime);

      // Store the timeout reference
      this.activeRequests.set(requestId, timeout);

      // Add request ID to response headers for tracking
      res.setHeader('X-Request-ID', requestId);

      // Override res.end to clean up timeout
      const originalEnd = res.end;
      const self = this;
      res.end = function(chunk?: any, encoding?: any) {
        clearTimeout(timeout);
        self.activeRequests.delete(requestId);
        return originalEnd.call(this, chunk, encoding);
      };

      // Add timeout info to request
      req.timeoutInfo = {
        requestId,
        userId,
        maxTime: this.maxTime,
        startTime: Date.now()
      };

      next();
    };
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleTimeout(requestId: string, res: Response): void {
    // Clean up the timeout reference
    this.activeRequests.delete(requestId);

    // Only send response if it hasn't been sent yet
    if (!res.headersSent) {
      res.status(408).json({
        success: false,
        error: {
          code: 'REQUEST_TIMEOUT',
          message: `Request timed out after ${this.maxTime}ms`,
          details: {
            requestId,
            maxTime: this.maxTime
          }
        }
      });
    }
  }

  getActiveRequests(): number {
    return this.activeRequests.size;
  }

  clearAllTimeouts(): void {
    for (const [requestId, timeout] of this.activeRequests) {
      clearTimeout(timeout);
      this.activeRequests.delete(requestId);
    }
  }
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      timeoutInfo?: {
        requestId: string;
        userId: string;
        maxTime: number;
        startTime: number;
      };
    }
  }
} 