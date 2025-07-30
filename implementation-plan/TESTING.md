# CursorFlow - Testing Strategy & Quality Assurance

## 🧪 Testing Overview

CursorFlow implements a comprehensive testing strategy covering unit tests, integration tests, end-to-end tests, and performance testing to ensure high quality and reliability across all components.

## 🏗️ Testing Architecture

### **Testing Pyramid**
```
┌─────────────────────────────────────────────────────────────────┐
│                    CURSORFLOW - TESTING PYRAMID                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    ┌─────────────┐                             │
│                    │   E2E Tests │ ← Few, High Value           │
│                    │   (10-20%)  │                             │
│                    └─────────────┘                             │
│                                                                 │
│              ┌─────────────────────┐                           │
│              │ Integration Tests   │ ← Medium, Business Logic  │
│              │     (20-30%)        │                           │
│              └─────────────────────┘                           │
│                                                                 │
│        ┌─────────────────────────────┐                         │
│        │      Unit Tests             │ ← Many, Fast, Isolated  │
│        │        (50-70%)             │                         │
│        └─────────────────────────────┘                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🛠️ Testing Tools & Technologies

### **Core Testing Stack**
- **Unit Testing**: Jest + React Testing Library
- **Integration Testing**: Supertest + Jest
- **E2E Testing**: Playwright
- **API Testing**: Postman + Newman
- **Performance Testing**: Artillery + Lighthouse
- **Visual Testing**: Chromatic
- **Code Coverage**: Istanbul/nyc

### **Testing Utilities**
- **Mocking**: Jest mocks, MSW (Mock Service Worker)
- **Test Data**: Faker.js, Factory Bot
- **Assertions**: Jest assertions, Chai
- **Fixtures**: JSON fixtures, Test data builders

## 🧪 Unit Testing

### **Frontend Unit Tests**

#### **Component Testing**
```typescript
// tests/components/PRDEditor.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PRDEditor } from '../components/PRDEditor';

describe('PRDEditor', () => {
  const mockPRD = {
    id: '1',
    title: 'Test PRD',
    description: 'Test description',
    features: [],
    userStories: [],
    technicalRequirements: [],
  };

  const mockOnSave = jest.fn();
  const mockOnGenerate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders PRD editor with initial data', () => {
    render(
      <PRDEditor 
        prd={mockPRD} 
        onSave={mockOnSave} 
        onGenerate={mockOnGenerate} 
      />
    );

    expect(screen.getByDisplayValue('Test PRD')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
  });

  it('calls onSave when save button is clicked', async () => {
    render(
      <PRDEditor 
        prd={mockPRD} 
        onSave={mockOnSave} 
        onGenerate={mockOnGenerate} 
      />
    );

    const saveButton = screen.getByText('Save Draft');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(mockPRD);
    });
  });

  it('calls onGenerate when generate button is clicked', async () => {
    render(
      <PRDEditor 
        prd={mockPRD} 
        onSave={mockOnSave} 
        onGenerate={mockOnGenerate} 
      />
    );

    const generateButton = screen.getByText('Generate Project');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockOnGenerate).toHaveBeenCalled();
    });
  });

  it('updates form data when inputs change', () => {
    render(
      <PRDEditor 
        prd={mockPRD} 
        onSave={mockOnSave} 
        onGenerate={mockOnGenerate} 
      />
    );

    const titleInput = screen.getByDisplayValue('Test PRD');
    fireEvent.change(titleInput, { target: { value: 'Updated PRD' } });

    expect(titleInput).toHaveValue('Updated PRD');
  });
});
```

#### **Hook Testing**
```typescript
// tests/hooks/usePRD.test.ts
import { renderHook, act } from '@testing-library/react';
import { usePRD } from '../hooks/usePRD';

