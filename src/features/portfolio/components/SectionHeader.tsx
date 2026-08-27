'use client';

import { motion } from 'motion/react';

interface SectionHeaderProps {
  title: string;
  korTitle: string;
  className?: string;
}

const SectionHeader = ({ title, korTitle, className }: SectionHeaderProps) => {
  return (
    <motion.header className={className}>
      <p className="text-brand-primary text-md mb-3 font-mono font-bold tracking-[0.3em] uppercase">
        {title}
      </p>
      <h2 className="text-brand-neutral-dark tracking-light text-3xl font-extrabold md:text-4xl">
        {korTitle}
      </h2>
    </motion.header>
  );
};

export default SectionHeader;
