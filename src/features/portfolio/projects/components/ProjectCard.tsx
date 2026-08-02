'use client';

import { Variants } from 'motion';
import { motion } from 'motion/react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

import { Project } from '../type';
import ProjectCardImagePanel from './ProjectCardImagePanel';
import ProjectCardInfoPanel from './ProjectCardInfoPanel';
import ProjectDetail from './ProjectDetail';

interface ProjectCardProps {
  project: Project;
  isEven: boolean;
  variant: Variants;
}

const ProjectCard = ({ project, isEven, variant }: ProjectCardProps) => {
  return (
    <Sheet>
      <motion.article
        className="flex flex-col overflow-hidden rounded-2xl shadow-xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={variant}
      >
        <div
          className={cn('flex flex-col-reverse', isEven ? 'md:flex-row-reverse' : 'md:flex-row')}
        >
          <div className="flex w-full md:w-2/5">
            <ProjectCardInfoPanel project={project} />
          </div>

          <SheetTrigger asChild>
            <button
              type="button"
              aria-label={`${project.title} 프로젝트 자세히 보기`}
              className="group flex w-full cursor-pointer text-left outline-none md:w-3/5"
            >
              <ProjectCardImagePanel project={project} />
            </button>
          </SheetTrigger>
        </div>
      </motion.article>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="inset-0! h-full! w-full! overflow-y-auto border-none sm:inset-y-0! sm:right-0! sm:left-auto! data-[side=right]:sm:max-w-4xl"
      >
        <ProjectDetail project={project} />
      </SheetContent>
    </Sheet>
  );
};

export default ProjectCard;
