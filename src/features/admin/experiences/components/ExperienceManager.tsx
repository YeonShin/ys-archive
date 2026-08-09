'use client';

import { useState, useTransition } from 'react';

import { toast } from 'sonner';

import { ExperienceItem } from '@/features/portfolio/experiences/types';

import { createExperienceAction, updateExperienceAction } from '../actions/experiences.action';
import { useExperienceForm } from '../hooks/useExperienceForm';
import { ExperienceFormData } from '../types';
import ExperienceForm from './ExperienceForm';
import ExperienceList from './ExperienceList';

interface ExperienceManagerProps {
  initialData: ExperienceItem[];
}

type ViewState = 'LIST' | 'FORM';

const ExperienceManager = ({ initialData }: ExperienceManagerProps) => {
  const [view, setView] = useState<ViewState>('LIST');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const {
    form,
    techStacks,
    appendTechStack,
    removeTechStack,
    details,
    appendDetail,
    removeDetail,
    isCurrent,
    resetFormToInitial,
    resetFormWithItem,
  } = useExperienceForm();

  const onSubmit = async (data: ExperienceFormData) => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));

    startTransition(async () => {
      if (editingId) {
        formData.append('id', editingId);
        const result = await updateExperienceAction(null, formData);
        if (result.success) {
          setView('LIST');
          toast.success('성공적으로 수정되었습니다');
        } else {
          toast.error(result.message);
        }
      } else {
        const result = await createExperienceAction(null, formData);
        if (result.success) {
          setView('LIST');
          toast.success('성공적으로 생성되었습니다');
        } else {
          toast.error(result.message);
        }
      }
    });
  };

  return (
    <div className="space-y-12">
      {view === 'LIST' && (
        <ExperienceList
          initialData={initialData}
          resetFormToInitial={resetFormToInitial}
          setEditingId={setEditingId}
          setView={setView}
          resetFormWithItem={resetFormWithItem}
        />
      )}

      {view === 'FORM' && (
        <ExperienceForm
          editingId={editingId}
          form={form}
          onSubmit={onSubmit}
          isPending={isPending}
          isCurrent={isCurrent}
          techStacks={techStacks}
          appendTechStack={appendTechStack}
          removeTechStack={removeTechStack}
          details={details}
          appendDetail={appendDetail}
          removeDetail={removeDetail}
          setView={setView}
        />
      )}
    </div>
  );
};

export default ExperienceManager;
