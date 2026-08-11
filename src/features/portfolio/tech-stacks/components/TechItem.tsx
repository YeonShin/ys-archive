'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { iconMap, normalizeIconName } from '@/lib/iconMap';
import { cn } from '@/lib/utils';

import { TechItem as TechItemType } from '../types';

interface TechItemProps {
  tech: TechItemType;
  isFilteredOut: boolean;
}

const TechItem = ({ tech, isFilteredOut }: TechItemProps) => {
  const searchKey = tech.icon ? normalizeIconName(tech.icon) : normalizeIconName(tech.name);
  const IconComponent = iconMap[searchKey] || null;

  return (
    <li className="list-none">
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            tabIndex={0}
            role="button"
            aria-label={`${tech.name}${tech.level ? ` (숙련도: ${tech.level})` : ''}`}
            aria-disabled={isFilteredOut}
            className={cn(
              'focus-visible:ring-brand-primary flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:h-16 sm:w-16 md:h-20 md:w-20',
              isFilteredOut
                ? 'pointer-events-none scale-95 opacity-30 blur-sm grayscale'
                : 'cursor-pointer hover:-translate-y-1 hover:shadow-md',
            )}
            style={{ backgroundColor: tech.color ? tech.color : 'var(--brand-secondary)' }}
          >
            {IconComponent ? (
              <IconComponent
                className="text-brand-neutral-light text-2xl sm:text-3xl md:text-4xl"
                aria-hidden="true"
              />
            ) : (
              <span
                className="text-brand-neutral-light font-mono text-lg font-bold sm:text-xl md:text-3xl"
                aria-hidden="true"
              >
                {tech.icon ? tech.icon.substring(0, 2) : tech.name.substring(0, 2)}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-brand-neutral-dark fill-brand-neutral-dark flex flex-col items-center font-mono transition-all duration-300"
        >
          <p className="text-brand-neutral-light font-bold" aria-hidden="true">
            {tech.name}
          </p>
          {tech.level && (
            <p className="text-brand-neutral-light text-[10px] opacity-80" aria-hidden="true">
              {tech.level}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </li>
  );
};

export default TechItem;
