/** Base URL for the Express integration API (no trailing slash). */
export function getApiBase(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
}

export async function fetchApiStatus(): Promise<{
  status: string;
  service: string;
}> {
  const res = await fetch(`${getApiBase()}/api/status`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API status ${res.status}`);
  return res.json() as Promise<{ status: string; service: string }>;
}
