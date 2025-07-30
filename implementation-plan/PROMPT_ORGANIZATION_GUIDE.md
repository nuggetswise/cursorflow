# Prompt Organization Guide for CursorFlow

## 🎯 **Why Separate Prompt Files?**

### **The Problem with Embedded Prompts**
- **Hard to Maintain**: Prompts buried in code are difficult to update
- **No Version Control**: Can't track prompt changes separately from code
- **Poor Collaboration**: Non-developers can't easily edit prompts
- **Testing Difficulties**: Hard to test prompts independently
- **Scalability Issues**: All prompts in one place becomes unwieldy

### **The Solution: Separate Prompt Files**
- ✅ **Maintainable**: Each stakeholder has their own prompt files
- ✅ **Version Controlled**: Track prompt changes independently
- ✅ **Collaborative**: Anyone can edit prompts without touching code
- ✅ **Testable**: Test prompts separately from application logic
- ✅ **Scalable**: Easy to add new stakeholders and tasks

## 📁 **Directory Structure**

```
prompts/
├── prd-generation/
│   ├── product-manager-prompt.md
│   ├── business-analyst-prompt.md
│   └── stakeholder-interview-prompt.md
├── design-critique/
│   ├── ux-designer-prompt.md
│   ├── accessibility-expert-prompt.md
│   └── visual-designer-prompt.md
├── code-analysis/
│   ├── software-architect-prompt.md
│   ├── security-expert-prompt.md
│   └── performance-engineer-prompt.md
├── user-behavior/
│   ├── user-researcher-prompt.md
│   ├── data-analyst-prompt.md
│   └── behavioral-psychologist-prompt.md
├── market-research/
│   ├── market-analyst-prompt.md
│   ├── competitive-analyst-prompt.md
│   └── industry-expert-prompt.md
├── accessibility/
│   ├── accessibility-expert-prompt.md
│   ├── screen-reader-specialist-prompt.md
│   └── inclusive-design-expert-prompt.md
├── performance/
│   ├── performance-engineer-prompt.md
│   ├── frontend-optimizer-prompt.md
│   └── backend-optimizer-prompt.md
└── seo/
    ├── seo-specialist-prompt.md
    ├── content-strategist-prompt.md
    └── technical-seo-expert-prompt.md
```

## 🎭 **Stakeholder-Based Organization**

### **1. Product Management**
**Directory**: `prompts/prd-generation/`
**Stakeholders**:
- **Product Manager**: High-level product strategy and requirements
- **Business Analyst**: Detailed business requirements and processes
- **Stakeholder Interviewer**: User and stakeholder research

**Files**:
- `product-manager-prompt.md` - Main PRD generation
- `business-analyst-prompt.md` - Detailed business analysis
- `stakeholder-interview-prompt.md` - User research and interviews

### **2. Design & UX**
**Directory**: `prompts/design-critique/`
**Stakeholders**:
- **UX Designer**: User experience and interaction design
- **Accessibility Expert**: WCAG compliance and inclusive design
- **Visual Designer**: Visual hierarchy and brand consistency

**Files**:
- `ux-designer-prompt.md` - Main design critique
- `accessibility-expert-prompt.md` - Accessibility analysis
- `visual-designer-prompt.md` - Visual design assessment

### **3. Technical Analysis**
**Directory**: `prompts/code-analysis/`
**Stakeholders**:
- **Software Architect**: Code structure and architecture
- **Security Expert**: Security vulnerabilities and best practices
- **Performance Engineer**: Performance optimization

**Files**:
- `software-architect-prompt.md` - Main code analysis
- `security-expert-prompt.md` - Security assessment
- `performance-engineer-prompt.md` - Performance analysis

### **4. User Research**
**Directory**: `prompts/user-behavior/`
**Stakeholders**:
- **User Researcher**: User behavior and needs analysis
- **Data Analyst**: Quantitative user behavior data
- **Behavioral Psychologist**: User psychology and motivation

**Files**:
- `user-researcher-prompt.md` - User research analysis
- `data-analyst-prompt.md` - Behavioral data analysis
- `behavioral-psychologist-prompt.md` - User psychology insights

### **5. Market Analysis**
**Directory**: `prompts/market-research/`
**Stakeholders**:
- **Market Analyst**: Market trends and opportunities
- **Competitive Analyst**: Competitive landscape analysis
- **Industry Expert**: Industry-specific insights

**Files**:
- `market-analyst-prompt.md` - Market research
- `competitive-analyst-prompt.md` - Competitive analysis
- `industry-expert-prompt.md` - Industry insights

## 📝 **Prompt File Structure**

