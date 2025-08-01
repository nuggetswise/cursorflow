# Frontend Implementation
*Team: Frontend Team*

## 🎯 **Section 2: User Experience & Onboarding**

### **Landing Page Experience**

#### **Nuggetwise Homepage (nuggetwise.com)**
```
┌─────────────────────────────────────────────────────────────┐
│                    🎨 Magic Nuggetwise                     │
│                                                             │
│  "Generate React components in Cursor IDE with V0 AI"      │
│                                                             │
│  [🚀 Get Started] [📖 Documentation] [💬 Community]        │
│                                                             │
│  ✨ Zero Configuration  •  🎯 Single Project Focus         │
│  🔄 V0 Sync  •  ⚡ Lightning Fast                          │
└─────────────────────────────────────────────────────────────┘
```

#### **Key Value Propositions**
- **"Generate React components in Cursor IDE with V0 AI"**
- **"Zero configuration required"**
- **"Works with your existing V0 projects"**
- **"Simple 5-command workflow"**

### **User Journey: From Landing to First Component**

#### **Step 1: Landing Page Discovery**
```
User visits nuggetwise.com
    ↓
Sees clear value proposition
    ↓
Clicks "Add Magic Nuggetwise to Cursor" button
    ↓
Cursor opens "Install MCP Server?" dialog
    ↓
User clicks "Install" to confirm
```

#### **Step 2: Installation Guide**
```
┌─────────────────────────────────────────────────────────────┐
│                    📦 Installation Guide                   │
│                                                             │
│  [➕ Add Magic Nuggetwise to Cursor]                      │
│                                                             │
│  This opens Cursor's built-in MCP server installer        │
│  with Magic Nuggetwise pre-configured.                    │
│                                                             │
│  After installation, set your V0 API key:                 │
│  export V0_API_KEY="your-api-key"                         │
│                                                             │
│  [🎬 Watch Demo] [📖 Read Docs] [💬 Get Help]              │
└─────────────────────────────────────────────────────────────┘
```

#### **Step 3: First-Time Setup**
```
User opens Cursor IDE
    ↓
Cursor loads MCP server
    ↓
User sees available commands
    ↓
Ready to generate first component
```

#### **Step 4: First Component Generation**
```
User types: /nuggetwise-v0/generate "create a login form"
    ↓
Magic Nuggetwise creates V0 project
    ↓
Generates components in Cursor workspace
    ↓
User sees success message with preview link
    ↓
User opens generated files in Cursor
```

### **Detailed User Flows**

#### **Flow A: New User (Cursor-First)**
```
1. Visit nuggetwise.com
2. Click "Add Magic Nuggetwise to Cursor"
3. Cursor opens with MCP server configured
4. Set V0 API key (one-time)
5. Type: /nuggetwise-v0/generate "create a dashboard"
6. See components generated in workspace
7. Use /nuggetwise-v0/update for iterations
8. Deploy or continue development
```

#### **Flow B: V0 User (V0-First)**
```
1. Visit nuggetwise.com
2. Click "Add Magic Nuggetwise to Cursor"
3. Cursor opens with MCP server configured
4. Set V0 API key (one-time)
5. Type: /nuggetwise-v0/connect "https://v0.dev/chat/abc123"
6. See existing V0 components in Cursor
7. Use /nuggetwise-v0/update for iterations
8. Use /nuggetwise-v0/sync to pull V0 changes
```

### **Onboarding Screens**

#### **Welcome Screen (After Installation)**
```
┌─────────────────────────────────────────────────────────────┐
│                    🎉 Welcome to Magic Nuggetwise!         │
│                                                             │
│  You're all set! Here's how to get started:                │
│                                                             │
│  🚀 Generate your first component:                         │
│     /nuggetwise-v0/generate "create a button"              │
│                                                             │
│  🔄 Update existing components:                            │
│     /nuggetwise-v0/update "make it blue"                   │
│                                                             │
│  📊 Check project status:                                  │
│     /nuggetwise-v0/status                                  │
│                                                             │
│  [🎬 Watch Demo] [📖 Read Docs] [💬 Get Help]              │
└─────────────────────────────────────────────────────────────┘
```

