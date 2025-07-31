# UI Requirement Synthesizer Agent - Testing Examples

## 🎯 **Agent Overview**

The UI Requirement Synthesizer Agent converts UX patterns and validation results into detailed component specifications. It creates comprehensive UI requirements that can be used by the v0 Prompt Builder to generate actual code.

---

## **🧪 Testing Examples**

### **Test Case 1: Simple Todo App Components**
```json
{
  "input": {
    "patterns": ["list_view", "form_input", "action_buttons"],
    "features": ["add_todo", "delete_todo", "mark_complete"]
  },
  "expected_output": {
    "components": [
      {
        "name": "TodoApp",
        "type": "container",
        "props": {
          "todos": "Todo[]",
          "onAddTodo": "function",
          "onDeleteTodo": "function",
          "onToggleTodo": "function"
        },
        "children": ["TodoForm", "TodoList"],
        "styling": {
          "layout": "flex",
          "direction": "column",
          "gap": "1rem",
          "padding": "1rem"
        }
      },
      {
        "name": "TodoForm",
        "type": "form",
        "props": {
          "onSubmit": "function",
          "placeholder": "string"
        },
        "children": ["TextInput", "SubmitButton"],
        "styling": {
          "display": "flex",
          "gap": "0.5rem",
          "marginBottom": "1rem"
        }
      },
      {
        "name": "TodoList",
        "type": "list",
        "props": {
          "todos": "Todo[]",
          "onDelete": "function",
          "onToggle": "function"
        },
        "children": ["TodoItem"],
        "styling": {
          "display": "flex",
          "flexDirection": "column",
          "gap": "0.5rem"
        }
      },
      {
        "name": "TodoItem",
        "type": "item",
        "props": {
          "todo": "Todo",
          "onDelete": "function",
          "onToggle": "function"
        },
        "children": ["Checkbox", "Text", "DeleteButton"],
        "styling": {
          "display": "flex",
          "alignItems": "center",
          "gap": "0.5rem",
          "padding": "0.5rem",
          "border": "1px solid #e5e7eb",
          "borderRadius": "0.375rem"
        }
      }
    ],
    "layout": {
      "type": "vertical_stack",
      "spacing": "1rem",
      "alignment": "stretch"
    },
    "interactions": [
      {
        "component": "TodoForm",
        "event": "submit",
        "action": "add_todo"
      },
      {
        "component": "TodoItem",
        "event": "checkbox_change",
        "action": "toggle_todo"
      },
      {
        "component": "TodoItem",
        "event": "delete_click",
        "action": "delete_todo"
      }
    ]
  }
}
```

### **Test Case 2: Dashboard Components**
```json
{
  "input": {
    "patterns": ["sidebar_navigation", "card_layout", "header_bar"],
    "features": ["data_visualization", "user_management", "settings"]
  },
  "expected_output": {
    "components": [
      {
        "name": "DashboardLayout",
        "type": "layout",
        "props": {
          "sidebar": "boolean",
          "header": "boolean",
          "children": "ReactNode"
        },
        "children": ["Sidebar", "Header", "MainContent"],
        "styling": {
          "display": "grid",
          "gridTemplateColumns": "250px 1fr",
          "gridTemplateRows": "60px 1fr",
          "height": "100vh"
        }
      },
      {
        "name": "Sidebar",
        "type": "navigation",
        "props": {
          "items": "NavItem[]",
          "collapsed": "boolean",
          "onItemClick": "function"
        },
        "children": ["NavItem"],
        "styling": {
          "gridColumn": "1",
          "gridRow": "1 / -1",
          "backgroundColor": "#1f2937",
          "color": "white",
          "padding": "1rem"
        }
      },
      {
        "name": "Header",
        "type": "header",
        "props": {
          "user": "User",
          "notifications": "Notification[]",
          "onLogout": "function"
        },
        "children": ["UserMenu", "NotificationBell", "LogoutButton"],
        "styling": {
          "gridColumn": "2",
          "gridRow": "1",
          "display": "flex",
          "justifyContent": "space-between",
          "alignItems": "center",
          "padding": "0 1rem",
          "borderBottom": "1px solid #e5e7eb"
        }
      },
      {
        "name": "MainContent",
        "type": "content",
        "props": {
          "children": "ReactNode"
        },
        "children": ["DashboardGrid"],
        "styling": {
          "gridColumn": "2",
          "gridRow": "2",
          "padding": "1rem",
          "overflow": "auto"
        }
      },
      {
        "name": "DashboardGrid",
        "type": "grid",
        "props": {
          "cards": "DashboardCard[]"
        },
        "children": ["DashboardCard"],
        "styling": {
          "display": "grid",
          "gridTemplateColumns": "repeat(auto-fit, minmax(300px, 1fr))",
          "gap": "1rem"
        }
      },
      {
        "name": "DashboardCard",
        "type": "card",
        "props": {
          "title": "string",
          "value": "string|number",
          "trend": "string",
          "icon": "string"
        },
        "children": ["CardHeader", "CardContent"],
        "styling": {
          "backgroundColor": "white",
          "borderRadius": "0.5rem",
          "padding": "1rem",
          "boxShadow": "0 1px 3px rgba(0, 0, 0, 0.1)"
        }
      }
    ],
    "layout": {
      "type": "grid_layout",
      "columns": "responsive",
      "spacing": "1rem"
    },
    "interactions": [
      {
        "component": "Sidebar",
        "event": "item_click",
        "action": "navigate"
      },
      {
        "component": "Header",
        "event": "logout_click",
        "action": "logout"
      },
      {
        "component": "DashboardCard",
        "event": "card_click",
        "action": "view_details"
      }
    ]
  }
}
```

