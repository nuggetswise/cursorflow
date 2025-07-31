# v0 Prompt Builder Agent - Testing Examples

## 🎯 **Agent Overview**

The v0 Prompt Builder Agent converts UI requirements into optimized prompts for the v0.dev platform. It creates detailed, structured prompts that generate high-quality React components with proper styling and functionality.

---

## **🧪 Testing Examples**

### **Test Case 1: Simple Todo Component**
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
    "v0_prompt": "Create a React component called TodoList that displays a list of todo items. Each todo should have a checkbox to mark as complete and a delete button. The component should accept todos array, onToggle function, and onDelete function as props. Use Tailwind CSS for styling. Make it responsive and accessible. Include proper TypeScript types.",
    "model": "v0-1.0-md",
    "estimated_tokens": 1500,
    "complexity": "simple",
    "styling_framework": "tailwind"
  }
}
```

### **Test Case 2: Complex Dashboard Layout**
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
    "v0_prompt": "Create a React dashboard layout with a sidebar navigation, header with user menu, and main content area. The sidebar should be collapsible and contain navigation items with icons. The header should have a user avatar, notifications bell, and settings menu. The main content should be responsive and support different content types. Use Tailwind CSS and make it fully responsive with dark mode support. Include proper TypeScript interfaces and accessibility features.",
    "model": "v0-1.0-md",
    "estimated_tokens": 2500,
    "complexity": "complex",
    "styling_framework": "tailwind"
  }
}
```

### **Test Case 3: E-commerce Product Card**
```json
{
  "input": {
    "components": [
      {
        "name": "ProductCard",
        "type": "card",
        "props": {
          "product": "Product",
          "onClick": "function",
          "onAddToCart": "function"
        },
        "children": ["ProductImage", "ProductInfo", "AddToCartButton"]
      }
    ]
  },
  "expected_output": {
    "v0_prompt": "Create a React ProductCard component for an e-commerce site. The card should display a product image, title, price, rating, and an 'Add to Cart' button. Include hover effects and loading states. The component should accept product object, onClick handler, and onAddToCart handler as props. Use Tailwind CSS with a modern design. Make it responsive and include proper image optimization. Add TypeScript interfaces for the Product type.",
    "model": "v0-1.0-md",
    "estimated_tokens": 1800,
    "complexity": "moderate",
    "styling_framework": "tailwind"
  }
}
```

### **Test Case 4: Form Component with Validation**
```json
{
  "input": {
    "components": [
      {
        "name": "ContactForm",
        "type": "form",
        "props": {
          "onSubmit": "function",
          "loading": "boolean"
        },
        "children": ["TextInput", "EmailInput", "Textarea", "SubmitButton"]
      }
    ]
  },
  "expected_output": {
    "v0_prompt": "Create a React ContactForm component with form validation. Include fields for name, email, and message with proper validation rules. The form should show validation errors, loading states, and success messages. Use Tailwind CSS for styling with focus states and error styling. Include proper accessibility features like ARIA labels and keyboard navigation. Add TypeScript interfaces for form data and validation errors.",
    "model": "v0-1.0-md",
    "estimated_tokens": 2000,
    "complexity": "moderate",
    "styling_framework": "tailwind"
  }
}
```

### **Test Case 5: Data Table Component**
```json
{
  "input": {
    "components": [
      {
        "name": "DataTable",
        "type": "table",
        "props": {
          "data": "any[]",
          "columns": "Column[]",
          "onSort": "function",
          "onRowClick": "function"
        }
      }
    ]
  },
  "expected_output": {
    "v0_prompt": "Create a React DataTable component with sorting, pagination, and row selection. The table should be responsive and support different data types. Include column headers with sort indicators, pagination controls, and row hover effects. Use Tailwind CSS for styling with a clean, professional look. Add TypeScript interfaces for Column and TableData types. Include accessibility features like keyboard navigation and screen reader support.",
    "model": "v0-1.0-md",
    "estimated_tokens": 2200,
    "complexity": "complex",
    "styling_framework": "tailwind"
  }
}
```

