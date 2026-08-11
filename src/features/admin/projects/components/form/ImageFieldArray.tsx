'use client';

import { Control, Controller, useFieldArray } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { ProjectFormData } from '../../types';
import { ImageUploadInput } from './ImageUploadInput';

interface ImageFieldArrayProps {
  control: Control<ProjectFormData>;
  folderPath: string;
}

export const ImageFieldArray = ({ control, folderPath }: ImageFieldArrayProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  });

  return (
    <div className="border-admin-border bg-admin-card rounded-lg border p-4">
      <div className="border-admin-border mb-3 flex items-center justify-between border-b pb-2">
        <Label className="text-admin-text mb-1 block text-sm font-bold">프로젝트 스크린샷</Label>
        <Button
          variant="link"
          type="button"
          onClick={() => append({ value: '' })}
          className="flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
        >
          + 스크린샷 추가
        </Button>
      </div>
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-4">
            <Controller
              name={`images.${index}.value` as const}
              control={control}
              render={({ field }) => (
                <ImageUploadInput
                  value={field.value}
                  onChange={field.onChange}
                  folderPath={folderPath}
                />
              )}
            />
            <Button
              variant="destructive"
              type="button"
              onClick={() => remove(index)}
              className="rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap"
            >
              삭제
            </Button>
          </div>
        ))}
        {fields.length === 0 && (
          <p className="text-sm text-gray-500 italic">등록된 스크린샷이 없습니다.</p>
        )}
      </div>
    </div>
  );
};
