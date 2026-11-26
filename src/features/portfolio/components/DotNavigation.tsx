'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PORTFOLIO_SECTIONS, SectionId } from '@/features/portfolio/constants/sections';
import { useActiveSection } from '@/hooks/useActiveSection';
import { cn } from '@/lib/utils';

const SECTION_LABELS: Record<SectionId, string> = {
  hero: '메인으로 이동',
  about: '자기 소개로 이동',
  experience: '경력 및 학력으로 이동',
  tech: '기술 스택으로 이동',
  projects: '프로젝트로 이동',
  contact: '연락망 및 방명록으로 이동',
};

const DotNavigation = () => {
  const { activeSection, scrollTo } = useActiveSection(PORTFOLIO_SECTIONS);

  return (
    <TooltipProvider delayDuration={100}>
      <nav
        aria-label="섹션 탐색"
        className="fixed top-1/2 right-6 z-50 hidden -translate-y-1/2 flex-col gap-6 lg:flex"
      >
        {PORTFOLIO_SECTIONS.map((id) => (
          <Tooltip key={id}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => scrollTo(id)}
                aria-label={SECTION_LABELS[id]}
                aria-current={activeSection === id ? 'true' : undefined}
                className="focus-visible:ring-brand-primary flex cursor-pointer items-center justify-center rounded-full p-1 focus-visible:ring-2 focus-visible:outline-none"
              >
                <div
                  className={cn(
                    'h-3 w-3 rounded-full transition-all duration-300',
                    activeSection === id
                      ? 'bg-brand-primary ring-brand-primary/30 scale-125 ring-4'
                      : 'border-brand-primary hover:bg-brand-primary/30 border-2',
                  )}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={4}>
              <p className="text-xs font-medium">{id.charAt(0).toUpperCase() + id.slice(1)}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </TooltipProvider>
  );
};

export default DotNavigation;
