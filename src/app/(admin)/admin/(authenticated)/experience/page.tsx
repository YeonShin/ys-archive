import ExperienceManager from '@/features/admin/experiences/components/ExperienceManager';
import { getExperiencesData } from '@/features/admin/experiences/services/experiences.service';
import { ExperienceItem } from '@/features/portfolio/experiences/types';

interface ExperienceResponseData {
  id: string;
  title: string;
  organization: string;
  description: string | null;
  tech_stacks: string[] | null;
  details: string[] | null;
  started_at: string;
  ended_at: string | null;
}

const AdminExperiencePage = async () => {
  const response = await getExperiencesData();

  if (!response?.success) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-500">
        데이터를 불러오는 데 실패했습니다. ({response?.message})
      </div>
    );
  }

  // 서비스 로직에서 실패가 아니면 response.data는 항상 배열이 보장됩니다.
  const initialData: ExperienceItem[] = (response.data || []).map(
    (item: ExperienceResponseData) => ({
      id: item.id,
      title: item.title,
      organization: item.organization,
      description: item.description ?? undefined,
      techStacks: item.tech_stacks ?? undefined,
      details: item.details ?? undefined,
      startedAt: item.started_at,
      endedAt: item.ended_at,
    }),
  );
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-admin-text text-3xl font-bold tracking-tight">Experience 관리</h1>
        <p className="text-admin-muted mt-2">포트폴리오에 노출될 경력 및 학력 정보를 관리합니다.</p>
      </div>

      <div className="mt-8">
        <ExperienceManager initialData={initialData} />
      </div>
    </div>
  );
};

export default AdminExperiencePage;
