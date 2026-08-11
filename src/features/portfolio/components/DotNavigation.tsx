'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PORTFOLIO_SECTIONS } from '@/features/portfolio/constants/sections';
import { useActiveSection } from '@/hooks/useActiveSection';
import { cn } from '@/lib/utils';

const DotNavigation = () => {
  const { activeSection, scrollTo } = useActiveSection(PORTFOLIO_SECTIONS);
  return (
    <TooltipProvider delayDuration={100}>
      <nav className="fixed top-1/2 right-6 z-50 hidden -translate-y-1/2 flex-col gap-6 lg:flex">
        {PORTFOLIO_SECTIONS.map((id) => (
          <Tooltip key={id}>
            <TooltipTrigger asChild>
              <button
                key={id}
                onClick={() => scrollTo(id)}
                aria-label={`Scroll to ${id}`}
                className="flex cursor-pointer items-center justify-center p-1"
              >
                <div
                  className={cn(
                    'h-3 w-3 rounded-full transition-all duration-300',
                    activeSection === id
                      ? 'bg-brand-primary ring-brand-primary/30 scale-125 ring-4'
                      : 'border-brand-primary hover:bg-brand-primary/30 border-2',
                  )}
                ></div>
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
