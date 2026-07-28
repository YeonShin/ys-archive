'use client';

import { ArrowRight } from 'lucide-react';
import { Variants, motion } from 'motion/react';

import { Button } from '@/components/ui/button';
import { PORTFOLIO_SECTIONS } from '@/features/portfolio/constants/sections';
import { useActiveSection } from '@/hooks/useActiveSection';

import { HeroSectionData } from '../types';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // 자식들이 0.15초 간격으로 순차 실행
      delayChildren: 0.1, // 자식 애니메이션 시작 전 0.1초 대기
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const HeroSection = ({ data }: { data: HeroSectionData | null }) => {
  const { scrollTo } = useActiveSection(PORTFOLIO_SECTIONS);

  return (
    <motion.section
      id="hero"
      className="relative flex min-h-screen w-full flex-col items-center justify-center gap-6 px-6 md:px-12"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.p
        variants={itemVariants}
        className="text-brand-primary font-mono tracking-widest uppercase"
      >
        Frontend Developer
      </motion.p>
      <motion.h1
        variants={itemVariants}
        className="text-brand-neutral-dark text-center text-4xl font-extrabold md:text-5xl lg:text-7xl"
      >
        <span>{data?.heroTitle || '프론트엔드 개발자'}</span>
        <br />
        <span className="to-brand-primary from-brand-secondary bg-linear-to-r bg-clip-text text-transparent">
          김연신
        </span>
        <span>입니다</span>
      </motion.h1>
      <motion.p
        variants={itemVariants}
        className="text-brand-secondary text-md max-w-md text-center leading-relaxed"
      >
        {data?.heroDescription || 'React를 이용해 웹 개발을 하고 있습니다.'}
      </motion.p>
      <motion.div
        variants={itemVariants}
        className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row"
      >
        <Button
          variant="outline"
          className="w-full border-2 p-5 sm:w-auto"
          onClick={() => scrollTo('about')}
        >
          <ArrowRight /> More About Me
        </Button>

        <Button
          variant="dark"
          className="w-full p-5 sm:w-auto"
          onClick={() => scrollTo('projects')}
        >
          <ArrowRight /> See My Projets
        </Button>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="mx-auto h-12 w-px bg-linear-to-b from-[#c88a54] to-transparent" />
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
