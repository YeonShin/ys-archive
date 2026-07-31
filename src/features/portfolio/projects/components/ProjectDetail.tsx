'use client';

import { XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import { Project } from '../type';
import ImageCarousel from './ImageCarousel';

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail = ({ project }: ProjectDetailProps) => {
  return (
    <div className="flex flex-col gap-4">
      <SheetHeader className="flex flex-row items-center justify-between px-8 py-6">
        <div className="from-brand-secondary to-brand-primary absolute inset-x-0 top-0 h-0.75 bg-linear-0" />
        <SheetTitle className="text-brand-secondary box-content font-mono text-sm">
          Project Details
        </SheetTitle>
        <SheetClose asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-brand-neutral-dark hover:bg-brand-primary/30 rounded-full"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </Button>
        </SheetClose>
      </SheetHeader>

      <article className="flex flex-col gap-4 px-8">
        {/* 이미지 캐러솔 영역 */}
        <ImageCarousel images={project.images} />
        {/* 프로젝트 설명 영역 */}

        {/* 프로젝트 소개 영역 */}

        {/* 기술 스택 영역 */}

        {/* 아키텍처 영역 */}

        {/* 주요 기능 영역 */}

        {/* 트러블 슈팅 영역 */}

        {/* 회고 영역 */}
      </article>
    </div>
  );
};

export default ProjectDetail;
