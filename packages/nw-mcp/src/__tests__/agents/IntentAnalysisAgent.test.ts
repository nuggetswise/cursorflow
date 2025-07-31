import { IntentAnalysisAgent } from '../agents/IntentAnalysisAgent';

describe('Intent Analysis Agent', () => {
  let agent: IntentAnalysisAgent;

  beforeEach(() => {
    agent = new IntentAnalysisAgent();
  });

  describe('Basic Intent Detection', () => {
    test('should detect simple todo app intent', async () => {
      const input = "Create a todo app with dark mode";
      
      const result = await agent.analyzeIntent(input);
      
      expect(result.success).toBe(true);
      expect(result.intent).toBe('create_todo_app');
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.features).toContain('dark_mode');
      expect(result.complexity).toBe('simple');
    });

    test('should detect e-commerce intent', async () => {
      const input = "Build an online store with payment processing";
      
      const result = await agent.analyzeIntent(input);
      
      expect(result.success).toBe(true);
      expect(result.intent).toBe('create_ecommerce_store');
      expect(result.features).toContain('payment_processing');
      expect(result.complexity).toBe('medium');
    });

    test('should detect dashboard intent', async () => {
      const input = "Create a dashboard for analytics data";
      
      const result = await agent.analyzeIntent(input);
      
      expect(result.success).toBe(true);
      expect(result.intent).toBe('create_analytics_dashboard');
      expect(result.features).toContain('data_visualization');
    });
  });

  describe('Feature Extraction', () => {
    test('should extract multiple features', async () => {
      const input = "Create a blog with user authentication, comments, and search";
      
      const result = await agent.analyzeIntent(input);
      
      expect(result.features).toContain('user_authentication');
      expect(result.features).toContain('comments');
      expect(result.features).toContain('search');
      expect(result.features.length).toBeGreaterThanOrEqual(3);
    });

    test('should detect UI preferences', async () => {
      const input = "Build a mobile-first responsive app with dark mode";
      
      const result = await agent.analyzeIntent(input);
      
      expect(result.features).toContain('mobile_first');
      expect(result.features).toContain('responsive');
      expect(result.features).toContain('dark_mode');
    });

    test('should detect technical requirements', async () => {
      const input = "Create a real-time chat app with WebSocket";
      
      const result = await agent.analyzeIntent(input);
      
      expect(result.features).toContain('real_time');
      expect(result.features).toContain('websocket');
    });
  });

  describe('Complexity Assessment', () => {
    test('should classify simple apps correctly', async () => {
      const simpleInputs = [
        "Create a calculator",
        "Build a todo list",
        "Make a simple landing page"
      ];

      for (const input of simpleInputs) {
        const result = await agent.analyzeIntent(input);
        expect(result.complexity).toBe('simple');
      }
    });

    test('should classify medium complexity apps', async () => {
      const mediumInputs = [
        "Create a blog with user accounts",
        "Build an e-commerce site",
        "Make a dashboard with charts"
      ];

      for (const input of mediumInputs) {
        const result = await agent.analyzeIntent(input);
        expect(result.complexity).toBe('medium');
      }
    });

    test('should classify complex apps', async () => {
      const complexInputs = [
        "Create a full-stack social media platform",
        "Build a real-time collaboration tool",
        "Make an AI-powered analytics platform"
      ];

      for (const input of complexInputs) {
        const result = await agent.analyzeIntent(input);
        expect(result.complexity).toBe('complex');
      }
    });
  });

  describe('Confidence Scoring', () => {
    test('should provide high confidence for clear intents', async () => {
      const input = "Create a todo app";
      
      const result = await agent.analyzeIntent(input);
      
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    test('should provide lower confidence for ambiguous requests', async () => {
      const input = "Make something cool";
      
      const result = await agent.analyzeIntent(input);
      
      expect(result.confidence).toBeLessThan(0.7);
    });

    test('should provide medium confidence for complex requests', async () => {
      const input = "Build a platform that does many things";
      
      const result = await agent.analyzeIntent(input);
      
      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.confidence).toBeLessThan(0.9);
    });
  });

  describe('Error Handling', () => {
    test('should handle empty input', async () => {
      const result = await agent.analyzeIntent('');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Empty input');
    });

    test('should handle very long input', async () => {
      const longInput = "Create an app that does everything".repeat(100);
      
      const result = await agent.analyzeIntent(longInput);
      
      expect(result.success).toBe(true);
      expect(result.intent).toBeDefined();
    });

    test('should handle special characters', async () => {
      const input = "Create a todo app with @#$%^&*() symbols";
      
      const result = await agent.analyzeIntent(input);
      
      expect(result.success).toBe(true);
      expect(result.intent).toBe('create_todo_app');
    });
  });

  describe('Edge Cases', () => {
    test('should handle multiple similar intents', async () => {
      const input = "Create both a todo app and a calculator";
      
      const result = await agent.analyzeIntent(input);
      
      expect(result.success).toBe(true);
      expect(result.intent).toBeDefined();
      expect(result.features.length).toBeGreaterThan(1);
    });

    test('should handle contradictory requirements', async () => {
      const input = "Create a simple but very complex app";
      
      const result = await agent.analyzeIntent(input);
      
      expect(result.success).toBe(true);
      expect(result.confidence).toBeLessThan(0.8);
    });

    test('should handle non-English input', async () => {
      const input = "Crear una aplicación de tareas";
      
      const result = await agent.analyzeIntent(input);
      
      expect(result.success).toBe(true);
      expect(result.intent).toBe('create_todo_app');
    });
  });

  describe('Performance', () => {
    test('should respond within acceptable time', async () => {
      const startTime = Date.now();
      
      await agent.analyzeIntent("Create a todo app");
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(3000); // 3 seconds max
    });

    test('should handle concurrent requests', async () => {
      const inputs = [
        "Create a todo app",
        "Build a calculator",
        "Make a blog",
        "Create a dashboard"
      ];

      const promises = inputs.map(input => agent.analyzeIntent(input));
      const results = await Promise.all(promises);

      expect(results).toHaveLength(4);
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });
  });
}); 