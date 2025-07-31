# UX Pattern Selector Agent - Testing Examples

## 🎯 **Agent Overview**

The UX Pattern Selector Agent is responsible for choosing appropriate UI patterns and components based on the analyzed intent. It maps user requirements to proven UX patterns and suggests the best layout structures.

---

## **🧪 Testing Examples**

### **Test Case 1: Dashboard Application**
```json
{
  "input": {
    "intent": "create_dashboard",
    "features": ["data_visualization", "user_management", "settings"]
  },
  "expected_output": {
    "patterns": [
      {
        "name": "sidebar_navigation",
        "description": "Vertical sidebar with navigation menu",
        "components": ["Sidebar", "NavItem", "NavGroup"],
        "priority": "high"
      },
      {
        "name": "card_layout",
        "description": "Grid of cards for data display",
        "components": ["Card", "CardHeader", "CardContent"],
        "priority": "high"
      },
      {
        "name": "header_bar",
        "description": "Top header with user info and actions",
        "components": ["Header", "UserMenu", "ActionButtons"],
        "priority": "medium"
      },
      {
        "name": "data_table",
        "description": "Tabular data presentation",
        "components": ["DataTable", "TableHeader", "TableRow"],
        "priority": "medium"
      }
    ],
    "layout": "sidebar_with_header",
    "responsive": true,
    "accessibility": "high"
  }
}
```

### **Test Case 2: Mobile-First App**
```json
{
  "input": {
    "intent": "create_mobile_app",
    "features": ["photo_gallery", "social_sharing", "offline_support"]
  },
  "expected_output": {
    "patterns": [
      {
        "name": "bottom_navigation",
        "description": "Bottom tab navigation for mobile",
        "components": ["BottomNav", "TabItem"],
        "priority": "high"
      },
      {
        "name": "swipe_gestures",
        "description": "Touch-based interactions",
        "components": ["SwipeableCard", "GestureHandler"],
        "priority": "high"
      },
      {
        "name": "pull_to_refresh",
        "description": "Pull down to refresh content",
        "components": ["RefreshControl"],
        "priority": "medium"
      },
      {
        "name": "floating_action_button",
        "description": "Primary action button",
        "components": ["FAB", "FABMenu"],
        "priority": "medium"
      }
    ],
    "layout": "mobile_optimized",
    "responsive": true,
    "touch_friendly": true
  }
}
```

### **Test Case 3: E-commerce Platform**
```json
{
  "input": {
    "intent": "create_ecommerce",
    "features": ["product_catalog", "shopping_cart", "checkout", "user_reviews"]
  },
  "expected_output": {
    "patterns": [
      {
        "name": "product_grid",
        "description": "Grid layout for product display",
        "components": ["ProductCard", "ProductGrid", "ProductImage"],
        "priority": "high"
      },
      {
        "name": "shopping_cart_sidebar",
        "description": "Sliding cart panel",
        "components": ["CartSidebar", "CartItem", "CartTotal"],
        "priority": "high"
      },
      {
        "name": "breadcrumb_navigation",
        "description": "Hierarchical navigation path",
        "components": ["Breadcrumb", "BreadcrumbItem"],
        "priority": "medium"
      },
      {
        "name": "rating_stars",
        "description": "User review ratings",
        "components": ["RatingStars", "ReviewCard"],
        "priority": "medium"
      },
      {
        "name": "checkout_wizard",
        "description": "Multi-step checkout process",
        "components": ["CheckoutWizard", "WizardStep"],
        "priority": "high"
      }
    ],
    "layout": "responsive_grid",
    "responsive": true,
    "conversion_optimized": true
  }
}
```

### **Test Case 4: Simple Todo App**
```json
{
  "input": {
    "intent": "create_todo_app",
    "features": ["add_todo", "delete_todo", "mark_complete"]
  },
  "expected_output": {
    "patterns": [
      {
        "name": "list_view",
        "description": "Simple list of todo items",
        "components": ["TodoList", "TodoItem", "TodoCheckbox"],
        "priority": "high"
      },
      {
        "name": "form_input",
        "description": "Add new todo form",
        "components": ["TodoForm", "TextInput", "SubmitButton"],
        "priority": "high"
      },
      {
        "name": "action_buttons",
        "description": "Delete and edit actions",
        "components": ["ActionButton", "IconButton"],
        "priority": "medium"
      }
    ],
    "layout": "simple_list",
    "responsive": true,
    "minimal": true
  }
}
```

### **Test Case 5: Social Media App**
```json
{
  "input": {
    "intent": "create_social_app",
    "features": ["post_creation", "feed_scroll", "user_profiles", "messaging"]
  },
  "expected_output": {
    "patterns": [
      {
        "name": "infinite_scroll",
        "description": "Continuous content loading",
        "components": ["InfiniteScroll", "PostCard", "LoadMore"],
        "priority": "high"
      },
      {
        "name": "post_creation_modal",
        "description": "Modal for creating posts",
        "components": ["PostModal", "MediaUpload", "TextEditor"],
        "priority": "high"
      },
      {
        "name": "user_avatar",
        "description": "User profile pictures",
        "components": ["Avatar", "AvatarGroup"],
        "priority": "medium"
      },
      {
        "name": "chat_interface",
        "description": "Real-time messaging",
        "components": ["ChatWindow", "MessageBubble", "MessageInput"],
        "priority": "high"
      }
    ],
    "layout": "feed_based",
    "responsive": true,
    "real_time": true
  }
}
```

---

## **🔧 Testing Scripts**

