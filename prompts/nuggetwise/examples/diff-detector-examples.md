# Diff Detector Agent - Testing Examples

## 🎯 **Agent Overview**

The Diff Detector Agent analyzes differences between existing and new code, identifies potential conflicts, and suggests merge strategies. It ensures safe code updates and helps maintain code quality during the build process.

---

## **🧪 Testing Examples**

### **Test Case 1: Simple Component Update**
```json
{
  "input": {
    "existingCode": "function TodoList({ todos }) {\n  return (\n    <div>\n      {todos.map(todo => (\n        <div key={todo.id}>{todo.text}</div>\n      ))}\n    </div>\n  );\n}",
    "newCode": "function TodoList({ todos, onToggle }) {\n  return (\n    <div>\n      {todos.map(todo => (\n        <div key={todo.id}>\n          <input type=\"checkbox\" checked={todo.completed} onChange={() => onToggle(todo.id)} />\n          {todo.text}\n        </div>\n      ))}\n    </div>\n  );\n}",
    "filePath": "components/TodoList.tsx"
  },
  "expected_output": {
    "changeType": "modification",
    "linesChanged": [2, 4, 5, 6],
    "impact": "medium",
    "description": "Added checkbox functionality and onToggle prop to TodoList component",
    "breakingChanges": false,
    "suggestions": [
      "Update parent components to pass onToggle prop",
      "Add TypeScript interface for Todo type",
      "Consider adding accessibility attributes"
    ]
  }
}
```

### **Test Case 2: New File Addition**
```json
{
  "input": {
    "existingCode": "",
    "newCode": "import React from 'react';\n\nexport function UserProfile({ user }) {\n  return (\n    <div className=\"user-profile\">\n      <img src={user.avatar} alt={user.name} />\n      <h2>{user.name}</h2>\n      <p>{user.email}</p>\n    </div>\n  );\n}",
    "filePath": "components/UserProfile.tsx"
  },
  "expected_output": {
    "changeType": "addition",
    "linesChanged": [1, 3, 4, 5, 6, 7, 8, 9],
    "impact": "low",
    "description": "Created new UserProfile component",
    "breakingChanges": false,
    "suggestions": [
      "Add TypeScript interfaces for User type",
      "Include error handling for missing user data",
      "Add loading states"
    ]
  }
}
```

### **Test Case 3: Breaking Change Detection**
```json
{
  "input": {
    "existingCode": "function Button({ text, onClick, variant = 'primary' }) {\n  return (\n    <button className={`btn btn-${variant}`} onClick={onClick}>\n      {text}\n    </button>\n  );\n}",
    "newCode": "function Button({ children, onClick, variant = 'primary', size = 'medium' }) {\n  return (\n    <button className={`btn btn-${variant} btn-${size}`} onClick={onClick}>\n      {children}\n    </button>\n  );\n}",
    "filePath": "components/Button.tsx"
  },
  "expected_output": {
    "changeType": "replacement",
    "linesChanged": [1, 3, 4],
    "impact": "high",
    "description": "Changed Button component API from text prop to children prop",
    "breakingChanges": true,
    "warnings": [
      "This change will break existing usage of Button component",
      "All parent components need to be updated"
    ],
    "suggestions": [
      "Consider creating a new component or version",
      "Add deprecation warnings for text prop",
      "Update all usage examples in documentation"
    ]
  }
}
```

### **Test Case 4: Conflict Detection**
```json
{
  "input": {
    "changes": [
      {
        "filePath": "components/Header.tsx",
        "changeType": "modification",
        "description": "Added user menu to header"
      },
      {
        "filePath": "components/Header.tsx",
        "changeType": "modification", 
        "description": "Added notification bell to header"
      }
    ],
    "projectStructure": ["components/Header.tsx", "components/Sidebar.tsx", "pages/Dashboard.tsx"]
  },
  "expected_output": {
    "conflicts": [
      {
        "filePath": "components/Header.tsx",
        "conflictType": "naming",
        "severity": "low",
        "description": "Multiple modifications to same component",
        "suggestedResolution": "Merge both changes into single Header component update"
      }
    ],
    "mergeStrategy": "automatic",
    "estimatedTime": "5 minutes"
  }
}
```

