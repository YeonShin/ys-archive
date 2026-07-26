import DotNavigation from '@/features/portfolio/components/DotNavigation';
import MobileNav from '@/features/portfolio/components/MobileNav';

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
