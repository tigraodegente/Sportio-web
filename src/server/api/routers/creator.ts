import { z } from "zod";
import { eq, desc, and, sql, gte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  creatorTiers,
  fanSubscriptions,
  fanBadges,
  gifts,
  users,
  userRoles,
  gcoinTransactions,
} from "@/server/db/schema";

export const creatorRouter = createTRPCRouter({
  // Create a subscription tier
  createTier: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        priceMonthly: z.number().int().positive(),
        description: z.string().max(1000).optional(),
        benefits: z.array(z.string().max(200)).max(20).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate user is a creator (has athlete role)
      const role = await ctx.db.query.userRoles.findFirst({
        where: and(
          eq(userRoles.userId, ctx.session.user.id),
          eq(userRoles.role, "athlete")
        ),
      });

      if (!role) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas criadores (atletas) podem criar tiers",
        });
      }

      const [tier] = await ctx.db
        .insert(creatorTiers)
        .values({
          creatorId: ctx.session.user.id,
          name: input.name,
          priceMonthlyC: input.priceMonthly,
          description: input.description,
          benefits: input.benefits ?? [],
        })
        .returning();

      return tier;
    }),

  // Update tier details
  updateTier: protectedProcedure
    .input(
      z.object({
        tierId: z.string().uuid(),
        name: z.string().min(1).max(100).optional(),
        priceMonthly: z.number().int().positive().optional(),
        description: z.string().max(1000).optional(),
        benefits: z.array(z.string().max(200)).max(20).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.creatorTiers.findFirst({
        where: and(
          eq(creatorTiers.id, input.tierId),
          eq(creatorTiers.creatorId, ctx.session.user.id)
        ),
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tier não encontrado" });
      }

      const [updated] = await ctx.db
        .update(creatorTiers)
        .set({
          ...(input.name !== undefined && { name: input.name }),
          ...(input.priceMonthly !== undefined && { priceMonthlyC: input.priceMonthly }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.benefits !== undefined && { benefits: input.benefits }),
          ...(input.isActive !== undefined && { isActive: input.isActive }),
          updatedAt: new Date(),
        })
        .where(
          and(eq(creatorTiers.id, input.tierId), eq(creatorTiers.creatorId, ctx.session.user.id))
        )
        .returning();

      return updated;
    }),

  // Soft delete tier
  deleteTier: protectedProcedure
    .input(z.object({ tierId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(creatorTiers)
        .set({ isActive: false, updatedAt: new Date() })
        .where(
          and(eq(creatorTiers.id, input.tierId), eq(creatorTiers.creatorId, ctx.session.user.id))
        )
        .returning();

      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tier não encontrado" });
      }

      return { success: true };
    }),

  // List tiers for a creator (public)
  listTiers: publicProcedure
    .input(z.object({ creatorId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.creatorTiers.findMany({
        where: and(
          eq(creatorTiers.creatorId, input.creatorId),
          eq(creatorTiers.isActive, true)
        ),
        orderBy: [creatorTiers.sortOrder, creatorTiers.priceMonthlyC],
      });
    }),

  // Get public creator profile with stats
  getCreatorProfile: publicProcedure
    .input(z.object({ creatorId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.creatorId),
        columns: {
          id: true,
          name: true,
          image: true,
          bio: true,
          city: true,
          state: true,
          instagram: true,
          twitter: true,
          youtube: true,
          isVerified: true,
        },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Criador não encontrado" });
      }

      const tiers = await ctx.db.query.creatorTiers.findMany({
        where: and(
          eq(creatorTiers.creatorId, input.creatorId),
          eq(creatorTiers.isActive, true)
        ),
        orderBy: [creatorTiers.priceMonthlyC],
      });

      const [subscriberCount] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(fanSubscriptions)
        .where(
          and(
            eq(fanSubscriptions.creatorId, input.creatorId),
            eq(fanSubscriptions.status, "active")
          )
        );

      const topFans = await ctx.db
        .select({
          fanId: fanBadges.fanId,
          totalGcoinsGiven: fanBadges.totalGcoinsGiven,
          tier: fanBadges.tier,
        })
        .from(fanBadges)
        .where(eq(fanBadges.creatorId, input.creatorId))
        .orderBy(desc(fanBadges.totalGcoinsGiven))
        .limit(5);

      return {
        ...user,
        tiers,
        subscriberCount: subscriberCount?.count ?? 0,
        topFans,
      };
    }),

  // Creator's own dashboard
  getCreatorDashboard: protectedProcedure.query(async ({ ctx }) => {
    const creatorId = ctx.session.user.id;

    // Subscriber count
    const [subscriberCount] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(fanSubscriptions)
      .where(
        and(
          eq(fanSubscriptions.creatorId, creatorId),
          eq(fanSubscriptions.status, "active")
        )
      );

    // Monthly revenue from subscriptions
    const [subRevenue] = await ctx.db
      .select({
        total: sql<number>`coalesce(sum(${creatorTiers.priceMonthlyC}), 0)`,
      })
      .from(fanSubscriptions)
      .innerJoin(creatorTiers, eq(fanSubscriptions.tierId, creatorTiers.id))
      .where(
        and(
          eq(fanSubscriptions.creatorId, creatorId),
          eq(fanSubscriptions.status, "active")
        )
      );

    // Gift revenue (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [giftRevenue] = await ctx.db
      .select({
        total: sql<number>`coalesce(sum(${gifts.gcoinAmount}), 0)`,
        count: sql<number>`count(*)`,
      })
      .from(gifts)
      .where(
        and(
          eq(gifts.receiverId, creatorId),
          gte(gifts.createdAt, thirtyDaysAgo)
        )
      );

    // Recent gifts
    const recentGifts = await ctx.db.query.gifts.findMany({
      where: eq(gifts.receiverId, creatorId),
      with: {
        sender: { columns: { id: true, name: true, image: true } },
        giftType: true,
      },
      orderBy: [desc(gifts.createdAt)],
      limit: 10,
    });

    return {
      subscriberCount: subscriberCount?.count ?? 0,
      monthlySubscriptionRevenue: subRevenue?.total ?? 0,
      giftRevenue30d: giftRevenue?.total ?? 0,
      giftCount30d: giftRevenue?.count ?? 0,
      recentGifts,
    };
  }),

  // Detailed analytics
  getCreatorStats: protectedProcedure
    .input(
      z.object({
        period: z.enum(["7d", "30d", "90d"]),
      })
    )
    .query(async ({ ctx, input }) => {
      const creatorId = ctx.session.user.id;
      const days = input.period === "7d" ? 7 : input.period === "30d" ? 30 : 90;
      const since = new Date();
      since.setDate(since.getDate() - days);

      // New subscribers in period
      const [newSubs] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(fanSubscriptions)
        .where(
          and(
            eq(fanSubscriptions.creatorId, creatorId),
            gte(fanSubscriptions.createdAt, since)
          )
        );

      // Cancelled in period
      const [cancelledSubs] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(fanSubscriptions)
        .where(
          and(
            eq(fanSubscriptions.creatorId, creatorId),
            eq(fanSubscriptions.status, "cancelled"),
            gte(fanSubscriptions.updatedAt, since)
          )
        );

      // Gift stats in period
      const [giftStats] = await ctx.db
        .select({
          total: sql<number>`coalesce(sum(${gifts.gcoinAmount}), 0)`,
          count: sql<number>`count(*)`,
        })
        .from(gifts)
        .where(
          and(
            eq(gifts.receiverId, creatorId),
            gte(gifts.createdAt, since)
          )
        );

      // Total active subscribers
      const [activeSubs] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(fanSubscriptions)
        .where(
          and(
            eq(fanSubscriptions.creatorId, creatorId),
            eq(fanSubscriptions.status, "active")
          )
        );

      return {
        period: input.period,
        activeSubscribers: activeSubs?.count ?? 0,
        newSubscribers: newSubs?.count ?? 0,
        cancelledSubscribers: cancelledSubs?.count ?? 0,
        giftRevenue: giftStats?.total ?? 0,
        giftCount: giftStats?.count ?? 0,
      };
    }),
});
