'use client';

import { useState } from 'react';

import { Menu } from 'lucide-react';

import ThemeToggle from '@/components/common/ThemeToggle';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PORTFOLIO_SECTIONS } from '@/features/portfolio/constants/sections';
import { useActiveSection } from '@/hooks/useActiveSection';
import { cn } from '@/lib/utils';

const MobileNav = () => {
  const { activeSection, scrollTo } = useActiveSection(PORTFOLIO_SECTIONS);
  const [open, setOpen] = useState(false);

  const handleMenuClick = (id: string) => {
    scrollTo(id);
    setOpen(false); // 메뉴 클릭 시 서랍 닫기
  };

  return (
    <div className="fixed top-6 left-6 z-50 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="bg-brand-neutral-muted text-brand-neutral-dark flex h-10 w-10 items-center justify-center rounded-full shadow-sm">
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="bg-brand-neutral-light flex w-62.5 flex-col overflow-y-auto p-6"
        >
          <SheetTitle className="text-brand-primary mb-8 text-left">Menu</SheetTitle>
          <nav className="mb-6 flex flex-1 flex-col gap-6">
            {PORTFOLIO_SECTIONS.map((id) => (
              <button
                key={id}
                onClick={() => handleMenuClick(id)}
                className={cn(
                  'text-left text-lg font-medium transition-colors',
                  activeSection === id ? 'text-brand-primary' : 'text-brand-neutral-dark',
                )}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </nav>

          <div className="border-brand-neutral-muted mt-auto border-t pt-6">
            <div className="flex items-center justify-between">
              <span className="text-brand-neutral-dark font-medium">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
