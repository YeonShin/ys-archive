'use client';

import React, { useRef } from 'react';

import Image from 'next/image';

import { UploadCloud, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { useProjectFormContext } from './ProjectFormContext';

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  folderPath?: string;
  className?: string;
  alt?: string;
  mediaType?: 'image' | 'video';
}

export const ImageUploadInput = ({
  value,
  onChange,
  folderPath = 'projects',
  className = '',
  alt = '업로드된 이미지 미리보기',
  mediaType = 'image',
}: ImageUploadInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const context = useProjectFormContext();
  const mediaLabel = mediaType === 'video' ? '영상' : '이미지';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error(`${mediaLabel} 파일은 최대 10MB까지만 업로드할 수 있습니다.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    if (value && value.startsWith('blob:')) {
      context?.unregisterFile(value);
    }

    const blobUrl = URL.createObjectURL(file);
    context?.registerFile(blobUrl, file, folderPath);
    onChange(blobUrl);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    if (value && value.startsWith('blob:')) {
      context?.unregisterFile(value);
    }
    onChange('');
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {value ? (
        <div className="border-admin-border bg-admin-muted/10 relative flex w-full items-center gap-3 rounded-lg border p-2">
          {mediaType === 'video' ? (
            <video
              src={value}
              muted
              loop
              playsInline
              autoPlay
              className="h-16 w-16 rounded object-cover"
            />
          ) : (
            <Image
              width={64}
              height={64}
              src={value}
              alt={alt}
              className="h-16 w-16 rounded object-cover"
            />
          )}
          <span className="text-admin-muted flex-1 truncate text-sm text-wrap">
            {value.startsWith('blob:') ? `새 ${mediaLabel} 파일 선택됨` : value}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="bg-admin-card border-admin-border text-admin-muted hover:bg-admin-text/30 flex h-12 w-full items-center justify-center gap-2 border-dashed"
        >
          <UploadCloud className="h-5 w-5" />
          {mediaLabel} 업로드 (최대 10MB)
        </Button>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={mediaType === 'video' ? 'video/mp4,video/webm' : 'image/*'}
        className="hidden"
      />
    </div>
  );
};
