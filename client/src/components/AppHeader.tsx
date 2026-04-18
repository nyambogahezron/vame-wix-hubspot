import { ArrowLeftRight, House, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export function AppHeader() {
  return (
    <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm">
            <ArrowLeftRight className="h-4 w-4" aria-hidden />
          </span>
          <span className="hidden sm:inline">Vame Wix ↔ HubSpot</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
          >
            <House className="h-4 w-4" aria-hidden />
            Home
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
          >
            <LayoutDashboard className="h-4 w-4" aria-hidden />
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
