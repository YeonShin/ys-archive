import type { Metadata } from 'next';
import Link from 'next/link';

import AdminLoginForm from '@/features/admin/auth/components/AdminLoginForm';

export const metadata: Metadata = {
  title: 'Admin Login | YS_Archive',
  description: 'Login to access the admin dashboard',
};

const AdminLoginPage = () => {
  return (
    <div className="bg-admin-bg flex min-h-screen flex-col items-center justify-center">
      <AdminLoginForm />
      <div className="mt-8">
        <Link
          href="/"
          className="text-admin-muted hover:text-admin-text flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <span>←</span> 포트폴리오로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default AdminLoginPage;