describe('usePRD', () => {
  const mockPRDService = {
    generatePRD: jest.fn(),
    savePRD: jest.fn(),
    getPRD: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates PRD successfully', async () => {
    const mockPRD = { id: '1', title: 'Test PRD' };
    mockPRDService.generatePRD.mockResolvedValue(mockPRD);

    const { result } = renderHook(() => usePRD(mockPRDService));

    await act(async () => {
      await result.current.generatePRD('Test description', 'basic');
    });

    expect(result.current.prd).toEqual(mockPRD);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles PRD generation error', async () => {
    const error = new Error('Generation failed');
    mockPRDService.generatePRD.mockRejectedValue(error);

    const { result } = renderHook(() => usePRD(mockPRDService));

    await act(async () => {
      await result.current.generatePRD('Test description', 'basic');
    });

    expect(result.current.error).toBe('Generation failed');
    expect(result.current.loading).toBe(false);
  });
});
```

### **Backend Unit Tests**

#### **Service Testing**
```typescript
// tests/services/prd.service.test.ts
import { PRDServiceImpl } from '../services/prd.service';
import { OpenAI } from 'openai';
import { Firestore } from 'firebase-admin/firestore';

describe('PRDService', () => {
  let prdService: PRDServiceImpl;
  let mockOpenAI: jest.Mocked<OpenAI>;
  let mockFirestore: jest.Mocked<Firestore>;

  beforeEach(() => {
    mockOpenAI = {
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    } as any;

    mockFirestore = {
      collection: jest.fn().mockReturnThis(),
      doc: jest.fn().mockReturnThis(),
      set: jest.fn(),
      get: jest.fn(),
    } as any;

    prdService = new PRDServiceImpl(mockOpenAI, mockFirestore);
  });

  describe('generatePRD', () => {
    it('should generate PRD successfully', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              title: 'Test PRD',
              description: 'Test description',
              features: [],
              userStories: [],
              technicalRequirements: [],
            }),
          },
        }],
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse as any);

      const result = await prdService.generatePRD('Test product', 'basic');

      expect(result.title).toBe('Test PRD');
      expect(result.description).toBe('Test description');
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-4',
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'user',
            content: expect.stringContaining('Test product'),
          }),
        ]),
        temperature: 0.7,
      });
    });

    it('should handle OpenAI API errors', async () => {
      const error = new Error('OpenAI API error');
      mockOpenAI.chat.completions.create.mockRejectedValue(error);

      await expect(
        prdService.generatePRD('Test product', 'basic')
      ).rejects.toThrow('OpenAI API error');
    });
  });

  describe('savePRD', () => {
    it('should save PRD to Firestore', async () => {
      const prd = {
        id: '1',
        title: 'Test PRD',
        description: 'Test description',
        features: [],
        userStories: [],
        technicalRequirements: [],
        userId: 'user1',
      };

      mockFirestore.set.mockResolvedValue({} as any);

      const result = await prdService.savePRD(prd);

      expect(result).toBe('1');
      expect(mockFirestore.set).toHaveBeenCalledWith(prd);
    });
  });
});
```

#### **Middleware Testing**
```typescript
// tests/middleware/auth.middleware.test.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthMiddleware } from '../middleware/auth.middleware';

describe('AuthMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('verifyToken', () => {
    it('should verify valid JWT token', () => {
      const token = jwt.sign(
        { userId: 'user1', email: 'test@example.com' },
        'test-secret'
      );

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      AuthMiddleware.verifyToken(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.user).toBeDefined();
    });

    it('should reject request without token', () => {
      AuthMiddleware.verifyToken(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'No token provided',
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject invalid token', () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid-token',
      };

      AuthMiddleware.verifyToken(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid token',
      });
    });
  });
});
```

## 🔗 Integration Testing

### **API Integration Tests**
```typescript
// tests/integration/api.test.ts
import request from 'supertest';
import { app } from '../app';
import { createTestUser, createTestPRD } from './test-utils';

