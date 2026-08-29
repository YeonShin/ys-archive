import Image from 'next/image';

import { ArrowUpRight } from 'lucide-react';

import { ProjectLinkIcon } from '@/components/common/ProjectLinkIcon';
import { cn } from '@/lib/utils';

import { Project } from '../../types';

const PROJECT_STATUS_CONFIG = {
  IN_PROGRESS: {
    label: '진행 중',
    className: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
  },
  LIVE: {
    label: '서비스 중',
    className: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  },
  COMPLETED: {
    label: '완료',
    className: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20',
  },
} as const;

interface ProjectItemBasicInfoProps {
  project: Project;
}

export const ProjectItemBasicInfo = ({ project }: ProjectItemBasicInfoProps) => {
  return (
    <>
      {project.thumbnail_url && (
        <div className="bg-admin-muted/20 relative h-128 w-full">
          <Image fill src={project.thumbnail_url} alt={project.title} className="object-cover" />
        </div>
      )}
      <div className="flex flex-col space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-admin-text text-3xl leading-none font-semibold tracking-tight">
              {project.title}
            </h3>
            <p className="text-admin-muted mt-2 text-lg">{project.subtitle}</p>
          </div>
          <div className="flex gap-2">
            {project.status && PROJECT_STATUS_CONFIG[project.status] && (
              <div
                className={cn(
                  'focus:ring-ring inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none',
                  PROJECT_STATUS_CONFIG[project.status].className,
                )}
              >
                {PROJECT_STATUS_CONFIG[project.status].label}
              </div>
            )}
            <div className="bg-admin-muted/10 text-admin-muted inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold">
              우선순위: {project.priority}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-admin-muted/80 flex gap-4 text-sm">
            <span>{project.role}</span>
            <span>•</span>
            <span>
              {project.started_at} ~ {project.ended_at || '현재'}
            </span>
          </div>
          {Array.isArray(project.links) && project.links.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-1">
              {project.links.map((link) => (
                <a
                  key={`${link.label}-${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.label} 바로가기`}
                  className="text-admin-muted group/link focus-visible:ring-admin-primary hover:text-admin-text flex items-center gap-1.5 rounded-sm text-sm outline-none focus-visible:ring-2"
                >
                  <ProjectLinkIcon
                    label={link.label}
                    url={link.url}
                    className="text-admin-primary"
                  />
                  <span className="underline-offset-2 group-hover/link:underline">
                    {link.label}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="text-admin-primary h-3.5 w-3.5 opacity-0 transition-opacity duration-150 group-hover/link:opacity-100"
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
