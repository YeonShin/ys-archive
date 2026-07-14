import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YS_Archive Admin",
  description: "YS_Archive Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50">
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="font-semibold text-lg">Portfolio Admin</h1>
          <a
            href="/"
            className="text-sm font-medium hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            View Site
          </a>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}