### **Test Case 3: E-commerce Product Grid**
```json
{
  "input": {
    "patterns": ["product_grid", "shopping_cart_sidebar", "breadcrumb_navigation"],
    "features": ["product_catalog", "shopping_cart", "checkout"]
  },
  "expected_output": {
    "components": [
      {
        "name": "ProductCatalog",
        "type": "container",
        "props": {
          "products": "Product[]",
          "cart": "Cart",
          "onAddToCart": "function",
          "onViewProduct": "function"
        },
        "children": ["Breadcrumb", "ProductGrid", "ShoppingCart"],
        "styling": {
          "display": "grid",
          "gridTemplateColumns": "1fr 300px",
          "gap": "2rem",
          "padding": "1rem"
        }
      },
      {
        "name": "Breadcrumb",
        "type": "navigation",
        "props": {
          "path": "string[]",
          "onNavigate": "function"
        },
        "children": ["BreadcrumbItem"],
        "styling": {
          "gridColumn": "1 / -1",
          "display": "flex",
          "gap": "0.5rem",
          "marginBottom": "1rem"
        }
      },
      {
        "name": "ProductGrid",
        "type": "grid",
        "props": {
          "products": "Product[]",
          "onProductClick": "function",
          "onAddToCart": "function"
        },
        "children": ["ProductCard"],
        "styling": {
          "display": "grid",
          "gridTemplateColumns": "repeat(auto-fill, minmax(250px, 1fr))",
          "gap": "1rem"
        }
      },
      {
        "name": "ProductCard",
        "type": "card",
        "props": {
          "product": "Product",
          "onClick": "function",
          "onAddToCart": "function"
        },
        "children": ["ProductImage", "ProductInfo", "AddToCartButton"],
        "styling": {
          "border": "1px solid #e5e7eb",
          "borderRadius": "0.5rem",
          "overflow": "hidden",
          "transition": "transform 0.2s"
        }
      },
      {
        "name": "ShoppingCart",
        "type": "sidebar",
        "props": {
          "cart": "Cart",
          "onUpdateQuantity": "function",
          "onRemoveItem": "function",
          "onCheckout": "function"
        },
        "children": ["CartHeader", "CartItems", "CartTotal", "CheckoutButton"],
        "styling": {
          "backgroundColor": "white",
          "border": "1px solid #e5e7eb",
          "borderRadius": "0.5rem",
          "padding": "1rem",
          "height": "fit-content"
        }
      }
    ],
    "layout": {
      "type": "two_column",
      "mainColumn": "product_grid",
      "sidebar": "shopping_cart"
    },
    "interactions": [
      {
        "component": "ProductCard",
        "event": "click",
        "action": "view_product"
      },
      {
        "component": "ProductCard",
        "event": "add_to_cart_click",
        "action": "add_to_cart"
      },
      {
        "component": "ShoppingCart",
        "event": "checkout_click",
        "action": "start_checkout"
      }
    ]
  }
}
```

