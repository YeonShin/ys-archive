import type { Metadata } from 'next';

import DotNavigation from '@/features/portfolio/components/DotNavigation';
import MobileNav from '@/features/portfolio/components/MobileNav';

export const metadata: Metadata = {
  title: '프론트엔드 김연신 | 포트폴리오',
  description: '프론트엔드 개발자 김연신 포트폴리오 입니다.',
  keywords: ['프론트엔드', '개발자'],
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
