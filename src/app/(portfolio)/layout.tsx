import type { Metadata } from 'next';

import DotNavigation from '@/features/portfolio/components/DotNavigation';
import MobileNav from '@/features/portfolio/components/MobileNav';

export const metadata: Metadata = {
  title: 'Developer Portfolio',
  description: 'Web Developer Portfolio',
};

const PortfolioLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DotNavigation />
      <MobileNav />
      {children}
    </>
  );
};

export default PortfolioLayout;
