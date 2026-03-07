import { z } from "zod";
import { eq, desc, and, ilike, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  proCompetitions,
  proMatches,
  proTeams,
  proAthletes,
  proMatchOdds,
} from "@/server/db/schema";
import { createSportsDataProvider } from "@/server/services/sports-data";

const sportsData = createSportsDataProvider();

export const proSportsRouter = createTRPCRouter({
  // List active competitions
  listCompetitions: publicProcedure
    .input(
      z.object({
        sportId: z.string().uuid().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(proCompetitions.isActive, true)];
      if (input?.sportId) {
        conditions.push(eq(proCompetitions.sportId, input.sportId));
      }

      const results = await ctx.db.query.proCompetitions.findMany({
        where: and(...conditions),
        with: { sport: true },
        orderBy: [desc(proCompetitions.createdAt)],
      });

      // If no DB results, fall back to mock data
      if (results.length === 0) {
        const mockComps = await sportsData.getCompetitions(input?.sportId);
        return mockComps.map((c) => ({
          id: c.externalId,
          externalId: c.externalId,
          name: c.name,
          shortName: c.shortName,
          logo: c.logo,
          country: c.country,
          season: c.season,
          isActive: true,
          sport: null,
        }));
      }

      return results;
    }),

  // Get competition details
  getCompetition: publicProcedure
    .input(z.object({ competitionId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Try DB first
      const competition = await ctx.db.query.proCompetitions.findFirst({
        where: eq(proCompetitions.id, input.competitionId),
        with: {
          sport: true,
          matches: {
            with: {
              homeTeam: true,
              awayTeam: true,
            },
            orderBy: [desc(proMatches.kickoffAt)],
            limit: 20,
          },
        },
      });

      if (!competition) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Competicao nao encontrada" });
      }

      return competition;
    }),

  // List matches with filters
  listMatches: publicProcedure
    .input(
      z.object({
        competitionId: z.string().uuid().optional(),
        date: z.string().optional(),
        status: z.enum(["scheduled", "live", "completed"]).optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];
      if (input.competitionId) {
        conditions.push(eq(proMatches.competitionId, input.competitionId));
      }
      if (input.status) {
        conditions.push(eq(proMatches.status, input.status));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const offset = (input.page - 1) * input.limit;

      const results = await ctx.db.query.proMatches.findMany({
        where,
        with: {
          homeTeam: true,
          awayTeam: true,
          competition: true,
        },
        orderBy: [desc(proMatches.kickoffAt)],
        limit: input.limit + 1,
        offset,
      });

      const hasMore = results.length > input.limit;
      if (hasMore) results.pop();

      return {
        items: results,
        hasMore,
        page: input.page,
      };
    }),

  // Get live matches
  getLiveMatches: publicProcedure.query(async ({ ctx }) => {
    const dbLive = await ctx.db.query.proMatches.findMany({
      where: eq(proMatches.status, "live"),
      with: {
        homeTeam: true,
        awayTeam: true,
        competition: true,
      },
    });

    // Fall back to mock if no DB results
    if (dbLive.length === 0) {
      const mockLive = await sportsData.getLiveMatches();
      return mockLive.map((m) => ({
        id: m.externalId,
        externalId: m.externalId,
        status: m.status,
        homeScore: m.homeScore,
        awayScore: m.awayScore,
        round: m.round,
        kickoffAt: m.kickoffAt,
        venue: m.venue,
        events: m.events,
        stats: m.stats,
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        competition: {
          name: "Brasileirao Serie A",
          shortName: "Serie A",
        },
      }));
    }

    return dbLive;
  }),

  // Get match details
  getMatch: publicProcedure
    .input(z.object({ matchId: z.string() }))
    .query(async ({ ctx, input }) => {
      const match = await ctx.db.query.proMatches.findFirst({
        where: eq(proMatches.id, input.matchId),
        with: {
          homeTeam: true,
          awayTeam: true,
          competition: true,
          odds: {
            where: eq(proMatchOdds.isActive, true),
          },
        },
      });

      if (!match) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Partida nao encontrada" });
      }

      return match;
    }),

  // Get team profile
  getTeam: publicProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const team = await ctx.db.query.proTeams.findFirst({
        where: eq(proTeams.id, input.teamId),
        with: {
          sport: true,
          athletes: true,
        },
      });

      if (!team) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Time nao encontrado" });
      }

      // Get upcoming matches for this team
      const upcomingMatches = await ctx.db.query.proMatches.findMany({
        where: and(
          eq(proMatches.status, "scheduled"),
          sql`(${proMatches.homeTeamId} = ${input.teamId} OR ${proMatches.awayTeamId} = ${input.teamId})`
        ),
        with: {
          homeTeam: true,
          awayTeam: true,
          competition: true,
        },
        orderBy: [proMatches.kickoffAt],
        limit: 5,
      });

      // Get recent results
      const recentResults = await ctx.db.query.proMatches.findMany({
        where: and(
          eq(proMatches.status, "completed"),
          sql`(${proMatches.homeTeamId} = ${input.teamId} OR ${proMatches.awayTeamId} = ${input.teamId})`
        ),
        with: {
          homeTeam: true,
          awayTeam: true,
          competition: true,
        },
        orderBy: [desc(proMatches.completedAt)],
        limit: 5,
      });

      return {
        ...team,
        upcomingMatches,
        recentResults,
      };
    }),

  // Get athlete profile
  getAthlete: publicProcedure
    .input(z.object({ athleteId: z.string() }))
    .query(async ({ ctx, input }) => {
      const athlete = await ctx.db.query.proAthletes.findFirst({
        where: eq(proAthletes.id, input.athleteId),
        with: {
          team: true,
        },
      });

      if (!athlete) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Atleta nao encontrado" });
      }

      return athlete;
    }),

  // Search across teams, athletes, competitions
  searchPro: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        type: z.enum(["team", "athlete", "competition"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const q = `%${input.query}%`;
      const results: {
        teams: typeof proTeams.$inferSelect[];
        athletes: typeof proAthletes.$inferSelect[];
        competitions: typeof proCompetitions.$inferSelect[];
      } = { teams: [], athletes: [], competitions: [] };

      if (!input.type || input.type === "team") {
        results.teams = await ctx.db.query.proTeams.findMany({
          where: ilike(proTeams.name, q),
          limit: 10,
        });

        // Fall back to mock if no DB results
        if (results.teams.length === 0) {
          const mockTeams = await sportsData.searchTeams(input.query);
          results.teams = mockTeams.map((t) => ({
            id: t.externalId,
            externalId: t.externalId,
            name: t.name,
            shortName: t.shortName,
            logo: t.logo,
            country: t.country,
            city: t.city,
            founded: t.founded,
            venue: t.venue,
            sportId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));
        }
      }

      if (!input.type || input.type === "athlete") {
        results.athletes = await ctx.db.query.proAthletes.findMany({
          where: ilike(proAthletes.name, q),
          with: { team: true },
          limit: 10,
        });
      }

      if (!input.type || input.type === "competition") {
        results.competitions = await ctx.db.query.proCompetitions.findMany({
          where: ilike(proCompetitions.name, q),
          limit: 10,
        });
      }

      return results;
    }),
});
