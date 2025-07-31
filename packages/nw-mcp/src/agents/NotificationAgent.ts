import { BaseAgent } from './BaseAgent';
import { AgentResult, NotificationData, NotificationType, NotificationChannel } from '../types';

export class NotificationAgent extends BaseAgent {
  constructor(config: any) {
    super(config, 'NotificationAgent');
  }

  async execute(input: { 
    event: string; 
    data: NotificationData; 
    channel?: string;
    task?: string;
  }): Promise<AgentResult> {
    this.log('Starting notification processing', { 
      event: input.event,
      channel: input.channel || 'slack'
    });

    try {
      const result = await this.createNotification(input.event, input.data, input.channel as any);
      return {
        success: true,
        data: result,
        cost: 0,
        duration: 0
      };
    } catch (error) {
      this.error('Notification processing failed', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        cost: 0,
        duration: 0
      };
    }
  }

  /**
   * Creates notification content for different events
   */
  async createNotification(
    event: string,
    data: NotificationData,
    channel: NotificationChannel = { name: 'slack', type: 'slack', config: {} }
  ): Promise<string> {
    try {
      const prompt = this.buildPrompt({
        event,
        data: JSON.stringify(data),
        channel,
        task: 'create_notification'
      });

      const response = await this.callLLM(prompt, 'You are a notification content creator.', 0.2);
      if (response.success && response.data) {
        return this.parseNotificationContent(response.data);
      } else {
        throw new Error('Failed to get response from LLM');
      }
    } catch (error) {
      this.error('Error creating notification:', error);
      throw new Error(`Failed to create notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Formats notification for different channels
   */
  async formatNotification(
    content: string,
    channel: NotificationChannel,
    template?: string
  ): Promise<string> {
    try {
      const prompt = this.buildPrompt({
        content,
        channel,
        template,
        task: 'format_notification'
      });

      const response = await this.callLLM(prompt, 'You are a notification formatter.', 0.2);
      if (response.success && response.data) {
        return this.parseFormattedContent(response.data);
      } else {
        throw new Error('Failed to get response from LLM');
      }
    } catch (error) {
      this.error('Error formatting notification:', error);
      throw new Error(`Failed to format notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Determines notification priority and urgency
   */
  async determinePriority(
    event: string,
    data: NotificationData
  ): Promise<{ priority: 'low' | 'medium' | 'high' | 'urgent'; urgency: number }> {
    try {
      const prompt = this.buildPrompt({
        event,
        data: JSON.stringify(data),
        task: 'determine_priority'
      });

      const response = await this.callLLM(prompt, 'You are a notification priority analyzer.', 0.2);
      if (response.success && response.data) {
        return this.parsePriorityResult(response.data);
      } else {
        throw new Error('Failed to get response from LLM');
      }
    } catch (error) {
      this.error('Error determining priority:', error);
      throw new Error(`Failed to determine priority: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Suggests notification channels based on event type
   */
  async suggestChannels(
    event: string,
    priority: string,
    data: NotificationData
  ): Promise<NotificationChannel[]> {
    try {
      const prompt = this.buildPrompt({
        event,
        priority,
        data: JSON.stringify(data),
        task: 'suggest_channels'
      });

      const response = await this.callLLM(prompt, 'You are a notification channel advisor.', 0.2);
      if (response.success && response.data) {
        return this.parseChannelSuggestions(response.data);
      } else {
        throw new Error('Failed to get response from LLM');
      }
    } catch (error) {
      this.error('Error suggesting channels:', error);
      throw new Error(`Failed to suggest channels: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Creates personalized notification content
   */
  async personalizeNotification(
    content: string,
    userPreferences: any,
    context: any
  ): Promise<string> {
    try {
      const prompt = this.buildPrompt({
        content,
        userPreferences: JSON.stringify(userPreferences),
        context: JSON.stringify(context),
        task: 'personalize_notification'
      });

      const response = await this.callLLM(prompt, 'You are a notification personalization expert.', 0.2);
      if (response.success && response.data) {
        return this.parsePersonalizedContent(response.data);
      } else {
        throw new Error('Failed to get response from LLM');
      }
    } catch (error) {
      this.error('Error personalizing notification:', error);
      throw new Error(`Failed to personalize notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildPrompt(params: any): string {
    const { task, ...data } = params;
    
    switch (task) {
      case 'create_notification':
        return `You are a notification content creator. Create engaging notification content for different events.

Event: ${data.event}
Data: ${data.data}
Channel: ${data.channel}

Please create notification content that is:
- Clear and concise
- Appropriate for the channel
- Engaging and actionable
- Professional yet friendly

For Slack, include emojis and formatting.
For email, use formal but approachable tone.
For SMS, keep it brief and direct.

Respond with the notification content only.`;

      case 'format_notification':
        return `You are a notification formatter. Format the content for the specified channel.

Content: ${data.content}
Channel: ${data.channel}
Template: ${data.template || 'default'}

Please format the content appropriately for the channel:
- Slack: Use markdown, emojis, and blocks
- Email: Use HTML formatting with proper structure
- SMS: Keep under 160 characters
- Webhook: Use JSON format
- Discord: Use Discord markdown

Respond with the formatted content only.`;

      case 'determine_priority':
        return `You are a notification priority analyzer. Determine the priority and urgency of a notification.

Event: ${data.event}
Data: ${data.data}

Please analyze and return a JSON response with:
- priority: "low", "medium", "high", or "urgent"
- urgency: number from 1-10 (1=lowest, 10=highest)
- reasoning: brief explanation of the priority level

Consider factors like:
- Impact on user experience
- System stability
- Time sensitivity
- User engagement

Respond only with valid JSON.`;

      case 'suggest_channels':
        return `You are a notification channel advisor. Suggest appropriate channels for the notification.

Event: ${data.event}
Priority: ${data.priority}
Data: ${data.data}

Please suggest channels and return a JSON array with:
- channel: "slack", "email", "sms", "webhook", "discord", or "in_app"
- reason: why this channel is appropriate
- timing: "immediate", "delayed", or "scheduled"

Consider:
- Event urgency
- User preferences
- Channel reach
- Message complexity

Respond only with valid JSON array.`;

      case 'personalize_notification':
        return `You are a notification personalization expert. Personalize the content based on user preferences and context.

Content: ${data.content}
User Preferences: ${data.userPreferences}
Context: ${data.context}

Please personalize the notification and return:
- personalizedContent: the personalized version
- changes: brief description of what was personalized

Consider:
- User's preferred tone
- Previous interactions
- Time of day
- User's role/level
- Cultural preferences

Respond only with valid JSON.`;

      default:
        throw new Error(`Unknown task: ${task}`);
    }
  }

  private parseNotificationContent(response: string): string {
    // For notification content, return the response as-is
    return response.trim();
  }

  private parseFormattedContent(response: string): string {
    // For formatted content, return the response as-is
    return response.trim();
  }

  private parsePriorityResult(response: string): { priority: 'low' | 'medium' | 'high' | 'urgent'; urgency: number } {
    try {
      const result = JSON.parse(response);
      return {
        priority: result.priority,
        urgency: result.urgency
      };
    } catch (error) {
      throw new Error(`Failed to parse priority result: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseChannelSuggestions(response: string): NotificationChannel[] {
    try {
      const results = JSON.parse(response);
      return results.map((result: any) => result.channel);
    } catch (error) {
      throw new Error(`Failed to parse channel suggestions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parsePersonalizedContent(response: string): string {
    try {
      const result = JSON.parse(response);
      return result.personalizedContent;
    } catch (error) {
      // If parsing fails, return the response as-is
      return response.trim();
    }
  }

  /**
   * Helper method to create Slack notification
   */
  async createSlackNotification(event: string, data: NotificationData): Promise<any> {
    const content = await this.createNotification(event, data, { name: 'slack', type: 'slack', config: {} });
    const formatted = await this.formatNotification(content, { name: 'slack', type: 'slack', config: {} });
    
    return {
      text: content,
      blocks: this.parseSlackBlocks(formatted),
      channel: data.channel || '#nuggetwise-builds'
    };
  }

  /**
   * Helper method to create email notification
   */
  async createEmailNotification(event: string, data: NotificationData): Promise<any> {
    const content = await this.createNotification(event, data, { name: 'email', type: 'email', config: {} });
    const formatted = await this.formatNotification(content, { name: 'email', type: 'email', config: {} });
    
    return {
      subject: this.generateEmailSubject(event, data),
      body: formatted,
      to: (data as any).recipient || 'noreply@cursorflow.com',
      from: 'noreply@cursorflow.com'
    };
  }

  private generateEmailSubject(event: string, data: NotificationData): string {
    const eventMap: { [key: string]: string } = {
      'build_completed': 'Build Completed Successfully',
      'build_failed': 'Build Failed - Action Required',
      'build_started': 'Build Started',
      'deployment_completed': 'Deployment Completed',
      'deployment_failed': 'Deployment Failed',
      'cost_alert': 'Cost Alert - Budget Threshold Reached',
      'error_occurred': 'Error Alert - System Issue Detected'
    };

    return eventMap[event] || `CursorFlow Notification: ${event}`;
  }

  private parseSlackBlocks(content: string): any[] {
    // Simple Slack block parser - can be enhanced
    return [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: content
        }
      }
    ];
  }
} 