import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Analytics } from '@/components/analytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'CursorFlow - AI-Powered Design Critique & PRD Generation',
    template: '%s | CursorFlow'
  },
  description: 'Transform your ideas into production-ready applications with AI-powered design critique, PRD generation, and seamless code creation.',
  keywords: [
    'AI design critique',
    'PRD generation',
    'product requirements document',
    'web application development',
    'AI-powered analysis',
    'UX optimization',
    'code generation',
    'v0 platform'
  ],
  authors: [{ name: 'CursorFlow Team' }],
  creator: 'CursorFlow',
  publisher: 'CursorFlow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'CursorFlow - AI-Powered Design Critique & PRD Generation',
    description: 'Transform your ideas into production-ready applications with AI-powered design critique, PRD generation, and seamless code creation.',
    siteName: 'CursorFlow',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CursorFlow - AI-Powered Design Critique & PRD Generation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CursorFlow - AI-Powered Design Critique & PRD Generation',
    description: 'Transform your ideas into production-ready applications with AI-powered design critique, PRD generation, and seamless code creation.',
    images: ['/og-image.png'],
    creator: '@cursorflow',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
} 