describe('PRD API', () => {
  let authToken: string;
  let testUser: any;

  beforeAll(async () => {
    testUser = await createTestUser();
    authToken = testUser.token;
  });

  describe('POST /api/prds', () => {
    it('should create PRD with valid data', async () => {
      const prdData = {
        title: 'Test PRD',
        description: 'Test description',
        template: 'basic',
        features: [],
        userStories: [],
        technicalRequirements: [],
      };

      const response = await request(app)
        .post('/api/prds')
        .set('Authorization', `Bearer ${authToken}`)
        .send(prdData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.prd).toMatchObject(prdData);
      expect(response.body.prd.id).toBeDefined();
      expect(response.body.prd.userId).toBe(testUser.id);
    });

    it('should reject request without authentication', async () => {
      const prdData = {
        title: 'Test PRD',
        description: 'Test description',
      };

      await request(app)
        .post('/api/prds')
        .send(prdData)
        .expect(401);
    });

    it('should validate required fields', async () => {
      const invalidData = {
        description: 'Test description',
        // Missing title
      };

      const response = await request(app)
        .post('/api/prds')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/prds', () => {
    it('should return user PRDs', async () => {
      // Create test PRDs
      await createTestPRD(testUser.id);
      await createTestPRD(testUser.id);

      const response = await request(app)
        .get('/api/prds')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.prds).toHaveLength(2);
      expect(response.body.total).toBe(2);
    });

    it('should support pagination', async () => {
      // Create multiple test PRDs
      for (let i = 0; i < 15; i++) {
        await createTestPRD(testUser.id);
      }

      const response = await request(app)
        .get('/api/prds?limit=10&offset=0')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.prds).toHaveLength(10);
      expect(response.body.total).toBe(15);
    });
  });
});
```

### **Database Integration Tests**
```typescript
// tests/integration/database.test.ts
import { db } from '../config/firebase';
import { PRDRepository } from '../repositories/prd.repository';

