import { z } from "zod";
import { eq, desc, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { bets, users, gcoinTransactions } from "@/server/db/schema";
import { calculateOdds } from "@/server/services/odds-calculator";
import { awardXP } from "@/server/services/gamification";

export const betRouter = createTRPCRouter({
  // Place bet
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
      // Check balance
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
        columns: { gcoinsGamification: true },
      });

      if (Number(user?.gcoinsGamification ?? 0) < input.amount) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Saldo insuficiente de GCoins" });
      }

      // Dynamic odds calculation based on existing bets
      const { odds } = await calculateOdds(ctx.db, input.matchId, input.betType, input.prediction);
      const potentialWin = input.amount * odds;

      // Debit user
      await ctx.db
        .update(users)
        .set({
          gcoinsGamification: sql`${users.gcoinsGamification} - ${input.amount}`,
        })
        .where(eq(users.id, ctx.session.user.id));

      // Create bet
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

      // Log transaction
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

  // My bets
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
        },
        orderBy: [desc(bets.createdAt)],
        limit: input.limit,
      });
    }),

  // Get current odds for a match
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

  // Leaderboard
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