### **Test Case 6: Modal Component**
```json
{
  "input": {
    "components": [
      {
        "name": "Modal",
        "type": "overlay",
        "props": {
          "isOpen": "boolean",
          "onClose": "function",
          "title": "string",
          "children": "ReactNode"
        }
      }
    ]
  },
  "expected_output": {
    "v0_prompt": "Create a React Modal component with backdrop, close button, and proper focus management. The modal should be centered, have a backdrop overlay, and support ESC key to close. Include proper TypeScript props and accessibility features like focus trapping and ARIA attributes. Use Tailwind CSS for styling with smooth animations. Make it responsive and support different content types.",
    "model": "v0-1.0-md",
    "estimated_tokens": 1600,
    "complexity": "moderate",
    "styling_framework": "tailwind"
  }
}
```

---

## **🔧 Testing Scripts**

### **Manual Testing**
```javascript
// test-v0-prompt-builder.js
const { V0PromptBuilderAgent } = require('../packages/nw-mcp/src/agents/V0PromptBuilderAgent');

async function testV0PromptBuilder() {
  const agent = new V0PromptBuilderAgent();
  
  const testCases = [
    {
      name: "Simple Todo Component",
      input: {
        components: [
          {
            name: "TodoList",
            type: "list",
            props: {
              todos: "Todo[]",
              onToggle: "function",
              onDelete: "function"
            }
          }
        ]
      },
      expected: {
        complexity: "simple",
        estimatedTokens: 1500
      }
    },
    {
      name: "Complex Dashboard",
      input: {
        components: [
          {
            name: "Dashboard",
            type: "layout",
            children: ["Sidebar", "Header", "MainContent"]
          }
        ]
      },
      expected: {
        complexity: "complex",
        estimatedTokens: 2500
      }
    },
    {
      name: "Form Component",
      input: {
        components: [
          {
            name: "ContactForm",
            type: "form",
            props: {
              onSubmit: "function",
              loading: "boolean"
            }
          }
        ]
      },
      expected: {
        complexity: "moderate",
        estimatedTokens: 2000
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    try {
      const result = await agent.buildPrompt(testCase.input.components);
      console.log('Result:', JSON.stringify(result, null, 2));
      
      // Validate result
      if (result.complexity === testCase.expected.complexity) {
        console.log('✅ Complexity matches expected');
      } else {
        console.log('❌ Complexity mismatch');
      }
    } catch (error) {
      console.error('❌ Test failed:', error.message);
    }
    console.log('---');
  }
}

testV0PromptBuilder();
```

