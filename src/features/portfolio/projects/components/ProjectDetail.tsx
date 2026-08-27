import { Maximize2Icon, Minimize2Icon, XIcon } from 'lucide-react';

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
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const ProjectDetail = ({ project, isFullscreen, onToggleFullscreen }: ProjectDetailProps) => {
  return (
    <div className="mb-6 flex flex-col gap-4">
      <SheetHeader className="flex flex-row items-center justify-between px-8 py-6">
        <div className="from-brand-secondary to-brand-primary absolute inset-x-0 top-0 h-0.75 bg-linear-0" />
        <SheetTitle className="text-brand-secondary box-content font-mono text-sm">
          Project Details
        </SheetTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-brand-neutral-dark hover:bg-brand-primary/30 focus-visible:ring-brand-primary hidden rounded-full focus-visible:ring-2 sm:flex"
            aria-label={isFullscreen ? '창 축소' : '전체 화면으로 보기'}
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2Icon aria-hidden="true" />
            ) : (
              <Maximize2Icon aria-hidden="true" />
            )}
          </Button>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-brand-neutral-dark hover:bg-brand-primary/30 focus-visible:ring-brand-primary rounded-full focus-visible:ring-2"
              aria-label="닫기"
            >
              <XIcon aria-hidden="true" />
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <article className="flex flex-col gap-8 px-8">
        {/* 이미지 캐러솔 영역 */}
        <ImageCarousel images={project.images?.map((url) => ({ url }))} />
        {/* 프로젝트 설명 영역 */}
        <section className="bg-brand-neutral-muted flex w-full flex-col justify-center gap-4 rounded-2xl px-5 py-8">
          <ProjectTitleHeader title={project.title} status={project.status} />

          {project.subtitle && <ProjectSubtitle subtitle={project.subtitle} />}

          <ProjectMetaInfo
            startedAt={project.startedAt}
            endedAt={project.endedAt}
            role={project.role}
          />

          <ProjectExternalLinks links={project.links} />
        </section>

        {/* 프로젝트 소개 영역 */}
        <section className="flex flex-col gap-4">
          <DetailSectionHeader title="프로젝트 소개" />
          <Markdown content={project.description} className="leading-relaxed" />
        </section>
        {/* 기술 스택 영역 */}
        <section className="flex flex-col gap-4">
          <DetailSectionHeader title="기술 스택" />
          <ProjectTechStacks techStacks={project.techStacks} isReasonVisible={true} />
          <p
            className="text-brand-secondary/70 hidden text-sm font-light italic sm:block"
            aria-hidden="true"
          >
            각 기술 위에 마우스를 올리면 선택 이유를 확인할 수 있습니다
          </p>

          <p
            className="text-brand-secondary/70 text-sm font-light italic sm:hidden"
            aria-hidden="true"
          >
            각 기술을 터치하면 선택 이유를 확인할 수 있습니다
          </p>
        </section>

        {/* 아키텍처 영역 */}
        <section className="flex flex-col gap-4">
          <DetailSectionHeader title="아키텍처" />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {project.architecture?.map((architecture, index) => (
              <li key={index}>
                <ArchitectureItem architecture={architecture} />
              </li>
            ))}
          </ul>
        </section>

        {/* 주요 기능 영역 */}
        <section className="flex flex-col gap-4">
          <DetailSectionHeader title="주요 기능 개발" />
          <ul className="space-y-6">
            {project.keyFeatures?.map((feature, index) => (
              <li key={index}>
                <FeatureItem feature={feature} index={index + 1} />
              </li>
            ))}
          </ul>
        </section>

        {/* 트러블 슈팅 영역 */}
        <section className="flex flex-col gap-4">
          <DetailSectionHeader title="트러블 슈팅" />
          <ul className="flex flex-col gap-4">
            {project.troubleshooting?.map((item, index) => (
              <li key={index}>
                <TroubleshootingItem troubleshooting={item} />
              </li>
            ))}
          </ul>
        </section>

        {/* 회고 영역 */}
        {project.retrospective && (
          <section className="flex flex-col gap-4">
            <DetailSectionHeader title="프로젝트 회고" />
            <div className="bg-brand-neutral-muted w-full rounded-2xl p-4">
              <Markdown content={project.retrospective} />
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

export default ProjectDetail;
