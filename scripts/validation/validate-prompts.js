#!/usr/bin/env node

/**
 * Prompt Validation Script
 * 
 * This script validates that all Nuggetwise agent prompts are properly formatted,
 * contain required fields, and are functional for the AI agents.
 */

const fs = require('fs');
const path = require('path');

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

// Required prompt files and their expected structure
const promptFiles = {
  'intent-analysis.json': {
    requiredFields: ['system', 'user', 'output_schema'],
    optionalFields: ['examples']
  },
  'ux-pattern-selector.json': {
    requiredFields: ['system', 'user', 'output_schema'],
    optionalFields: ['examples']
  },
  'validation.json': {
    requiredFields: ['system', 'user', 'output_schema'],
    optionalFields: ['examples']
  },
  'ui-requirement-synthesizer.json': {
    requiredFields: ['system', 'user', 'output_schema'],
    optionalFields: ['examples']
  },
  'v0-prompt-builder.txt': {
    requiredFields: ['instructions', 'examples'],
    optionalFields: ['constraints', 'output_format']
  },
  'diff-detector.json': {
    requiredFields: ['system', 'user', 'output_schema'],
    optionalFields: ['examples']
  },
  'notification.json': {
    requiredFields: ['system', 'user', 'output_schema'],
    optionalFields: ['examples']
  }
};

class PromptValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.success = true;
    this.promptsDir = path.join(__dirname, '../../prompts/nuggetwise');
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

  // Check if prompts directory exists
  checkPromptsDirectory() {
    if (!fs.existsSync(this.promptsDir)) {
      this.logError(`Prompts directory not found: ${this.promptsDir}`);
      return false;
    }
    this.logSuccess(`Prompts directory found: ${this.promptsDir}`);
    return true;
  }

  // Get all prompt files in the directory
  getPromptFiles() {
    try {
      const files = fs.readdirSync(this.promptsDir);
      return files.filter(file => 
        file.endsWith('.json') || file.endsWith('.txt')
      );
    } catch (error) {
      this.logError(`Failed to read prompts directory: ${error.message}`);
      return [];
    }
  }

  // Validate JSON prompt file
  validateJsonPrompt(filePath, fileName) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const prompt = JSON.parse(content);
      
      this.logInfo(`Validating ${fileName}...`);
      
      // Check required fields
      const requiredFields = promptFiles[fileName]?.requiredFields || [];
      for (const field of requiredFields) {
        if (!prompt[field]) {
          this.logError(`${fileName}: Missing required field '${field}'`);
        } else if (field === 'output_schema') {
          // output_schema should be an object
          if (typeof prompt[field] !== 'object' || prompt[field] === null) {
            this.logError(`${fileName}: Field '${field}' should be an object`);
          } else {
            this.logSuccess(`${fileName}: Field '${field}' is present`);
          }
        } else if (typeof prompt[field] !== 'string' || prompt[field].trim() === '') {
          this.logError(`${fileName}: Field '${field}' is empty or not a string`);
        } else {
          this.logSuccess(`${fileName}: Field '${field}' is present`);
        }
      }
      
      // Check optional fields
      const optionalFields = promptFiles[fileName]?.optionalFields || [];
      for (const field of optionalFields) {
        if (prompt[field]) {
          this.logSuccess(`${fileName}: Optional field '${field}' is present`);
        } else {
          this.logInfo(`${fileName}: Optional field '${field}' not present`);
        }
      }
      
      // Validate prompt content
      this.validatePromptContent(prompt, fileName);
      
      return true;
    } catch (error) {
      this.logError(`${fileName}: Invalid JSON format - ${error.message}`);
      return false;
    }
  }

  // Validate text prompt file
  validateTextPrompt(filePath, fileName) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      this.logInfo(`Validating ${fileName}...`);
      
      if (content.trim() === '') {
        this.logError(`${fileName}: File is empty`);
        return false;
      }
      
      // Check for required sections in text files
      const requiredSections = promptFiles[fileName]?.requiredFields || [];
      for (const section of requiredSections) {
        if (!content.toLowerCase().includes(section.toLowerCase())) {
          this.logWarning(`${fileName}: Section '${section}' not found in text content`);
        } else {
          this.logSuccess(`${fileName}: Section '${section}' found`);
        }
      }
      
      // Validate content length
      if (content.length < 100) {
        this.logWarning(`${fileName}: Content seems too short (${content.length} characters)`);
      } else {
        this.logSuccess(`${fileName}: Content length is adequate (${content.length} characters)`);
      }
      
      return true;
    } catch (error) {
      this.logError(`${fileName}: Failed to read file - ${error.message}`);
      return false;
    }
  }

  // Validate prompt content quality
  validatePromptContent(prompt, fileName) {
    // Check for placeholder values
    const placeholderPatterns = ['{{', '}}', '${', '}', 'PLACEHOLDER', 'TODO'];
    for (const [field, value] of Object.entries(prompt)) {
      if (typeof value === 'string') {
        for (const pattern of placeholderPatterns) {
          if (value.includes(pattern)) {
            this.logWarning(`${fileName}: Field '${field}' contains placeholder pattern '${pattern}'`);
          }
        }
      }
    }
    
    // Check for minimum content length
    const minLength = 50;
    for (const [field, value] of Object.entries(prompt)) {
      if (typeof value === 'string' && value.length < minLength) {
        this.logWarning(`${fileName}: Field '${field}' is very short (${value.length} characters)`);
      }
    }
    
      // Check for system prompt quality
  if (prompt.system) {
    if (!prompt.system.includes('You are')) {
      this.logWarning(`${fileName}: System prompt may not clearly define the agent's role`);
    }
    
    if (!prompt.system.includes('task') && !prompt.system.includes('goal')) {
      this.logWarning(`${fileName}: System prompt may not clearly define the task`);
    }
  }
  
  // Check for user prompt template quality
  if (prompt.user) {
    if (!prompt.user.includes('{') || !prompt.user.includes('}')) {
      this.logWarning(`${fileName}: User prompt template may not have variable placeholders`);
    }
  }
  }

  // Check for missing prompt files
  checkMissingFiles(foundFiles) {
    const expectedFiles = Object.keys(promptFiles);
    const missingFiles = expectedFiles.filter(file => !foundFiles.includes(file));
    
    if (missingFiles.length > 0) {
      this.logSection('Missing Prompt Files');
      for (const file of missingFiles) {
        this.logError(`Missing required prompt file: ${file}`);
      }
    } else {
      this.logSuccess('All required prompt files are present');
    }
    
    return missingFiles.length === 0;
  }

  // Check for extra files
  checkExtraFiles(foundFiles) {
    const expectedFiles = Object.keys(promptFiles);
    const extraFiles = foundFiles.filter(file => !expectedFiles.includes(file));
    
    if (extraFiles.length > 0) {
      this.logSection('Extra Prompt Files');
      for (const file of extraFiles) {
        this.logWarning(`Extra prompt file found: ${file} (not in expected list)`);
      }
    }
  }

  // Validate prompt consistency across files
  validatePromptConsistency(foundFiles) {
    this.logSection('Prompt Consistency Check');
    
    // Check for consistent naming patterns
    const jsonFiles = foundFiles.filter(file => file.endsWith('.json'));
    const names = [];
    
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(this.promptsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const prompt = JSON.parse(content);
        
        if (prompt.name) {
          names.push(prompt.name);
        }
      } catch (error) {
        // Skip files that couldn't be parsed
      }
    }
    
    // Check for duplicate names
    const duplicateNames = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicateNames.length > 0) {
      this.logWarning(`Duplicate prompt names found: ${duplicateNames.join(', ')}`);
    } else {
      this.logSuccess('All prompt names are unique');
    }
    
    // Check for consistent structure
    const structures = [];
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(this.promptsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const prompt = JSON.parse(content);
        structures.push(Object.keys(prompt).sort());
      } catch (error) {
        // Skip files that couldn't be parsed
      }
    }
    
    // Check if all JSON files have similar structure
    if (structures.length > 1) {
      const firstStructure = structures[0];
      const consistent = structures.every(structure => 
        JSON.stringify(structure) === JSON.stringify(firstStructure)
      );
      
      if (!consistent) {
        this.logWarning('JSON prompt files have inconsistent structure');
      } else {
        this.logSuccess('All JSON prompt files have consistent structure');
      }
    }
  }

  // Generate summary report
  generateReport() {
    this.logSection('Prompt Validation Summary');
    
    if (this.success) {
      this.logSuccess('Prompt validation completed successfully!');
    } else {
      this.logError('Prompt validation failed!');
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
      this.logSuccess('All prompts are properly configured and ready for use!');
    } else if (this.success) {
      this.logWarning('Prompts are functional but have some warnings.');
    }
    
    return this.success;
  }

  // Main validation method
  validate() {
    this.logSection('CursorFlow Prompt Validation');
    
    // Check prompts directory
    if (!this.checkPromptsDirectory()) {
      return false;
    }
    
    // Get all prompt files
    const foundFiles = this.getPromptFiles();
    if (foundFiles.length === 0) {
      this.logError('No prompt files found in the directory');
      return false;
    }
    
    this.logSuccess(`Found ${foundFiles.length} prompt files`);
    
    // Check for missing files
    this.checkMissingFiles(foundFiles);
    
    // Check for extra files
    this.checkExtraFiles(foundFiles);
    
    // Validate each prompt file
    this.logSection('Individual Prompt Validation');
    for (const fileName of foundFiles) {
      const filePath = path.join(this.promptsDir, fileName);
      
      if (fileName.endsWith('.json')) {
        this.validateJsonPrompt(filePath, fileName);
      } else if (fileName.endsWith('.txt')) {
        this.validateTextPrompt(filePath, fileName);
      } else {
        this.logWarning(`Unknown file type: ${fileName}`);
      }
    }
    
    // Validate consistency
    this.validatePromptConsistency(foundFiles);
    
    // Generate report
    return this.generateReport();
  }
}

// Run validation if script is executed directly
if (require.main === module) {
  const validator = new PromptValidator();
  const success = validator.validate();
  
  process.exit(success ? 0 : 1);
}

module.exports = PromptValidator; 