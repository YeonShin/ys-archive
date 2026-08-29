import { Globe } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

import { cn } from '@/lib/utils';

interface ProjectLinkIconProps {
  label: string;
  url: string;
  className?: string;
}

export const ProjectLinkIcon = ({ label, url, className }: ProjectLinkIconProps) => {
  const isGithub =
    label.toLowerCase().includes('github') || url.toLowerCase().includes('github.com');

  if (isGithub) {
    return (
      <FaGithub
        aria-hidden="true"
        className={cn('h-4 w-4 shrink-0 text-black dark:text-white', className)}
      />
    );
  }

  return <Globe aria-hidden="true" className={cn('h-4 w-4 shrink-0', className)} />;
};
