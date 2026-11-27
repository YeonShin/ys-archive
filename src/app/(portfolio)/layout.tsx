import Footer from '@/components/common/Footer';
import ThemeToggle from '@/components/common/ThemeToggle';
import DotNavigation from '@/features/portfolio/components/DotNavigation';
import MobileNav from '@/features/portfolio/components/MobileNav';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio.yeonshin.kro.kr').replace(
  /\/$/,
  '',
);

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'YS-Archive',
      description: '프론트엔드 개발자 김연신 포트폴리오 입니다.',
      inLanguage: 'ko-KR',
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: '김연신',
      jobTitle: 'Frontend Developer',
      url: SITE_URL,
      sameAs: [
        'https://github.com/YeonShin',
        'https://www.linkedin.com/in/yeon-s-kim/',
        'https://yeonnim01.tistory.com/',
      ],
    },
  ],
};

const PortfolioLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
