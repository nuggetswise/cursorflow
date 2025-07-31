import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { z } from 'zod';

import { AgentOrchestrator } from './services/AgentOrchestrator';
import { V0Client } from './services/V0Client';
import { FileWriter } from './services/FileWriter';
import { BudgetGuard } from './middleware/budgetGuard';
import { TimeoutGuard } from './middleware/timeoutGuard';
import { EnvironmentConfig, BuildRequest, BuildResponse } from './types';

// Load environment variables
dotenv.config();

// Debug environment loading
console.log('🔧 Environment variables loaded:', {
  hasV0ApiKey: !!process.env.V0_API_KEY,
  v0ApiKeyLength: process.env.V0_API_KEY?.length || 0,
  nodeEnv: process.env.NODE_ENV,
  currentDir: process.cwd()
});

// Validation schemas
const BuildRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  approach: z.enum(['mcp-integration']).default('mcp-integration'),
  userId: z.string().min(1, 'User ID is required'),
  projectId: z.string().optional(),
  budget: z.number().positive().optional(),
  timeout: z.number().positive().optional(),
  v0Options: z.object({
    modelId: z.enum(['v0-1.5-sm', 'v0-1.5-md', 'v0-1.5-lg']).optional(),
    saveToWorkspace: z.boolean().optional(),
    fileName: z.string().optional()
  }).optional()
});

// Environment configuration
const config: EnvironmentConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  v0ApiKey: process.env.V0_API_KEY || '',
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
  cursorWorkspacePath: process.env.CURSOR_WORKSPACE_PATH || '/workspace',
  budget: {
    maxCost: parseFloat(process.env.MAX_COST || '10.0'),
    maxTime: parseInt(process.env.MAX_TIME || '300000'), // 5 minutes
    maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
    costPerToken: parseFloat(process.env.COST_PER_TOKEN || '0.00003')
  },
  mode: (process.env.NODE_ENV as 'development' | 'production') || 'development'
};

// Initialize services
const orchestrator = new AgentOrchestrator(config);
const v0Client = new V0Client(config);
const fileWriter = new FileWriter(config);
const budgetGuard = new BudgetGuard(config.budget);
const timeoutGuard = new TimeoutGuard(config.budget.maxTime);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.'
    }
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      mode: config.mode
    }
  });
});

// V0 MCP Tools endpoints
app.post('/tools/v0.generate', async (req, res) => {
  try {
    const { prompt, options = {} } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: { message: 'Prompt is required' }
      });
    }

    console.log('🚀 V0 MCP Tool: Generating component...');
    
    const result = await v0Client.generateComponents(prompt, options);
    
    return res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('❌ V0 MCP Tool error:', error);
    return res.status(500).json({
      success: false,
      error: { message: error instanceof Error ? error.message : 'Unknown error' }
    });
  }
});

app.post('/tools/v0.continue', async (req, res) => {
  try {
    const { chatId, message } = req.body;
    
    if (!chatId || !message) {
      return res.status(400).json({
        success: false,
        error: { message: 'Chat ID and message are required' }
      });
    }

    console.log('🔄 V0 MCP Tool: Continuing conversation...');
    
    const result = await v0Client.continueConversation(chatId, message);
    
    return res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('❌ V0 MCP Tool error:', error);
    return res.status(500).json({
      success: false,
      error: { message: error instanceof Error ? error.message : 'Unknown error' }
    });
  }
});

// Build endpoint
app.post('/api/build', 
  budgetGuard.middleware(),
  timeoutGuard.middleware(),
  async (req, res) => {
    try {
      // Validate request
      const validatedData = BuildRequestSchema.parse(req.body);
      
      console.log('🚀 Build request received:', {
        userId: validatedData.userId,
        approach: validatedData.approach,
        promptLength: validatedData.prompt.length
      });

      // Execute MCP integration orchestration
      const orchestrationResult = await orchestrator.executeMCPIntegrationOrchestration(validatedData);

      if (!orchestrationResult.v0Prompt) {
        throw new Error('Failed to generate V0 prompt');
      }

      // Generate components with v0.dev
      const v0Response = await v0Client.generateComponents(orchestrationResult.v0Prompt);

      // Write files to workspace
      const fileResult = await fileWriter.writeV0Files(v0Response.chatId, v0Response.components);

      // Track spending
      const totalCost = orchestrationResult.totalCost + v0Client.calculateCost(1000); // Estimate v0 cost
      budgetGuard.trackSpending(validatedData.userId, totalCost);

      // Prepare response
      const response: BuildResponse = {
        success: true,
        data: {
          chatId: v0Response.chatId,
          projectUrl: v0Response.projectUrl,
          deploymentUrl: v0Response.deploymentUrl,
          components: v0Response.components,
          buildTime: orchestrationResult.totalDuration,
          cost: totalCost,
          files: [],
          // previewUrl: fileResult.previewUrl
        }
      };

      console.log('✅ Build completed successfully:', {
        chatId: v0Response.chatId,
        cost: totalCost,
        buildTime: orchestrationResult.totalDuration
      });

      return res.json(response);

    } catch (error) {
      console.error('❌ Build failed:', error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: error.errors
          }
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'BUILD_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      });
    }
  }
);

// Export project endpoint
app.post('/api/export/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    
    console.log(`📦 Export request for chat: ${chatId}`);
    
    const exportResult = await v0Client.exportProject(chatId);
    
    res.json({
      success: true,
      data: exportResult
    });

  } catch (error) {
    console.error('❌ Export failed:', error);
    
    res.status(500).json({
      success: false,
      error: {
        code: 'EXPORT_ERROR',
        message: error instanceof Error ? error.message : 'Export failed'
      }
    });
  }
});

// Project status endpoint
app.get('/api/status/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const status = await v0Client.getProjectStatus(chatId);
    
    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('❌ Status check failed:', error);
    
    res.status(500).json({
      success: false,
      error: {
        code: 'STATUS_ERROR',
        message: error instanceof Error ? error.message : 'Status check failed'
      }
    });
  }
});

// Budget status endpoint
app.get('/api/budget/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    const budgetStatus = budgetGuard.getBudgetStatus(userId);
    
    res.json({
      success: true,
      data: budgetStatus
    });

  } catch (error) {
    console.error('❌ Budget status check failed:', error);
    
    res.status(500).json({
      success: false,
      error: {
        code: 'BUDGET_STATUS_ERROR',
        message: error instanceof Error ? error.message : 'Budget status check failed'
      }
    });
  }
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Unhandled error:', error);
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Nuggetwise MCP Server running on port ${PORT}`);
  console.log(`📊 Mode: ${config.mode}`);
  console.log(`💰 Budget limit: $${config.budget.maxCost}`);
  console.log(`⏱️ Timeout limit: ${config.budget.maxTime}ms`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  timeoutGuard.clearAllTimeouts();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  timeoutGuard.clearAllTimeouts();
  process.exit(0);
}); 