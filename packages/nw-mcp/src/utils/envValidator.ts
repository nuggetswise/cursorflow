import { EnvironmentConfig } from '../types';

export class EnvironmentValidator {
  private static requiredVars = [
    'OPENAI_API_KEY',
    'NODE_ENV'
  ];

  private static optionalVars = [
    'V0_API_KEY',
    'SLACK_WEBHOOK_URL',
    'CURSOR_WORKSPACE_PATH',
    'PORT',
    'MAX_COST',
    'MAX_TIME',
    'MAX_RETRIES',
    'COST_PER_TOKEN',
    'ALLOWED_ORIGINS',
    'LOG_LEVEL'
  ];

  static validate(): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required variables
    for (const varName of this.requiredVars) {
      const value = process.env[varName];
      if (!value || value.trim() === '') {
        errors.push(`Missing required environment variable: ${varName}`);
      }
    }

    // Check optional variables and provide warnings
    for (const varName of this.optionalVars) {
      const value = process.env[varName];
      if (!value || value.trim() === '') {
        warnings.push(`Missing optional environment variable: ${varName} (using default value)`);
      }
    }

    // Special validation for API keys
    if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('sk-')) {
      warnings.push('OPENAI_API_KEY format appears invalid (should start with "sk-")');
    }

    if (process.env.V0_API_KEY && process.env.V0_API_KEY.length < 10) {
      warnings.push('V0_API_KEY appears to be too short');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static getConfig(): EnvironmentConfig {
    const validation = this.validate();
    
    if (!validation.isValid) {
      throw new Error(`Environment validation failed:\n${validation.errors.join('\n')}`);
    }

    if (validation.warnings.length > 0) {
      console.warn('Environment warnings:', validation.warnings);
    }

    return {
      openaiApiKey: process.env.OPENAI_API_KEY!,
      v0ApiKey: process.env.V0_API_KEY || '',
      slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
      cursorWorkspacePath: process.env.CURSOR_WORKSPACE_PATH || '/workspace',
      budget: {
        maxCost: parseFloat(process.env.MAX_COST || '10.0'),
        maxTime: parseInt(process.env.MAX_TIME || '300000'),
        maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
        costPerToken: parseFloat(process.env.COST_PER_TOKEN || '0.00003')
      },
      mode: (process.env.NODE_ENV as 'development' | 'production') || 'development'
    };
  }
} 