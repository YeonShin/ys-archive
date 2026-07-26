import type { Metadata } from 'next';

import DotNavigation from '@/features/portfolio/components/DotNavigation';

export const metadata: Metadata = {
  title: 'Developer Portfolio',
  description: 'Web Developer Portfolio',
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DotNavigation /> {children}
    </>
  );
}
