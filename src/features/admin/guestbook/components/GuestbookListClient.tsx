'use client';

import { useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Search } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { deleteAdminGuestbookAction } from '../actions/guestbook.action';
import { AdminGuestbookResponse } from '../types';
import AdminGuestbookPagination from './AdminGuestbookPagination';
import GuestbookItem from './GuestbookItem';

interface GuestbookListClientProps {
  initialResponse: AdminGuestbookResponse;
}

const GuestbookListClient = ({ initialResponse }: GuestbookListClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // 검색 시 1페이지로
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말로 이 방명록을 강제 삭제하시겠습니까?')) {
      return;
    }

    try {
      const result = await deleteAdminGuestbookAction(null, id);
      if (result.success) {
        toast.success('방명록이 삭제되었습니다.');
      } else {
        toast.error(result.message || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('[GuestbookListClient.handleDelete] Error:', error);
      toast.error('오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSearch} className="flex w-full max-w-sm gap-2">
        <Input
          className="bg-admin-card border-admin-border"
          placeholder="작성자명 또는 내용 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit" variant="secondary">
          <Search className="mr-1 h-4 w-4" />
          검색
        </Button>
      </form>

      <div className="flex flex-col gap-4">
        {initialResponse.data.length === 0 ? (
          <div className="text-muted-foreground rounded-lg border border-dashed py-10 text-center">
            방명록이 없습니다.
          </div>
        ) : (
          initialResponse.data.map((item) => (
            <GuestbookItem key={item.id} item={item} onDelete={handleDelete} />
          ))
        )}
      </div>

      <AdminGuestbookPagination
        totalPages={initialResponse.totalPages}
        currentPage={initialResponse.currentPage}
      />
    </div>
  );
};

export default GuestbookListClient;
