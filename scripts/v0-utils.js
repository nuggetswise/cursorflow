const fs = require('fs-extra');
const path = require('path');

class V0Utils {
  constructor(workspacePath = process.cwd()) {
    this.workspacePath = workspacePath;
  }

  // File validation functions
  validatePrompt(prompt) {
    const maxLength = process.env.V0_MAX_PROMPT_LENGTH || 1000;
    
    if (!prompt || typeof prompt !== 'string') {
      return { valid: false, error: 'Prompt must be a non-empty string' };
    }
    
    if (prompt.length > maxLength) {
      return { 
        valid: false, 
        error: `Prompt too long (${prompt.length} chars). Max: ${maxLength} chars` 
      };
    }
    
    // Basic content filtering
    const forbiddenPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi
    ];
    
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(prompt)) {
        return { valid: false, error: 'Prompt contains forbidden content' };
      }
    }
    
    return { valid: true };
  }

  // Prompt sanitization
  sanitizePrompt(prompt) {
    return prompt
      .trim()
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, process.env.V0_MAX_PROMPT_LENGTH || 1000);
  }

  // Cost estimation utilities
  estimateCost(prompt, modelId = 'v0-1.5-sm') {
    const baseCosts = {
      'v0-1.5-sm': 0.001,
      'v0-1.5-md': 0.002,
      'v0-1.5-lg': 0.004
    };
    
    const baseCost = baseCosts[modelId] || baseCosts['v0-1.5-sm'];
    const tokenEstimate = Math.ceil(prompt.length / 4); // Rough token estimation
    
    return {
      estimatedCost: baseCost * (tokenEstimate / 1000),
      tokenEstimate,
      modelId
    };
  }

  // Preview URL management
  async savePreviewUrl(chatId, previewUrl, fileName = 'v0-preview.txt') {
    const previewPath = path.join(this.workspacePath, '.cursor', fileName);
    
    try {
      await fs.ensureDir(path.dirname(previewPath));
      
      const previewData = {
        chatId,
        previewUrl,
        timestamp: new Date().toISOString(),
        workspace: this.workspacePath
      };
      
      await fs.writeFile(previewPath, JSON.stringify(previewData, null, 2));
      return { success: true, path: previewPath };
    } catch (error) {
      console.error('Failed to save preview URL:', error);
      return { success: false, error: error.message };
    }
  }

  async getPreviewUrl(fileName = 'v0-preview.txt') {
    const previewPath = path.join(this.workspacePath, '.cursor', fileName);
    
    try {
      if (await fs.pathExists(previewPath)) {
        const data = await fs.readFile(previewPath, 'utf8');
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Failed to read preview URL:', error);
      return null;
    }
  }

  // File backup and restore functions
  async backupFile(filePath) {
    try {
      if (await fs.pathExists(filePath)) {
        const backupPath = `${filePath}.backup.${Date.now()}`;
        await fs.copy(filePath, backupPath);
        return { success: true, backupPath };
      }
      return { success: false, error: 'File does not exist' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async restoreFile(backupPath, originalPath) {
    try {
      if (await fs.pathExists(backupPath)) {
        await fs.copy(backupPath, originalPath);
        return { success: true };
      }
      return { success: false, error: 'Backup file does not exist' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // File conflict resolution
  async resolveFileConflict(filePath) {
    try {
      if (await fs.pathExists(filePath)) {
        const backup = await this.backupFile(filePath);
        if (backup.success) {
          console.log(`📦 Backup created: ${backup.backupPath}`);
          return { resolved: true, backupPath: backup.backupPath };
        }
      }
      return { resolved: false };
    } catch (error) {
      console.error('File conflict resolution failed:', error);
      return { resolved: false, error: error.message };
    }
  }

  // Cross-platform compatibility functions
  normalizePath(filePath) {
    return path.normalize(filePath).replace(/\\/g, '/');
  }

  async ensureDirectory(dirPath) {
    try {
      await fs.ensureDir(dirPath);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // File cleanup utilities
  async cleanupOldFiles(pattern = 'v0-generated-*', maxAge = 24 * 60 * 60 * 1000) { // 24 hours
    try {
      const files = await fs.readdir(this.workspacePath);
      const now = Date.now();
      let cleanedCount = 0;
      
      for (const file of files) {
        if (file.match(pattern)) {
          const filePath = path.join(this.workspacePath, file);
          const stats = await fs.stat(filePath);
          
          if (now - stats.mtime.getTime() > maxAge) {
            await fs.remove(filePath);
            cleanedCount++;
            console.log(`🧹 Cleaned up old file: ${file}`);
          }
        }
      }
      
      return { success: true, cleanedCount };
    } catch (error) {
      console.error('Cleanup failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Rate limiting utilities
  createRateLimiter(maxRequests = 30, windowMs = 60 * 1000) {
    const requests = new Map();
    
    return {
      checkLimit: (identifier) => {
        const now = Date.now();
        const windowStart = now - windowMs;
        
        if (!requests.has(identifier)) {
          requests.set(identifier, []);
        }
        
        const userRequests = requests.get(identifier);
        const recentRequests = userRequests.filter(time => time > windowStart);
        
        if (recentRequests.length >= maxRequests) {
          return { allowed: false, remaining: 0, resetTime: recentRequests[0] + windowMs };
        }
        
        recentRequests.push(now);
        requests.set(identifier, recentRequests);
        
        return { 
          allowed: true, 
          remaining: maxRequests - recentRequests.length,
          resetTime: now + windowMs
        };
      }
    };
  }
}

module.exports = V0Utils; 