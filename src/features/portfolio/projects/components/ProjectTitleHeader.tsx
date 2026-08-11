import { cn } from '@/lib/utils';

import { PROJECT_STATUS, StatusType } from '../type';

interface ProjectTitleHeaderProps {
  title: string;
  status: StatusType;
}

const ProjectTitleHeader = ({ title, status }: ProjectTitleHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <h3 className="text-brand-primary text-4xl leading-none font-extrabold tracking-tight">
        {title}
      </h3>
      <span
        className={cn(
          'text-brand-neutral-light shrink-0 self-center rounded-full px-2.5 py-1 font-mono text-[11px]',
          status.value === PROJECT_STATUS.LIVE.value
            ? 'bg-green-500'
            : status.value === PROJECT_STATUS.IN_PROGRESS.value
              ? 'bg-amber-500'
              : 'bg-brand-secondary',
        )}
      >
        {status.label}
      </span>
    </div>
  );
};

export default ProjectTitleHeader;
