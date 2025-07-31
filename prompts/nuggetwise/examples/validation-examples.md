# Validation Agent - Testing Examples

## 🎯 **Agent Overview**

The Validation Agent is responsible for validating the feasibility of proposed solutions, assessing risks, and providing recommendations for improvement. It ensures that the generated solutions are practical and meet user requirements.

---

## **🧪 Testing Examples**

### **Test Case 1: Valid Simple Request**
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
    "risk_level": "low",
    "recommendations": [
      "Consider adding dark mode for better UX",
      "Include keyboard shortcuts for power users",
      "Add local storage for offline functionality"
    ],
    "technical_notes": [
      "Simple React components required",
      "No backend dependencies",
      "Can be deployed as static site"
    ]
  }
}
```

### **Test Case 2: Complex Request Validation**
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
    "risk_level": "medium",
    "warnings": [
      "Complex application may require backend setup",
      "Consider breaking into smaller components",
      "Real-time features may need WebSocket implementation"
    ],
    "recommendations": [
      "Start with MVP features first",
      "Use authentication service like Auth0",
      "Consider using Supabase for backend",
      "Implement progressive enhancement"
    ],
    "technical_notes": [
      "Requires backend API development",
      "Database schema design needed",
      "Security considerations important",
      "Scalability planning recommended"
    ]
  }
}
```

### **Test Case 3: Invalid Request**
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
      "Requires specialized ML infrastructure",
      "Not supported by v0 platform"
    ],
    "suggestions": [
      "Consider using pre-trained models via API",
      "Focus on UI for AI model interaction",
      "Use existing AI services like OpenAI"
    ],
    "alternative_approaches": [
      "Build UI for AI model deployment",
      "Create interface for model inference",
      "Develop AI-powered features using APIs"
    ]
  }
}
```

### **Test Case 4: High-Risk Request**
```json
{
  "input": {
    "intent": "create_payment_processor",
    "patterns": ["payment_gateway", "security", "compliance"]
  },
  "expected_output": {
    "valid": true,
    "confidence": 0.70,
    "estimated_build_time": "25-30 minutes",
    "estimated_cost": "$8.00-$12.00",
    "risk_level": "high",
    "critical_warnings": [
      "Payment processing requires PCI compliance",
      "Security vulnerabilities could be catastrophic",
      "Legal and regulatory requirements apply"
    ],
    "recommendations": [
      "Use established payment providers (Stripe, PayPal)",
      "Implement proper security measures",
      "Consult with legal experts",
      "Consider using existing payment solutions"
    ],
    "compliance_notes": [
      "PCI DSS compliance required",
      "GDPR considerations for EU users",
      "Local payment regulations apply"
    ]
  }
}
```

### **Test Case 5: Performance-Critical Request**
```json
{
  "input": {
    "intent": "create_real_time_dashboard",
    "patterns": ["real_time_updates", "data_visualization", "high_performance"]
  },
  "expected_output": {
    "valid": true,
    "confidence": 0.80,
    "estimated_build_time": "20-25 minutes",
    "estimated_cost": "$5.00-$8.00",
    "risk_level": "medium",
    "performance_considerations": [
      "Real-time updates may impact performance",
      "Large datasets require optimization",
      "WebSocket connections need management"
    ],
    "recommendations": [
      "Implement data pagination",
      "Use efficient chart libraries",
      "Consider server-sent events for updates",
      "Implement proper error handling"
    ],
    "technical_notes": [
      "WebSocket or SSE implementation needed",
      "Data caching strategy required",
      "Performance monitoring essential",
      "Consider using specialized libraries"
    ]
  }
}
```

---

## **🔧 Testing Scripts**

### **Manual Testing**
```javascript
// test-validation.js
const { ValidationAgent } = require('../packages/nw-mcp/src/agents/ValidationAgent');