#### **Success Screen (After First Generation)**
```
┌─────────────────────────────────────────────────────────────┐
│                    ✅ Component Generated!                  │
│                                                             │
│  Your login form has been created!                         │
│                                                             │
│  📁 Files saved to workspace                              │
│  🌐 Live Preview: https://preview-abc123.vusercontent.net  │
│  💬 V0 Chat: https://v0.dev/chat/xyz789                    │
│                                                             │
│  Next steps:                                               │
│  • Open generated files in Cursor                          │
│  • Use /nuggetwise-v0/update to make changes               │
│  • Deploy when ready                                       │
│                                                             │
│  [📖 View Files] [🔄 Make Changes] [🚀 Deploy]             │
└─────────────────────────────────────────────────────────────┘
```

### **Command Reference (Built into Cursor)**
```
┌─────────────────────────────────────────────────────────────┐
│                    📋 Available Commands                   │
│                                                             │
│  /nuggetwise-v0/generate <prompt>                          │
│     Create new components from description                 │
│                                                             │
│  /nuggetwise-v0/update <message>                           │
│     Update existing components                             │
│                                                             │
│  /nuggetwise-v0/sync                                       │
│     Pull changes from V0 web interface                     │
│                                                             │
│  /nuggetwise-v0/status                                     │
│     Check current project status                           │
│                                                             │
│  /nuggetwise-v0/connect <v0-url>                           │
│     Connect to existing V0 project                         │
└─────────────────────────────────────────────────────────────┘
```

### **"Add to Cursor" Button Implementation**

#### **How the One-Click Install Works**
```
┌─────────────────────────────────────────────────────────────┐
│                    🚀 Add to Cursor Flow                   │
│                                                             │
│  1. User clicks "Add Magic Nuggetwise to Cursor"          │
│     ↓                                                      │
│  2. Backend tracks installation attempt                    │
│     ↓                                                      │
│  3. Cursor opens "Install MCP Server?" dialog             │
│     ↓                                                      │
│  4. User clicks "Install" to confirm                      │
│     ↓                                                      │
│  5. Backend validates successful installation              │
│     ↓                                                      │
│  6. User sets V0 API key (one-time setup)                 │
│     ↓                                                      │
│  7. Backend tracks onboarding completion                   │
│     ↓                                                      │
│  8. Ready to generate components!                          │
└─────────────────────────────────────────────────────────────┘
```

#### **Technical Implementation**

##### **Frontend (nuggetwise.com)**
```typescript
// Landing page with "Add to Cursor" button
const deeplinkUrl = `cursor://anysphere.cursor-deeplink/mcp/install?name=nuggetwise-v0&config=${btoa(JSON.stringify({
  command: "npx",
  args: ["-y", "@cursorflow/nuggetwise-v0@latest"]
}))}`;

// Track installation attempts
const trackInstallation = async (userId: string) => {
  await fetch('/api/onboarding/track-installation', {
    method: 'POST',
    body: JSON.stringify({ userId, timestamp: Date.now() })
  });
};
```

