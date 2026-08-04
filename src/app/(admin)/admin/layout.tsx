import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YS_Archive Admin',
  description: 'YS_Archive Admin Dashboard',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-admin-bg text-admin-text min-h-screen">
      <main>{children}</main>
    </div>
  );
}
