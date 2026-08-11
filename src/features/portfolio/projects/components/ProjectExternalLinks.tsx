import { ArrowUpRight, Globe } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

import { cn } from '@/lib/utils';

import { ProjectLinks } from '../type';

interface ProjectExternalLinksProps {
  links?: ProjectLinks;
  className?: string;
}

const ProjectExternalLinks = ({ links, className }: ProjectExternalLinksProps) => {
  return (
    <div className={cn('flex gap-2', className)}>
      {links?.service && (
        <a
          target="_blank"
          rel="noopener noreferrer"
          aria-label="서비스 바로가기"
          href={links.service}
          className="text-brand-secondary group/link focus-visible:ring-brand-primary focus-visible:ring-offset-brand-neutral-light flex w-fit items-center gap-1.5 rounded-sm font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <Globe aria-hidden="true" className="text-brand-primary h-4 w-4 shrink-0" />
          <span className="group-hover/link:text-brand-primary underline-offset-2 transition-colors duration-150 group-hover/link:underline">
            서비스 바로가기
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="text-brand-primary h-3.5 w-3.5 opacity-0 transition-opacity duration-150 group-hover/link:opacity-100"
          />
        </a>
      )}

      {links?.github && (
        <div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            aria-label="깃허브 바로가기"
            href={links.github}
            className="text-brand-secondary group/link focus-visible:ring-brand-primary focus-visible:ring-offset-brand-neutral-light flex w-fit items-center gap-1.5 rounded-sm font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <FaGithub aria-hidden="true" className="h-4 w-4 shrink-0 text-black dark:text-white" />
            <span className="group-hover/link:text-brand-primary underline-offset-2 transition-colors duration-150 group-hover/link:underline">
              Github
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="text-brand-primary h-3.5 w-3.5 opacity-0 transition-opacity duration-150 group-hover/link:opacity-100"
            />
          </a>
        </div>
      )}
    </div>
  );
};

export default ProjectExternalLinks;
