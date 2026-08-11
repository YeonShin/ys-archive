'use client';

import { Control, useFieldArray } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { ProjectFormData } from '../../types';

interface KeyFeatureFieldArrayProps {
  control: Control<ProjectFormData>;
}

const NestedKeyFeatureDesc = ({
  control,
  index,
}: {
  control: Control<ProjectFormData>;
  index: number;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `key_features.${index}.desc` as const,
  });

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-admin-muted block text-xs font-bold">상세 설명</Label>
        <Button
          variant="link"
          size="sm"
          type="button"
          onClick={() => append({ value: '' })}
          className="h-auto p-0 text-xs font-semibold text-blue-600"
        >
          + 설명 추가
        </Button>
      </div>
      {fields.map((field, descIndex) => (
        <div key={field.id} className="flex gap-2">
          <Textarea
            {...control.register(`key_features.${index}.desc.${descIndex}.value` as const)}
            className="bg-admin-card border-admin-border resize-y overflow-hidden text-sm break-all"
            placeholder="기능 상세 설명"
          />
          <Button
            variant="destructive"
            size="sm"
            type="button"
            onClick={() => remove(descIndex)}
            className="h-8 rounded-md px-2 py-1 text-xs whitespace-nowrap"
          >
            삭제
          </Button>
        </div>
      ))}
    </div>
  );
};

export const KeyFeatureFieldArray = ({ control }: KeyFeatureFieldArrayProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'key_features',
  });

  return (
    <div className="border-admin-border bg-admin-card rounded-lg border p-4">
      <div className="border-admin-border mb-3 flex items-center justify-between border-b pb-2">
        <Label className="text-admin-text mb-1 block text-sm font-bold">주요 기능</Label>
        <Button
          variant="link"
          type="button"
          onClick={() => append({ title: '', desc: [{ value: '' }] })}
          className="flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
        >
          + 기능 추가
        </Button>
      </div>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border-admin-border bg-admin-muted/5 flex flex-col gap-2 rounded-md border p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <Label className="text-admin-text font-semibold">주요 기능 #{index + 1}</Label>
              <Button variant="destructive" size="sm" type="button" onClick={() => remove(index)}>
                기능 전체 삭제
              </Button>
            </div>
            <div>
              <Label className="text-admin-muted mb-1 block text-xs font-bold">기능 제목</Label>
              <Input
                {...control.register(`key_features.${index}.title` as const)}
                className="bg-admin-card border-admin-border font-semibold"
                placeholder="예: 소셜 로그인 연동"
              />
            </div>

            <NestedKeyFeatureDesc control={control} index={index} />
          </div>
        ))}
        {fields.length === 0 && (
          <p className="text-sm text-gray-500 italic">등록된 주요 기능이 없습니다.</p>
        )}
      </div>
    </div>
  );
};
