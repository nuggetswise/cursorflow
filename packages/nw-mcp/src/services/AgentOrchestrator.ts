import { IntentAnalysisAgent, IntentAnalysis } from '../agents/IntentAnalysisAgent';
import { UXPatternSelectorAgent, UXPatternSelection } from '../agents/UXPatternSelectorAgent';
import { ValidationAgent, ValidationResult } from '../agents/ValidationAgent';
import { UIRequirementSynthesizerAgent, UIRequirement } from '../agents/UIRequirementSynthesizerAgent';
import { V0PromptBuilderAgent, V0Prompt } from '../agents/V0PromptBuilderAgent';
import { OrchestrationResult, AgentResult, BuildRequest } from '../types';
import { EnvironmentConfig } from '../types';

export class AgentOrchestrator {
  private intentAgent: IntentAnalysisAgent;
  private uxAgent: UXPatternSelectorAgent;
  private validationAgent: ValidationAgent;
  private uiAgent: UIRequirementSynthesizerAgent;
  private v0Agent: V0PromptBuilderAgent;
  private config: EnvironmentConfig;

  constructor(config: EnvironmentConfig) {
    this.config = config;
    this.intentAgent = new IntentAnalysisAgent(config);
    this.uxAgent = new UXPatternSelectorAgent(config);
    this.validationAgent = new ValidationAgent(config);
    this.uiAgent = new UIRequirementSynthesizerAgent(config);
    this.v0Agent = new V0PromptBuilderAgent(config);
  }

  async executeMCPIntegrationOrchestration(request: BuildRequest): Promise<OrchestrationResult> {
    const startTime = Date.now();
    let totalCost = 0;
    let totalDuration = 0;

    console.log('🚀 Starting Quick Build Orchestration');

    try {
      // Step 1: Intent Analysis
      console.log('📊 Step 1: Intent Analysis');
      const intentResult = await this.intentAgent.execute({ prompt: request.prompt });
      if (!intentResult.success) {
        throw new Error(`Intent analysis failed: ${intentResult.error}`);
      }
      const intentAnalysis: IntentAnalysis = intentResult.data;
      totalCost += intentResult.cost;
      totalDuration += intentResult.duration;

      // Step 2: UX Pattern Selection
      console.log('🎨 Step 2: UX Pattern Selection');
      const uxResult = await this.uxAgent.execute({ intentAnalysis });
      if (!uxResult.success) {
        throw new Error(`UX pattern selection failed: ${uxResult.error}`);
      }
      const uxPatterns: UXPatternSelection = uxResult.data;
      totalCost += uxResult.cost;
      totalDuration += uxResult.duration;

      // Step 3: Validation
      console.log('✅ Step 3: Validation');
      const validationResult = await this.validationAgent.execute({
        intentAnalysis,
        uxPatterns,
        ...(request.budget && { budget: request.budget }),
        ...(request.timeout && { timeout: request.timeout })
      });
      if (!validationResult.success) {
        throw new Error(`Validation failed: ${validationResult.error}`);
      }
      const validation: ValidationResult = validationResult.data;
      totalCost += validationResult.cost;
      totalDuration += validationResult.duration;

      // Continue with MCP integration (primary approach)
      console.log('✅ Proceeding with MCP integration approach');

      // Step 4: UI Requirement Synthesis
      console.log('🔧 Step 4: UI Requirement Synthesis');
      const uiResult = await this.uiAgent.execute({
        intentAnalysis,
        uxPatterns,
        validation
      });
      if (!uiResult.success) {
        throw new Error(`UI requirement synthesis failed: ${uiResult.error}`);
      }
      const uiRequirements: UIRequirement = uiResult.data;
      totalCost += uiResult.cost;
      totalDuration += uiResult.duration;

      // Step 5: V0 Prompt Building
      console.log('📝 Step 5: V0 Prompt Building');
      const v0Result = await this.v0Agent.execute({ uiRequirements });
      if (!v0Result.success) {
        throw new Error(`V0 prompt building failed: ${v0Result.error}`);
      }
      const v0Prompt: V0Prompt = v0Result.data;
      totalCost += v0Result.cost;
      totalDuration += v0Result.duration;

      const finalDuration = Date.now() - startTime;

      console.log('✅ Quick Build Orchestration completed successfully');
      console.log(`💰 Total Cost: $${totalCost.toFixed(4)}`);
      console.log(`⏱️ Total Duration: ${totalDuration}ms`);
      console.log(`📊 Components: ${uiRequirements.components.length}`);

      return {
        intentAnalysis: intentResult,
        uxPatterns: uxResult,
        validation: validationResult,
        uiRequirements: uiResult,
        v0Prompt: v0Prompt.completePrompt,
        components: uiRequirements.components,
        totalCost,
        totalDuration: finalDuration
      };

    } catch (error) {
      const finalDuration = Date.now() - startTime;
      console.error('❌ Quick Build Orchestration failed:', error);
      
      return {
        intentAnalysis: { success: false, data: null, error: 'Failed', cost: 0, duration: 0 },
        uxPatterns: { success: false, data: null, error: 'Failed', cost: 0, duration: 0 },
        validation: { success: false, data: null, error: 'Failed', cost: 0, duration: 0 },
        uiRequirements: { success: false, data: null, error: 'Failed', cost: 0, duration: 0 },
        v0Prompt: '',
        components: [],
        totalCost,
        totalDuration: finalDuration
      };
    }
  }

  // CLI Option Orchestration - Only when required (commented out for now)
  /*
  async executeCLIOptionOrchestration(request: BuildRequest): Promise<OrchestrationResult> {
    // For CLI option, we would implement a more comprehensive orchestration
    // that includes PRD generation, detailed planning, etc.
    console.log('🚀 Starting CLI Option Orchestration (not implemented yet)');
    
    // For now, fall back to MCP integration
    return this.executeMCPIntegrationOrchestration(request);
  }
  */

  getOrchestrationStats(): {
    totalCost: number;
    totalDuration: number;
    agentCount: number;
  } {
    return {
      totalCost: 0, // Would track cumulative costs
      totalDuration: 0, // Would track cumulative duration
      agentCount: 5 // Number of agents in the orchestration
    };
  }
} 