#### **Cursor MCP Directory Listing**
Based on the [Cursor MCP documentation](https://docs.cursor.com/en/tools/mcp), Magic Nuggetwise will be listed alongside other MCP servers like:
- **Notion** - All-in-one workspace for notes, docs, and project management
- **Figma** - Design and collaboration platform for teams
- **Linear** - Issue tracking and project management for development teams
- **GitHub** - Version control and collaborative development platform

**Magic Nuggetwise listing:**
```
🎨 Magic Nuggetwise
Generate React components in Cursor IDE with V0 AI
[➕ Add to Cursor]
```

### **Simple Onboarding Timeline**

#### **Day 1: Get Started**
- **Installation**: 2 minutes (one-click install)
- **First component**: 1 minute
- **Basic understanding**: 5 minutes

#### **Day 2-7: Build Confidence**
- **Multiple components**: 2-5 minutes each
- **Iterations**: 30 seconds each
- **Workflow mastery**: 30 minutes total

### **Support & Help**

#### **Built-in Help**
```
/nuggetwise-v0/help
    ↓
Shows command reference and examples
```

#### **Documentation Links**
- **Quick Start**: nuggetwise.com/quickstart
- **Full Documentation**: nuggetwise.com/docs
- **Examples**: nuggetwise.com/examples
- **Community**: discord.gg/nuggetwise

#### **Troubleshooting**
- **Installation issues**: nuggetwise.com/install-help
- **V0 API issues**: nuggetwise.com/v0-help
- **Cursor integration**: nuggetwise.com/cursor-help

### **Success Metrics for Onboarding**

#### **Installation Success**
- [ ] **Installation completion rate** > 95%
- [ ] **Time to first component** < 10 minutes
- [ ] **Configuration errors** < 5%

#### **User Engagement**
- [ ] **First component generation** > 80%
- [ ] **Second component generation** > 60%
- [ ] **Weekly active users** > 70%

#### **User Satisfaction**
- [ ] **Onboarding satisfaction** > 4.5/5
- [ ] **Time to value** < 5 minutes
- [ ] **Support requests** < 10%

### **Implementation Tasks**

#### **Phase 2: Frontend Landing Page**
- [ ] **Create frontend directory** - Set up Next.js app for nuggetwise.com
- [ ] **Design landing page** - Professional homepage with value proposition
- [ ] **Implement "Add to Cursor" button** - Using Cursor's deeplink format
- [ ] **Add onboarding flow** - Step-by-step installation guide
- [ ] **Create documentation pages** - Tutorials, examples, troubleshooting
- [ ] **Deploy to production** - Make nuggetwise.com live

### **Technology Stack**

#### **Frontend Framework**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

#### **UI Components**
- **shadcn/ui** - Component library
- **Lucide React** - Icons
- **React Hook Form** - Form handling
- **Zod** - Schema validation

#### **Deployment**
- **Vercel** - Hosting and deployment
- **Cloudflare** - CDN and analytics
- **Google Analytics** - User tracking
- **Hotjar** - User behavior analysis

### **Design System**

#### **Brand Colors**
```css
:root {
  --primary: #3b82f6;      /* Blue */
  --secondary: #8b5cf6;    /* Purple */
  --accent: #06b6d4;       /* Cyan */
  --success: #10b981;      /* Green */
  --warning: #f59e0b;      /* Amber */
  --error: #ef4444;        /* Red */
}
```

#### **Typography**
```css
:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

#### **Spacing**
```css
:root {
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
}
```

### **Performance Optimization**

#### **Core Web Vitals Targets**
- **LCP (Largest Contentful Paint)** < 2.5s
- **FID (First Input Delay)** < 100ms
- **CLS (Cumulative Layout Shift)** < 0.1

#### **Optimization Strategies**
- **Image optimization** - Next.js Image component
- **Code splitting** - Dynamic imports
- **Caching** - Static generation where possible
- **CDN** - Global content delivery

### **Accessibility**

#### **WCAG 2.1 AA Compliance**
- **Keyboard navigation** - Full keyboard support
- **Screen readers** - ARIA labels and semantic HTML
- **Color contrast** - Minimum 4.5:1 ratio
- **Focus management** - Visible focus indicators

#### **Testing**
- **Automated testing** - axe-core integration
- **Manual testing** - Screen reader testing
- **User testing** - Accessibility user testing

---

*This document is part of the Magic Nuggetwise implementation plan. See `magicnuggetwiseaug1.md` for the complete overview.* 