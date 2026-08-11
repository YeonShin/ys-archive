import { useState, useTransition } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExperienceItem } from '@/features/portfolio/experiences/types';

import { deleteExperienceAction } from '../actions/experiences.action';

interface ExperienceListProps {
  initialData: ExperienceItem[];
  resetFormToInitial: () => void;
  setEditingId: (id: string | null) => void;
  setView: (view: 'LIST' | 'FORM') => void;
  resetFormWithItem: (item: ExperienceItem) => void;
}

const ExperienceList = ({
  initialData,
  resetFormToInitial,
  setEditingId,
  setView,
  resetFormWithItem,
}: ExperienceListProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAddClick = () => {
    resetFormToInitial();
    setEditingId(null);
    setView('FORM');
  };

  const handleEditClick = (item: ExperienceItem) => {
    resetFormWithItem(item);
    setEditingId(item.id);
    setView('FORM');
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    const formData = new FormData();
    formData.append('id', deleteId);

    startTransition(async () => {
      const result = await deleteExperienceAction(null, formData);
      if (result.success) {
        setDeleteId(null);
        toast.success('성공적으로 삭제되었습니다');
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="bg-admin-card border-admin-border space-y-6 rounded-lg border p-6 shadow-sm">
      <div className="border-admin-border mb-6 flex items-center justify-end border-b pb-4">
        <Button variant="secondary" onClick={handleAddClick}>
          항목 추가
        </Button>
      </div>

      <ul className="space-y-4">
        {initialData.length === 0 && (
          <div className="text-admin-muted py-10 text-center">등록된 항목이 없습니다.</div>
        )}
        {initialData.map((item: ExperienceItem) => (
          <li
            key={item.id}
            className="bg-admin-card border-admin-border flex flex-col justify-between gap-4 rounded-lg border p-5 shadow-sm sm:flex-row"
          >
            <div>
              <h3 className="text-admin-text text-xl font-bold">{item.title}</h3>
              <p className="text-admin-muted mt-1 font-medium">{item.organization}</p>
              <p className="text-admin-muted mt-1 text-sm">
                {item.startedAt} ~ {item.endedAt === null ? '현재 진행중' : item.endedAt}
              </p>
              {item.description && <p className="text-admin-text mt-3">{item.description}</p>}
            </div>
            <div className="flex shrink-0 gap-2 sm:flex-col">
              <Button variant="secondary" onClick={() => handleEditClick(item)}>
                수정
              </Button>
              <Button variant="destructive" onClick={() => setDeleteId(item.id)}>
                삭제
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent showCloseButton={false} className="max-w-sm">
          <DialogHeader className="gap-2">
            <DialogTitle className="text-admin-bg">정말 삭제하시겠습니까?</DialogTitle>
            <DialogDescription className="text-admin-border/70">
              이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isPending}>
              {isPending ? '삭제 중...' : '확인'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExperienceList;
