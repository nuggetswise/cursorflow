#!/usr/bin/env node

/**
 * Environment Validation Script
 * 
 * This script validates that all required environment variables are properly configured
 * for the CursorFlow platform. It checks both the root environment and the MCP server
 * environment configurations.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Required environment variables by component
const requiredVars = {
  root: [
    'NODE_ENV',
    'FRONTEND_URL',
    'BACKEND_URL',
    'API_BASE_URL',
    'MCP_SERVER_URL'
  ],
  ai: [
    'PRIMARY_LLM_PROVIDER',
    'OPENAI_API_KEY',
    'OPENAI_MODEL'
  ],
  nuggetwise: [
    'NUGGETWISE_AGENT_TIMEOUT',
    'NUGGETWISE_MAX_TOKENS',
    'NUGGETWISE_ENABLE_CACHING'
  ],
  v0: [
    'V0_API_KEY',
    'V0_BASE_URL',
    'V0_MODEL'
  ],
  cursor: [
    'CURSOR_MCP_ENABLED',
    'CURSOR_RULES_PATH'
  ],
  slack: [
    'SLACK_WEBHOOK_URL',
    'SLACK_CHANNEL',
    'SLACK_ALERT_CHANNEL'
  ],
  database: [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ],
  security: [
    'JWT_SECRET',
    'JWT_EXPIRES_IN'
  ],
  budget: [
    'BUDGET_WEEKLY_USD',
    'BUDGET_MONTHLY_USD',
    'MAX_BUILD_TIME',
    'MAX_TOKENS_PER_BUILD',
    'COST_ALERT_THRESHOLD'
  ],
  monitoring: [
    'LOG_LEVEL',
    'SENTRY_DSN',
    'ANALYTICS_KEY'
  ],
  development: [
    'DEBUG',
    'ENABLE_HOT_RELOAD',
    'SKIP_BUILD_STATIC_CHECK',
    'ENABLE_QUICK_BUILD',
    'ENABLE_FULL_PLATFORM'
  ]
};

// Optional environment variables with default values
const optionalVars = {
  'GROQ_API_KEY': 'Alternative LLM provider',
  'ANTHROPIC_API_KEY': 'Alternative LLM provider',
  'STRIPE_SECRET_KEY': 'Payment processing',
  'STRIPE_WEBHOOK_SECRET': 'Payment webhooks',
  'VERCEL_PROJECT_ID': 'Deployment tracking'
};

class EnvironmentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.success = true;
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  logSection(title) {
    console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(50)}${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}${title}${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}${'='.repeat(50)}${colors.reset}`);
  }

  logSuccess(message) {
    this.log(`✅ ${message}`, 'green');
  }

  logWarning(message) {
    this.log(`⚠️  ${message}`, 'yellow');
    this.warnings.push(message);
  }

  logError(message) {
    this.log(`❌ ${message}`, 'red');
    this.errors.push(message);
    this.success = false;
  }

  logInfo(message) {
    this.log(`ℹ️  ${message}`, 'blue');
  }

  // Check if environment file exists
  checkEnvFile(envPath) {
    if (!fs.existsSync(envPath)) {
      this.logError(`Environment file not found: ${envPath}`);
      return false;
    }
    this.logSuccess(`Environment file found: ${envPath}`);
    return true;
  }

  // Load and parse environment file
  loadEnvFile(envPath) {
    try {
      const envContent = fs.readFileSync(envPath, 'utf8');
      return dotenv.parse(envContent);
    } catch (error) {
      this.logError(`Failed to parse environment file: ${error.message}`);
      return null;
    }
  }

  // Validate required environment variables
  validateRequiredVars(env, component, vars) {
    this.logInfo(`Validating ${component} environment variables...`);
    
    for (const varName of vars) {
      if (!env[varName]) {
        this.logError(`Missing required variable: ${varName}`);
      } else if (env[varName].trim() === '') {
        this.logError(`Empty required variable: ${varName}`);
      } else if (env[varName].includes('your-') || env[varName].includes('sk-your-')) {
        this.logWarning(`Variable appears to have default value: ${varName}`);
      } else {
        this.logSuccess(`${varName} = ${this.maskSensitiveValue(varName, env[varName])}`);
      }
    }
  }

  // Validate optional environment variables
  validateOptionalVars(env) {
    this.logInfo('Checking optional environment variables...');
    
    for (const [varName, description] of Object.entries(optionalVars)) {
      if (env[varName]) {
        this.logSuccess(`${varName} = ${this.maskSensitiveValue(varName, env[varName])} (${description})`);
      } else {
        this.logInfo(`${varName} not set (${description})`);
      }
    }
  }

  // Mask sensitive values for display
  maskSensitiveValue(varName, value) {
    const sensitiveVars = ['API_KEY', 'SECRET', 'TOKEN', 'PASSWORD', 'DSN'];
    const isSensitive = sensitiveVars.some(sensitive => varName.includes(sensitive));
    
    if (isSensitive && value.length > 8) {
      return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
    }
    return value;
  }

  // Validate URL format
  validateUrls(env) {
    this.logInfo('Validating URL formats...');
    
    const urlVars = ['FRONTEND_URL', 'BACKEND_URL', 'API_BASE_URL', 'MCP_SERVER_URL', 'SUPABASE_URL'];
    
    for (const varName of urlVars) {
      if (env[varName]) {
        try {
          new URL(env[varName]);
          this.logSuccess(`${varName} has valid URL format`);
        } catch (error) {
          this.logError(`${varName} has invalid URL format: ${env[varName]}`);
        }
      }
    }
  }

  // Validate numeric values
  validateNumericVars(env) {
    this.logInfo('Validating numeric values...');
    
    const numericVars = {
      'NUGGETWISE_AGENT_TIMEOUT': { min: 1000, max: 300000 },
      'NUGGETWISE_MAX_TOKENS': { min: 100, max: 50000 },
      'MAX_BUILD_TIME': { min: 5000, max: 300000 },
      'MAX_TOKENS_PER_BUILD': { min: 100, max: 50000 },
      'BUDGET_WEEKLY_USD': { min: 1, max: 10000 },
      'BUDGET_MONTHLY_USD': { min: 1, max: 50000 },
      'COST_ALERT_THRESHOLD': { min: 1, max: 100 }
    };
    
    for (const [varName, range] of Object.entries(numericVars)) {
      if (env[varName]) {
        const value = parseFloat(env[varName]);
        if (isNaN(value)) {
          this.logError(`${varName} is not a valid number: ${env[varName]}`);
        } else if (value < range.min || value > range.max) {
          this.logWarning(`${varName} value ${value} is outside recommended range (${range.min}-${range.max})`);
        } else {
          this.logSuccess(`${varName} = ${value} (within range)`);
        }
      }
    }
  }

  // Validate boolean values
  validateBooleanVars(env) {
    this.logInfo('Validating boolean values...');
    
    const booleanVars = [
      'NUGGETWISE_ENABLE_CACHING',
      'CURSOR_MCP_ENABLED',
      'ENABLE_CACHING',
      'DEBUG',
      'ENABLE_HOT_RELOAD',
      'SKIP_BUILD_STATIC_CHECK',
      'ENABLE_QUICK_BUILD',
      'ENABLE_FULL_PLATFORM',
      'ENABLE_ANALYTICS'
    ];
    
    for (const varName of booleanVars) {
      if (env[varName]) {
        const value = env[varName].toLowerCase();
        if (value === 'true' || value === 'false') {
          this.logSuccess(`${varName} = ${value}`);
        } else {
          this.logError(`${varName} should be 'true' or 'false', got: ${env[varName]}`);
        }
      }
    }
  }

  // Check MCP server environment
  validateMCPEnvironment() {
    const mcpEnvPath = path.join(__dirname, '../../packages/nw-mcp/.env');
    
    this.logSection('MCP Server Environment');
    
    if (this.checkEnvFile(mcpEnvPath)) {
      const mcpEnv = this.loadEnvFile(mcpEnvPath);
      if (mcpEnv) {
        this.validateRequiredVars(mcpEnv, 'MCP Server', requiredVars.v0);
        this.validateRequiredVars(mcpEnv, 'MCP Server', requiredVars.ai);
        this.validateRequiredVars(mcpEnv, 'MCP Server', requiredVars.slack);
      }
    }
  }

  // Generate summary report
  generateReport() {
    this.logSection('Validation Summary');
    
    if (this.success) {
      this.logSuccess('Environment validation completed successfully!');
    } else {
      this.logError('Environment validation failed!');
    }
    
    if (this.errors.length > 0) {
      console.log(`\n${colors.red}${colors.bright}Errors (${this.errors.length}):${colors.reset}`);
      this.errors.forEach((error, index) => {
        console.log(`${colors.red}${index + 1}. ${error}${colors.reset}`);
      });
    }
    
    if (this.warnings.length > 0) {
      console.log(`\n${colors.yellow}${colors.bright}Warnings (${this.warnings.length}):${colors.reset}`);
      this.warnings.forEach((warning, index) => {
        console.log(`${colors.yellow}${index + 1}. ${warning}${colors.reset}`);
      });
    }
    
    if (this.success && this.warnings.length === 0) {
      this.logSuccess('All environment variables are properly configured!');
    } else if (this.success) {
      this.logWarning('Environment is functional but has some warnings.');
    }
    
    return this.success;
  }

  // Main validation method
  validate() {
    this.logSection('CursorFlow Environment Validation');
    
    // Check root environment
    const rootEnvPath = path.join(__dirname, '../../.env');
    
    if (!this.checkEnvFile(rootEnvPath)) {
      this.logError('Please copy env.example to .env and configure the required variables.');
      return false;
    }
    
    const env = this.loadEnvFile(rootEnvPath);
    if (!env) {
      return false;
    }
    
    // Validate all required variables
    for (const [component, vars] of Object.entries(requiredVars)) {
      this.logSection(`${component.toUpperCase()} Environment Variables`);
      this.validateRequiredVars(env, component, vars);
    }
    
    // Validate optional variables
    this.logSection('Optional Environment Variables');
    this.validateOptionalVars(env);
    
    // Validate specific formats
    this.logSection('Format Validation');
    this.validateUrls(env);
    this.validateNumericVars(env);
    this.validateBooleanVars(env);
    
    // Validate MCP server environment
    this.validateMCPEnvironment();
    
    // Generate report
    return this.generateReport();
  }
}

// Run validation if script is executed directly
if (require.main === module) {
  const validator = new EnvironmentValidator();
  const success = validator.validate();
  
  process.exit(success ? 0 : 1);
}

module.exports = EnvironmentValidator; 