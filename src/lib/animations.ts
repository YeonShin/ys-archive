import { Transition, Variants } from 'motion/react';

interface ContainerVariantsOptions {
  staggerChildren?: number;
  delayChildren?: number;
}

export const getContainerVariants = ({
  staggerChildren = 0.2,
  delayChildren = 0,
}: ContainerVariantsOptions = {}): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

interface ItemVariantsOptions {
  y?: number;
  duration?: number;
  ease?: Transition['ease'];
}

export const getItemVariants = ({
  y = 30,
  duration = 0.6,
  ease = 'easeOut',
}: ItemVariantsOptions = {}): Variants => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      ease,
    },
  },
});
