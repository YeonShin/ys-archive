import { XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Markdown from '@/components/ui/markdown';
import { SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import { Project } from '../type';
import ArchitectureItem from './ArchitectureItem';
import DetailSectionHeader from './DetailSectionHeader';
import FeatureItem from './FeatureItem';
import ImageCarousel from './ImageCarousel';
import ProjectExternalLinks from './ProjectExternalLinks';
import ProjectMetaInfo from './ProjectMetaInfo';
import ProjectSubtitle from './ProjectSubtitle';
import ProjectTechStacks from './ProjectTechStacks';
import ProjectTitleHeader from './ProjectTitleHeader';
import TroubleshootingItem from './TroubleshootingItem';

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail = ({ project }: ProjectDetailProps) => {
  return (
    <div className="mb-6 flex flex-col gap-4">
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
        <ImageCarousel images={project.images?.map((url) => ({ url }))} />
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
          <DetailSectionHeader title="프로젝트 소개" />
          <div className="leading-8">{project.description}</div>
        </div>
        {/* 기술 스택 영역 */}
        <div className="flex flex-col gap-4">
          <DetailSectionHeader title="기술 스택" />
          <ProjectTechStacks techStacks={project.techStacks} isReasonVisible={true} />
          <div className="text-brand-secondary/70 text-sm font-light">
            각 기술 위에 마우스를 올리면 선택 이유를 확인할 수 있습니다
          </div>
        </div>

        {/* 아키텍처 영역 */}
        <div className="flex flex-col gap-4">
          <DetailSectionHeader title="아키텍처" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-1 md:grid-cols-2">
            {project.architecture?.map((architecture, index) => (
              <ArchitectureItem architecture={architecture} key={index} />
            ))}
          </div>
        </div>

        {/* 주요 기능 영역 */}
        <div className="flex flex-col gap-4">
          <DetailSectionHeader title="주요 기능 개발" />
          <div className="space-y-6">
            {project.keyFeatures?.map((feature, index) => (
              <FeatureItem feature={feature} index={index + 1} key={index} />
            ))}
          </div>
        </div>

        {/* 트러블 슈팅 영역 */}
        <div className="flex flex-col gap-4">
          <DetailSectionHeader title="트러블 슈팅" />
          {project.troubleshooting?.map((item, index) => (
            <TroubleshootingItem troubleshooting={item} key={index} />
          ))}
        </div>

        {/* 회고 영역 */}
        {project.retrospective && (
          <div className="flex flex-col gap-4">
            <DetailSectionHeader title="프로젝트 회고" />
            <div className="bg-brand-neutral-muted w-full rounded-2xl p-4">
              <Markdown content={project.retrospective} />
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default ProjectDetail;