### **Test Case 5: Safety Validation**
```json
{
  "input": {
    "changes": [
      {
        "filePath": "utils/api.ts",
        "changeType": "modification",
        "description": "Updated API endpoint URLs"
      },
      {
        "filePath": "components/LoginForm.tsx",
        "changeType": "modification",
        "description": "Added password validation"
      }
    ],
    "safetyRules": [
      "No hardcoded API keys",
      "No console.log statements in production",
      "All components must have TypeScript types"
    ]
  },
  "expected_output": {
    "safe": true,
    "warnings": [
      "Ensure API endpoint changes are tested thoroughly",
      "Verify password validation meets security requirements"
    ],
    "riskLevel": "low",
    "recommendations": [
      "Add unit tests for new validation logic",
      "Update API documentation",
      "Test authentication flow end-to-end"
    ]
  }
}
```

---

## **🔧 Testing Scripts**

### **Manual Testing**
```javascript
// test-diff-detector.js
const { DiffDetectorAgent } = require('../packages/nw-mcp/src/agents/DiffDetectorAgent');

async function testDiffDetector() {
  const agent = new DiffDetectorAgent();
  
  const testCases = [
    {
      name: "Simple Component Update",
      input: {
        existingCode: "function TodoList({ todos }) {\n  return (\n    <div>\n      {todos.map(todo => (\n        <div key={todo.id}>{todo.text}</div>\n      ))}\n    </div>\n  );\n}",
        newCode: "function TodoList({ todos, onToggle }) {\n  return (\n    <div>\n      {todos.map(todo => (\n        <div key={todo.id}>\n          <input type=\"checkbox\" checked={todo.completed} onChange={() => onToggle(todo.id)} />\n          {todo.text}\n        </div>\n      ))}\n    </div>\n  );\n}",
        filePath: "components/TodoList.tsx"
      },
      expected: {
        changeType: "modification",
        breakingChanges: false
      }
    },
    {
      name: "Breaking Change",
      input: {
        existingCode: "function Button({ text, onClick }) { return <button onClick={onClick}>{text}</button>; }",
        newCode: "function Button({ children, onClick }) { return <button onClick={onClick}>{children}</button>; }",
        filePath: "components/Button.tsx"
      },
      expected: {
        changeType: "replacement",
        breakingChanges: true
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    try {
      const result = await agent.detectChanges(
        testCase.input.existingCode,
        testCase.input.newCode,
        testCase.input.filePath
      );
      console.log('Result:', JSON.stringify(result, null, 2));
      
      // Validate result
      if (result.changeType === testCase.expected.changeType) {
        console.log('✅ Change type matches expected');
      } else {
        console.log('❌ Change type mismatch');
      }
    } catch (error) {
      console.error('❌ Test failed:', error.message);
    }
    console.log('---');
  }
}

testDiffDetector();
```

