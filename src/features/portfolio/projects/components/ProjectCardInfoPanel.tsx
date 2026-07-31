import { ArrowUpRight, Globe } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

import { calculateDurationInWeeks, formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';

import { PROJECT_STATUS, Project } from '../type';

const ProjectCardInfoPanel = ({ project }: { project: Project }) => {
  return (
    <div className="bg-brand-neutral-light flex h-full w-full flex-col justify-center gap-4 px-5 py-8">
      {/* 부제목 */}
      {project.subtitle && (
        <p className="text-brand-secondary font-mono text-xs tracking-[0.2em] uppercase">
          {project.subtitle}
        </p>
      )}

      {/* 프로젝트 명 + 서비스 유무 */}
      <div className="flex items-center gap-3">
        <h3 className="text-brand-primary text-4xl leading-none font-extrabold tracking-tight">
          {project.title}
        </h3>
        <span
          className={cn(
            'text-brand-neutral-light shrink-0 self-center rounded-full px-2.5 py-1 font-mono text-[11px]',
            project.status === PROJECT_STATUS.LIVE
              ? 'bg-green-500'
              : project.status === PROJECT_STATUS.IN_PROGRESS
                ? 'bg-amber-500'
                : 'bg-brand-secondary',
          )}
        >
          {project.status.label}
        </span>
      </div>

      {/* 개발 기간 + 담당 역할 */}
      <div className="flex flex-col gap-2">
        {/* 개발 기간 */}
        <div className="flex items-baseline gap-3">
          <span className="text-brand-neutral-dark w-14 shrink-0 font-mono text-xs font-bold">
            개발기간
          </span>
          <span className="text-brand-secondary font-mono text-xs">
            {`${formatDate(project.startedAt)} - ${formatDate(project.endedAt)}`}
            {project.endedAt && (
              <span className="text-brand-secondary ml-1">
                ({calculateDurationInWeeks(project.startedAt, project.endedAt)}주)
              </span>
            )}
          </span>
        </div>

        {/* 담당 역할 */}
        <div className="flex items-baseline gap-3">
          <span className="text-brand-neutral-dark w-14 shrink-0 font-mono text-xs font-bold">
            담당역할
          </span>
          <span className="text-brand-secondary font-mono text-xs">{project.role}</span>
        </div>
      </div>

      {/* 서비스 바로가기 */}
      <div className="flex flex-col gap-2">
        {project.links?.service && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} 서비스 바로가기`}
            href={project.links.service}
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

        {project.links?.github && (
          <div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} 깃허브 바로가기`}
              href={project.links.github}
              className="text-brand-secondary group/link focus-visible:ring-brand-primary focus-visible:ring-offset-brand-neutral-light flex w-fit items-center gap-1.5 rounded-sm font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <FaGithub
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-black dark:text-white"
              />
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

      {/* 기술스택 */}
      <div className="flex flex-1 flex-wrap justify-start gap-1.5 md:flex-initial">
        {project.techStacks?.map((tech) => (
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
    </div>
  );
};

export default ProjectCardInfoPanel;
