'use client';

import { Button } from '@/components/ui/button';

import { TechStack } from '../types';

interface TechStackItemProps {
  item: TechStack;
  onEdit: (item: TechStack) => void;
  onDelete: (id: string) => void;
}

const TechStackItem = ({ item, onEdit, onDelete }: TechStackItemProps) => {
  return (
    <div>
      <h3>{item.name}</h3>
      <Button variant="outline" onClick={() => onEdit(item)}>
        Edit
      </Button>
      <Button variant="destructive" onClick={() => onDelete(item.id)}>
        Delete
      </Button>
    </div>
  );
};

export default TechStackItem;
