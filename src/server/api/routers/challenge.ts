import { z } from "zod";
import { eq, desc, and, or, sql, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { challenges, challengeParticipants, users, gcoinTransactions, bets } from "@/server/db/schema";
import { createAutoPost } from "@/server/services/auto-feed";
import { awardXP, updateRatingsAfterMatch } from "@/server/services/gamification";
import { createNotification, notifyChallengeWinner, notifyChallengeEnded } from "@/server/services/notification-service";
import { settleChallengeBets, cancelChallengeBets } from "@/server/services/challenge-settlement";

export const challengeRouter = createTRPCRouter({
  // List challenges (duels + community)
  list: publicProcedure
    .input(
      z.object({
        sportId: z.string().uuid().optional(),
        type: z.enum(["duel", "community"]).optional(),
        status: z.enum(["pending", "accepted", "betting_open", "in_progress", "completed", "cancelled"]).optional(),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(challenges.isActive, true)];
      if (input.sportId) conditions.push(eq(challenges.sportId, input.sportId));
      if (input.type) conditions.push(eq(challenges.challengeType, input.type));
      if (input.status) conditions.push(eq(challenges.status, input.status));

      return ctx.db.query.challenges.findMany({
        where: and(...conditions),
        with: {
          sport: true,
          creator: { columns: { id: true, name: true, image: true } },
          opponent: { columns: { id: true, name: true, image: true } },
          winner: { columns: { id: true, name: true, image: true } },
        },
        orderBy: [desc(challenges.createdAt)],
        limit: input.limit,
      });
    }),

  // List open duels (betting_open) for spectators to bet on
  listBettable: publicProcedure
    .input(
      z.object({
        sportId: z.string().uuid().optional(),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [
        eq(challenges.challengeType, "duel"),
        eq(challenges.status, "betting_open"),
        eq(challenges.bettingEnabled, true),
        eq(challenges.isActive, true),
      ];
      if (input.sportId) conditions.push(eq(challenges.sportId, input.sportId));

      const results = await ctx.db.query.challenges.findMany({
        where: and(...conditions),
        with: {
          sport: true,
          creator: { columns: { id: true, name: true, image: true } },
          opponent: { columns: { id: true, name: true, image: true } },
        },
        orderBy: [desc(challenges.createdAt)],
        limit: input.limit,
      });

      // Attach bet counts per challenge
      const enriched = await Promise.all(
        results.map(async (c) => {
          const betStats = await ctx.db
            .select({
              totalBets: sql<number>`count(*)`,
              totalPool: sql<number>`coalesce(sum(cast(${bets.amount} as numeric)), 0)`,
              betsOnCreator: sql<number>`count(*) filter (where ${bets.prediction}->>'winnerId' = ${c.creatorId})`,
              betsOnOpponent: sql<number>`count(*) filter (where ${bets.prediction}->>'winnerId' = ${c.opponentId})`,
            })
            .from(bets)
            .where(and(eq(bets.challengeId, c.id), eq(bets.result, "pending")));

          return { ...c, betStats: betStats[0] };
        })
      );

      return enriched;
    }),

  // Get single challenge detail
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const challenge = await ctx.db.query.challenges.findFirst({
        where: eq(challenges.id, input.id),
        with: {
          sport: true,
          creator: { columns: { id: true, name: true, image: true } },
          opponent: { columns: { id: true, name: true, image: true } },
          winner: { columns: { id: true, name: true, image: true } },
          participants: { with: { user: { columns: { id: true, name: true, image: true } } } },
        },
      });

      if (!challenge) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Desafio não encontrado" });
      }

      // Get bet stats
      const betStats = await ctx.db
        .select({
          totalBets: sql<number>`count(*)`,
          totalPool: sql<number>`coalesce(sum(cast(${bets.amount} as numeric)), 0)`,
          betsOnCreator: sql<number>`count(*) filter (where ${bets.prediction}->>'winnerId' = ${challenge.creatorId})`,
          betsOnOpponent: sql<number>`count(*) filter (where ${bets.prediction}->>'winnerId' = ${challenge.opponentId})`,
        })
        .from(bets)
        .where(and(eq(bets.challengeId, challenge.id), eq(bets.result, "pending")));

      return { ...challenge, betStats: betStats[0] };
    }),

  // My challenges (as creator or opponent)
  myChallenges: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "accepted", "betting_open", "in_progress", "completed", "cancelled"]).optional(),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const conditions = [
        or(eq(challenges.creatorId, userId), eq(challenges.opponentId, userId)),
      ];
      if (input.status) conditions.push(eq(challenges.status, input.status));

      return ctx.db.query.challenges.findMany({
        where: and(...conditions),
        with: {
          sport: true,
          creator: { columns: { id: true, name: true, image: true } },
          opponent: { columns: { id: true, name: true, image: true } },
          winner: { columns: { id: true, name: true, image: true } },
        },
        orderBy: [desc(challenges.createdAt)],
        limit: input.limit,
      });
    }),

  // Create a 1v1 duel challenge
  createDuel: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3).max(255),
        description: z.string().optional(),
        sportId: z.string().uuid().optional(),
        opponentId: z.string().uuid(),
        wagerAmount: z.number().min(0).default(0),
        bettingEnabled: z.boolean().default(true),
        startsAt: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (input.opponentId === userId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Você não pode desafiar a si mesmo" });
      }

      // Check opponent exists
      const opponent = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.opponentId),
        columns: { id: true, name: true, gcoinsGamification: true },
      });
      if (!opponent) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Oponente não encontrado" });
      }

      // If wager, check creator balance
      if (input.wagerAmount > 0) {
        const creator = await ctx.db.query.users.findFirst({
          where: eq(users.id, userId),
          columns: { gcoinsGamification: true },
        });
        if (Number(creator?.gcoinsGamification ?? 0) < input.wagerAmount) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Saldo insuficiente para a aposta" });
        }

        // Escrow creator's wager
        await ctx.db
          .update(users)
          .set({ gcoinsGamification: sql`${users.gcoinsGamification} - ${input.wagerAmount}` })
          .where(eq(users.id, userId));

        await ctx.db.insert(gcoinTransactions).values({
          userId,
          type: "gamification",
          category: "challenge_reward",
          amount: (-input.wagerAmount).toString(),
          description: `Aposta no desafio "${input.title}" (bloqueada)`,
        });
      }

      const [challenge] = await ctx.db
        .insert(challenges)
        .values({
          title: input.title,
          description: input.description,
          challengeType: "duel",
          status: "pending",
          sportId: input.sportId ?? null,
          creatorId: userId,
          opponentId: input.opponentId,
          wagerAmount: input.wagerAmount.toString(),
          bettingEnabled: input.bettingEnabled,
          startsAt: input.startsAt ? new Date(input.startsAt) : null,
        })
        .returning();

      // Notify opponent
      const creator = await ctx.db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { name: true },
      });
      createNotification({
        userId: input.opponentId,
        type: "challenge",
        title: "Desafio recebido!",
        message: `${creator?.name ?? "Alguém"} te desafiou: "${input.title}"${input.wagerAmount > 0 ? ` (aposta: ${input.wagerAmount} GCoins)` : ""}`,
        data: { challengeId: challenge.id },
      }).catch(() => {});

      return challenge;
    }),

  // Accept a duel challenge
  acceptDuel: protectedProcedure
    .input(z.object({ challengeId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const challenge = await ctx.db.query.challenges.findFirst({
        where: eq(challenges.id, input.challengeId),
        with: { creator: { columns: { name: true } } },
      });

      if (!challenge) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Desafio não encontrado" });
      }
      if (challenge.opponentId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Você não é o oponente deste desafio" });
      }
      if (challenge.status !== "pending") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Este desafio já foi respondido" });
      }

      // If wager, debit opponent
      const wager = Number(challenge.wagerAmount ?? 0);
      if (wager > 0) {
        const user = await ctx.db.query.users.findFirst({
          where: eq(users.id, userId),
          columns: { gcoinsGamification: true },
        });
        if (Number(user?.gcoinsGamification ?? 0) < wager) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Saldo insuficiente para aceitar a aposta" });
        }

        await ctx.db
          .update(users)
          .set({ gcoinsGamification: sql`${users.gcoinsGamification} - ${wager}` })
          .where(eq(users.id, userId));

        await ctx.db.insert(gcoinTransactions).values({
          userId,
          type: "gamification",
          category: "challenge_reward",
          amount: (-wager).toString(),
          description: `Aposta no desafio "${challenge.title}" (bloqueada)`,
        });
      }

      // Set status: if betting enabled go to betting_open, else go to in_progress
      const newStatus = challenge.bettingEnabled ? "betting_open" : "in_progress";
      const bettingDeadline = challenge.bettingEnabled
        ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h from now
        : null;

      const [updated] = await ctx.db
        .update(challenges)
        .set({
          status: newStatus,
          acceptedAt: new Date(),
          bettingDeadline,
        })
        .where(eq(challenges.id, input.challengeId))
        .returning();

      // Notify creator
      const opponentUser = await ctx.db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { name: true },
      });
      createNotification({
        userId: challenge.creatorId,
        type: "challenge",
        title: "Desafio aceito!",
        message: `${opponentUser?.name ?? "Oponente"} aceitou seu desafio "${challenge.title}"${challenge.bettingEnabled ? ". Apostas estão abertas!" : ""}`,
        data: { challengeId: challenge.id },
      }).catch(() => {});

      // Auto-post
      createAutoPost({
        type: "challenge_joined",
        userId,
        data: { challengeTitle: challenge.title },
        sportId: challenge.sportId ?? undefined,
      }).catch(() => {});

      awardXP(userId, "challenge_joined").catch(() => {});

      return updated;
    }),

  // Decline a duel challenge
  declineDuel: protectedProcedure
    .input(z.object({ challengeId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const challenge = await ctx.db.query.challenges.findFirst({
        where: eq(challenges.id, input.challengeId),
      });

      if (!challenge) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Desafio não encontrado" });
      }
      if (challenge.opponentId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Você não é o oponente deste desafio" });
      }
      if (challenge.status !== "pending") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Este desafio já foi respondido" });
      }

      // Refund creator's wager
      const wager = Number(challenge.wagerAmount ?? 0);
      if (wager > 0) {
        await ctx.db
          .update(users)
          .set({ gcoinsGamification: sql`${users.gcoinsGamification} + ${wager}` })
          .where(eq(users.id, challenge.creatorId));

        await ctx.db.insert(gcoinTransactions).values({
          userId: challenge.creatorId,
          type: "gamification",
          category: "challenge_reward",
          amount: wager.toString(),
          description: `Desafio "${challenge.title}" recusado - reembolso`,
        });
      }

      const [updated] = await ctx.db
        .update(challenges)
        .set({ status: "cancelled", isActive: false })
        .where(eq(challenges.id, input.challengeId))
        .returning();

      // Notify creator
      createNotification({
        userId: challenge.creatorId,
        type: "challenge",
        title: "Desafio recusado",
        message: `Seu desafio "${challenge.title}" foi recusado`,
        data: { challengeId: challenge.id },
      }).catch(() => {});

      return updated;
    }),

  // Start the challenge (close betting, move to in_progress)
  startChallenge: protectedProcedure
    .input(z.object({ challengeId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const challenge = await ctx.db.query.challenges.findFirst({
        where: eq(challenges.id, input.challengeId),
      });

      if (!challenge) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Desafio não encontrado" });
      }
      if (challenge.creatorId !== userId && challenge.opponentId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Apenas participantes podem iniciar o desafio" });
      }
      if (challenge.status !== "betting_open" && challenge.status !== "accepted") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Este desafio não pode ser iniciado agora" });
      }

      const [updated] = await ctx.db
        .update(challenges)
        .set({ status: "in_progress", startsAt: new Date() })
        .where(eq(challenges.id, input.challengeId))
        .returning();

      return updated;
    }),

  // Submit result (only creator or opponent can submit)
  submitResult: protectedProcedure
    .input(
      z.object({
        challengeId: z.string().uuid(),
        winnerId: z.string().uuid(),
        score1: z.number().min(0).optional(),
        score2: z.number().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const challenge = await ctx.db.query.challenges.findFirst({
        where: eq(challenges.id, input.challengeId),
        with: {
          creator: { columns: { name: true } },
          opponent: { columns: { name: true } },
        },
      });

      if (!challenge) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Desafio não encontrado" });
      }
      if (challenge.creatorId !== userId && challenge.opponentId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Apenas participantes podem submeter resultado" });
      }
      if (challenge.status !== "in_progress" && challenge.status !== "betting_open") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Este desafio não está em andamento" });
      }
      if (input.winnerId !== challenge.creatorId && input.winnerId !== challenge.opponentId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Vencedor deve ser um dos participantes" });
      }

      const loserId = input.winnerId === challenge.creatorId
        ? challenge.opponentId!
        : challenge.creatorId;

      // Update challenge
      const [updated] = await ctx.db
        .update(challenges)
        .set({
          status: "completed",
          winnerId: input.winnerId,
          score1: input.score1 ?? null,
          score2: input.score2 ?? null,
          completedAt: new Date(),
          isActive: false,
        })
        .where(eq(challenges.id, input.challengeId))
        .returning();

      // Pay out wager to winner
      const wager = Number(challenge.wagerAmount ?? 0);
      if (wager > 0) {
        const totalPrize = wager * 2;
        await ctx.db
          .update(users)
          .set({ gcoinsGamification: sql`${users.gcoinsGamification} + ${totalPrize}` })
          .where(eq(users.id, input.winnerId));

        await ctx.db.insert(gcoinTransactions).values({
          userId: input.winnerId,
          type: "gamification",
          category: "challenge_reward",
          amount: totalPrize.toString(),
          description: `Venceu o desafio "${challenge.title}" (+${totalPrize} GCoins)`,
          referenceId: challenge.id,
          referenceType: "challenge",
        });
      }

      // Settle bets
      settleChallengeBets(challenge.id, input.winnerId).catch(() => {});

      // Update ELO ratings if sport is set
      if (challenge.sportId) {
        updateRatingsAfterMatch(
          challenge.creatorId,
          challenge.opponentId!,
          input.winnerId,
          challenge.sportId
        ).catch(() => {});
      }

      // Award XP
      awardXP(input.winnerId, "match_won", { sportId: challenge.sportId ?? undefined }).catch(() => {});
      awardXP(loserId, "match_lost", { sportId: challenge.sportId ?? undefined }).catch(() => {});
      awardXP(input.winnerId, "challenge_completed").catch(() => {});

      // Auto-posts
      const winnerName = input.winnerId === challenge.creatorId
        ? challenge.creator?.name
        : challenge.opponent?.name;
      const loserName = input.winnerId === challenge.creatorId
        ? challenge.opponent?.name
        : challenge.creator?.name;

      createAutoPost({
        type: "challenge_completed",
        userId: input.winnerId,
        data: {
          challengeTitle: challenge.title,
          opponentName: loserName ?? "Oponente",
          score: input.score1 != null && input.score2 != null ? `${input.score1}x${input.score2}` : undefined,
        },
        sportId: challenge.sportId ?? undefined,
      }).catch(() => {});

      // Notifications
      createNotification({
        userId: input.winnerId,
        type: "challenge",
        title: "Desafio vencido!",
        message: `Parabéns! Você venceu o desafio "${challenge.title}"${wager > 0 ? ` e ganhou ${wager * 2} GCoins!` : "!"}`,
        data: { challengeId: challenge.id },
      }).catch(() => {});

      createNotification({
        userId: loserId,
        type: "challenge",
        title: "Desafio encerrado",
        message: `Você perdeu o desafio "${challenge.title}" contra ${winnerName ?? "o oponente"}. Próxima vez!`,
        data: { challengeId: challenge.id },
      }).catch(() => {});

      return updated;
    }),

  // Cancel challenge (only creator, only if not in_progress/completed)
  cancel: protectedProcedure
    .input(z.object({ challengeId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const challenge = await ctx.db.query.challenges.findFirst({
        where: eq(challenges.id, input.challengeId),
      });

      if (!challenge) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Desafio não encontrado" });
      }
      if (challenge.creatorId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Apenas o criador pode cancelar" });
      }
      if (challenge.status === "completed") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Desafio já finalizado" });
      }

      // Refund wagers
      const wager = Number(challenge.wagerAmount ?? 0);
      if (wager > 0) {
        // Refund creator
        await ctx.db
          .update(users)
          .set({ gcoinsGamification: sql`${users.gcoinsGamification} + ${wager}` })
          .where(eq(users.id, challenge.creatorId));
        await ctx.db.insert(gcoinTransactions).values({
          userId: challenge.creatorId,
          type: "gamification",
          category: "challenge_reward",
          amount: wager.toString(),
          description: `Desafio "${challenge.title}" cancelado - reembolso`,
        });

        // Refund opponent if they already accepted
        if (challenge.status !== "pending" && challenge.opponentId) {
          await ctx.db
            .update(users)
            .set({ gcoinsGamification: sql`${users.gcoinsGamification} + ${wager}` })
            .where(eq(users.id, challenge.opponentId));
          await ctx.db.insert(gcoinTransactions).values({
            userId: challenge.opponentId,
            type: "gamification",
            category: "challenge_reward",
            amount: wager.toString(),
            description: `Desafio "${challenge.title}" cancelado - reembolso`,
          });
        }
      }

      // Cancel all pending bets
      cancelChallengeBets(challenge.id).catch(() => {});

      const [updated] = await ctx.db
        .update(challenges)
        .set({ status: "cancelled", isActive: false })
        .where(eq(challenges.id, input.challengeId))
        .returning();

      if (challenge.opponentId) {
        createNotification({
          userId: challenge.opponentId,
          type: "challenge",
          title: "Desafio cancelado",
          message: `O desafio "${challenge.title}" foi cancelado pelo criador`,
          data: { challengeId: challenge.id },
        }).catch(() => {});
      }

      return updated;
    }),

  // ==================== Community challenge endpoints (backward compat) ====================

  // Join community challenge
  join: protectedProcedure
    .input(z.object({ challengeId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [participant] = await ctx.db
        .insert(challengeParticipants)
        .values({
          challengeId: input.challengeId,
          userId: ctx.session.user.id,
        })
        .onConflictDoNothing()
        .returning();

      const challenge = await ctx.db.query.challenges.findFirst({
        where: eq(challenges.id, input.challengeId),
        columns: { title: true, sportId: true },
      });
      if (challenge) {
        createAutoPost({
          type: "challenge_joined",
          userId: ctx.session.user.id,
          data: { challengeTitle: challenge.title },
          sportId: challenge.sportId ?? undefined,
        }).catch(() => {});
      }

      awardXP(ctx.session.user.id, "challenge_joined").catch(() => {});

      return participant;
    }),

  // Update progress
  updateProgress: protectedProcedure
    .input(
      z.object({
        challengeId: z.string().uuid(),
        progress: z.record(z.string(), z.unknown()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(challengeParticipants)
        .set({ progress: input.progress })
        .where(
          and(
            eq(challengeParticipants.challengeId, input.challengeId),
            eq(challengeParticipants.userId, ctx.session.user.id)
          )
        )
        .returning();
      return updated;
    }),

  // Create community challenge
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3).max(255),
        description: z.string().optional(),
        sportId: z.string().uuid().optional(),
        reward: z.number().min(0).default(0),
        rewardType: z.enum(["real", "gamification"]).default("gamification"),
        goal: z.record(z.string(), z.unknown()).optional(),
        maxParticipants: z.number().optional(),
        startsAt: z.string().optional(),
        endsAt: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [challenge] = await ctx.db
        .insert(challenges)
        .values({
          ...input,
          challengeType: "community",
          status: "in_progress",
          creatorId: ctx.session.user.id,
          reward: input.reward.toString(),
          startsAt: input.startsAt ? new Date(input.startsAt) : null,
          endsAt: input.endsAt ? new Date(input.endsAt) : null,
        })
        .returning();
      return challenge;
    }),

  // Search opponents by name
  searchOpponents: protectedProcedure
    .input(z.object({ query: z.string().min(1).max(100) }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select({
          id: users.id,
          name: users.name,
          image: users.image,
        })
        .from(users)
        .where(
          and(
            sql`lower(${users.name}) like ${`%${input.query.toLowerCase()}%`}`,
            ne(users.id, ctx.session.user.id)
          )
        )
        .limit(10);

      return results;
    }),

  // Complete challenge: determine winners, distribute prizes, send notifications
  completeChallenge: protectedProcedure
    .input(
      z.object({
        challengeId: z.string().uuid(),
        // Optional: manually specify winner ranking criteria
        rankingCriteria: z
          .enum(["completions", "best_time", "highest_score"])
          .default("completions"),
        // Optional: override prize distribution percentages for top 3
        // Default: 1st=60%, 2nd=25%, 3rd=15%
        prizeDistribution: z
          .array(z.number().min(0).max(100))
          .max(10)
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Fetch the challenge and verify ownership
      const challenge = await ctx.db.query.challenges.findFirst({
        where: eq(challenges.id, input.challengeId),
      });

      if (!challenge) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Desafio não encontrado",
        });
      }

      if (challenge.creatorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas o criador do desafio pode finalizá-lo",
        });
      }

      if (!challenge.isActive) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Este desafio já foi encerrado",
        });
      }

      // 2. Fetch all participants with their progress
      const participants = await ctx.db.query.challengeParticipants.findMany({
        where: eq(challengeParticipants.challengeId, input.challengeId),
        with: { user: true },
      });

      if (participants.length === 0) {
        // No participants -- just mark as completed
        await ctx.db
          .update(challenges)
          .set({ isActive: false })
          .where(eq(challenges.id, input.challengeId));

        return {
          challengeId: input.challengeId,
          winners: [],
          message: "Desafio encerrado sem participantes",
        };
      }

      // 3. Rank participants based on the chosen criteria
      const rankedParticipants = [...participants].sort((a, b) => {
        const progressA = (a.progress ?? {}) as Record<string, unknown>;
        const progressB = (b.progress ?? {}) as Record<string, unknown>;

        switch (input.rankingCriteria) {
          case "completions": {
            // Primary: participants who completed first (completedAt timestamp)
            // Secondary: higher completion count in progress
            const completedA = a.completedAt ? a.completedAt.getTime() : Infinity;
            const completedB = b.completedAt ? b.completedAt.getTime() : Infinity;

            // Both completed: earlier completion wins
            if (a.completedAt && b.completedAt) {
              return completedA - completedB;
            }
            // One completed, other didn't: completed wins
            if (a.completedAt && !b.completedAt) return -1;
            if (!a.completedAt && b.completedAt) return 1;

            // Neither completed: compare progress count/percentage
            const countA = Number(progressA.completions ?? progressA.count ?? progressA.percentage ?? 0);
            const countB = Number(progressB.completions ?? progressB.count ?? progressB.percentage ?? 0);
            return countB - countA; // higher is better
          }

          case "best_time": {
            // Lower time is better; participants without a time go to the end
            const timeA = Number(progressA.time ?? progressA.duration ?? Infinity);
            const timeB = Number(progressB.time ?? progressB.duration ?? Infinity);
            return timeA - timeB;
          }

          case "highest_score": {
            // Higher score is better
            const scoreA = Number(progressA.score ?? progressA.points ?? 0);
            const scoreB = Number(progressB.score ?? progressB.points ?? 0);
            return scoreB - scoreA;
          }

          default:
            return 0;
        }
      });

      // 4. Determine prize distribution
      const prizePool = Number(challenge.reward ?? 0);
      const rewardType = challenge.rewardType ?? "gamification";
      const defaultDistribution = [60, 25, 15]; // percentages for 1st, 2nd, 3rd
      const distribution = input.prizeDistribution ?? defaultDistribution;

      // If there are fewer participants than prize slots, redistribute
      const winnerCount = Math.min(distribution.length, rankedParticipants.length);
      const activeDistribution = distribution.slice(0, winnerCount);

      // Normalize distribution percentages to sum to 100
      const totalPercent = activeDistribution.reduce((sum, p) => sum + p, 0);
      const normalizedDistribution = totalPercent > 0
        ? activeDistribution.map((p) => p / totalPercent)
        : activeDistribution.map(() => 1 / winnerCount);

      // 5. Distribute prizes to winners
      const winners: Array<{
        userId: string;
        userName: string;
        placement: number;
        prizeAmount: number;
      }> = [];

      const balanceField = rewardType === "real" ? "gcoinsReal" : "gcoinsGamification";

      for (let i = 0; i < winnerCount; i++) {
        const participant = rankedParticipants[i];
        if (!participant) continue;

        const prizeAmount = Math.round(prizePool * normalizedDistribution[i] * 100) / 100;
        if (prizeAmount <= 0) continue;

        const placement = i + 1;

        // Credit winner's gcoin balance
        await ctx.db
          .update(users)
          .set({
            [balanceField]: sql`${users[balanceField]} + ${prizeAmount}`,
          })
          .where(eq(users.id, participant.userId));

        // Record gcoin transaction
        await ctx.db.insert(gcoinTransactions).values({
          userId: participant.userId,
          type: rewardType,
          category: "challenge_reward",
          amount: prizeAmount.toString(),
          description: `${placement}º lugar no desafio "${challenge.title}" - Prêmio de ${prizeAmount} GCoins`,
          referenceId: challenge.id,
          referenceType: "challenge",
        });

        // Mark participant as completed if not already
        if (!participant.completedAt) {
          await ctx.db
            .update(challengeParticipants)
            .set({ completedAt: new Date() })
            .where(eq(challengeParticipants.id, participant.id));
        }

        const userName = participant.user?.name ?? "Participante";
        winners.push({
          userId: participant.userId,
          userName,
          placement,
          prizeAmount,
        });

        // Send notification to winner
        notifyChallengeWinner(
          participant.userId,
          challenge.title,
          placement,
          prizeAmount,
          challenge.id
        ).catch(() => {});

        // Auto-post for challenge completion
        createAutoPost({
          type: "challenge_completed",
          userId: participant.userId,
          data: {
            challengeTitle: challenge.title,
            placement,
            reward: prizeAmount,
          },
          sportId: challenge.sportId ?? undefined,
        }).catch(() => {});
      }

      // 6. Notify non-winning participants that the challenge ended
      const winnerUserIds = new Set(winners.map((w) => w.userId));
      const nonWinnerIds = rankedParticipants
        .filter((p) => !winnerUserIds.has(p.userId))
        .map((p) => p.userId);

      if (nonWinnerIds.length > 0) {
        notifyChallengeEnded(nonWinnerIds, challenge.title, challenge.id).catch(
          () => {}
        );
      }

      // 7. Mark challenge as completed (inactive)
      await ctx.db
        .update(challenges)
        .set({ isActive: false })
        .where(eq(challenges.id, input.challengeId));

      return {
        challengeId: input.challengeId,
        winners,
        totalDistributed: winners.reduce((sum, w) => sum + w.prizeAmount, 0),
        message: `Desafio encerrado! ${winners.length} vencedor(es) premiado(s).`,
      };
    }),
});
