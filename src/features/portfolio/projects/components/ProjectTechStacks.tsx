import { cn } from '@/lib/utils';

import { ProjectTechStack } from '../type';

interface ProjecTechStacksProps {
  techStacks?: ProjectTechStack[];
}

const ProjectTechStacks = ({ techStacks }: ProjecTechStacksProps) => {
  return (
    <div className="flex flex-1 flex-wrap justify-start gap-1.5 md:flex-initial">
      {techStacks?.map((tech) => (
        <span
          key={tech.name}
          className={cn(
            'bg-brand-neutral-dark text-brand-neutral-muted rounded-lg px-2 py-1.5 font-mono text-xs transition-all duration-300',
          )}
        >
          {tech.name}
        </span>
      ))}
    </div>
  );
};

export default ProjectTechStacks;
