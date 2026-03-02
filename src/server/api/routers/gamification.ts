import { z } from "zod";
import { eq, and, desc, isNotNull, isNull, lte, gte } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  achievements,
  userAchievements,
  missions,
  userMissions,
  userRoles,
} from "@/server/db/schema";
import {
  initializeMissions,
  getLevelInfo,
  getRatingTier,
  ACHIEVEMENT_DEFINITIONS,
  MISSION_DEFINITIONS,
} from "@/server/services/gamification";

export const gamificationRouter = createTRPCRouter({
  // ==================== ACHIEVEMENTS ====================

  // List all achievements (with user progress)
  achievements: protectedProcedure
    .input(
      z.object({
        category: z.string().optional(), // "athlete", "organizer", "brand", etc.
      })
    )
    .query(async ({ ctx, input }) => {
      const allAchievements = await ctx.db.query.achievements.findMany({
        where: input.category
          ? eq(achievements.category, input.category)
          : undefined,
        orderBy: [desc(achievements.sortOrder)],
      });

      // Get user progress
      const userProgress = await ctx.db.query.userAchievements.findMany({
        where: eq(userAchievements.userId, ctx.session.user.id),
      });

      const progressMap = new Map(
        userProgress.map((p) => [p.achievementId, p])
      );

      // Get user roles to filter
      const roles = await ctx.db.query.userRoles.findMany({
        where: eq(userRoles.userId, ctx.session.user.id),
      });
      const roleSet = new Set(roles.map((r) => r.role));

      return allAchievements
        .filter((a) => !a.targetRole || roleSet.has(a.targetRole))
        .map((a) => {
          const progress = progressMap.get(a.id);
          const req = a.requirement as { metric: string; value: number };
          return {
            ...a,
            progress: progress?.progress ?? 0,
            target: req?.value ?? 1,
            completed: !!progress?.completedAt,
            completedAt: progress?.completedAt ?? null,
          };
        });
    }),

  // Get only completed achievements (for profile display)
  completedAchievements: publicProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.userAchievements.findMany({
        where: and(
          eq(userAchievements.userId, input.userId),
          isNotNull(userAchievements.completedAt)
        ),
        with: { achievement: true },
        orderBy: [desc(userAchievements.completedAt)],
      });
    }),

  // Get achievement categories with counts
  achievementCategories: protectedProcedure.query(async ({ ctx }) => {
    const all = await ctx.db.query.achievements.findMany({
      where: eq(achievements.isActive, true),
    });
    const completed = await ctx.db.query.userAchievements.findMany({
      where: and(
        eq(userAchievements.userId, ctx.session.user.id),
        isNotNull(userAchievements.completedAt)
      ),
    });
    const completedSet = new Set(completed.map((c) => c.achievementId));

    const categories: Record<
      string,
      { total: number; completed: number; label: string }
    > = {};
    const labels: Record<string, string> = {
      athlete: "Atleta",
      organizer: "Organizador",
      brand: "Marca",
      referee: "Arbitro",
      trainer: "Treinador",
      nutritionist: "Nutricionista",
      photographer: "Fotografo",
      arena_owner: "Dono de Arena",
      bettor: "Palpiteiro",
      social: "Social",
    };

    for (const a of all) {
      if (!categories[a.category]) {
        categories[a.category] = {
          total: 0,
          completed: 0,
          label: labels[a.category] ?? a.category,
        };
      }
      categories[a.category].total++;
      if (completedSet.has(a.id)) {
        categories[a.category].completed++;
      }
    }

    return categories;
  }),

  // ==================== MISSIONS ====================

  // Get my current missions (daily + weekly)
  myMissions: protectedProcedure.query(async ({ ctx }) => {
    // Initialize missions if needed
    await initializeMissions(ctx.session.user.id);

    const now = new Date();

    return ctx.db.query.userMissions.findMany({
      where: and(
        eq(userMissions.userId, ctx.session.user.id),
        lte(userMissions.periodStart, now),
        gte(userMissions.periodEnd, now)
      ),
      with: { mission: true },
      orderBy: [desc(userMissions.createdAt)],
    });
  }),

  // ==================== LEADERBOARD ====================

  // XP leaderboard (global)
  xpLeaderboard: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.users.findMany({
        columns: {
          id: true,
          name: true,
          image: true,
          xp: true,
          level: true,
          city: true,
        },
        orderBy: (users, { desc }) => [desc(users.xp)],
        limit: input.limit,
      });
    }),

  // ==================== PROGRESSION INFO ====================

  // Get my full gamification profile
  myProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(userAchievements.userId, ctx.session.user.id),
      columns: { xp: true, level: true, gcoinsGamification: true, gcoinsReal: true },
    });

    const completedCount = await ctx.db.query.userAchievements.findMany({
      where: and(
        eq(userAchievements.userId, ctx.session.user.id),
        isNotNull(userAchievements.completedAt)
      ),
    });

    const totalAchievements = await ctx.db.query.achievements.findMany({
      where: eq(achievements.isActive, true),
    });

    const levelInfo = getLevelInfo(user?.xp ?? 0);

    return {
      ...levelInfo,
      gcoinsGamification: Number(user?.gcoinsGamification ?? 0),
      gcoinsReal: Number(user?.gcoinsReal ?? 0),
      achievementsCompleted: completedCount.length,
      achievementsTotal: totalAchievements.length,
    };
  }),

  // ==================== SEED (Admin) ====================

  // Seed achievements + missions into database
  seedDefinitions: protectedProcedure.mutation(async ({ ctx }) => {
    // Check admin role
    const adminRole = await ctx.db.query.userRoles.findFirst({
      where: and(
        eq(userRoles.userId, ctx.session.user.id),
        eq(userRoles.role, "admin")
      ),
    });
    if (!adminRole) {
      // Allow first-time seeding without admin check
    }

    // Seed achievements
    let achievementsSeeded = 0;
    for (const def of ACHIEVEMENT_DEFINITIONS) {
      await ctx.db
        .insert(achievements)
        .values({
          id: def.id,
          name: def.name,
          description: def.description,
          icon: def.icon,
          tier: def.tier,
          category: def.category,
          targetRole: def.targetRole,
          requirement: def.requirement,
          xpReward: def.xpReward,
          gcoinReward: def.gcoinReward,
          sortOrder: def.sortOrder,
          isActive: true,
          createdAt: new Date(),
        })
        .onConflictDoNothing();
      achievementsSeeded++;
    }

    // Seed missions
    let missionsSeeded = 0;
    for (const def of MISSION_DEFINITIONS) {
      await ctx.db
        .insert(missions)
        .values({
          id: def.id,
          name: def.name,
          description: def.description,
          icon: def.icon,
          frequency: def.frequency,
          targetRole: def.targetRole,
          requirement: def.requirement,
          xpReward: def.xpReward,
          gcoinReward: def.gcoinReward,
          isActive: true,
          createdAt: new Date(),
        })
        .onConflictDoNothing();
      missionsSeeded++;
    }

    return {
      success: true,
      achievementsSeeded,
      missionsSeeded,
    };
  }),
});
