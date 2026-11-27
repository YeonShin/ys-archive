import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';

import { Analytics } from '@vercel/analytics/react';

import { Toaster } from '@/components/ui/sonner';
import { SITE_URL } from '@/lib/site';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/providers/theme-provider';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  title: '프론트엔드 김연신 | 포트폴리오',
  description: '프론트엔드 개발자 김연신 포트폴리오 입니다.',
  keywords: [
    '프론트엔드',
    '개발자',
    'Frontend Developer',
    '김연신',
    '포트폴리오',
    'React',
    'Next.js',
    'TypeScript',
    '웹 개발자',
  ],
  authors: [{ name: '김연신', url: 'https://github.com/YeonShin' }],
  creator: '김연신',
  publisher: '김연신',
  icons: {
    icon: '/favicons/favicon.ico',
    shortcut: '/favicons/favicon-16x16.png',
    apple: '/favicons/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: 'YS-Archive',
    title: '프론트엔드 김연신 | 포트폴리오',
    description: '프론트엔드 개발자 김연신 포트폴리오 입니다.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: '프론트엔드 개발자 김연신 포트폴리오',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '프론트엔드 김연신 | 포트폴리오',
    description: '프론트엔드 개발자 김연신 포트폴리오 입니다.',
    images: ['/opengraph-image.png'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      ...(process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION
        ? { 'naver-site-verification': process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION }
        : {}),
    },
  },
};

const themeInitializerScript = `
  (function() {
    try {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (_) {}
  })()
`;

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang="ko"
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        inter.variable,
      )}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
