'use client';

import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { TechStack } from '../types';
import TechStackForm from './TechStackForm';
import TechStackItem from './TechStackItem';
import { useTechStackForm } from './useTechStackForm';

interface TechStacksListClientProps {
  initialData: TechStack[];
}

const CATEGORIES = [
  'FRONTEND',
  'BACKEND',
  'DATABASE',
  'INFRA',
  'MOBILE',
  'DEVOPS',
  'AI_ML',
  'TESTING',
];

const TechStacksListClient = ({ initialData }: TechStacksListClientProps) => {
  const { isOpen, editingItem, openForm, closeForm } = useTechStackForm();

  const handleDelete = async (id: string) => {
    // TODO: 삭제 확인 모달 연동 및 실제 삭제 로직 연동 (Green 단계)
    toast.success('성공적으로 삭제되었습니다.');
  };

  const groupedTechStacks = CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = initialData.filter((tech) => tech.type === category);
      return acc;
    },
    {} as Record<string, TechStack[]>,
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

      <TechStackForm isOpen={isOpen} techStack={editingItem} onClose={closeForm} />
    </div>
  );
};

export default TechStacksListClient;
