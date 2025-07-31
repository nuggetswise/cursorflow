# Nuggetwise Agent Prompt Testing Examples

## 🧪 **Testing Overview**

This document provides comprehensive examples for testing all Nuggetwise agent prompts to ensure they work correctly and produce expected outputs.

---

## **🎯 Testing Methodology**

### **Test Structure**
Each test should include:
1. **Input**: Sample user prompt or context
2. **Expected Output**: Expected agent response format
3. **Validation**: Criteria for successful response
4. **Edge Cases**: Boundary conditions and error scenarios

### **Testing Tools**
- **Manual Testing**: Direct API calls to agents
- **Automated Testing**: Unit tests for prompt validation
- **Integration Testing**: End-to-end workflow testing
- **Performance Testing**: Response time and token usage

---

## **🤖 Agent Testing Examples**

### **1. Intent Analysis Agent**

#### **Test Case 1: Simple Todo App**
```json
{
  "input": {
    "prompt": "Create a todo app with add, delete, and mark complete functionality"
  },
  "expected_output": {
    "intent": "create_todo_app",
    "features": ["add_todo", "delete_todo", "mark_complete"],
    "complexity": "simple",
    "framework": "react",
    "styling": "tailwind"
  },
  "validation": {
    "required_fields": ["intent", "features", "complexity"],
    "intent_types": ["create_app", "update_app", "enhance_app"],
    "complexity_levels": ["simple", "moderate", "complex"]
  }
}
```

#### **Test Case 2: Complex E-commerce**
```json
{
  "input": {
    "prompt": "Build an e-commerce platform with user authentication, product catalog, shopping cart, payment processing, and order management"
  },
  "expected_output": {
    "intent": "create_ecommerce_platform",
    "features": [
      "user_authentication",
      "product_catalog", 
      "shopping_cart",
      "payment_processing",
      "order_management"
    ],
    "complexity": "complex",
    "framework": "react",
    "styling": "tailwind",
    "backend_required": true
  }
}
```

#### **Test Case 3: Edge Case - Vague Request**
```json
{
  "input": {
    "prompt": "Make something cool"
  },
  "expected_output": {
    "intent": "create_app",
    "features": ["basic_ui"],
    "complexity": "simple",
    "clarification_needed": true,
    "suggestions": [
      "Could you provide more details about what you'd like to build?",
      "What type of application are you thinking of?"
    ]
  }
}
```

### **2. UX Pattern Selector Agent**

#### **Test Case 1: Dashboard Application**
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
        "components": ["Sidebar", "NavItem", "NavGroup"]
      },
      {
        "name": "card_layout",
        "description": "Grid of cards for data display",
        "components": ["Card", "CardHeader", "CardContent"]
      },
      {
        "name": "header_bar",
        "description": "Top header with user info and actions",
        "components": ["Header", "UserMenu", "ActionButtons"]
      }
    ],
    "layout": "sidebar_with_header",
    "responsive": true
  }
}
```

#### **Test Case 2: Mobile-First App**
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
        "components": ["BottomNav", "TabItem"]
      },
      {
        "name": "swipe_gestures",
        "description": "Touch-based interactions",
        "components": ["SwipeableCard", "GestureHandler"]
      },
      {
        "name": "pull_to_refresh",
        "description": "Pull down to refresh content",
        "components": ["RefreshControl"]
      }
    ],
    "layout": "mobile_optimized",
    "responsive": true,
    "touch_friendly": true
  }
}
```

### **3. Validation Agent**

#### **Test Case 1: Valid Simple Request**
```json
{
  "input": {
    "intent": "create_todo_app",
    "patterns": ["list_view", "form_input", "action_buttons"]
  },
  "expected_output": {
    "valid": true,
    "confidence": 0.95,
    "estimated_build_time": "2-3 minutes",
    "estimated_cost": "$0.50-$1.00",
    "recommendations": [
      "Consider adding dark mode for better UX",
      "Include keyboard shortcuts for power users"
    ]
  }
}
```

#### **Test Case 2: Complex Request Validation**
```json
{
  "input": {
    "intent": "create_full_stack_app",
    "patterns": ["authentication", "database", "api", "real_time"]
  },
  "expected_output": {
    "valid": true,
    "confidence": 0.85,
    "estimated_build_time": "15-20 minutes",
    "estimated_cost": "$3.00-$5.00",
    "warnings": [
      "Complex application may require backend setup",
      "Consider breaking into smaller components"
    ],
    "recommendations": [
      "Start with MVP features first",
      "Use authentication service like Auth0",
      "Consider using Supabase for backend"
    ]
  }
}
```

