import { Request, Response, NextFunction } from 'express';
import { BudgetConfig } from '../types';

export interface BudgetGuardOptions {
  budget: BudgetConfig;
  userId: string;
}

export class BudgetGuard {
  private budget: BudgetConfig;
  private userBudgets: Map<string, { spent: number; startTime: number }> = new Map();

  constructor(budget: BudgetConfig) {
    this.budget = budget;
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const userId = req.headers['x-user-id'] as string || 'anonymous';
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'MISSING_USER_ID',
            message: 'User ID is required for budget tracking'
          }
        });
      }

      const userBudget = this.getUserBudget(userId);
      const currentTime = Date.now();

      // Check if budget period has reset (daily reset)
      if (currentTime - userBudget.startTime > 24 * 60 * 60 * 1000) {
        this.resetUserBudget(userId);
      }

      // Check if user has exceeded budget
      if (userBudget.spent >= this.budget.maxCost) {
        return res.status(429).json({
          success: false,
          error: {
            code: 'BUDGET_EXCEEDED',
            message: `Daily budget limit of $${this.budget.maxCost} exceeded`,
            details: {
              spent: userBudget.spent,
              limit: this.budget.maxCost,
              remaining: 0
            }
          }
        });
      }

      // Add budget info to request for tracking
      req.budgetInfo = {
        userId,
        spent: userBudget.spent,
        limit: this.budget.maxCost,
        remaining: this.budget.maxCost - userBudget.spent
      };

      return next();
    };
  }

  private getUserBudget(userId: string): { spent: number; startTime: number } {
    if (!this.userBudgets.has(userId)) {
      this.userBudgets.set(userId, { spent: 0, startTime: Date.now() });
    }
    return this.userBudgets.get(userId)!;
  }

  private resetUserBudget(userId: string): void {
    this.userBudgets.set(userId, { spent: 0, startTime: Date.now() });
  }

  trackSpending(userId: string, amount: number): void {
    const userBudget = this.getUserBudget(userId);
    userBudget.spent += amount;
    
    console.log(`💰 Budget tracking: User ${userId} spent $${amount.toFixed(4)}, total: $${userBudget.spent.toFixed(4)}`);
  }

  getBudgetStatus(userId: string): {
    spent: number;
    limit: number;
    remaining: number;
    percentage: number;
  } {
    const userBudget = this.getUserBudget(userId);
    const remaining = Math.max(0, this.budget.maxCost - userBudget.spent);
    const percentage = (userBudget.spent / this.budget.maxCost) * 100;

    return {
      spent: userBudget.spent,
      limit: this.budget.maxCost,
      remaining,
      percentage
    };
  }
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      budgetInfo?: {
        userId: string;
        spent: number;
        limit: number;
        remaining: number;
      };
    }
  }
} 