### **Automated Testing**
```typescript
// __tests__/v0-prompt-builder.test.ts
import { V0PromptBuilderAgent } from '../src/agents/V0PromptBuilderAgent';

describe('v0 Prompt Builder Agent', () => {
  let agent: V0PromptBuilderAgent;

  beforeEach(() => {
    agent = new V0PromptBuilderAgent();
  });

  test('should build prompt for simple component', async () => {
    const components = [
      {
        name: "TodoList",
        type: "list",
        props: {
          todos: "Todo[]",
          onToggle: "function"
        }
      }
    ];
    
    const result = await agent.buildPrompt(components);
    
    expect(result.v0_prompt).toBeDefined();
    expect(result.model).toBe('v0-1.0-md');
    expect(result.complexity).toBe('simple');
    expect(result.v0_prompt).toContain('TodoList');
    expect(result.v0_prompt).toContain('Tailwind CSS');
  });

  test('should build prompt for complex layout', async () => {
    const components = [
      {
        name: "Dashboard",
        type: "layout",
        children: ["Sidebar", "Header", "MainContent"]
      }
    ];
    
    const result = await agent.buildPrompt(components);
    
    expect(result.complexity).toBe('complex');
    expect(result.estimated_tokens).toBeGreaterThan(2000);
    expect(result.v0_prompt).toContain('sidebar');
    expect(result.v0_prompt).toContain('responsive');
  });

  test('should include TypeScript in prompts', async () => {
    const components = [
      {
        name: "ProductCard",
        type: "card",
        props: {
          product: "Product",
          onClick: "function"
        }
      }
    ];
    
    const result = await agent.buildPrompt(components);
    
    expect(result.v0_prompt).toContain('TypeScript');
    expect(result.v0_prompt).toContain('interfaces');
  });

  test('should include accessibility features', async () => {
    const components = [
      {
        name: "Modal",
        type: "overlay",
        props: {
          isOpen: "boolean",
          onClose: "function"
        }
      }
    ];
    
    const result = await agent.buildPrompt(components);
    
    expect(result.v0_prompt).toContain('accessibility');
    expect(result.v0_prompt).toContain('ARIA');
  });

  test('should handle multiple components', async () => {
    const components = [
      {
        name: "TodoList",
        type: "list",
        props: { todos: "Todo[]" }
      },
      {
        name: "TodoForm",
        type: "form",
        props: { onSubmit: "function" }
      }
    ];
    
    const result = await agent.buildPrompt(components);
    
    expect(result.v0_prompt).toContain('TodoList');
    expect(result.v0_prompt).toContain('TodoForm');
    expect(result.estimated_tokens).toBeGreaterThan(1500);
  });

  test('should optimize token usage', async () => {
    const components = [
      {
        name: "SimpleButton",
        type: "button",
        props: { onClick: "function" }
      }
    ];
    
    const result = await agent.buildPrompt(components);
    
    expect(result.estimated_tokens).toBeLessThan(1000);
    expect(result.complexity).toBe('simple');
  });
});
```

---

## **📊 Performance Benchmarks**

### **Expected Performance**
```javascript
const benchmarks = {
  responseTime: {
    max: 5000, // 5 seconds
    average: 2500, // 2.5 seconds
    target: 2000 // 2 seconds
  },
  tokenUsage: {
    max: 4000,
    average: 2000,
    target: 1500
  },
  accuracy: {
    promptQuality: 0.92,
    componentGeneration: 0.89,
    stylingInstructions: 0.85
  }
};
```

---

## **🚨 Error Handling**

### **Invalid Input Handling**
```javascript
test('should handle empty components', async () => {
  const agent = new V0PromptBuilderAgent();
  const result = await agent.buildPrompt([]);
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('No components provided');
});

test('should handle invalid component structure', async () => {
  const agent = new V0PromptBuilderAgent();
  const result = await agent.buildPrompt([
    { invalid: 'structure' }
  ]);
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('Invalid component structure');
});

test('should handle unsupported component types', async () => {
  const agent = new V0PromptBuilderAgent();
  const result = await agent.buildPrompt([
    {
      name: "TestComponent",
      type: "unsupported_type",
      props: {}
    }
  ]);
  
  expect(result.success).toBe(true);
  // Should still generate a prompt but with warnings
  expect(result.v0_prompt).toContain('TestComponent');
});
```

---

## **📋 Testing Checklist**

### **Functional Testing**
- [ ] Builds prompts for simple components
- [ ] Handles complex multi-component layouts
- [ ] Includes proper TypeScript instructions
- [ ] Adds accessibility requirements
- [ ] Optimizes token usage
- [ ] Generates responsive design instructions
- [ ] Includes proper styling framework guidance

### **Performance Testing**
- [ ] Response time within acceptable limits
- [ ] Token usage optimized
- [ ] Memory usage stable
- [ ] Concurrent requests handled

### **Integration Testing**
- [ ] Works with UI Requirement Synthesizer
- [ ] Integrates with v0 API
- [ ] Provides input for code generation
- [ ] Maintains consistency with design system 