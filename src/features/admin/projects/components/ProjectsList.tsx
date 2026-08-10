import Image from 'next/image';
import Link from 'next/link';

import { ProjectListItem } from '../types';

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

interface ProjectsListProps {
  projects: ProjectListItem[];
}

const ProjectsList = ({ projects }: ProjectsListProps) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="border-admin-border bg-admin-card text-admin-muted flex h-40 items-center justify-center rounded-lg border border-dashed">
        등록된 프로젝트가 없습니다. 우측 상단의 버튼을 눌러 새 프로젝트를 추가해보세요.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Link
          href={`/admin/projects/${project.id}`}
          key={project.id}
          className="group border-admin-border bg-admin-card hover:border-admin-primary/50 dark:hover:shadow-admin-primary/10 cursor-pointer overflow-hidden rounded-xl border transition-all hover:shadow-md"
        >
          {project.thumbnail_url && (
            <div className="bg-admin-muted/20 relative aspect-3/4 h-48 w-full overflow-hidden">
              <Image
                fill
                src={project.thumbnail_url}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-admin-text group-hover:text-admin-primary text-xl leading-none font-semibold tracking-tight transition-colors">
                {project.title}
              </h3>
              {project.status && PROJECT_STATUS_CONFIG[project.status] && (
                <div
                  className={`focus:ring-ring inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${PROJECT_STATUS_CONFIG[project.status].className}`}
                >
                  {PROJECT_STATUS_CONFIG[project.status].label}
                </div>
              )}
            </div>
            <p className="text-admin-muted line-clamp-2 text-sm">{project.subtitle}</p>
          </div>
          <div className="p-6 pt-0">
            <div className="flex items-center justify-between text-sm">
              <span className="text-admin-text/80 font-medium">{project.role}</span>
              <span className="text-admin-muted/60">{project.started_at} ~</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProjectsList;
