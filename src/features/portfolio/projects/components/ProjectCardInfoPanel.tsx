import { Project } from '../type';
import ProjectExternalLinks from './ProjectExternalLinks';
import ProjectMetaInfo from './ProjectMetaInfo';
import ProjectSubtitle from './ProjectSubtitle';
import ProjectTechStacks from './ProjectTechStacks';
import ProjectTitleHeader from './ProjectTitleHeader';

const ProjectCardInfoPanel = ({ project }: { project: Project }) => {
  return (
    <div className="bg-brand-neutral-light flex h-full w-full flex-col justify-center gap-4 px-5 py-8">
      {/* 부제목 */}
      {project.subtitle && <ProjectSubtitle subtitle={project.subtitle} />}

      {/* 프로젝트 명 + 서비스 유무 */}
      <ProjectTitleHeader title={project.title} status={project.status} />
      {/* 개발 기간 + 담당 역할 */}
      <ProjectMetaInfo
        startedAt={project.startedAt}
        endedAt={project.endedAt}
        role={project.role}
      />

      {/* 서비스 바로가기 */}
      <ProjectExternalLinks links={project.links} className="flex-col" />

      {/* 기술스택 */}
      <ProjectTechStacks techStacks={project.techStacks} />
    </div>
  );
};

export default ProjectCardInfoPanel;
