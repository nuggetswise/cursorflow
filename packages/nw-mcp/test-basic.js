// Basic test script for MCP server setup
const express = require('express');
const cors = require('cors');

// Simple test server
const app = express();
const PORT = 3001;

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      mode: 'test'
    }
  });
});

// Simple build endpoint for testing
app.post('/api/build', (req, res) => {
  try {
    const { prompt, userId } = req.body;
    
    if (!prompt || !userId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Prompt and userId are required'
        }
      });
    }

    console.log('🚀 Test build request received:', { prompt, userId });

    // Mock response
    const response = {
      success: true,
      data: {
        chatId: 'test-chat-123',
        projectUrl: 'https://v0.dev/projects/test-123',
        deploymentUrl: 'https://test-project.vercel.app',
        components: ['TodoList', 'TodoForm'],
        buildTime: 5000,
        cost: 0.50,
        files: []
      }
    };

    console.log('✅ Test build completed successfully');
    res.json(response);

  } catch (error) {
    console.error('❌ Test build failed:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'BUILD_ERROR',
        message: error.message || 'Unknown error occurred'
      }
    });
  }
});

// Budget status endpoint
app.get('/api/budget/:userId', (req, res) => {
  const { userId } = req.params;
  
  res.json({
    success: true,
    data: {
      userId,
      spent: 0.50,
      remaining: 9.50,
      limit: 10.0,
      currency: 'USD'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test MCP Server running on port ${PORT}`);
  console.log(`📊 Mode: test`);
  console.log(`💰 Budget limit: $10.00`);
  console.log(`⏱️ Timeout limit: 300000ms`);
  console.log(`\n🧪 Test endpoints:`);
  console.log(`   GET  /health`);
  console.log(`   POST /api/build`);
  console.log(`   GET  /api/budget/:userId`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
}); 