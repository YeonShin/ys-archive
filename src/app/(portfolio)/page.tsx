import { Suspense } from 'react';

import AboutContainer from '@/features/portfolio/about/components/AboutContainer';
import AboutSkeleton from '@/features/portfolio/about/components/AboutSkeleton';
import ContactContainer from '@/features/portfolio/contact/components/ContactContainer';
import ContactSkeleton from '@/features/portfolio/contact/components/ContactSkeleton';
import ExperiencesContainer from '@/features/portfolio/experiences/components/ExperiencesContainer';
import ExperiencesSkeleton from '@/features/portfolio/experiences/components/ExperiencesSkeleton';
import HeroContainer from '@/features/portfolio/hero/components/HeroContainer';
import HeroSkeleton from '@/features/portfolio/hero/components/HeroSkeleton';
import ProjectsContainer from '@/features/portfolio/projects/components/ProjectsContainer';
import ProjectsSkeleton from '@/features/portfolio/projects/components/ProjectsSkeleton';
import TechStacksContainer from '@/features/portfolio/tech-stacks/components/TechStacksContainer';
import TechStacksSkeleton from '@/features/portfolio/tech-stacks/components/TechStacksSkeleton';

const PortfolioPage = async () => {
  return (
    <main className="bg-brand-neutral-light flex flex-1 flex-col items-center justify-center font-sans">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroContainer />
      </Suspense>

      <Suspense fallback={<AboutSkeleton />}>
        <AboutContainer />
      </Suspense>

      <Suspense fallback={<ExperiencesSkeleton />}>
        <ExperiencesContainer />
      </Suspense>

      <Suspense fallback={<TechStacksSkeleton />}>
        <TechStacksContainer />
      </Suspense>

      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsContainer />
      </Suspense>

      <Suspense fallback={<ContactSkeleton />}>
        <ContactContainer />
      </Suspense>
    </main>
  );
};

export default PortfolioPage;
