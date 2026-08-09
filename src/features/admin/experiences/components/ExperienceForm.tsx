import React from 'react';

import { UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { ExperienceFormData } from '../types';

interface ExperienceFormProps {
  editingId: string | null;
  form: UseFormReturn<ExperienceFormData>;
  onSubmit: (data: ExperienceFormData) => void;
  isPending: boolean;
  isCurrent: boolean;
  techStacks: Record<'id' | 'value', string>[];
  appendTechStack: (data: { value: string }) => void;
  removeTechStack: (index: number) => void;
  details: Record<'id' | 'value', string>[];
  appendDetail: (data: { value: string }) => void;
  removeDetail: (index: number) => void;
  setView: (view: 'LIST' | 'FORM') => void;
}

const ExperienceForm = ({
  editingId,
  form,
  onSubmit,
  isPending,
  isCurrent,
  techStacks,
  appendTechStack,
  removeTechStack,
  details,
  appendDetail,
  removeDetail,
  setView,
}: ExperienceFormProps) => {
  return (
    <div className="bg-admin-card border-admin-border rounded-xl border p-6 shadow-sm">
      <h2 className="text-admin-text border-admin-border mb-6 border-b pb-4 text-xl font-bold">
        {editingId ? '항목 수정' : '항목 추가'}
      </h2>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="title" className="text-admin-text mb-1 block text-sm font-bold">
              제목 (역할/학위)
            </Label>
            <Input
              id="title"
              {...form.register('title')}
              className="bg-admin-card border-admin-border"
              placeholder="예: 프론트엔드 개발자, 컴퓨터공학 학사"
            />
            {form.formState.errors.title && (
              <p className="mt-1.5 text-sm text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="organization" className="text-admin-text mb-1 block text-sm font-bold">
              기관명 (회사/학교)
            </Label>
            <Input
              id="organization"
              {...form.register('organization')}
              className="bg-admin-card border-admin-border"
              placeholder="예: 구글, 한국대학교"
            />
            {form.formState.errors.organization && (
              <p className="mt-1.5 text-sm text-red-500">
                {form.formState.errors.organization.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="started_at" className="text-admin-text mb-1 block text-sm font-bold">
              시작일
            </Label>
            <Input
              id="started_at"
              type="date"
              {...form.register('started_at')}
              className="bg-admin-card border-admin-border"
            />
            {form.formState.errors.started_at && (
              <p className="mt-1.5 text-sm text-red-500">
                {form.formState.errors.started_at.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="ended_at" className="text-admin-text mb-1 block text-sm font-bold">
              종료일
            </Label>
            <Input
              id="ended_at"
              type="date"
              {...form.register('ended_at')}
              disabled={isCurrent}
              className="bg-admin-card border-admin-border"
            />

            <div className="mt-3 flex items-center">
              <Input
                id="is_current"
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => {
                  if (e.target.checked) {
                    form.setValue('ended_at', null);
                  } else {
                    form.setValue('ended_at', '');
                  }
                  form.trigger('ended_at');
                }}
                className="ml-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label
                htmlFor="is_current"
                className="text-admin-muted ml-2 cursor-pointer text-sm font-medium"
              >
                현재 진행중
              </Label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="text-admin-text mb-1 block text-sm font-bold">
            설명 (선택)
          </Label>
          <Textarea
            id="description"
            rows={3}
            {...form.register('description')}
            className="bg-admin-card border-admin-border block w-full resize-y rounded-lg border p-2.5 transition-all outline-none focus:ring-2"
            placeholder="주요 성과나 간단한 설명을 적어주세요."
          />
        </div>

        <div className="border-admin-border bg-admin-card rounded-lg border p-4">
          <div className="border-admin-border mb-3 flex items-center justify-between border-b pb-2">
            <Label className="text-admin-text mb-1 block text-sm font-bold">기술스택</Label>
            <Button
              variant="link"
              type="button"
              onClick={() => appendTechStack({ value: '' })}
              className="flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
            >
              + 기술스택 추가
            </Button>
          </div>
          <div className="space-y-3">
            {techStacks.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...form.register(`tech_stacks.${index}.value` as const)}
                  aria-label={`기술스택 ${index}`}
                  className="bg-admin-card border-admin-border"
                  placeholder="예: React, Node.js"
                />
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => removeTechStack(index)}
                  className="rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap"
                >
                  삭제
                </Button>
              </div>
            ))}
            {techStacks.length === 0 && (
              <p className="text-sm text-gray-500 italic">등록된 기술스택이 없습니다.</p>
            )}
          </div>
        </div>

        <div className="border-admin-border bg-admin-card rounded-lg border p-4">
          <div className="border-admin-border mb-3 flex items-center justify-between border-b pb-2">
            <Label className="text-admin-text mb-1 block text-sm font-bold">상세업무</Label>
            <Button
              variant="link"
              type="button"
              onClick={() => appendDetail({ value: '' })}
              className="flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
            >
              + 상세업무 추가
            </Button>
          </div>
          <div className="space-y-3">
            {details.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...form.register(`details.${index}.value` as const)}
                  aria-label={`상세업무 ${index}`}
                  className="bg-admin-card border-admin-border"
                  placeholder="예: 프론트엔드 아키텍처 설계"
                />
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => removeDetail(index)}
                  className="rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap"
                >
                  삭제
                </Button>
              </div>
            ))}
            {details.length === 0 && (
              <p className="text-sm text-gray-500 italic">등록된 상세업무가 없습니다.</p>
            )}
          </div>
        </div>

        <div className="border-admin-border flex justify-end gap-3 border-t pt-4">
          <Button
            variant="secondary"
            type="button"
            onClick={() => setView('LIST')}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="flex items-center rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? '저장 중...' : editingId ? '수정 (저장)' : '저장'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExperienceForm;
