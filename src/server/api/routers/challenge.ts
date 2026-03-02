import { z } from "zod";
import { eq, desc, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { challenges, challengeParticipants, users, gcoinTransactions } from "@/server/db/schema";
import { createAutoPost } from "@/server/services/auto-feed";
import {
  notifyChallengeWinner,
  notifyChallengeEnded,
} from "@/server/services/notification-service";

export const challengeRouter = createTRPCRouter({
  // List active challenges
  list: publicProcedure
    .input(
      z.object({
        sportId: z.string().uuid().optional(),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(challenges.isActive, true)];
      if (input.sportId) conditions.push(eq(challenges.sportId, input.sportId));

      return ctx.db.query.challenges.findMany({
        where: and(...conditions),
        with: { sport: true, creator: true },
        orderBy: [desc(challenges.createdAt)],
        limit: input.limit,
      });
    }),

  // Join challenge
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

      // Auto-post for challenge join
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

  // Create challenge
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
          creatorId: ctx.session.user.id,
          reward: input.reward.toString(),
          startsAt: input.startsAt ? new Date(input.startsAt) : null,
          endsAt: input.endsAt ? new Date(input.endsAt) : null,
        })
        .returning();
      return challenge;
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
