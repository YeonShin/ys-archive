import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const onSubmit = async (data: AboutFormData) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const res = await submitAboutFormAction(formData);

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
