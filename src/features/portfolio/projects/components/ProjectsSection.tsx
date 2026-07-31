'use client';

import { motion } from 'motion/react';

import SectionHeader from '@/features/portfolio/components/SectionHeader';
import { getContainerVariants, getItemVariants } from '@/lib/animations';

import { ProjectsSectionData } from '../type';
import ProjectCard from './ProjectCard';

const containerVariants = getContainerVariants({
  staggerChildren: 0.15,
  delayChildren: 0.1,
});

const itemVariants = getItemVariants({
  y: 50,
  duration: 1,
  ease: [0.36, 1, 0.36, 1],
});

const ProjectsSection = ({ data }: { data: ProjectsSectionData | null }) => {
  const projects = data?.projects ?? [];
  return (
    <motion.section
      id="projects"
      className="bg-brand-neutral-muted flex min-h-screen w-full flex-col items-center px-6 py-24 md:py-32"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="flex w-full max-w-6xl flex-col gap-10">
        <SectionHeader title="Projects" korTitle="프로젝트" variants={itemVariants} />
        {projects.map((project, index) => {
          const isEven = index % 2 === 0;
          return (
            <ProjectCard
              key={project.id}
              project={project}
              isEven={isEven}
              variant={itemVariants}
            />
          );
        })}
      </div>
    </motion.section>
  );
};

export default ProjectsSection;