### **Standard Template**
```markdown
# [Stakeholder Role] [Task] Prompt

## Role Definition
You are a [role description] with [experience] years of experience in [domains].

## Expertise Areas
- [Expertise area 1]
- [Expertise area 2]
- [Expertise area 3]

## Task
[Clear description of what the AI should do]

## Context Variables
- Variable 1: {variable1}
- Variable 2: {variable2}
- Variable 3: {variable3}

## Input Data
{data}

## Reasoning Framework

### 1. [Analysis Step 1]
- **Objective**: [What this step accomplishes]
- **Process**: [How to approach this step]
- **Evidence Required**: [What data/evidence is needed]
- **Confidence Factors**: [What affects confidence]

### 2. [Analysis Step 2]
...

## Explainability Requirements
[What reasoning should be provided]

## Output Format
```json
{
  "result": { /* main output */ },
  "reasoning": {
    "steps": ["step 1", "step 2"],
    "confidence": 0.85,
    "alternatives": ["alt 1", "alt 2"],
    "evidence": ["evidence 1", "evidence 2"],
    "limitations": ["limitation 1", "limitation 2"]
  }
}
```

## Quality Criteria
[What makes a good output]
```

## 🔧 **Implementation with PromptLoaderService**

### **Loading Prompts**
```typescript
const promptLoader = new PromptLoaderService();

// Load a specific prompt
const prompt = await promptLoader.loadPrompt({
  stakeholder: 'product-manager',
  task: 'prd-generation',
  context: {
    industry: 'ecommerce',
    audience: 'online shoppers',
    goals: ['increase conversion', 'reduce abandonment']
  },
  data: { description: 'Create an e-commerce app' },
  explainabilityLevel: 'detailed'
});
```

### **Available Stakeholders**
```typescript
// Get all available stakeholders
const stakeholders = await promptLoader.getAvailableStakeholders();
// Returns: ['prd-generation', 'design-critique', 'code-analysis', ...]

// Get tasks for a stakeholder
const tasks = await promptLoader.getAvailableTasks('product-manager');
// Returns: ['product-manager', 'business-analyst', 'stakeholder-interview']
```

### **Validation**
```typescript
// Validate prompt configuration
const validation = await promptLoader.validatePromptConfig(config);
if (!validation.valid) {
  console.error('Prompt config errors:', validation.errors);
}
```

## 🎯 **Benefits of This Organization**

### **1. Maintainability**
- **Easy Updates**: Edit prompts without touching code
- **Version Control**: Track prompt changes separately
- **Rollback**: Revert prompt changes without code changes
- **Testing**: Test prompts independently

### **2. Collaboration**
- **Non-Technical Users**: Product managers can edit prompts
- **Domain Experts**: UX designers can refine design prompts
- **Review Process**: Prompts can be reviewed by stakeholders
- **Iteration**: Easy to iterate on prompts based on feedback

### **3. Scalability**
- **New Stakeholders**: Easy to add new expert roles
- **New Tasks**: Simple to create new analysis types
- **Specialization**: Each stakeholder can have multiple specialized prompts
- **Modularity**: Prompts can be combined or chained

### **4. Quality Assurance**
- **Consistency**: Standardized prompt structure
- **Validation**: Prompt configuration validation
- **Caching**: Efficient prompt loading and caching
- **Monitoring**: Track prompt usage and effectiveness

## 🚀 **Best Practices**

### **1. Naming Conventions**
- **Files**: `{stakeholder}-{task}-prompt.md`
- **Directories**: `{domain}/` (e.g., `prd-generation/`)
- **Variables**: `{variable_name}` in prompts
- **Versions**: Include version in prompt metadata

### **2. Content Organization**
- **Clear Structure**: Follow the standard template
- **Context Variables**: Define all placeholders
- **Reasoning Framework**: Structured analysis steps
- **Output Format**: Clear JSON schema

### **3. Version Control**
- **Separate Commits**: Commit prompt changes separately
- **Descriptive Messages**: Clear commit messages for prompt changes
- **Branch Strategy**: Feature branches for prompt development
- **Review Process**: Code review for prompt changes

### **4. Testing**
- **Unit Tests**: Test prompt loading and processing
- **Integration Tests**: Test prompt with LLM integration
- **Validation Tests**: Test prompt configuration validation
- **Quality Tests**: Test prompt output quality

## 📊 **Monitoring and Analytics**

### **Prompt Usage Tracking**
```typescript
interface PromptUsage {
  stakeholder: string;
  task: string;
  timestamp: Date;
  processingTime: number;
  tokensUsed: number;
  confidence: number;
  userSatisfaction?: number;
}
```

### **Quality Metrics**
- **Completeness**: Percentage of required fields in output
- **Confidence**: Average confidence scores
- **User Satisfaction**: User feedback on prompt outputs
- **Processing Time**: Time to generate responses

### **Optimization Opportunities**
- **Frequently Used**: Identify most popular prompts
- **Low Confidence**: Prompts needing improvement
- **High Processing Time**: Prompts needing optimization
- **User Feedback**: Areas for prompt enhancement

This organization ensures that CursorFlow's AI prompts are **maintainable**, **collaborative**, **scalable**, and **high-quality**, while keeping them separate from the main application code for better development workflow. 