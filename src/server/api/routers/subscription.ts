import { z } from "zod";
import { eq, desc, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  fanSubscriptions,
  creatorTiers,
  fanBadges,
  users,
  gcoinTransactions,
} from "@/server/db/schema";
import { createNotification } from "@/server/services/notification-service";

const PLATFORM_FEE_PCT = 20; // 20% platform fee

export const subscriptionRouter = createTRPCRouter({
  // Fan subscribes to creator tier
  subscribe: protectedProcedure
    .input(
      z.object({
        creatorId: z.string().uuid(),
        tierId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const fanId = ctx.session.user.id;

      if (fanId === input.creatorId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Você não pode assinar seu próprio conteúdo" });
      }

      // Get tier
      const tier = await ctx.db.query.creatorTiers.findFirst({
        where: and(
          eq(creatorTiers.id, input.tierId),
          eq(creatorTiers.creatorId, input.creatorId),
          eq(creatorTiers.isActive, true)
        ),
      });

      if (!tier) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tier não encontrado" });
      }

      // Check existing subscription
      const existing = await ctx.db.query.fanSubscriptions.findFirst({
        where: and(
          eq(fanSubscriptions.fanId, fanId),
          eq(fanSubscriptions.creatorId, input.creatorId),
          eq(fanSubscriptions.status, "active")
        ),
      });

      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Você já possui uma assinatura ativa com este criador" });
      }

      // Check balance
      const fan = await ctx.db.query.users.findFirst({
        where: eq(users.id, fanId),
        columns: { gcoinsReal: true, gcoinsGamification: true },
      });

      const totalBalance = Number(fan?.gcoinsReal ?? 0) + Number(fan?.gcoinsGamification ?? 0);
      if (totalBalance < tier.priceMonthlyC) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Saldo insuficiente de GCoins" });
      }

      // Deduct GCoins (prefer gamification, then real)
      let remaining = tier.priceMonthlyC;
      const gamBalance = Number(fan?.gcoinsGamification ?? 0);
      if (gamBalance > 0) {
        const fromGam = Math.min(gamBalance, remaining);
        await ctx.db
          .update(users)
          .set({ gcoinsGamification: sql`${users.gcoinsGamification} - ${fromGam}` })
          .where(eq(users.id, fanId));
        remaining -= fromGam;
      }
      if (remaining > 0) {
        await ctx.db
          .update(users)
          .set({ gcoinsReal: sql`${users.gcoinsReal} - ${remaining}` })
          .where(eq(users.id, fanId));
      }

      // Credit creator (minus platform fee)
      const creatorAmount = Math.floor(tier.priceMonthlyC * (100 - PLATFORM_FEE_PCT) / 100);
      await ctx.db
        .update(users)
        .set({ gcoinsReal: sql`${users.gcoinsReal} + ${creatorAmount}` })
        .where(eq(users.id, input.creatorId));

      // Create subscription (30-day period)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const [subscription] = await ctx.db
        .insert(fanSubscriptions)
        .values({
          fanId,
          creatorId: input.creatorId,
          tierId: input.tierId,
          expiresAt,
        })
        .returning();

      // Create/update fan badge
      const existingBadge = await ctx.db.query.fanBadges.findFirst({
        where: and(eq(fanBadges.fanId, fanId), eq(fanBadges.creatorId, input.creatorId)),
      });

      if (existingBadge) {
        await ctx.db
          .update(fanBadges)
          .set({
            monthsSubscribed: sql`${fanBadges.monthsSubscribed} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(fanBadges.id, existingBadge.id));
      } else {
        await ctx.db.insert(fanBadges).values({
          fanId,
          creatorId: input.creatorId,
          tier: "bronze",
          monthsSubscribed: 1,
        });
      }

      // Log transactions
      await ctx.db.insert(gcoinTransactions).values([
        {
          userId: fanId,
          type: "real",
          category: "transfer",
          amount: (-tier.priceMonthlyC).toString(),
          description: `Assinatura: ${tier.name}`,
          referenceId: subscription!.id,
          referenceType: "subscription" as any,
        },
        {
          userId: input.creatorId,
          type: "real",
          category: "transfer",
          amount: creatorAmount.toString(),
          description: `Receita de assinatura`,
          referenceId: subscription!.id,
          referenceType: "subscription" as any,
        },
      ]);

      // Notify creator
      const fanUser = await ctx.db.query.users.findFirst({
        where: eq(users.id, fanId),
        columns: { name: true },
      });
      createNotification({
        userId: input.creatorId,
        type: "gcoin",
        title: "Nova assinatura!",
        message: `${fanUser?.name ?? "Alguém"} assinou seu tier "${tier.name}"`,
        data: { subscriptionId: subscription!.id, tierId: input.tierId },
      }).catch(() => {});

      return subscription;
    }),

  // Cancel subscription
  unsubscribe: protectedProcedure
    .input(z.object({ subscriptionId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(fanSubscriptions)
        .set({
          status: "cancelled",
          autoRenew: false,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(fanSubscriptions.id, input.subscriptionId),
            eq(fanSubscriptions.fanId, ctx.session.user.id),
            eq(fanSubscriptions.status, "active")
          )
        )
        .returning();

      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Assinatura não encontrada" });
      }

      return { success: true, expiresAt: updated.expiresAt };
    }),

  // Change tier (upgrade/downgrade)
  changeTier: protectedProcedure
    .input(
      z.object({
        subscriptionId: z.string().uuid(),
        newTierId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const subscription = await ctx.db.query.fanSubscriptions.findFirst({
        where: and(
          eq(fanSubscriptions.id, input.subscriptionId),
          eq(fanSubscriptions.fanId, ctx.session.user.id),
          eq(fanSubscriptions.status, "active")
        ),
        with: { tier: true },
      });

      if (!subscription) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Assinatura não encontrada" });
      }

      const newTier = await ctx.db.query.creatorTiers.findFirst({
        where: and(
          eq(creatorTiers.id, input.newTierId),
          eq(creatorTiers.creatorId, subscription.creatorId),
          eq(creatorTiers.isActive, true)
        ),
      });

      if (!newTier) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Novo tier não encontrado" });
      }

      // If upgrading, charge the difference
      const priceDiff = newTier.priceMonthlyC - subscription.tier.priceMonthlyC;
      if (priceDiff > 0) {
        const fan = await ctx.db.query.users.findFirst({
          where: eq(users.id, ctx.session.user.id),
          columns: { gcoinsReal: true, gcoinsGamification: true },
        });

        const totalBalance = Number(fan?.gcoinsReal ?? 0) + Number(fan?.gcoinsGamification ?? 0);
        if (totalBalance < priceDiff) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Saldo insuficiente para upgrade" });
        }

        // Deduct difference
        await ctx.db
          .update(users)
          .set({ gcoinsReal: sql`${users.gcoinsReal} - ${priceDiff}` })
          .where(eq(users.id, ctx.session.user.id));

        // Credit creator
        const creatorAmount = Math.floor(priceDiff * (100 - PLATFORM_FEE_PCT) / 100);
        await ctx.db
          .update(users)
          .set({ gcoinsReal: sql`${users.gcoinsReal} + ${creatorAmount}` })
          .where(eq(users.id, subscription.creatorId));
      }

      const [updated] = await ctx.db
        .update(fanSubscriptions)
        .set({ tierId: input.newTierId, updatedAt: new Date() })
        .where(eq(fanSubscriptions.id, input.subscriptionId))
        .returning();

      return updated;
    }),

  // Fan's active subscriptions
  mySubscriptions: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.fanSubscriptions.findMany({
      where: eq(fanSubscriptions.fanId, ctx.session.user.id),
      with: {
        creator: { columns: { id: true, name: true, image: true } },
        tier: true,
      },
      orderBy: [desc(fanSubscriptions.createdAt)],
    });
  }),

  // Creator's subscribers
  mySubscribers: protectedProcedure
    .input(
      z.object({
        page: z.number().int().min(0).default(0),
        limit: z.number().int().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db.query.fanSubscriptions.findMany({
        where: and(
          eq(fanSubscriptions.creatorId, ctx.session.user.id),
          eq(fanSubscriptions.status, "active")
        ),
        with: {
          fan: { columns: { id: true, name: true, image: true } },
          tier: true,
        },
        orderBy: [desc(fanSubscriptions.createdAt)],
        limit: input.limit,
        offset: input.page * input.limit,
      });

      const [total] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(fanSubscriptions)
        .where(
          and(
            eq(fanSubscriptions.creatorId, ctx.session.user.id),
            eq(fanSubscriptions.status, "active")
          )
        );

      return {
        items: results,
        total: total?.count ?? 0,
        page: input.page,
        limit: input.limit,
      };
    }),

  // Check if user can access gated content
  checkAccess: protectedProcedure
    .input(
      z.object({
        creatorId: z.string().uuid(),
        requiredTierId: z.string().uuid().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const subscription = await ctx.db.query.fanSubscriptions.findFirst({
        where: and(
          eq(fanSubscriptions.fanId, ctx.session.user.id),
          eq(fanSubscriptions.creatorId, input.creatorId),
          eq(fanSubscriptions.status, "active")
        ),
        with: { tier: true },
      });

      if (!subscription) {
        return { hasAccess: false, currentTier: null };
      }

      // If no specific tier required, any active subscription grants access
      if (!input.requiredTierId) {
        return { hasAccess: true, currentTier: subscription.tier };
      }

      // Check if user's tier meets the requirement (by price)
      const requiredTier = await ctx.db.query.creatorTiers.findFirst({
        where: eq(creatorTiers.id, input.requiredTierId),
      });

      const hasAccess = requiredTier
        ? subscription.tier.priceMonthlyC >= requiredTier.priceMonthlyC
        : false;

      return { hasAccess, currentTier: subscription.tier };
    }),
});
