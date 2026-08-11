'use client';

import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { TechStack, TechStackFormData } from '../types';

interface TechStackFormProps {
  isOpen: boolean;
  editingItem?: TechStack;
  closeForm: () => void;
  form: UseFormReturn<TechStackFormData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
}

const TECH_TYPES = [
  'FRONTEND',
  'BACKEND',
  'DATABASE',
  'INFRA',
  'MOBILE',
  'DEVOPS',
  'AI_ML',
  'TESTING',
] as const;

const TECH_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const;

const TechStackForm = ({
  isOpen,
  editingItem,
  closeForm,
  form,
  onSubmit,
  isSubmitting,
}: TechStackFormProps) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Dialog open={isOpen} onOpenChange={closeForm}>
      <DialogContent className="bg-admin-card border-admin-border border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-admin-text">
            {editingItem ? '기술 스택 수정' : '기술 스택 추가'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-admin-text" htmlFor="name">
              이름 (Name)
            </Label>
            <Input
              className="bg-admin-card border-admin-border text-admin-text"
              id="name"
              placeholder="ex) React, Next.js"
              {...register('name')}
            />
            {errors.name && (
              <span className="text-destructive text-sm font-medium">{errors.name.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-admin-text" htmlFor="icon">
              아이콘 식별자 (Icon)
            </Label>
            <Input
              className="bg-admin-card border-admin-border text-admin-text"
              id="icon"
              placeholder="ex) react, nextjs, aws"
              {...register('icon')}
            />
            <span className="text-muted-foreground text-[13px]">
              react-icons의 식별자를 입력하세요. (특수문자 제외)
            </span>
            {errors.icon && (
              <span className="text-destructive text-sm font-medium">{errors.icon.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-admin-text" htmlFor="type">
              분류 (Type)
            </Label>
            <select
              id="type"
              className="bg-admin-card border-admin-border text-admin-text focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              {...register('type')}
            >
              <option value="" disabled>
                분류를 선택하세요
              </option>
              {TECH_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && (
              <span className="text-destructive text-sm font-medium">{errors.type.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-admin-text" htmlFor="level">
              숙련도 (Level)
            </Label>
            <select
              id="level"
              className="bg-admin-card border-admin-border text-admin-text focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              {...register('level', {
                setValueAs: (v) => (v === '' ? null : v),
              })}
            >
              <option value="">선택 안함</option>
              {TECH_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {errors.level && (
              <span className="text-destructive text-sm font-medium">{errors.level.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-admin-text" htmlFor="color">
              브랜드 색상 (Color)
            </Label>
            <div className="flex gap-2">
              <Input
                id="color-picker"
                type="color"
                className="bg-admin-card h-9 w-14 cursor-pointer p-1"
                {...register('color')}
                value={form.watch('color') || '#ffffff'}
                onChange={(e) => {
                  form.setValue('color', e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              />
              <Input
                id="color"
                className="bg-admin-card border-admin-border text-admin-text"

                placeholder="#HEXCODE"
                {...register('color')}
                value={form.watch('color') || ''}
                onChange={(e) => {
                  form.setValue('color', e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              />
            </div>
            <span className="text-admin-muted text-[13px]">선택사항입니다.</span>
            {errors.color && (
              <span className="text-destructive text-sm font-medium">{errors.color.message}</span>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="secondary" type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TechStackForm;
