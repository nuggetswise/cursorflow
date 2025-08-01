import { Suspense } from 'react';
import { Sidebar } from '@/components/app/sidebar';
import { Header } from '@/components/app/header';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AuthProvider } from '@/components/providers/auth-provider';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="h-screen flex overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <Suspense fallback={<LoadingSpinner />}>
          <Sidebar />
        </Suspense>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Suspense fallback={<LoadingSpinner />}>
            <Header />
          </Suspense>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Suspense fallback={<LoadingSpinner />}>
                  {children}
                </Suspense>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
} 