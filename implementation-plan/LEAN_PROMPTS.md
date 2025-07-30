# Lean LLM Prompts for AI Design Critique

## 🎯 Overview

A modular, configurable prompt system that generates sophisticated analysis prompts dynamically based on context and requirements.

## 🏗️ Core Prompt Builder

```typescript
// Core prompt builder - no hardcoding
const buildPrompt = (config: PromptConfig) => {
  const {
    role,
    expertise,
    context,
    data,
    requirements,
    outputFormat,
    guidelines
  } = config;

  return `
You are ${role} with expertise in ${expertise.join(', ')}.

CONTEXT:
${Object.entries(context).map(([k, v]) => `${k}: ${v}`).join('\n')}

DATA:
${JSON.stringify(data, null, 2)}

REQUIREMENTS:
${requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}

OUTPUT FORMAT:
${outputFormat}

GUIDELINES:
${guidelines.join('\n')}
`;
};
```

## 🧩 Modular Components

### **Role Definitions**
```typescript
const ROLES = {
  uxAnalyst: {
    title: 'expert UX/UI analyst with 15+ years of experience',
    expertise: ['web design', 'accessibility', 'performance optimization', 'user psychology']
  },
  performanceEngineer: {
    title: 'senior performance engineer',
    expertise: ['web performance optimization', 'Core Web Vitals', 'user experience impact analysis']
  },
  accessibilityConsultant: {
    title: 'senior accessibility consultant',
    expertise: ['WCAG 2.1 AA guidelines', 'assistive technologies', 'inclusive design']
  },
  contentStrategist: {
    title: 'senior content strategist and UX writer',
    expertise: ['conversion optimization', 'readability', 'user psychology']
  }
};
```

### **Analysis Requirements**
```typescript
const REQUIREMENTS = {
  comprehensive: [
    'Provide overall assessment (1-10 scale)',
    'Identify specific friction points with CSS selectors',
    'Analyze performance impact on user behavior',
    'Assess accessibility compliance and user impact',
    'Evaluate content quality and effectiveness',
    'Generate prioritized actionable suggestions'
  ],
  performance: [
    'Analyze Core Web Vitals (LCP, FID, CLS, FCP)',
    'Assess user experience impact',
    'Identify technical optimization opportunities',
    'Evaluate business implications'
  ],
  accessibility: [
    'Assess WCAG 2.1 AA compliance',
    'Analyze impact on different user groups',
    'Evaluate legal and ethical implications',
    'Provide implementation guidance'
  ],
  content: [
    'Assess readability and comprehension',
    'Evaluate content strategy and hierarchy',
    'Analyze user psychology and persuasion',
    'Identify conversion optimization opportunities'
  ]
};
```

### **Output Schemas**
```typescript
const OUTPUT_SCHEMAS = {
  comprehensive: {
    headlineGrade: 'number (1-10)',
    frictionPoints: 'array of {selector, issue, severity, userImpact, suggestedFix}',
    performanceAnalysis: '{score, criticalIssues, userExperienceImpact}',
    accessibilityAnalysis: '{complianceLevel, criticalViolations, userGroupImpact}',
    contentAnalysis: '{readabilityScore, clarityIssues, ctaEffectiveness}',
    suggestions: 'array of {priority, category, title, description, implementation, expectedImpact}'
  },
  performance: {
    performanceScore: 'number (0-100)',
    coreWebVitals: '{lcp, fid, cls, fcp} with status and impact',
    optimizationOpportunities: 'array of {priority, category, issue, solution, expectedImprovement}',
    businessImplications: '{revenueImpact, seoImpact, competitiveAdvantage}'
  },
  accessibility: {
    complianceLevel: 'compliant|partially-compliant|non-compliant',
    wcagScore: 'number (0-100)',
    criticalViolations: 'array of {id, description, impact, userGroups, fix, priority}',
    implementationPlan: 'array of {phase, violations, effort, timeline}'
  },
  content: {
    readabilityScore: 'number (0-100)',
    contentGrade: 'A|B|C|D|F',
    conversionElements: '{ctaEffectiveness, persuasionFactors, trustElements}',
    improvementOpportunities: 'array of {category, issue, impact, recommendation, priority}'
  }
};
```

