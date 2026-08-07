'use server';

import { updateAboutData } from '../services/about.service';
import { deleteFile, uploadFile } from '../services/storage.service';
import { AboutFormData } from '../types';

type SubmitAboutFormResult =
  { success: true; data: AboutFormData } | { success: false; error: string };

export async function submitAboutFormAction(formData: FormData): Promise<SubmitAboutFormResult> {
  const newlyUploadedPaths: string[] = [];
  const getFilePath = (url: string) => {
    const parts = url.split('/portfolio-assets/');
    return parts.length === 2 ? parts[1] : null;
  };

  try {
    const dataString = formData.get('data') as string;
    if (!dataString) throw new Error('데이터가 제공되지 않았습니다.');

    const updatedData: AboutFormData = JSON.parse(dataString);
    const oldProfileUrl = updatedData.portfolioContent.profile_image_url;
    const oldResumeUrl = updatedData.portfolioContent.resume_url;

    let newProfileUploaded = false;
    let newResumeUploaded = false;

    // 1. 프로필 이미지 업로드
    const profileImageFile = formData.get('profileImage') as File | null;
    if (profileImageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', profileImageFile);
      const res = await uploadFile(uploadFormData, 'profile');
      if (res.success && res.url) {
        updatedData.portfolioContent.profile_image_url = res.url;
        newProfileUploaded = true;
        const path = getFilePath(res.url);
        if (path) newlyUploadedPaths.push(path);
      } else {
        return { success: false, error: res.error || '프로필 이미지 업로드 실패' };
      }
    }

    // 2. 이력서 파일 업로드
    const resumeFile = formData.get('resume') as File | null;
    if (resumeFile) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', resumeFile);
      const res = await uploadFile(uploadFormData, 'resumes');
      if (res.success && res.url) {
        updatedData.portfolioContent.resume_url = res.url;
        newResumeUploaded = true;
        const path = getFilePath(res.url);
        if (path) newlyUploadedPaths.push(path);
      } else {
        for (const path of newlyUploadedPaths) {
          await deleteFile(path).catch(console.error);
        }
        return { success: false, error: res.error || '이력서 업로드 실패' };
      }
    }

    // 3. DB 업데이트
    const updateRes = await updateAboutData(updatedData);
    if (!updateRes.success) {
      // 만약 DB 업데이트 중 실패했다면 업로드한 파일들 제거
      for (const path of newlyUploadedPaths) {
        await deleteFile(path).catch(console.error);
      }
      return { success: false, error: updateRes.error || 'DB 업데이트 실패' };
    }

    // 4. 기존 쓰레기 파일 삭제
    if (newProfileUploaded && oldProfileUrl) {
      const oldPath = getFilePath(oldProfileUrl);
      if (oldPath) await deleteFile(oldPath).catch(console.error);
    }
    if (newResumeUploaded && oldResumeUrl) {
      const oldPath = getFilePath(oldResumeUrl);
      if (oldPath) await deleteFile(oldPath).catch(console.error);
    }

    return { success: true, data: updatedData };
  } catch (error: unknown) {
    console.error('[about.action.submitAboutFormAction]', error);
    for (const path of newlyUploadedPaths) {
      await deleteFile(path).catch(console.error);
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
