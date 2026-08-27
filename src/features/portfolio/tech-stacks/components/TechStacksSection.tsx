'use client';

import { useState } from 'react';

import { motion } from 'motion/react';

import { TooltipProvider } from '@/components/ui/tooltip';
import SectionHeader from '@/features/portfolio/components/SectionHeader';
import { getContainerVariants, getItemVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

import { TECH_TYPE, TechStacksSectionData, TechType } from '../types';
import TechItem from './TechItem';

const containerVariants = getContainerVariants();
const itemVariants = getItemVariants();

const TechStacksSection = ({ data }: { data: TechStacksSectionData | null }) => {
  const [active, setActive] = useState<TechType | null>(null);

  if (!data || !data.techStack) return null;

  const existingTypes = new Set(data.techStack.map((tech) => tech.type.value));
  const categories = Object.values(TECH_TYPE).filter((category) =>
    existingTypes.has(category.value),
  );

  return (
    <section
      id="tech"
      className="bg-brand-neutral-light flex min-h-screen w-full flex-col items-center px-6 py-24 md:py-32"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="flex w-full max-w-4xl flex-col items-center gap-4"
      >
        <SectionHeader title="tech stacks" korTitle="기술 스택" className="text-center" />

        <motion.div
          variants={itemVariants}
          className="from-brand-secondary to-brand-primary mx-auto h-0.75 w-14 rounded-full bg-linear-to-r"
        />

        {/* 카테고리 필터링 영역 */}
        <motion.div variants={itemVariants} className="mb-14 flex flex-col items-center gap-3">
          <div
            className="bg-brand-neutral-muted flex max-w-full flex-wrap justify-center gap-1 rounded-2xl p-1.5"
            role="group"
            aria-label="기술 스택 카테고리 필터"
          >
            {categories.map((category) => {
              const isActive = active?.value === category.value;

              return (
                <button
                  key={category.value}
                  onClick={() => setActive(isActive ? null : category)}
                  aria-pressed={isActive}
                  className={cn(
                    'md:text-md relative flex min-h-11 cursor-pointer items-center justify-center rounded-xl px-4 py-2 font-mono text-xs whitespace-nowrap transition-colors duration-200 sm:text-sm md:px-5',
                    isActive
                      ? 'text-brand-neutral-light font-bold'
                      : 'text-brand-secondary hover:text-brand-neutral-dark hover:bg-brand-primary/50',
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      className="bg-brand-primary absolute inset-0 rounded-xl shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* 기술스택 그리드 영역 */}
        <motion.div variants={itemVariants} className="w-full max-w-2xl">
          <TooltipProvider delayDuration={100}>
            <ul
              className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6"
              aria-label="기술 스택 목록"
            >
              {data.techStack.map((tech) => {
                const isFilteredOut = active !== null && active.value !== tech.type.value;

                return <TechItem key={tech.id} tech={tech} isFilteredOut={isFilteredOut} />;
              })}
            </ul>
          </TooltipProvider>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TechStacksSection;
