import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { matches } from "@/server/db/schema";
import { createAutoPost } from "@/server/services/auto-feed";
import { settleBets, cancelMatchBets } from "@/server/services/bet-settlement";
import { createNotification } from "@/server/services/notification-service";
import { updateRatingsAfterMatch } from "@/server/services/gamification";

export const matchRouter = createTRPCRouter({
  // Get match by ID
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.matches.findFirst({
        where: eq(matches.id, input.id),
        with: {
          tournament: { with: { sport: true } },
          player1: { columns: { id: true, name: true, image: true } },
          player2: { columns: { id: true, name: true, image: true } },
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

      // Auto-post for completed matches
      if (input.status === "completed" && input.winnerId) {
        const match = await ctx.db.query.matches.findFirst({
          where: eq(matches.id, matchId),
          with: { tournament: true },
        });
        if (match) {
          const loserId =
            match.player1Id === input.winnerId
              ? match.player2Id
              : match.player1Id;

          // Winner post
          createAutoPost({
            type: "match_won",
            userId: input.winnerId,
            data: {
              opponentName: "adversario",
              score: `${input.score1} x ${input.score2}`,
              tournamentName: match.tournament?.name ?? "torneio",
            },
            tournamentId: match.tournamentId,
          }).catch(() => {});

          // Loser post
          if (loserId) {
            createAutoPost({
              type: "match_lost",
              userId: loserId,
              data: {
                opponentName: "adversario",
                score: `${input.score2} x ${input.score1}`,
                tournamentName: match.tournament?.name ?? "torneio",
              },
              tournamentId: match.tournamentId,
            }).catch(() => {});
          }

          // Settle all bets for this match (pass actual scores for score-type bets)
          settleBets(matchId, input.winnerId, {
            score1: input.score1,
            score2: input.score2,
          }).catch(() => {});

          // Update ELO ratings and award XP
          if (match.player1Id && match.player2Id && match.tournament?.sportId) {
            updateRatingsAfterMatch(
              match.player1Id,
              match.player2Id,
              input.winnerId,
              match.tournament.sportId
            ).catch(() => {});
          }

          // Notify winner and loser
          createNotification({
            userId: input.winnerId,
            type: "match",
            title: "Vitoria!",
            message: `Voce venceu por ${input.score1} x ${input.score2} no torneio "${match.tournament?.name}"`,
            data: { matchId, tournamentId: match.tournamentId },
          }).catch(() => {});

          if (loserId) {
            createNotification({
              userId: loserId,
              type: "match",
              title: "Resultado da partida",
              message: `Resultado: ${input.score2} x ${input.score1} no torneio "${match.tournament?.name}"`,
              data: { matchId, tournamentId: match.tournamentId },
            }).catch(() => {});
          }
        }
      }

      // Cancel bets if match is cancelled
      if (input.status === "cancelled") {
        cancelMatchBets(matchId).catch(() => {});
      }

      return updated;
    }),

  // Get live matches
  live: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.matches.findMany({
      where: eq(matches.status, "live"),
      with: {
        tournament: { with: { sport: true } },
        player1: { columns: { id: true, name: true, image: true } },
        player2: { columns: { id: true, name: true, image: true } },
      },
    });
  }),
});
