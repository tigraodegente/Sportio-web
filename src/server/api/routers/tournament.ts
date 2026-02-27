import { z } from "zod";
import { eq, desc, and, ilike } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { tournaments, enrollments, matches } from "@/server/db/schema";

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
});
