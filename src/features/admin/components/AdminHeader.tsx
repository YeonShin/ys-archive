'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { logoutAdminAction } from '@/features/admin/auth/actions/auth.action';
import UpdatePasswordDialog from '@/features/admin/auth/components/UpdatePasswordDialog';

const AdminHeader = () => {
  const router = useRouter();
  const [isUpdatePasswordOpen, setIsUpdatePasswordOpen] = useState(false);

  const handleLogout = async () => {
    const result = await logoutAdminAction();
    if (result.success) {
      router.push('/admin/login');
    }
  };

  return (
    <header className="bg-admin-card border-admin-border sticky top-0 z-50 flex h-16 items-center justify-between border-b px-6">
      <div className="text-admin-text text-md flex items-center gap-2 font-semibold">
        <div className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg shadow-[0_0_15px_rgba(250,250,250,0.1)]">
          <Image src="/logo.png" alt="YS Portfolio Logo" fill className="object-cover" />
        </div>
        Portfolio CMS
      </div>

      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" className="hover:bg-admin-text">
            포트폴리오로 이동
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="hover:bg-admin-text"
          onClick={() => setIsUpdatePasswordOpen(true)}
        >
          비밀번호 변경
        </Button>
        <Button variant="secondary" className="hover:bg-admin-muted" onClick={handleLogout}>
          로그아웃
        </Button>
      </div>

      <UpdatePasswordDialog
        isOpen={isUpdatePasswordOpen}
        onClose={() => setIsUpdatePasswordOpen(false)}
      />
    </header>
  );
};

export default AdminHeader;
