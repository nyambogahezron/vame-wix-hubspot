"use client";

import { LogIn, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function HeaderAuth() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const onSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

  if (isPending) {
    return (
      <span
        className="rounded-md px-3 py-2 text-xs text-zinc-400"
        aria-live="polite"
      >
        …
      </span>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <span
          className="hidden max-w-[10rem] truncate text-xs text-zinc-500 sm:inline"
          title={session.user.email}
        >
          <UserRound
            className="mr-1 inline h-3.5 w-3.5 align-text-bottom"
            aria-hidden
          />
          {session.user.email}
        </span>
        <button
          type="button"
          onClick={() => void onSignOut()}
          className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/sign-in"
        className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
      >
        <LogIn className="h-4 w-4" aria-hidden />
        Sign in
      </Link>
      <Link
        href="/sign-up"
        className="rounded-md px-3 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
      >
        Sign up
      </Link>
    </div>
  );
}
