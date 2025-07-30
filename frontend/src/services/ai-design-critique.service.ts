import puppeteer from 'puppeteer';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import * as axe from 'axe-core';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import OpenAI from 'openai';
import { 
  DesignAudit, 
  PageData, 
  AuditSignals, 
  AuditInsights, 
  AuditType,
  CopyAnalysis,
  PerformanceMetrics,
  AccessibilityMetrics,
  FrictionPoint,
  AccessibilityViolation,
  AuditSuggestion
} from '../../src/types';

export class AIDesignCritiqueService {
  private openai: OpenAI;
  private lighthouseConfig: any;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.lighthouseConfig = {
      extends: 'lighthouse:default',
      settings: {
        onlyCategories: ['performance', 'accessibility'],
        formFactor: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        }
      }
    };
  }

  async auditLivePreview(url: string, auditType: AuditType = 'full'): Promise<DesignAudit> {
    try {
      // 1. Capture page with Puppeteer
      const pageData = await this.capturePage(url);
      
      // 2. Extract signals based on audit type
      const signals = await this.extractSignals(pageData, auditType);
      
      // 3. Generate insights with LLM
      const insights = await this.generateInsights(signals, auditType);
      
      return {
        headlineGrade: insights.headlineGrade,
        frictionPoints: insights.frictionPoints,
        performanceScore: signals.performanceScore,
        accessibilityViolations: signals.accessibilityViolations,
        suggestions: insights.suggestions,
        copyAnalysis: signals.copyAnalysis,
        performanceMetrics: signals.performanceMetrics,
        accessibilityMetrics: signals.accessibilityMetrics,
      };
    } catch (error) {
      throw new Error(`Audit failed: ${error.message}`);
    }
  }

  async capturePage(url: string): Promise<PageData> {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    try {
      const page = await browser.newPage();
      
      // Set viewport
      await page.setViewport({ width: 1280, height: 720 });
      
      // Navigate to URL
      await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // Wait for content to load
      await page.waitForTimeout(2000);
      
      const html = await page.content();
      const screenshot = await page.screenshot({ 
        fullPage: true,
        type: 'png'
      });
      const title = await page.title();
      
      return { 
        html, 
        screenshot: screenshot as Buffer, 
        title, 
        url 
      };
    } finally {
      await browser.close();
    }
  }

  async extractSignals(pageData: PageData, auditType: AuditType): Promise<AuditSignals> {
    const signals: Partial<AuditSignals> = {};

    // Extract copy analysis if needed
    if (auditType === 'full' || auditType === 'copy') {
      signals.copyAnalysis = await this.extractCopy(pageData.html);
    }

    // Extract performance metrics if needed
    if (auditType === 'full' || auditType === 'performance') {
      signals.performanceMetrics = await this.extractPerformanceMetrics(pageData.url);
      signals.performanceScore = this.calculatePerformanceScore(signals.performanceMetrics);
    }

    // Extract accessibility violations if needed
    if (auditType === 'full' || auditType === 'accessibility') {
      signals.accessibilityViolations = await this.extractAccessibilityViolations(pageData.html);
      signals.accessibilityMetrics = this.calculateAccessibilityMetrics(signals.accessibilityViolations);
    }

    return signals as AuditSignals;
  }

  async extractCopy(html: string): Promise<CopyAnalysis> {
    const dom = new JSDOM(html);
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      return {
        readabilityScore: 0,
        clarityIssues: ['No readable content found'],
        improvementSuggestions: ['Add more readable content']
      };
    }

    // Calculate basic readability score (Flesch Reading Ease)
    const words = article.textContent?.split(/\s+/).length || 0;
    const sentences = article.textContent?.split(/[.!?]+/).length || 0;
    const syllables = this.countSyllables(article.textContent || '');
    
    const fleschScore = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
    const readabilityScore = Math.max(0, Math.min(100, fleschScore));

    // Analyze clarity issues
    const clarityIssues = this.analyzeClarityIssues(article.textContent || '');

    // Generate improvement suggestions
    const improvementSuggestions = this.generateCopySuggestions(article.textContent || '', clarityIssues);

    return {
      readabilityScore,
      clarityIssues,
      improvementSuggestions
    };
  }

  async extractPerformanceMetrics(url: string): Promise<PerformanceMetrics> {
    const chrome = await launch({ chromeFlags: ['--headless', '--no-sandbox'] });
    
    try {
      const runnerResult = await lighthouse(url, {
        port: chrome.port,
        ...this.lighthouseConfig
      });

      const lhr = runnerResult.lhr;
      const audits = lhr.audits;

      return {
        firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
        largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
        cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0,
        firstInputDelay: audits['max-potential-fid']?.numericValue || 0,
        speedIndex: audits['speed-index']?.numericValue || 0
      };
    } finally {
      await chrome.kill();
    }
  }

  async extractAccessibilityViolations(html: string): Promise<AccessibilityViolation[]> {
    const dom = new JSDOM(html);
    const results = await axe.run(dom.window.document);

    return results.violations.map(violation => ({
      id: violation.id,
      impact: violation.impact as 'minor' | 'moderate' | 'serious' | 'critical',
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      tags: violation.tags,
      nodes: violation.nodes.map(node => ({
        html: node.html,
        target: node.target
      }))
    }));
  }

  async generateInsights(signals: AuditSignals, auditType: AuditType): Promise<AuditInsights> {
    // Use transparent prompt engine for explainable AI
    const transparentEngine = new TransparentPromptEngine();
    
    const context = {
      url: signals.url || 'unknown',
      auditType,
      industry: 'web application',
      audience: 'general users'
    };

    const transparentResponse = await transparentEngine.critiqueDesign(signals, context);
    
    // Extract the main result and reasoning
    const insights = transparentResponse.result as AuditInsights;
    
    // Store reasoning for transparency
    this.lastReasoning = transparentResponse.reasoning;
    
    return insights;
  }

  private buildInsightPrompt(signals: AuditSignals, auditType: AuditType): string {
    // This method is now replaced by the transparent prompt engine
    // Keeping for backward compatibility
    return '';
  }

  private parseInsightResponse(content: string): AuditInsights {
    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        headlineGrade: parsed.headlineGrade || 5,
        frictionPoints: parsed.frictionPoints || [],
        suggestions: parsed.suggestions || []
      };
    } catch (error) {
      console.error('Failed to parse insight response:', error);
      
      // Return default insights
      return {
        headlineGrade: 5,
        frictionPoints: [],
        suggestions: []
      };
    }
  }

  private calculatePerformanceScore(metrics: PerformanceMetrics): number {
    // Calculate performance score based on Core Web Vitals
    const fcpScore = Math.max(0, 100 - (metrics.firstContentfulPaint / 10));
    const lcpScore = Math.max(0, 100 - (metrics.largestContentfulPaint / 100));
    const clsScore = Math.max(0, 100 - (metrics.cumulativeLayoutShift * 1000));
    const fidScore = Math.max(0, 100 - (metrics.firstInputDelay / 10));
    
    return Math.round((fcpScore + lcpScore + clsScore + fidScore) / 4);
  }

  private calculateAccessibilityMetrics(violations: AccessibilityViolation[]): AccessibilityMetrics {
    const totalViolations = violations.length;
    const criticalViolations = violations.filter(v => v.impact === 'critical').length;
    const seriousViolations = violations.filter(v => v.impact === 'serious').length;
    
    return {
      violations: totalViolations,
      passes: 0, // Would be calculated from axe results
      incomplete: 0,
      inapplicable: 0
    };
  }

  private countSyllables(text: string): number {
    // Simple syllable counting algorithm
    const words = text.toLowerCase().split(/\s+/);
    let syllables = 0;
    
    for (const word of words) {
      const cleanWord = word.replace(/[^a-z]/g, '');
      if (cleanWord.length <= 3) {
        syllables += 1;
      } else {
        syllables += cleanWord.replace(/[^aeiouy]+/g, '').length;
      }
    }
    
    return syllables;
  }

  private analyzeClarityIssues(text: string): string[] {
    const issues: string[] = [];
    
    if (text.length < 100) {
      issues.push('Content is too short');
    }
    
    if (text.split('.').length < 3) {
      issues.push('Too few sentences');
    }
    
    const longWords = text.split(/\s+/).filter(word => word.length > 12);
    if (longWords.length > 5) {
      issues.push('Too many long words');
    }
    
    return issues;
  }

  private generateCopySuggestions(text: string, issues: string[]): string[] {
    const suggestions: string[] = [];
    
    if (issues.includes('Content is too short')) {
      suggestions.push('Add more descriptive content');
    }
    
    if (issues.includes('Too few sentences')) {
      suggestions.push('Break content into more sentences');
    }
    
    if (issues.includes('Too many long words')) {
      suggestions.push('Use simpler, more common words');
    }
    
    return suggestions;
  }
} 