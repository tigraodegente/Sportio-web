import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { checkRateLimit, type RateLimitConfig } from "./rate-limit";

export const createTRPCContext = async () => {
  const session = await auth();
  return { db, session };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

const enforceAuth = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Você precisa estar logado" });
  }
  return next({
    ctx: {
      ...ctx,
      session: {
        ...ctx.session,
        user: { ...ctx.session.user, id: ctx.session.user.id },
      },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceAuth);

/**
 * Creates a rate-limiting middleware for the given config.
 * Must be used AFTER enforceAuth so ctx.session.user.id is available.
 */
const createRateLimitMiddleware = (config: RateLimitConfig) =>
  t.middleware(async ({ ctx, next }) => {
    const userId = (ctx.session as { user: { id: string } })?.user?.id;
    if (userId) {
      checkRateLimit(userId, config);
    }
    return next();
  });

/**
 * Creates a protected procedure that is also rate-limited.
 * Usage:  rateLimitedProcedure({ key: "social.createPost", maxRequests: 10 })
 */
export const rateLimitedProcedure = (config: RateLimitConfig) =>
  t.procedure.use(enforceAuth).use(createRateLimitMiddleware(config));
