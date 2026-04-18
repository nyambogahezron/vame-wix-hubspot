import { ArrowRight, GitBranch, Link2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-4 py-16 sm:px-6">
      <section className="text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-orange-600 dark:text-orange-400">
          Self-hosted integration
        </p>
        <h1 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Sync Wix and HubSpot on your terms
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          Connect HubSpot with OAuth, map contact fields between Wix and
          HubSpot, and run the stack on your own VPS or Docker host.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-zinc-900 px-8 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Open dashboard
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <a
            href="https://developers.hubspot.com/docs/api/oauth-quickstart-guide"
            className="text-sm font-medium text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
            target="_blank"
            rel="noreferrer"
          >
            HubSpot OAuth overview
          </a>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <Link2 className="h-5 w-5" aria-hidden />
          </div>
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
            OAuth connection
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Start HubSpot authorization from the dashboard; tokens are stored
            server-side for your Wix site id.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <GitBranch className="h-5 w-5" aria-hidden />
          </div>
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Field mappings
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Map Wix fields to HubSpot contact properties with direction and
            optional transforms.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <ShieldCheck className="h-5 w-5" aria-hidden />
          </div>
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
            VPS-ready
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Built as a simple monolith: Express API plus this Next.js UI,
            aligned with self-hosted Linux deployments.
          </p>
        </div>
      </section>
    </main>
  );
}
