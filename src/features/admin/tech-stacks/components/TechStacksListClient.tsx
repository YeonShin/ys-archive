'use client';

import { useMemo } from 'react';

import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { deleteTechStackAction } from '../actions/techStacks.action';
import { TechStack, techTypeEnum } from '../types';
import TechStackForm from './TechStackForm';
import TechStackItem from './TechStackItem';
import { useTechStackForm } from './useTechStackForm';

interface TechStacksListClientProps {
  initialData: TechStack[];
}

const CATEGORIES = techTypeEnum.options;

const TechStacksListClient = ({ initialData }: TechStacksListClientProps) => {
  const formProps = useTechStackForm();
  const { openForm } = formProps;

  const handleDelete = async (id: string) => {
    if (!window.confirm('해당 기술 스택을 정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      const result = await deleteTechStackAction(null, id);
      if (result.success) {
        toast.success('성공적으로 삭제되었습니다.');
      } else {
        toast.error(result.message || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('[TechStacksListClient.handleDelete] 삭제 중 오류 발생:', error);
      toast.error('오류가 발생했습니다.');
    }
  };

  const groupedTechStacks = useMemo(
    () =>
      CATEGORIES.reduce(
        (acc, category) => {
          acc[category] = initialData.filter((tech) => tech.type === category);
          return acc;
        },
        {} as Record<string, TechStack[]>,
      ),
    [initialData],
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => openForm()} className="gap-2">
          <PlusIcon className="h-4 w-4" />
          기술 스택 추가
        </Button>
      </div>

      <div className="flex flex-col gap-10">
        {CATEGORIES.map((category) => {
          const items = groupedTechStacks[category];
          if (items.length === 0) return null;

          return (
            <div key={category} className="flex flex-col gap-4">
              <h2 className="text-xl font-bold tracking-tight">{category}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <TechStackItem
                    key={item.id}
                    item={item}
                    onEdit={openForm}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <TechStackForm {...formProps} />
    </div>
  );
};

export default TechStacksListClient;
