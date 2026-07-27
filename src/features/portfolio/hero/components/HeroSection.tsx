'use client';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PORTFOLIO_SECTIONS } from '@/features/portfolio/constants/sections';
import { useActiveSection } from '@/hooks/useActiveSection';

import { HeroSectionData } from '../types';

const HeroSection = ({ data }: { data: HeroSectionData | null }) => {
  const { scrollTo } = useActiveSection(PORTFOLIO_SECTIONS);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full flex-1 flex-col items-center justify-center gap-6"
    >
      <p className="text-brand-primary font-mono tracking-widest uppercase">Frontend Developer</p>

      <h1 className="text-brand-neutral-dark text-center text-7xl font-extrabold">
        <span>{data?.heroTitle || '프론트엔드 개발자'}</span>
        <br />
        <span className="to-brand-primary from-brand-secondary bg-linear-to-r bg-clip-text text-transparent">
          김연신
        </span>
        <span>입니다</span>
      </h1>

      <p className="text-brand-secondary text-md max-w-md text-center leading-relaxed">
        {data?.heroDescription || 'React를 이용해 웹 개발을 하고 있습니다.'}
      </p>

      <div className="flex gap-4">
        <Button variant="outline" className="border-2 p-5" onClick={() => scrollTo('about')}>
          <ArrowRight /> More About Me
        </Button>

        <Button variant="dark" className="p-5" onClick={() => scrollTo('projects')}>
          <ArrowRight /> See My Projets
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
