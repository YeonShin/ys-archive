import Image from 'next/image';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Markdown from '@/components/ui/markdown';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ImageCarousel from '@/features/portfolio/projects/components/ImageCarousel';

import { Project } from '../../types';

interface ProjectItemContentProps {
  project: Project;
}

export const ProjectItemContent = ({ project }: ProjectItemContentProps) => {
  return (
    <div className="space-y-8 p-6 pt-0">
      <div className="bg-admin-border h-px w-full" />

      {project.images && project.images.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-admin-text text-lg font-semibold">스크린샷</h3>
          <div className="border-admin-border bg-admin-muted/5 rounded-xl border p-4">
            <ImageCarousel images={project.images.map((url) => ({ url }))} />
          </div>
          <div className="bg-admin-border mt-8 h-px w-full" />
        </section>
      )}

      <section className="space-y-4">
        <h3 className="text-admin-text text-lg font-semibold">프로젝트 설명</h3>
        <Markdown
          content={project.description}
          className="text-admin-muted leading-relaxed whitespace-pre-wrap"
        />
      </section>

      {project.tech_stacks && project.tech_stacks.length > 0 && (
        <>
          <div className="bg-admin-border h-px w-full" />
          <section className="space-y-4">
            <h3 className="text-admin-text text-lg font-semibold">기술 스택</h3>
            <div className="flex flex-wrap gap-2">
              <TooltipProvider delayDuration={100}>
                {project.tech_stacks.map((stack, i) => (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <div className="focus:ring-ring border-admin-primary/30 text-admin-primary hover:bg-admin-primary hover:bg-admin-text hover:text-admin-card inline-flex cursor-help items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none">
                        {stack.name}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      align="center"
                      className="bg-admin-border text-admin-text border-admin-border fill-admin-border text-sm font-semibold shadow-md"
                    >
                      {stack.reason}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </section>
        </>
      )}

      {project.key_features && project.key_features.length > 0 && (
        <>
          <div className="bg-admin-border h-px w-full" />
          <section className="space-y-4">
            <h3 className="text-admin-text text-lg font-semibold">주요 기능</h3>
            <div className="space-y-6">
              {project.key_features.map((feature, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-admin-primary/20 text-admin-primary rounded-lg px-2 py-1 font-mono text-xs font-bold">
                      {idx < 9 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <h4 className="text-md text-admin-text font-semibold">{feature.title}</h4>
                  </div>
                  <ul className="space-y-1.5 pl-2">
                    {feature.desc.map((descItem, dIdx) => (
                      <li key={dIdx} className="text-admin-muted flex gap-2 text-sm">
                        <span className="text-admin-muted shrink-0 pt-0.5 text-xs">▸</span>
                        <Markdown
                          content={descItem}
                          className="text-admin-muted leading-relaxed whitespace-pre-wrap"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {project.architecture && project.architecture.length > 0 && (
        <>
          <div className="bg-admin-border h-px w-full" />
          <section className="space-y-4">
            <h3 className="text-admin-text text-lg font-semibold">시스템 아키텍처</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {project.architecture.map((arch, idx) => (
                <Dialog key={idx}>
                  <DialogTrigger asChild>
                    <div className="group bg-admin-muted/10 border-admin-border/50 relative aspect-4/3 w-full cursor-zoom-in overflow-hidden rounded-xl border">
                      <Image fill src={arch.url} alt={arch.name} className="object-contain p-2" />
                      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col bg-linear-to-t from-black/80 to-transparent p-4 pt-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <p className="text-sm font-bold text-white">{arch.name}</p>
                        {arch.caption && (
                          <p className="mt-1 text-xs text-white/70">{arch.caption}</p>
                        )}
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="bg-admin-card border-admin-border max-w-4xl p-0">
                    <DialogTitle className="sr-only">{arch.name}</DialogTitle>
                    <div className="relative h-[80vh] w-full">
                      <Image fill src={arch.url} alt={arch.name} className="object-contain" />
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </section>
        </>
      )}

      {project.troubleshooting && project.troubleshooting.length > 0 && (
        <>
          <div className="bg-admin-border h-px w-full" />
          <section className="space-y-4">
            <h3 className="text-admin-text text-lg font-semibold">트러블슈팅</h3>
            <div className="space-y-6">
              {project.troubleshooting.map((ts, idx) => (
                <div
                  key={idx}
                  className="bg-admin-muted/5 border-admin-border/50 w-full rounded-2xl border p-5"
                >
                  {ts.images && ts.images.length > 0 && (
                    <div className="border-admin-border bg-admin-muted/10 mb-6 rounded-xl border p-2">
                      <ImageCarousel images={ts.images} />
                    </div>
                  )}
                  <h4 className="text-admin-primary mb-4 text-lg font-bold">{ts.title}</h4>
                  <ul className="flex flex-col gap-4">
                    {[
                      { label: '문제 상황', content: ts.problem, color: 'text-red-500' },
                      { label: '원인 분석', content: ts.cause, color: 'text-blue-500' },
                      { label: '해결 과정', content: ts.process, color: 'text-amber-500' },
                      { label: '결과 및 성과', content: ts.result, color: 'text-green-500' },
                    ].map(
                      (step, sIdx) =>
                        step.content && (
                          <li key={sIdx} className="flex flex-col gap-2">
                            <span
                              className={`flex items-center gap-2 text-sm font-bold ${step.color}`}
                            >
                              • {step.label}
                            </span>
                            <div className="border-admin-border ml-1 border-l-2 pl-4">
                              <Markdown
                                content={step.content}
                                className="text-admin-muted text-sm leading-relaxed whitespace-pre-wrap"
                              />
                            </div>
                          </li>
                        ),
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {project.retrospective && (
        <>
          <div className="bg-admin-border h-px w-full" />
          <section className="space-y-4">
            <h3 className="text-admin-text text-lg font-semibold">회고</h3>
            <Markdown
              content={project.retrospective}
              className="text-admin-muted bg-admin-muted/5 border-admin-border/50 rounded-md border p-4 leading-relaxed whitespace-pre-wrap"
            />
          </section>
        </>
      )}
    </div>
  );
};
