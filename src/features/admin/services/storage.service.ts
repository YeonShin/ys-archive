import { createClient } from '@/lib/supabase/server';


export const deleteFile = async (fileUrlOrPath: string) => {
  try {
    const supabase = await createClient();

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

export const deleteFolder = async (folderPath: string) => {
  try {
    const supabase = await createClient();

    const emptyFolderRecursively = async (currentPath: string) => {
      const { data: list, error } = await supabase.storage
        .from('portfolio-assets')
        .list(currentPath);
      if (error) throw error;
      if (!list || list.length === 0) return;

      const filesToRemove: string[] = [];
      for (const item of list) {
        if (!item.id) {
          // Folder (id is null for folders in Supabase storage list)
          await emptyFolderRecursively(`${currentPath}/${item.name}`);
        } else {
          // File
          filesToRemove.push(`${currentPath}/${item.name}`);
        }
      }

      if (filesToRemove.length > 0) {
        const { error: removeError } = await supabase.storage
          .from('portfolio-assets')
          .remove(filesToRemove);
        if (removeError) throw removeError;
      }
    };

    await emptyFolderRecursively(folderPath);

    return { success: true };
  } catch (error: unknown) {
    console.error('[storage.service.deleteFolder]', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : (error as { message?: string })?.message || '폴더 삭제 중 오류가 발생했습니다.';
    return {
      success: false,
      error: errorMessage,
    };
  }
};
