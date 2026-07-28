import { Suspense } from 'react';

import AboutContainer from '@/features/portfolio/about/components/AboutContainer';
import AboutSkeleton from '@/features/portfolio/about/components/AboutSkeleton';
import HeroContainer from '@/features/portfolio/hero/components/HeroContainer';
import HeroSkeleton from '@/features/portfolio/hero/components/HeroSkeleton';

const PortfolioPage = async () => {
  return (
    <main className="bg-brand-neutral-light flex flex-1 flex-col items-center justify-center font-sans">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroContainer />
      </Suspense>

      <Suspense fallback={<AboutSkeleton />}>
        <AboutContainer />
      </Suspense>

      <section
        id="experience"
        className="flex min-h-screen w-full flex-1 flex-col items-center justify-center"
      >
        HeroSection
      </section>

      <section
        id="tech"
        className="flex min-h-screen w-full flex-1 flex-col items-center justify-center"
      >
        HeroSection
      </section>

      <section
        id="projects"
        className="flex min-h-screen w-full flex-1 flex-col items-center justify-center"
      >
        HeroSection
      </section>

      <section
        id="contact"
        className="flex min-h-screen w-full flex-1 flex-col items-center justify-center"
      >
        HeroSection
      </section>
    </main>
  );
};

export default PortfolioPage;
