# V0 Frontend Build Prompt

## Main Landing Page Prompt

```
Create a modern landing page for Magic Nuggetwise - a React component generation tool that integrates with Cursor IDE and V0 AI. 

The page should include:

**Header Section:**
- Logo: "🎨 Magic Nuggetwise" 
- Navigation: Home, Documentation, Community
- CTA Button: "Add Magic Nuggetwise to Cursor" (primary blue button)

**Hero Section:**
- Main headline: "Generate React components in Cursor IDE with V0 AI"
- Subheadline: "Zero configuration required • Works with your existing V0 projects • Simple 5-command workflow"
- Three feature badges: "✨ Zero Configuration", "🔄 V0 Sync", "⚡ Lightning Fast"
- Two CTA buttons: "🚀 Get Started" (primary), "📖 Documentation" (secondary)

**Features Section:**
- Three feature cards with icons:
  1. "One-Click Install" - "Add to Cursor with a single click"
  2. "V0 Integration" - "Works seamlessly with your V0 projects"
  3. "Simple Commands" - "Generate components with natural language"

**User Journey Section:**
- Step-by-step visual flow showing installation to first component
- Include command examples like "/nuggetwise-v0/generate 'create a login form'"

**Command Reference Section:**
- Table showing available commands:
  - /nuggetwise-v0/generate <prompt>
  - /nuggetwise-v0/update <message>
  - /nuggetwise-v0/sync
  - /nuggetwise-v0/status
  - /nuggetwise-v0/connect <v0-url>

**Footer:**
- Links to documentation, community, support
- Social media links

**Design Requirements:**
- Modern, clean design with blue primary color (#3b82f6)
- Use Tailwind CSS for styling
- Responsive design for mobile and desktop
- Include smooth animations and hover effects
- Professional typography with Inter font
- Include proper spacing and visual hierarchy

**Technical Requirements:**
- Built with Next.js 14 and TypeScript
- Use shadcn/ui components
- Include proper SEO meta tags
- Optimize for performance and accessibility
```

## Installation Guide Page Prompt

```
Create an installation guide page for Magic Nuggetwise with:

**Header:**
- "📦 Installation Guide"
- Breadcrumb navigation

**Installation Steps:**
1. "Add Magic Nuggetwise to Cursor" button (large, prominent)
2. "Set your V0 API key" section with code example
3. "Verify installation" section with success indicators

**Visual Elements:**
- Screenshots or mockups of Cursor IDE
- Code blocks with syntax highlighting
- Success/error state indicators
- Progress indicators for multi-step process

**Troubleshooting Section:**
- Common installation issues
- Solutions and workarounds
- Support contact information

**Next Steps:**
- Link to first component generation
- Documentation links
- Community resources
```

## Documentation Page Prompt

```
Create a comprehensive documentation page for Magic Nuggetwise with:

**Navigation Sidebar:**
- Quick Start
- Commands Reference
- Examples
- Troubleshooting
- API Reference

**Main Content Area:**
- Command reference table with examples
- Code snippets with copy functionality
- Interactive examples
- Video tutorials (placeholder sections)

**Search Functionality:**
- Search bar at the top
- Filter by category
- Quick navigation

**Examples Section:**
- Real-world use cases
- Before/after comparisons
- Best practices
- Common patterns
```

## Dashboard/Status Page Prompt

```
Create a dashboard page for Magic Nuggetwise that shows:

**Project Status:**
- Current V0 project connection status
- Last sync time
- Generated components count
- Project health indicators

**Recent Activity:**
- List of recently generated components
- Update history
- Sync events
- Error logs

**Quick Actions:**
- Generate new component button
- Sync with V0 button
- View project in V0 button
- Settings button

**Analytics:**
- Components generated this week
- Most used commands
- Performance metrics
- Usage trends

**Design:**
- Clean, data-focused layout
- Status indicators with colors
- Progress bars and charts
- Responsive grid layout
```

## Onboarding Flow Prompts

### Welcome Screen
```
Create a welcome screen that appears after installation with:

- Welcome message: "🎉 Welcome to Magic Nuggetwise!"
- Getting started checklist
- Quick command examples
- Help resources links
- "Get Started" button
```

### Success Screen
```
Create a success screen for after first component generation with:

- Success message with checkmark
- Generated files list
- Live preview link
- V0 chat link
- Next steps guidance
- Action buttons (View Files, Make Changes, Deploy)
```

## Component Library Prompts

### Button Component
```
Create a reusable button component with:
- Primary, secondary, and ghost variants
- Different sizes (sm, md, lg)
- Loading states
- Icon support
- Disabled states
- Hover and focus effects
```

### Card Component
```
Create a card component for feature showcases with:
- Header, content, and footer sections
- Image support
- Action buttons
- Hover effects
- Different styles (elevated, outlined, filled)
```

### Navigation Component
```
Create a navigation component with:
- Logo/brand section
- Menu items
- Mobile hamburger menu
- Active state indicators
- Responsive design
```

## Utility Components

### Code Block
```
Create a code block component for displaying commands with:
- Syntax highlighting
- Copy to clipboard functionality
- Language detection
- Line numbers
- Dark/light theme support
```

### Status Badge
```
Create a status badge component for showing states with:
- Success (green), Warning (yellow), Error (red), Info (blue)
- Different sizes
- Icon support
- Animated states
```

## Responsive Design Requirements

```
Ensure all components are responsive with:
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interactions on mobile
- Proper spacing adjustments
- Collapsible navigation on mobile
- Optimized images and assets
```

## Performance Optimization

```
Implement performance optimizations:
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Proper caching strategies
- Bundle size optimization
- Core Web Vitals optimization
- Accessibility compliance (WCAG 2.1 AA)
``` 