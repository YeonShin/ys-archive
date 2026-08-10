'use server';

import { revalidatePath } from 'next/cache';

import { deleteFile, uploadFile } from '../../about/services/storage.service';
import { ActionResponse } from '../../experiences/actions/experiences.action';
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
): Promise<ActionResponse> {
  try {
    const dto = mapFormDataToDto(formData);
    await createProject(dto as InsertProjectDto);

    revalidatePath('/admin/projects');
    return { success: true };
  } catch (error: unknown) {
    console.error('[Projects.createProjectAction] 에러 발생:', error);

    // DB 삽입 실패 시, 클라이언트에서 미리 업로드했던 이미지들이 고아(Orphan)가 되지 않도록 Storage 롤백 수행
    if (uploadedUrlsToRollback && uploadedUrlsToRollback.length > 0) {
      await Promise.all(uploadedUrlsToRollback.map((url) => deleteFile(url)));
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
): Promise<ActionResponse> {
  try {
    const dto = mapFormDataToDto(formData);
    await updateProject(id, dto as UpdateProjectDto);

    revalidatePath('/admin/projects');
    revalidatePath(`/admin/projects/${id}`);
    return { success: true };
  } catch (error: unknown) {
    console.error('[Projects.updateProjectAction] 에러 발생:', error);

    // DB 수정 실패 시, 새로 추가했던 이미지들만 Storage에서 롤백
    if (uploadedUrlsToRollback && uploadedUrlsToRollback.length > 0) {
      await Promise.all(uploadedUrlsToRollback.map((url) => deleteFile(url)));
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.',
    };
  }
}

export async function deleteProjectAction(
  prevState: unknown,
  id: string,
  urlsToDelete?: string[],
): Promise<ActionResponse> {
  try {
    // 1. DB에서 프로젝트 레코드 삭제
    await deleteProject(id);

    // 2. 해당 프로젝트에 연결되어 있던 Storage 파일들 모두 삭제
    if (urlsToDelete && urlsToDelete.length > 0) {
      await Promise.all(urlsToDelete.map((url) => deleteFile(url)));
    }

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

export async function uploadImageAction(
  formData: FormData,
  folderPath: string = 'projects',
): Promise<{ success: boolean; url?: string; message?: string }> {
  try {
    const res = await uploadFile(formData, folderPath);
    if (!res.success) {
      return { success: false, message: res.error };
    }
    return { success: true, url: res.url };
  } catch (error: unknown) {
    console.error('[Projects.uploadImageAction] 에러 발생:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '이미지 업로드 중 오류가 발생했습니다.',
    };
  }
}