### **Manual Testing**
```javascript
// test-ux-pattern-selector.js
const { UXPatternSelectorAgent } = require('../packages/nw-mcp/src/agents/UXPatternSelectorAgent');

async function testUXPatternSelector() {
  const agent = new UXPatternSelectorAgent();
  
  const testCases = [
    {
      name: "Dashboard Application",
      intent: {
        intent: "create_dashboard",
        features: ["data_visualization", "user_management"]
      },
      expected: {
        layout: "sidebar_with_header",
        responsive: true
      }
    },
    {
      name: "Mobile App",
      intent: {
        intent: "create_mobile_app",
        features: ["photo_gallery", "social_sharing"]
      },
      expected: {
        layout: "mobile_optimized",
        touch_friendly: true
      }
    },
    {
      name: "Simple Todo",
      intent: {
        intent: "create_todo_app",
        features: ["add_todo", "delete_todo"]
      },
      expected: {
        layout: "simple_list",
        minimal: true
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    try {
      const result = await agent.selectPatterns(testCase.intent);
      console.log('Result:', JSON.stringify(result, null, 2));
      
      // Validate result
      if (result.layout === testCase.expected.layout) {
        console.log('✅ Layout matches expected');
      } else {
        console.log('❌ Layout mismatch');
      }
    } catch (error) {
      console.error('❌ Test failed:', error.message);
    }
    console.log('---');
  }
}

testUXPatternSelector();
```

### **Automated Testing**
```typescript
// __tests__/ux-pattern-selector.test.ts
import { UXPatternSelectorAgent } from '../src/agents/UXPatternSelectorAgent';

describe('UX Pattern Selector Agent', () => {
  let agent: UXPatternSelectorAgent;

  beforeEach(() => {
    agent = new UXPatternSelectorAgent();
  });

  test('should select appropriate patterns for dashboard', async () => {
    const intent = {
      intent: 'create_dashboard',
      features: ['data_visualization', 'user_management']
    };
    
    const result = await agent.selectPatterns(intent);
    
    expect(result.patterns).toBeDefined();
    expect(result.patterns.length).toBeGreaterThan(0);
    expect(result.layout).toBeDefined();
    expect(result.responsive).toBe(true);
    
    // Check for expected patterns
    const patternNames = result.patterns.map(p => p.name);
    expect(patternNames).toContain('sidebar_navigation');
    expect(patternNames).toContain('card_layout');
  });

  test('should select mobile-optimized patterns', async () => {
    const intent = {
      intent: 'create_mobile_app',
      features: ['photo_gallery', 'social_sharing']
    };
    
    const result = await agent.selectPatterns(intent);
    
    expect(result.layout).toBe('mobile_optimized');
    expect(result.touch_friendly).toBe(true);
    
    const patternNames = result.patterns.map(p => p.name);
    expect(patternNames).toContain('bottom_navigation');
    expect(patternNames).toContain('swipe_gestures');
  });

  test('should prioritize patterns correctly', async () => {
    const intent = {
      intent: 'create_ecommerce',
      features: ['product_catalog', 'shopping_cart']
    };
    
    const result = await agent.selectPatterns(intent);
    
    const highPriorityPatterns = result.patterns.filter(p => p.priority === 'high');
    expect(highPriorityPatterns.length).toBeGreaterThan(0);
    
    // Check that high priority patterns come first
    const firstPattern = result.patterns[0];
    expect(firstPattern.priority).toBe('high');
  });

  test('should handle minimal feature sets', async () => {
    const intent = {
      intent: 'create_todo_app',
      features: ['add_todo']
    };
    
    const result = await agent.selectPatterns(intent);
    
    expect(result.minimal).toBe(true);
    expect(result.patterns.length).toBeLessThanOrEqual(3);
  });
});
```

---

## **📊 Performance Benchmarks**

### **Expected Performance**
```javascript
const benchmarks = {
  responseTime: {
    max: 3000, // 3 seconds
    average: 1500, // 1.5 seconds
    target: 1000 // 1 second
  },
  tokenUsage: {
    max: 1500,
    average: 800,
    target: 600
  },
  accuracy: {
    patternSelection: 0.92,
    layoutRecommendation: 0.89,
    componentMapping: 0.85
  }
};
```

---

## **🚨 Error Handling**

### **Invalid Input Handling**
```javascript
test('should handle empty intent', async () => {
  const agent = new UXPatternSelectorAgent();
  const result = await agent.selectPatterns({});
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('Invalid intent');
});

test('should handle unknown intent types', async () => {
  const agent = new UXPatternSelectorAgent();
  const result = await agent.selectPatterns({
    intent: 'unknown_type',
    features: ['feature1']
  });
  
  expect(result.success).toBe(true);
  expect(result.patterns).toHaveLength(0);
  expect(result.layout).toBe('default');
});

test('should handle conflicting features', async () => {
  const agent = new UXPatternSelectorAgent();
  const result = await agent.selectPatterns({
    intent: 'create_app',
    features: ['mobile_optimized', 'desktop_only']
  });
  
  expect(result.success).toBe(true);
  // Should prioritize one over the other
  expect(result.layout).toBeDefined();
});
```

---

## **📋 Testing Checklist**

### **Functional Testing**
- [ ] Selects appropriate patterns for different intents
- [ ] Prioritizes patterns correctly
- [ ] Handles mobile vs desktop requirements
- [ ] Suggests responsive layouts
- [ ] Maps features to components
- [ ] Handles edge cases gracefully
- [ ] Provides accessibility considerations

### **Performance Testing**
- [ ] Response time within acceptable limits
- [ ] Token usage optimized
- [ ] Memory usage stable
- [ ] Concurrent requests handled

### **Integration Testing**
- [ ] Works with Intent Analysis Agent
- [ ] Integrates with Validation Agent
- [ ] Provides input for UI Requirement Synthesizer
- [ ] Maintains consistency with design system 