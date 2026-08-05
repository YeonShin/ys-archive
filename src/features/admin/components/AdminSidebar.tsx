'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Blocks, BookOpen, Briefcase, FolderGit2, LayoutDashboard, User } from 'lucide-react';

import { cn } from '@/lib/utils';

const navItems = [
  { name: '대시보드', href: '/admin', icon: LayoutDashboard },
  { name: '프로필 관리', href: '/admin/about', icon: User },
  { name: '경력/학력 관리', href: '/admin/experience', icon: Briefcase },
  { name: '프로젝트 관리', href: '/admin/projects', icon: FolderGit2 },
  { name: '기술 스택 관리', href: '/admin/tech-stacks', icon: Blocks },
  { name: '방명록 관리', href: '/admin/guestbook', icon: BookOpen },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="bg-admin-card border-admin-border sticky top-16 flex h-[calc(100vh-4rem)] w-64 flex-col border-r">
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-admin-muted/30 text-admin-text shadow-sm'
                  : 'text-admin-muted/70 hover:text-admin-text hover:bg-admin-border',
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
