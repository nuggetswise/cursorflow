import { UXPatternSelectorAgent } from '../agents/UXPatternSelectorAgent';

describe('UX Pattern Selector Agent', () => {
  let agent: UXPatternSelectorAgent;

  beforeEach(() => {
    agent = new UXPatternSelectorAgent();
  });

  describe('Basic Pattern Selection', () => {
    test('should select patterns for todo app', async () => {
      const intent = {
        intent: 'create_todo_app',
        features: ['dark_mode', 'responsive'],
        complexity: 'simple'
      };
      
      const result = await agent.selectPatterns(intent);
      
      expect(result.success).toBe(true);
      expect(result.patterns).toContain('list_view');
      expect(result.patterns).toContain('form_input');
      expect(result.patterns).toContain('action_buttons');
      expect(result.patterns).toContain('theme_toggle');
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    test('should select patterns for e-commerce store', async () => {
      const intent = {
        intent: 'create_ecommerce_store',
        features: ['payment_processing', 'product_catalog'],
        complexity: 'medium'
      };
      
      const result = await agent.selectPatterns(intent);
      
      expect(result.success).toBe(true);
      expect(result.patterns).toContain('product_grid');
      expect(result.patterns).toContain('shopping_cart');
      expect(result.patterns).toContain('checkout_flow');
      expect(result.patterns).toContain('search_bar');
    });

    test('should select patterns for analytics dashboard', async () => {
      const intent = {
        intent: 'create_analytics_dashboard',
        features: ['data_visualization', 'real_time'],
        complexity: 'medium'
      };
      
      const result = await agent.selectPatterns(intent);
      
      expect(result.success).toBe(true);
      expect(result.patterns).toContain('data_table');
      expect(result.patterns).toContain('chart_components');
      expect(result.patterns).toContain('filter_panel');
      expect(result.patterns).toContain('real_time_updates');
    });
  });

  describe('Pattern Matching', () => {
    test('should match authentication patterns', async () => {
      const intent = {
        intent: 'create_user_management',
        features: ['user_authentication', 'role_based_access'],
        complexity: 'medium'
      };
      
      const result = await agent.selectPatterns(intent);
      
      expect(result.patterns).toContain('login_form');
      expect(result.patterns).toContain('user_profile');
      expect(result.patterns).toContain('permission_management');
    });

    test('should match communication patterns', async () => {
      const intent = {
        intent: 'create_chat_app',
        features: ['real_time', 'messaging'],
        complexity: 'medium'
      };
      
      const result = await agent.selectPatterns(intent);
      
      expect(result.patterns).toContain('message_list');
      expect(result.patterns).toContain('message_input');
      expect(result.patterns).toContain('user_online_status');
    });

    test('should match content management patterns', async () => {
      const intent = {
        intent: 'create_blog',
        features: ['content_management', 'comments'],
        complexity: 'medium'
      };
      
      const result = await agent.selectPatterns(intent);
      
      expect(result.patterns).toContain('article_list');
      expect(result.patterns).toContain('rich_text_editor');
      expect(result.patterns).toContain('comment_system');
    });
  });

  describe('Complexity-Based Selection', () => {
    test('should select simple patterns for basic apps', async () => {
      const intent = {
        intent: 'create_calculator',
        features: ['basic_math'],
        complexity: 'simple'
      };
      
      const result = await agent.selectPatterns(intent);
      
      expect(result.patterns).toContain('number_input');
      expect(result.patterns).toContain('button_grid');
      expect(result.patterns).toContain('display_screen');
      expect(result.patterns.length).toBeLessThanOrEqual(5);
    });

    test('should select advanced patterns for complex apps', async () => {
      const intent = {
        intent: 'create_enterprise_platform',
        features: ['multi_tenant', 'advanced_analytics', 'workflow_automation'],
        complexity: 'complex'
      };
      
      const result = await agent.selectPatterns(intent);
      
      expect(result.patterns.length).toBeGreaterThan(8);
      expect(result.patterns).toContain('advanced_dashboard');
      expect(result.patterns).toContain('workflow_builder');
      expect(result.patterns).toContain('tenant_management');
    });
  });

  describe('Feature-Specific Patterns', () => {
    test('should select mobile-specific patterns', async () => {
      const intent = {
        intent: 'create_mobile_app',
        features: ['mobile_first', 'touch_gestures'],
        complexity: 'medium'
      };
      
      const result = await agent.selectPatterns(intent);
      
      expect(result.patterns).toContain('swipe_gestures');
      expect(result.patterns).toContain('mobile_navigation');
      expect(result.patterns).toContain('touch_feedback');
    });

    test('should select accessibility patterns', async () => {
      const intent = {
        intent: 'create_accessible_app',
        features: ['screen_reader', 'keyboard_navigation'],
        complexity: 'medium'
      };
      
      const result = await agent.selectPatterns(intent);
      
      expect(result.patterns).toContain('aria_labels');
      expect(result.patterns).toContain('focus_management');
      expect(result.patterns).toContain('high_contrast');
    });

    test('should select performance patterns', async () => {
      const intent = {
        intent: 'create_performance_app',
        features: ['lazy_loading', 'caching'],
        complexity: 'medium'
      };
      
      const result = await agent.selectPatterns(intent);
      
      expect(result.patterns).toContain('infinite_scroll');
      expect(result.patterns).toContain('skeleton_loading');
      expect(result.patterns).toContain('optimistic_updates');
    });
  });

  describe('Recommendations', () => {
    test('should provide UX recommendations', async () => {
      const intent = {
        intent: 'create_todo_app',
        features: ['dark_mode'],
        complexity: 'simple'
      };
      
      const result = await agent.selectPatterns(intent);
      
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations[0]).toHaveProperty('category');
      expect(result.recommendations[0]).toHaveProperty('suggestion');
      expect(result.recommendations[0]).toHaveProperty('priority');
    });

    test('should prioritize recommendations by complexity', async () => {
      const intent = {
        intent: 'create_complex_dashboard',
        features: ['real_time', 'advanced_analytics'],
        complexity: 'complex'
      };
      
      const result = await agent.selectPatterns(intent);
      
      const highPriorityRecs = result.recommendations.filter(r => r.priority === 'high');
      expect(highPriorityRecs.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid intent', async () => {
      const invalidIntent = {
        intent: 'invalid_intent',
        features: [],
        complexity: 'simple'
      };
      
      const result = await agent.selectPatterns(invalidIntent);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid intent');
    });

    test('should handle empty features', async () => {
      const intent = {
        intent: 'create_todo_app',
        features: [],
        complexity: 'simple'
      };
      
      const result = await agent.selectPatterns(intent);
      
      expect(result.success).toBe(true);
      expect(result.patterns.length).toBeGreaterThan(0);
    });

    test('should handle unknown complexity level', async () => {
      const intent = {
        intent: 'create_todo_app',
        features: ['dark_mode'],
        complexity: 'unknown'
      };
      
      const result = await agent.selectPatterns(intent);
      
      expect(result.success).toBe(true);
      expect(result.patterns.length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    test('should respond within acceptable time', async () => {
      const intent = {
        intent: 'create_todo_app',
        features: ['dark_mode'],
        complexity: 'simple'
      };
      
      const startTime = Date.now();
      await agent.selectPatterns(intent);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(2000); // 2 seconds max
    });

    test('should handle large feature sets', async () => {
      const intent = {
        intent: 'create_enterprise_app',
        features: Array.from({ length: 20 }, (_, i) => `feature_${i}`),
        complexity: 'complex'
      };
      
      const result = await agent.selectPatterns(intent);
      
      expect(result.success).toBe(true);
      expect(result.patterns.length).toBeGreaterThan(0);
    });
  });

  describe('Pattern Validation', () => {
    test('should return valid pattern names', async () => {
      const intent = {
        intent: 'create_todo_app',
        features: ['dark_mode'],
        complexity: 'simple'
      };
      
      const result = await agent.selectPatterns(intent);
      
      result.patterns.forEach(pattern => {
        expect(typeof pattern).toBe('string');
        expect(pattern.length).toBeGreaterThan(0);
        expect(pattern).toMatch(/^[a-z_]+$/); // snake_case format
      });
    });

    test('should not return duplicate patterns', async () => {
      const intent = {
        intent: 'create_todo_app',
        features: ['dark_mode', 'responsive'],
        complexity: 'simple'
      };
      
      const result = await agent.selectPatterns(intent);
      
      const uniquePatterns = new Set(result.patterns);
      expect(uniquePatterns.size).toBe(result.patterns.length);
    });
  });
}); 