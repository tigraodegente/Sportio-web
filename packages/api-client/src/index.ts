// ============================================
// Sportio API Client
// Shared tRPC client setup for web and mobile
// ============================================

import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink, type TRPCLink } from "@trpc/client";
import superjson from "superjson";

/**
 * Create a typed tRPC React client for a given AppRouter type.
 *
 * Usage in web app:
 *   import type { AppRouter } from "@/server/api/root";
 *   export const trpc = createSportioTRPC<AppRouter>();
 *
 * Usage in mobile app:
 *   import type { AppRouter } from "@sportio/api-client/types";
 *   export const trpc = createSportioTRPC<AppRouter>();
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createSportioTRPC<TRouter extends Record<string, any>>() {
  return createTRPCReact<TRouter>();
}

/**
 * Creates the default tRPC HTTP batch link for a given base URL.
 * Uses superjson as the transformer (matching the server config).
 */
export function createTRPCClientLinks(baseUrl: string): TRPCLink<never>[] {
  return [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    httpBatchLink({
      url: `${baseUrl}/api/trpc`,
      transformer: superjson,
    }) as any,
  ];
}

export { superjson };
