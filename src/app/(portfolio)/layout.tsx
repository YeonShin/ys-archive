import Footer from '@/components/common/Footer';
import ThemeToggle from '@/components/common/ThemeToggle';
import DotNavigation from '@/features/portfolio/components/DotNavigation';
import MobileNav from '@/features/portfolio/components/MobileNav';

const PortfolioLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DotNavigation />
      <MobileNav />
      {children}

      <div className="fixed top-6 right-6 z-50 hidden lg:flex">
        <ThemeToggle />
      </div>
      <Footer />
    </>
  );
};

export default PortfolioLayout;
