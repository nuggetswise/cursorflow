import { ValidationAgent } from '../agents/ValidationAgent';

describe('Validation Agent', () => {
  let agent: ValidationAgent;

  beforeEach(() => {
    agent = new ValidationAgent();
  });

  describe('Basic Validation', () => {
    test('should validate simple todo app request', async () => {
      const input = {
        intent: 'create_todo_app',
        patterns: ['list_view', 'form_input', 'action_buttons']
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.valid).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.9);
      expect(result.estimated_build_time).toBe('2-3 minutes');
      expect(result.estimated_cost).toBe('$0.50-$1.00');
      expect(result.risk_level).toBe('low');
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    test('should validate complex full-stack app', async () => {
      const input = {
        intent: 'create_full_stack_app',
        patterns: ['authentication', 'database', 'api', 'real_time']
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.valid).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.estimated_build_time).toBe('15-20 minutes');
      expect(result.estimated_cost).toBe('$3.00-$5.00');
      expect(result.risk_level).toBe('medium');
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    test('should reject invalid AI model request', async () => {
      const input = {
        intent: 'create_ai_model',
        patterns: ['neural_network', 'training_interface']
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.valid).toBe(false);
      expect(result.confidence).toBeLessThan(0.3);
      expect(result.reasons.length).toBeGreaterThan(0);
      expect(result.suggestions.length).toBeGreaterThan(0);
      expect(result.alternative_approaches.length).toBeGreaterThan(0);
    });
  });

  describe('Complexity Assessment', () => {
    test('should assess simple app complexity', async () => {
      const input = {
        intent: 'create_calculator',
        patterns: ['number_input', 'button_grid', 'display_screen']
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.valid).toBe(true);
      expect(result.complexity).toBe('simple');
      expect(result.estimated_build_time).toBe('1-2 minutes');
      expect(result.risk_level).toBe('low');
    });

    test('should assess medium complexity apps', async () => {
      const input = {
        intent: 'create_blog',
        patterns: ['article_list', 'rich_text_editor', 'comment_system', 'user_authentication']
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.valid).toBe(true);
      expect(result.complexity).toBe('medium');
      expect(result.estimated_build_time).toBe('5-8 minutes');
      expect(result.risk_level).toBe('medium');
    });

    test('should assess complex enterprise apps', async () => {
      const input = {
        intent: 'create_enterprise_platform',
        patterns: ['multi_tenant', 'advanced_dashboard', 'workflow_builder', 'tenant_management', 'real_time_updates']
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.valid).toBe(true);
      expect(result.complexity).toBe('complex');
      expect(result.estimated_build_time).toBe('20-30 minutes');
      expect(result.risk_level).toBe('high');
    });
  });

  describe('Cost Estimation', () => {
    test('should estimate costs for simple apps', async () => {
      const input = {
        intent: 'create_todo_app',
        patterns: ['list_view', 'form_input']
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.estimated_cost).toMatch(/\$\d+\.\d+-\$\d+\.\d+/);
      const costRange = result.estimated_cost.match(/\$(\d+\.\d+)-\\$(\d+\.\d+)/);
      expect(parseFloat(costRange[1])).toBeLessThan(parseFloat(costRange[2]));
    });

    test('should estimate costs for complex apps', async () => {
      const input = {
        intent: 'create_ecommerce_store',
        patterns: ['product_grid', 'shopping_cart', 'checkout_flow', 'payment_processing']
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.estimated_cost).toMatch(/\$\d+\.\d+-\$\d+\.\d+/);
      const costRange = result.estimated_cost.match(/\$(\d+\.\d+)-\\$(\d+\.\d+)/);
      expect(parseFloat(costRange[1])).toBeGreaterThan(1.0); // Should be more expensive
    });
  });

  describe('Risk Assessment', () => {
    test('should identify low-risk requests', async () => {
      const input = {
        intent: 'create_landing_page',
        patterns: ['hero_section', 'feature_list', 'contact_form']
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.risk_level).toBe('low');
      expect(result.warnings.length).toBe(0);
    });

    test('should identify medium-risk requests', async () => {
      const input = {
        intent: 'create_user_management',
        patterns: ['user_authentication', 'role_based_access', 'permission_management']
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.risk_level).toBe('medium');
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    test('should identify high-risk requests', async () => {
      const input = {
        intent: 'create_financial_platform',
        patterns: ['payment_processing', 'real_time_trading', 'secure_authentication']
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.risk_level).toBe('high');
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Technical Validation', () => {
    test('should validate v0 platform compatibility', async () => {
      const input = {
        intent: 'create_todo_app',
        patterns: ['list_view', 'form_input']
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.technical_notes.length).toBeGreaterThan(0);
      expect(result.technical_notes.some(note => note.includes('v0'))).toBe(true);
    });

    test('should identify platform limitations', async () => {
      const input = {
        intent: 'create_mobile_native_app',
        patterns: ['native_ui', 'device_apis']
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.valid).toBe(false);
      expect(result.reasons.some(reason => reason.includes('v0 platform'))).toBe(true);
    });

    test('should validate API dependencies', async () => {
      const input = {
        intent: 'create_weather_app',
        patterns: ['weather_display', 'location_services', 'external_api']
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.technical_notes.some(note => note.includes('API'))).toBe(true);
      expect(result.warnings.some(warning => warning.includes('external'))).toBe(true);
    });
  });

  describe('Recommendations', () => {
    test('should provide improvement recommendations', async () => {
      const input = {
        intent: 'create_todo_app',
        patterns: ['list_view', 'form_input']
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.recommendations.length).toBeGreaterThan(0);
      result.recommendations.forEach(rec => {
        expect(rec).toHaveProperty('category');
        expect(rec).toHaveProperty('suggestion');
        expect(rec).toHaveProperty('impact');
      });
    });

    test('should provide alternative approaches for invalid requests', async () => {
      const input = {
        intent: 'create_ai_model',
        patterns: ['neural_network']
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.alternative_approaches.length).toBeGreaterThan(0);
      result.alternative_approaches.forEach(approach => {
        expect(typeof approach).toBe('string');
        expect(approach.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid input format', async () => {
      const invalidInput = {
        intent: null,
        patterns: 'invalid'
      };
      
      const result = await agent.validateRequest(invalidInput);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid input format');
    });

    test('should handle empty patterns', async () => {
      const input = {
        intent: 'create_todo_app',
        patterns: []
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('No patterns provided');
    });

    test('should handle unknown intent', async () => {
      const input = {
        intent: 'unknown_intent',
        patterns: ['list_view']
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.valid).toBe(false);
      expect(result.confidence).toBeLessThan(0.5);
    });
  });

  describe('Performance', () => {
    test('should respond within acceptable time', async () => {
      const input = {
        intent: 'create_todo_app',
        patterns: ['list_view', 'form_input']
      };
      
      const startTime = Date.now();
      await agent.validateRequest(input);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(2000); // 2 seconds max
    });

    test('should handle large pattern sets', async () => {
      const input = {
        intent: 'create_enterprise_app',
        patterns: Array.from({ length: 15 }, (_, i) => `pattern_${i}`)
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.success).toBe(true);
      expect(result.valid).toBeDefined();
    });
  });

  describe('Confidence Scoring', () => {
    test('should provide high confidence for well-defined requests', async () => {
      const input = {
        intent: 'create_todo_app',
        patterns: ['list_view', 'form_input', 'action_buttons']
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    test('should provide lower confidence for ambiguous requests', async () => {
      const input = {
        intent: 'create_platform',
        patterns: ['dashboard', 'features']
      };
      
      const result = await agent.validateRequest(input);
      
      expect(result.confidence).toBeLessThan(0.8);
    });
  });
}); 