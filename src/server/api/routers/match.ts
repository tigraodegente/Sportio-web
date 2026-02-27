import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { matches } from "@/server/db/schema";

export const matchRouter = createTRPCRouter({
  // Get match by ID
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.matches.findFirst({
        where: eq(matches.id, input.id),
        with: {
          tournament: { with: { sport: true } },
          bets: true,
        },
      });
    }),

  // List matches by tournament
  listByTournament: publicProcedure
    .input(z.object({ tournamentId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.matches.findMany({
        where: eq(matches.tournamentId, input.tournamentId),
        orderBy: [desc(matches.round), desc(matches.position)],
      });
    }),

  // Update match score (referee/organizer)
  updateScore: protectedProcedure
    .input(
      z.object({
        matchId: z.string().uuid(),
        score1: z.number().min(0),
        score2: z.number().min(0),
        status: z.enum(["scheduled", "live", "completed", "cancelled"]).optional(),
        winnerId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { matchId, ...data } = input;
      const [updated] = await ctx.db
        .update(matches)
        .set({
          ...data,
          ...(input.status === "completed" && { completedAt: new Date() }),
          ...(input.status === "live" && { startedAt: new Date() }),
        })
        .where(eq(matches.id, matchId))
        .returning();
      return updated;
    }),

  // Get live matches
  live: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.matches.findMany({
      where: eq(matches.status, "live"),
      with: {
        tournament: { with: { sport: true } },
      },
    });
  }),
});
