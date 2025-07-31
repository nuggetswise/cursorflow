import { BaseAgent } from './BaseAgent';
import { AgentResult, DiffResult, FileChange, ConflictResolution } from '../types';

export class DiffDetectorAgent extends BaseAgent {
  constructor(config: any) {
    super(config, 'DiffDetectorAgent');
  }

  async execute(input: { 
    existingCode?: string; 
    newCode?: string; 
    filePath?: string;
    changes?: FileChange[];
    projectStructure?: string[];
    safetyRules?: string[];
  }): Promise<AgentResult> {
    this.log('Starting diff detection', { 
      filePath: input.filePath,
      hasChanges: !!input.changes
    });

    try {
      if (input.existingCode && input.newCode && input.filePath) {
        const result = await this.detectChanges(input.existingCode, input.newCode, input.filePath);
        return {
          success: true,
          data: result,
          cost: 0,
          duration: 0
        };
      } else if (input.changes && input.projectStructure) {
        const result = await this.detectConflicts(input.changes, input.projectStructure);
        return {
          success: true,
          data: result,
          cost: 0,
          duration: 0
        };
      } else {
        throw new Error('Invalid input parameters for diff detection');
      }
    } catch (error) {
      this.error('Diff detection failed', error);
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
   * Analyzes differences between existing and new code
   */
  async detectChanges(
    existingCode: string,
    newCode: string,
    filePath: string
  ): Promise<DiffResult> {
    try {
      const prompt = this.buildPrompt({
        existingCode,
        newCode,
        filePath,
        task: 'detect_changes'
      });

      const response = await this.callLLM(prompt, 'You are a code diff analyzer.', 0.1);
      if (response.success && response.data) {
        return this.parseDiffResult(response.data);
      } else {
        throw new Error('Failed to get response from LLM');
      }
    } catch (error) {
      this.error('Error detecting changes:', error);
      throw new Error(`Failed to detect changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Identifies potential conflicts in file changes
   */
  async detectConflicts(
    changes: FileChange[],
    projectStructure: string[]
  ): Promise<ConflictResolution[]> {
    try {
      const prompt = this.buildPrompt({
        changes: JSON.stringify(changes),
        projectStructure: JSON.stringify(projectStructure),
        task: 'detect_conflicts'
      });

      const response = await this.callLLM(prompt, 'You are a conflict detection system.', 0.1);
      if (response.success && response.data) {
        return this.parseConflictResolutions(response.data);
      } else {
        throw new Error('Failed to get response from LLM');
      }
    } catch (error) {
      this.error('Error detecting conflicts:', error);
      throw new Error(`Failed to detect conflicts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Suggests merge strategies for conflicting changes
   */
  async suggestMergeStrategy(
    conflict: ConflictResolution
  ): Promise<string> {
    try {
      const prompt = this.buildPrompt({
        conflict: JSON.stringify(conflict),
        task: 'suggest_merge_strategy'
      });

      const response = await this.callLLM(prompt, 'You are a merge strategy advisor.', 0.1);
      if (response.success && response.data) {
        return this.parseMergeStrategy(response.data);
      } else {
        throw new Error('Failed to get response from LLM');
      }
    } catch (error) {
      this.error('Error suggesting merge strategy:', error);
      throw new Error(`Failed to suggest merge strategy: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validates that changes are safe to apply
   */
  async validateChanges(
    changes: FileChange[],
    safetyRules: string[]
  ): Promise<{ safe: boolean; warnings: string[] }> {
    try {
      const prompt = this.buildPrompt({
        changes: JSON.stringify(changes),
        safetyRules: JSON.stringify(safetyRules),
        task: 'validate_changes'
      });

      const response = await this.callLLM(prompt, 'You are a code safety validator.', 0.1);
      if (response.success && response.data) {
        return this.parseValidationResult(response.data);
      } else {
        throw new Error('Failed to get response from LLM');
      }
    } catch (error) {
      this.error('Error validating changes:', error);
      throw new Error(`Failed to validate changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildPrompt(params: any): string {
    const { task, ...data } = params;
    
    switch (task) {
      case 'detect_changes':
        return `You are a code diff analyzer. Analyze the differences between existing and new code.

Existing Code:
\`\`\`
${data.existingCode}
\`\`\`

New Code:
\`\`\`
${data.newCode}
\`\`\`

File: ${data.filePath}

Please analyze the changes and return a JSON response with:
- changeType: "addition", "modification", "deletion", or "replacement"
- linesChanged: array of line numbers that were changed
- impact: "low", "medium", or "high"
- description: brief description of what changed
- breakingChanges: boolean indicating if this could break existing functionality

Respond only with valid JSON.`;

      case 'detect_conflicts':
        return `You are a conflict detection system. Analyze the proposed changes for potential conflicts.

Changes:
${data.changes}

Project Structure:
${data.projectStructure}

Please identify potential conflicts and return a JSON array of conflict resolutions with:
- filePath: path to the file with potential conflict
- conflictType: "naming", "dependency", "import", "structure", or "logic"
- severity: "low", "medium", or "high"
- description: description of the potential conflict
- suggestedResolution: how to resolve the conflict

Respond only with valid JSON.`;

      case 'suggest_merge_strategy':
        return `You are a merge strategy advisor. Analyze the conflict and suggest the best merge strategy.

Conflict:
${data.conflict}

Please suggest a merge strategy and return a JSON response with:
- strategy: "manual", "automatic", "interactive", or "skip"
- reasoning: why this strategy is recommended
- steps: array of steps to resolve the conflict
- estimatedTime: estimated time to resolve in minutes

Respond only with valid JSON.`;

      case 'validate_changes':
        return `You are a code safety validator. Validate that the proposed changes are safe to apply.

Changes:
${data.changes}

Safety Rules:
${data.safetyRules}

Please validate the changes and return a JSON response with:
- safe: boolean indicating if changes are safe
- warnings: array of warning messages
- riskLevel: "low", "medium", or "high"
- recommendations: array of safety recommendations

Respond only with valid JSON.`;

      default:
        throw new Error(`Unknown task: ${task}`);
    }
  }

  private parseDiffResult(response: string): DiffResult {
    try {
      const result = JSON.parse(response);
      return {
        changeType: result.changeType,
        linesChanged: result.linesChanged || [],
        impact: result.impact,
        description: result.description,
        breakingChanges: result.breakingChanges || false,
        suggestions: result.suggestions || []
      };
    } catch (error) {
      throw new Error(`Failed to parse diff result: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseConflictResolutions(response: string): ConflictResolution[] {
    try {
      const results = JSON.parse(response);
      return results.map((result: any) => ({
        filePath: result.filePath,
        conflictType: result.conflictType,
        severity: result.severity,
        description: result.description,
        suggestedResolution: result.suggestedResolution
      }));
    } catch (error) {
      throw new Error(`Failed to parse conflict resolutions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseMergeStrategy(response: string): string {
    try {
      const result = JSON.parse(response);
      return result.strategy;
    } catch (error) {
      throw new Error(`Failed to parse merge strategy: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseValidationResult(response: string): { safe: boolean; warnings: string[] } {
    try {
      const result = JSON.parse(response);
      return {
        safe: result.safe || false,
        warnings: result.warnings || []
      };
    } catch (error) {
      throw new Error(`Failed to parse validation result: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 