## 🚀 Dynamic Prompt Generation

### **Main Prompt Generator**
```typescript
const generateAuditPrompt = (params: {
  url: string;
  auditType: 'comprehensive' | 'performance' | 'accessibility' | 'content';
  analysisData: any;
  context?: Record<string, any>;
}) => {
  const role = ROLES[getRoleForAuditType(params.auditType)];
  const requirements = REQUIREMENTS[params.auditType];
  const outputSchema = OUTPUT_SCHEMAS[params.auditType];

  const config: PromptConfig = {
    role: role.title,
    expertise: role.expertise,
    context: {
      website: params.url,
      analysisDate: new Date().toISOString(),
      ...params.context
    },
    data: params.analysisData,
    requirements,
    outputFormat: JSON.stringify(outputSchema, null, 2),
    guidelines: getGuidelines(params.auditType)
  };

  return buildPrompt(config);
};

const getRoleForAuditType = (auditType: string) => {
  const roleMap = {
    comprehensive: 'uxAnalyst',
    performance: 'performanceEngineer',
    accessibility: 'accessibilityConsultant',
    content: 'contentStrategist'
  };
  return roleMap[auditType] || 'uxAnalyst';
};

const getGuidelines = (auditType: string) => {
  const baseGuidelines = [
    'Be specific and actionable',
    'Consider user psychology and behavior patterns',
    'Reference industry best practices',
    'Provide evidence-based recommendations'
  ];

  const specificGuidelines = {
    comprehensive: ['Consider mobile-first design principles', 'Factor in accessibility and inclusivity'],
    performance: ['Focus on Core Web Vitals impact', 'Consider business metrics'],
    accessibility: ['Prioritize by user impact', 'Consider legal implications'],
    content: ['Focus on conversion optimization', 'Consider brand voice consistency']
  };

  return [...baseGuidelines, ...(specificGuidelines[auditType] || [])];
};
```

### **Context-Aware Prompt Enhancement**
```typescript
const enhancePromptForContext = (basePrompt: string, context: {
  industry?: string;
  audience?: string;
  businessGoals?: string[];
}) => {
  let enhanced = basePrompt;

  if (context.industry) {
    enhanced += `\n\nINDUSTRY CONTEXT: ${context.industry}`;
  }

  if (context.audience) {
    enhanced += `\n\nTARGET AUDIENCE: ${context.audience}`;
  }

  if (context.businessGoals?.length) {
    enhanced += `\n\nBUSINESS GOALS: ${context.businessGoals.join(', ')}`;
  }

  return enhanced;
};
```

## 🔧 Usage Examples

### **Basic Usage**
```typescript
const prompt = generateAuditPrompt({
  url: 'https://example.com',
  auditType: 'comprehensive',
  analysisData: { performance, accessibility, content }
});

const response = await callLLM(prompt);
```

### **Context-Aware Usage**
```typescript
const prompt = generateAuditPrompt({
  url: 'https://shop.example.com',
  auditType: 'comprehensive',
  analysisData: auditData,
  context: {
    industry: 'ecommerce',
    audience: 'online shoppers',
    businessGoals: ['increase conversion', 'reduce abandonment']
  }
});
```

### **Multi-Stage Analysis**
```typescript
const performMultiStageAnalysis = async (url: string, data: any) => {
  // Stage 1: Quick assessment
  const quickPrompt = generateAuditPrompt({
    url,
    auditType: 'comprehensive',
    analysisData: data
  });
  
  const quickResult = await callLLM(quickPrompt);
  
  // Stage 2: Deep dive based on results
  if (quickResult.performanceScore < 70) {
    const perfPrompt = generateAuditPrompt({
      url,
      auditType: 'performance',
      analysisData: data
    });
    
    const perfResult = await callLLM(perfPrompt);
    quickResult.detailedPerformance = perfResult;
  }
  
  return quickResult;
};
```

