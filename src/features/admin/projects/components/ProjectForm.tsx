'use client';

import React from 'react';

import { Control } from 'react-hook-form';

import { Button } from '@/components/ui/button';

import { useProjectForm } from '../hooks/useProjectForm';
import { Project, ProjectFormData } from '../types';
import { ArchitectureFieldArray } from './form/ArchitectureFieldArray';
import { ImageFieldArray } from './form/ImageFieldArray';
import { KeyFeatureFieldArray } from './form/KeyFeatureFieldArray';
import { ProjectBasicInfo } from './form/ProjectBasicInfo';
import { ProjectDescriptions } from './form/ProjectDescriptions';
import { ProjectFormContext } from './form/ProjectFormContext';
import { ProjectLinks } from './form/ProjectLinks';
import { TechStackFieldArray } from './form/TechStackFieldArray';
import { TroubleshootingFieldArray } from './form/TroubleshootingFieldArray';

interface ProjectFormProps {
  initialData?: Project;
  onCancel?: () => void;
}

const ProjectForm = ({ initialData, onCancel }: ProjectFormProps) => {
  const {
    register,
    control,
    errors,
    isPending,
    isCurrent,
    onFormSubmit,
    handleCancel,
    projectId,
    registerFile,
    unregisterFile,
    setValue,
    trigger,
  } = useProjectForm({ initialData, onCancel });

  return (
    <ProjectFormContext.Provider value={{ registerFile, unregisterFile }}>
      <div className="bg-admin-card border-admin-border rounded-xl border p-6 shadow-sm">
        <h2 className="text-admin-text border-admin-border mb-6 border-b pb-4 text-xl font-bold">
          {initialData ? '프로젝트 수정' : '프로젝트 추가'}
        </h2>

        <form onSubmit={onFormSubmit} className="space-y-6" data-testid="project-form">
          {/* 1. 기본 정보 (Basic Info) */}
          <ProjectBasicInfo
            register={register}
            control={control}
            errors={errors}
            isCurrent={isCurrent}
            setValue={setValue}
            trigger={trigger}
            projectId={projectId}
          />

          {/* 2. 링크 (Links) */}
          <ProjectLinks control={control as unknown as Control<ProjectFormData>} />

          {/* 3. 상세 텍스트 (Description & Retrospective) */}
          <ProjectDescriptions register={register} errors={errors} />

          {/* 4. 중첩 배열 필드 (Sub components) */}
          <div className="border-admin-border space-y-6 border-t pt-6">
            <ImageFieldArray
              control={control as unknown as Control<ProjectFormData>}
              folderPath={`projects/${projectId}/screenshots`}
            />
            <TechStackFieldArray control={control as unknown as Control<ProjectFormData>} />
            <ArchitectureFieldArray
              control={control as unknown as Control<ProjectFormData>}
              folderPath={`projects/${projectId}/architecture`}
            />
            <KeyFeatureFieldArray control={control as unknown as Control<ProjectFormData>} />
            <TroubleshootingFieldArray
              control={control as unknown as Control<ProjectFormData>}
              folderPath={`projects/${projectId}/troubleshooting`}
            />
          </div>

          {/* 5. 액션 버튼 */}
          <div className="border-admin-border flex justify-end gap-3 border-t pt-4">
            <Button
              variant="secondary"
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex items-center rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? '저장 중...' : initialData ? '수정 (저장)' : '저장'}
            </Button>
          </div>
        </form>
      </div>
    </ProjectFormContext.Provider>
  );
};

export default ProjectForm;
