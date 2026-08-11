'use client';

import { useState } from 'react';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { ProjectListItem } from '../types';
import ProjectForm from './ProjectForm';
import ProjectsList from './ProjectsList';

interface ProjectsListClientProps {
  initialProjects: ProjectListItem[];
}

const ProjectsListClient = ({ initialProjects }: ProjectsListClientProps) => {
  const [isCreating, setIsCreating] = useState(false);

  if (isCreating) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-admin-text text-3xl font-bold tracking-tight">새 프로젝트 생성</h1>
          <p className="text-admin-muted mt-2">새로운 프로젝트 정보를 입력해주세요.</p>
        </div>
        <div className="mt-8">
          <ProjectForm onCancel={() => setIsCreating(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-admin-text text-3xl font-bold tracking-tight">Projects 관리</h1>
          <p className="text-admin-muted mt-2">포트폴리오에 노출될 프로젝트 정보를 관리합니다.</p>
        </div>
        <Button variant="secondary" onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="h-4 w-4" />새 프로젝트
        </Button>
      </div>

      <div className="mt-8">
        <ProjectsList projects={initialProjects} />
      </div>
    </div>
  );
};

export default ProjectsListClient;
