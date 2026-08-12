import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { deleteFile, uploadFile } from '../../services/storage.client';
import { createProjectAction, updateProjectAction } from '../actions/projects.action';
import { Project, ProjectFormData, projectFormSchema } from '../types';

interface UseProjectFormProps {
  initialData?: Project;
  onCancel?: () => void;
}

export const useProjectForm = ({ initialData, onCancel }: UseProjectFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [projectId] = useState<string>(() => initialData?.id || crypto.randomUUID());

  const pendingFiles = useRef<Map<string, { file: File; folderPath: string }>>(new Map());

  const registerFile = useCallback((blobUrl: string, file: File, folderPath: string) => {
    pendingFiles.current.set(blobUrl, { file, folderPath });
  }, []);

  const unregisterFile = useCallback((blobUrl: string) => {
    pendingFiles.current.delete(blobUrl);
    URL.revokeObjectURL(blobUrl);
  }, []);

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
        // 1. 폼에서 첨부한 임시 상태의 파일들을 순회하며 업로드
        const uploadedUrls = new Map<string, string>();
        const newUploadedRealUrls: string[] = [];

        for (const [blobUrl, { file, folderPath }] of pendingFiles.current.entries()) {
          const res = await uploadFile(file, folderPath);
          if (res.success && res.url) {
            uploadedUrls.set(blobUrl, res.url);
            newUploadedRealUrls.push(res.url);
          } else {
            toast.error(`이미지 업로드 실패: ${res.error}`);
            // 중간에 업로드가 하나라도 실패하면 이전에 성공해서 올라간 파일들을 삭제
            if (newUploadedRealUrls.length > 0) {
              await Promise.all(newUploadedRealUrls.map((url) => deleteFile(url)));
            }
            return;
          }
        }

        // 2. 폼 데이터의 임시 Blob URL을 실제 URL로 치환
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
        const uploadedUrlsToRollback = newUploadedRealUrls;
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
          pendingFiles.current.clear(); // blob url 삭제
          if (onCancel) onCancel();
          router.refresh();
        } else {
          toast.error(result.message || '저장 중 오류가 발생했습니다.');
        }
      });
    },
    [initialData, onCancel, router],
  );

  const handleCancel = useCallback(() => {
    pendingFiles.current.forEach((_, blobUrl) => {
      URL.revokeObjectURL(blobUrl);
    });
    pendingFiles.current.clear();

    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  }, [onCancel, router]);

  const onFormSubmit = useCallback(
    (e: React.FormEvent) => {
      void handleSubmit(onSubmit)(e);
    },
    [handleSubmit, onSubmit],
  );

  const isCurrent = watch('ended_at') === null;

  return {
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
    initialData,
  };
};
