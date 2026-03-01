import { z } from "zod";
import { eq, desc, and, ilike } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { tournaments, enrollments, matches } from "@/server/db/schema";
import { createAutoPost } from "@/server/services/auto-feed";
import { getRuleTemplate, formatRulesAsText, getAllRuleTemplates } from "@/server/services/rules-engine";
import { notifyTournamentEnrollment } from "@/server/services/notification-service";
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

  // Get tournament by ID
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const tournament = await ctx.db.query.tournaments.findFirst({
        where: eq(tournaments.id, input.id),
        with: {
          sport: true,
          organizer: true,
          enrollments: { with: { user: true } },
          matches: {
            orderBy: [desc(matches.round)],
          },
        },
      });
      return tournament;
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

      // Auto-post for enrollment
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

        // Notify the user about enrollment confirmation
        notifyTournamentEnrollment(ctx.session.user.id, tournament.name, input.tournamentId).catch(() => {});
      }

      return enrollment;
    }),

  // Get my tournaments (as organizer)
  myTournaments: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.tournaments.findMany({
      where: eq(tournaments.organizerId, ctx.session.user.id),
      with: { sport: true },
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
      // Verify user is the organizer
      const tournament = await ctx.db.query.tournaments.findFirst({
        where: eq(tournaments.id, input.tournamentId),
      });

      if (!tournament) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Torneio nao encontrado.",
        });
      }

      if (tournament.organizerId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas o organizador pode gerar as chaves.",
        });
      }

      try {
        await generateBracketService(ctx.db, input.tournamentId);
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Erro ao gerar as chaves do torneio.",
        });
      }
    }),

  // Advance winner after match completion
  advanceWinner: protectedProcedure
    .input(z.object({ matchId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Verify the match exists and get the tournament to check organizer
      const match = await ctx.db.query.matches.findFirst({
        where: eq(matches.id, input.matchId),
        with: { tournament: true },
      });

      if (!match) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Partida nao encontrada.",
        });
      }

      if (match.tournament?.organizerId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas o organizador pode avancar o vencedor.",
        });
      }

      try {
        await advanceWinnerService(ctx.db, input.matchId);
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof Error
              ? error.message
              : "Erro ao avancar o vencedor.",
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
          message:
            error instanceof Error
              ? error.message
              : "Erro ao buscar classificacao.",
        });
      }
    }),
});