### **Test Case 4: Mobile-First Social App**
```json
{
  "input": {
    "patterns": ["bottom_navigation", "swipe_gestures", "pull_to_refresh"],
    "features": ["photo_gallery", "social_sharing", "offline_support"]
  },
  "expected_output": {
    "components": [
      {
        "name": "SocialApp",
        "type": "container",
        "props": {
          "user": "User",
          "posts": "Post[]",
          "onRefresh": "function"
        },
        "children": ["PostFeed", "BottomNavigation"],
        "styling": {
          "display": "flex",
          "flexDirection": "column",
          "height": "100vh"
        }
      },
      {
        "name": "PostFeed",
        "type": "feed",
        "props": {
          "posts": "Post[]",
          "onRefresh": "function",
          "onLoadMore": "function"
        },
        "children": ["PostCard"],
        "styling": {
          "flex": "1",
          "overflow": "auto",
          "padding": "0.5rem"
        }
      },
      {
        "name": "PostCard",
        "type": "card",
        "props": {
          "post": "Post",
          "onLike": "function",
          "onShare": "function",
          "onComment": "function"
        },
        "children": ["UserAvatar", "PostImage", "PostActions"],
        "styling": {
          "backgroundColor": "white",
          "borderRadius": "0.5rem",
          "marginBottom": "1rem",
          "overflow": "hidden"
        }
      },
      {
        "name": "BottomNavigation",
        "type": "navigation",
        "props": {
          "activeTab": "string",
          "onTabChange": "function"
        },
        "children": ["TabItem"],
        "styling": {
          "display": "flex",
          "justifyContent": "space-around",
          "padding": "0.5rem",
          "backgroundColor": "white",
          "borderTop": "1px solid #e5e7eb"
        }
      }
    ],
    "layout": {
      "type": "mobile_optimized",
      "orientation": "portrait",
      "touch_friendly": true
    },
    "interactions": [
      {
        "component": "PostFeed",
        "event": "pull_to_refresh",
        "action": "refresh_posts"
      },
      {
        "component": "PostCard",
        "event": "swipe_left",
        "action": "like_post"
      },
      {
        "component": "PostCard",
        "event": "swipe_right",
        "action": "share_post"
      },
      {
        "component": "BottomNavigation",
        "event": "tab_click",
        "action": "navigate"
      }
    ]
  }
}
```

---

## **🔧 Testing Scripts**

### **Manual Testing**
```javascript
// test-ui-requirement-synthesizer.js
const { UIRequirementSynthesizerAgent } = require('../packages/nw-mcp/src/agents/UIRequirementSynthesizerAgent');

async function testUIRequirementSynthesizer() {
  const agent = new UIRequirementSynthesizerAgent();
  
  const testCases = [
    {
      name: "Simple Todo App",
      input: {
        patterns: ["list_view", "form_input", "action_buttons"],
        features: ["add_todo", "delete_todo", "mark_complete"]
      },
      expected: {
        componentCount: 4,
        hasLayout: true
      }
    },
    {
      name: "Dashboard Application",
      input: {
        patterns: ["sidebar_navigation", "card_layout", "header_bar"],
        features: ["data_visualization", "user_management"]
      },
      expected: {
        componentCount: 6,
        hasLayout: true
      }
    },
    {
      name: "E-commerce Platform",
      input: {
        patterns: ["product_grid", "shopping_cart_sidebar"],
        features: ["product_catalog", "shopping_cart"]
      },
      expected: {
        componentCount: 5,
        hasLayout: true
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    try {
      const result = await agent.synthesize(testCase.input.patterns, testCase.input.features);
      console.log('Result:', JSON.stringify(result, null, 2));
      
      // Validate result
      if (result.components.length === testCase.expected.componentCount) {
        console.log('✅ Component count matches expected');
      } else {
        console.log('❌ Component count mismatch');
      }
    } catch (error) {
      console.error('❌ Test failed:', error.message);
    }
    console.log('---');
  }
}

testUIRequirementSynthesizer();
```

