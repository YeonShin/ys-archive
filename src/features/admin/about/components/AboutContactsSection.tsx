import { Plus, Trash2 } from 'lucide-react';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { AboutFormData } from '../types';

interface AboutContactsSectionProps {
  form: UseFormReturn<AboutFormData>;
  contactsFieldArray: UseFieldArrayReturn<AboutFormData, 'contacts', 'id'>;
}

export const AboutContactsSection = ({ form, contactsFieldArray }: AboutContactsSectionProps) => {
  const {
    register,
    formState: { errors },
  } = form;
  const { fields, append, remove } = contactsFieldArray;

  return (
    <section className="bg-admin card border-admin-border space-y-6 rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-admin text text-lg font-bold">연락처 링크 정보</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: '', icon: '', url: '', description: '' })}
          className="border-admin-border hover:bg-admin-muted"
        >
          <Plus className="mr-2 h-4 w-4" />새 연락처 추가
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border-admin-border grid grid-cols-1 items-start gap-4 rounded-md border p-4 md:grid-cols-7"
          >
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor={`contact-name-${index}`}>연락처 이름</Label>
              <Input
                id={`contact-name-${index}`}
                placeholder="예: Github"
                {...register(`contacts.${index}.name` as const)}
                className="bg-admin-card border-admin-border"
              />
              {errors.contacts?.[index]?.name && (
                <p className="text-destructive text-xs">{errors.contacts[index]?.name?.message}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor={`contact-icon-${index}`}>아이콘 이름</Label>
              <Input
                id={`contact-icon-${index}`}
                placeholder="예: Github"
                {...register(`contacts.${index}.icon` as const)}
                className="bg-admin-card border-admin-border"
              />
              {errors.contacts?.[index]?.icon && (
                <p className="text-destructive text-xs">{errors.contacts[index]?.icon?.message}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor={`contact-url-${index}`}>URL</Label>
              <Input
                id={`contact-url-${index}`}
                placeholder="https://"
                {...register(`contacts.${index}.url` as const)}
                className="bg-admin-card border-admin-border"
              />
              {errors.contacts?.[index]?.url && (
                <p className="text-destructive text-xs">{errors.contacts[index]?.url?.message}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor={`contact-description-${index}`}>설명 (선택)</Label>
              <Input
                id={`contact-description-${index}`}
                placeholder="예: 주로 활동하는 깃허브 계정입니다."
                {...register(`contacts.${index}.description` as const)}
                className="bg-admin-card border-admin-border"
              />
              {errors.contacts?.[index]?.description && (
                <p className="text-destructive text-xs">
                  {errors.contacts[index]?.description?.message}
                </p>
              )}
            </div>
            <div className="flex h-full items-end justify-end space-x-2 pt-6 md:col-span-1">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
                aria-label="연락처 삭제"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {fields.length === 0 && (
          <div className="text-muted-foreground p-4 text-center text-sm">
            등록된 연락처가 없습니다.
          </div>
        )}
      </div>
    </section>
  );
};
