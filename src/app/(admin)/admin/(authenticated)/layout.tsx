import type { Metadata } from 'next';

import AdminHeader from '@/features/admin/components/AdminHeader';
import AdminSidebar from '@/features/admin/components/AdminSidebar';

export const metadata: Metadata = {
  title: 'YS_Archive Admin',
  description: 'YS_Archive Admin Dashboard',
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-admin-bg text-admin-text flex min-h-screen flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="w-full flex-1 p-12">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
