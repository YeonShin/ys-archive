'use client';

import { useProjectItem } from '../hooks/useProjectItem';
import { Project } from '../types';
import ProjectForm from './ProjectForm';
import { ProjectItemBasicInfo } from './item/ProjectItemBasicInfo';
import { ProjectItemContent } from './item/ProjectItemContent';
import { ProjectItemToolbar } from './item/ProjectItemToolbar';

interface ProjectItemProps {
  project: Project;
}

const ProjectItem = ({ project }: ProjectItemProps) => {
  const { isEditing, setIsEditing, isPending, handleDelete } = useProjectItem(project);

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-admin-text text-3xl font-bold tracking-tight">프로젝트 수정</h1>
          <p className="text-admin-muted mt-2">프로젝트의 상세 정보를 수정합니다.</p>
        </div>
        <div className="mt-8">
          <ProjectForm initialData={project} onCancel={() => setIsEditing(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 툴바 */}
      <ProjectItemToolbar
        isPending={isPending}
        onEdit={() => setIsEditing(true)}
        onDelete={handleDelete}
      />

      <div className="border-admin-border bg-admin-card text-admin-text overflow-hidden rounded-xl border shadow-sm">
        <ProjectItemBasicInfo project={project} />
        <ProjectItemContent project={project} />
      </div>
    </div>
  );
};

export default ProjectItem;
