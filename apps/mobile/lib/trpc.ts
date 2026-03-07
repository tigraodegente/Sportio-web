import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";

// TODO: Replace with the real AppRouter type from the server package
// import type { AppRouter } from "@sportio/server/trpc";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AppRouter {}

// @ts-expect-error -- Placeholder until real AppRouter type is available
export const trpc = createTRPCReact<AppRouter>();

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export function getTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${API_URL}/api/trpc`,
        transformer: superjson,
      }),
    ],
  });
}