#### **Test Case 3: Invalid Request**
```json
{
  "input": {
    "intent": "create_ai_model",
    "patterns": ["neural_network", "training_interface"]
  },
  "expected_output": {
    "valid": false,
    "confidence": 0.1,
    "reasons": [
      "AI model training is beyond current scope",
      "Requires specialized ML infrastructure"
    ],
    "suggestions": [
      "Consider using pre-trained models via API",
      "Focus on UI for AI model interaction"
    ]
  }
}
```

### **4. UI Requirement Synthesizer Agent**

#### **Test Case 1: Component Specification**
```json
{
  "input": {
    "patterns": ["sidebar_navigation", "card_layout"],
    "features": ["user_dashboard", "data_display"]
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
        "children": ["Sidebar", "Header", "MainContent"]
      },
      {
        "name": "Sidebar",
        "type": "navigation",
        "props": {
          "items": "NavItem[]",
          "collapsed": "boolean",
          "onItemClick": "function"
        }
      },
      {
        "name": "DataCard",
        "type": "display",
        "props": {
          "title": "string",
          "value": "string|number",
          "trend": "string",
          "icon": "string"
        }
      }
    ],
    "layout": {
      "type": "grid",
      "columns": "responsive",
      "spacing": "medium"
    }
  }
}
```

### **5. v0 Prompt Builder Agent**

#### **Test Case 1: Simple Component**
```json
{
  "input": {
    "components": [
      {
        "name": "TodoList",
        "type": "list",
        "props": {
          "todos": "Todo[]",
          "onToggle": "function",
          "onDelete": "function"
        }
      }
    ]
  },
  "expected_output": {
    "v0_prompt": "Create a React component called TodoList that displays a list of todo items. Each todo should have a checkbox to mark as complete and a delete button. The component should accept todos array, onToggle function, and onDelete function as props. Use Tailwind CSS for styling. Make it responsive and accessible.",
    "model": "v0-1.0-md",
    "estimated_tokens": 1500
  }
}
```

#### **Test Case 2: Complex Layout**
```json
{
  "input": {
    "components": [
      {
        "name": "Dashboard",
        "type": "layout",
        "children": ["Sidebar", "Header", "MainContent"]
      }
    ]
  },
  "expected_output": {
    "v0_prompt": "Create a React dashboard layout with a sidebar navigation, header with user menu, and main content area. The sidebar should be collapsible and contain navigation items. The header should have a user avatar, notifications, and settings menu. The main content should be responsive and support different content types. Use Tailwind CSS and make it fully responsive with dark mode support.",
    "model": "v0-1.0-md",
    "estimated_tokens": 2500
  }
}
```

---

## **🔧 Testing Scripts**

### **Manual Testing Script**
```javascript
// test-prompts.js
const { IntentAnalysisAgent } = require('../packages/nw-mcp/src/agents/IntentAnalysisAgent');

async function testIntentAnalysis() {
  const agent = new IntentAnalysisAgent();
  
  const testCases = [
    {
      name: "Simple Todo App",
      prompt: "Create a todo app with add, delete, and mark complete functionality",
      expected: {
        intent: "create_todo_app",
        complexity: "simple"
      }
    },
    {
      name: "Complex E-commerce",
      prompt: "Build an e-commerce platform with user authentication, product catalog, shopping cart, payment processing, and order management",
      expected: {
        intent: "create_ecommerce_platform",
        complexity: "complex"
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    try {
      const result = await agent.analyze(testCase.prompt);
      console.log('Result:', JSON.stringify(result, null, 2));
      
      // Validate result
      if (result.intent === testCase.expected.intent) {
        console.log('✅ Intent matches expected');
      } else {
        console.log('❌ Intent mismatch');
      }
    } catch (error) {
      console.error('❌ Test failed:', error.message);
    }
    console.log('---');
  }
}

testIntentAnalysis();
```

