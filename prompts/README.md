# CursorFlow Prompts - Hybrid Platform

## 🎯 **Overview**

This directory contains AI prompts for the CursorFlow hybrid platform, supporting both **Quick Build Mode** (Nuggetwise Builder) and **Full Platform Mode** (Comprehensive PRD-to-Code workflow).

---

## **🏗️ Directory Structure**

```
prompts/
├── README.md                    # This file
├── nuggetwise/                  # Quick Build Mode prompts
│   ├── intent-analysis.json     # User intent understanding
│   ├── ux-pattern-selector.json # UI pattern selection
│   ├── validation.json          # Feasibility validation
│   ├── ui-requirement-synthesizer.json # Component specs
│   ├── v0-prompt-builder.txt    # v0.dev optimization
│   ├── diff-detector.json       # Change analysis
│   └── notification.json        # Slack notifications
├── frontend-generation/         # Full Platform Mode
│   ├── cursorflow-webapp-prompt.md    # CursorFlow web app
│   └── cursorflow-marketing-prompt.md # Marketing site
├── prd-generation/              # Full Platform Mode
│   └── product-manager-prompt.md      # Comprehensive PRDs
├── design-critique/             # Full Platform Mode
│   └── ux-designer-prompt.md          # Design analysis
└── code-analysis/               # Full Platform Mode
    └── software-architect-prompt.md   # Code architecture
```

---

## **🚀 Quick Build Mode (Nuggetwise Builder)**

### **Purpose**
Generate React/Tailwind frontends in under 30 seconds using a 7-agent orchestration system.

### **Use Cases**
- Rapid prototyping
- Simple UI generation
- Quick concept validation
- Single-page applications

### **Workflow**
1. **Intent Analysis** → Understand user goals
2. **UX Pattern Selection** → Choose UI patterns
3. **Validation** → Assess feasibility
4. **UI Requirement Synthesis** → Create component specs
5. **v0 Prompt Building** → Optimize for v0.dev
6. **Diff Detection** → Identify changes
7. **Notification** → Send updates

### **Commands**
```bash
/nw build "Job tracker with dark mode"
/nw update "Add user authentication"
/nw pull "Get latest designs"
```

---

## **🏢 Full Platform Mode (CursorFlow Platform)**

### **Purpose**
Comprehensive PRD-to-production workflow with enterprise features.

### **Use Cases**
- Full-stack applications
- Enterprise development
- Team collaboration
- Production deployments

### **Components**

#### **Frontend Generation**
- **`cursorflow-webapp-prompt.md`**: Generate the CursorFlow web application
- **`cursorflow-marketing-prompt.md`**: Generate marketing websites

#### **PRD Generation**
- **`product-manager-prompt.md`**: Comprehensive product requirements documents

#### **Design Analysis**
- **`ux-designer-prompt.md`**: UX/UI design critique and optimization

#### **Code Analysis**
- **`software-architect-prompt.md`**: Code architecture and quality assessment

---

## **🔄 Mode Selection**

### **Quick Build Mode** (Recommended for)
- ✅ Simple UI components
- ✅ Single-page applications
- ✅ Rapid prototyping
- ✅ Concept validation
- ✅ Non-technical users

### **Full Platform Mode** (Recommended for)
- ✅ Complex applications
- ✅ Full-stack development
- ✅ Team collaboration
- ✅ Enterprise features
- ✅ Production deployments

### **Seamless Upgrades**
Users can start with Quick Build and seamlessly upgrade to Full Platform as their needs grow.

---

## **📋 Prompt Specifications**

### **Quick Build Prompts (JSON Format)**
- **Structured**: JSON schema validation
- **Optimized**: For v0.dev integration
- **Fast**: Streamlined for speed
- **Modular**: Work together in sequence

### **Full Platform Prompts (Markdown Format)**
- **Comprehensive**: Detailed analysis
- **Flexible**: Adaptable to various use cases
- **Professional**: Enterprise-grade quality
- **Standalone**: Can be used independently

---

## **🔧 Integration Points**

### **v0 Platform Integration**
Based on [v0.dev Cursor documentation](https://v0.dev/docs/cursor):
- **API Endpoint**: `https://api.v0.dev/v1`
- **Model**: `v0-1.0-md`
- **Authentication**: API key in headers
- **Response Format**: JSON with component data

### **Cursor IDE Integration**
- **MCP Protocol**: Model Context Protocol for tool integration
- **Slash Commands**: `/nw build`, `/nw update`, `/nw pull`
- **File System Access**: Direct workspace manipulation
- **Real-time Updates**: Live preview and notifications

---

## **📊 Usage Examples**

### **Quick Build Example**
```bash
# User types in Cursor
/nw build "E-commerce product page with reviews and add to cart"

# System processes through 7 agents
1. Intent Analysis: "E-commerce product page"
2. UX Pattern: "Product card, review section, cart button"
3. Validation: "Feasible, moderate complexity"
4. UI Requirements: "ProductCard, ReviewSection, AddToCartButton"
5. v0 Prompt: "Generate React components with Tailwind..."
6. Diff Detection: "New components needed"
7. Notification: "Build completed! 3 components generated"
```

### **Full Platform Example**
```bash
# User creates PRD
1. Product Manager Prompt: "Generate comprehensive PRD for e-commerce platform"
2. Frontend Generation: "Create full e-commerce web application"
3. Design Critique: "Analyze UX and suggest improvements"
4. Code Analysis: "Review architecture and performance"
```

---

## **🎯 Success Metrics**

### **Quick Build Mode**
- **Speed**: <30 seconds generation time
- **Success Rate**: >95% successful builds
- **User Satisfaction**: >4.5/5 rating
- **Cost Efficiency**: <$2 per build

### **Full Platform Mode**
- **Quality**: >90% of generated code passes review
- **Completeness**: Comprehensive PRD-to-production workflow
- **Enterprise Ready**: Security, compliance, collaboration
- **Scalability**: Handles complex applications

---

## **🔗 Related Documentation**

- [Hybrid Architecture](../implementation-plan/HYBRID_ARCHITECTURE.md)
- [Nuggetwise Builder](../implementation-plan/NUGGETWISE_BUILDER.md)
- [Implementation Checklist](../implementation-plan/HYBRID_IMPLEMENTATION_CHECKLIST.md)
- [API Specifications](../implementation-plan/API_SPECS.md)

---

## **📞 Support**

For questions about prompt usage or customization:
- Check the implementation plan documentation
- Review the hybrid architecture guide
- Test prompts with sample inputs
- Validate JSON schemas for Quick Build prompts

---

*This prompt structure supports both rapid prototyping and enterprise development, providing a clear path for user growth and platform adoption.* 