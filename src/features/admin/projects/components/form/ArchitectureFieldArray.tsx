'use client';

import { Control, Controller, useFieldArray } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ProjectFormData } from '../../types';
import { ImageUploadInput } from './ImageUploadInput';

interface ArchitectureFieldArrayProps {
  control: Control<ProjectFormData>;
  folderPath: string;
}

export const ArchitectureFieldArray = ({ control, folderPath }: ArchitectureFieldArrayProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'architecture',
  });

  return (
    <div className="border-admin-border bg-admin-card rounded-lg border p-4">
      <div className="border-admin-border mb-3 flex items-center justify-between border-b pb-2">
        <Label className="text-admin-text mb-1 block text-sm font-bold">아키텍처</Label>
        <Button
          variant="link"
          type="button"
          onClick={() => append({ name: '', url: '', caption: '' })}
          className="flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
        >
          + 아키텍처 추가
        </Button>
      </div>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border-admin-border bg-admin-muted/5 flex flex-col gap-2 rounded-md border p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <Label className="text-admin-text font-semibold">아키텍처 #{index + 1}</Label>
              <Button variant="destructive" size="sm" type="button" onClick={() => remove(index)}>
                삭제
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <Label className="text-admin-muted mb-1 block text-xs">아키텍처 이미지</Label>
                <Controller
                  name={`architecture.${index}.url` as const}
                  control={control}
                  render={({ field }) => (
                    <ImageUploadInput
                      value={field.value}
                      onChange={field.onChange}
                      folderPath={folderPath}
                    />
                  )}
                />
              </div>
              <div>
                <Label className="text-admin-muted mb-1 block text-xs">이름</Label>
                <Input
                  {...control.register(`architecture.${index}.name` as const)}
                  className="bg-admin-card border-admin-border"
                  placeholder="예: 서비스 아키텍처"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-admin-muted mb-1 block text-xs">설명 (Caption)</Label>
                <Input
                  {...control.register(`architecture.${index}.caption` as const)}
                  className="bg-admin-card border-admin-border"
                  placeholder="이미지에 대한 간단한 설명"
                />
              </div>
            </div>
          </div>
        ))}
        {fields.length === 0 && (
          <p className="text-sm text-gray-500 italic">등록된 아키텍처가 없습니다.</p>
        )}
      </div>
    </div>
  );
};
