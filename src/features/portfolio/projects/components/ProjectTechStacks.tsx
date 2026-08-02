import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { ProjectTechStack } from '../type';

interface ProjecTechStacksProps {
  techStacks?: ProjectTechStack[];
  isReasonVisible?: boolean;
}

const ProjectTechStacks = ({ techStacks, isReasonVisible = false }: ProjecTechStacksProps) => {
  return (
    <TooltipProvider>
      <div className="flex flex-1 flex-wrap justify-start gap-1.5 md:flex-initial">
        {techStacks?.map((tech) => (
          <Tooltip key={tech.name}>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  'bg-brand-neutral-dark text-brand-neutral-muted rounded-lg px-2 py-1.5 font-mono text-xs transition-all duration-300',
                  isReasonVisible && 'hover:bg-brand-primary',
                )}
              >
                {tech.name}
              </span>
            </TooltipTrigger>
            {isReasonVisible && (
              <TooltipContent
                side="top"
                align="start"
                className="bg-brand-neutral-dark fill-brand-neutral-dark flex flex-col items-center font-mono transition-all duration-300"
              >
                <p className="text-brand-neutral-light font-bold">{tech.reason}</p>
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default ProjectTechStacks;
