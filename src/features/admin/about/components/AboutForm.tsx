'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import { zodResolver } from '@hookform/resolvers/zod';
import { File as FileIcon, Plus, Trash2, Upload } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { submitAboutFormAction } from '../actions/about.action';
import { AboutFormData, aboutFormSchema } from '../types';

interface AboutFormProps {
  initialData: AboutFormData;
}

const AboutForm = ({ initialData }: AboutFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    initialData.portfolioContent.profile_image_url || null,
  );
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutFormSchema),
    defaultValues: initialData,
  });

  const { fields, append, remove } = useFieldArray({
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      {/* Portfolio Content Section */}
      <section className="border-admin-border bg-admin-card space-y-6 rounded-lg border p-6 shadow-sm">
        <h3 className="text-admin-text text-lg font-bold">포트폴리오 정보</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Profile Image Upload */}
          <div className="flex flex-col space-y-3">
            <Label>프로필 이미지</Label>
            <div className="flex gap-4">
              <label
                htmlFor="profile-image-upload"
                className="border-admin-border bg-admin-card hover:bg-admin-muted/30 flex flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-10 transition-colors"
              >
                <div className="text-muted-foreground flex flex-col items-center justify-center pt-1 pb-2">
                  <Upload className="mb-3 h-8 w-8" />
                  <p className="mb-1 text-sm font-medium">클릭하여 프로필 이미지 업로드</p>
                  <p className="text-xs">권장: 3:4 비율 이미지</p>
                </div>
                <Input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </label>
              {profileImagePreview && (
                <div className="flex shrink-0 flex-col items-center justify-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="border-admin-border relative h-full w-32 shrink-0 overflow-hidden rounded-md border shadow-sm transition-opacity hover:opacity-80"
                      >
                        <Image
                          src={profileImagePreview}
                          alt="Profile Preview"
                          fill
                          className="object-cover"
                        />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl border-none bg-transparent p-0 shadow-none">
                      <div className="relative flex max-h-[80vh] w-full items-center justify-center overflow-hidden">
                        <Image
                          src={profileImagePreview}
                          alt="Profile Preview Enlarged"
                          width={800}
                          height={1066}
                          className="h-auto w-full max-w-full object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="developer_role">개발자 직군</Label>
              <Input
                id="developer_role"
                placeholder="예: Frontend Developer"
                {...register('portfolioContent.developer_role')}
                className="bg-admin-card border-admin-border"
              />
              {errors.portfolioContent?.developer_role && (
                <p className="text-destructive text-sm">
                  {errors.portfolioContent.developer_role.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero_title">히어로 타이틀</Label>
              <Input
                id="hero_title"
                placeholder="예: 안녕하세요, 개발자 OOO입니다."
                {...register('portfolioContent.hero_title')}
                className="bg-admin-card border-admin-border"
              />
              {errors.portfolioContent?.hero_title && (
                <p className="text-destructive text-sm">
                  {errors.portfolioContent.hero_title.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero_description">히어로 설명</Label>
          <Textarea
            id="hero_description"
            placeholder="메인 페이지에 노출될 짧은 소개글"
            {...register('portfolioContent.hero_description')}
            className="bg-admin-card border-admin-border"
          />
          {errors.portfolioContent?.hero_description && (
            <p className="text-destructive text-sm">
              {errors.portfolioContent.hero_description.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="about_text">About 본문</Label>
          <Textarea
            id="about_text"
            className="bg-admin-card border-admin-border min-h-37.5"
            placeholder="About 페이지에 들어갈 상세 소개글"
            {...register('portfolioContent.about_text')}
          />
          {errors.portfolioContent?.about_text && (
            <p className="text-destructive text-sm">{errors.portfolioContent.about_text.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>이력서 (PDF)</Label>
          <label
            htmlFor="resume-upload"
            className="border-admin-border bg-admin-card hover:bg-admin-muted/30 flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-10 transition-colors"
          >
            <div className="text-muted-foreground flex flex-col items-center justify-center pt-1 pb-2">
              <FileIcon className="mb-3 h-8 w-8" />
              <p className="mb-1 text-sm font-medium">클릭하여 이력서 파일 업로드</p>
              <p className="text-xs">PDF (최대 5MB)</p>
              {resumeFile && (
                <div className="text-admin-text bg-admin-muted/10 mt-4 flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium">
                  <FileIcon className="h-4 w-4" />
                  <span>{resumeFile.name}</span>
                </div>
              )}
            </div>
            <Input
              id="resume-upload"
              type="file"
              accept="application/pdf"
              onChange={handleResumeChange}
              className="hidden"
            />
          </label>
          {savedResumeUrl && (
            <div className="border-admin-border bg-admin-card text-admin-text mt-2 flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
              <span className="text-muted-foreground shrink-0 text-xs font-medium">
                최종 업로드된 파일:
              </span>
              <FileIcon className="text-muted-foreground h-4 w-4 shrink-0" />
              <a
                target="_blank"
                href={savedResumeUrl}
                className="truncate hover:underline"
                rel="noreferrer"
              >
                {savedResumeUrl.split('/').pop() || '이력서 파일'}
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Contacts Section */}
      <section className="bg-admin card border-admin-border space-y-6 rounded-lg border p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-admin text text-lg font-bold">연락처 링크 정보</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ name: '', icon: '', url: '', description: '' })}
            className="border-admin-border hover:bg-admin-muted"
          >
            <Plus className="mr-2 h-4 w-4" />새 연락처 추가
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border-admin-border grid grid-cols-1 items-start gap-4 rounded-md border p-4 md:grid-cols-7"
            >
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor={`contact-name-${index}`}>연락처 이름</Label>
                <Input
                  id={`contact-name-${index}`}
                  placeholder="예: Github"
                  {...register(`contacts.${index}.name`)}
                  className="bg-admin-card border-admin-border"
                />
                {errors.contacts?.[index]?.name && (
                  <p className="text-destructive text-xs">
                    {errors.contacts[index]?.name?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor={`contact-icon-${index}`}>아이콘 이름</Label>
                <Input
                  id={`contact-icon-${index}`}
                  placeholder="예: Github"
                  {...register(`contacts.${index}.icon`)}
                  className="bg-admin-card border-admin-border"
                />
                {errors.contacts?.[index]?.icon && (
                  <p className="text-destructive text-xs">
                    {errors.contacts[index]?.icon?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`contact-url-${index}`}>URL</Label>
                <Input
                  id={`contact-url-${index}`}
                  placeholder="https://"
                  {...register(`contacts.${index}.url`)}
                  className="bg-admin-card border-admin-border"
                />
                {errors.contacts?.[index]?.url && (
                  <p className="text-destructive text-xs">{errors.contacts[index]?.url?.message}</p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`contact-description-${index}`}>설명 (선택)</Label>
                <Input
                  id={`contact-description-${index}`}
                  placeholder="예: 주로 활동하는 깃허브 계정입니다."
                  {...register(`contacts.${index}.description`)}
                  className="bg-admin-card border-admin-border"
                />
                {errors.contacts?.[index]?.description && (
                  <p className="text-destructive text-xs">
                    {errors.contacts[index]?.description?.message}
                  </p>
                )}
              </div>
              <div className="flex h-full items-end justify-end space-x-2 pt-6 md:col-span-1">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                  aria-label="연락처 삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {fields.length === 0 && (
            <div className="text-muted-foreground p-4 text-center text-sm">
              등록된 연락처가 없습니다.
            </div>
          )}
        </div>
      </section>

      <div className="flex justify-end">
        <Button
          variant="secondary"
          type="submit"
          size="lg"
          disabled={isSubmitting || (!isDirty && !profileImageFile && !resumeFile)}
        >
          {isSubmitting ? '저장 중...' : '변경사항 저장'}
        </Button>
      </div>
    </form>
  );
};

export default AboutForm;
