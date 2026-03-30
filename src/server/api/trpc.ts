// tRPC setup - standalone (no NextAuth dependency)
// These routers are used as business logic layer, called from WhatsApp handlers
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { db } from "@/server/db";
import { checkRateLimit, type RateLimitConfig } from "./rate-limit";

export interface TRPCContext {
  db: typeof db;
  session: {
    user: {
      id: string;
    };
  } | null;
}

export const createTRPCContext = (userId?: string): TRPCContext => {
  return {
    db,
    session: userId ? { user: { id: userId } } : null,
  };
};

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

const enforceAuth = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Voce precisa estar logado" });
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

const createRateLimitMiddleware = (config: RateLimitConfig) =>
  t.middleware(async ({ ctx, next }) => {
    const userId = (ctx.session as { user: { id: string } })?.user?.id;
    if (userId) {
      checkRateLimit(userId, config);
    }
    return next();
  });

export const rateLimitedProcedure = (config: RateLimitConfig) =>
  t.procedure.use(enforceAuth).use(createRateLimitMiddleware(config));
