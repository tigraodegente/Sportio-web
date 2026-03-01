import { z } from "zod";
import { eq, desc, and, ilike, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  tournaments,
  enrollments,
  matches,
  tournamentSponsors,
  tournamentPrizes,
  users,
  gcoinTransactions,
} from "@/server/db/schema";
import { createAutoPost } from "@/server/services/auto-feed";
import { getRuleTemplate, formatRulesAsText, getAllRuleTemplates } from "@/server/services/rules-engine";
import {
  notifyTournamentEnrollment,
  notifySponsorshipApproved,
  notifyPrizeAwarded,
} from "@/server/services/notification-service";
import {
  generateBracket as generateBracketService,
  advanceWinner as advanceWinnerService,
  getStandings as getStandingsService,
} from "@/server/services/bracket-generator";

export const tournamentRouter = createTRPCRouter({
  // List tournaments
  list: publicProcedure
    .input(
      z.object({
        sportId: z.string().uuid().optional(),
        status: z.enum(["draft", "registration_open", "registration_closed", "in_progress", "completed", "cancelled"]).optional(),
        city: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];
      if (input.sportId) conditions.push(eq(tournaments.sportId, input.sportId));
      if (input.status) conditions.push(eq(tournaments.status, input.status));
      if (input.city) conditions.push(ilike(tournaments.city, `%${input.city}%`));
      if (input.search) conditions.push(ilike(tournaments.name, `%${input.search}%`));

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const results = await ctx.db.query.tournaments.findMany({
        where,
        with: {
          sport: true,
          organizer: true,
          sponsors: {
            where: eq(tournamentSponsors.status, "active"),
            with: { brandUser: { columns: { id: true, name: true, image: true } } },
            orderBy: [desc(tournamentSponsors.tier)],
          },
        },
        orderBy: [desc(tournaments.startDate)],
        limit: input.limit + 1,
      });

      let nextCursor: string | undefined;
      if (results.length > input.limit) {
        const next = results.pop()!;
        nextCursor = next.id;
      }

      return { items: results, nextCursor };
    }),

  // Get tournament by ID (includes sponsors + prizes)
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const tournament = await ctx.db.query.tournaments.findFirst({
        where: eq(tournaments.id, input.id),
        with: {
          sport: true,
          organizer: true,
          enrollments: { with: { user: true } },
          matches: { orderBy: [desc(matches.round)] },
          sponsors: {
            with: {
              brandUser: { columns: { id: true, name: true, image: true } },
              prizes: true,
            },
            orderBy: [desc(tournamentSponsors.tier)],
          },
          prizes: {
            with: {
              sponsor: { with: { brandUser: { columns: { name: true, image: true } } } },
              awardedTo: { columns: { id: true, name: true, image: true } },
            },
            orderBy: [tournamentPrizes.placement],
          },
        },
      });
      return tournament;
    }),

  // Get sponsors for a tournament (public)
  sponsors: publicProcedure
    .input(z.object({ tournamentId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.tournamentSponsors.findMany({
        where: and(
          eq(tournamentSponsors.tournamentId, input.tournamentId),
          eq(tournamentSponsors.status, "active")
        ),
        with: {
          brandUser: { columns: { id: true, name: true, image: true } },
          prizes: true,
        },
        orderBy: [desc(tournamentSponsors.tier)],
      });
    }),

  // Get prizes for a tournament (public)
  prizes: publicProcedure
    .input(z.object({ tournamentId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.tournamentPrizes.findMany({
        where: eq(tournamentPrizes.tournamentId, input.tournamentId),
        with: {
          sponsor: { with: { brandUser: { columns: { name: true, image: true } } } },
          awardedTo: { columns: { id: true, name: true, image: true } },
        },
        orderBy: [tournamentPrizes.placement],
      });
    }),

  // Approve sponsorship (organizer only)
  approveSponsorship: protectedProcedure
    .input(z.object({ sponsorshipId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const sponsorship = await ctx.db.query.tournamentSponsors.findFirst({
        where: eq(tournamentSponsors.id, input.sponsorshipId),
        with: { tournament: true, brandUser: { columns: { name: true } } },
      });

      if (!sponsorship) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Patrocinio nao encontrado" });
      }

      if (sponsorship.tournament?.organizerId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Apenas o organizador pode aprovar patrocinios" });
      }

      const [updated] = await ctx.db
        .update(tournamentSponsors)
        .set({ status: "active", updatedAt: new Date() })
        .where(eq(tournamentSponsors.id, input.sponsorshipId))
        .returning();

      // Notify brand
      notifySponsorshipApproved(
        sponsorship.brandUserId,
        sponsorship.tournament?.name ?? "",
        sponsorship.tournamentId
      ).catch(() => {});

      return updated;
    }),

  // Reject sponsorship (organizer only, refunds GCoins)
  rejectSponsorship: protectedProcedure
    .input(z.object({ sponsorshipId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const sponsorship = await ctx.db.query.tournamentSponsors.findFirst({
        where: eq(tournamentSponsors.id, input.sponsorshipId),
        with: { tournament: true },
      });

      if (!sponsorship) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Patrocinio nao encontrado" });
      }

      if (sponsorship.tournament?.organizerId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Apenas o organizador pode rejeitar patrocinios" });
      }

      // Refund GCoins
      const refundAmount = Number(sponsorship.gcoinContribution ?? 0);
      if (refundAmount > 0) {
        await ctx.db
          .update(users)
          .set({ gcoinsReal: sql`${users.gcoinsReal} + ${refundAmount}` })
          .where(eq(users.id, sponsorship.brandUserId));

        await ctx.db.insert(gcoinTransactions).values({
          userId: sponsorship.brandUserId,
          type: "real",
          category: "brand_reward",
          amount: refundAmount.toString(),
          description: `Patrocinio rejeitado - ${sponsorship.tournament?.name}`,
        });

        await ctx.db
          .update(tournaments)
          .set({ prizePool: sql`GREATEST(${tournaments.prizePool} - ${refundAmount}, 0)` })
          .where(eq(tournaments.id, sponsorship.tournamentId));
      }

      await ctx.db.delete(tournamentPrizes).where(eq(tournamentPrizes.sponsorId, input.sponsorshipId));

      const [updated] = await ctx.db
        .update(tournamentSponsors)
        .set({ status: "rejected", updatedAt: new Date() })
        .where(eq(tournamentSponsors.id, input.sponsorshipId))
        .returning();

      return updated;
    }),

  // Award prizes to tournament winners (organizer action)
  awardPrizes: protectedProcedure
    .input(
      z.object({
        tournamentId: z.string().uuid(),
        awards: z.array(
          z.object({
            prizeId: z.string().uuid(),
            userId: z.string().uuid(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tournament = await ctx.db.query.tournaments.findFirst({
        where: eq(tournaments.id, input.tournamentId),
      });

      if (!tournament) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Torneio nao encontrado" });
      }

      if (tournament.organizerId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Apenas o organizador pode distribuir premios" });
      }

      for (const award of input.awards) {
        const prize = await ctx.db.query.tournamentPrizes.findFirst({
          where: and(
            eq(tournamentPrizes.id, award.prizeId),
            eq(tournamentPrizes.tournamentId, input.tournamentId)
          ),
          with: { sponsor: { with: { brandUser: { columns: { name: true } } } } },
        });

        if (!prize || prize.isAwarded) continue;

        // Award the prize
        await ctx.db
          .update(tournamentPrizes)
          .set({
            isAwarded: true,
            awardedToUserId: award.userId,
            awardedAt: new Date(),
          })
          .where(eq(tournamentPrizes.id, award.prizeId));

        // If GCoin prize, credit the winner
        if (prize.prizeType === "gcoin" && prize.gcoinAmount) {
          const amount = Number(prize.gcoinAmount);
          await ctx.db
            .update(users)
            .set({ gcoinsReal: sql`${users.gcoinsReal} + ${amount}` })
            .where(eq(users.id, award.userId));

          await ctx.db.insert(gcoinTransactions).values({
            userId: award.userId,
            type: "real",
            category: "tournament_prize",
            amount: amount.toString(),
            description: `Premio ${prize.placement}o lugar - ${tournament.name}${prize.sponsor?.brandUser?.name ? ` (patrocinado por ${prize.sponsor.brandUser.name})` : ""}`,
            referenceId: tournament.id,
            referenceType: "tournament_prize",
          });

          const brandName = prize.sponsor?.brandUser?.name;
          notifyPrizeAwarded(
            award.userId,
            tournament.name,
            prize.placement,
            `${amount} GCoins${brandName ? ` (${brandName})` : ""}`,
            tournament.id
          ).catch(() => {});
        }

        // If product prize, notify winner
        if (prize.prizeType === "product" && prize.productName) {
          const brandName = prize.sponsor?.brandUser?.name ?? "";
          notifyPrizeAwarded(
            award.userId,
            tournament.name,
            prize.placement,
            `${prize.productName}${brandName ? ` (${brandName})` : ""}`,
            tournament.id
          ).catch(() => {});
        }
      }

      return { success: true, awarded: input.awards.length };
    }),

  // Create tournament
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(255),
        description: z.string().optional(),
        rules: z.string().optional(),
        sportId: z.string().uuid(),
        format: z.enum(["single_elimination", "double_elimination", "round_robin", "swiss", "league"]).default("single_elimination"),
        maxParticipants: z.number().min(2).max(256).default(32),
        minParticipants: z.number().min(2).default(4),
        entryFee: z.number().min(0).default(0),
        entryFeeType: z.enum(["real", "gamification"]).default("real"),
        prizePool: z.number().min(0).default(0),
        city: z.string().optional(),
        state: z.string().optional(),
        address: z.string().optional(),
        isOnline: z.boolean().default(false),
        level: z.enum(["A", "B", "C"]).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        registrationDeadline: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slug = input.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        + "-" + Date.now().toString(36);

      const [tournament] = await ctx.db
        .insert(tournaments)
        .values({
          ...input,
          slug,
          organizerId: ctx.session.user.id,
          entryFee: input.entryFee.toString(),
          prizePool: input.prizePool.toString(),
          startDate: input.startDate ? new Date(input.startDate) : null,
          endDate: input.endDate ? new Date(input.endDate) : null,
          registrationDeadline: input.registrationDeadline ? new Date(input.registrationDeadline) : null,
        })
        .returning();

      if (tournament) {
        createAutoPost({
          type: "tournament_created",
          userId: ctx.session.user.id,
          data: { tournamentName: input.name },
          sportId: input.sportId,
          tournamentId: tournament.id,
        }).catch(() => {});
      }

      return tournament;
    }),

  // Update tournament
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(3).max(255).optional(),
        description: z.string().optional(),
        rules: z.string().optional(),
        status: z.enum(["draft", "registration_open", "registration_closed", "in_progress", "completed", "cancelled"]).optional(),
        maxParticipants: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, startDate, endDate, ...rest } = input;
      const [updated] = await ctx.db
        .update(tournaments)
        .set({
          ...rest,
          ...(startDate && { startDate: new Date(startDate) }),
          ...(endDate && { endDate: new Date(endDate) }),
          updatedAt: new Date(),
        })
        .where(and(eq(tournaments.id, id), eq(tournaments.organizerId, ctx.session.user.id)))
        .returning();
      return updated;
    }),

  // Enroll in tournament
  enroll: protectedProcedure
    .input(z.object({ tournamentId: z.string().uuid(), teamId: z.string().uuid().optional() }))
    .mutation(async ({ ctx, input }) => {
      const [enrollment] = await ctx.db
        .insert(enrollments)
        .values({
          tournamentId: input.tournamentId,
          userId: ctx.session.user.id,
          teamId: input.teamId,
          status: "pending",
        })
        .onConflictDoNothing()
        .returning();

      const tournament = await ctx.db.query.tournaments.findFirst({
        where: eq(tournaments.id, input.tournamentId),
        columns: { name: true, sportId: true },
      });
      if (tournament) {
        createAutoPost({
          type: "tournament_enrolled",
          userId: ctx.session.user.id,
          data: { tournamentName: tournament.name },
          sportId: tournament.sportId,
          tournamentId: input.tournamentId,
        }).catch(() => {});

        notifyTournamentEnrollment(ctx.session.user.id, tournament.name, input.tournamentId).catch(() => {});
      }

      return enrollment;
    }),

  // Get my tournaments (as organizer) - includes pending sponsorships
  myTournaments: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.tournaments.findMany({
      where: eq(tournaments.organizerId, ctx.session.user.id),
      with: {
        sport: true,
        sponsors: {
          with: { brandUser: { columns: { id: true, name: true, image: true } } },
        },
      },
      orderBy: [desc(tournaments.createdAt)],
    });
  }),

  // Get enrolled tournaments
  myEnrollments: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.enrollments.findMany({
      where: eq(enrollments.userId, ctx.session.user.id),
      with: {
        tournament: { with: { sport: true } },
      },
      orderBy: [desc(enrollments.createdAt)],
    });
  }),

  // Get rule template for a sport
  getRulesTemplate: publicProcedure
    .input(z.object({ sportSlug: z.string() }))
    .query(async ({ input }) => {
      const template = getRuleTemplate(input.sportSlug);
      if (!template) return null;
      return {
        template,
        formatted: formatRulesAsText(template),
      };
    }),

  // List all available rule templates
  listRuleTemplates: publicProcedure
    .query(async () => {
      return getAllRuleTemplates();
    }),

  // Generate bracket / draw
  generateBracket: protectedProcedure
    .input(z.object({ tournamentId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const tournament = await ctx.db.query.tournaments.findFirst({
        where: eq(tournaments.id, input.tournamentId),
      });

      if (!tournament) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Torneio nao encontrado." });
      }

      if (tournament.organizerId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Apenas o organizador pode gerar as chaves." });
      }

      try {
        await generateBracketService(ctx.db, input.tournamentId);
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Erro ao gerar as chaves do torneio.",
        });
      }
    }),

  // Advance winner after match completion
  advanceWinner: protectedProcedure
    .input(z.object({ matchId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const match = await ctx.db.query.matches.findFirst({
        where: eq(matches.id, input.matchId),
        with: { tournament: true },
      });

      if (!match) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Partida nao encontrada." });
      }

      if (match.tournament?.organizerId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Apenas o organizador pode avancar o vencedor." });
      }

      try {
        await advanceWinnerService(ctx.db, input.matchId);
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Erro ao avancar o vencedor.",
        });
      }
    }),

  // Get standings
  standings: publicProcedure
    .input(z.object({ tournamentId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      try {
        return await getStandingsService(ctx.db, input.tournamentId);
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Erro ao buscar classificacao.",
        });
      }
    }),
});
