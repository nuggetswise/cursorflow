'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Lightbulb, 
  Clock, 
  TrendingUp, 
  FileText, 
  Zap, 
  Eye, 
  Palette,
  ArrowRight
} from 'lucide-react';
import { AuditSuggestion } from '@/types';

interface SuggestionCardProps {
  suggestion: AuditSuggestion;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  const priorityColors = {
    low: {
      border: 'border-l-4 border-l-gray-300',
      badge: 'bg-gray-100 text-gray-800 border-gray-200',
      bg: 'bg-gray-50'
    },
    medium: {
      border: 'border-l-4 border-l-blue-300',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      bg: 'bg-blue-50'
    },
    high: {
      border: 'border-l-4 border-l-orange-300',
      badge: 'bg-orange-100 text-orange-800 border-orange-200',
      bg: 'bg-orange-50'
    },
    critical: {
      border: 'border-l-4 border-l-red-300',
      badge: 'bg-red-100 text-red-800 border-red-200',
      bg: 'bg-red-50'
    }
  };

  const categoryIcons = {
    copy: FileText,
    ux: Palette,
    performance: Zap,
    accessibility: Eye
  };

  const categoryColors = {
    copy: 'text-blue-600',
    ux: 'text-purple-600',
    performance: 'text-green-600',
    accessibility: 'text-orange-600'
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'high':
        return <TrendingUp className="w-4 h-4 text-orange-600" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'low':
        return <Clock className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const colors = priorityColors[suggestion.priority];
  const CategoryIcon = categoryIcons[suggestion.category];

  return (
    <Card className={`${colors.bg} ${colors.border}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <CategoryIcon className={`w-4 h-4 ${categoryColors[suggestion.category]}`} />
            <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={colors.badge}>
              {suggestion.priority}
            </Badge>
            {getPriorityIcon(suggestion.priority)}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">{suggestion.description}</p>
        
        <div className="space-y-3">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-700">Implementation</span>
            </div>
            <p className="text-sm text-gray-600 bg-white p-3 rounded border">
              {suggestion.implementation}
            </p>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Estimated Impact</span>
            </div>
            <p className="text-sm text-gray-600">{suggestion.estimatedImpact}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span className="capitalize">{suggestion.category}</span>
              <span>•</span>
              <span className="capitalize">{suggestion.priority} priority</span>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Apply Suggestion
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 