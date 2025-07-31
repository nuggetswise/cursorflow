# Intent Analysis Agent - Testing Examples

## 🎯 **Agent Overview**

The Intent Analysis Agent is responsible for understanding user goals and requirements from natural language prompts. It extracts core product requirements, identifies user roles, and determines complexity levels.

---

## **🧪 Testing Examples**

### **Test Case 1: Simple Todo App**
```json
{
  "input": {
    "prompt": "Create a todo app with add, delete, and mark complete functionality"
  },
  "expected_output": {
    "goal": "Create a task management application with basic CRUD operations",
    "userRoles": ["individual user", "task manager"],
    "coreFeatures": [
      {
        "name": "Add Todo",
        "description": "Create new todo items",
        "priority": "high"
      },
      {
        "name": "Delete Todo", 
        "description": "Remove completed or unwanted todos",
        "priority": "high"
      },
      {
        "name": "Mark Complete",
        "description": "Toggle todo completion status",
        "priority": "high"
      }
    ],
    "constraints": ["web-based", "responsive design"],
    "platform": "web",
    "complexity": "simple"
  },
  "validation": {
    "required_fields": ["goal", "userRoles", "coreFeatures", "complexity"],
    "complexity_levels": ["simple", "moderate", "complex"],
    "platform_types": ["web", "mobile", "desktop"]
  }
}
```

### **Test Case 2: Complex E-commerce Platform**
```json
{
  "input": {
    "prompt": "Build an e-commerce platform with user authentication, product catalog, shopping cart, payment processing, and order management"
  },
  "expected_output": {
    "goal": "Create a comprehensive online shopping platform with full transaction capabilities",
    "userRoles": ["customer", "admin", "merchant"],
    "coreFeatures": [
      {
        "name": "User Authentication",
        "description": "Secure login and registration system",
        "priority": "high"
      },
      {
        "name": "Product Catalog",
        "description": "Browse and search product listings",
        "priority": "high"
      },
      {
        "name": "Shopping Cart",
        "description": "Add and manage items for purchase",
        "priority": "high"
      },
      {
        "name": "Payment Processing",
        "description": "Secure payment gateway integration",
        "priority": "high"
      },
      {
        "name": "Order Management",
        "description": "Track and manage customer orders",
        "priority": "high"
      }
    ],
    "constraints": ["secure", "scalable", "mobile-responsive"],
    "platform": "web",
    "complexity": "complex"
  }
}
```

### **Test Case 3: Mobile-First Social App**
```json
{
  "input": {
    "prompt": "Create a social media app for sharing photos with friends, like Instagram but simpler"
  },
  "expected_output": {
    "goal": "Build a photo-sharing social platform with simplified features",
    "userRoles": ["user", "content creator"],
    "coreFeatures": [
      {
        "name": "Photo Upload",
        "description": "Share photos from device gallery",
        "priority": "high"
      },
      {
        "name": "Friend Connections",
        "description": "Add and manage friend relationships",
        "priority": "high"
      },
      {
        "name": "Photo Feed",
        "description": "View friends' shared photos",
        "priority": "high"
      },
      {
        "name": "Like System",
        "description": "React to friends' photos",
        "priority": "medium"
      }
    ],
    "constraints": ["mobile-first", "simple UI", "fast loading"],
    "platform": "mobile",
    "complexity": "moderate"
  }
}
```

### **Test Case 4: Edge Case - Vague Request**
```json
{
  "input": {
    "prompt": "Make something cool"
  },
  "expected_output": {
    "goal": "Create an engaging application (clarification needed)",
    "userRoles": ["general user"],
    "coreFeatures": [
      {
        "name": "Basic UI",
        "description": "Simple user interface",
        "priority": "low"
      }
    ],
    "constraints": ["web-based"],
    "platform": "web",
    "complexity": "simple",
    "clarification_needed": true,
    "suggestions": [
      "Could you provide more details about what you'd like to build?",
      "What type of application are you thinking of?",
      "Are there any specific features you have in mind?"
    ]
  }
}
```

