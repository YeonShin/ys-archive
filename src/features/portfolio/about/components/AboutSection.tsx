'use client';

import { ArrowUpRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Markdown from '@/components/ui/markdown';

import { AboutSectionData } from '../types';

const AboutSection = ({ data }: { data: AboutSectionData | null }) => {
  return (
    <section
      id="about"
      className="relative flex min-h-screen w-full flex-1 items-center justify-center px-6 py-24"
    >
      <div className="flex flex-col gap-10">
        {/* 상단 타이틀 */}
        <header>
          <p className="text-brand-primary mb-3 font-mono text-sm tracking-[0.3em] uppercase">
            About
          </p>
          <h2 className="text-brand-neutral-dark tracking-light text-4xl font-extrabold">
            자기 소개
          </h2>
        </header>
        <div className="flex flex-col items-center justify-center gap-12 md:flex-row">
          {/* 이미지 영역 */}
          <figure className="relative mx-auto aspect-3/4 w-full max-w-70 sm:max-w-sm">
            {/* 배경 오프셋 테두리 */}
            <div className="border-brand-primary/30 absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border-2" />

            {/* 이미지 컨테이너 */}
            <div className="bg-brand-neutral-muted relative h-full w-full overflow-hidden rounded-3xl shadow-2xl">
              {/* 이미지 */}
              {data?.profileImageUrl && (
                <img
                  className="h-full w-full object-cover object-center"
                  src={data.profileImageUrl}
                  alt="프로필 사진"
                />
              )}

              {/* 하단 그라디언트 */}
              <div className="from-brand-neutral-dark/30 absolute inset-0 bg-linear-to-t via-transparent to-transparent" />
            </div>

            {/* 우측 하단 이름 카드 */}
            <figcaption className="border-brand-primary/30 bg-brand-neutral-muted absolute -right-4 -bottom-4 rounded-2xl border px-4 py-3 shadow-lg">
              <p className="text-brand-neutral-dark text-sm leading-none font-extrabold">김연신</p>
              <p className="text-brand-primary mt-0.5 font-mono text-xs">Frontend Dev.</p>
            </figcaption>
          </figure>

          <article className="flex w-full max-w-lg flex-col items-start gap-8">
            <Markdown content={data?.aboutText || ''} className="w-full" />

            {data?.resumeUrl && (
              <Button
                variant="link"
                className="text-brand-secondary p-0 font-bold underline"
                asChild
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="이력서 보기"
                  href={data.resumeUrl}
                  className="hover:text-brand-primary inline-block transition-all duration-300 ease-out hover:translate-x-2"
                >
                  <ArrowUpRight /> 이력서 보기
                </a>
              </Button>
            )}
          </article>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
