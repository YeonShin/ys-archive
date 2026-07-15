import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "YS_Archive Admin",
  description: "YS_Archive Admin Dashboard",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50">
      <nav className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-lg font-semibold">Portfolio Admin</h1>
          <Link href="/">
            <p className="text-sm font-medium hover:text-zinc-600 dark:hover:text-zinc-300">
              View Site
            </p>
          </Link>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
