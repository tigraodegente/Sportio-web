import { z } from "zod";
import { eq, desc, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  proMatches,
  proMatchOdds,
  proBets,
  parlays,
  parlayLegs,
  users,
  gcoinTransactions,
} from "@/server/db/schema";
import { awardXP } from "@/server/services/gamification";
import { createSportsDataProvider } from "@/server/services/sports-data";

const sportsData = createSportsDataProvider();

export const proBettingRouter = createTRPCRouter({
  // Get odds for a match
  getOdds: publicProcedure
    .input(z.object({ matchId: z.string() }))
    .query(async ({ ctx, input }) => {
      const odds = await ctx.db.query.proMatchOdds.findMany({
        where: and(
          eq(proMatchOdds.matchId, input.matchId),
          eq(proMatchOdds.isActive, true)
        ),
      });

      // Fall back to mock if no DB odds
      if (odds.length === 0) {
        const match = await ctx.db.query.proMatches.findFirst({
          where: eq(proMatches.id, input.matchId),
        });
        if (match?.externalId) {
          const mockOdds = await sportsData.getMatchOdds(match.externalId);
          return mockOdds.map((o) => ({
            id: crypto.randomUUID(),
            matchId: input.matchId,
            marketType: o.marketType as "1x2" | "over_under" | "btts" | "handicap" | "correct_score" | "goalscorer",
            selection: o.selection,
            oddsDecimal: o.odds.toString(),
            isActive: true,
            updatedAt: new Date(),
          }));
        }
      }

      return odds;
    }),

  // Place single bet
  placeBet: protectedProcedure
    .input(
      z.object({
        matchId: z.string().uuid(),
        marketType: z.enum(["1x2", "over_under", "btts", "handicap", "correct_score", "goalscorer"]),
        selection: z.string().min(1),
        gcoinAmount: z.number().positive().max(50000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate match is open for betting
      const match = await ctx.db.query.proMatches.findFirst({
        where: eq(proMatches.id, input.matchId),
      });

      if (!match) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Partida nao encontrada" });
      }

      if (match.status !== "scheduled" && match.status !== "live") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Partida nao esta aberta para apostas" });
      }

      // Check user balance
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
        columns: { gcoinsGamification: true },
      });

      const balance = Number(user?.gcoinsGamification ?? 0);
      if (balance < input.gcoinAmount) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Saldo insuficiente de GCoins" });
      }

      // Get odds for this selection
      const oddsRecord = await ctx.db.query.proMatchOdds.findFirst({
        where: and(
          eq(proMatchOdds.matchId, input.matchId),
          eq(proMatchOdds.marketType, input.marketType),
          eq(proMatchOdds.selection, input.selection),
          eq(proMatchOdds.isActive, true)
        ),
      });

      // Use DB odds or fall back to mock
      let oddsValue: number;
      if (oddsRecord) {
        oddsValue = Number(oddsRecord.oddsDecimal);
      } else if (match.externalId) {
        const mockOdds = await sportsData.getMatchOdds(match.externalId);
        const found = mockOdds.find(
          (o) => o.marketType === input.marketType && o.selection === input.selection
        );
        if (!found) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Mercado ou selecao invalida" });
        }
        oddsValue = found.odds;
      } else {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Odds nao disponiveis para esta partida" });
      }

      const potentialWin = Math.round(input.gcoinAmount * oddsValue);

      // Deduct GCoins
      await ctx.db
        .update(users)
        .set({
          gcoinsGamification: sql`${users.gcoinsGamification} - ${input.gcoinAmount}`,
        })
        .where(eq(users.id, ctx.session.user.id));

      // Create bet
      const [bet] = await ctx.db
        .insert(proBets)
        .values({
          userId: ctx.session.user.id,
          matchId: input.matchId,
          marketType: input.marketType,
          selection: input.selection,
          oddsAtPlacement: oddsValue.toFixed(2),
          gcoinAmount: input.gcoinAmount,
          potentialWinnings: potentialWin,
        })
        .returning();

      // Log transaction
      await ctx.db.insert(gcoinTransactions).values({
        userId: ctx.session.user.id,
        type: "gamification",
        category: "bet_place",
        amount: (-input.gcoinAmount).toString(),
        description: "Aposta profissional colocada",
        referenceId: bet!.id,
        referenceType: "pro_bet",
      });

      awardXP(ctx.session.user.id, "bet_placed").catch(() => {});

      return bet;
    }),

  // Place parlay (combined bet)
  placeParlay: protectedProcedure
    .input(
      z.object({
        legs: z
          .array(
            z.object({
              matchId: z.string().uuid(),
              marketType: z.enum(["1x2", "over_under", "btts", "handicap", "correct_score", "goalscorer"]),
              selection: z.string().min(1),
            })
          )
          .min(2)
          .max(10),
        gcoinAmount: z.number().positive().max(50000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate ALL matches are open
      const matchIds = input.legs.map((l) => l.matchId);
      const uniqueMatchIds = [...new Set(matchIds)];

      if (uniqueMatchIds.length !== matchIds.length) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Nao pode ter duas selecoes da mesma partida" });
      }

      let combinedOdds = 1;
      const legOdds: number[] = [];

      for (const leg of input.legs) {
        const match = await ctx.db.query.proMatches.findFirst({
          where: eq(proMatches.id, leg.matchId),
        });

        if (!match) {
          throw new TRPCError({ code: "NOT_FOUND", message: `Partida ${leg.matchId} nao encontrada` });
        }

        if (match.status !== "scheduled" && match.status !== "live") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Partida ${match.id} nao esta aberta para apostas`,
          });
        }

        // Get odds
        const oddsRecord = await ctx.db.query.proMatchOdds.findFirst({
          where: and(
            eq(proMatchOdds.matchId, leg.matchId),
            eq(proMatchOdds.marketType, leg.marketType),
            eq(proMatchOdds.selection, leg.selection),
            eq(proMatchOdds.isActive, true)
          ),
        });

        let oddsValue: number;
        if (oddsRecord) {
          oddsValue = Number(oddsRecord.oddsDecimal);
        } else if (match.externalId) {
          const mockOdds = await sportsData.getMatchOdds(match.externalId);
          const found = mockOdds.find(
            (o) => o.marketType === leg.marketType && o.selection === leg.selection
          );
          if (!found) {
            throw new TRPCError({ code: "BAD_REQUEST", message: `Odds invalidas para partida ${match.id}` });
          }
          oddsValue = found.odds;
        } else {
          throw new TRPCError({ code: "BAD_REQUEST", message: `Odds nao disponiveis para partida ${match.id}` });
        }

        combinedOdds *= oddsValue;
        legOdds.push(oddsValue);
      }

      // Check balance
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
        columns: { gcoinsGamification: true },
      });

      const balance = Number(user?.gcoinsGamification ?? 0);
      if (balance < input.gcoinAmount) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Saldo insuficiente de GCoins" });
      }

      const potentialWin = Math.round(input.gcoinAmount * combinedOdds);

      // Deduct GCoins
      await ctx.db
        .update(users)
        .set({
          gcoinsGamification: sql`${users.gcoinsGamification} - ${input.gcoinAmount}`,
        })
        .where(eq(users.id, ctx.session.user.id));

      // Create parlay
      const [parlay] = await ctx.db
        .insert(parlays)
        .values({
          userId: ctx.session.user.id,
          gcoinAmount: input.gcoinAmount,
          totalOdds: combinedOdds.toFixed(2),
          potentialWinnings: potentialWin,
        })
        .returning();

      // Create legs
      for (let i = 0; i < input.legs.length; i++) {
        const leg = input.legs[i]!;
        await ctx.db.insert(parlayLegs).values({
          parlayId: parlay!.id,
          matchId: leg.matchId,
          marketType: leg.marketType,
          selection: leg.selection,
          odds: legOdds[i]!.toString(),
        });
      }

      // Log transaction
      await ctx.db.insert(gcoinTransactions).values({
        userId: ctx.session.user.id,
        type: "gamification",
        category: "bet_place",
        amount: (-input.gcoinAmount).toString(),
        description: `Parlay com ${input.legs.length} selecoes`,
        referenceId: parlay!.id,
        referenceType: "parlay",
      });

      awardXP(ctx.session.user.id, "bet_placed").catch(() => {});

      return {
        ...parlay,
        legsCount: input.legs.length,
      };
    }),

  // Cash out (early settlement)
  cashOut: protectedProcedure
    .input(
      z.object({
        betId: z.string().uuid(),
        type: z.enum(["single", "parlay"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.type === "single") {
        const bet = await ctx.db.query.proBets.findFirst({
          where: and(
            eq(proBets.id, input.betId),
            eq(proBets.userId, ctx.session.user.id)
          ),
          with: { match: true },
        });

        if (!bet) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Aposta nao encontrada" });
        }

        if (bet.status !== "pending") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Aposta ja foi liquidada" });
        }

        // Cash out value: 70% of potential win (simplified)
        const cashOutValue = Math.round(Number(bet.potentialWinnings) * 0.7);

        // Credit user
        await ctx.db
          .update(users)
          .set({
            gcoinsGamification: sql`${users.gcoinsGamification} + ${cashOutValue}`,
          })
          .where(eq(users.id, ctx.session.user.id));

        // Update bet
        const [updated] = await ctx.db
          .update(proBets)
          .set({
            status: "cashed_out",
            settledAt: new Date(),
          })
          .where(eq(proBets.id, input.betId))
          .returning();

        // Log transaction
        await ctx.db.insert(gcoinTransactions).values({
          userId: ctx.session.user.id,
          type: "gamification",
          category: "bet_cashout",
          amount: cashOutValue.toString(),
          description: "Cash out de aposta profissional",
          referenceId: input.betId,
          referenceType: "pro_bet",
        });

        return updated;
      } else {
        // Parlay cash out
        const parlay = await ctx.db.query.parlays.findFirst({
          where: and(
            eq(parlays.id, input.betId),
            eq(parlays.userId, ctx.session.user.id)
          ),
          with: { legs: true },
        });

        if (!parlay) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Parlay nao encontrado" });
        }

        if (parlay.status !== "pending") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Parlay ja foi liquidado" });
        }

        // Cash out value: 60% of potential win for parlays
        const cashOutValue = Math.round(Number(parlay.potentialWinnings) * 0.6);

        // Credit user
        await ctx.db
          .update(users)
          .set({
            gcoinsGamification: sql`${users.gcoinsGamification} + ${cashOutValue}`,
          })
          .where(eq(users.id, ctx.session.user.id));

        // Update parlay
        const [updated] = await ctx.db
          .update(parlays)
          .set({
            status: "cashed_out",
            settledAt: new Date(),
          })
          .where(eq(parlays.id, input.betId))
          .returning();

        // Log transaction
        await ctx.db.insert(gcoinTransactions).values({
          userId: ctx.session.user.id,
          type: "gamification",
          category: "bet_cashout",
          amount: cashOutValue.toString(),
          description: "Cash out de parlay",
          referenceId: input.betId,
          referenceType: "parlay",
        });

        return updated;
      }
    }),

  // User's pro betting history
  myProBets: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "won", "lost", "all"]).default("all"),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.limit;
      const conditions = [eq(proBets.userId, ctx.session.user.id)];
      if (input.status !== "all") {
        conditions.push(eq(proBets.status, input.status));
      }

      const singleBets = await ctx.db.query.proBets.findMany({
        where: and(...conditions),
        with: {
          match: {
            with: {
              homeTeam: true,
              awayTeam: true,
              competition: true,
            },
          },
        },
        orderBy: [desc(proBets.createdAt)],
        limit: input.limit,
        offset,
      });

      // Also fetch parlays
      const parlayConditions = [eq(parlays.userId, ctx.session.user.id)];
      if (input.status !== "all") {
        parlayConditions.push(eq(parlays.status, input.status as "pending" | "won" | "lost"));
      }

      const userParlays = await ctx.db.query.parlays.findMany({
        where: and(...parlayConditions),
        with: {
          legs: {
            with: {
              match: {
                with: {
                  homeTeam: true,
                  awayTeam: true,
                },
              },
            },
          },
        },
        orderBy: [desc(parlays.createdAt)],
        limit: input.limit,
        offset,
      });

      return {
        singleBets,
        parlays: userParlays,
      };
    }),

  // Pro betting leaderboard
  proLeaderboard: publicProcedure
    .input(
      z.object({
        period: z.enum(["week", "month", "all"]).default("all"),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];

      if (input.period === "week") {
        conditions.push(sql`${proBets.createdAt} > now() - interval '7 days'`);
      } else if (input.period === "month") {
        conditions.push(sql`${proBets.createdAt} > now() - interval '30 days'`);
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const results = await ctx.db
        .select({
          userId: proBets.userId,
          totalBets: sql<number>`count(*)::int`,
          totalWins: sql<number>`count(*) filter (where ${proBets.status} = 'won')::int`,
          totalProfit: sql<number>`coalesce(sum(case when ${proBets.status} = 'won' then ${proBets.potentialWinnings} else -${proBets.gcoinAmount} end), 0)`,
        })
        .from(proBets)
        .where(where)
        .groupBy(proBets.userId)
        .orderBy(
          sql`coalesce(sum(case when ${proBets.status} = 'won' then ${proBets.potentialWinnings} else -${proBets.gcoinAmount} end), 0) desc`
        )
        .limit(50);

      // Fetch user info for each entry
      const enriched = await Promise.all(
        results.map(async (r) => {
          const user = await ctx.db.query.users.findFirst({
            where: eq(users.id, r.userId),
            columns: { id: true, name: true, image: true },
          });
          return { ...r, user };
        })
      );

      return enriched;
    }),
});
