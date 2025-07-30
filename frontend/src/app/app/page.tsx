import { Suspense } from 'react';
import { DashboardStats } from '@/components/app/dashboard-stats';
import { RecentProjects } from '@/components/app/recent-projects';
import { QuickActions } from '@/components/app/quick-actions';
import { ActivityFeed } from '@/components/app/activity-feed';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardStats />
      </Suspense>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Suspense fallback={<LoadingSpinner />}>
            <RecentProjects />
          </Suspense>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Suspense fallback={<LoadingSpinner />}>
            <QuickActions />
          </Suspense>

          {/* Activity Feed */}
          <Suspense fallback={<LoadingSpinner />}>
            <ActivityFeed />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 