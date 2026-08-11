import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createTechStackAction, updateTechStackAction } from '../actions/techStacks.action';
import { TechStack, TechStackFormData, techStackFormSchema } from '../types';

export const useTechStackForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TechStack | undefined>(undefined);

  const form = useForm<TechStackFormData>({
    resolver: zodResolver(techStackFormSchema),
    defaultValues: {
      name: '',
      icon: '',
      type: 'FRONTEND',
      level: null,
      color: '',
    },
  });

  const openForm = (item?: TechStack) => {
    setEditingItem(item);
    if (item) {
      form.reset({
        id: item.id,
        name: item.name,
        icon: item.icon,
        type: item.type,
        level: item.level,
        color: item.color || '',
      });
    } else {
      form.reset({
        name: '',
        icon: '',
        type: 'FRONTEND',
        level: null,
        color: '',
      });
    }
    setIsOpen(true);
  };

  const closeForm = () => {
    setIsOpen(false);
    setEditingItem(undefined);
    form.reset();
  };

  const onSubmit = async (data: TechStackFormData) => {
    try {
      if (editingItem) {
        // 수정 모드
        const result = await updateTechStackAction(null, editingItem.id, {
          name: data.name,
          icon: data.icon,
          type: data.type,
          level: data.level ?? null,
          color: data.color || null,
        });

        if (result.success) {
          toast.success('기술 스택이 성공적으로 수정되었습니다.');
          closeForm();
        } else {
          toast.error(result.message || '수정에 실패했습니다.');
        }
      } else {
        // 추가 모드
        const result = await createTechStackAction(null, {
          name: data.name,
          icon: data.icon,
          type: data.type,
          level: data.level ?? null,
          color: data.color || null,
        });

        if (result.success) {
          toast.success('기술 스택이 성공적으로 추가되었습니다.');
          closeForm();
        } else {
          toast.error(result.message || '추가에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('[useTechStackForm.onSubmit] 폼 제출 중 에러:', error);
      toast.error('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return {
    isOpen,
    editingItem,
    openForm,
    closeForm,
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
  };
};
