import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { deleteFile, uploadFile } from '../../services/storage.client';
import { submitAboutFormAction } from '../actions/about.action';
import { AboutFormData, aboutFormSchema } from '../types';

export const useAboutForm = (initialData: AboutFormData) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    initialData.portfolioContent.profile_image_url || null,
  );
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const form = useForm<AboutFormData>({
    resolver: zodResolver(aboutFormSchema),
    defaultValues: initialData,
  });

  const { reset, watch, control } = form;

  const contactsFieldArray = useFieldArray({
    control,
    name: 'contacts',
  });

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (profileImagePreview && profileImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('프로필 이미지는 최대 10MB까지만 업로드할 수 있습니다.');
        e.target.value = '';
        return;
      }
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('이력서 파일은 최대 10MB까지만 업로드할 수 있습니다.');
        e.target.value = '';
        return;
      }
      setResumeFile(file);
    }
  };

  const onSubmit = async (data: AboutFormData) => {
    try {
      setIsSubmitting(true);
      const newlyUploadedPaths: string[] = [];
      let profileImageUrl = data.portfolioContent.profile_image_url;

      if (profileImageFile) {
        const res = await uploadFile(profileImageFile, 'profile');
        if (res.success && res.url && res.path) {
          profileImageUrl = res.url;
          newlyUploadedPaths.push(res.path);
        } else {
          toast.error(res.error || '프로필 이미지 업로드 실패');
          return;
        }
      }

      let resumeUrl = data.portfolioContent.resume_url;
      if (resumeFile) {
        const res = await uploadFile(resumeFile, 'resumes');
        if (res.success && res.url && res.path) {
          resumeUrl = res.url;
          newlyUploadedPaths.push(res.path);
        } else {
          // 방금 성공한 파일이 있다면 삭제
          for (const path of newlyUploadedPaths) {
            await deleteFile(path).catch(console.error);
          }
          toast.error(res.error || '이력서 파일 업로드 실패');
          return;
        }
      }

      // 업로드한 파일 URL을 DB 업데이트 Payload에 포함
      const updatedData: AboutFormData = {
        ...data,
        portfolioContent: {
          ...data.portfolioContent,
          profile_image_url: profileImageUrl,
          resume_url: resumeUrl,
        },
      };

      // DB 업데이트 성공 시 기존 파일들을 storage에서 삭제 하기 위해 기록
      const urlsToDeleteOnSuccess: string[] = [];
      if (profileImageFile && data.portfolioContent.profile_image_url) {
        urlsToDeleteOnSuccess.push(data.portfolioContent.profile_image_url);
      }
      if (resumeFile && data.portfolioContent.resume_url) {
        urlsToDeleteOnSuccess.push(data.portfolioContent.resume_url);
      }

      const res = await submitAboutFormAction(
        updatedData,
        newlyUploadedPaths,
        urlsToDeleteOnSuccess,
      );

      if (res.success) {
        toast.success('성공적으로 저장되었습니다.');
        setProfileImageFile(null);
        setResumeFile(null);
        if (res.data.portfolioContent.profile_image_url) {
          setProfileImagePreview(res.data.portfolioContent.profile_image_url);
        }
        reset(res.data);
      } else {
        toast.error(res.error || '저장에 실패했습니다.');
      }
    } catch (error) {
      toast.error('알 수 없는 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const savedResumeUrl = watch('portfolioContent.resume_url');

  return {
    form,
    contactsFieldArray,
    fileStates: {
      profileImagePreview,
      savedResumeUrl,
      profileImageFile,
      resumeFile,
    },
    handlers: {
      handleProfileImageChange,
      handleResumeChange,
      onSubmit,
    },
    isSubmitting,
    isDirty: form.formState.isDirty,
  };
};
