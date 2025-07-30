'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Target,
  BarChart3,
  Calendar
} from 'lucide-react';

// Mock data - in real app this would come from API
const mockProjects = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'Modern e-commerce platform with AI-powered recommendations',
    status: 'in-progress' as const,
    progress: 75,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-28',
    teamSize: 5,
    industry: 'E-commerce',
    targetAudience: 'Online Shoppers'
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'Collaborative task management for remote teams',
    status: 'review' as const,
    progress: 90,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-27',
    teamSize: 3,
    industry: 'SaaS',
    targetAudience: 'Remote Teams'
  },
  {
    id: '3',
    title: 'Restaurant Website',
    description: 'Modern website with online ordering system',
    status: 'completed' as const,
    progress: 100,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-25',
    teamSize: 2,
    industry: 'Food & Beverage',
    targetAudience: 'Local Customers'
  }
];

export default function DashboardPage() {
  const [projects] = useState(mockProjects);

  const stats = [
    {
      title: 'Total Projects',
      value: '12',
      change: '+2',
      changeType: 'positive' as const,
      icon: BarChart3
    },
    {
      title: 'Active Projects',
      value: '8',
      change: '+1',
      changeType: 'positive' as const,
      icon: Target
    },
    {
      title: 'Team Members',
      value: '24',
      change: '+3',
      changeType: 'positive' as const,
      icon: Users
    },
    {
      title: 'Completion Rate',
      value: '85%',
      change: '+5%',
      changeType: 'positive' as const,
      icon: TrendingUp
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <Badge 
                      variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {stat.change}
                    </Badge>
                    <span className="text-xs text-gray-500 ml-2">from last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Projects</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onView={(id) => console.log('View project:', id)}
                  onEdit={(id) => console.log('Edit project:', id)}
                  onDelete={(id) => console.log('Delete project:', id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate PRD
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Run AI Analysis
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Invite Team Member
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">E-commerce Platform updated</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Task Management App completed</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New team member invited</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 