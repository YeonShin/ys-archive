'use client';

import { Variants } from 'motion';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

import { Project } from '../type';
import ProjectCardImagePanel from './ProjectCardImagePanel';
import ProjectCardInfoPanel from './ProjectCardInfoPanel';

interface ProjectCardProps {
  project: Project;
  isEven: boolean;
  variant: Variants;
}

const ProjectCard = ({ project, isEven, variant }: ProjectCardProps) => {
  return (
    <motion.div
      className="flex flex-col overflow-hidden rounded-2xl shadow-xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={variant}
    >
      <div className={cn('flex flex-col-reverse', isEven ? 'md:flex-row-reverse' : 'md:flex-row')}>
        <div className="flex w-full md:w-2/5">
          <ProjectCardInfoPanel project={project} />
        </div>

        <div className="flex w-full md:w-3/5">
          <ProjectCardImagePanel project={project} />
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
