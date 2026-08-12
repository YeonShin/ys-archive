'use server';

import { revalidatePath } from 'next/cache';

import { ActionResponse } from '@/types/response';

import { deleteFile, deleteFolder } from '../../services/storage.service';
import { createProject, deleteProject, updateProject } from '../services/projects.service';
import { InsertProjectDto, ProjectFormData, UpdateProjectDto } from '../types';

/**
 * 클라이언트 폼 데이터(ProjectFormData)를 DB DTO(InsertProject) 규격에 맞게 변환합니다.
 * useFieldArray 때문에 { value: string } 형태로 래핑된 배열들을 순수 string[] 으로 매핑합니다.
 */
function mapFormDataToDto(
  formData: ProjectFormData,
): Omit<InsertProjectDto, 'created_at' | 'updated_at'> {
  return {
    ...formData,
    id: formData.id || crypto.randomUUID(),
    ended_at: formData.ended_at ?? null,
    subtitle: formData.subtitle ?? null,
    links: formData.links ?? null,
    description: formData.description,
    retrospective: formData.retrospective ?? null,
    images: formData.images?.map((img) => img.value) || [],
    key_features:
      formData.key_features?.map((feature) => ({
        ...feature,
        desc: feature.desc.map((d) => d.value),
      })) || [],
  };
}

export async function createProjectAction(
  prevState: unknown,
  formData: ProjectFormData,
  uploadedUrlsToRollback?: string[],
  urlsToDeleteOnSuccess?: string[],
): Promise<ActionResponse> {
  try {
    const dto = mapFormDataToDto(formData);
    const createRes = await createProject(dto as InsertProjectDto);

    if (!createRes.success) {
      if (uploadedUrlsToRollback && uploadedUrlsToRollback.length > 0) {
        for (const url of uploadedUrlsToRollback) {
          await deleteFile(url).catch(console.error);
        }
      }
      return { success: false, message: createRes.message || '프로젝트 생성 실패' };
    }

    if (urlsToDeleteOnSuccess && urlsToDeleteOnSuccess.length > 0) {
      for (const url of urlsToDeleteOnSuccess) {
        await deleteFile(url).catch(console.error);
      }
    }

    revalidatePath('/admin/projects');
    return { success: true };
  } catch (error: unknown) {
    console.error('[Projects.createProjectAction] 에러 발생:', error);

    // DB 삽입 과정(또는 그 외 try 내부)에서 예외 발생 시 롤백
    if (uploadedUrlsToRollback && uploadedUrlsToRollback.length > 0) {
      for (const url of uploadedUrlsToRollback) {
        await deleteFile(url).catch(console.error);
      }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.',
    };
  }
}

export async function updateProjectAction(
  prevState: unknown,
  id: string,
  formData: ProjectFormData,
  uploadedUrlsToRollback?: string[],
  urlsToDeleteOnSuccess?: string[],
): Promise<ActionResponse> {
  try {
    const dto = mapFormDataToDto(formData);
    const updateRes = await updateProject(id, dto as UpdateProjectDto);

    if (!updateRes.success) {
      if (uploadedUrlsToRollback && uploadedUrlsToRollback.length > 0) {
        for (const url of uploadedUrlsToRollback) {
          await deleteFile(url).catch(console.error);
        }
      }
      return { success: false, message: updateRes.message || '프로젝트 수정 실패' };
    }

    if (urlsToDeleteOnSuccess && urlsToDeleteOnSuccess.length > 0) {
      for (const url of urlsToDeleteOnSuccess) {
        await deleteFile(url).catch(console.error);
      }
    }

    revalidatePath('/admin/projects');
    revalidatePath(`/admin/projects/${id}`);
    return { success: true };
  } catch (error: unknown) {
    console.error('[Projects.updateProjectAction] 에러 발생:', error);

    // DB 수정 과정(또는 그 외 try 내부)에서 예외 발생 시 롤백
    if (uploadedUrlsToRollback && uploadedUrlsToRollback.length > 0) {
      for (const url of uploadedUrlsToRollback) {
        await deleteFile(url).catch(console.error);
      }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.',
    };
  }
}

export async function deleteProjectAction(prevState: unknown, id: string): Promise<ActionResponse> {
  try {
    // 1. DB에서 프로젝트 레코드 삭제
    await deleteProject(id);

    // 2. 해당 프로젝트에 연결되어 있던 Storage 폴더(하위 파일 포함) 전체 삭제
    await deleteFolder(`projects/${id}`);

    revalidatePath('/admin/projects');
    return { success: true };
  } catch (error: unknown) {
    console.error('[Projects.deleteProjectAction] 에러 발생:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.',
    };
  }
}
