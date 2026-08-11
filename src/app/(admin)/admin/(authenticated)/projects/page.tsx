import ProjectsListClient from '@/features/admin/projects/components/ProjectsListClient';
import { getProjectsList } from '@/features/admin/projects/services/projects.service';
import { ProjectListItem } from '@/features/admin/projects/types';

const AdminProjectsPage = async () => {
  const response = await getProjectsList();

  if (!response?.success) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-500">
        데이터를 불러오는 데 실패했습니다. ({response?.message})
      </div>
    );
  }

  const initialProjects = (response.data || []) as ProjectListItem[];

  return <ProjectsListClient initialProjects={initialProjects} />;
};

export default AdminProjectsPage;
