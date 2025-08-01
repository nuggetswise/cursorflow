import { Suspense } from 'react';
import { Hero } from '@/components/marketing/hero';
import { Features } from '@/components/marketing/features';
import { Pricing } from '@/components/marketing/pricing';
import { Testimonials } from '@/components/marketing/testimonials';
import { CTA } from '@/components/marketing/cta';
import { Footer } from '@/components/marketing/footer';
import { Header } from '@/components/marketing/header';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Suspense fallback={<LoadingSpinner />}>
          <Hero />
        </Suspense>

        {/* Features Section */}
        <Suspense fallback={<LoadingSpinner />}>
          <Features />
        </Suspense>

        {/* Testimonials Section */}
        <Suspense fallback={<LoadingSpinner />}>
          <Testimonials />
        </Suspense>

        {/* Pricing Section */}
        <Suspense fallback={<LoadingSpinner />}>
          <Pricing />
        </Suspense>

        {/* Call to Action */}
        <Suspense fallback={<LoadingSpinner />}>
          <CTA />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
} 