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
        <SectionHeader title="tech stacks" korTitle="기술 스택" variants={itemVariants} />

        <motion.div
          variants={itemVariants}
          className="from-brand-secondary to-brand-primary mx-auto h-0.75 w-14 rounded-full bg-linear-to-r"
        />

        {/* 카테고리 필터링 영역 */}
        <motion.div variants={itemVariants} className="mb-14 flex justify-center">
          <div className="bg-brand-neutral-muted flex max-w-full flex-wrap justify-center gap-1 rounded-2xl p-1.5">
            {categories.map((category) => {
              const isActive = active?.value === category.value;

              return (
                <button
                  key={category.value}
                  onClick={() => setActive(isActive ? null : category)}
                  className={cn(
                    'rounded-xl px-4 py-2 font-mono text-sm whitespace-nowrap transition-colors duration-200 md:px-5',
                    isActive
                      ? 'bg-brand-primary text-brand-neutral-light font-bold'
                      : 'text-brand-secondary hover:bg-brand-neutral-light/50',
                  )}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* 기술스택 그리드 영역 */}
        <motion.div variants={itemVariants} className="w-full max-w-2xl">
          <TooltipProvider delayDuration={100}>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {data.techStack.map((tech) => {
                const isFilteredOut = active !== null && active.value !== tech.type.value;

                return <TechItem key={tech.id} tech={tech} isFilteredOut={isFilteredOut} />;
              })}
            </div>
          </TooltipProvider>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TechStacksSection;
