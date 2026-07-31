'use client';

import { Variants } from 'motion';
import { motion } from 'motion/react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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
    <Sheet>
      <motion.div
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
      </motion.div>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full overflow-y-auto border-none data-[side=right]:sm:max-w-2xl"
      ></SheetContent>
    </Sheet>
  );
};

export default ProjectCard;
