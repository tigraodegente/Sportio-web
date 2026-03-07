import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  userFavorites,
  proTeams,
  proAthletes,
  proCompetitions,
} from "@/server/db/schema";

export const favoritesRouter = createTRPCRouter({
  // Add favorite
  addFavorite: protectedProcedure
    .input(
      z.object({
        entityType: z.enum(["team", "athlete", "competition"]),
        entityId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [favorite] = await ctx.db
        .insert(userFavorites)
        .values({
          userId: ctx.session.user.id,
          entityType: input.entityType,
          entityId: input.entityId,
        })
        .onConflictDoNothing()
        .returning();

      return favorite ?? { already: true };
    }),

  // Remove favorite
  removeFavorite: protectedProcedure
    .input(
      z.object({
        entityType: z.enum(["team", "athlete", "competition"]),
        entityId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(userFavorites)
        .where(
          and(
            eq(userFavorites.userId, ctx.session.user.id),
            eq(userFavorites.entityType, input.entityType),
            eq(userFavorites.entityId, input.entityId)
          )
        );
      return { success: true };
    }),

  // Get user's favorites
  myFavorites: protectedProcedure
    .input(
      z.object({
        entityType: z.enum(["team", "athlete", "competition"]).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(userFavorites.userId, ctx.session.user.id)];
      if (input?.entityType) {
        conditions.push(eq(userFavorites.entityType, input.entityType));
      }

      const favs = await ctx.db.query.userFavorites.findMany({
        where: and(...conditions),
        orderBy: (f, { desc }) => [desc(f.createdAt)],
      });

      // Enrich with entity details
      const enriched = await Promise.all(
        favs.map(async (fav) => {
          let entity: { name: string; logo?: string | null; photo?: string | null } | null = null;

          if (fav.entityType === "team") {
            const team = await ctx.db.query.proTeams.findFirst({
              where: eq(proTeams.id, fav.entityId),
              columns: { id: true, name: true, shortName: true, logoUrl: true },
            });
            entity = team ? { name: team.name, logo: team.logoUrl } : null;
          } else if (fav.entityType === "athlete") {
            const athlete = await ctx.db.query.proAthletes.findFirst({
              where: eq(proAthletes.id, fav.entityId),
              columns: { id: true, name: true, photoUrl: true, position: true },
            });
            entity = athlete ? { name: athlete.name, photo: athlete.photoUrl } : null;
          } else if (fav.entityType === "competition") {
            const comp = await ctx.db.query.proCompetitions.findFirst({
              where: eq(proCompetitions.id, fav.entityId),
              columns: { id: true, name: true, logoUrl: true, season: true },
            });
            entity = comp ? { name: comp.name, logo: comp.logoUrl } : null;
          }

          return { ...fav, entity };
        })
      );

      return enriched;
    }),

  // Check if entity is favorited
  isFavorite: protectedProcedure
    .input(
      z.object({
        entityType: z.enum(["team", "athlete", "competition"]),
        entityId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const fav = await ctx.db.query.userFavorites.findFirst({
        where: and(
          eq(userFavorites.userId, ctx.session.user.id),
          eq(userFavorites.entityType, input.entityType),
          eq(userFavorites.entityId, input.entityId)
        ),
      });

      return !!fav;
    }),
});
