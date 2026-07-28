'use client';

import { useRef, useState } from 'react';

import { Pin, Play } from 'lucide-react';
import { AnimatePresence, motion, useInView } from 'motion/react';

import { formatDate } from '@/lib/date';

import { ExperienceItem } from '../types';

interface ExperienceCardProps {
  experience: ExperienceItem;
  index: number;
  pinned: boolean;
  onPin: () => void;
}

const ExperienceCard = ({ experience, index, pinned, onPin }: ExperienceCardProps) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const open = hovered || pinned;

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6 md:flex-row"
    >
      {/* 기간 */}
      <div className="w-36 shrink-0 pt-5 text-right font-mono">
        <p className="text-brand-primary whitescape-nowrap font-mono text-xs leading-relaxed">
          {`${formatDate(experience.startedAt)} - ${formatDate(experience.endedAt)}`}
        </p>
      </div>

      {/* 타임라인 */}
      <div className="flex shrink-0 flex-col items-center pt-5">
        <div
          className={`bg-brand-primary z-10 h-3.5 w-3.5 shrink-0 rounded-full transition-shadow duration-500 ease-out ${
            pinned
              ? 'ring-brand-primary/30 ring-6'
              : hovered
                ? 'ring-brand-primary/15 ring-4'
                : 'ring-brand-primary/0 ring-0'
          }`}
        />
        <div className="bg-brand-primary/30 mt-1 w-px flex-1" /> {/* 세로선 */}
      </div>

      <motion.div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        className={`focus-visible:ring-brand-primary flex-1 cursor-pointer rounded-2xl p-5 transition-all duration-300 select-none focus-visible:ring-2 focus-visible:outline-none ${
          pinned
            ? 'bg-brand-neutral-dark shadow-brand-neutral-dark/20 shadow-2xl'
            : 'bg-brand-neutral-muted hover:shadow-brand-neutral-dark/15 shadow-none hover:shadow-xl'
        }`}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={onPin}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPin();
          }
        }}
      >
        {/* 경험/학력 항목의 본문 내용 */}
        <div className="mb-2 flex items-start justify-between gap-3">
          {/* 타이틀 */}
          <div>
            <h3
              className={`leading-tight font-bold ${pinned ? 'text-brand-neutral-light' : 'text-brand-neutral-dark'}`}
            >
              {experience.title}
            </h3>
            <p className={`text-brand-secondary mt-0.5 font-mono text-xs`}>
              {experience.organization}
            </p>
          </div>

          {/* 기술스택 및 핀 */}
          <div className="flex shrink-0 items-center gap-2">
            <motion.div
              animate={{ opacity: open ? 1 : 0, rotate: pinned ? 0 : -45 }}
              transition={{ duration: 0.2 }}
              className={`${pinned ? 'text-brand-primary' : 'text-brand-secondary'}`}
              title={pinned ? '클릭하면 고정 해제' : '클릭하면 고정'}
            >
              <Pin
                size={14}
                fill={`${pinned ? 'var(--brand-primary)' : 'var(--brand-secondary)'}`}
              />
            </motion.div>

            <div className="flex flex-wrap justify-end gap-1.5">
              {experience.techStacks?.map((tech) => {
                return (
                  <span
                    className={`rounded-md px-2 py-0.5 font-mono text-xs ${
                      pinned
                        ? 'bg-brand-primary text-brand-neutral-dark'
                        : 'bg-brand-neutral-dark text-brand-neutral-muted'
                    }`}
                    key={tech}
                  >
                    {tech}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-brand-secondary text-sm leading-relaxed">{experience.description}</p>

        {/* 세부 사항 아코디언 */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <ul className="border-brand-secondary/50 mt-4 space-y-2 border-t pt-4">
                {experience.details?.map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.07, duration: 0.25 }}
                    className={`flex items-start gap-2 text-sm leading-relaxed ${
                      pinned ? 'text-brand-neutral-light' : 'text-brand-neutral-dark'
                    }`}
                  >
                    <div className="text-brand-primary mt-1.25 flex shrink-0 items-center justify-center">
                      <Play size={10} fill="var(--brand-primary)" />
                    </div>
                    {detail}
                  </motion.div>
                ))}
              </ul>

              {pinned && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-brand-secondary mt-4 text-right font-mono text-[10px]"
                >
                  클릭하여 고정 해제
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.li>
  );
};

export default ExperienceCard;
