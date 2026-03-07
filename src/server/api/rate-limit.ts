import { TRPCError } from "@trpc/server";

/**
 * Simple in-memory sliding window rate limiter.
 *
 * Tracks request timestamps per user in a Map. On each check it prunes
 * timestamps older than the window, then decides whether the new request
 * should be allowed. A periodic cleanup runs every 5 minutes to evict
 * stale entries so the Map does not grow unbounded.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Periodically clean up entries that have no recent timestamps.
// This prevents memory leaks for users who made requests long ago.
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    // Remove entries whose newest timestamp is older than 2 minutes
    // (the longest window we use is 1 minute, so 2 min is very safe).
    if (entry.timestamps.length === 0 || entry.timestamps[entry.timestamps.length - 1]! < now - 2 * 60 * 1000) {
      store.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS);

// Allow Node.js to exit gracefully without waiting for this timer.
if (typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
  (cleanupTimer as { unref: () => void }).unref();
}

export interface RateLimitConfig {
  /** A unique identifier for the rate-limited action (e.g. "social.createPost"). */
  key: string;
  /** Maximum number of requests allowed within the window. */
  maxRequests: number;
  /** Window duration in milliseconds. Defaults to 60_000 (1 minute). */
  windowMs?: number;
}

/**
 * Check whether a request from `userId` for the given action should be
 * allowed. If not, throws a TRPCError with code TOO_MANY_REQUESTS.
 */
export function checkRateLimit(userId: string, config: RateLimitConfig): void {
  const windowMs = config.windowMs ?? 60_000;
  const now = Date.now();
  const storeKey = `${config.key}:${userId}`;

  let entry = store.get(storeKey);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(storeKey, entry);
  }

  // Prune timestamps outside the current window.
  const windowStart = now - windowMs;
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  if (entry.timestamps.length >= config.maxRequests) {
    // Calculate how many seconds until the oldest request in the window expires.
    const oldestInWindow = entry.timestamps[0]!;
    const retryAfterMs = oldestInWindow + windowMs - now;
    const retryAfterSec = Math.ceil(retryAfterMs / 1000);

    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: `Rate limit exceeded. Try again in ${retryAfterSec} second${retryAfterSec !== 1 ? "s" : ""}.`,
    });
  }

  // Record this request.
  entry.timestamps.push(now);
}
