import { db } from "@/server/db";
import {
  proTeams,
  proAthletes,
  proCompetitions,
  proMatches,
  proMatchOdds,
} from "@/server/db/schema";
import {
  BRASILEIRAO_TEAMS,
  MOCK_COMPETITIONS,
  generateMockOdds,
} from "@/server/services/sports-data";

/**
 * Seeds the database with Brasileirao Serie A data:
 * - 1 competition (Brasileirao Serie A)
 * - 20 teams with real names
 * - 10 upcoming matches with odds
 * - 2 live matches with events/stats
 */
export async function seedProSports() {
  console.log("Seeding pro sports data...");

  // 1. Seed competition
  const brasileiraoData = MOCK_COMPETITIONS[0]!;
  const [competition] = await db
    .insert(proCompetitions)
    .values({
      externalId: brasileiraoData.externalId,
      name: brasileiraoData.name,
      shortName: brasileiraoData.shortName,
      logo: brasileiraoData.logo,
      country: brasileiraoData.country,
      season: brasileiraoData.season,
      isActive: true,
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-12-01"),
    })
    .onConflictDoNothing()
    .returning();

  if (!competition) {
    console.log("Competition already exists, skipping seed.");
    return;
  }

  console.log(`Created competition: ${competition.name} (${competition.id})`);

  // 2. Seed teams
  const teamIds: Record<string, string> = {};
  for (const teamData of BRASILEIRAO_TEAMS) {
    const [team] = await db
      .insert(proTeams)
      .values({
        externalId: teamData.externalId,
        name: teamData.name,
        shortName: teamData.shortName,
        logo: teamData.logo,
        country: teamData.country,
        city: teamData.city,
        founded: teamData.founded,
        venue: teamData.venue,
      })
      .onConflictDoNothing()
      .returning();

    if (team) {
      teamIds[teamData.externalId] = team.id;
    }
  }
  console.log(`Created ${Object.keys(teamIds).length} teams`);

  // 3. Seed some athletes for Flamengo and Palmeiras
  const flamengoId = teamIds["flamengo"];
  const palmeirasId = teamIds["palmeiras"];

  if (flamengoId) {
    const flamengoPlayers = [
      { name: "Gabriel Barbosa", position: "Atacante", number: 10, nationality: "Brasil" },
      { name: "De Arrascaeta", position: "Meia", number: 14, nationality: "Uruguai" },
      { name: "Everton Ribeiro", position: "Meia", number: 7, nationality: "Brasil" },
      { name: "David Luiz", position: "Zagueiro", number: 23, nationality: "Brasil" },
      { name: "Agustin Rossi", position: "Goleiro", number: 1, nationality: "Argentina" },
    ];

    for (const p of flamengoPlayers) {
      await db
        .insert(proAthletes)
        .values({
          name: p.name,
          position: p.position,
          number: p.number,
          nationality: p.nationality,
          teamId: flamengoId,
          stats: { goals: Math.floor(Math.random() * 15), assists: Math.floor(Math.random() * 10), appearances: Math.floor(Math.random() * 30) + 5 },
        })
        .onConflictDoNothing();
    }
  }

  if (palmeirasId) {
    const palmeirasPlayers = [
      { name: "Endrick", position: "Atacante", number: 9, nationality: "Brasil" },
      { name: "Raphael Veiga", position: "Meia", number: 23, nationality: "Brasil" },
      { name: "Gustavo Gomez", position: "Zagueiro", number: 15, nationality: "Paraguai" },
      { name: "Weverton", position: "Goleiro", number: 21, nationality: "Brasil" },
      { name: "Dudu", position: "Atacante", number: 7, nationality: "Brasil" },
    ];

    for (const p of palmeirasPlayers) {
      await db
        .insert(proAthletes)
        .values({
          name: p.name,
          position: p.position,
          number: p.number,
          nationality: p.nationality,
          teamId: palmeirasId,
          stats: { goals: Math.floor(Math.random() * 15), assists: Math.floor(Math.random() * 10), appearances: Math.floor(Math.random() * 30) + 5 },
        })
        .onConflictDoNothing();
    }
  }

  console.log("Created athletes for Flamengo and Palmeiras");

  // 4. Seed matches
  const now = new Date();
  const teamExternalIds = Object.keys(teamIds);
  const createdMatchIds: string[] = [];

  // 2 live matches
  const liveMatches = [
    {
      externalId: "match-live-1",
      homeTeamExternalId: "flamengo",
      awayTeamExternalId: "palmeiras",
      status: "live" as const,
      homeScore: 2,
      awayScore: 1,
      round: "Rodada 5",
      kickoffAt: new Date(now.getTime() - 60 * 60 * 1000),
      venue: "Maracana",
      events: [
        { minute: 12, type: "goal", player: "Gabriel Barbosa", team: "Flamengo" },
        { minute: 34, type: "goal", player: "Endrick", team: "Palmeiras" },
        { minute: 55, type: "yellow_card", player: "Gustavo Gomez", team: "Palmeiras" },
        { minute: 67, type: "goal", player: "De Arrascaeta", team: "Flamengo" },
      ],
      stats: {
        homePossession: 52, awayPossession: 48,
        homeShots: 14, awayShots: 9,
        homeShotsOnTarget: 6, awayShotsOnTarget: 3,
        homeCorners: 5, awayCorners: 3,
        homeFouls: 11, awayFouls: 14,
      },
    },
    {
      externalId: "match-live-2",
      homeTeamExternalId: "corinthians",
      awayTeamExternalId: "saopaulo",
      status: "live" as const,
      homeScore: 0,
      awayScore: 0,
      round: "Rodada 5",
      kickoffAt: new Date(now.getTime() - 30 * 60 * 1000),
      venue: "Neo Quimica Arena",
      events: [
        { minute: 18, type: "yellow_card", player: "Renato Augusto", team: "Corinthians" },
      ],
      stats: {
        homePossession: 45, awayPossession: 55,
        homeShots: 3, awayShots: 7,
        homeShotsOnTarget: 1, awayShotsOnTarget: 3,
        homeCorners: 2, awayCorners: 4,
        homeFouls: 8, awayFouls: 6,
      },
    },
  ];

  for (const m of liveMatches) {
    const homeId = teamIds[m.homeTeamExternalId];
    const awayId = teamIds[m.awayTeamExternalId];
    if (!homeId || !awayId) continue;

    const [match] = await db
      .insert(proMatches)
      .values({
        externalId: m.externalId,
        competitionId: competition.id,
        homeTeamId: homeId,
        awayTeamId: awayId,
        status: m.status,
        homeScore: m.homeScore,
        awayScore: m.awayScore,
        round: m.round,
        kickoffAt: m.kickoffAt,
        venue: m.venue,
        events: m.events,
        stats: m.stats,
      })
      .onConflictDoNothing()
      .returning();

    if (match) createdMatchIds.push(match.id);
  }

  // 10 upcoming (scheduled) matches
  for (let i = 0; i < 10; i++) {
    const homeIdx = i * 2;
    const awayIdx = i * 2 + 1;
    if (homeIdx >= teamExternalIds.length || awayIdx >= teamExternalIds.length) break;

    const homeExtId = teamExternalIds[homeIdx]!;
    const awayExtId = teamExternalIds[awayIdx]!;
    const homeId = teamIds[homeExtId];
    const awayId = teamIds[awayExtId];
    if (!homeId || !awayId) continue;

    const kickoff = new Date(now.getTime() + (i + 1) * 24 * 60 * 60 * 1000);

    const [match] = await db
      .insert(proMatches)
      .values({
        externalId: `match-scheduled-${i + 1}`,
        competitionId: competition.id,
        homeTeamId: homeId,
        awayTeamId: awayId,
        status: "scheduled",
        round: "Rodada 6",
        kickoffAt: kickoff,
        venue: BRASILEIRAO_TEAMS[homeIdx]?.venue ?? "Estadio",
      })
      .onConflictDoNothing()
      .returning();

    if (match) createdMatchIds.push(match.id);
  }

  console.log(`Created ${createdMatchIds.length} matches`);

  // 5. Seed odds for each match
  for (const matchId of createdMatchIds) {
    const match = await db.query.proMatches.findFirst({
      where: (m, { eq }) => eq(m.id, matchId),
    });
    if (!match?.externalId) continue;

    const odds = generateMockOdds(match.externalId);
    for (const odd of odds) {
      await db
        .insert(proMatchOdds)
        .values({
          matchId,
          marketType: odd.marketType,
          selection: odd.selection,
          odds: odd.odds.toString(),
          isActive: true,
        })
        .onConflictDoNothing();
    }
  }

  console.log(`Seeded odds for ${createdMatchIds.length} matches`);
  console.log("Pro sports seed complete!");
}
