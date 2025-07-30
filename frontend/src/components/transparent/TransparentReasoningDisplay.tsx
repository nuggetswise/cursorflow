'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Eye,
  EyeOff,
  Info,
  Zap,
  Shield,
  Target
} from 'lucide-react';
import { TransparentResponse } from '@/services/prompt-engine/transparent-prompt-engine';

interface TransparentReasoningDisplayProps {
  response: TransparentResponse<any>;
  title?: string;
  showMetadata?: boolean;
  collapsible?: boolean;
}

export const TransparentReasoningDisplay: React.FC<TransparentReasoningDisplayProps> = ({
  response,
  title = 'AI Analysis Reasoning',
  showMetadata = true,
  collapsible = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReasoning, setShowReasoning] = useState(true);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="space-y-4">
      {/* Main Result Card */}
      <Card className="border-2 border-blue-100 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span>{title}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-100">
                AI-Powered
              </Badge>
              {collapsible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Confidence Indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Confidence Level</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-bold ${getConfidenceColor(response.reasoning.confidence)}`}>
                {Math.round(response.reasoning.confidence * 100)}%
              </span>
              <Badge variant="secondary" className={getConfidenceColor(response.reasoning.confidence)}>
                {getConfidenceLabel(response.reasoning.confidence)}
              </Badge>
            </div>
          </div>
          
          <Progress 
            value={response.reasoning.confidence * 100} 
            className="mb-4"
          />

          {/* Quick Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">
                {response.reasoning.steps.length}
              </div>
              <div className="text-xs text-gray-600">Reasoning Steps</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">
                {response.reasoning.evidence.length}
              </div>
              <div className="text-xs text-gray-600">Evidence Points</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-orange-600">
                {response.reasoning.alternatives.length}
              </div>
              <div className="text-xs text-gray-600">Alternatives</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reasoning Details */}
      {(!collapsible || isExpanded) && (
        <div className="space-y-4">
          {/* Reasoning Steps */}
          {response.reasoning.steps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  <span>Reasoning Process</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {response.reasoning.steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Evidence */}
          {response.reasoning.evidence.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Supporting Evidence</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {response.reasoning.evidence.map((evidence, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-green-50 rounded border border-green-200">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-green-800">{evidence}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alternative Approaches */}
          {response.reasoning.alternatives.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span>Alternative Approaches</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {response.reasoning.alternatives.map((alternative, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-purple-50 rounded border border-purple-200">
                      <TrendingUp className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-purple-800">{alternative}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Limitations */}
          {response.reasoning.limitations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <span>Analysis Limitations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {response.reasoning.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-orange-50 rounded border border-orange-200">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-orange-800">{limitation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          {showMetadata && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="w-5 h-5 text-gray-600" />
                  <span>Analysis Metadata</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-600">Model Used</div>
                    <div className="text-gray-900">{response.metadata.modelUsed}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-600">Prompt Version</div>
                    <div className="text-gray-900">{response.metadata.promptVersion}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-600">Tokens Used</div>
                    <div className="text-gray-900">{response.metadata.tokensUsed.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-600">Processing Time</div>
                    <div className="text-gray-900">{response.metadata.processingTime}ms</div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  Analysis completed at {new Date(response.metadata.timestamp).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}; 