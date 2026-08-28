'use client';

import { useRef } from 'react';

import { Play } from 'lucide-react';
import { motion, useInView } from 'motion/react';

import { formatDate } from '@/lib/date';

import { ExperienceItem } from '../types';

interface ExperienceCardProps {
  experience: ExperienceItem;
  index: number;
}

const DOT_CLASSES =
  'bg-brand-primary z-10 h-3.5 w-3.5 shrink-0 rounded-full ring-0 ring-brand-primary/0 transition-all duration-500 ease-out group-hover:ring-6 group-hover:ring-brand-primary/30';

const ExperienceCard = ({ experience, index }: ExperienceCardProps): React.JSX.Element => {
  const ref = useRef<HTMLLIElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col gap-4 md:flex-row md:gap-6"
    >
      {/* 모바일 전용 수평 타임라인 */}
      <div className="flex items-center gap-3 md:hidden">
        <div className={DOT_CLASSES} />
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
        <div className={DOT_CLASSES} />
        <div className="bg-brand-primary/30 mt-1 w-px flex-1" /> {/* 세로선 */}
      </div>

      <div className="bg-brand-neutral-muted group-hover:bg-brand-neutral-dark group-hover:shadow-brand-neutral-dark/20 flex-1 rounded-2xl p-5 shadow-none transition-all duration-300 group-hover:shadow-2xl">
        {/* 경험/학력 항목의 본문 내용 */}
        <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          {/* 타이틀 및 모바일 전용 핀 */}
          <div className="flex w-full items-start justify-between md:w-auto">
            <div>
              <h3 className="text-brand-neutral-dark group-hover:text-brand-neutral-light leading-tight font-bold transition-colors duration-300">
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
                  className="bg-brand-neutral-dark text-brand-neutral-muted group-hover:bg-brand-primary group-hover:text-brand-neutral-dark group-hover:ring-brand-primary/30 rounded-md px-2 py-0.5 font-mono text-xs transition-all duration-300 group-hover:ring-1"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-brand-secondary text-sm leading-relaxed">{experience.description}</p>

        <ul className="border-brand-secondary/50 mt-4 space-y-2 border-t pt-4">
          {experience.details?.map((detail, detailIdx) => (
            <li
              key={detailIdx}
              className="text-brand-neutral-dark group-hover:text-brand-neutral-light flex items-start gap-2 text-sm leading-relaxed transition-colors duration-300"
            >
              <div className="text-brand-primary mt-1.25 flex shrink-0 items-center justify-center">
                <Play size={10} fill="var(--brand-primary)" />
              </div>
              {detail}
            </li>
          ))}
        </ul>
      </div>
    </motion.li>
  );
};

export default ExperienceCard;