### **Automated Testing**
```typescript
// __tests__/agents.test.ts
import { IntentAnalysisAgent } from '../src/agents/IntentAnalysisAgent';
import { UXPatternSelectorAgent } from '../src/agents/UXPatternSelectorAgent';

describe('Agent Tests', () => {
  let intentAgent: IntentAnalysisAgent;
  let uxAgent: UXPatternSelectorAgent;

  beforeEach(() => {
    intentAgent = new IntentAnalysisAgent();
    uxAgent = new UXPatternSelectorAgent();
  });

  describe('Intent Analysis Agent', () => {
    test('should analyze simple todo app intent', async () => {
      const prompt = "Create a todo app with add, delete, and mark complete functionality";
      const result = await intentAgent.analyze(prompt);
      
      expect(result.intent).toBe('create_todo_app');
      expect(result.complexity).toBe('simple');
      expect(result.features).toContain('add_todo');
      expect(result.features).toContain('delete_todo');
    });

    test('should handle complex e-commerce intent', async () => {
      const prompt = "Build an e-commerce platform with user authentication, product catalog, shopping cart, payment processing, and order management";
      const result = await intentAgent.analyze(prompt);
      
      expect(result.intent).toBe('create_ecommerce_platform');
      expect(result.complexity).toBe('complex');
      expect(result.features).toContain('user_authentication');
      expect(result.features).toContain('payment_processing');
    });

    test('should request clarification for vague prompts', async () => {
      const prompt = "Make something cool";
      const result = await intentAgent.analyze(prompt);
      
      expect(result.clarification_needed).toBe(true);
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('UX Pattern Selector Agent', () => {
    test('should select appropriate patterns for dashboard', async () => {
      const intent = {
        intent: 'create_dashboard',
        features: ['data_visualization', 'user_management']
      };
      
      const result = await uxAgent.selectPatterns(intent);
      
      expect(result.patterns).toBeDefined();
      expect(result.patterns.length).toBeGreaterThan(0);
      expect(result.layout).toBeDefined();
      expect(result.responsive).toBe(true);
    });
  });
});
```

---

## **📊 Performance Testing**

### **Response Time Benchmarks**
```javascript
// performance-test.js
async function benchmarkAgent(agent, testCases) {
  const results = [];
  
  for (const testCase of testCases) {
    const startTime = Date.now();
    const result = await agent.process(testCase.input);
    const endTime = Date.now();
    
    results.push({
      testCase: testCase.name,
      responseTime: endTime - startTime,
      success: result.success,
      tokenCount: result.tokenCount || 0
    });
  }
  
  return results;
}

// Expected benchmarks
const benchmarks = {
  intentAnalysis: {
    maxResponseTime: 5000, // 5 seconds
    avgResponseTime: 2000, // 2 seconds
    maxTokens: 1000
  },
  uxPatternSelector: {
    maxResponseTime: 3000,
    avgResponseTime: 1500,
    maxTokens: 1500
  },
  validation: {
    maxResponseTime: 2000,
    avgResponseTime: 1000,
    maxTokens: 800
  }
};
```

---

## **🚨 Error Handling Tests**

### **Network Error Handling**
```javascript
// Test agent behavior when API is unavailable
test('should handle OpenAI API errors gracefully', async () => {
  // Mock API failure
  jest.spyOn(openai.chat.completions, 'create').mockRejectedValue(
    new Error('API rate limit exceeded')
  );
  
  const agent = new IntentAnalysisAgent();
  const result = await agent.analyze("Create a simple app");
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('API rate limit exceeded');
  expect(result.retryAfter).toBeDefined();
});
```

### **Invalid Input Handling**
```javascript
test('should handle empty prompts', async () => {
  const agent = new IntentAnalysisAgent();
  const result = await agent.analyze("");
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('Empty prompt');
});

test('should handle extremely long prompts', async () => {
  const longPrompt = "Create an app ".repeat(1000); // 15,000 characters
  const agent = new IntentAnalysisAgent();
  const result = await agent.analyze(longPrompt);
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('Prompt too long');
});
```

---

## **📋 Testing Checklist**

### **Pre-Testing Setup**
- [ ] All environment variables configured
- [ ] API keys valid and have sufficient quota
- [ ] Test data prepared
- [ ] Mock services configured for offline testing

### **Functional Testing**
- [ ] All agents respond to valid inputs
- [ ] Error handling works for invalid inputs
- [ ] Response format matches expected schema
- [ ] Edge cases handled appropriately

### **Performance Testing**
- [ ] Response times within acceptable limits
- [ ] Token usage optimized
- [ ] Memory usage stable
- [ ] Concurrent requests handled

### **Integration Testing**
- [ ] Agent orchestration works end-to-end
- [ ] Data flows correctly between agents
- [ ] Error propagation handled properly
- [ ] Budget and timeout limits enforced

---

*These testing examples ensure the Nuggetwise agent prompts are robust, reliable, and ready for production use.* 