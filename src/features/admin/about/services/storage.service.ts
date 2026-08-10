import { createClient } from '@/lib/supabase/server';

export const uploadFile = async (formData: FormData, folder: string) => {
  try {
    const file = formData.get('file') as File | null;
    if (!file) {
      return { success: false, error: '파일이 제공되지 않았습니다.' };
    }

    const supabase = await createClient();

    // 파일 확장자 추출
    const fileExt = file.name.split('.').pop() || '';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // 파일 업로드
    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Public URL 가져오기
    const { data: publicUrlData } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(filePath);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (error: unknown) {
    console.error('[storage.service.uploadFile]', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : (error as { message?: string })?.message || '파일 업로드 중 오류가 발생했습니다.';
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const deleteFile = async (filePath: string) => {
  try {
    // URL에서 파일 경로만 추출하는 로직이 필요한 경우 프론트엔드나 이 함수에서 처리해야 함
    // 이 함수는 storage 내의 경로(예: profile/123.jpg)를 받는다고 가정함
    const supabase = await createClient();

    const { error } = await supabase.storage.from('portfolio-assets').remove([filePath]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('[storage.service.deleteFile]', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : (error as { message?: string })?.message || '파일 삭제 중 오류가 발생했습니다.';
    return {
      success: false,
      error: errorMessage,
    };
  }
};
