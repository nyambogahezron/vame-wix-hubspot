"use client";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plug,
  RefreshCw,
  Server,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { fetchApiStatus, getApiBase } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { IntegrationSummary } from "@/types/integration";
import type { FieldMapping, MappingDirection } from "@/types/mapping";

const WIX_SITE_STORAGE_KEY = "vame.wixSiteId";

function formatDirection(direction: string): string {
  return direction.replace(/_/g, " ");
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [wixSiteId, setWixSiteId] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const [apiOk, setApiOk] = useState<boolean | null>(null);
  const [integration, setIntegration] = useState<IntegrationSummary | null>(
    null,
  );
  const [mappings, setMappings] = useState<FieldMapping[]>([]);

  const [loadingIntegration, setLoadingIntegration] = useState(false);
  const [loadingMappings, setLoadingMappings] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [newMapping, setNewMapping] = useState({
    wixField: "",
    hubspotProperty: "",
    direction: "both" as MappingDirection,
    transform: "" as string,
  });

  useEffect(() => {
    const stored = window.localStorage.getItem(WIX_SITE_STORAGE_KEY);
    setWixSiteId(stored ?? "test-site-id");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!sessionPending && !session?.user) {
      router.replace("/sign-in?callbackUrl=/dashboard");
    }
  }, [sessionPending, session, router]);

  const persistWixSiteId = (value: string) => {
    setWixSiteId(value);
    window.localStorage.setItem(WIX_SITE_STORAGE_KEY, value);
  };

  const loadIntegration = useCallback(async () => {
    if (!wixSiteId.trim()) return;
    setLoadingIntegration(true);
    setError(null);
    try {
      const base = getApiBase();
      const res = await fetch(
        `${base}/api/integration?wixSiteId=${encodeURIComponent(wixSiteId)}`,
      );
      const data = (await res.json()) as
        | IntegrationSummary
        | { error?: string };
      if (!res.ok) {
        setError(
          "error" in data && data.error
            ? data.error
            : `Integration request failed (${res.status})`,
        );
        setIntegration(null);
        return;
      }
      setIntegration(data as IntegrationSummary);
    } catch {
      setError(
        "Could not reach the integration API. Check NEXT_PUBLIC_API_BASE_URL and that the server is running.",
      );
      setIntegration(null);
    } finally {
      setLoadingIntegration(false);
    }
  }, [wixSiteId]);

  const loadMappings = useCallback(async () => {
    if (!wixSiteId.trim()) return;
    setLoadingMappings(true);
    setError(null);
    try {
      const base = getApiBase();
      const res = await fetch(
        `${base}/api/mappings?wixSiteId=${encodeURIComponent(wixSiteId)}`,
      );
      const data = await res.json();
      if (res.status === 404) {
        setMappings([]);
        setError(
          typeof data === "object" && data && "error" in data
            ? String((data as { error: string }).error)
            : "Integration not found. Connect HubSpot first.",
        );
        return;
      }
      if (!res.ok) {
        setMappings([]);
        setError(`Mappings request failed (${res.status})`);
        return;
      }
      setMappings(data as FieldMapping[]);
    } catch {
      setMappings([]);
      setError("Could not load mappings.");
    } finally {
      setLoadingMappings(false);
    }
  }, [wixSiteId]);

  const checkApi = useCallback(async () => {
    try {
      await fetchApiStatus();
      setApiOk(true);
    } catch {
      setApiOk(false);
    }
  }, []);

  useEffect(() => {
    checkApi();
  }, [checkApi]);

  useEffect(() => {
    if (!hydrated || !wixSiteId.trim()) return;
    void loadIntegration();
  }, [hydrated, wixSiteId, loadIntegration]);

  useEffect(() => {
    if (!hydrated || !integration?.connected) {
      setMappings([]);
      return;
    }
    void loadMappings();
  }, [hydrated, integration?.connected, loadMappings]);

  const handleAddMapping = async () => {
    if (!integration?.connected) {
      setError("Connect HubSpot before adding mappings.");
      return;
    }
    if (!newMapping.wixField.trim() || !newMapping.hubspotProperty.trim()) {
      setError("Wix field and HubSpot property are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const base = getApiBase();
      const res = await fetch(`${base}/api/mappings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wixSiteId,
          wixField: newMapping.wixField.trim(),
          hubspotProperty: newMapping.hubspotProperty.trim(),
          direction: newMapping.direction,
          transform: newMapping.transform || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          typeof data === "object" && data && "error" in data
            ? String((data as { error: string }).error)
            : `Save failed (${res.status})`,
        );
        return;
      }
      setNewMapping({
        wixField: "",
        hubspotProperty: "",
        direction: "both",
        transform: "",
      });
      await loadMappings();
    } catch {
      setError("Failed to add mapping.");
    } finally {
      setSubmitting(false);
    }
  };

  const hubspotAuthUrl = `${getApiBase()}/auth/hubspot?state=${encodeURIComponent(wixSiteId)}`;

  if (sessionPending || !session?.user) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-24">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" aria-hidden />
        <p className="mt-4 text-sm text-zinc-500">
          {sessionPending ? "Checking session…" : "Redirecting to sign in…"}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Integration dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Set your Wix site id, connect HubSpot, then define how contact fields
          map between systems.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/40">
        <Server className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          API
        </span>
        {apiOk === null && (
          <Loader2 className="h-4 w-4 animate-spin text-zinc-400" aria-hidden />
        )}
        {apiOk === true && (
          <span className="inline-flex items-center gap-1.5 text-sm text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            Reachable
          </span>
        )}
        {apiOk === false && (
          <span className="inline-flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" aria-hidden />
            Unreachable — set NEXT_PUBLIC_API_BASE_URL to your Express origin
          </span>
        )}
        <button
          type="button"
          onClick={() => checkApi()}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          Recheck
        </button>
      </div>

      {error && (
        <div
          className="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
          <span>{error}</span>
        </div>
      )}

      <section className="mb-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Site
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          This id ties HubSpot tokens and mappings to your Wix site. It must
          match the value you use when completing OAuth (passed as OAuth state).
        </p>
        <label
          className="mt-4 block text-sm font-medium text-zinc-800 dark:text-zinc-200"
          htmlFor="wix-site-id"
        >
          Wix site id
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            id="wix-site-id"
            className="w-full max-w-md rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
            value={wixSiteId}
            onChange={(e) => persistWixSiteId(e.target.value)}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => {
              void loadIntegration();
              if (integration?.connected) void loadMappings();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            {loadingIntegration ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh status
          </button>
        </div>
      </section>

      <section className="mb-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          HubSpot
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Opens the server OAuth flow; after approval, HubSpot redirects to your
          configured callback on the API host.
        </p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={hubspotAuthUrl}
              className="inline-flex items-center gap-2 rounded-lg bg-[#ff7a59] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#ff8f73]"
            >
              <Plug className="h-4 w-4" aria-hidden />
              Connect HubSpot
            </a>
            {loadingIntegration && (
              <Loader2
                className="h-5 w-5 animate-spin text-zinc-400"
                aria-hidden
              />
            )}
            {!loadingIntegration &&
              integration?.connected &&
              integration.hubspotPortalId && (
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Portal{" "}
                  <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                    {integration.hubspotPortalId}
                  </span>
                </span>
              )}
            {!loadingIntegration && integration && !integration.connected && (
              <span className="text-sm text-zinc-500">
                Not connected yet for this site id.
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Field mappings
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Requires a connected integration for this Wix site id. Directions:
          both, Wix → HubSpot, or HubSpot → Wix.
        </p>

        <div className="mt-6 grid gap-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-950/50 sm:grid-cols-2 lg:grid-cols-12 lg:items-end lg:gap-2">
          <div className="lg:col-span-3">
            <label
              className="block text-xs font-medium uppercase tracking-wide text-zinc-500"
              htmlFor="wix-field"
            >
              Wix field
            </label>
            <input
              id="wix-field"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
              placeholder="e.g. firstName"
              value={newMapping.wixField}
              onChange={(e) =>
                setNewMapping((m) => ({ ...m, wixField: e.target.value }))
              }
            />
          </div>
          <div className="lg:col-span-3">
            <label
              className="block text-xs font-medium uppercase tracking-wide text-zinc-500"
              htmlFor="hs-prop"
            >
              HubSpot property
            </label>
            <input
              id="hs-prop"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
              placeholder="e.g. firstname"
              value={newMapping.hubspotProperty}
              onChange={(e) =>
                setNewMapping((m) => ({
                  ...m,
                  hubspotProperty: e.target.value,
                }))
              }
            />
          </div>
          <div className="lg:col-span-2">
            <label
              className="block text-xs font-medium uppercase tracking-wide text-zinc-500"
              htmlFor="direction"
            >
              Direction
            </label>
            <select
              id="direction"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
              value={newMapping.direction}
              onChange={(e) =>
                setNewMapping((m) => ({
                  ...m,
                  direction: e.target.value as MappingDirection,
                }))
              }
            >
              <option value="both">Both ways</option>
              <option value="wix_to_hs">Wix → HubSpot</option>
              <option value="hs_to_wix">HubSpot → Wix</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <label
              className="block text-xs font-medium uppercase tracking-wide text-zinc-500"
              htmlFor="transform"
            >
              Transform
            </label>
            <select
              id="transform"
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
              value={newMapping.transform}
              onChange={(e) =>
                setNewMapping((m) => ({ ...m, transform: e.target.value }))
              }
            >
              <option value="">None</option>
              <option value="trim">trim</option>
              <option value="lowercase">lowercase</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <button
              type="button"
              onClick={() => handleAddMapping()}
              disabled={submitting || !integration?.connected}
              className="flex h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Add mapping
            </button>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          {loadingMappings ? (
            <div className="flex items-center gap-2 py-8 text-sm text-zinc-500">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Loading mappings…
            </div>
          ) : !integration?.connected ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              Connect HubSpot to manage mappings for this site.
            </p>
          ) : mappings.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              No mappings yet. Add one above.
            </p>
          ) : (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-700">
                  <th className="pb-3 pr-4 font-medium">Wix field</th>
                  <th className="pb-3 pr-4 font-medium">HubSpot property</th>
                  <th className="pb-3 pr-4 font-medium">Direction</th>
                  <th className="pb-3 font-medium">Transform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {mappings.map((m) => (
                  <tr key={m.id}>
                    <td className="py-3 pr-4 font-medium text-zinc-900 dark:text-zinc-100">
                      {m.wixField}
                    </td>
                    <td className="py-3 pr-4 font-mono text-zinc-700 dark:text-zinc-300">
                      {m.hubspotProperty}
                    </td>
                    <td className="py-3 pr-4 capitalize text-zinc-600 dark:text-zinc-400">
                      {formatDirection(m.direction)}
                    </td>
                    <td className="py-3 text-zinc-500">{m.transform ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}
