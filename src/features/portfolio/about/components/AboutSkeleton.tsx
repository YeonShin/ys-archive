const AboutSkeleton = () => {
  return (
    <section className="pointer-events-none relative flex min-h-screen w-full flex-1 items-center justify-center px-6 py-24 select-none">
      <div className="flex flex-col gap-10">
        {/* 상단 타이틀 */}
        <header>
          <p className="bg-brand-neutral-muted mb-3 w-fit animate-pulse rounded-md font-mono text-sm tracking-[0.3em] text-transparent uppercase blur-sm">
            About
          </p>
          <h2 className="tracking-light bg-brand-neutral-muted w-fit animate-pulse rounded-xl text-3xl font-extrabold text-transparent blur-sm md:text-4xl">
            자기 소개
          </h2>
        </header>
        <div className="flex flex-col items-center justify-center gap-20 md:flex-row">
          {/* 이미지 영역 */}
          <figure className="relative mx-auto aspect-3/4 w-full max-w-70 sm:max-w-sm">
            {/* 배경 오프셋 테두리 */}
            <div className="border-brand-primary/30 absolute inset-0 translate-x-2 translate-y-2 animate-pulse rounded-3xl border-2 md:translate-x-4 md:translate-y-4" />

            <div className="bg-brand-neutral-muted relative h-full w-full animate-pulse overflow-hidden rounded-3xl shadow-2xl">
              <svg viewBox="0 0 3 4" className="h-auto w-full opacity-0" aria-hidden="true" />
            </div>

            {/* 우측 하단 이름 카드 */}
            <figcaption className="border-brand-primary/30 bg-brand-neutral-muted absolute right-0 -bottom-4 rounded-2xl border px-4 py-3 shadow-lg md:-right-4">
              <p className="bg-brand-neutral-dark/20 w-fit animate-pulse rounded-sm text-sm leading-none font-extrabold text-transparent blur-sm">
                김연신
              </p>
              <p className="bg-brand-primary/20 mt-0.5 w-fit animate-pulse rounded-sm font-mono text-xs text-transparent blur-sm">
                Frontend Dev.
              </p>
            </figcaption>
          </figure>

          <article className="flex w-full max-w-lg flex-col items-start gap-8">
            {/* 가상의 마크다운 텍스트 영역 */}
            <div className="flex w-full flex-col gap-4">
              <p className="bg-brand-neutral-muted w-full animate-pulse rounded-md leading-relaxed text-transparent blur-sm">
                안녕하세요! 사용자 경험을 최우선으로 생각하는 프론트엔드 개발자 김연신입니다. React
                생태계를 주력으로 하며, 성능과 접근성 모두를 고려한 코드를 작성하려 노력합니다.
              </p>
              <p className="bg-brand-neutral-muted w-[90%] animate-pulse rounded-md leading-relaxed text-transparent blur-sm">
                좋은 제품은 단순히 동작하는 것을 넘어, 사용자가 편하게 느끼는 경험에서 비롯된다고
                생각합니다. 그래서 항상 UI 인터랙션의 디테일, 로딩 상태, 에러 처리 등 눈에 보이지
                않는 부분까지 신경 씁니다.
              </p>
              <p className="bg-brand-neutral-muted w-[95%] animate-pulse rounded-md leading-relaxed text-transparent blur-sm">
                코드를 작성하지 않을 때는 기술 블로그에 학습 내용을 정리하거나, 오픈소스 프로젝트에
                기여하며 개발 생태계에 보탬이 되려 합니다.
              </p>
            </div>

            <div className="bg-brand-neutral-muted w-fit animate-pulse rounded-md font-bold text-transparent underline blur-sm">
              ↗ 이력서 보기
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default AboutSkeleton;
