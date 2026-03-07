import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  proMatches,
  proTeams,
  proCompetitions,
  sports,
} from "@/server/db/schema";
import { ApiFootballProvider } from "@/server/services/sports-data";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s for Vercel

// Cache the futebol sport ID for the duration of the request
let _futebolSportId: string | null = null;
async function getFutebolSportId(): Promise<string> {
  if (_futebolSportId) return _futebolSportId;
  const futebol = await db.query.sports.findFirst({
    where: eq(sports.slug, "futebol"),
  });
  if (!futebol) throw new Error("Sport 'futebol' not found. Run seed first.");
  _futebolSportId = futebol.id;
  return futebol.id;
}

// Cron route to sync today's matches from API-Football to the database.
//
// Intended to be called by Vercel Cron (vercel.json):
//   { "crons": [{ "path": "/api/cron/sync-sports", "schedule": "every 15 min" }] }
//
// Also callable manually with:
//   curl -H "Authorization: Bearer $CRON_SECRET" https://your-app.vercel.app/api/cron/sync-sports
export async function GET(request: Request) {
  // Verify authorization
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Vercel Cron sends the CRON_SECRET automatically. For manual calls, require it.
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API_FOOTBALL_KEY not configured" },
      { status: 500 }
    );
  }

  const host = process.env.API_FOOTBALL_HOST || "v3.football.api-sports.io";
  const provider = new ApiFootballProvider(apiKey, host);

  const today = new Date().toISOString().split("T")[0]!; // YYYY-MM-DD

  try {
    const matches = await provider.getFixturesByDate(today);

    let teamsUpserted = 0;
    let competitionsUpserted = 0;
    let matchesUpserted = 0;
    const errors: string[] = [];

    // Process all matches
    for (const match of matches) {
      try {
        // 1. Upsert competition
        const competitionExternalId = match.competitionId;
        let competitionDbId: string;

        const existingCompetition =
          await db.query.proCompetitions.findFirst({
            where: eq(proCompetitions.externalId, competitionExternalId),
          });

        if (existingCompetition) {
          competitionDbId = existingCompetition.id;
        } else {
          // Fetch competition details from API if not in DB yet
          // (we only have the ID from the fixture response)
          const sportId = await getFutebolSportId();
          const [inserted] = await db
            .insert(proCompetitions)
            .values({
              externalId: competitionExternalId,
              name: `League ${competitionExternalId}`,
              sportId,
              country: "",
              season: new Date().getFullYear().toString(),
              isActive: true,
            })
            .onConflictDoNothing()
            .returning({ id: proCompetitions.id });

          if (inserted) {
            competitionDbId = inserted.id;
            competitionsUpserted++;
          } else {
            // Race condition: another process inserted it
            const refetched = await db.query.proCompetitions.findFirst({
              where: eq(proCompetitions.externalId, competitionExternalId),
            });
            competitionDbId = refetched!.id;
          }
        }

        // 2. Upsert home team
        const homeTeamDbId = await upsertTeam(match.homeTeam);
        if (homeTeamDbId.isNew) teamsUpserted++;

        // 3. Upsert away team
        const awayTeamDbId = await upsertTeam(match.awayTeam);
        if (awayTeamDbId.isNew) teamsUpserted++;

        // 4. Upsert match
        const existingMatch = await db.query.proMatches.findFirst({
          where: eq(proMatches.externalId, match.externalId),
        });

        if (existingMatch) {
          // Update existing match (score, status, events, stats may have changed)
          await db
            .update(proMatches)
            .set({
              status: match.status,
              homeScore: match.homeScore,
              awayScore: match.awayScore,
              kickoffAt: match.kickoffAt,
              venue: match.venue,
              events: match.events.length > 0 ? match.events : existingMatch.events,
              stats: match.stats ?? existingMatch.stats,
              updatedAt: new Date(),
            })
            .where(eq(proMatches.id, existingMatch.id));
        } else {
          // Insert new match
          await db.insert(proMatches).values({
            externalId: match.externalId,
            competitionId: competitionDbId,
            homeTeamId: homeTeamDbId.id,
            awayTeamId: awayTeamDbId.id,
            status: match.status,
            homeScore: match.homeScore,
            awayScore: match.awayScore,
            kickoffAt: match.kickoffAt,
            venue: match.venue,
            events: match.events,
            stats: match.stats,
          });
        }

        matchesUpserted++;
      } catch (matchError) {
        const msg =
          matchError instanceof Error
            ? matchError.message
            : String(matchError);
        errors.push(`Match ${match.externalId}: ${msg}`);
      }
    }

    // If there are live or recently completed matches, fetch detailed events/stats
    const liveMatches = matches.filter(
      (m) => m.status === "live" || m.status === "completed"
    );

    let detailsSynced = 0;
    for (const liveMatch of liveMatches.slice(0, 20)) {
      // Limit to 20 to stay within API rate limits
      try {
        const details = await provider.getMatchDetails(liveMatch.externalId);
        if (!details) continue;

        await db
          .update(proMatches)
          .set({
            events: details.events,
            stats: details.stats,
            homeScore: details.homeScore,
            awayScore: details.awayScore,
            status: details.status,
            updatedAt: new Date(),
          })
          .where(eq(proMatches.externalId, liveMatch.externalId));

        detailsSynced++;
      } catch (detailError) {
        const msg =
          detailError instanceof Error
            ? detailError.message
            : String(detailError);
        errors.push(`Details for ${liveMatch.externalId}: ${msg}`);
      }
    }

    return NextResponse.json({
      success: true,
      date: today,
      summary: {
        totalMatches: matches.length,
        matchesUpserted,
        teamsUpserted,
        competitionsUpserted,
        detailsSynced,
        errors: errors.length,
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("[sync-sports] Fatal error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Helper: upsert a team and return its DB id
async function upsertTeam(
  team: { externalId: string; name: string; shortName: string; logo: string | null; country: string; city: string; founded: number; venue: string }
): Promise<{ id: string; isNew: boolean }> {
  const existing = await db.query.proTeams.findFirst({
    where: eq(proTeams.externalId, team.externalId),
  });

  if (existing) {
    // Update logo/name if they changed
    if (existing.logoUrl !== team.logo || existing.name !== team.name) {
      await db
        .update(proTeams)
        .set({
          name: team.name,
          shortName: team.shortName || existing.shortName,
          logoUrl: team.logo || existing.logoUrl,
          country: team.country || existing.country,
          updatedAt: new Date(),
        })
        .where(eq(proTeams.id, existing.id));
    }
    return { id: existing.id, isNew: false };
  }

  const sportId = await getFutebolSportId();
  const [inserted] = await db
    .insert(proTeams)
    .values({
      externalId: team.externalId,
      name: team.name,
      shortName: team.shortName,
      logoUrl: team.logo,
      sportId,
      country: team.country || "Unknown",
    })
    .onConflictDoNothing()
    .returning({ id: proTeams.id });

  if (inserted) {
    return { id: inserted.id, isNew: true };
  }

  // Race condition fallback
  const refetched = await db.query.proTeams.findFirst({
    where: eq(proTeams.externalId, team.externalId),
  });
  return { id: refetched!.id, isNew: false };
}
