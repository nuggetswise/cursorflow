'use client';

import { useEffect } from 'react';

export function Analytics() {
  useEffect(() => {
    // Google Analytics (if enabled)
    if (process.env.NEXT_PUBLIC_GA_ID) {
      // Initialize Google Analytics
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', process.env.NEXT_PUBLIC_GA_ID);
    }

    // Vercel Analytics (if enabled)
    if (process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID) {
      import('@vercel/analytics').then(({ Analytics }) => {
        Analytics();
      });
    }
  }, []);

  return null;
} 