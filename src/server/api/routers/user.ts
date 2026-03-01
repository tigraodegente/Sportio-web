import { z } from "zod";
import { eq, ilike, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { users, userRoles, userSports, followers, userSettings } from "@/server/db/schema";
import bcrypt from "bcryptjs";
import { notifyNewFollower } from "@/server/services/notification-service";

export const userRouter = createTRPCRouter({
  // Register new user
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2).max(255),
        email: z.string().email(),
        password: z.string().min(8),
        roles: z.array(
          z.enum(["athlete", "organizer", "brand", "fan", "bettor", "referee", "trainer", "nutritionist", "photographer", "arena_owner"])
        ).default([]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Este email ja esta cadastrado",
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);

      const [user] = await ctx.db
        .insert(users)
        .values({
          name: input.name,
          email: input.email,
          password: hashedPassword,
        })
        .returning();

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao criar conta",
        });
      }

      // Always add "fan" role - every user is a fan by default
      const allRoles = new Set<"athlete" | "organizer" | "brand" | "fan" | "bettor" | "referee" | "trainer" | "nutritionist" | "photographer" | "arena_owner">(["fan", ...input.roles]);
      for (const role of allRoles) {
        await ctx.db
          .insert(userRoles)
          .values({ userId: user.id, role })
          .onConflictDoNothing();
      }

      // Create default user settings
      await ctx.db
        .insert(userSettings)
        .values({ userId: user.id })
        .onConflictDoNothing();

      return { id: user.id, email: user.email };
    }),

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
        image: z.string().optional(),
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

      // Notify the user being followed
      const follower = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
        columns: { name: true },
      });
      notifyNewFollower(input.userId, follower?.name ?? "Alguem", ctx.session.user.id).catch(() => {});

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

  // Get user settings
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    let settings = await ctx.db.query.userSettings.findFirst({
      where: eq(userSettings.userId, ctx.session.user.id),
    });
    if (!settings) {
      const [created] = await ctx.db
        .insert(userSettings)
        .values({ userId: ctx.session.user.id })
        .onConflictDoNothing()
        .returning();
      settings = created ?? null;
    }
    return settings;
  }),

  // Update notification preferences
  updateNotificationPrefs: protectedProcedure
    .input(
      z.object({
        notifyTournaments: z.boolean().optional(),
        notifyMatches: z.boolean().optional(),
        notifyGcoins: z.boolean().optional(),
        notifySocial: z.boolean().optional(),
        notifyChat: z.boolean().optional(),
        notifyBets: z.boolean().optional(),
        notifyMarketing: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Upsert settings
      const existing = await ctx.db.query.userSettings.findFirst({
        where: eq(userSettings.userId, ctx.session.user.id),
      });

      if (existing) {
        const [updated] = await ctx.db
          .update(userSettings)
          .set({ ...input, updatedAt: new Date() })
          .where(eq(userSettings.userId, ctx.session.user.id))
          .returning();
        return updated;
      } else {
        const [created] = await ctx.db
          .insert(userSettings)
          .values({ userId: ctx.session.user.id, ...input })
          .returning();
        return created;
      }
    }),

  // Update privacy preferences
  updatePrivacyPrefs: protectedProcedure
    .input(
      z.object({
        publicProfile: z.boolean().optional(),
        showResults: z.boolean().optional(),
        showGcoins: z.boolean().optional(),
        allowMessages: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.userSettings.findFirst({
        where: eq(userSettings.userId, ctx.session.user.id),
      });

      if (existing) {
        const [updated] = await ctx.db
          .update(userSettings)
          .set({ ...input, updatedAt: new Date() })
          .where(eq(userSettings.userId, ctx.session.user.id))
          .returning();
        return updated;
      } else {
        const [created] = await ctx.db
          .insert(userSettings)
          .values({ userId: ctx.session.user.id, ...input })
          .returning();
        return created;
      }
    }),

  // Change password
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
        columns: { password: true },
      });

      if (!user?.password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Conta nao usa senha (login social)",
        });
      }

      const valid = await bcrypt.compare(input.currentPassword, user.password);
      if (!valid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Senha atual incorreta",
        });
      }

      const hashed = await bcrypt.hash(input.newPassword, 12);
      await ctx.db
        .update(users)
        .set({ password: hashed, updatedAt: new Date() })
        .where(eq(users.id, ctx.session.user.id));

      return { success: true };
    }),

  // Save PIX key
  savePixKey: protectedProcedure
    .input(z.object({ pixKey: z.string().min(1).max(255) }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(users)
        .set({ pixKey: input.pixKey, updatedAt: new Date() })
        .where(eq(users.id, ctx.session.user.id))
        .returning();
      return updated;
    }),
});
