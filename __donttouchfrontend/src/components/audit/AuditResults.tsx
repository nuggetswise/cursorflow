'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Zap,
  Eye,
  FileText
} from 'lucide-react';
import { DesignAudit, AuditType } from '@/types';
import { ScoreCard } from './ScoreCard';
import { FrictionPointCard } from './FrictionPointCard';
import { SuggestionCard } from './SuggestionCard';

interface AuditResultsProps {
  audit: DesignAudit;
  auditType: AuditType;
}

export const AuditResults: React.FC<AuditResultsProps> = ({ audit, auditType }) => {
  const getOverallScore = () => {
    const scores = [];
    
    if (auditType === 'full' || auditType === 'copy') {
      scores.push(audit.headlineGrade * 10); // Convert 1-10 to 0-100
    }
    
    if (auditType === 'full' || auditType === 'performance') {
      scores.push(audit.performanceScore);
    }
    
    if (auditType === 'full' || auditType === 'accessibility') {
      scores.push(100 - (audit.accessibilityViolations.length * 10));
    }
    
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  };

  const getScoreTrend = (score: number) => {
    if (score >= 80) return { icon: TrendingUp, color: 'text-green-500', label: 'Excellent' };
    if (score >= 60) return { icon: TrendingUp, color: 'text-yellow-500', label: 'Good' };
    return { icon: TrendingDown, color: 'text-red-500', label: 'Needs Improvement' };
  };

  const getCriticalIssues = () => {
    return audit.frictionPoints.filter(point => point.severity === 'critical').length;
  };

  const getHighPrioritySuggestions = () => {
    return audit.suggestions.filter(suggestion => 
      suggestion.priority === 'high' || suggestion.priority === 'critical'
    ).length;
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="border-2 border-blue-100 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Overall Score</span>
            <Badge variant="outline" className="bg-blue-100">
              {getOverallScore()}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {React.createElement(getScoreTrend(getOverallScore()).icon, {
                className: `w-6 h-6 ${getScoreTrend(getOverallScore()).color}`
              })}
              <div>
                <p className="text-2xl font-bold">{getOverallScore()}</p>
                <p className="text-sm text-gray-600">{getScoreTrend(getOverallScore()).label}</p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>Critical Issues: {getCriticalIssues()}</p>
              <p>High Priority: {getHighPrioritySuggestions()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(auditType === 'full' || auditType === 'copy') && (
          <ScoreCard
            title="Copy Quality"
            score={audit.headlineGrade}
            maxScore={10}
            description="Content clarity and impact"
            color="blue"
            icon={FileText}
            trend={getScoreTrend(audit.headlineGrade * 10)}
          />
        )}
        
        {(auditType === 'full' || auditType === 'performance') && (
          <ScoreCard
            title="Performance"
            score={audit.performanceScore}
            maxScore={100}
            description="Page load and interaction speed"
            color="green"
            icon={Zap}
            trend={getScoreTrend(audit.performanceScore)}
          />
        )}
        
        {(auditType === 'full' || auditType === 'accessibility') && (
          <ScoreCard
            title="Accessibility"
            score={100 - (audit.accessibilityViolations.length * 10)}
            maxScore={100}
            description="WCAG compliance score"
            color="purple"
            icon={Eye}
            trend={getScoreTrend(100 - (audit.accessibilityViolations.length * 10))}
          />
        )}
      </div>

      {/* Performance Metrics (if available) */}
      {audit.performanceMetrics && (auditType === 'full' || auditType === 'performance') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(audit.performanceMetrics.firstContentfulPaint)}ms
                </p>
                <p className="text-xs text-gray-600">First Contentful Paint</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(audit.performanceMetrics.largestContentfulPaint)}ms
                </p>
                <p className="text-xs text-gray-600">Largest Contentful Paint</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {(audit.performanceMetrics.cumulativeLayoutShift * 100).toFixed(2)}
                </p>
                <p className="text-xs text-gray-600">Cumulative Layout Shift</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(audit.performanceMetrics.firstInputDelay)}ms
                </p>
                <p className="text-xs text-gray-600">First Input Delay</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {Math.round(audit.performanceMetrics.speedIndex)}ms
                </p>
                <p className="text-xs text-gray-600">Speed Index</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Copy Analysis (if available) */}
      {audit.copyAnalysis && (auditType === 'full' || auditType === 'copy') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Copy Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Readability Score</span>
                <Badge variant={audit.copyAnalysis.readabilityScore >= 70 ? 'default' : 'destructive'}>
                  {audit.copyAnalysis.readabilityScore}/100
                </Badge>
              </div>
              
              {audit.copyAnalysis.clarityIssues.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Clarity Issues:</p>
                  <ul className="space-y-1">
                    {audit.copyAnalysis.clarityIssues.map((issue, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                        <AlertTriangle className="w-3 h-3 text-yellow-500" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {audit.copyAnalysis.improvementSuggestions.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Improvement Suggestions:</p>
                  <ul className="space-y-1">
                    {audit.copyAnalysis.improvementSuggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Friction Points */}
      {audit.frictionPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span>Friction Points</span>
              <Badge variant="destructive">{audit.frictionPoints.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {audit.frictionPoints.map((point, index) => (
                <FrictionPointCard key={index} point={point} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {audit.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Actionable Suggestions</span>
              <Badge variant="default">{audit.suggestions.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {audit.suggestions.map((suggestion, index) => (
                <SuggestionCard key={index} suggestion={suggestion} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accessibility Violations */}
      {audit.accessibilityViolations.length > 0 && (auditType === 'full' || auditType === 'accessibility') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-red-500" />
              <span>Accessibility Violations</span>
              <Badge variant="destructive">{audit.accessibilityViolations.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {audit.accessibilityViolations.map((violation, index) => (
                <div key={index} className="border rounded-lg p-4 bg-red-50 border-red-200">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-red-800">{violation.description}</h4>
                    <Badge variant={violation.impact === 'critical' ? 'destructive' : 'secondary'}>
                      {violation.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-red-700 mb-2">{violation.help}</p>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={violation.helpUrl} target="_blank" rel="noopener noreferrer">
                        Learn More
                      </a>
                    </Button>
                    <span className="text-xs text-gray-500">
                      {violation.tags.join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Analysis completed at {new Date().toLocaleTimeString()}</p>
              <p>Found {audit.frictionPoints.length} friction points and {audit.suggestions.length} suggestions</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                Share Results
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 