import { BaseAgent } from './BaseAgent';
import { AgentResult } from '../types';
import { UIRequirement } from './UIRequirementSynthesizerAgent';
import * as fs from 'fs-extra';
import * as path from 'path';

export interface V0Prompt {
  components: string;
  layout: string;
  styling: string;
  interactions: string;
  accessibility: string;
  responsive: string;
  completePrompt: string;
}

export class V0PromptBuilderAgent extends BaseAgent {
  private systemPrompt: string = '';

  constructor(config: any) {
    super(config, 'V0PromptBuilderAgent');
    this.loadSystemPrompt();
  }

  private async loadSystemPrompt(): Promise<void> {
    try {
      const promptPath = path.join(process.cwd(), '../../prompts/nuggetwise/v0-prompt-builder.txt');
      this.systemPrompt = await fs.readFile(promptPath, 'utf-8');
    } catch (error) {
      // Fallback to hardcoded prompt if file not found
      this.systemPrompt = `You are a Prompt-Builder for v0.dev, specializing in creating optimized prompts that generate high-quality React/Tailwind components using proven Base44 techniques.

Your task is to convert component specifications into clear, detailed prompts that v0.dev can understand and execute perfectly.

## Core Principles (Based on Base44 Best Practices)

1. **Be clear and specific** - Give v0.dev enough context to build on
2. **Focus on the user's journey** - Consider how users will interact with each component
3. **Describe the "what," not the "how"** - Let v0.dev handle the technical implementation
4. **Iterate and refine** - Build in layers when complexity increases

## Prompt Frameworks to Use

### 1. The "Who / What / Why" Framework
For each component, structure your description as:
- **WHO** is this component for?
- **WHAT** does it help them do?
- **WHY** would someone use it?

### 2. The "User Story" Framework
Frame components as user stories:
"As a [user type], I want to [action] so that [benefit]."

### 3. The "Feature Breakdown" Framework
When describing complex components, break down capabilities clearly.

## Proven Prompting Techniques

Use these techniques to get better results from v0.dev:

| **Technique** | **When to Use** | **Example** |
|---------------|-----------------|-------------|
| **"Make it more..." / "Make it less..."** | Adjust tone, layout, or emphasis | "Make the header more prominent" |
| **"Add a..." / "Remove the..."** | Add/remove specific features | "Add a search bar to the navigation" |
| **"Change [this] to [that]"** | Adjust text, visuals, or behavior | "Change the button color to blue" |
| **"It should feel like..."** | Borrow familiar app styles | "It should feel like a mix between Notion and Slack" |
| **"Add logic for..."** | Add functional rules | "Add logic to show loading state while data loads" |
| **"Group or organize..."** | Structure content for clarity | "Group tasks by priority level" |
| **"Add conditional behavior..."** | Smart branching functionality | "Only show the edit button if user is the owner" |
| **"Let users..."** | Frame from user perspective | "Let users drag and drop items between lists" |

## Component Template

For each component, use this enhanced structure:

\`\`\`markdown
## ComponentName

**Who/What/Why:**
- WHO: [target users]
- WHAT: [what the component does]
- WHY: [why users need it]

**User Story:**
As a [user type], I want to [action] so that [benefit].

**Props:**
- \`propName\` (type): description
- \`propName\` (type): description

**Core Features:**
- Feature 1 (with specific behavior)
- Feature 2 (with specific behavior)
- Feature 3 (with specific behavior)

**Styling & Feel:**
- "It should feel like [reference app]"
- Use Tailwind CSS classes
- Responsive design (mobile-first)
- Dark mode support
- Hover and focus states

**User Interactions:**
- "Let users [specific action]"
- "Add logic for [specific behavior]"
- "Make it [more/less] [quality]"

**Accessibility:**
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Focus management
\`\`\`

## Important Guidelines

1. **Be precise but not technical** - v0.dev needs clear instructions, not implementation details
2. **Include context** - Why does this component matter to users?
3. **Reference familiar tools** - If you love how another app feels, say so
4. **Talk like explaining to a colleague** - Plain language > technical terms
5. **Include error states** - Loading, empty, error conditions
6. **Specify responsive behavior** - How should it work on mobile vs desktop

Generate the v0.dev prompt for these components, ensuring they work together seamlessly and follow modern React/Tailwind best practices. Use the Base44 techniques to make your prompts more effective and user-focused.`;
    }
  }

