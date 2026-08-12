'use server';

import { deleteFile } from '../../services/storage.service';
import { updateAboutData } from '../services/about.service';
import { AboutFormData } from '../types';

type SubmitAboutFormResult =
  { success: true; data: AboutFormData } | { success: false; error: string };

export async function submitAboutFormAction(
  data: AboutFormData,
  uploadedUrlsToRollback: string[],
  urlsToDeleteOnSuccess: string[],
): Promise<SubmitAboutFormResult> {
  try {
    // 1. DB 업데이트
    const updateRes = await updateAboutData(data);
    if (!updateRes.success) {
      // 만약 DB 업데이트 중 실패했다면 클라이언트가 업로드했던 새 파일들 제거 (롤백)
      for (const url of uploadedUrlsToRollback) {
        await deleteFile(url).catch(console.error);
      }
      return { success: false, error: updateRes.error || 'DB 업데이트 실패' };
    }

    // 2. 기존 쓰레기 파일 삭제 (GC)
    for (const url of urlsToDeleteOnSuccess) {
      await deleteFile(url).catch(console.error);
    }

    return { success: true, data };
  } catch (error: unknown) {
    console.error('[about.action.submitAboutFormAction]', error);
    for (const url of uploadedUrlsToRollback) {
      await deleteFile(url).catch(console.error);
    }
    const errorMessage =
      error instanceof Error
        ? error.message
        : (error as { message?: string })?.message || '알 수 없는 오류 발생';
    return {
      success: false,
      error: errorMessage,
    };
  }
}
