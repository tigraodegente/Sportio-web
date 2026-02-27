import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { challenges, challengeParticipants } from "@/server/db/schema";

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
});
