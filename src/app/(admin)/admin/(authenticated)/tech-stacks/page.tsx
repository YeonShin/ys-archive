import TechStacksListClient from '@/features/admin/tech-stacks/components/TechStacksListClient';
import { getTechStacks } from '@/features/admin/tech-stacks/services/techStacks.service';

export const metadata = {
  title: '기술 스택 관리 - Admin',
};

const AdminTechStacksPage = async () => {
  const result = await getTechStacks();

  if (!result.success) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-destructive">데이터를 불러오는데 실패했습니다.</p>
        <p className="text-muted-foreground text-sm">{result.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-admin-text text-3xl font-bold tracking-tight">Tech Stacks 관리</h1>
        <p className="text-admin-muted mt-2">포트폴리오에 노출될 기술 스택들을 관리합니다.</p>
      </div>
      <TechStacksListClient initialData={result.data || []} />
    </div>
  );
};

export default AdminTechStacksPage;
