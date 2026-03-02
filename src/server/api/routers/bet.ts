import { z } from "zod";
import { eq, desc, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { bets, users, gcoinTransactions, challenges } from "@/server/db/schema";
import { calculateOdds, calculateChallengeOdds } from "@/server/services/odds-calculator";
import { awardXP } from "@/server/services/gamification";

export const betRouter = createTRPCRouter({
  // Apostar em partida de torneio
  place: protectedProcedure
    .input(
      z.object({
        matchId: z.string().uuid(),
        tournamentId: z.string().uuid(),
        betType: z.enum(["winner", "score", "mvp", "custom"]),
        prediction: z.record(z.string(), z.unknown()),
        amount: z.number().positive().max(10000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
        columns: { gcoinsGamification: true },
      });

      if (Number(user?.gcoinsGamification ?? 0) < input.amount) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Saldo insuficiente de GCoins" });
      }

      const { odds } = await calculateOdds(ctx.db, input.matchId, input.betType, input.prediction);
      const potentialWin = input.amount * odds;

      await ctx.db
        .update(users)
        .set({
          gcoinsGamification: sql`${users.gcoinsGamification} - ${input.amount}`,
        })
        .where(eq(users.id, ctx.session.user.id));

      const [bet] = await ctx.db
        .insert(bets)
        .values({
          userId: ctx.session.user.id,
          matchId: input.matchId,
          tournamentId: input.tournamentId,
          betType: input.betType,
          prediction: input.prediction,
          amount: input.amount.toString(),
          odds: odds.toString(),
          potentialWin: potentialWin.toString(),
        })
        .returning();

      await ctx.db.insert(gcoinTransactions).values({
        userId: ctx.session.user.id,
        type: "gamification",
        category: "bet_place",
        amount: (-input.amount).toString(),
        description: `Palpite colocado`,
        referenceId: bet.id,
        referenceType: "bet",
      });

      awardXP(ctx.session.user.id, "bet_placed").catch(() => {});

      return bet;
    }),

  // Apostar em desafio 1v1
  placeChallengeBet: protectedProcedure
    .input(
      z.object({
        challengeId: z.string().uuid(),
        winnerId: z.string().uuid(),
        amount: z.number().positive().max(10000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Verificar desafio existe e está aberto para apostas
      const challenge = await ctx.db.query.challenges.findFirst({
        where: eq(challenges.id, input.challengeId),
      });

      if (!challenge) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Desafio não encontrado" });
      }
      if (challenge.status !== "betting_open") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Apostas não estão abertas para este desafio" });
      }
      if (challenge.bettingDeadline && new Date() > challenge.bettingDeadline) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Prazo de apostas encerrado" });
      }

      // Não permitir que os participantes apostem no próprio desafio
      if (userId === challenge.creatorId || userId === challenge.opponentId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Participantes do desafio não podem apostar" });
      }

      // Verificar que winnerId é um dos participantes
      if (input.winnerId !== challenge.creatorId && input.winnerId !== challenge.opponentId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Escolha um dos participantes como vencedor" });
      }

      // Verificar saldo
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { gcoinsGamification: true },
      });

      if (Number(user?.gcoinsGamification ?? 0) < input.amount) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Saldo insuficiente de GCoins" });
      }

      // Calcular odds
      const prediction = { winnerId: input.winnerId };
      const { odds } = await calculateChallengeOdds(ctx.db, input.challengeId, prediction);
      const potentialWin = input.amount * odds;

      // Debitar
      await ctx.db
        .update(users)
        .set({
          gcoinsGamification: sql`${users.gcoinsGamification} - ${input.amount}`,
        })
        .where(eq(users.id, userId));

      // Criar aposta
      const [bet] = await ctx.db
        .insert(bets)
        .values({
          userId,
          challengeId: input.challengeId,
          betType: "winner",
          prediction,
          amount: input.amount.toString(),
          odds: odds.toString(),
          potentialWin: potentialWin.toString(),
        })
        .returning();

      // Log transação
      await ctx.db.insert(gcoinTransactions).values({
        userId,
        type: "gamification",
        category: "bet_place",
        amount: (-input.amount).toString(),
        description: `Palpite no desafio "${challenge.title}"`,
        referenceId: bet.id,
        referenceType: "bet",
      });

      awardXP(userId, "bet_placed").catch(() => {});

      return bet;
    }),

  // Odds de desafio
  getChallengeOdds: publicProcedure
    .input(
      z.object({
        challengeId: z.string().uuid(),
        winnerId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const prediction = { winnerId: input.winnerId };
      return calculateChallengeOdds(ctx.db, input.challengeId, prediction);
    }),

  // Minhas apostas
  myBets: protectedProcedure
    .input(
      z.object({
        result: z.enum(["pending", "won", "lost", "cancelled", "refunded"]).optional(),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(bets.userId, ctx.session.user.id)];
      if (input.result) conditions.push(eq(bets.result, input.result));

      return ctx.db.query.bets.findMany({
        where: and(...conditions),
        with: {
          match: true,
          tournament: true,
          challenge: {
            with: {
              creator: { columns: { id: true, name: true, image: true } },
              opponent: { columns: { id: true, name: true, image: true } },
            },
          },
        },
        orderBy: [desc(bets.createdAt)],
        limit: input.limit,
      });
    }),

  // Odds de partida de torneio
  getOdds: publicProcedure
    .input(
      z.object({
        matchId: z.string().uuid(),
        betType: z.enum(["winner", "score", "mvp", "custom"]),
        prediction: z.record(z.string(), z.unknown()),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await calculateOdds(ctx.db, input.matchId, input.betType, input.prediction);
      return result;
    }),

  // Ranking de apostadores
  leaderboard: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(50) }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select({
          userId: bets.userId,
          totalWins: sql<number>`count(*) filter (where ${bets.result} = 'won')`,
          totalBets: sql<number>`count(*)`,
          totalProfit: sql<number>`sum(case when ${bets.result} = 'won' then cast(${bets.potentialWin} as numeric) else -cast(${bets.amount} as numeric) end)`,
        })
        .from(bets)
        .groupBy(bets.userId)
        .orderBy(sql`sum(case when ${bets.result} = 'won' then cast(${bets.potentialWin} as numeric) else -cast(${bets.amount} as numeric) end) desc`)
        .limit(input.limit);

      return results;
    }),
});
