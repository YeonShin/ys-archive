'use client';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { TechStack } from '../types';
import TechStackForm from './TechStackForm';
import TechStackItem from './TechStackItem';
import { useTechStackForm } from './useTechStackForm';

interface TechStacksListClientProps {
  initialData: TechStack[];
}

const TechStacksListClient = ({ initialData }: TechStacksListClientProps) => {
  const { isOpen, editingItem, openForm, closeForm } = useTechStackForm();

  const handleDelete = async (id: string) => {
    // TODO: 삭제 확인 모달 연동 및 실제 삭제 로직 연동 (Green 단계)
    // 알림은 alert() 대신 toast를 사용합니다.
    toast.success('성공적으로 삭제되었습니다.');
  };

  return (
    <div>
      <Button onClick={() => openForm()}>Add</Button>

      <div>
        {initialData.map((item) => (
          <TechStackItem key={item.id} item={item} onEdit={openForm} onDelete={handleDelete} />
        ))}
      </div>

      <TechStackForm isOpen={isOpen} techStack={editingItem} onClose={closeForm} />
    </div>
  );
};

export default TechStacksListClient;
