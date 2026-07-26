'use client';

import { Moon, Sun } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/theme-provider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      className="bg-brand-neutral-muted text-brand-neutral-dark hover:bg-brand-secondary/20 fixed top-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-colors"
    >
      <span className="relative flex h-full w-full items-center justify-center">
        <Sun
          className={cn(
            'absolute h-5 w-5 transition-transform duration-500',
            theme === 'dark' ? 'scale-0 rotate-90' : 'scale-100 rotate-0',
          )}
        />
        <Moon
          className={cn(
            'absolute h-5 w-5 transition-transform duration-500',
            theme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90',
          )}
        />
      </span>
    </button>
  );
}
