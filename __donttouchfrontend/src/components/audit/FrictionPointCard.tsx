'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Lightbulb } from 'lucide-react';
import { FrictionPoint } from '@/types';

interface FrictionPointCardProps {
  point: FrictionPoint;
}

export const FrictionPointCard: React.FC<FrictionPointCardProps> = ({ point }) => {
  const severityColors = {
    low: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      badge: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    medium: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      badge: 'bg-orange-100 text-orange-800 border-orange-200'
    },
    high: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      badge: 'bg-red-100 text-red-800 border-red-200'
    },
    critical: {
      bg: 'bg-red-100',
      border: 'border-red-300',
      text: 'text-red-800',
      badge: 'bg-red-200 text-red-900 border-red-300'
    }
  };

  const typeIcons = {
    copy: '📝',
    ux: '🎨',
    performance: '⚡',
    accessibility: '♿'
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'low':
        return <AlertTriangle className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const colors = severityColors[point.severity];

  return (
    <div className={`border rounded-lg p-4 ${colors.bg} ${colors.border} ${colors.text}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{typeIcons[point.type]}</span>
          <span className="text-sm font-medium capitalize">{point.type}</span>
          <Badge className={colors.badge}>
            {point.severity}
          </Badge>
        </div>
        {getSeverityIcon(point.severity)}
      </div>
      
      <div className="mb-3">
        <p className="text-sm font-medium mb-1">Issue:</p>
        <p className="text-sm">{point.description}</p>
      </div>
      
      {point.location && (
        <div className="mb-3 flex items-center space-x-2">
          <MapPin className="w-3 h-3" />
          <span className="text-xs text-gray-600">Location: {point.location}</span>
        </div>
      )}
      
      <div className="pt-3 border-t border-current border-opacity-20">
        <div className="flex items-start space-x-2">
          <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium mb-1">Suggestion:</p>
            <p className="text-sm">{point.suggestion}</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 