### **Automated Testing**
```typescript
// __tests__/diff-detector.test.ts
import { DiffDetectorAgent } from '../src/agents/DiffDetectorAgent';

describe('Diff Detector Agent', () => {
  let agent: DiffDetectorAgent;

  beforeEach(() => {
    agent = new DiffDetectorAgent();
  });

  test('should detect simple modifications', async () => {
    const existingCode = "function Test() { return <div>Hello</div>; }";
    const newCode = "function Test() { return <div>Hello World</div>; }";
    
    const result = await agent.detectChanges(existingCode, newCode, "Test.tsx");
    
    expect(result.changeType).toBe('modification');
    expect(result.impact).toBe('low');
    expect(result.breakingChanges).toBe(false);
  });

  test('should detect breaking changes', async () => {
    const existingCode = "function Button({ text }) { return <button>{text}</button>; }";
    const newCode = "function Button({ children }) { return <button>{children}</button>; }";
    
    const result = await agent.detectChanges(existingCode, newCode, "Button.tsx");
    
    expect(result.changeType).toBe('replacement');
    expect(result.breakingChanges).toBe(true);
    expect(result.impact).toBe('high');
  });

  test('should detect new file additions', async () => {
    const existingCode = "";
    const newCode = "function NewComponent() { return <div>New</div>; }";
    
    const result = await agent.detectChanges(existingCode, newCode, "NewComponent.tsx");
    
    expect(result.changeType).toBe('addition');
    expect(result.impact).toBe('low');
  });

  test('should detect conflicts in multiple changes', async () => {
    const changes = [
      {
        filePath: "Header.tsx",
        changeType: "modification",
        description: "Added user menu"
      },
      {
        filePath: "Header.tsx",
        changeType: "modification",
        description: "Added notifications"
      }
    ];
    
    const result = await agent.detectConflicts(changes, ["Header.tsx", "Sidebar.tsx"]);
    
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].filePath).toBe("Header.tsx");
    expect(result[0].conflictType).toBe("naming");
  });

  test('should validate changes against safety rules', async () => {
    const changes = [
      {
        filePath: "api.ts",
        changeType: "modification",
        description: "Updated API endpoints"
      }
    ];
    
    const safetyRules = ["No hardcoded API keys", "No console.log in production"];
    
    const result = await agent.validateChanges(changes, safetyRules);
    
    expect(result.safe).toBe(true);
    expect(result.warnings).toBeDefined();
  });

  test('should suggest merge strategies', async () => {
    const conflict = {
      filePath: "Component.tsx",
      conflictType: "naming",
      severity: "medium",
      description: "Multiple modifications",
      suggestedResolution: "Merge changes"
    };
    
    const strategy = await agent.suggestMergeStrategy(conflict);
    
    expect(strategy).toBeDefined();
    expect(typeof strategy).toBe('string');
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
    max: 2000,
    average: 1000,
    target: 800
  },
  accuracy: {
    changeDetection: 0.95,
    conflictIdentification: 0.90,
    safetyValidation: 0.88
  }
};
```

---

## **🚨 Error Handling**

### **Invalid Input Handling**
```javascript
test('should handle empty code', async () => {
  const agent = new DiffDetectorAgent();
  const result = await agent.detectChanges("", "", "test.tsx");
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('Empty code provided');
});

test('should handle identical code', async () => {
  const agent = new DiffDetectorAgent();
  const code = "function Test() { return <div>Hello</div>; }";
  const result = await agent.detectChanges(code, code, "test.tsx");
  
  expect(result.changeType).toBe('none');
  expect(result.impact).toBe('none');
});

test('should handle extremely large files', async () => {
  const agent = new DiffDetectorAgent();
  const largeCode = "function Test() {\n" + "  console.log('test');\n".repeat(1000) + "}";
  const result = await agent.detectChanges(largeCode, largeCode + "\n// new line", "test.tsx");
  
  expect(result.success).toBe(true);
  expect(result.changeType).toBe('modification');
});
```

---

## **📋 Testing Checklist**

### **Functional Testing**
- [ ] Detects simple code modifications
- [ ] Identifies breaking changes correctly
- [ ] Recognizes new file additions
- [ ] Detects file deletions
- [ ] Identifies conflicts between changes
- [ ] Validates changes against safety rules
- [ ] Suggests appropriate merge strategies

### **Performance Testing**
- [ ] Response time within acceptable limits
- [ ] Token usage optimized
- [ ] Memory usage stable
- [ ] Concurrent requests handled

### **Integration Testing**
- [ ] Works with code generation pipeline
- [ ] Integrates with version control
- [ ] Provides input for notification system
- [ ] Maintains code quality standards 