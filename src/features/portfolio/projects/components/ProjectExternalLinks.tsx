import { ArrowUpRight } from 'lucide-react';

import { ProjectLinkIcon } from '@/components/common/ProjectLinkIcon';
import { cn } from '@/lib/utils';

import { ProjectLink } from '../type';

interface ProjectExternalLinksProps {
  links?: ProjectLink[];
  className?: string;
}

const ProjectExternalLinks = ({ links, className }: ProjectExternalLinksProps) => {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-2.5', className)}>
      {links.map((link) => (
        <a
          key={`${link.label}-${link.url}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${link.label} 바로가기`}
          href={link.url}
          className="text-brand-secondary group/link focus-visible:ring-brand-primary focus-visible:ring-offset-brand-neutral-light flex w-fit items-center gap-1.5 rounded-sm font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <ProjectLinkIcon label={link.label} url={link.url} className="text-brand-primary" />
          <span className="group-hover/link:text-brand-primary underline-offset-2 transition-colors duration-150 group-hover/link:underline">
            {link.label}
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="text-brand-primary h-3.5 w-3.5 opacity-0 transition-opacity duration-150 group-hover/link:opacity-100"
          />
        </a>
      ))}
    </div>
  );
};

export default ProjectExternalLinks;
