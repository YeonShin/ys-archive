'use client';

import { useState } from 'react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { ProjectTechStack } from '../type';

interface ProjecTechStacksProps {
  techStacks?: ProjectTechStack[];
  isReasonVisible?: boolean;
}

const TechTooltipItem = ({ tech }: { tech: ProjectTechStack }) => {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="bg-brand-neutral-dark text-brand-neutral-muted hover:bg-brand-primary focus-visible:ring-brand-primary cursor-help rounded-lg px-2 py-1.5 font-mono text-xs transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {tech.name}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="start"
        className="bg-brand-neutral-dark fill-brand-neutral-dark flex flex-col items-center font-mono transition-all duration-300"
      >
        <p className="text-brand-neutral-light font-bold">{tech.reason}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const ProjectTechStacks = ({ techStacks, isReasonVisible = false }: ProjecTechStacksProps) => {
  return (
    <TooltipProvider delayDuration={100}>
      <ul className="flex flex-1 flex-wrap justify-start gap-1.5 md:flex-initial">
        {techStacks?.map((tech) => {
          if (!isReasonVisible) {
            return (
              <li key={tech.name}>
                <span className="bg-brand-neutral-dark text-brand-neutral-muted rounded-lg px-2 py-1.5 font-mono text-xs transition-all duration-300">
                  {tech.name}
                </span>
              </li>
            );
          }

          return (
            <li key={tech.name}>
              <TechTooltipItem tech={tech} />
            </li>
          );
        })}
      </ul>
    </TooltipProvider>
  );
};

export default ProjectTechStacks;
