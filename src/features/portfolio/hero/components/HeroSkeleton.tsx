import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

const HeroSkeleton = () => {
  return (
    <section className="pointer-events-none relative flex min-h-screen w-full flex-1 flex-col items-center justify-center gap-6 select-none">
      <p className="bg-brand-neutral-muted animate-pulse rounded-md font-mono tracking-widest text-transparent uppercase blur-sm">
        Frontend Developer
      </p>

      <h1 className="flex flex-col items-center text-center text-7xl font-extrabold">
        <span className="bg-brand-neutral-muted mb-2 animate-pulse rounded-2xl text-transparent blur-sm">
          프론트엔드 개발자
        </span>
        <div className="flex gap-4">
          <span className="bg-brand-neutral-muted animate-pulse rounded-2xl text-transparent blur-sm">
            김연신
          </span>
          <span className="bg-brand-neutral-muted animate-pulse rounded-2xl text-transparent blur-sm">
            입니다
          </span>
        </div>
      </h1>

      <p className="text-md bg-brand-neutral-muted max-w-md animate-pulse rounded-md text-center leading-relaxed text-transparent blur-sm">
        React를 이용해 웹 개발을 하고 있습니다.
      </p>

      <div className="flex gap-4">
        <Button
          variant="outline"
          className="bg-brand-neutral-muted animate-pulse border-2 border-transparent p-5 text-transparent blur-sm"
        >
          <ArrowRight className="opacity-0" /> More About Me
        </Button>

        <Button
          variant="dark"
          className="bg-brand-neutral-muted animate-pulse p-5 text-transparent blur-sm"
        >
          <ArrowRight className="opacity-0" /> See My Projets
        </Button>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="bg-brand-neutral-muted mx-auto h-12 w-1.5 animate-pulse rounded-full blur-sm" />
      </div>
    </section>
  );
};

export default HeroSkeleton;