  async execute(input: { uiRequirements: UIRequirement }): Promise<AgentResult> {
    this.log('Starting V0 prompt building with Base44 techniques', { 
      components: input.uiRequirements.components.length,
      layout: input.uiRequirements.layout.type
    });

    // Create a more user-focused prompt using Base44 principles
    const userPrompt = this.createBase44StylePrompt(input.uiRequirements);

    const result = await this.callLLM(userPrompt, this.systemPrompt, 0.6);

    if (result.success) {
      try {
        // Parse the markdown response and structure it
        const v0Prompt = this.structureV0Prompt(result.data);
        this.log('V0 prompt building completed with Base44 techniques', { 
          components: v0Prompt.components ? 'Generated' : 'Missing',
          completePrompt: v0Prompt.completePrompt.length
        });
        
        return {
          ...result,
          data: v0Prompt
        };
      } catch (parseError) {
        this.error('Failed to structure V0 prompt', parseError);
        return {
          success: false,
          data: null,
          error: 'Failed to structure V0 prompt',
          cost: result.cost,
          duration: result.duration
        };
      }
    }

    return result;
  }

  private createBase44StylePrompt(uiRequirements: UIRequirement): string {
    // Create a more conversational, user-focused prompt using Base44 techniques
    const components = uiRequirements.components.map(comp => {
      return `**${comp.name}** (${comp.templateId}): Component for user interaction`;
    }).join('\n');

    const layoutDescription = this.getLayoutDescription(uiRequirements.layout);
    const stylingDescription = this.getStylingDescription(uiRequirements.styling);
    const interactionDescription = this.getInteractionDescription(uiRequirements.interactions);

    return `Create a v0.dev prompt for building a modern web application with the following requirements:

## WHO/WHAT/WHY Context
- WHO: Users who need to ${this.getUserContext(uiRequirements)}
- WHAT: A ${uiRequirements.layout.type} application that helps users ${this.getAppPurpose(uiRequirements)}
- WHY: To provide a seamless, modern experience that feels intuitive and responsive

## User Story
As a user, I want to interact with a ${uiRequirements.layout.type} interface so that I can ${this.getUserBenefit(uiRequirements)}.

## Components to Build
${components}

## Layout & Structure
${layoutDescription}

## Styling & Feel
${stylingDescription}

## User Interactions
${interactionDescription}

## Accessibility Requirements
- ARIA labels and roles for all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Focus management and indicators
- High contrast support for dark mode

## Responsive Behavior
- Mobile-first design approach
- Breakpoints: ${uiRequirements.responsive.breakpoints.join(', ')}
- Adaptive layout that works on all screen sizes
- Touch-friendly interactions on mobile

## Technical Requirements
- Use modern React with TypeScript
- Implement with Tailwind CSS
- Follow accessibility best practices
- Include loading and error states
- Support dark mode toggle

Generate a comprehensive v0.dev prompt that uses Base44 techniques like "It should feel like...", "Let users...", and "Add logic for..." to create an engaging, user-focused interface.`;
  }

  private getUserContext(uiRequirements: UIRequirement): string {
    // Extract user context from components and layout
    const hasForms = uiRequirements.components.some(c => c.templateId.includes('form') || c.templateId.includes('input'));
    const hasData = uiRequirements.components.some(c => c.templateId.includes('table') || c.templateId.includes('list'));
    const hasNavigation = uiRequirements.navigation.type !== 'none';

    if (hasForms && hasData) return 'manage and interact with data through forms and displays';
    if (hasForms) return 'input and submit information through forms';
    if (hasData) return 'view and interact with data displays';
    if (hasNavigation) return 'navigate through different sections of the application';
    return 'interact with a modern web interface';
  }

