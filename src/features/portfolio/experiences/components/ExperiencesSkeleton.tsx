import SectionHeader from '../../components/SectionHeader';

const ExperiencesSkeleton = () => {
  return (
    <section
      id="experience-skeleton"
      className="bg-brand-neutral-muted flex min-h-screen w-full flex-col items-center py-24 md:py-32"
    >
      <div className="flex w-full max-w-4xl flex-col gap-10">
        <SectionHeader
          data={{
            title: 'Journey',
            korTitle: '경력 / 학력',
          }}
        />

        <ul className="flex flex-col gap-6">
          {[1, 2, 3].map((item) => (
            <li key={item} className="flex flex-col gap-6 md:flex-row">
              {/* 기간 스켈레톤 */}
              <div className="flex w-36 shrink-0 justify-end pt-5 text-right">
                <div className="bg-brand-secondary/20 h-4 w-24 animate-pulse rounded" />
              </div>

              {/* 타임라인 스켈레톤 */}
              <div className="flex shrink-0 flex-col items-center pt-5">
                <div className="bg-brand-primary/20 z-10 h-3.5 w-3.5 shrink-0 animate-pulse rounded-full" />
                <div className="bg-brand-primary/10 mt-1 w-px flex-1" />
              </div>

              {/* 카드 본문 스켈레톤 */}
              <div className="bg-brand-neutral-muted flex-1 rounded-2xl p-5">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="w-full">
                    <div className="bg-brand-secondary/20 mb-2 h-5 w-1/2 animate-pulse rounded" />
                    <div className="bg-brand-secondary/15 h-3.5 w-1/3 animate-pulse rounded" />
                  </div>

                  <div className="flex shrink-0 gap-1.5">
                    <div className="bg-brand-secondary/15 h-5 w-10 animate-pulse rounded-md" />
                    <div className="bg-brand-secondary/15 h-5 w-12 animate-pulse rounded-md" />
                  </div>
                </div>

                <div className="mt-6 space-y-2.5">
                  <div className="bg-brand-secondary/10 h-4 w-full animate-pulse rounded" />
                  <div className="bg-brand-secondary/10 h-4 w-[90%] animate-pulse rounded" />
                  <div className="bg-brand-secondary/10 h-4 w-[75%] animate-pulse rounded" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ExperiencesSkeleton;
