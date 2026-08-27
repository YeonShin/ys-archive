'use client';

import { useRef, useState } from 'react';

import { Play } from 'lucide-react';
import { motion, useInView } from 'motion/react';

import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';

import { ExperienceItem } from '../types';

interface ExperienceCardProps {
  experience: ExperienceItem;
  index: number;
}

const ExperienceCard = ({ experience, index }: ExperienceCardProps) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const dotClasses = cn(
    'bg-brand-primary z-10 h-3.5 w-3.5 shrink-0 rounded-full transition-shadow duration-500 ease-out',
    hovered ? 'ring-brand-primary/30 ring-6' : 'ring-brand-primary/0 ring-0',
  );

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4 md:flex-row md:gap-6"
    >
      {/* 모바일 전용 수평 타임라인 */}
      <div className="flex items-center gap-3 md:hidden">
        <div className={dotClasses} />
        <span className="text-brand-primary font-mono text-xs">
          {`${formatDate(experience.startedAt)} - ${formatDate(experience.endedAt)}`}
        </span>
        <div className="bg-brand-primary/30 h-px flex-1" />
      </div>

      {/* 데스크탑 전용 수직 타임라인 */}
      {/* 기간 */}
      <div className="hidden w-36 shrink-0 pt-5 text-right font-mono md:block">
        <p className="text-brand-primary font-mono text-xs leading-relaxed whitespace-nowrap">
          {`${formatDate(experience.startedAt)} - ${formatDate(experience.endedAt)}`}
        </p>
      </div>

      <div className="hidden shrink-0 flex-col items-center pt-5 md:flex">
        <div className={dotClasses} />
        <div className="bg-brand-primary/30 mt-1 w-px flex-1" /> {/* 세로선 */}
      </div>

      <motion.div
        className={cn(
          'flex-1 rounded-2xl p-5 transition-all duration-300',
          hovered
            ? 'bg-brand-neutral-dark shadow-brand-neutral-dark/20 shadow-2xl'
            : 'bg-brand-neutral-muted shadow-none',
        )}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        {/* 경험/학력 항목의 본문 내용 */}
        <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          {/* 타이틀 및 모바일 전용 핀 */}
          <div className="flex w-full items-start justify-between md:w-auto">
            <div>
              <h3
                className={cn(
                  'leading-tight font-bold',
                  hovered ? 'text-brand-neutral-light' : 'text-brand-neutral-dark',
                )}
              >
                {experience.title}
              </h3>
              <p className="text-brand-secondary mt-0.5 font-mono text-xs">
                {experience.organization}
              </p>
            </div>
          </div>

          {/* 기술스택 리스트 및 데스크탑 전용 핀 */}
          <div className="flex w-full items-center justify-start gap-2 md:w-auto md:justify-end">
            {/* 기술스택 */}
            <div className="flex flex-1 flex-wrap justify-start gap-1.5 md:flex-initial md:justify-end">
              {experience.techStacks?.map((tech, idx) => (
                <span
                  key={idx}
                  className={cn(
                    'rounded-md px-2 py-0.5 font-mono text-xs transition-all duration-300',
                    hovered
                      ? 'bg-brand-primary text-brand-neutral-dark ring-brand-primary/30 ring-1'
                      : 'bg-brand-neutral-dark text-brand-neutral-muted',
                  )}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-brand-secondary text-sm leading-relaxed">{experience.description}</p>

        <ul className="border-brand-secondary/50 mt-4 space-y-2 border-t pt-4">
          {experience.details?.map((detail, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.07, duration: 0.25 }}
              className={cn(
                'flex items-start gap-2 text-sm leading-relaxed',
                hovered ? 'text-brand-neutral-light' : 'text-brand-neutral-dark',
              )}
            >
              <div className="text-brand-primary mt-1.25 flex shrink-0 items-center justify-center">
                <Play size={10} fill="var(--brand-primary)" />
              </div>
              {detail}
            </motion.div>
          ))}
        </ul>
      </motion.div>
    </motion.li>
  );
};

export default ExperienceCard;