  private getAppPurpose(uiRequirements: UIRequirement): string {
    // Determine the main purpose based on component types
    const componentTypes = uiRequirements.components.map(c => c.templateId);
    
    if (componentTypes.some(t => t.includes('dashboard'))) return 'view and manage information through a comprehensive dashboard';
    if (componentTypes.some(t => t.includes('form'))) return 'input and process information through intuitive forms';
    if (componentTypes.some(t => t.includes('table'))) return 'display and interact with structured data';
    if (componentTypes.some(t => t.includes('card'))) return 'browse and interact with content cards';
    
    return 'accomplish their tasks efficiently';
  }

  private getUserBenefit(uiRequirements: UIRequirement): string {
    // Determine user benefit based on app purpose
    const purpose = this.getAppPurpose(uiRequirements);
    
    if (purpose.includes('dashboard')) return 'have a clear overview of all important information';
    if (purpose.includes('form')) return 'easily submit and manage my information';
    if (purpose.includes('table')) return 'find and work with the data I need';
    if (purpose.includes('card')) return 'browse and discover content easily';
    
    return 'complete my tasks quickly and efficiently';
  }

  private getLayoutDescription(layout: any): string {
    return `- Layout Type: ${layout.type}
- Structure: ${layout.structure}
- Responsive Design: ${layout.responsive ? 'Mobile-first responsive design' : 'Fixed layout'}
- Dark Mode: ${layout.darkMode ? 'Supports dark mode toggle' : 'Light mode only'}

"It should feel like a modern, clean interface that adapts to different screen sizes."`;
  }

  private getStylingDescription(styling: any): string {
    const themeRef = styling.theme === 'modern' ? 'Notion or Linear' : 
                    styling.theme === 'minimal' ? 'Stripe or Vercel' : 
                    styling.theme === 'playful' ? 'Discord or Figma' : 'modern web applications';
    
    return `- Theme: ${styling.theme} design system
- Colors: ${styling.colors.join(', ')}
- Typography: ${styling.typography}
- Spacing: ${styling.spacing}

"It should feel like ${themeRef} with clean typography and thoughtful spacing."`;
  }

  private getInteractionDescription(interactions: any): string {
    const interactionPhrases = [];
    
    if (interactions.animations.length > 0) {
      interactionPhrases.push(`"Add smooth animations for ${interactions.animations.join(', ')}"`);
    }
    
    if (interactions.transitions.length > 0) {
      interactionPhrases.push(`"Let users experience smooth transitions when ${interactions.transitions.join(', ')}"`);
    }
    
    if (interactions.hoverEffects.length > 0) {
      interactionPhrases.push(`"Make interactive elements respond with ${interactions.hoverEffects.join(', ')} on hover"`);
    }
    
    return interactionPhrases.length > 0 ? 
      interactionPhrases.join('\n') : 
      '"Let users interact with all elements smoothly and intuitively"';
  }

  private structureV0Prompt(markdownPrompt: string): V0Prompt {
    // Enhanced parsing to extract sections with Base44-style content
    const sections = markdownPrompt.split('##').filter(s => s.trim());
    
    const components = sections
      .filter(s => !s.includes('Instructions') && !s.includes('Guidelines') && !s.includes('Frameworks'))
      .map(s => `##${s}`)
      .join('\n\n');

    return {
      components,
      layout: this.extractSection(markdownPrompt, 'Layout'),
      styling: this.extractSection(markdownPrompt, 'Styling'),
      interactions: this.extractSection(markdownPrompt, 'Interactions'),
      accessibility: this.extractSection(markdownPrompt, 'Accessibility'),
      responsive: this.extractSection(markdownPrompt, 'Responsive'),
      completePrompt: markdownPrompt
    };
  }

  private extractSection(prompt: string, sectionName: string): string {
    const regex = new RegExp(`\\*\\*${sectionName}:\\*\\*\\s*([\\s\\S]*?)(?=\\*\\*|$)`, 'i');
    const match = prompt.match(regex);
    return match && match[1] ? match[1].trim() : '';
  }
} 