### **Test Case 5: Dashboard Application**
```json
{
  "input": {
    "prompt": "Build a dashboard for tracking sales metrics, user analytics, and inventory levels"
  },
  "expected_output": {
    "goal": "Create a comprehensive business intelligence dashboard",
    "userRoles": ["manager", "analyst", "executive"],
    "coreFeatures": [
      {
        "name": "Sales Metrics",
        "description": "Track revenue, conversions, and sales trends",
        "priority": "high"
      },
      {
        "name": "User Analytics",
        "description": "Monitor user behavior and engagement",
        "priority": "high"
      },
      {
        "name": "Inventory Tracking",
        "description": "Real-time inventory levels and alerts",
        "priority": "high"
      },
      {
        "name": "Data Visualization",
        "description": "Charts and graphs for data presentation",
        "priority": "medium"
      }
    ],
    "constraints": ["real-time data", "secure access", "responsive design"],
    "platform": "web",
    "complexity": "complex"
  }
}
```

---

## **🔧 Testing Scripts**

### **Manual Testing**
```javascript
// test-intent-analysis.js
const { IntentAnalysisAgent } = require('../packages/nw-mcp/src/agents/IntentAnalysisAgent');

async function testIntentAnalysis() {
  const agent = new IntentAnalysisAgent();
  
  const testCases = [
    {
      name: "Simple Todo App",
      prompt: "Create a todo app with add, delete, and mark complete functionality",
      expected: {
        complexity: "simple",
        platform: "web"
      }
    },
    {
      name: "Complex E-commerce",
      prompt: "Build an e-commerce platform with user authentication, product catalog, shopping cart, payment processing, and order management",
      expected: {
        complexity: "complex",
        platform: "web"
      }
    },
    {
      name: "Vague Request",
      prompt: "Make something cool",
      expected: {
        clarification_needed: true
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    try {
      const result = await agent.analyze(testCase.prompt);
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

testIntentAnalysis();
```

### **Automated Testing**
```typescript
// __tests__/intent-analysis.test.ts
import { IntentAnalysisAgent } from '../src/agents/IntentAnalysisAgent';

describe('Intent Analysis Agent', () => {
  let agent: IntentAnalysisAgent;

  beforeEach(() => {
    agent = new IntentAnalysisAgent();
  });

  test('should analyze simple todo app intent', async () => {
    const prompt = "Create a todo app with add, delete, and mark complete functionality";
    const result = await agent.analyze(prompt);
    
    expect(result.complexity).toBe('simple');
    expect(result.platform).toBe('web');
    expect(result.coreFeatures).toHaveLength(3);
    expect(result.coreFeatures[0].name).toBe('Add Todo');
  });

  test('should handle complex e-commerce intent', async () => {
    const prompt = "Build an e-commerce platform with user authentication, product catalog, shopping cart, payment processing, and order management";
    const result = await agent.analyze(prompt);
    
    expect(result.complexity).toBe('complex');
    expect(result.platform).toBe('web');
    expect(result.coreFeatures).toHaveLength(5);
    expect(result.userRoles).toContain('customer');
  });

  test('should request clarification for vague prompts', async () => {
    const prompt = "Make something cool";
    const result = await agent.analyze(prompt);
    
    expect(result.clarification_needed).toBe(true);
    expect(result.suggestions).toBeDefined();
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  test('should identify mobile platform correctly', async () => {
    const prompt = "Create a mobile app for tracking fitness goals";
    const result = await agent.analyze(prompt);
    
    expect(result.platform).toBe('mobile');
    expect(result.complexity).toBe('moderate');
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
    average: 2000, // 2 seconds
    target: 1500 // 1.5 seconds
  },
  tokenUsage: {
    max: 1000,
    average: 500,
    target: 400
  },
  accuracy: {
    intentRecognition: 0.95,
    complexityAssessment: 0.90,
    featureExtraction: 0.88
  }
};
```

---

## **🚨 Error Handling**

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

test('should handle non-English prompts', async () => {
  const spanishPrompt = "Crear una aplicación de tareas";
  const agent = new IntentAnalysisAgent();
  const result = await agent.analyze(spanishPrompt);
  
  expect(result.success).toBe(true);
  expect(result.complexity).toBeDefined();
});
```

---

## **📋 Testing Checklist**

### **Functional Testing**
- [ ] Analyzes simple app requests correctly
- [ ] Handles complex multi-feature requests
- [ ] Identifies platform requirements
- [ ] Assesses complexity levels accurately
- [ ] Extracts core features properly
- [ ] Requests clarification for vague prompts
- [ ] Handles edge cases gracefully

### **Performance Testing**
- [ ] Response time within acceptable limits
- [ ] Token usage optimized
- [ ] Memory usage stable
- [ ] Concurrent requests handled

### **Integration Testing**
- [ ] Works with UX Pattern Selector
- [ ] Integrates with Validation Agent
- [ ] Provides input for UI Requirement Synthesizer
- [ ] Maintains data consistency across agents 