import { z } from "zod";
import { eq, desc, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  brandCampaigns,
  campaignRedemptions,
  users,
  userRoles,
  gcoinTransactions,
} from "@/server/db/schema";

export const brandRouter = createTRPCRouter({
  // List active campaigns (public - for displaying ads)
  activeCampaigns: publicProcedure
    .input(
      z.object({
        placement: z
          .enum([
            "feed_banner",
            "sidebar",
            "tournament_sponsor",
            "profile_banner",
            "challenge_sponsor",
            "post_promoted",
          ])
          .optional(),
        sportId: z.string().uuid().optional(),
        limit: z.number().min(1).max(20).default(5),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(brandCampaigns.status, "active")];
      if (input.placement) conditions.push(eq(brandCampaigns.placement, input.placement));
      if (input.sportId) conditions.push(eq(brandCampaigns.targetSportId, input.sportId));

      return ctx.db.query.brandCampaigns.findMany({
        where: and(...conditions),
        with: { brandUser: true, targetSport: true },
        orderBy: [desc(brandCampaigns.createdAt)],
        limit: input.limit,
      });
    }),

  // Track impression
  trackImpression: publicProcedure
    .input(z.object({ campaignId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(brandCampaigns)
        .set({ impressions: sql`${brandCampaigns.impressions} + 1` })
        .where(eq(brandCampaigns.id, input.campaignId));
      return { success: true };
    }),

  // Track click
  trackClick: publicProcedure
    .input(z.object({ campaignId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(brandCampaigns)
        .set({ clicks: sql`${brandCampaigns.clicks} + 1` })
        .where(eq(brandCampaigns.id, input.campaignId));
      return { success: true };
    }),

  // Redeem campaign (product giveaway or gcoin reward)
  redeem: protectedProcedure
    .input(z.object({ campaignId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const campaign = await ctx.db.query.brandCampaigns.findFirst({
        where: eq(brandCampaigns.id, input.campaignId),
      });

      if (!campaign) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Campanha nao encontrada" });
      }

      if (campaign.status !== "active") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Campanha nao esta ativa" });
      }

      if (
        campaign.maxRedemptions &&
        (campaign.currentRedemptions ?? 0) >= campaign.maxRedemptions
      ) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Limite de resgates atingido" });
      }

      // Check if already redeemed
      const existing = await ctx.db.query.campaignRedemptions.findFirst({
        where: and(
          eq(campaignRedemptions.campaignId, input.campaignId),
          eq(campaignRedemptions.userId, ctx.session.user.id)
        ),
      });

      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Voce ja resgatou esta campanha" });
      }

      // Create redemption
      await ctx.db.insert(campaignRedemptions).values({
        campaignId: input.campaignId,
        userId: ctx.session.user.id,
      });

      // Update redemption count
      await ctx.db
        .update(brandCampaigns)
        .set({
          currentRedemptions: sql`${brandCampaigns.currentRedemptions} + 1`,
        })
        .where(eq(brandCampaigns.id, input.campaignId));

      // If gcoin_reward type, credit the user
      if (campaign.type === "gcoin_reward" && campaign.gcoinRewardAmount) {
        const rewardAmount = Number(campaign.gcoinRewardAmount);
        await ctx.db
          .update(users)
          .set({
            gcoinsGamification: sql`${users.gcoinsGamification} + ${rewardAmount}`,
          })
          .where(eq(users.id, ctx.session.user.id));

        await ctx.db.insert(gcoinTransactions).values({
          userId: ctx.session.user.id,
          type: "gamification",
          category: "brand_reward",
          amount: rewardAmount.toString(),
          description: `Recompensa da campanha "${campaign.name}"`,
          referenceId: campaign.id,
          referenceType: "campaign",
        });
      }

      return { success: true };
    }),

  // Brand dashboard - my campaigns (for brand users)
  myCampaigns: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.brandCampaigns.findMany({
      where: eq(brandCampaigns.brandUserId, ctx.session.user.id),
      with: { targetSport: true, redemptions: true },
      orderBy: [desc(brandCampaigns.createdAt)],
    });
  }),

  // Create campaign
  createCampaign: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(255),
        description: z.string().optional(),
        type: z.enum(["banner", "product_giveaway", "gcoin_reward", "tournament_sponsor", "challenge_sponsor"]),
        placement: z.enum(["feed_banner", "sidebar", "tournament_sponsor", "profile_banner", "challenge_sponsor", "post_promoted"]),
        budget: z.number().min(0).default(0),
        imageUrl: z.string().optional(),
        linkUrl: z.string().optional(),
        targetSportId: z.string().uuid().optional(),
        targetTournamentId: z.string().uuid().optional(),
        productName: z.string().optional(),
        productDescription: z.string().optional(),
        productImage: z.string().optional(),
        gcoinRewardAmount: z.number().min(0).optional(),
        maxRedemptions: z.number().min(1).optional(),
        startsAt: z.string().optional(),
        endsAt: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user has brand role
      const brandRole = await ctx.db.query.userRoles.findFirst({
        where: and(
          eq(userRoles.userId, ctx.session.user.id),
          eq(userRoles.role, "brand")
        ),
      });

      if (!brandRole) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Voce precisa ser uma Marca para criar campanhas",
        });
      }

      const [campaign] = await ctx.db
        .insert(brandCampaigns)
        .values({
          brandUserId: ctx.session.user.id,
          name: input.name,
          description: input.description,
          type: input.type,
          placement: input.placement,
          budget: input.budget.toString(),
          imageUrl: input.imageUrl,
          linkUrl: input.linkUrl,
          targetSportId: input.targetSportId,
          targetTournamentId: input.targetTournamentId,
          productName: input.productName,
          productDescription: input.productDescription,
          productImage: input.productImage,
          gcoinRewardAmount: input.gcoinRewardAmount?.toString(),
          maxRedemptions: input.maxRedemptions,
          startsAt: input.startsAt ? new Date(input.startsAt) : null,
          endsAt: input.endsAt ? new Date(input.endsAt) : null,
          status: "active",
        })
        .returning();

      return campaign;
    }),

  // Update campaign
  updateCampaign: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(3).max(255).optional(),
        description: z.string().optional(),
        status: z.enum(["pending", "active", "paused", "completed", "rejected"]).optional(),
        imageUrl: z.string().optional(),
        linkUrl: z.string().optional(),
        budget: z.number().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, budget, ...rest } = input;
      const [updated] = await ctx.db
        .update(brandCampaigns)
        .set({
          ...rest,
          ...(budget !== undefined && { budget: budget.toString() }),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(brandCampaigns.id, id),
            eq(brandCampaigns.brandUserId, ctx.session.user.id)
          )
        )
        .returning();
      return updated;
    }),

  // Campaign stats
  campaignStats: protectedProcedure
    .input(z.object({ campaignId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const campaign = await ctx.db.query.brandCampaigns.findFirst({
        where: and(
          eq(brandCampaigns.id, input.campaignId),
          eq(brandCampaigns.brandUserId, ctx.session.user.id)
        ),
        with: { redemptions: { with: { user: true } } },
      });

      if (!campaign) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Campanha nao encontrada" });
      }

      const ctr = campaign.impressions
        ? ((campaign.clicks ?? 0) / campaign.impressions) * 100
        : 0;

      return {
        campaign,
        stats: {
          impressions: campaign.impressions ?? 0,
          clicks: campaign.clicks ?? 0,
          ctr: Math.round(ctr * 100) / 100,
          redemptions: campaign.redemptions.length,
          spent: Number(campaign.spent ?? 0),
          budget: Number(campaign.budget ?? 0),
        },
      };
    }),

  // Buy GCoins as a brand (bulk purchase)
  buyGcoins: protectedProcedure
    .input(
      z.object({
        amount: z.number().positive().max(1000000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify brand role
      const brandRole = await ctx.db.query.userRoles.findFirst({
        where: and(
          eq(userRoles.userId, ctx.session.user.id),
          eq(userRoles.role, "brand")
        ),
      });

      if (!brandRole) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Voce precisa ser uma Marca para comprar GCoins em lote",
        });
      }

      // Credit GCoins (real type - can be withdrawn)
      await ctx.db
        .update(users)
        .set({
          gcoinsReal: sql`${users.gcoinsReal} + ${input.amount}`,
        })
        .where(eq(users.id, ctx.session.user.id));

      // Log transaction
      await ctx.db.insert(gcoinTransactions).values({
        userId: ctx.session.user.id,
        type: "real",
        category: "purchase",
        amount: input.amount.toString(),
        description: `Compra de ${input.amount} GCoins (Marca)`,
      });

      return { success: true, amount: input.amount };
    }),
});
