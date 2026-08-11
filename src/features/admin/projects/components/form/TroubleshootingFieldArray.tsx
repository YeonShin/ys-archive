'use client';

import { Control, Controller, useFieldArray } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { ProjectFormData } from '../../types';
import { ImageUploadInput } from './ImageUploadInput';

interface TroubleshootingFieldArrayProps {
  control: Control<ProjectFormData>;
  folderPath: string;
}

const NestedTroubleshootingImages = ({
  control,
  index,
  folderPath,
}: {
  control: Control<ProjectFormData>;
  index: number;
  folderPath: string;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `troubleshooting.${index}.images` as const,
  });

  return (
    <div className="border-admin-border mt-4 space-y-2 border-t pt-4">
      <div className="flex items-center justify-between">
        <Label className="text-admin-muted block text-xs font-bold">관련 이미지 (선택)</Label>
        <Button
          variant="link"
          size="sm"
          type="button"
          onClick={() => append({ url: '', caption: '' })}
          className="h-auto p-0 text-xs font-semibold text-blue-600"
        >
          + 이미지 추가
        </Button>
      </div>
      {fields.map((field, imgIndex) => (
        <div key={field.id} className="flex flex-col gap-4">
          <div>
            <Controller
              name={`troubleshooting.${index}.images.${imgIndex}.url` as const}
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

          <Input
            {...control.register(`troubleshooting.${index}.images.${imgIndex}.caption` as const)}
            className="bg-admin-card border-admin-border h-8 text-sm"
            placeholder="캡션 (선택)"
          />
          <Button
            variant="destructive"
            size="sm"
            type="button"
            onClick={() => remove(imgIndex)}
            className="h-8 rounded-md px-2 py-1 text-xs whitespace-nowrap"
          >
            삭제
          </Button>
        </div>
      ))}
    </div>
  );
};

export const TroubleshootingFieldArray = ({
  control,
  folderPath,
}: TroubleshootingFieldArrayProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'troubleshooting',
  });

  return (
    <div className="border-admin-border bg-admin-card rounded-lg border p-4">
      <div className="border-admin-border mb-3 flex items-center justify-between border-b pb-2">
        <Label className="text-admin-text mb-1 block text-sm font-bold">트러블슈팅</Label>
        <Button
          variant="link"
          type="button"
          onClick={() =>
            append({ title: '', problem: '', cause: '', process: '', result: '', images: [] })
          }
          className="flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
        >
          + 트러블슈팅 추가
        </Button>
      </div>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border-admin-border bg-admin-muted/5 flex flex-col gap-4 rounded-md border p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <Label className="text-admin-primary text-lg font-bold">
                트러블슈팅 #{index + 1}
              </Label>
              <Button variant="destructive" size="sm" type="button" onClick={() => remove(index)}>
                삭제
              </Button>
            </div>

            <div>
              <Label className="text-admin-muted mb-1 block text-xs font-bold">이슈 제목</Label>
              <Input
                {...control.register(`troubleshooting.${index}.title` as const)}
                className="bg-admin-card border-admin-border font-bold"
                placeholder="핵심 요약"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <Label className="text-admin-muted mb-1 block text-xs font-bold">
                  문제 상황 (Problem)
                </Label>
                <Textarea
                  {...control.register(`troubleshooting.${index}.problem` as const)}
                  className="bg-admin-card border-admin-border resize-y break-all"
                  rows={3}
                  placeholder="발생한 문제 상황"
                />
              </div>
              <div>
                <Label className="text-admin-muted mb-1 block text-xs font-bold">
                  원인 (Cause)
                </Label>
                <Textarea
                  {...control.register(`troubleshooting.${index}.cause` as const)}
                  className="bg-admin-card border-admin-border resize-y break-all"
                  rows={3}
                  placeholder="문제 발생 원인"
                />
              </div>
              <div>
                <Label className="text-admin-muted mb-1 block text-xs font-bold">
                  해결 과정 (Process)
                </Label>
                <Textarea
                  {...control.register(`troubleshooting.${index}.process` as const)}
                  className="bg-admin-card border-admin-border resize-y break-all"
                  rows={3}
                  placeholder="문제 해결 과정"
                />
              </div>
              <div>
                <Label className="text-admin-muted mb-1 block text-xs font-bold">
                  결과 (Result)
                </Label>
                <Textarea
                  {...control.register(`troubleshooting.${index}.result` as const)}
                  className="bg-admin-card border-admin-border resize-y break-all"
                  rows={3}
                  placeholder="최종 결과 및 성과"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-admin-muted mb-1 block text-xs">
                  트러블슈팅 이미지 (선택)
                </Label>
                <NestedTroubleshootingImages
                  control={control}
                  index={index}
                  folderPath={folderPath}
                />
              </div>
            </div>
          </div>
        ))}
        {fields.length === 0 && (
          <p className="text-sm text-gray-500 italic">등록된 트러블슈팅 내역이 없습니다.</p>
        )}
      </div>
    </div>
  );
};
