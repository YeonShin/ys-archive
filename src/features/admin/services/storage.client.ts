import { createClient } from '@/lib/supabase/client';

export const uploadFile = async (file: File, folder: string) => {
  try {
    if (!file) {
      return { success: false, error: '파일이 제공되지 않았습니다.' };
    }

    const supabase = createClient();

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

    return { success: true, url: publicUrlData.publicUrl, path: filePath };
  } catch (error: unknown) {
    console.error('[storage.client.uploadFile]', error);
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

export const deleteFile = async (fileUrlOrPath: string) => {
  try {
    const supabase = createClient();

    let filePath = fileUrlOrPath;
    if (fileUrlOrPath.startsWith('http')) {
      const urlParts = fileUrlOrPath.split('/portfolio-assets/');
      if (urlParts.length > 1) {
        filePath = urlParts[1];
      }
    }

    const { error } = await supabase.storage.from('portfolio-assets').remove([filePath]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('[storage.client.deleteFile]', error);
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
