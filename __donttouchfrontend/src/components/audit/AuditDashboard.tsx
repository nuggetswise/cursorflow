'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { DesignAudit, AuditType } from '@/types';
import { AuditResults } from './AuditResults';
import { toast } from 'sonner';

interface AuditDashboardProps {
  projectId: string;
  deploymentUrl: string;
}

export const AuditDashboard: React.FC<AuditDashboardProps> = ({ projectId, deploymentUrl }) => {
  const [audit, setAudit] = useState<DesignAudit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [auditType, setAuditType] = useState<AuditType>('full');
  const [auditHistory, setAuditHistory] = useState<any[]>([]);

  const runAudit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/audit/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: deploymentUrl, 
          projectId, 
          auditType 
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setAudit(data.audit);
        toast.success('Audit completed successfully!');
      } else {
        throw new Error(data.error || 'Audit failed');
      }
    } catch (error) {
      console.error('Audit failed:', error);
      toast.error(`Audit failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getAuditHistory = async () => {
    try {
      const response = await fetch(`/api/audit/history?projectId=${projectId}&limit=5`);
      const data = await response.json();
      
      if (data.success) {
        setAuditHistory(data.audits);
      }
    } catch (error) {
      console.error('Failed to fetch audit history:', error);
    }
  };

  const getAuditTypeLabel = (type: AuditType) => {
    switch (type) {
      case 'full': return 'Full Audit';
      case 'performance': return 'Performance';
      case 'accessibility': return 'Accessibility';
      case 'copy': return 'Copy Analysis';
      default: return type;
    }
  };

  const getAuditTypeDescription = (type: AuditType) => {
    switch (type) {
      case 'full': return 'Complete analysis including copy, performance, and accessibility';
      case 'performance': return 'Focus on page load speed and Core Web Vitals';
      case 'accessibility': return 'WCAG compliance and accessibility violations';
      case 'copy': return 'Content readability and clarity analysis';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Design Critique</h2>
          <p className="text-sm text-gray-600 mt-1">
            Analyze your web application for design improvements and user experience insights
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={auditType} onValueChange={(value: AuditType) => setAuditType(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">
                <div className="flex flex-col">
                  <span>Full Audit</span>
                  <span className="text-xs text-gray-500">Complete analysis</span>
                </div>
              </SelectItem>
              <SelectItem value="performance">
                <div className="flex flex-col">
                  <span>Performance</span>
                  <span className="text-xs text-gray-500">Speed & metrics</span>
                </div>
              </SelectItem>
              <SelectItem value="accessibility">
                <div className="flex flex-col">
                  <span>Accessibility</span>
                  <span className="text-xs text-gray-500">WCAG compliance</span>
                </div>
              </SelectItem>
              <SelectItem value="copy">
                <div className="flex flex-col">
                  <span>Copy Analysis</span>
                  <span className="text-xs text-gray-500">Content & readability</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={runAudit} 
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Run Audit
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Audit Type Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>{getAuditTypeLabel(auditType)}</span>
            <Badge variant="secondary">{auditType}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">{getAuditTypeDescription(auditType)}</p>
          <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>~30-60 seconds</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>AI-powered insights</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* URL Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Target URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-2 bg-gray-50 rounded text-sm font-mono">
              {deploymentUrl}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(deploymentUrl, '_blank')}
            >
              Open
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <div>
                <p className="font-medium">Running {getAuditTypeLabel(auditType)}...</p>
                <p className="text-sm text-gray-500">
                  This may take up to 60 seconds depending on the page size
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit Results */}
      {audit && !isLoading && (
        <AuditResults audit={audit} auditType={auditType} />
      )}

      {/* Error State */}
      {!audit && !isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ready to analyze your application
              </h3>
              <p className="text-gray-600 mb-4">
                Click "Run Audit" to start the AI-powered design critique
              </p>
              <Button onClick={runAudit}>
                <Search className="w-4 h-4 mr-2" />
                Start Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 