## 📊 Prompt Quality Management

### **Quality Assessment**
```typescript
const assessPromptQuality = (response: any, expectedSchema: any) => {
  const completeness = Object.keys(expectedSchema).filter(key => 
    response[key] !== undefined
  ).length / Object.keys(expectedSchema).length;
  
  const specificity = response.suggestions?.filter(s => 
    s.description?.length > 30 && s.implementation?.length > 20
  ).length / (response.suggestions?.length || 1);
  
  return { completeness, specificity, overall: (completeness + specificity) / 2 };
};
```

### **Prompt Versioning**
```typescript
const PROMPT_VERSIONS = {
  v1: { config: { /* v1 config */ }, performance: 0.85 },
  v2: { config: { /* v2 config */ }, performance: 0.92 }
};

const selectOptimalPrompt = (auditType: string) => {
  return Object.entries(PROMPT_VERSIONS)
    .sort(([,a], [,b]) => b.performance - a.performance)[0][1];
};
```

## 🎯 Specialized Extensions

### **Industry-Specific Enhancements**
```typescript
const INDUSTRY_ENHANCEMENTS = {
  ecommerce: {
    additionalRequirements: ['Analyze purchase funnel', 'Evaluate trust factors'],
    additionalContext: 'Focus on conversion optimization and revenue impact'
  },
  saas: {
    additionalRequirements: ['Assess onboarding experience', 'Evaluate feature adoption'],
    additionalContext: 'Focus on user activation and retention'
  },
  enterprise: {
    additionalRequirements: ['Evaluate security considerations', 'Assess compliance requirements'],
    additionalContext: 'Focus on enterprise-specific needs and scalability'
  }
};

const enhanceForIndustry = (prompt: string, industry: string) => {
  const enhancement = INDUSTRY_ENHANCEMENTS[industry];
  if (!enhancement) return prompt;
  
  return prompt
    .replace('REQUIREMENTS:', `REQUIREMENTS:\n${enhancement.additionalRequirements.map(r => `- ${r}`).join('\n')}`)
    .replace('GUIDELINES:', `GUIDELINES:\n${enhancement.additionalContext}\n`);
};
```

## 🚀 Implementation

### **Main Service**
```typescript
class LeanPromptService {
  async generateAnalysis(params: AnalysisParams) {
    const basePrompt = generateAuditPrompt(params);
    const enhancedPrompt = enhancePromptForContext(basePrompt, params.context);
    const industryPrompt = enhanceForIndustry(enhancedPrompt, params.context?.industry);
    
    return await callLLM(industryPrompt);
  }
  
  async generateMultiStageAnalysis(url: string, data: any, context?: any) {
    return await performMultiStageAnalysis(url, data);
  }
}
```

### **Usage in API**
```typescript
app.post('/api/audit', async (req, res) => {
  const { url, auditType, context } = req.body;
  
  const analysisData = await collectAnalysisData(url);
  const promptService = new LeanPromptService();
  
  const result = await promptService.generateAnalysis({
    url,
    auditType,
    analysisData,
    context
  });
  
  res.json({ success: true, result });
});
```

## 📈 Benefits of Lean Approach

1. **Modularity**: Easy to modify individual components
2. **Reusability**: Components can be mixed and matched
3. **Maintainability**: Less code duplication and hardcoding
4. **Flexibility**: Easy to add new audit types and contexts
5. **Performance**: Smaller, more focused prompts
6. **Testability**: Individual components can be tested separately

This lean approach provides the same sophisticated analysis capabilities while being much more maintainable and flexible than the bulky hardcoded version. 