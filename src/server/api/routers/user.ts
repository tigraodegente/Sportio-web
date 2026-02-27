import { z } from "zod";
import { eq, ilike, desc, sql } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { users, userRoles, userSports, followers, sports } from "@/server/db/schema";

export const userRouter = createTRPCRouter({
  // Get current user profile
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
      with: {
        roles: true,
        sports: { with: { sport: true } },
      },
    });
    return user;
  }),

  // Get user by ID (public profile)
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
        with: {
          roles: true,
          sports: { with: { sport: true } },
        },
      });
      return user;
    }),

  // Update profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(255).optional(),
        bio: z.string().max(500).optional(),
        city: z.string().max(100).optional(),
        state: z.string().max(50).optional(),
        phone: z.string().max(20).optional(),
        instagram: z.string().max(100).optional(),
        twitter: z.string().max(100).optional(),
        youtube: z.string().max(100).optional(),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(users)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(users.id, ctx.session.user.id))
        .returning();
      return updated;
    }),

  // Add role
  addRole: protectedProcedure
    .input(z.object({ role: z.enum(["athlete", "organizer", "brand", "fan", "bettor", "referee", "trainer", "nutritionist", "photographer", "arena_owner"]) }))
    .mutation(async ({ ctx, input }) => {
      const [role] = await ctx.db
        .insert(userRoles)
        .values({ userId: ctx.session.user.id, role: input.role })
        .onConflictDoNothing()
        .returning();
      return role;
    }),

  // Add sport to user
  addSport: protectedProcedure
    .input(
      z.object({
        sportId: z.string().uuid(),
        level: z.enum(["A", "B", "C"]).optional(),
        position: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [userSport] = await ctx.db
        .insert(userSports)
        .values({
          userId: ctx.session.user.id,
          sportId: input.sportId,
          level: input.level,
          position: input.position,
        })
        .onConflictDoNothing()
        .returning();
      return userSport;
    }),

  // Search users
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db.query.users.findMany({
        where: ilike(users.name, `%${input.query}%`),
        limit: input.limit + 1,
        orderBy: [desc(users.createdAt)],
      });

      let nextCursor: string | undefined;
      if (results.length > input.limit) {
        const next = results.pop()!;
        nextCursor = next.id;
      }

      return { items: results, nextCursor };
    }),

  // Follow user
  follow: protectedProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(followers)
        .values({ followerId: ctx.session.user.id, followingId: input.userId })
        .onConflictDoNothing();
      return { success: true };
    }),

  // Unfollow user
  unfollow: protectedProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(followers)
        .where(
          sql`${followers.followerId} = ${ctx.session.user.id} AND ${followers.followingId} = ${input.userId}`
        );
      return { success: true };
    }),

  // Get followers count
  getFollowCounts: publicProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [followersCount] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(followers)
        .where(eq(followers.followingId, input.userId));

      const [followingCount] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(followers)
        .where(eq(followers.followerId, input.userId));

      return {
        followers: Number(followersCount?.count ?? 0),
        following: Number(followingCount?.count ?? 0),
      };
    }),

  // Ranking by sport
  ranking: publicProcedure
    .input(
      z.object({
        sportId: z.string().uuid().optional(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const query = ctx.db.query.userSports.findMany({
        where: input.sportId ? eq(userSports.sportId, input.sportId) : undefined,
        with: { user: true, sport: true },
        orderBy: [desc(userSports.rating)],
        limit: input.limit,
      });
      return query;
    }),
});
