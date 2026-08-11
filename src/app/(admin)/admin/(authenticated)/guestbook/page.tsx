import GuestbookListClient from '@/features/admin/guestbook/components/GuestbookListClient';
import { fetchAdminGuestbooks } from '@/features/admin/guestbook/services/guestbook.service';
import { adminGuestbookQuerySchema } from '@/features/admin/guestbook/types';

interface AdminGuestbookPageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

const AdminGuestbookPage = async (props: AdminGuestbookPageProps) => {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const search = searchParams?.search || '';

  const query = adminGuestbookQuerySchema.parse({ page, search });

  const response = await fetchAdminGuestbooks(query);

  if (!response) {
    return <div>방명록 데이터를 불러오는 데 실패했습니다.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-admin-text text-3xl font-bold tracking-tight">Guestbook 관리</h1>
        <p className="text-admin-muted mt-2">서비스에 작성된 방명록들을 관리합니다.</p>
      </div>
      <GuestbookListClient initialResponse={response} />
    </div>
  );
};

export default AdminGuestbookPage;
