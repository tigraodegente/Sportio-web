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
  tournamentInvites,
  users,
  userRoles,
  gcoinTransactions,
} from "@/server/db/schema";
import { createAutoPost } from "@/server/services/auto-feed";
import { getRuleTemplate, formatRulesAsText, getAllRuleTemplates } from "@/server/services/rules-engine";
import {
  notifyTournamentEnrollment,
  notifySponsorshipApproved,
  notifyPrizeAwarded,
  notifyTournamentInviteAthlete,
  notifyTournamentInviteSponsor,
  notifyInviteAccepted,
  notifyInviteDeclined,
} from "@/server/services/notification-service";
import { awardXP } from "@/server/services/gamification";
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
          id: crypto.randomUUID(),
          name: input.name,
          description: input.description ?? null,
          rules: input.rules ?? null,
          slug,
          sportId: input.sportId,
          format: input.format,
          organizerId: ctx.session.user.id,
          maxParticipants: input.maxParticipants,
          minParticipants: input.minParticipants,
          entryFee: input.entryFee.toString(),
          entryFeeType: input.entryFeeType,
          prizePool: input.prizePool.toString(),
          city: input.city ?? null,
          state: input.state ?? null,
          address: input.address ?? null,
          isOnline: input.isOnline,
          level: input.level ?? null,
          coverImage: null,
          startDate: input.startDate ? new Date(input.startDate) : null,
          endDate: input.endDate ? new Date(input.endDate) : null,
          registrationDeadline: input.registrationDeadline ? new Date(input.registrationDeadline) : null,
          status: "registration_open",
          currentParticipants: 0,
          prizeDistribution: null,
          bracketData: null,
          createdAt: new Date(),
          updatedAt: new Date(),
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

        awardXP(ctx.session.user.id, "tournament_created").catch(() => {});
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
      const tournament = await ctx.db.query.tournaments.findFirst({
        where: eq(tournaments.id, input.tournamentId),
      });

      if (!tournament) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Torneio nao encontrado" });
      }

      if (tournament.status !== "registration_open") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Inscricoes nao estao abertas" });
      }

      if ((tournament.currentParticipants ?? 0) >= (tournament.maxParticipants ?? 32)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Torneio lotado" });
      }

      // Entry fee collection
      const entryFee = Number(tournament.entryFee ?? 0);
      let paidAmount: string | null = null;
      if (entryFee > 0) {
        const user = await ctx.db.query.users.findFirst({
          where: eq(users.id, ctx.session.user.id),
          columns: { gcoinsReal: true, gcoinsGamification: true },
        });
        const feeField = tournament.entryFeeType === "real" ? "gcoinsReal" : "gcoinsGamification";
        const balance = Number(feeField === "gcoinsReal" ? user?.gcoinsReal ?? 0 : user?.gcoinsGamification ?? 0);
        if (balance < entryFee) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Saldo insuficiente para taxa de inscricao. Necessario: ${entryFee} GCoins ${tournament.entryFeeType}. Saldo: ${balance.toFixed(0)}.`,
          });
        }
        // Deduct entry fee
        await ctx.db.update(users)
          .set({ [feeField]: sql`${users[feeField]} - ${entryFee}` })
          .where(eq(users.id, ctx.session.user.id));
        // Log transaction
        await ctx.db.insert(gcoinTransactions).values({
          id: crypto.randomUUID(), userId: ctx.session.user.id,
          type: tournament.entryFeeType ?? "real", category: "tournament_entry",
          amount: (-entryFee).toString(), balanceAfter: null,
          description: `Taxa de inscricao: ${tournament.name}`,
          referenceId: input.tournamentId, referenceType: "tournament_entry_fee",
          createdAt: new Date(),
        });
        // Add to prize pool
        await ctx.db.update(tournaments)
          .set({ prizePool: sql`${tournaments.prizePool} + ${entryFee}` })
          .where(eq(tournaments.id, input.tournamentId));
        paidAmount = entryFee.toString();
      }

      const [enrollment] = await ctx.db
        .insert(enrollments)
        .values({
          id: crypto.randomUUID(),
          tournamentId: input.tournamentId,
          userId: ctx.session.user.id,
          teamId: input.teamId ?? null,
          status: "confirmed",
          seed: null,
          placement: null,
          paidAmount,
          checkedInAt: null,
          createdAt: new Date(),
        })
        .onConflictDoNothing()
        .returning();

      // Increment participant count and award gamification GCoins
      if (enrollment) {
        await ctx.db
          .update(tournaments)
          .set({
            currentParticipants: sql`${tournaments.currentParticipants} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(tournaments.id, input.tournamentId));

        // Enrollment bonus: 50 gamification GCoins
        await ctx.db
          .update(users)
          .set({ gcoinsGamification: sql`${users.gcoinsGamification} + 50` })
          .where(eq(users.id, ctx.session.user.id));

        await ctx.db.insert(gcoinTransactions).values({
          id: crypto.randomUUID(),
          userId: ctx.session.user.id,
          type: "gamification",
          category: "tournament_entry",
          amount: "50",
          balanceAfter: null,
          description: `Bonus por inscricao: ${tournament.name}`,
          referenceId: input.tournamentId,
          referenceType: "tournament",
          createdAt: new Date(),
        });
      }

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

      // Award XP for enrollment
      awardXP(ctx.session.user.id, "tournament_enrolled").catch(() => {});

      return enrollment;
    }),

  // Check-in to a tournament
  checkIn: protectedProcedure
    .input(z.object({ tournamentId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const enrollment = await ctx.db.query.enrollments.findFirst({
        where: and(
          eq(enrollments.tournamentId, input.tournamentId),
          eq(enrollments.userId, ctx.session.user.id),
          eq(enrollments.status, "confirmed")
        ),
      });
      if (!enrollment) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Inscricao nao encontrada ou nao confirmada" });
      }
      if (enrollment.checkedInAt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Check-in ja realizado" });
      }
      const [updated] = await ctx.db.update(enrollments)
        .set({ checkedInAt: new Date(), status: "checked_in" })
        .where(eq(enrollments.id, enrollment.id))
        .returning();

      awardXP(ctx.session.user.id, "tournament_checkin").catch(() => {});

      return updated;
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

  // ==================== INVITE SYSTEM ====================

  // Search users to invite (filtered by role)
  searchUsersForInvite: protectedProcedure
    .input(
      z.object({
        tournamentId: z.string().uuid(),
        query: z.string().min(1),
        type: z.enum(["athlete", "sponsor"]),
        limit: z.number().min(1).max(20).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify organizer
      const tournament = await ctx.db.query.tournaments.findFirst({
        where: eq(tournaments.id, input.tournamentId),
        columns: { organizerId: true },
      });
      if (!tournament || tournament.organizerId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Apenas o organizador pode convidar" });
      }

      // Get users who already have the relevant role
      const targetRole = input.type === "sponsor" ? "brand" : "athlete";
      const usersWithRole = await ctx.db
        .select({
          id: users.id,
          name: users.name,
          image: users.image,
          city: users.city,
          state: users.state,
        })
        .from(users)
        .innerJoin(userRoles, and(eq(userRoles.userId, users.id), eq(userRoles.role, targetRole)))
        .where(ilike(users.name, `%${input.query}%`))
        .limit(input.limit);

      // Get already-invited users for this tournament + type
      const existingInvites = await ctx.db.query.tournamentInvites.findMany({
        where: and(
          eq(tournamentInvites.tournamentId, input.tournamentId),
          eq(tournamentInvites.type, input.type)
        ),
        columns: { invitedUserId: true, status: true },
      });
      const invitedMap = new Map(existingInvites.map(i => [i.invitedUserId, i.status]));

      // For athlete invites, also check enrollments
      let enrolledSet = new Set<string>();
      if (input.type === "athlete") {
        const existingEnrollments = await ctx.db.query.enrollments.findMany({
          where: eq(enrollments.tournamentId, input.tournamentId),
          columns: { userId: true },
        });
        enrolledSet = new Set(existingEnrollments.map(e => e.userId));
      }

      // For sponsor invites, also check existing sponsors
      let sponsoredSet = new Set<string>();
      if (input.type === "sponsor") {
        const existingSponsors = await ctx.db.query.tournamentSponsors.findMany({
          where: eq(tournamentSponsors.tournamentId, input.tournamentId),
          columns: { brandUserId: true },
        });
        sponsoredSet = new Set(existingSponsors.map(s => s.brandUserId));
      }

      return usersWithRole.map(u => ({
        ...u,
        inviteStatus: invitedMap.get(u.id) ?? null,
        alreadyEnrolled: enrolledSet.has(u.id),
        alreadySponsoring: sponsoredSet.has(u.id),
      }));
    }),

  // Send invite to athlete or brand
  sendInvite: protectedProcedure
    .input(
      z.object({
        tournamentId: z.string().uuid(),
        invitedUserId: z.string().uuid(),
        type: z.enum(["athlete", "sponsor"]),
        message: z.string().max(500).optional(),
        suggestedTier: z.enum(["main", "gold", "silver", "bronze"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tournament = await ctx.db.query.tournaments.findFirst({
        where: eq(tournaments.id, input.tournamentId),
        columns: { id: true, organizerId: true, name: true },
      });

      if (!tournament) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Torneio nao encontrado" });
      }
      if (tournament.organizerId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Apenas o organizador pode enviar convites" });
      }

      // Set expiration to 7 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const [invite] = await ctx.db
        .insert(tournamentInvites)
        .values({
          tournamentId: input.tournamentId,
          invitedUserId: input.invitedUserId,
          invitedByUserId: ctx.session.user.id,
          type: input.type,
          message: input.message,
          suggestedTier: input.type === "sponsor" ? input.suggestedTier : undefined,
          expiresAt,
        })
        .onConflictDoNothing()
        .returning();

      if (!invite) {
        throw new TRPCError({ code: "CONFLICT", message: "Convite ja enviado para este usuario" });
      }

      // Get organizer name for notification
      const organizer = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
        columns: { name: true },
      });

      // Send notification
      if (input.type === "athlete") {
        notifyTournamentInviteAthlete(
          input.invitedUserId,
          organizer?.name ?? "Organizador",
          tournament.name,
          tournament.id,
          invite.id
        ).catch(() => {});
      } else {
        notifyTournamentInviteSponsor(
          input.invitedUserId,
          organizer?.name ?? "Organizador",
          tournament.name,
          tournament.id,
          invite.id,
          input.suggestedTier
        ).catch(() => {});
      }

      return invite;
    }),

  // List invites sent for a tournament (organizer view)
  tournamentInvitesList: protectedProcedure
    .input(z.object({ tournamentId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const tournament = await ctx.db.query.tournaments.findFirst({
        where: eq(tournaments.id, input.tournamentId),
        columns: { organizerId: true },
      });
      if (!tournament || tournament.organizerId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
      }

      return ctx.db.query.tournamentInvites.findMany({
        where: eq(tournamentInvites.tournamentId, input.tournamentId),
        with: {
          invitedUser: { columns: { id: true, name: true, image: true, city: true } },
        },
        orderBy: [desc(tournamentInvites.createdAt)],
      });
    }),

  // Cancel invite (organizer only)
  cancelInvite: protectedProcedure
    .input(z.object({ inviteId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.db.query.tournamentInvites.findFirst({
        where: eq(tournamentInvites.id, input.inviteId),
        with: { tournament: { columns: { organizerId: true } } },
      });

      if (!invite || invite.tournament?.organizerId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
      }

      if (invite.status !== "pending") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Convite ja foi respondido" });
      }

      await ctx.db.delete(tournamentInvites).where(eq(tournamentInvites.id, input.inviteId));
      return { success: true };
    }),

  // List received invites (for the logged-in user)
  myInvites: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "accepted", "declined", "expired"]).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(tournamentInvites.invitedUserId, ctx.session.user.id)];
      if (input?.status) {
        conditions.push(eq(tournamentInvites.status, input.status));
      }

      return ctx.db.query.tournamentInvites.findMany({
        where: and(...conditions),
        with: {
          tournament: {
            with: { sport: true, organizer: { columns: { id: true, name: true, image: true } } },
          },
          invitedBy: { columns: { id: true, name: true, image: true } },
        },
        orderBy: [desc(tournamentInvites.createdAt)],
      });
    }),

  // Respond to an invite (accept/decline)
  respondToInvite: protectedProcedure
    .input(
      z.object({
        inviteId: z.string().uuid(),
        response: z.enum(["accepted", "declined"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.db.query.tournamentInvites.findFirst({
        where: and(
          eq(tournamentInvites.id, input.inviteId),
          eq(tournamentInvites.invitedUserId, ctx.session.user.id)
        ),
        with: {
          tournament: { columns: { id: true, name: true, organizerId: true, sportId: true } },
        },
      });

      if (!invite) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Convite nao encontrado" });
      }

      if (invite.status !== "pending") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Este convite ja foi respondido" });
      }

      // Check expiry
      if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
        await ctx.db
          .update(tournamentInvites)
          .set({ status: "expired", respondedAt: new Date() })
          .where(eq(tournamentInvites.id, input.inviteId));
        throw new TRPCError({ code: "BAD_REQUEST", message: "Este convite expirou" });
      }

      // Update invite status
      const [updated] = await ctx.db
        .update(tournamentInvites)
        .set({ status: input.response, respondedAt: new Date() })
        .where(eq(tournamentInvites.id, input.inviteId))
        .returning();

      const userName = (await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
        columns: { name: true },
      }))?.name ?? "Usuario";

      const tournamentName = invite.tournament?.name ?? "";
      const organizerId = invite.tournament?.organizerId ?? "";

      if (input.response === "accepted") {
        // For athlete invite: auto-enroll
        if (invite.type === "athlete" && invite.tournament) {
          await ctx.db
            .insert(enrollments)
            .values({
              tournamentId: invite.tournamentId,
              userId: ctx.session.user.id,
              status: "confirmed",
            })
            .onConflictDoNothing();

          createAutoPost({
            type: "tournament_enrolled",
            userId: ctx.session.user.id,
            data: { tournamentName },
            sportId: invite.tournament.sportId,
            tournamentId: invite.tournamentId,
          }).catch(() => {});
        }

        notifyInviteAccepted(organizerId, userName, tournamentName, invite.tournamentId, invite.type).catch(() => {});
      } else {
        notifyInviteDeclined(organizerId, userName, tournamentName, invite.tournamentId, invite.type).catch(() => {});
      }

      return updated;
    }),

  // Count pending invites (for badge display)
  pendingInvitesCount: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({ count: sql<number>`count(*)::int` })
      .from(tournamentInvites)
      .where(
        and(
          eq(tournamentInvites.invitedUserId, ctx.session.user.id),
          eq(tournamentInvites.status, "pending")
        )
      );
    return result[0]?.count ?? 0;
  }),
});
