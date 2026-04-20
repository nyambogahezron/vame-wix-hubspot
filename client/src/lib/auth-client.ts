import { createAuthClient } from "better-auth/react";

/** Public API base URL (same host as Better Auth `baseURL` on the server). */
function authBaseUrl(): string {
  return process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? "http://localhost:3001";
}

export const authClient = createAuthClient({
  baseURL: authBaseUrl(),
  fetchOptions: {
    credentials: "include",
  },
});
