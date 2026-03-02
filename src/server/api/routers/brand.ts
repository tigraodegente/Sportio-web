import { z } from "zod";
import { eq, desc, and, sql, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  brandCampaigns,
  campaignRedemptions,
  users,
  userRoles,
  gcoinTransactions,
  tournamentSponsors,
  tournamentPrizes,
  tournaments,
} from "@/server/db/schema";
import {
  notifyBrandReward,
  notifyProductRedeemed,
  notifyNewSponsor,
} from "@/server/services/notification-service";

// Helper to verify brand role
async function verifyBrandRole(db: any, userId: string) {
  const brandRole = await db.query.userRoles.findFirst({
    where: and(eq(userRoles.userId, userId), eq(userRoles.role, "brand")),
  });
  if (!brandRole) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Voce precisa ser uma Marca para esta acao",
    });
  }
  return brandRole;
}

export const brandRouter = createTRPCRouter({
  // ==================== AD DISPLAY (PUBLIC) ====================

  // List active campaigns for displaying ads (with deduplication support)
  activeCampaigns: publicProcedure
    .input(
      z.object({
        placement: z
          .enum(["feed_banner", "sidebar", "tournament_sponsor", "profile_banner", "challenge_sponsor", "post_promoted"])
          .optional(),
        sportId: z.string().uuid().optional(),
        tournamentId: z.string().uuid().optional(),
        excludeIds: z.array(z.string().uuid()).optional(),
        limit: z.number().min(1).max(20).default(5),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(brandCampaigns.status, "active")];
      if (input.placement) conditions.push(eq(brandCampaigns.placement, input.placement));
      if (input.sportId) conditions.push(eq(brandCampaigns.targetSportId, input.sportId));
      if (input.tournamentId) conditions.push(eq(brandCampaigns.targetTournamentId, input.tournamentId));
      // Exclude already-shown campaigns for deduplication
      if (input.excludeIds && input.excludeIds.length > 0) {
        for (const id of input.excludeIds) {
          conditions.push(ne(brandCampaigns.id, id));
        }
      }

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

  // ==================== REDEMPTION ====================

  // Redeem campaign (product giveaway or gcoin reward)
  redeem: protectedProcedure
    .input(z.object({ campaignId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const campaign = await ctx.db.query.brandCampaigns.findFirst({
        where: eq(brandCampaigns.id, input.campaignId),
        with: { brandUser: true },
      });

      if (!campaign) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Campanha nao encontrada" });
      }

      if (campaign.status !== "active") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Campanha nao esta ativa" });
      }

      if (campaign.maxRedemptions && (campaign.currentRedemptions ?? 0) >= campaign.maxRedemptions) {
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

      // Update redemption count + spent
      await ctx.db
        .update(brandCampaigns)
        .set({
          currentRedemptions: sql`${brandCampaigns.currentRedemptions} + 1`,
          spent: sql`${brandCampaigns.spent} + ${Number(campaign.gcoinRewardAmount ?? 0)}`,
        })
        .where(eq(brandCampaigns.id, input.campaignId));

      const brandName = campaign.brandUser?.name ?? "Marca";

      // If gcoin_reward type, credit the user + notify
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
          description: `Recompensa da campanha "${campaign.name}" por ${brandName}`,
          referenceId: campaign.id,
          referenceType: "campaign",
        });

        // Notify user
        notifyBrandReward(ctx.session.user.id, brandName, rewardAmount, campaign.id).catch(() => {});
      }

      // If product_giveaway, notify user about redemption
      if (campaign.type === "product_giveaway" && campaign.productName) {
        notifyProductRedeemed(ctx.session.user.id, brandName, campaign.productName, campaign.id).catch(() => {});
      }

      return { success: true };
    }),

  // ==================== BRAND DASHBOARD ====================

  // My campaigns
  myCampaigns: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.brandCampaigns.findMany({
      where: eq(brandCampaigns.brandUserId, ctx.session.user.id),
      with: { targetSport: true, redemptions: true, targetTournament: true },
      orderBy: [desc(brandCampaigns.createdAt)],
    });
  }),

  // Create campaign (with budget deduction for gcoin_reward campaigns)
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
      await verifyBrandRole(ctx.db, ctx.session.user.id);

      // For gcoin_reward: calculate total cost and check balance
      if (input.type === "gcoin_reward" && input.gcoinRewardAmount && input.maxRedemptions) {
        const totalCost = input.gcoinRewardAmount * input.maxRedemptions;
        const user = await ctx.db.query.users.findFirst({
          where: eq(users.id, ctx.session.user.id),
          columns: { gcoinsReal: true, gcoinsGamification: true },
        });
        const balance = Number(user?.gcoinsReal ?? 0) + Number(user?.gcoinsGamification ?? 0);
        if (balance < totalCost) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Saldo insuficiente. Necessario: ${totalCost} GCoins. Saldo: ${balance.toFixed(0)} GCoins.`,
          });
        }

        // Deduct from real GCoins first
        await ctx.db
          .update(users)
          .set({ gcoinsReal: sql`${users.gcoinsReal} - ${totalCost}` })
          .where(eq(users.id, ctx.session.user.id));

        await ctx.db.insert(gcoinTransactions).values({
          userId: ctx.session.user.id,
          type: "real",
          category: "brand_reward",
          amount: (-totalCost).toString(),
          description: `Reserva para campanha "${input.name}" (${input.maxRedemptions}x ${input.gcoinRewardAmount} GCoins)`,
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
          budget: input.type === "gcoin_reward" && input.gcoinRewardAmount && input.maxRedemptions
            ? (input.gcoinRewardAmount * input.maxRedemptions).toString()
            : input.budget.toString(),
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
          and(eq(brandCampaigns.id, id), eq(brandCampaigns.brandUserId, ctx.session.user.id))
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

  // ==================== GCOINS ====================

  // Buy GCoins as a brand (bulk purchase - stub, no real payment)
  buyGcoins: protectedProcedure
    .input(z.object({ amount: z.number().positive().max(1000000) }))
    .mutation(async ({ ctx, input }) => {
      await verifyBrandRole(ctx.db, ctx.session.user.id);

      await ctx.db
        .update(users)
        .set({ gcoinsReal: sql`${users.gcoinsReal} + ${input.amount}` })
        .where(eq(users.id, ctx.session.user.id));

      await ctx.db.insert(gcoinTransactions).values({
        userId: ctx.session.user.id,
        type: "real",
        category: "purchase",
        amount: input.amount.toString(),
        description: `Compra de ${input.amount} GCoins (Marca)`,
      });

      return { success: true, amount: input.amount };
    }),

  // ==================== TOURNAMENT SPONSORSHIP ====================

  // Sponsor a tournament (brand contributes GCoins + products to prize pool)
  sponsorTournament: protectedProcedure
    .input(
      z.object({
        tournamentId: z.string().uuid(),
        tier: z.enum(["main", "gold", "silver", "bronze"]),
        gcoinContribution: z.number().min(0).default(0),
        productPrizes: z
          .array(
            z.object({
              name: z.string().min(1),
              description: z.string().optional(),
              image: z.string().optional(),
              forPlacement: z.number().min(1).max(10),
            })
          )
          .optional(),
        logoUrl: z.string().optional(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await verifyBrandRole(ctx.db, ctx.session.user.id);

      // Check tournament exists and is open for sponsorship
      const tournament = await ctx.db.query.tournaments.findFirst({
        where: eq(tournaments.id, input.tournamentId),
        with: { organizer: true },
      });

      if (!tournament) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Torneio nao encontrado" });
      }

      if (tournament.status === "completed" || tournament.status === "cancelled") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Torneio ja finalizado ou cancelado" });
      }

      // Check if already sponsoring this tournament
      const existing = await ctx.db.query.tournamentSponsors.findFirst({
        where: and(
          eq(tournamentSponsors.tournamentId, input.tournamentId),
          eq(tournamentSponsors.brandUserId, ctx.session.user.id)
        ),
      });

      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Voce ja patrocina este torneio" });
      }

      // Check GCoin balance if contributing
      if (input.gcoinContribution > 0) {
        const user = await ctx.db.query.users.findFirst({
          where: eq(users.id, ctx.session.user.id),
          columns: { gcoinsReal: true, name: true },
        });
        const balance = Number(user?.gcoinsReal ?? 0);
        if (balance < input.gcoinContribution) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Saldo insuficiente. Necessario: ${input.gcoinContribution} GCoins. Saldo: ${balance.toFixed(0)} GCoins.`,
          });
        }

        // Deduct GCoins
        await ctx.db
          .update(users)
          .set({ gcoinsReal: sql`${users.gcoinsReal} - ${input.gcoinContribution}` })
          .where(eq(users.id, ctx.session.user.id));

        await ctx.db.insert(gcoinTransactions).values({
          userId: ctx.session.user.id,
          type: "real",
          category: "brand_reward",
          amount: (-input.gcoinContribution).toString(),
          description: `Patrocinio do torneio "${tournament.name}" (${input.tier})`,
          referenceId: tournament.id,
          referenceType: "tournament_sponsorship",
        });

        // Add GCoins to tournament prize pool
        await ctx.db
          .update(tournaments)
          .set({ prizePool: sql`${tournaments.prizePool} + ${input.gcoinContribution}` })
          .where(eq(tournaments.id, input.tournamentId));
      }

      // Create sponsor record
      const [sponsor] = await ctx.db
        .insert(tournamentSponsors)
        .values({
          tournamentId: input.tournamentId,
          brandUserId: ctx.session.user.id,
          tier: input.tier,
          gcoinContribution: input.gcoinContribution.toString(),
          productPrizes: input.productPrizes ?? null,
          logoUrl: input.logoUrl,
          message: input.message,
          status: "pending", // Organizer must approve
        })
        .returning();

      // Create individual prize records for GCoin contributions
      if (input.gcoinContribution > 0) {
        // Default: 60% to 1st, 30% to 2nd, 10% to 3rd
        const distribution = [
          { placement: 1, pct: 0.6 },
          { placement: 2, pct: 0.3 },
          { placement: 3, pct: 0.1 },
        ];
        for (const { placement, pct } of distribution) {
          const amount = Math.floor(input.gcoinContribution * pct);
          if (amount > 0) {
            await ctx.db.insert(tournamentPrizes).values({
              tournamentId: input.tournamentId,
              sponsorId: sponsor.id,
              placement,
              prizeType: "gcoin",
              gcoinAmount: amount.toString(),
            });
          }
        }
      }

      // Create product prize records
      if (input.productPrizes && input.productPrizes.length > 0) {
        for (const product of input.productPrizes) {
          await ctx.db.insert(tournamentPrizes).values({
            tournamentId: input.tournamentId,
            sponsorId: sponsor.id,
            placement: product.forPlacement,
            prizeType: "product",
            productName: product.name,
            productDescription: product.description,
            productImage: product.image,
          });
        }
      }

      // Notify tournament organizer
      const brandUser = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
        columns: { name: true },
      });

      notifyNewSponsor(
        tournament.organizerId,
        brandUser?.name ?? "Marca",
        tournament.name,
        input.tier,
        tournament.id
      ).catch(() => {});

      return sponsor;
    }),

  // List my tournament sponsorships
  mySponsorships: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.tournamentSponsors.findMany({
      where: eq(tournamentSponsors.brandUserId, ctx.session.user.id),
      with: {
        tournament: { with: { sport: true } },
        prizes: true,
      },
      orderBy: [desc(tournamentSponsors.createdAt)],
    });
  }),

  // Cancel sponsorship (only before tournament starts, refund GCoins)
  cancelSponsorship: protectedProcedure
    .input(z.object({ sponsorshipId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const sponsorship = await ctx.db.query.tournamentSponsors.findFirst({
        where: and(
          eq(tournamentSponsors.id, input.sponsorshipId),
          eq(tournamentSponsors.brandUserId, ctx.session.user.id)
        ),
        with: { tournament: true },
      });

      if (!sponsorship) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Patrocinio nao encontrado" });
      }

      if (sponsorship.tournament?.status === "in_progress" || sponsorship.tournament?.status === "completed") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Nao e possivel cancelar apos o torneio iniciar" });
      }

      // Refund GCoins
      const refundAmount = Number(sponsorship.gcoinContribution ?? 0);
      if (refundAmount > 0) {
        await ctx.db
          .update(users)
          .set({ gcoinsReal: sql`${users.gcoinsReal} + ${refundAmount}` })
          .where(eq(users.id, ctx.session.user.id));

        await ctx.db.insert(gcoinTransactions).values({
          userId: ctx.session.user.id,
          type: "real",
          category: "brand_reward",
          amount: refundAmount.toString(),
          description: `Reembolso de patrocinio cancelado - ${sponsorship.tournament?.name}`,
          referenceId: sponsorship.tournamentId,
          referenceType: "sponsorship_refund",
        });

        // Deduct from tournament prize pool
        await ctx.db
          .update(tournaments)
          .set({ prizePool: sql`GREATEST(${tournaments.prizePool} - ${refundAmount}, 0)` })
          .where(eq(tournaments.id, sponsorship.tournamentId));
      }

      // Delete prizes and sponsorship
      await ctx.db.delete(tournamentPrizes).where(eq(tournamentPrizes.sponsorId, input.sponsorshipId));
      await ctx.db.delete(tournamentSponsors).where(eq(tournamentSponsors.id, input.sponsorshipId));

      return { success: true, refunded: refundAmount };
    }),
});
