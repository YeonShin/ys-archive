'use client';

import { Control, useFieldArray } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { ProjectFormData } from '../../types';

interface TechStackFieldArrayProps {
  control: Control<ProjectFormData>;
}

export const TechStackFieldArray = ({ control }: TechStackFieldArrayProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tech_stacks',
  });

  return (
    <div className="border-admin-border bg-admin-card rounded-lg border p-4">
      <div className="border-admin-border mb-3 flex items-center justify-between border-b pb-2">
        <Label className="text-admin-text mb-1 block text-sm font-bold">기술 스택</Label>
        <Button
          variant="link"
          type="button"
          onClick={() => append({ name: '', reason: '' })}
          className="flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
        >
          + 기술 스택 추가
        </Button>
      </div>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border-admin-border bg-admin-muted/5 flex flex-col gap-2 rounded-md border p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <Label className="text-admin-text font-semibold">기술 스택 #{index + 1}</Label>
              <Button variant="destructive" size="sm" type="button" onClick={() => remove(index)}>
                삭제
              </Button>
            </div>
            <div className="flex flex-col gap-4 md:grid-cols-2">
              <div>
                <Label className="text-admin-muted mb-1 block text-xs">이름</Label>
                <Input
                  {...control.register(`tech_stacks.${index}.name` as const)}
                  className="bg-admin-card border-admin-border"
                  placeholder="예: React"
                />
              </div>
              <div>
                <Label className="text-admin-muted mb-1 block text-xs font-bold">선정 이유</Label>
                <Textarea
                  {...control.register(`tech_stacks.${index}.reason` as const)}
                  className="bg-admin-card border-admin-border resize-y break-all"
                  rows={2}
                  placeholder="예: 풍부한 생태계와 안정적인 렌더링 성능"
                />
              </div>
            </div>
          </div>
        ))}
        {fields.length === 0 && (
          <p className="text-sm text-gray-500 italic">등록된 기술 스택이 없습니다.</p>
        )}
      </div>
    </div>
  );
};