async function testValidation() {
  const agent = new ValidationAgent();
  
  const testCases = [
    {
      name: "Simple Todo App",
      input: {
        intent: "create_todo_app",
        patterns: ["list_view", "form_input", "action_buttons"]
      },
      expected: {
        valid: true,
        risk_level: "low"
      }
    },
    {
      name: "Complex Full Stack",
      input: {
        intent: "create_full_stack_app",
        patterns: ["authentication", "database", "api"]
      },
      expected: {
        valid: true,
        risk_level: "medium"
      }
    },
    {
      name: "Invalid AI Model",
      input: {
        intent: "create_ai_model",
        patterns: ["neural_network", "training_interface"]
      },
      expected: {
        valid: false
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    try {
      const result = await agent.validate(testCase.input.intent, testCase.input.patterns);
      console.log('Result:', JSON.stringify(result, null, 2));
      
      // Validate result
      if (result.valid === testCase.expected.valid) {
        console.log('✅ Validity matches expected');
      } else {
        console.log('❌ Validity mismatch');
      }
    } catch (error) {
      console.error('❌ Test failed:', error.message);
    }
    console.log('---');
  }
}

testValidation();
```

### **Automated Testing**
```typescript
// __tests__/validation.test.ts
import { ValidationAgent } from '../src/agents/ValidationAgent';

describe('Validation Agent', () => {
  let agent: ValidationAgent;

  beforeEach(() => {
    agent = new ValidationAgent();
  });

  test('should validate simple todo app', async () => {
    const intent = "create_todo_app";
    const patterns = ["list_view", "form_input", "action_buttons"];
    
    const result = await agent.validate(intent, patterns);
    
    expect(result.valid).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.8);
    expect(result.risk_level).toBe('low');
    expect(result.recommendations).toBeDefined();
  });

  test('should validate complex full stack app', async () => {
    const intent = "create_full_stack_app";
    const patterns = ["authentication", "database", "api"];
    
    const result = await agent.validate(intent, patterns);
    
    expect(result.valid).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.7);
    expect(result.risk_level).toBe('medium');
    expect(result.warnings).toBeDefined();
  });

  test('should reject invalid requests', async () => {
    const intent = "create_ai_model";
    const patterns = ["neural_network", "training_interface"];
    
    const result = await agent.validate(intent, patterns);
    
    expect(result.valid).toBe(false);
    expect(result.confidence).toBeLessThan(0.3);
    expect(result.reasons).toBeDefined();
    expect(result.suggestions).toBeDefined();
  });

  test('should provide cost estimates', async () => {
    const intent = "create_todo_app";
    const patterns = ["list_view", "form_input"];
    
    const result = await agent.validate(intent, patterns);
    
    expect(result.estimated_cost).toBeDefined();
    expect(result.estimated_build_time).toBeDefined();
    expect(result.estimated_cost).toMatch(/\$\d+\.\d+/);
  });

  test('should assess risk levels correctly', async () => {
    const testCases = [
      {
        intent: "create_todo_app",
        patterns: ["list_view"],
        expectedRisk: "low"
      },
      {
        intent: "create_payment_processor",
        patterns: ["payment_gateway"],
        expectedRisk: "high"
      }
    ];
    
    for (const testCase of testCases) {
      const result = await agent.validate(testCase.intent, testCase.patterns);
      expect(result.risk_level).toBe(testCase.expectedRisk);
    }
  });
});
```

---

## **📊 Performance Benchmarks**

### **Expected Performance**
```javascript
const benchmarks = {
  responseTime: {
    max: 2000, // 2 seconds
    average: 1000, // 1 second
    target: 800 // 0.8 seconds
  },
  tokenUsage: {
    max: 800,
    average: 400,
    target: 300
  },
  accuracy: {
    validationAccuracy: 0.95,
    riskAssessment: 0.90,
    costEstimation: 0.85
  }
};
```

---

## **🚨 Error Handling**

### **Invalid Input Handling**
```javascript
test('should handle empty intent', async () => {
  const agent = new ValidationAgent();
  const result = await agent.validate("", ["pattern1"]);
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('Empty intent');
});

test('should handle empty patterns', async () => {
  const agent = new ValidationAgent();
  const result = await agent.validate("create_app", []);
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('No patterns provided');
});

test('should handle unknown patterns', async () => {
  const agent = new ValidationAgent();
  const result = await agent.validate("create_app", ["unknown_pattern"]);
  
  expect(result.valid).toBe(false);
  expect(result.confidence).toBeLessThan(0.5);
});
```

---

## **📋 Testing Checklist**

### **Functional Testing**
- [ ] Validates simple requests correctly
- [ ] Handles complex multi-pattern requests
- [ ] Rejects invalid or unsupported requests
- [ ] Provides accurate cost estimates
- [ ] Assesses risk levels appropriately
- [ ] Generates helpful recommendations
- [ ] Handles edge cases gracefully

### **Performance Testing**
- [ ] Response time within acceptable limits
- [ ] Token usage optimized
- [ ] Memory usage stable
- [ ] Concurrent requests handled

### **Integration Testing**
- [ ] Works with Intent Analysis Agent
- [ ] Integrates with UX Pattern Selector
- [ ] Provides input for UI Requirement Synthesizer
- [ ] Maintains consistency with budget constraints 