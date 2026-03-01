import { eq, and, asc } from "drizzle-orm";
import { tournaments, enrollments, matches } from "@/server/db/schema";
import type { DB } from "@/server/db";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Participant {
  userId: string;
  teamId: string | null;
  seed: number | null;
}

interface BracketMatch {
  round: number;
  position: number;
  player1Id: string | null;
  player2Id: string | null;
  team1Id: string | null;
  team2Id: string | null;
  setsData?: Record<string, unknown>;
}

interface StandingRow {
  participantId: string;
  participantName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function nextPowerOf2(n: number): number {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

function sortParticipants(participants: Participant[]): Participant[] {
  const seeded = participants.filter((p) => p.seed !== null);
  const unseeded = participants.filter((p) => p.seed === null);
  seeded.sort((a, b) => (a.seed ?? 0) - (b.seed ?? 0));
  return [...seeded, ...shuffle(unseeded)];
}

// ---------------------------------------------------------------------------
// Single Elimination
// ---------------------------------------------------------------------------

function createSingleEliminationMatches(
  participants: Participant[]
): BracketMatch[] {
  const sorted = sortParticipants(participants);
  const totalSlots = nextPowerOf2(sorted.length);
  const totalRounds = Math.ceil(Math.log2(totalSlots));
  const bracketMatches: BracketMatch[] = [];

  // Pad with nulls for byes
  const slots: (Participant | null)[] = [];
  for (let i = 0; i < totalSlots; i++) {
    slots.push(i < sorted.length ? sorted[i]! : null);
  }

  // Round 1 matches
  const round1MatchCount = totalSlots / 2;
  for (let i = 0; i < round1MatchCount; i++) {
    const p1 = slots[i * 2] ?? null;
    const p2 = slots[i * 2 + 1] ?? null;
    bracketMatches.push({
      round: 1,
      position: i + 1,
      player1Id: p1?.userId ?? null,
      player2Id: p2?.userId ?? null,
      team1Id: p1?.teamId ?? null,
      team2Id: p2?.teamId ?? null,
    });
  }

  // Remaining rounds (empty slots -- TBD)
  for (let round = 2; round <= totalRounds; round++) {
    const matchesInRound = totalSlots / Math.pow(2, round);
    for (let pos = 1; pos <= matchesInRound; pos++) {
      bracketMatches.push({
        round,
        position: pos,
        player1Id: null,
        player2Id: null,
        team1Id: null,
        team2Id: null,
      });
    }
  }

  return bracketMatches;
}

// ---------------------------------------------------------------------------
// Double Elimination
// ---------------------------------------------------------------------------

function createDoubleEliminationMatches(
  participants: Participant[]
): BracketMatch[] {
  const sorted = sortParticipants(participants);
  const totalSlots = nextPowerOf2(sorted.length);
  const winnersRounds = Math.ceil(Math.log2(totalSlots));
  const bracketMatches: BracketMatch[] = [];

  // Pad with nulls for byes
  const slots: (Participant | null)[] = [];
  for (let i = 0; i < totalSlots; i++) {
    slots.push(i < sorted.length ? sorted[i]! : null);
  }

  // Winners bracket round 1
  const round1MatchCount = totalSlots / 2;
  for (let i = 0; i < round1MatchCount; i++) {
    const p1 = slots[i * 2] ?? null;
    const p2 = slots[i * 2 + 1] ?? null;
    bracketMatches.push({
      round: 1,
      position: i + 1,
      player1Id: p1?.userId ?? null,
      player2Id: p2?.userId ?? null,
      team1Id: p1?.teamId ?? null,
      team2Id: p2?.teamId ?? null,
      setsData: { bracket: "winners" },
    });
  }

  // Winners bracket remaining rounds
  for (let round = 2; round <= winnersRounds; round++) {
    const matchesInRound = totalSlots / Math.pow(2, round);
    for (let pos = 1; pos <= matchesInRound; pos++) {
      bracketMatches.push({
        round,
        position: pos,
        player1Id: null,
        player2Id: null,
        team1Id: null,
        team2Id: null,
        setsData: { bracket: "winners" },
      });
    }
  }

  // Losers bracket: has (winnersRounds - 1) * 2 rounds in theory,
  // but we simplify to (winnersRounds - 1) rounds with decreasing match counts
  const losersRounds = (winnersRounds - 1) * 2;
  let losersMatchCount = round1MatchCount / 2;
  for (let lr = 1; lr <= losersRounds; lr++) {
    // In even-numbered loser rounds, match count stays the same (feed from winners)
    // In odd-numbered loser rounds, match count halves
    const currentMatchCount = Math.max(1, Math.ceil(losersMatchCount));
    for (let pos = 1; pos <= currentMatchCount; pos++) {
      bracketMatches.push({
        round: winnersRounds + lr,
        position: pos,
        player1Id: null,
        player2Id: null,
        team1Id: null,
        team2Id: null,
        setsData: { bracket: "losers" },
      });
    }
    // Halve every other round
    if (lr % 2 === 0) {
      losersMatchCount = losersMatchCount / 2;
    }
  }

  // Grand Final (1 match)
  bracketMatches.push({
    round: winnersRounds + losersRounds + 1,
    position: 1,
    player1Id: null,
    player2Id: null,
    team1Id: null,
    team2Id: null,
    setsData: { bracket: "grand_final" },
  });

  return bracketMatches;
}

// ---------------------------------------------------------------------------
// Round Robin
// ---------------------------------------------------------------------------

function createRoundRobinMatches(
  participants: Participant[]
): BracketMatch[] {
  const sorted = sortParticipants(participants);
  const bracketMatches: BracketMatch[] = [];

  // Classic round-robin rotation algorithm
  const players = [...sorted];
  // If odd number of players, add a BYE (null)
  const hasBye = players.length % 2 !== 0;
  if (hasBye) {
    players.push({ userId: "__BYE__", teamId: null, seed: null });
  }

  const n = players.length;
  const totalRounds = n - 1;

  for (let round = 0; round < totalRounds; round++) {
    const matchesInRound = n / 2;
    let positionCounter = 1;
    for (let match = 0; match < matchesInRound; match++) {
      const home = players[match]!;
      const away = players[n - 1 - match]!;

      // Skip bye matches
      if (home.userId === "__BYE__" || away.userId === "__BYE__") continue;

      bracketMatches.push({
        round: round + 1,
        position: positionCounter++,
        player1Id: home.userId,
        player2Id: away.userId,
        team1Id: home.teamId,
        team2Id: away.teamId,
      });
    }

    // Rotate: fix first player, rotate rest
    const last = players.pop()!;
    players.splice(1, 0, last);
  }

  return bracketMatches;
}

// ---------------------------------------------------------------------------
// Swiss
// ---------------------------------------------------------------------------

function createSwissRound1Matches(
  participants: Participant[]
): BracketMatch[] {
  const sorted = sortParticipants(participants);
  const bracketMatches: BracketMatch[] = [];

  // First round: pair adjacent players (by seed/random order)
  const hasBye = sorted.length % 2 !== 0;
  const paired = [...sorted];

  for (let i = 0; i + 1 < paired.length; i += 2) {
    bracketMatches.push({
      round: 1,
      position: Math.floor(i / 2) + 1,
      player1Id: paired[i]!.userId,
      player2Id: paired[i + 1]!.userId,
      team1Id: paired[i]!.teamId,
      team2Id: paired[i + 1]!.teamId,
    });
  }

  // If bye, last player gets no match this round (automatic win tracked via bracketData)
  if (hasBye) {
    bracketMatches.push({
      round: 1,
      position: bracketMatches.length + 1,
      player1Id: paired[paired.length - 1]!.userId,
      player2Id: null,
      team1Id: paired[paired.length - 1]!.teamId,
      team2Id: null,
    });
  }

  return bracketMatches;
}

// ---------------------------------------------------------------------------
// League (Pontos Corridos) - home and away
// ---------------------------------------------------------------------------

function createLeagueMatches(
  participants: Participant[]
): BracketMatch[] {
  // First leg: same as round robin
  const firstLeg = createRoundRobinMatches(participants);
  const totalFirstLegRounds = Math.max(
    ...firstLeg.map((m) => m.round),
    0
  );

  // Second leg: reverse home/away
  const secondLeg = firstLeg.map((m) => ({
    ...m,
    round: m.round + totalFirstLegRounds,
    player1Id: m.player2Id,
    player2Id: m.player1Id,
    team1Id: m.team2Id,
    team2Id: m.team1Id,
  }));

  return [...firstLeg, ...secondLeg];
}

// ---------------------------------------------------------------------------
// generateBracket
// ---------------------------------------------------------------------------

export async function generateBracket(
  db: DB,
  tournamentId: string
): Promise<void> {
  // 1. Read tournament
  const tournament = await db.query.tournaments.findFirst({
    where: eq(tournaments.id, tournamentId),
  });

  if (!tournament) {
    throw new Error("Torneio nao encontrado.");
  }

  if (
    tournament.status !== "registration_closed" &&
    tournament.status !== "draft"
  ) {
    throw new Error(
      "O torneio precisa estar com inscricoes fechadas para gerar as chaves."
    );
  }

  // 2. Read confirmed enrollments
  const confirmedEnrollments = await db.query.enrollments.findMany({
    where: and(
      eq(enrollments.tournamentId, tournamentId),
      eq(enrollments.status, "confirmed")
    ),
    orderBy: [asc(enrollments.seed)],
  });

  if (confirmedEnrollments.length < (tournament.minParticipants ?? 2)) {
    throw new Error(
      `Numero minimo de participantes nao atingido. Necessario: ${tournament.minParticipants ?? 2}, atual: ${confirmedEnrollments.length}.`
    );
  }

  const participants: Participant[] = confirmedEnrollments.map((e) => ({
    userId: e.userId,
    teamId: e.teamId,
    seed: e.seed,
  }));

  // 3. Generate matches based on format
  let bracketMatches: BracketMatch[];
  const format = tournament.format ?? "single_elimination";

  switch (format) {
    case "single_elimination":
      bracketMatches = createSingleEliminationMatches(participants);
      break;
    case "double_elimination":
      bracketMatches = createDoubleEliminationMatches(participants);
      break;
    case "round_robin":
      bracketMatches = createRoundRobinMatches(participants);
      break;
    case "swiss":
      bracketMatches = createSwissRound1Matches(participants);
      break;
    case "league":
      bracketMatches = createLeagueMatches(participants);
      break;
    default:
      bracketMatches = createSingleEliminationMatches(participants);
  }

  // 4. Handle byes for single/double elimination: auto-advance players with bye
  if (format === "single_elimination" || format === "double_elimination") {
    const round1Matches = bracketMatches.filter((m) => m.round === 1);
    for (const match of round1Matches) {
      if (match.player1Id && !match.player2Id) {
        // Player 1 gets a bye -- this match is auto-won
        // We still create the match but mark player1 as needing advancement
        // The match will have winnerId set after insertion
      } else if (!match.player1Id && match.player2Id) {
        // Player 2 gets a bye
      }
    }
  }

  // 5. Insert all match records
  const matchInserts = bracketMatches.map((m) => ({
    tournamentId,
    round: m.round,
    position: m.position,
    player1Id: m.player1Id,
    player2Id: m.player2Id,
    team1Id: m.team1Id,
    team2Id: m.team2Id,
    status: "scheduled" as const,
    setsData: m.setsData ?? null,
  }));

  if (matchInserts.length > 0) {
    await db.insert(matches).values(matchInserts);
  }

  // 6. Handle byes: for single/double elimination, auto-advance bye winners
  if (format === "single_elimination" || format === "double_elimination") {
    const insertedMatches = await db.query.matches.findMany({
      where: and(
        eq(matches.tournamentId, tournamentId),
        eq(matches.round, 1)
      ),
    });

    for (const match of insertedMatches) {
      const isBye =
        (match.player1Id && !match.player2Id) ||
        (!match.player1Id && match.player2Id);
      if (isBye) {
        const winnerId = match.player1Id ?? match.player2Id;
        const winnerTeamId = match.team1Id ?? match.team2Id;
        // Mark match as completed with bye winner
        await db
          .update(matches)
          .set({
            winnerId,
            status: "completed",
            score1: match.player1Id ? 1 : 0,
            score2: match.player2Id ? 1 : 0,
            completedAt: new Date(),
          })
          .where(eq(matches.id, match.id));

        // Advance winner to next round
        if (winnerId) {
          await advancePlayerToNextMatch(
            db,
            tournamentId,
            match.round,
            match.position,
            winnerId,
            winnerTeamId,
            format,
            match.setsData as Record<string, unknown> | null
          );
        }
      }
    }
  }

  // 7. Build bracketData summary
  const totalRounds =
    format === "single_elimination" || format === "double_elimination"
      ? Math.ceil(Math.log2(nextPowerOf2(participants.length)))
      : Math.max(...bracketMatches.map((m) => m.round), 0);

  const bracketData = {
    format,
    totalParticipants: participants.length,
    totalRounds,
    totalMatches: bracketMatches.length,
    currentRound: 1,
    generatedAt: new Date().toISOString(),
  };

  // 8. Update tournament status and bracketData
  await db
    .update(tournaments)
    .set({
      status: "in_progress",
      bracketData,
      updatedAt: new Date(),
    })
    .where(eq(tournaments.id, tournamentId));
}

// ---------------------------------------------------------------------------
// advancePlayerToNextMatch (internal helper)
// ---------------------------------------------------------------------------

async function advancePlayerToNextMatch(
  db: DB,
  tournamentId: string,
  currentRound: number,
  currentPosition: number,
  playerId: string,
  teamId: string | null,
  format: string,
  setsData: Record<string, unknown> | null
): Promise<void> {
  const nextRound = currentRound + 1;
  const nextPosition = Math.ceil(currentPosition / 2);

  // Determine which slot (player1 or player2) in the next match
  const isTopSlot = currentPosition % 2 !== 0; // odd positions go to player1

  // For double elimination winners bracket, find match in winners bracket
  let nextMatch;
  if (format === "double_elimination" && setsData?.bracket === "winners") {
    const allNextRoundMatches = await db.query.matches.findMany({
      where: and(
        eq(matches.tournamentId, tournamentId),
        eq(matches.round, nextRound)
      ),
    });
    nextMatch = allNextRoundMatches.find(
      (m) =>
        m.position === nextPosition &&
        (m.setsData as Record<string, unknown> | null)?.bracket === "winners"
    );
  } else if (
    format === "double_elimination" &&
    setsData?.bracket === "losers"
  ) {
    const allNextRoundMatches = await db.query.matches.findMany({
      where: and(
        eq(matches.tournamentId, tournamentId),
        eq(matches.round, nextRound)
      ),
    });
    nextMatch = allNextRoundMatches.find(
      (m) =>
        m.position === nextPosition &&
        ((m.setsData as Record<string, unknown> | null)?.bracket === "losers" ||
          (m.setsData as Record<string, unknown> | null)?.bracket ===
            "grand_final")
    );
  } else {
    nextMatch = await db.query.matches.findFirst({
      where: and(
        eq(matches.tournamentId, tournamentId),
        eq(matches.round, nextRound),
        eq(matches.position, nextPosition)
      ),
    });
  }

  if (!nextMatch) return; // Final match already, no next match

  const updateFields: Record<string, unknown> = {};
  if (isTopSlot) {
    updateFields.player1Id = playerId;
    if (teamId) updateFields.team1Id = teamId;
  } else {
    updateFields.player2Id = playerId;
    if (teamId) updateFields.team2Id = teamId;
  }

  await db
    .update(matches)
    .set(updateFields)
    .where(eq(matches.id, nextMatch.id));
}

// ---------------------------------------------------------------------------
// advanceLoserToLosersBracket (internal helper for double elim)
// ---------------------------------------------------------------------------

async function advanceLoserToLosersBracket(
  db: DB,
  tournamentId: string,
  currentRound: number,
  currentPosition: number,
  loserId: string,
  loserTeamId: string | null,
  winnersRounds: number
): Promise<void> {
  // In double elimination, losers from winners bracket round R go to losers bracket
  // Losers bracket round index = (currentRound - 1) * 2 + 1 (for feeding rounds)
  const losersRoundOffset = winnersRounds;
  const targetLosersRound = losersRoundOffset + (currentRound - 1) * 2 + 1;
  const targetPosition = Math.ceil(currentPosition / 2);

  const allTargetMatches = await db.query.matches.findMany({
    where: and(
      eq(matches.tournamentId, tournamentId),
      eq(matches.round, targetLosersRound)
    ),
  });

  const targetMatch = allTargetMatches.find(
    (m) =>
      m.position === targetPosition &&
      (m.setsData as Record<string, unknown> | null)?.bracket === "losers"
  );

  if (!targetMatch) return;

  const isTopSlot = currentPosition % 2 !== 0;
  const updateFields: Record<string, unknown> = {};
  if (isTopSlot) {
    updateFields.player1Id = loserId;
    if (loserTeamId) updateFields.team1Id = loserTeamId;
  } else {
    updateFields.player2Id = loserId;
    if (loserTeamId) updateFields.team2Id = loserTeamId;
  }

  await db
    .update(matches)
    .set(updateFields)
    .where(eq(matches.id, targetMatch.id));
}

// ---------------------------------------------------------------------------
// advanceWinner (public)
// ---------------------------------------------------------------------------

export async function advanceWinner(
  db: DB,
  matchId: string
): Promise<void> {
  const match = await db.query.matches.findFirst({
    where: eq(matches.id, matchId),
    with: { tournament: true },
  });

  if (!match) {
    throw new Error("Partida nao encontrada.");
  }

  if (match.status !== "completed") {
    throw new Error("A partida precisa estar finalizada para avancar o vencedor.");
  }

  if (!match.winnerId) {
    throw new Error("A partida nao tem um vencedor definido.");
  }

  const tournament = match.tournament;
  if (!tournament) {
    throw new Error("Torneio nao encontrado.");
  }

  const format = tournament.format ?? "single_elimination";

  // For round robin, league, and swiss: no bracket advancement needed
  // Just check if tournament is complete
  if (format === "round_robin" || format === "league") {
    await checkTournamentCompletion(db, tournament.id, format);
    return;
  }

  if (format === "swiss") {
    await checkSwissRoundCompletion(db, tournament.id);
    return;
  }

  // For single/double elimination: advance winner to next match
  const winnerId = match.winnerId;
  const loserId =
    match.player1Id === winnerId ? match.player2Id : match.player1Id;
  const winnerTeamId =
    match.player1Id === winnerId ? match.team1Id : match.team2Id;
  const loserTeamId =
    match.player1Id === winnerId ? match.team2Id : match.team1Id;

  const matchSetsData = match.setsData as Record<string, unknown> | null;

  // Advance winner
  await advancePlayerToNextMatch(
    db,
    tournament.id,
    match.round,
    match.position,
    winnerId,
    winnerTeamId,
    format,
    matchSetsData
  );

  // For double elimination: advance loser to losers bracket
  if (
    format === "double_elimination" &&
    matchSetsData?.bracket === "winners" &&
    loserId
  ) {
    const totalParticipants = (
      await db.query.enrollments.findMany({
        where: and(
          eq(enrollments.tournamentId, tournament.id),
          eq(enrollments.status, "confirmed")
        ),
      })
    ).length;
    const winnersRounds = Math.ceil(
      Math.log2(nextPowerOf2(totalParticipants))
    );

    await advanceLoserToLosersBracket(
      db,
      tournament.id,
      match.round,
      match.position,
      loserId,
      loserTeamId,
      winnersRounds
    );
  }

  // Check if tournament is complete (final match decided)
  await checkTournamentCompletion(db, tournament.id, format);
}

// ---------------------------------------------------------------------------
// checkTournamentCompletion
// ---------------------------------------------------------------------------

async function checkTournamentCompletion(
  db: DB,
  tournamentId: string,
  format: string
): Promise<void> {
  const allMatches = await db.query.matches.findMany({
    where: eq(matches.tournamentId, tournamentId),
  });

  const allCompleted = allMatches.every(
    (m) => m.status === "completed" || m.status === "cancelled"
  );

  if (allCompleted && allMatches.length > 0) {
    await db
      .update(tournaments)
      .set({
        status: "completed",
        updatedAt: new Date(),
      })
      .where(eq(tournaments.id, tournamentId));

    // For elimination formats, mark final winner enrollment
    if (format === "single_elimination" || format === "double_elimination") {
      const maxRound = Math.max(...allMatches.map((m) => m.round));
      const finalMatch = allMatches.find(
        (m) => m.round === maxRound && m.position === 1
      );
      if (finalMatch?.winnerId) {
        await db
          .update(enrollments)
          .set({ status: "winner", placement: 1 })
          .where(
            and(
              eq(enrollments.tournamentId, tournamentId),
              eq(enrollments.userId, finalMatch.winnerId)
            )
          );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// checkSwissRoundCompletion
// ---------------------------------------------------------------------------

async function checkSwissRoundCompletion(
  db: DB,
  tournamentId: string
): Promise<void> {
  const tournament = await db.query.tournaments.findFirst({
    where: eq(tournaments.id, tournamentId),
  });
  if (!tournament) return;

  const allMatches = await db.query.matches.findMany({
    where: eq(matches.tournamentId, tournamentId),
    orderBy: [asc(matches.round)],
  });

  const currentRound = Math.max(...allMatches.map((m) => m.round), 0);
  const currentRoundMatches = allMatches.filter(
    (m) => m.round === currentRound
  );
  const allCurrentDone = currentRoundMatches.every(
    (m) => m.status === "completed" || m.status === "cancelled"
  );

  if (!allCurrentDone) return;

  // Check if all swiss rounds are completed
  const confirmedEnrollments = await db.query.enrollments.findMany({
    where: and(
      eq(enrollments.tournamentId, tournamentId),
      eq(enrollments.status, "confirmed")
    ),
  });
  const totalSwissRounds = Math.ceil(
    Math.log2(confirmedEnrollments.length)
  );

  if (currentRound >= totalSwissRounds) {
    // Tournament complete
    await db
      .update(tournaments)
      .set({ status: "completed", updatedAt: new Date() })
      .where(eq(tournaments.id, tournamentId));
    return;
  }

  // Generate next round: pair players with similar records
  const standings = await computeStandings(db, tournamentId);

  // Build pairings based on standings (adjacent players by points)
  const paired = new Set<string>();
  const nextRound = currentRound + 1;
  let position = 1;

  // Get history of previous matchups to avoid rematches if possible
  const previousMatchups = new Set<string>();
  for (const m of allMatches) {
    if (m.player1Id && m.player2Id) {
      previousMatchups.add(`${m.player1Id}-${m.player2Id}`);
      previousMatchups.add(`${m.player2Id}-${m.player1Id}`);
    }
  }

  const standingsList = [...standings];
  const newMatches: BracketMatch[] = [];

  for (let i = 0; i < standingsList.length; i++) {
    const p1 = standingsList[i]!;
    if (paired.has(p1.participantId)) continue;

    // Find best opponent (closest in standings, not already paired, not rematched)
    let bestOpponent: StandingRow | null = null;
    for (let j = i + 1; j < standingsList.length; j++) {
      const p2 = standingsList[j]!;
      if (paired.has(p2.participantId)) continue;
      const matchupKey = `${p1.participantId}-${p2.participantId}`;
      if (!previousMatchups.has(matchupKey)) {
        bestOpponent = p2;
        break;
      }
    }
    // Fallback: pair with next available even if rematch
    if (!bestOpponent) {
      for (let j = i + 1; j < standingsList.length; j++) {
        const p2 = standingsList[j]!;
        if (paired.has(p2.participantId)) continue;
        bestOpponent = p2;
        break;
      }
    }

    if (bestOpponent) {
      paired.add(p1.participantId);
      paired.add(bestOpponent.participantId);

      // Find team IDs from enrollments
      const enrollment1 = confirmedEnrollments.find(
        (e) => e.userId === p1.participantId
      );
      const enrollment2 = confirmedEnrollments.find(
        (e) => e.userId === bestOpponent!.participantId
      );

      newMatches.push({
        round: nextRound,
        position: position++,
        player1Id: p1.participantId,
        player2Id: bestOpponent.participantId,
        team1Id: enrollment1?.teamId ?? null,
        team2Id: enrollment2?.teamId ?? null,
      });
    }
  }

  // Handle odd player out (bye)
  for (const standing of standingsList) {
    if (!paired.has(standing.participantId)) {
      newMatches.push({
        round: nextRound,
        position: position++,
        player1Id: standing.participantId,
        player2Id: null,
        team1Id:
          confirmedEnrollments.find(
            (e) => e.userId === standing.participantId
          )?.teamId ?? null,
        team2Id: null,
      });
    }
  }

  // Insert new round matches
  if (newMatches.length > 0) {
    const inserts = newMatches.map((m) => ({
      tournamentId,
      round: m.round,
      position: m.position,
      player1Id: m.player1Id,
      player2Id: m.player2Id,
      team1Id: m.team1Id,
      team2Id: m.team2Id,
      status: "scheduled" as const,
    }));
    await db.insert(matches).values(inserts);
  }

  // Update bracketData currentRound
  const bracketData = (tournament.bracketData as Record<string, unknown>) ?? {};
  await db
    .update(tournaments)
    .set({
      bracketData: { ...bracketData, currentRound: nextRound },
      updatedAt: new Date(),
    })
    .where(eq(tournaments.id, tournamentId));
}

// ---------------------------------------------------------------------------
// computeStandings (internal)
// ---------------------------------------------------------------------------

async function computeStandings(
  db: DB,
  tournamentId: string
): Promise<StandingRow[]> {
  const allMatches = await db.query.matches.findMany({
    where: and(
      eq(matches.tournamentId, tournamentId),
      eq(matches.status, "completed")
    ),
  });

  const confirmedEnrollments = await db.query.enrollments.findMany({
    where: and(
      eq(enrollments.tournamentId, tournamentId),
      eq(enrollments.status, "confirmed")
    ),
    with: { user: true },
  });

  // Build standings map
  const standingsMap = new Map<string, StandingRow>();

  for (const enrollment of confirmedEnrollments) {
    standingsMap.set(enrollment.userId, {
      participantId: enrollment.userId,
      participantName: enrollment.user?.name ?? "Participante",
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    });
  }

  for (const match of allMatches) {
    const p1Id = match.player1Id;
    const p2Id = match.player2Id;
    if (!p1Id || !p2Id) continue;

    const p1 = standingsMap.get(p1Id);
    const p2 = standingsMap.get(p2Id);
    if (!p1 || !p2) continue;

    const s1 = match.score1 ?? 0;
    const s2 = match.score2 ?? 0;

    p1.played++;
    p2.played++;
    p1.goalsFor += s1;
    p1.goalsAgainst += s2;
    p2.goalsFor += s2;
    p2.goalsAgainst += s1;

    if (match.winnerId === p1Id) {
      p1.wins++;
      p2.losses++;
      p1.points += 3;
    } else if (match.winnerId === p2Id) {
      p2.wins++;
      p1.losses++;
      p2.points += 3;
    } else {
      // Draw (no winner set, or scores are equal)
      p1.draws++;
      p2.draws++;
      p1.points += 1;
      p2.points += 1;
    }
  }

  // Calculate goal difference
  for (const row of standingsMap.values()) {
    row.goalDifference = row.goalsFor - row.goalsAgainst;
  }

  // Sort: points desc, then goal difference desc, then goals scored desc
  const standings = Array.from(standingsMap.values());
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference)
      return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  return standings;
}

// ---------------------------------------------------------------------------
// getStandings (public)
// ---------------------------------------------------------------------------

export async function getStandings(
  db: DB,
  tournamentId: string
): Promise<StandingRow[]> {
  const tournament = await db.query.tournaments.findFirst({
    where: eq(tournaments.id, tournamentId),
  });

  if (!tournament) {
    throw new Error("Torneio nao encontrado.");
  }

  return computeStandings(db, tournamentId);
}
