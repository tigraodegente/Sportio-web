import { z } from "zod";
import { eq, ilike, desc, sql, and, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { users, userRoles, userSports, followers, enrollments, tournaments, bets, gcoinTransactions, notifications } from "@/server/db/schema";
import bcrypt from "bcryptjs";

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
        ).min(1),
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

      for (const role of input.roles) {
        await ctx.db
          .insert(userRoles)
          .values({ userId: user.id, role })
          .onConflictDoNothing();
      }

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

  // Dashboard stats (aggregated data for dashboard page)
  dashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Get user data
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        roles: true,
        sports: { with: { sport: true } },
      },
    });

    if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado" });

    // GCoins balance
    const gcoinsReal = Number(user.gcoinsReal ?? 0);

    // Total tournaments enrolled
    const userEnrollments = await ctx.db.query.enrollments.findMany({
      where: eq(enrollments.userId, userId),
      with: {
        tournament: { with: { sport: true } },
      },
    });

    const totalTournaments = userEnrollments.length;
    const activeTournaments = userEnrollments.filter(
      (e) => e.tournament.status === "in_progress" || e.tournament.status === "registration_open"
    ).length;

    // Victories (enrollments where status = winner)
    const victories = userEnrollments.filter((e) => e.status === "winner").length;

    // Total wins from userSports
    const totalWins = user.sports.reduce((sum, s) => sum + (s.wins ?? 0), 0);
    const totalLosses = user.sports.reduce((sum, s) => sum + (s.losses ?? 0), 0);
    const winRate = totalWins + totalLosses > 0 ? Math.round((totalWins / (totalWins + totalLosses)) * 100) : 0;

    // Recent tournaments (last 3 the user is enrolled in)
    const recentTournaments = userEnrollments
      .sort((a, b) => new Date(b.tournament.createdAt).getTime() - new Date(a.tournament.createdAt).getTime())
      .slice(0, 3)
      .map((e) => ({
        id: e.tournament.id,
        name: e.tournament.name,
        sport: e.tournament.sport?.name ?? "Esporte",
        status: e.tournament.status,
        date: e.tournament.startDate
          ? new Date(e.tournament.startDate).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })
          : "A definir",
        prize: Number(e.tournament.prizePool ?? 0).toLocaleString("pt-BR"),
      }));

    // Recent bets (last 3)
    const recentBets = await ctx.db.query.bets.findMany({
      where: eq(bets.userId, userId),
      with: {
        match: true,
        tournament: true,
      },
      orderBy: [desc(bets.createdAt)],
      limit: 3,
    });

    const formattedBets = recentBets.map((b) => ({
      id: b.id,
      match: b.tournament?.name ?? "Partida",
      amount: Number(b.amount),
      odds: Number(b.odds ?? 0),
      status: b.result ?? "pending",
    }));

    // Follow counts
    const [followersCount] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(followers)
      .where(eq(followers.followingId, userId));

    const [followingCount] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(followers)
      .where(eq(followers.followerId, userId));

    // Unread notifications
    const [unreadNotifs] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        bio: user.bio,
        city: user.city,
        state: user.state,
        level: user.level ?? 1,
        xp: user.xp ?? 0,
        isPro: user.isPro ?? false,
        isVerified: user.isVerified ?? false,
        instagram: user.instagram,
        twitter: user.twitter,
        youtube: user.youtube,
        createdAt: user.createdAt,
        roles: user.roles.map((r) => r.role),
        sports: user.sports.map((s) => ({
          name: s.sport?.name ?? "Esporte",
          level: s.level ?? "C",
          rating: Number(s.rating ?? 1000),
          wins: s.wins ?? 0,
          losses: s.losses ?? 0,
        })),
      },
      stats: {
        gcoinsReal,
        totalTournaments,
        activeTournaments,
        victories: totalWins,
        winRate,
        followers: Number(followersCount?.count ?? 0),
        following: Number(followingCount?.count ?? 0),
        unreadNotifications: Number(unreadNotifs?.count ?? 0),
      },
      recentTournaments,
      recentBets: formattedBets,
    };
  }),
});
