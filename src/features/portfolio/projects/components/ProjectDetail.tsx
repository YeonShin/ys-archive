'use client';

import { XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import { Project } from '../type';
import ImageCarousel from './ImageCarousel';
import ProjectExternalLinks from './ProjectExternalLinks';
import ProjectMetaInfo from './ProjectMetaInfo';
import ProjectSubtitle from './ProjectSubtitle';
import ProjectTechStacks from './ProjectTechStacks';
import ProjectTitleHeader from './ProjectTitleHeader';

interface ProjectDetailProps {
  project: Project;
}

interface DetailHeaderProps {
  title: string;
}

const DetailHeader = ({ title }: DetailHeaderProps) => {
  return (
    <header>
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-brand-primary h-5 w-1 shrink-0 rounded-full" />
        <h3 className="text-brand-neutral-dark font-bold">{title}</h3>
      </div>

      <div className="bg-brand-secondary/30 h-px w-full rounded-full" />
    </header>
  );
};

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

      <article className="flex flex-col gap-8 px-8">
        {/* 이미지 캐러솔 영역 */}
        <ImageCarousel images={project.images} />
        {/* 프로젝트 설명 영역 */}
        <div className="bg-brand-neutral-muted flex w-full flex-col justify-center gap-4 rounded-2xl px-5 py-8">
          <ProjectTitleHeader title={project.title} status={project.status} />

          {project.subtitle && <ProjectSubtitle subtitle={project.subtitle} />}

          <ProjectMetaInfo
            startedAt={project.startedAt}
            endedAt={project.endedAt}
            role={project.role}
          />

          <ProjectExternalLinks links={project.links} />
        </div>

        {/* 프로젝트 소개 영역 */}
        <div className="flex flex-col gap-4">
          <DetailHeader title="프로젝트 소개" />
          <div className="leading-8">{project.description}</div>
        </div>
        {/* 기술 스택 영역 */}
        <div className="flex flex-col gap-4">
          <DetailHeader title="기술 스택" />
          <ProjectTechStacks techStacks={project.techStacks} isReasonVisible={true} />
          <div className="text-brand-secondary/70 text-sm font-light">
            각 기술 위에 마우스를 올리면 선택 이유를 확인할 수 있습니다
          </div>
        </div>

        {/* 아키텍처 영역 */}

        {/* 주요 기능 영역 */}

        {/* 트러블 슈팅 영역 */}

        {/* 회고 영역 */}
      </article>
    </div>
  );
};

export default ProjectDetail;
