'use client';

import React, { useCallback, useEffect, useRef, useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Control, Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  createProjectAction,
  deleteStorageFilesAction,
  updateProjectAction,
  uploadImageAction,
} from '../actions/projects.action';
import { Project, ProjectFormData, projectFormSchema } from '../types';
import { ArchitectureFieldArray } from './form/ArchitectureFieldArray';
import { ImageFieldArray } from './form/ImageFieldArray';
import { ImageUploadInput } from './form/ImageUploadInput';
import { KeyFeatureFieldArray } from './form/KeyFeatureFieldArray';
import { ProjectFormContext } from './form/ProjectFormContext';
// 서브 컴포넌트들 임포트
import { TechStackFieldArray } from './form/TechStackFieldArray';
import { TroubleshootingFieldArray } from './form/TroubleshootingFieldArray';

interface ProjectFormProps {
  initialData?: Project;
  onCancel?: () => void;
}

const ProjectForm = ({ initialData, onCancel }: ProjectFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [projectId] = useState<string>(() => initialData?.id || crypto.randomUUID());

  const pendingFiles = useRef<Map<string, { file: File; folderPath: string }>>(new Map());

  const registerFile = (blobUrl: string, file: File, folderPath: string) => {
    pendingFiles.current.set(blobUrl, { file, folderPath });
  };

  const unregisterFile = (blobUrl: string) => {
    pendingFiles.current.delete(blobUrl);
    URL.revokeObjectURL(blobUrl);
  };

  useEffect(() => {
    const filesMap = pendingFiles.current;
    return () => {
      // Clean up object URLs on unmount
      filesMap.forEach((_, blobUrl) => {
        URL.revokeObjectURL(blobUrl);
      });
    };
  }, []);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          subtitle: initialData.subtitle ?? '',
          ended_at: initialData.ended_at ?? null,
          links: initialData.links ?? null,
          retrospective: initialData.retrospective ?? '',
          images: initialData.images.map((url) => ({ value: url })),
          key_features: initialData.key_features.map((f) => ({
            ...f,
            desc: f.desc.map((d) => ({ value: d })),
          })),
        }
      : {
          id: projectId,
          title: '',
          subtitle: '',
          status: 'IN_PROGRESS',
          started_at: '',
          ended_at: null,
          role: '',
          links: { github: '', service: '' },
          thumbnail_url: '',
          tech_stacks: [],
          images: [],
          description: '',
          architecture: [],
          key_features: [],
          troubleshooting: [],
          retrospective: '',
          priority: 1,
        },
  });

  const onSubmit = useCallback(
    (data: ProjectFormData) => {
      startTransition(async () => {
        // 1. Upload all pending files
        const uploadedUrls = new Map<string, string>(); // blobUrl -> realUrl
        const newUploadedRealUrls: string[] = [];

        for (const [blobUrl, { file, folderPath }] of pendingFiles.current.entries()) {
          const formData = new FormData();
          formData.append('file', file);
          const res = await uploadImageAction(formData, folderPath);
          if (res.success && res.url) {
            uploadedUrls.set(blobUrl, res.url);
            newUploadedRealUrls.push(res.url);
          } else {
            alert(`이미지 업로드 실패: ${res.message}`);
            // Rollback uploaded files if any failed midway
            if (newUploadedRealUrls.length > 0) {
              await deleteStorageFilesAction(newUploadedRealUrls);
            }
            return; // Stop submission
          }
        }

        // 2. Replace blob URLs in `data` with real URLs
        const replaceUrl = (url: string) => uploadedUrls.get(url) || url;

        data.thumbnail_url = replaceUrl(data.thumbnail_url);
        data.images = data.images.map((img) => ({ ...img, value: replaceUrl(img.value) }));
        data.architecture = data.architecture.map((a) => ({ ...a, url: replaceUrl(a.url) }));
        data.troubleshooting = data.troubleshooting.map((t) => ({
          ...t,
          images: t.images.map((img) => ({ ...img, url: replaceUrl(img.url) })),
        }));

        // 3. 계산된 최종 이미지 URL 목록
        const finalUrls = new Set<string>();
        if (data.thumbnail_url) finalUrls.add(data.thumbnail_url);
        data.images?.forEach((img) => {
          if (img.value) finalUrls.add(img.value);
        });
        data.architecture?.forEach((a) => {
          if (a.url) finalUrls.add(a.url);
        });
        data.troubleshooting?.forEach((t) => {
          t.images?.forEach((img) => {
            if (img.url) finalUrls.add(img.url);
          });
        });

        // 4. 초기 데이터의 이미지 URL 목록
        const initialUrls = new Set<string>();
        if (initialData) {
          if (initialData.thumbnail_url) initialUrls.add(initialData.thumbnail_url);
          initialData.images?.forEach((img) => initialUrls.add(img));
          initialData.architecture?.forEach((a) => initialUrls.add(a.url));
          initialData.troubleshooting?.forEach((t) => {
            t.images?.forEach((img) => initialUrls.add(img.url));
          });
        }

        // 5. 롤백 및 정리할 URL 계산
        // - 실패 시 지울 것: 방금 막 업로드에 성공한 모든 실제 이미지 URL들
        const uploadedUrlsToRollback = newUploadedRealUrls;

        // - 성공 시 지울 것: 초기 이미지 중 삭제된 것 (Blob URL은 이미 필터링되므로 제외)
        const urlsToDeleteOnSuccess = Array.from(initialUrls).filter((url) => !finalUrls.has(url));

        let result;
        if (initialData?.id) {
          result = await updateProjectAction(
            null,
            initialData.id,
            data,
            uploadedUrlsToRollback,
            urlsToDeleteOnSuccess,
          );
        } else {
          result = await createProjectAction(
            null,
            data,
            uploadedUrlsToRollback,
            urlsToDeleteOnSuccess,
          );
        }

        if (result.success) {
          pendingFiles.current.clear(); // blob url 삭제 (URL.revokeObjectURL는 안함, 리렌더링시 해제됨)
          if (onCancel) onCancel();
          router.refresh();
        } else {
          alert(result.message || '저장 중 오류가 발생했습니다.');
        }
      });
    },
    [initialData, onCancel, router],
  );

  const handleCancel = async () => {
    // 그냥 로컬 Blob URL들만 메모리에서 해제하면 됨
    pendingFiles.current.forEach((_, blobUrl) => {
      URL.revokeObjectURL(blobUrl);
    });
    pendingFiles.current.clear();

    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    void handleSubmit(onSubmit)(e);
  };

  const isCurrent = watch('ended_at') === null;

  return (
    <ProjectFormContext.Provider value={{ registerFile, unregisterFile }}>
      <div className="bg-admin-card border-admin-border rounded-xl border p-6 shadow-sm">
        <h2 className="text-admin-text border-admin-border mb-6 border-b pb-4 text-xl font-bold">
          {initialData ? '프로젝트 수정' : '프로젝트 추가'}
        </h2>

        <form onSubmit={onFormSubmit} className="space-y-6" data-testid="project-form">
          {/* 1. 기본 정보 (Basic Info) */}
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
              {errors.title && (
                <p className="mt-1.5 text-sm text-red-500">{errors.title.message}</p>
              )}
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
              <Label
                htmlFor="thumbnail_url"
                className="text-admin-text mb-1 block text-sm font-bold"
              >
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

          {/* 2. 링크 (Links) */}
          <div className="border-admin-border grid grid-cols-1 gap-6 border-t pt-6 md:grid-cols-2">
            <div>
              <Label
                htmlFor="links.github"
                className="text-admin-text mb-1 block text-sm font-bold"
              >
                Github URL (선택)
              </Label>
              <Input
                id="links.github"
                {...register('links.github')}
                className="bg-admin-card border-admin-border"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <Label
                htmlFor="links.service"
                className="text-admin-text mb-1 block text-sm font-bold"
              >
                서비스 URL (선택)
              </Label>
              <Input
                id="links.service"
                type="url"
                {...register('links.service')}
                className="bg-admin-card border-admin-border"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* 3. 상세 텍스트 (Description & Retrospective) */}
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
              <Label
                htmlFor="retrospective"
                className="text-admin-text mb-1 block text-sm font-bold"
              >
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
