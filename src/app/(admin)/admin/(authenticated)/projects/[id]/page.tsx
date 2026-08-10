import { notFound } from 'next/navigation';

import ProjectItem from '@/features/admin/projects/components/ProjectItem';
import { getProjectById } from '@/features/admin/projects/services/projects.service';
import { Project } from '@/features/admin/projects/types';

const ProjectDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const response = await getProjectById(id);

  if (!response?.success || !response.data) {
    return notFound();
  }

  const project = response.data as unknown as Project;

  return (
    <div className="space-y-6">
      <div className="mt-8">
        <ProjectItem project={project} />
      </div>
    </div>
  );
};

export default ProjectDetailPage;
