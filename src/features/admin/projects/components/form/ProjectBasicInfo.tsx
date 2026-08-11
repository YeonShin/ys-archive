import React from 'react';

import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ProjectFormData } from '../../types';
import { ImageUploadInput } from './ImageUploadInput';

interface ProjectBasicInfoProps {
  register: UseFormRegister<ProjectFormData>;
  control: Control<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
  isCurrent: boolean;
  setValue: UseFormSetValue<ProjectFormData>;
  trigger: UseFormTrigger<ProjectFormData>;
  projectId: string;
}

export const ProjectBasicInfo = ({
  register,
  control,
  errors,
  isCurrent,
  setValue,
  trigger,
  projectId,
}: ProjectBasicInfoProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <Label htmlFor="title" className="text-admin-text mb-1 block text-sm font-bold">
          프로젝트명
        </Label>
        <Input
          id="title"
          {...register('title')}
          className="bg-admin-card border-admin-border"
          placeholder="프로젝트명을 입력하세요"
        />
        {errors.title && <p className="mt-1.5 text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="subtitle" className="text-admin-text mb-1 block text-sm font-bold">
          서브타이틀 (선택)
        </Label>
        <Input
          id="subtitle"
          {...register('subtitle')}
          className="bg-admin-card border-admin-border"
          placeholder="프로젝트를 설명하는 짧은 문구"
        />
      </div>

      <div>
        <Label htmlFor="status" className="text-admin-text mb-1 block text-sm font-bold">
          상태
        </Label>
        <select
          id="status"
          {...register('status')}
          className="bg-admin-card border-admin-border text-admin-text block w-full rounded-lg border p-2.5 outline-none focus:ring-2"
        >
          <option value="IN_PROGRESS">진행중 (IN_PROGRESS)</option>
          <option value="LIVE">서비스 중 (LIVE)</option>
          <option value="COMPLETED">완료됨 (COMPLETED)</option>
        </select>
      </div>

      <div>
        <Label htmlFor="priority" className="text-admin-text mb-1 block text-sm font-bold">
          우선순위 (Priority)
        </Label>
        <Input
          id="priority"
          type="number"
          {...register('priority', { valueAsNumber: true })}
          className="bg-admin-card border-admin-border"
          placeholder="숫자 (높을수록 상단 노출)"
        />
        {errors.priority && (
          <p className="mt-1.5 text-sm text-red-500">{errors.priority.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="started_at" className="text-admin-text mb-1 block text-sm font-bold">
          시작 날짜
        </Label>
        <Input
          id="started_at"
          type="date"
          {...register('started_at')}
          className="bg-admin-card border-admin-border"
          placeholder="YYYY-MM-DD"
        />
        {errors.started_at && (
          <p className="mt-1.5 text-sm text-red-500">{errors.started_at.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="ended_at" className="text-admin-text mb-1 block text-sm font-bold">
          종료 날짜 (선택)
        </Label>
        <Input
          id="ended_at"
          type="date"
          {...register('ended_at')}
          disabled={isCurrent}
          className="bg-admin-card border-admin-border"
          placeholder="YYYY-MM-DD 또는 비워두기"
        />
        <div className="mt-3 flex items-center">
          <Input
            id="is_current"
            type="checkbox"
            checked={isCurrent}
            onChange={(e) => {
              if (e.target.checked) {
                setValue('ended_at', null);
              } else {
                setValue('ended_at', '');
              }
              trigger('ended_at');
            }}
            className="border-admin-muted ml-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
          />
          <Label
            htmlFor="is_current"
            className="text-admin-muted ml-2 cursor-pointer text-sm font-medium"
          >
            현재 진행중
          </Label>
        </div>
      </div>

      <div>
        <Label htmlFor="role" className="text-admin-text mb-1 block text-sm font-bold">
          담당 역할
        </Label>
        <Input
          id="role"
          {...register('role')}
          className="bg-admin-card border-admin-border"
          placeholder="예: 프론트엔드 리드"
        />
        {errors.role && <p className="mt-1.5 text-sm text-red-500">{errors.role.message}</p>}
      </div>

      <div>
        <Label htmlFor="thumbnail_url" className="text-admin-text mb-1 block text-sm font-bold">
          썸네일 URL
        </Label>
        <Controller
          name="thumbnail_url"
          control={control}
          render={({ field }) => (
            <ImageUploadInput
              value={field.value}
              onChange={field.onChange}
              folderPath={`projects/${projectId}/thumbnails`}
            />
          )}
        />
        {errors.thumbnail_url && (
          <p className="mt-1.5 text-sm text-red-500">{errors.thumbnail_url.message}</p>
        )}
      </div>
    </div>
  );
};
