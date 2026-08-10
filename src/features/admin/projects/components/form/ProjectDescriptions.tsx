import React from 'react';

import { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { ProjectFormData } from '../../types';

interface ProjectDescriptionsProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
}

export const ProjectDescriptions = ({ register, errors }: ProjectDescriptionsProps) => {
  return (
    <div className="border-admin-border space-y-6 border-t pt-6">
      <div>
        <Label htmlFor="description" className="text-admin-text mb-1 block text-sm font-bold">
          프로젝트 설명
        </Label>
        <Textarea
          id="description"
          rows={4}
          {...register('description')}
          className="bg-admin-card border-admin-border block w-full resize-y rounded-lg border p-2.5 break-all transition-all outline-none focus:ring-2"
          placeholder="프로젝트의 목적과 주요 내용을 적어주세요."
        />
        {errors.description && (
          <p className="mt-1.5 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="retrospective" className="text-admin-text mb-1 block text-sm font-bold">
          회고 (선택)
        </Label>
        <Textarea
          id="retrospective"
          rows={4}
          {...register('retrospective')}
          className="bg-admin-card border-admin-border block w-full resize-y rounded-lg border p-2.5 break-all transition-all outline-none focus:ring-2"
          placeholder="프로젝트 진행 후 느낀점이나 아쉬운 점 등을 자유롭게 적어주세요."
        />
      </div>
    </div>
  );
};
