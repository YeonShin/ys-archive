import { useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { deleteProjectAction } from '../actions/projects.action';
import { Project } from '../types';

export const useProjectItem = (project: Project) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    if (confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
      startTransition(async () => {
        const result = await deleteProjectAction(null, project.id);
        if (result.success) {
          router.push('/admin/projects');
          router.refresh();
        } else {
          toast.error('삭제에 실패했습니다: ' + result.message);
        }
      });
    }
  };

  return {
    isEditing,
    setIsEditing,
    isPending,
    handleDelete,
  };
};
