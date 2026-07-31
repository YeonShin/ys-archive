import type { KeyboardEvent } from 'react';

import Image from 'next/image';

import { Project } from '../type';

const ProjectCardImagePanel = ({ project }: { project: Project }) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // TODO: 추후 상세 보기 모달 오픈 또는 페이지 이동 로직 추가
      // 추후 console.log 제거 예정이므로 예외적으로 컨벤션 미준수
      console.log(`자세히 보기: ${project.title}`);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${project.title} 프로젝트 자세히 보기`}
      onKeyDown={handleKeyDown}
      className="bg-brand-secondary/10 focus-visible:ring-brand-primary group focus-visible:ring-offset-brand-neutral-light relative flex aspect-4/3 w-full cursor-pointer flex-col justify-end overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:aspect-4/3 md:aspect-4/3"
    >
      <Image
        src={project.thumbnailUrl}
        alt={`${project.title} 썸네일`}
        aria-hidden="true"
        fill
        className="absolute inset-0 object-contain transition-transform duration-500 ease-out group-hover:scale-105"
      />

      {/* 전체 어두운 그라데이션 오버레이 (텍스트 가독성 확보) */}
      <div
        className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90"
        aria-hidden="true"
      />

      {/* 텍스트 컨텐츠 영역 */}
      <div className="relative z-10 flex flex-col gap-2 p-6 md:p-8">
        <h3 className="text-3xl leading-tight font-extrabold tracking-tight text-white drop-shadow-xl">
          {project.title}
        </h3>

        <div className="text-brand-primary flex items-center gap-2 font-mono text-sm font-semibold opacity-100 transition-all duration-300 group-hover:translate-x-2">
          자세히 보기
          <span aria-hidden="true" className="leading-none">
            →
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardImagePanel;
