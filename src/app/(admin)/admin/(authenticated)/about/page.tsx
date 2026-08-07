import AboutForm from '@/features/admin/about/components/AboutForm';
import { getAboutData } from '@/features/admin/about/services/about.service';

const AdminAboutPage = async () => {
  const response = await getAboutData();

  if (!response.success || !response.data) {
    return <div>데이터를 불러오는 데 실패했습니다.</div>;
  }

  const initialData = {
    portfolioContent: response.data.portfolioContent || {
      developer_role: '',
      hero_title: '',
      hero_description: '',
      about_text: '',
      profile_image_url: null,
      resume_url: null,
    },
    contacts: response.data.contacts,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-admin-text text-3xl font-bold tracking-tight">About 관리</h1>
        <p className="text-admin-muted mt-2">
          포트폴리오의 메인 인트로, 프로필 정보, 연락처 링크를 관리합니다.
        </p>
      </div>

      <div className="mt-8">
        <AboutForm initialData={initialData} />
      </div>
    </div>
  );
};

export default AdminAboutPage;
