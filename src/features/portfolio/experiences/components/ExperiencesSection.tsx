'use client';

import { motion } from 'motion/react';

import SectionHeader from '@/features/portfolio/components/SectionHeader';
import { getContainerVariants } from '@/lib/animations';

import { ExperiencesSectionData } from '../types';
import ExperienceCard from './ExperienceCard';

const containerVariants = getContainerVariants();

const ExperiencesSection = ({ data }: { data: ExperiencesSectionData | null }) => {
  return (
    <section
      id="experience"
      className="bg-brand-neutral-muted flex min-h-screen w-full flex-col items-center px-6 py-24 md:py-32"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="flex w-full max-w-4xl flex-col gap-10"
      >
        <SectionHeader title="Journey" korTitle="경력 / 학력" />

        <ul className="flex flex-col gap-6">
          {data?.experiences.map((experience, index) => {
            return <ExperienceCard key={experience.id} experience={experience} index={index} />;
          })}
        </ul>
      </motion.div>
    </section>
  );
};

export default ExperiencesSection;
