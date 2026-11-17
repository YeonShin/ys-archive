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

// 갱신은 revalidatePath('/')(on-demand)가 맡고, 무효화를 빠뜨렸을 때를 위한 안전망으로 1시간마다 재검증한다.
export const revalidate = 3600;
// cookies(), searchParams 같은 동적 API가 들어오면 조용히 동적 렌더링이 되지 않고 빌드가 실패한다.
export const dynamic = 'error';

const PortfolioPage = () => {
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
