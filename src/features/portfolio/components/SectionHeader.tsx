'use client';

import { motion } from 'motion/react';

interface SectionHeaderProps {
  title: string;
  korTitle: string;
}

const SectionHeader = ({ title, korTitle }: SectionHeaderProps) => {
  return (
    <motion.header>
      <p className="text-brand-primary mb-3 font-mono text-sm tracking-[0.3em] uppercase">
        {title}
      </p>
      <h2 className="text-brand-neutral-dark tracking-light text-3xl font-extrabold md:text-4xl">
        {korTitle}
      </h2>
    </motion.header>
  );
};

export default SectionHeader;