### **Automated Testing**
```typescript
// __tests__/ui-requirement-synthesizer.test.ts
import { UIRequirementSynthesizerAgent } from '../src/agents/UIRequirementSynthesizerAgent';

describe('UI Requirement Synthesizer Agent', () => {
  let agent: UIRequirementSynthesizerAgent;

  beforeEach(() => {
    agent = new UIRequirementSynthesizerAgent();
  });

  test('should synthesize todo app components', async () => {
    const patterns = ["list_view", "form_input", "action_buttons"];
    const features = ["add_todo", "delete_todo", "mark_complete"];
    
    const result = await agent.synthesize(patterns, features);
    
    expect(result.components).toBeDefined();
    expect(result.components.length).toBeGreaterThan(0);
    expect(result.layout).toBeDefined();
    
    // Check for expected components
    const componentNames = result.components.map(c => c.name);
    expect(componentNames).toContain('TodoApp');
    expect(componentNames).toContain('TodoList');
  });

  test('should synthesize dashboard components', async () => {
    const patterns = ["sidebar_navigation", "card_layout"];
    const features = ["data_visualization", "user_management"];
    
    const result = await agent.synthesize(patterns, features);
    
    expect(result.components).toBeDefined();
    expect(result.layout.type).toBe('grid_layout');
    
    // Check for dashboard-specific components
    const componentNames = result.components.map(c => c.name);
    expect(componentNames).toContain('DashboardLayout');
    expect(componentNames).toContain('DashboardCard');
  });

  test('should include proper component props', async () => {
    const patterns = ["list_view"];
    const features = ["add_todo"];
    
    const result = await agent.synthesize(patterns, features);
    
    const todoList = result.components.find(c => c.name === 'TodoList');
    expect(todoList).toBeDefined();
    expect(todoList.props).toBeDefined();
    expect(todoList.props.todos).toBeDefined();
  });

  test('should define component interactions', async () => {
    const patterns = ["form_input", "action_buttons"];
    const features = ["add_todo"];
    
    const result = await agent.synthesize(patterns, features);
    
    expect(result.interactions).toBeDefined();
    expect(result.interactions.length).toBeGreaterThan(0);
    
    const formInteraction = result.interactions.find(i => i.component === 'TodoForm');
    expect(formInteraction).toBeDefined();
    expect(formInteraction.action).toBe('add_todo');
  });

  test('should handle mobile-specific patterns', async () => {
    const patterns = ["bottom_navigation", "swipe_gestures"];
    const features = ["photo_gallery"];
    
    const result = await agent.synthesize(patterns, features);
    
    expect(result.layout.touch_friendly).toBe(true);
    expect(result.layout.type).toBe('mobile_optimized');
    
    const bottomNav = result.components.find(c => c.name === 'BottomNavigation');
    expect(bottomNav).toBeDefined();
  });
});
```

---

## **📊 Performance Benchmarks**

### **Expected Performance**
```javascript
const benchmarks = {
  responseTime: {
    max: 4000, // 4 seconds
    average: 2000, // 2 seconds
    target: 1500 // 1.5 seconds
  },
  tokenUsage: {
    max: 3000,
    average: 1500,
    target: 1200
  },
  accuracy: {
    componentSynthesis: 0.90,
    propDefinition: 0.88,
    layoutGeneration: 0.85
  }
};
```

---

## **🚨 Error Handling**

### **Invalid Input Handling**
```javascript
test('should handle empty patterns', async () => {
  const agent = new UIRequirementSynthesizerAgent();
  const result = await agent.synthesize([], ["feature1"]);
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('No patterns provided');
});

test('should handle empty features', async () => {
  const agent = new UIRequirementSynthesizerAgent();
  const result = await agent.synthesize(["pattern1"], []);
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('No features provided');
});

test('should handle incompatible patterns', async () => {
  const agent = new UIRequirementSynthesizerAgent();
  const result = await agent.synthesize(
    ["mobile_pattern", "desktop_pattern"],
    ["feature1"]
  );
  
  expect(result.success).toBe(true);
  // Should prioritize one pattern type
  expect(result.layout.type).toBeDefined();
});
```

---

## **📋 Testing Checklist**

### **Functional Testing**
- [ ] Synthesizes components from patterns correctly
- [ ] Maps features to appropriate components
- [ ] Defines component props accurately
- [ ] Generates proper layout structures
- [ ] Includes component interactions
- [ ] Handles mobile vs desktop patterns
- [ ] Provides styling guidelines

### **Performance Testing**
- [ ] Response time within acceptable limits
- [ ] Token usage optimized
- [ ] Memory usage stable
- [ ] Concurrent requests handled

### **Integration Testing**
- [ ] Works with UX Pattern Selector
- [ ] Integrates with Validation Agent
- [ ] Provides input for v0 Prompt Builder
- [ ] Maintains consistency with design system 