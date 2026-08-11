'use client';

import { EditIcon, TrashIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { iconMap, normalizeIconName } from '@/lib/iconMap';

import { TechStack } from '../types';

interface TechStackItemProps {
  item: TechStack;
  onEdit: (item: TechStack) => void;
  onDelete: (id: string) => void;
}

const TechStackItem = ({ item, onEdit, onDelete }: TechStackItemProps) => {
  const searchKey = item.icon ? normalizeIconName(item.icon) : normalizeIconName(item.name);
  const IconComponent = iconMap[searchKey];

  return (
    <div className="bg-admin-card hover:bg-admin-muted/30 border-admin-border flex items-center justify-between rounded-xl border p-4 shadow-sm transition-colors">
      <div className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg shadow-sm"
          style={{ backgroundColor: item.color || 'var(--brand-secondary)' }}
        >
          {IconComponent ? (
            <IconComponent className="text-admin-text text-2xl" aria-hidden="true" />
          ) : (
            <span className="font-mono text-lg font-bold text-white" aria-hidden="true">
              {item.icon ? item.icon.substring(0, 2) : item.name.substring(0, 2)}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold">{item.name}</h3>
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <span className="bg-admin-text rounded px-1.5 py-0.5">{item.type}</span>
            {item.level && (
              <span className="bg-admin-text rounded px-1.5 py-0.5">{item.level}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(item)} aria-label="수정">
          <EditIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(item.id)}
          aria-label="삭제"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TechStackItem;
