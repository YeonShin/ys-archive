import SectionHeader from '@/features/portfolio/components/SectionHeader';
import { cn } from '@/lib/utils';

const ProjectCardSkeleton = ({ isEven }: { isEven: boolean }) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl shadow-xl">
      <div className={cn('flex flex-col-reverse', isEven ? 'md:flex-row-reverse' : 'md:flex-row')}>
        {/* Info Panel Skeleton (40%) */}
        <div className="flex w-full md:w-2/5">
          <div className="bg-brand-neutral-light flex h-full w-full flex-col justify-center gap-5 px-6 py-10">
            {/* subtitle */}
            <div className="bg-brand-secondary/20 h-3 w-16 animate-pulse rounded-md" />

            {/* title & status */}
            <div className="flex items-center gap-3">
              <div className="bg-brand-secondary/20 h-10 w-48 animate-pulse rounded-lg" />
              <div className="bg-brand-secondary/20 h-6 w-16 animate-pulse rounded-full" />
            </div>

            {/* details */}
            <div className="mt-2 flex flex-col gap-3">
              <div className="bg-brand-secondary/10 h-4 w-48 animate-pulse rounded-md" />
              <div className="bg-brand-secondary/10 h-4 w-32 animate-pulse rounded-md" />
            </div>

            {/* links */}
            <div className="mt-2 flex flex-col gap-3">
              <div className="bg-brand-secondary/10 h-4 w-28 animate-pulse rounded-md" />
              <div className="bg-brand-secondary/10 h-4 w-24 animate-pulse rounded-md" />
            </div>

            {/* tech stacks */}
            <div className="mt-2 flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-brand-secondary/20 h-7 w-14 animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Image Panel Skeleton (60%) */}
        <div className="flex w-full md:w-3/5">
          <div className="bg-brand-secondary/20 flex aspect-4/3 w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

const ProjectsSkeleton = () => {
  return (
    <section
      id="projects-skeleton"
      className="bg-brand-neutral-muted flex min-h-screen w-full flex-col items-center px-6 py-24 md:py-32"
    >
      <div className="flex w-full max-w-6xl flex-col gap-10">
        <SectionHeader title="Projects" korTitle="프로젝트" />

        {/* 더미 스켈레톤 카드 3개 렌더링 */}
        {[1, 2, 3].map((item, index) => (
          <ProjectCardSkeleton key={item} isEven={index % 2 === 0} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSkeleton;
