'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { 
  Calendar, 
  Users, 
  Eye, 
  Edit, 
  Trash2,
  ExternalLink
} from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    status: 'draft' | 'in-progress' | 'review' | 'completed';
    progress: number;
    createdAt: string;
    updatedAt: string;
    teamSize: number;
    industry: string;
    targetAudience: string;
  };
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onView,
  onEdit,
  onDelete
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'in-progress': return 'default';
      case 'review': return 'outline';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'in-progress': return 'In Progress';
      case 'review': return 'In Review';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {project.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {project.description}
            </p>
          </div>
          <Badge variant={getStatusColor(project.status) as any}>
            {getStatusText(project.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Project Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{project.teamSize} members</span>
          </div>
        </div>

        {/* Industry and Audience */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-500">Industry:</span>
            <Badge variant="outline" className="text-xs">
              {project.industry}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-500">Target:</span>
            <Badge variant="outline" className="text-xs">
              {project.targetAudience}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView?.(project.id)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(project.id)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete?.(project.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 