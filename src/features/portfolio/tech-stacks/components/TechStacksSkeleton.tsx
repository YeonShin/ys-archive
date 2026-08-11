import SectionHeader from '@/features/portfolio/components/SectionHeader';

const TechStacksSkeleton = () => {
  return (
    <section
      id="tech-skeleton"
      className="bg-brand-neutral-light flex min-h-screen w-full flex-col items-center px-6 py-24 md:py-32"
    >
      <div className="flex w-full max-w-4xl flex-col items-center gap-4">
        <SectionHeader title="tech stacks" korTitle="기술 스택" />

        <div className="from-brand-secondary to-brand-primary mx-auto h-0.75 w-14 rounded-full bg-linear-to-r" />

        {/* 카테고리 필터링 영역 스켈레톤 */}
        <div className="mt-4 mb-14 flex justify-center">
          <div className="bg-brand-neutral-muted flex max-w-full flex-wrap justify-center gap-1 rounded-2xl p-1.5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="bg-brand-secondary/20 h-9 w-20 animate-pulse rounded-xl md:w-24"
              />
            ))}
          </div>
        </div>

        {/* 기술스택 그리드 영역 스켈레톤 */}
        <div className="w-full max-w-4xl">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="bg-brand-secondary/10 flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl md:h-20 md:w-20"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStacksSkeleton;