describe('Database Integration', () => {
  let prdRepository: PRDRepository;

  beforeAll(() => {
    prdRepository = new PRDRepository(db);
  });

  beforeEach(async () => {
    // Clean up test data
    const testDocs = await db.collection('prds')
      .where('title', '==', 'Test PRD')
      .get();
    
    const batch = db.batch();
    testDocs.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  });

  describe('PRD Repository', () => {
    it('should save and retrieve PRD', async () => {
      const prd = {
        title: 'Test PRD',
        description: 'Test description',
        userId: 'test-user',
        features: [],
        userStories: [],
        technicalRequirements: [],
      };

      const savedId = await prdRepository.save(prd);
      expect(savedId).toBeDefined();

      const retrieved = await prdRepository.findById(savedId);
      expect(retrieved).toMatchObject(prd);
    });

    it('should update PRD', async () => {
      const prd = {
        title: 'Test PRD',
        description: 'Test description',
        userId: 'test-user',
        features: [],
        userStories: [],
        technicalRequirements: [],
      };

      const savedId = await prdRepository.save(prd);
      
      const updates = { title: 'Updated PRD' };
      await prdRepository.update(savedId, updates);

      const updated = await prdRepository.findById(savedId);
      expect(updated.title).toBe('Updated PRD');
    });

    it('should delete PRD', async () => {
      const prd = {
        title: 'Test PRD',
        description: 'Test description',
        userId: 'test-user',
        features: [],
        userStories: [],
        technicalRequirements: [],
      };

      const savedId = await prdRepository.save(prd);
      await prdRepository.delete(savedId);

      const retrieved = await prdRepository.findById(savedId);
      expect(retrieved).toBeNull();
    });
  });
});
```

## 🌐 End-to-End Testing

### **Playwright E2E Tests**
```typescript
// tests/e2e/prd-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('PRD Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app and login
    await page.goto('http://localhost:3000');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('**/dashboard');
  });

  test('should create PRD and generate project', async ({ page }) => {
    // Navigate to PRD creation
    await page.click('[data-testid="create-prd-button"]');
    await page.waitForURL('**/prds/new');

    // Fill PRD form
    await page.fill('[data-testid="prd-title"]', 'E-commerce Platform');
    await page.fill('[data-testid="prd-description"]', 'A modern e-commerce platform for online stores');
    
    // Add feature
    await page.click('[data-testid="add-feature-button"]');
    await page.fill('[data-testid="feature-name"]', 'Product Catalog');
    await page.fill('[data-testid="feature-description"]', 'Browse and search products');
    await page.click('[data-testid="save-feature-button"]');

    // Save PRD
    await page.click('[data-testid="save-prd-button"]');
    await page.waitForSelector('[data-testid="prd-saved-success"]');

    // Generate project
    await page.click('[data-testid="generate-project-button"]');
    await page.waitForSelector('[data-testid="generation-in-progress"]');
    
    // Wait for generation to complete
    await page.waitForSelector('[data-testid="project-generated"]', { timeout: 60000 });

    // Verify project was created
    await expect(page.locator('[data-testid="project-url"]')).toBeVisible();
    await expect(page.locator('[data-testid="deployment-url"]')).toBeVisible();
  });

  test('should handle PRD generation errors', async ({ page }) => {
    // Mock API error
    await page.route('**/api/prds', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    await page.click('[data-testid="create-prd-button"]');
    await page.fill('[data-testid="prd-title"]', 'Test PRD');
    await page.click('[data-testid="save-prd-button"]');

    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Internal server error');
  });

  test('should validate form inputs', async ({ page }) => {
    await page.click('[data-testid="create-prd-button"]');
    
    // Try to save without required fields
    await page.click('[data-testid="save-prd-button"]');
    
    await expect(page.locator('[data-testid="title-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="title-error"]')).toContainText('Title is required');
  });
});
```

### **API E2E Tests**
```typescript
// tests/e2e/api-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('API Workflow', () => {
  test('should complete full PRD to project workflow', async ({ request }) => {
    // 1. Create user
    const userResponse = await request.post('/api/auth/register', {
      data: {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      },
    });
    expect(userResponse.ok()).toBeTruthy();
    const { token } = await userResponse.json();

    // 2. Create PRD
    const prdResponse = await request.post('/api/prds', {
      data: {
        title: 'Test PRD',
        description: 'Test description',
        template: 'basic',
        features: [],
        userStories: [],
        technicalRequirements: [],
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(prdResponse.ok()).toBeTruthy();
    const { prd } = await prdResponse.json();

    // 3. Generate project
    const projectResponse = await request.post('/api/projects', {
      data: {
        prdId: prd.id,
        backendRequirements: 'Basic CRUD operations',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(projectResponse.ok()).toBeTruthy();
    const { project } = await projectResponse.json();

    // 4. Verify project was created
    expect(project.deploymentUrl).toBeDefined();
    expect(project.status).toBe('active');

    // 5. Test live preview
    const previewResponse = await request.get(project.deploymentUrl);
    expect(previewResponse.ok()).toBeTruthy();
  });
});
```

## 📊 Performance Testing

### **Load Testing with Artillery**
```yaml
# tests/performance/load-test.yml
config:
  target: 'https://api.cursorflow.com'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 300
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"
  defaults:
    headers:
      Content-Type: 'application/json'

scenarios:
  - name: "PRD Creation"
    weight: 40
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "{{ $randomEmail() }}"
            password: "password123"
          capture:
            - json: "$.token"
              as: "authToken"
      - post:
          url: "/api/prds"
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            title: "{{ $randomString() }}"
            description: "{{ $randomString() }}"
            template: "basic"

  - name: "Project Generation"
    weight: 30
    flow:
      - post:
          url: "/api/projects"
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            prdId: "{{ $randomString() }}"
            backendRequirements: "{{ $randomString() }}"

  - name: "PRD Retrieval"
    weight: 30
    flow:
      - get:
          url: "/api/prds"
          headers:
            Authorization: "Bearer {{ authToken }}"
```

### **Lighthouse Performance Testing**
```typescript
// tests/performance/lighthouse.test.ts
import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';

describe('Performance Tests', () => {
  test('should meet performance benchmarks', async () => {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance'],
      port: chrome.port,
    };

    const runnerResult = await lighthouse('https://cursorflow.com', options);
    const results = runnerResult.lhr;

    // Performance score should be above 90
    expect(results.categories.performance.score).toBeGreaterThan(0.9);

    // Core Web Vitals
    expect(results.audits['largest-contentful-paint'].numericValue).toBeLessThan(2500);
    expect(results.audits['first-input-delay'].numericValue).toBeLessThan(100);
    expect(results.audits['cumulative-layout-shift'].numericValue).toBeLessThan(0.1);

    await chrome.kill();
  });
});
```

## 🎨 Visual Testing

### **Chromatic Visual Tests**
```typescript
// tests/visual/components.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { PRDEditor } from '../components/PRDEditor';

const meta: Meta<typeof PRDEditor> = {
  title: 'Components/PRDEditor',
  component: PRDEditor,
  parameters: {
    chromatic: { viewports: [320, 768, 1200] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    prd: {
      id: '1',
      title: 'Test PRD',
      description: 'Test description',
      features: [],
      userStories: [],
      technicalRequirements: [],
    },
    onSave: () => {},
    onGenerate: () => {},
  },
};

export const WithFeatures: Story = {
  args: {
    prd: {
      id: '1',
      title: 'E-commerce Platform',
      description: 'A modern e-commerce platform',
      features: [
        { id: '1', name: 'Product Catalog', description: 'Browse products' },
        { id: '2', name: 'Shopping Cart', description: 'Add items to cart' },
      ],
      userStories: [],
      technicalRequirements: [],
    },
    onSave: () => {},
    onGenerate: () => {},
  },
};
```

## 📈 Test Coverage

### **Coverage Configuration**
```json
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
};
```

### **Coverage Reports**
```typescript
// tests/coverage/coverage-report.ts
interface CoverageReport {
  total: {
    branches: { pct: number };
    functions: { pct: number };
    lines: { pct: number };
    statements: { pct: number };
  };
  files: Record<string, {
    branches: { pct: number };
    functions: { pct: number };
    lines: { pct: number };
    statements: { pct: number };
  }>;
}

export function generateCoverageReport(): CoverageReport {
  // Implementation to generate coverage report
  return {
    total: {
      branches: { pct: 85 },
      functions: { pct: 90 },
      lines: { pct: 88 },
      statements: { pct: 87 },
    },
    files: {
      // File-specific coverage data
    },
  };
}
```

## 🔄 Test Automation

### **GitHub Actions Test Workflow**
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16, 18]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
      
      - name: Generate coverage report
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  e2e:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Start application
        run: npm run start:test &
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: http://localhost:3000

  performance:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run performance tests
        run: npm run test:performance
```

## 🚨 Quality Gates

### **Pre-commit Hooks**
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test:unit && npm run test:integration"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "jest --bail --findRelatedTests"
    ]
  }
}
```

### **Quality Metrics**
```typescript
// tests/quality/quality-gates.ts
interface QualityMetrics {
  testCoverage: number;
  performanceScore: number;
  accessibilityScore: number;
  seoScore: number;
  bestPracticesScore: number;
}

export function checkQualityGates(metrics: QualityMetrics): boolean {
  const gates = {
    testCoverage: metrics.testCoverage >= 80,
    performanceScore: metrics.performanceScore >= 90,
    accessibilityScore: metrics.accessibilityScore >= 90,
    seoScore: metrics.seoScore >= 90,
    bestPracticesScore: metrics.bestPracticesScore >= 90,
  };

  const failedGates = Object.entries(gates)
    .filter(([_, passed]) => !passed)
    .map(([gate]) => gate);

  if (failedGates.length > 0) {
    throw new Error(`Quality gates failed: ${failedGates.join(', ')}`);
  }

  return true;
}
```

---

**Next Steps**: Review [`BUSINESS_MODEL.md`](./BUSINESS_MODEL.md) for business model and go-to-market strategy. 