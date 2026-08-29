import { Control, useFieldArray } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ProjectFormData } from '../../types';

interface ProjectLinksProps {
  control: Control<ProjectFormData>;
}

export const ProjectLinks = ({ control }: ProjectLinksProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'links',
  });

  return (
    <div className="border-admin-border bg-admin-card rounded-lg border p-4">
      <div className="border-admin-border mb-3 flex items-center justify-between border-b pb-2">
        <div>
          <Label className="text-admin-text block text-sm font-bold">프로젝트 링크</Label>
          <p className="text-admin-muted text-xs">
            Github, 서비스, 문서, Figma 등 관련 외부 링크를 추가할 수 있습니다.
          </p>
        </div>
        <Button
          variant="link"
          type="button"
          onClick={() => append({ label: '', url: '' })}
          className="flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
        >
          + 링크 추가
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-admin-muted py-4 text-center text-xs">
          등록된 링크가 없습니다. &apos;+ 링크 추가&apos; 버튼을 눌러 링크를 추가해주세요.
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border-admin-border bg-admin-muted/5 flex flex-col gap-3 rounded-md border p-3"
            >
              <div className="flex items-center justify-between">
                <Label className="text-admin-text text-xs font-semibold">링크 #{index + 1}</Label>
                <Button
                  variant="destructive"
                  size="sm"
                  type="button"
                  onClick={() => remove(index)}
                  className="h-7 text-xs"
                >
                  삭제
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <Label
                    htmlFor={`links.${index}.label`}
                    className="text-admin-text mb-1 block text-xs font-medium"
                  >
                    라벨 (이름)
                  </Label>
                  <Input
                    id={`links.${index}.label`}
                    {...control.register(`links.${index}.label`)}
                    className="bg-admin-card border-admin-border"
                    placeholder="ex. Github, 웹 서비스, Notion"
                  />
                </div>
                <div>
                  <Label
                    htmlFor={`links.${index}.url`}
                    className="text-admin-text mb-1 block text-xs font-medium"
                  >
                    URL 주소
                  </Label>
                  <Input
                    id={`links.${index}.url`}
                    type="url"
                    {...control.register(`links.${index}.url`)}
                    className="bg-admin-card border-admin-border"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
