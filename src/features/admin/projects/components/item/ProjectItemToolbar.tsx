import Link from 'next/link';

import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ProjectItemToolbarProps {
  isPending: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProjectItemToolbar = ({ isPending, onEdit, onDelete }: ProjectItemToolbarProps) => {
  return (
    <div className="flex items-center justify-between">
      <Link href="/admin/projects">
        <Button variant="ghost" className="text-admin-muted hover:text-admin-bg gap-2">
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </Button>
      </Link>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onEdit}
          className="text-admin-text border-admin-text hover:bg-admin-muted/30 gap-2"
        >
          <Edit className="h-4 w-4" />
          수정
        </Button>
        <Button variant="destructive" onClick={onDelete} disabled={isPending} className="gap-2">
          <Trash2 className="h-4 w-4" />
          {isPending ? '삭제 중...' : '삭제'}
        </Button>
      </div>
    </div>
  );
};
