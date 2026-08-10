import Image from 'next/image';

import { ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

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
                className={`focus:ring-ring inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${PROJECT_STATUS_CONFIG[project.status].className}`}
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
          {project.links && (
            <div className="flex gap-4">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-admin-primary flex items-center gap-1 text-sm hover:underline"
                >
                  <FaGithub className="h-4 w-4" /> Github
                </a>
              )}
              {project.links.service && (
                <a
                  href={project.links.service}
                  target="_blank"
                  rel="noreferrer"
                  className="text-admin-primary flex items-center gap-1 text-sm hover:underline"
                >
                  <ExternalLink className="h-4 w-4" /> Service URL
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
