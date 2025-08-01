'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  icon: LucideIcon;
  trend: {
    icon: LucideIcon;
    color: string;
    label: string;
  };
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ 
  title, 
  score, 
  maxScore, 
  description, 
  color, 
  icon: Icon,
  trend 
}) => {
  const percentage = (score / maxScore) * 100;
  
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      progress: 'bg-blue-500',
      icon: 'text-blue-500'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      progress: 'bg-green-500',
      icon: 'text-green-500'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      progress: 'bg-purple-500',
      icon: 'text-purple-500'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      progress: 'bg-orange-500',
      icon: 'text-orange-500'
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <Card className={`${colorClasses[color].bg} ${colorClasses[color].border} ${colorClasses[color].text}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon className={`w-5 h-5 ${colorClasses[color].icon}`} />
            <h3 className="text-sm font-medium">{title}</h3>
          </div>
          <Badge variant="outline" className={`${colorClasses[color].bg} ${colorClasses[color].border}`}>
            {getScoreLabel(score, maxScore)}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-2xl font-bold" style={{ color: getScoreColor(score, maxScore) }}>
              {score}
            </div>
            <div className="text-xs text-gray-600">/ {maxScore}</div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1">
              {React.createElement(trend.icon, {
                className: `w-4 h-4 ${trend.color}`
              })}
              <span className="text-xs">{trend.label}</span>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-gray-600 mb-4">{description}</p>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color].progress}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          {percentage.toFixed(0)}% of maximum score
        </div>
      </CardContent>
    </Card>
  );
}; 