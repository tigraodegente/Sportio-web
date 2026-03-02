import { db } from "@/server/db";
import { users, userSports, gcoinTransactions } from "@/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { createAutoPost } from "./auto-feed";
import { createNotification } from "./notification-service";

// ==================== XP SYSTEM ====================

// XP amounts for each activity
const XP_TABLE = {
  match_won: 100,
  match_lost: 25,
  match_draw: 50,
  tournament_enrolled: 30,
  tournament_won: 500,
  tournament_runner_up: 250,
  tournament_third: 150,
  bet_placed: 10,
  bet_won: 30,
  challenge_joined: 15,
  challenge_completed: 100,
  post_created: 5,
  comment_created: 3,
  follow_given: 2,
  follow_received: 5,
  daily_login: 10,
  profile_completed: 50,
} as const;

// Level thresholds: level N requires levelThreshold(N) total XP
function levelThreshold(level: number): number {
  // Progressive curve: each level requires more XP
  // Level 1: 0, Level 2: 200, Level 3: 500, Level 4: 900, Level 5: 1400...
  if (level <= 1) return 0;
  return Math.floor(100 * (level - 1) * (level / 2));
}

// Calculate level from XP
function calculateLevel(xp: number): number {
  let level = 1;
  while (levelThreshold(level + 1) <= xp) {
    level++;
    if (level >= 100) break; // Cap at level 100
  }
  return level;
}

/**
 * Award XP to a user and check for level up.
 */
export async function awardXP(
  userId: string,
  activity: keyof typeof XP_TABLE,
  context?: { tournamentName?: string; sportId?: string }
): Promise<{ xpGained: number; newXP: number; newLevel: number; leveledUp: boolean }> {
  const xpAmount = XP_TABLE[activity];

  // Get current user XP
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { xp: true, level: true },
  });

  const currentXP = user?.xp ?? 0;
  const currentLevel = user?.level ?? 1;
  const newXP = currentXP + xpAmount;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > currentLevel;

  // Update user
  await db
    .update(users)
    .set({ xp: newXP, level: newLevel })
    .where(eq(users.id, userId));

  // If leveled up, create auto-post and notification
  if (leveledUp) {
    // Award gamification GCoins for leveling up (level * 10 GCoins)
    const levelBonus = newLevel * 10;
    await db
      .update(users)
      .set({ gcoinsGamification: sql`${users.gcoinsGamification} + ${levelBonus}` })
      .where(eq(users.id, userId));

    await db.insert(gcoinTransactions).values({
      userId,
      type: "gamification",
      category: "achievement",
      amount: levelBonus.toString(),
      description: `Bonus por atingir nivel ${newLevel}`,
    });

    // Auto-post level up
    createAutoPost({
      type: "level_up",
      userId,
      data: { level: newLevel },
      sportId: context?.sportId,
    }).catch(() => {});

    // Notify level up
    createNotification({
      userId,
      type: "system",
      title: `Nivel ${newLevel}!`,
      message: `Parabens! Voce subiu para o nivel ${newLevel} e ganhou ${levelBonus} GCoins de bonus!`,
      data: { level: newLevel, xp: newXP, bonus: levelBonus },
    }).catch(() => {});
  }

  return { xpGained: xpAmount, newXP, newLevel, leveledUp };
}

// ==================== ELO RATING SYSTEM ====================

// ELO Configuration
const ELO_K_FACTOR = 32; // Standard K-factor
const ELO_K_FACTOR_NEW = 40; // Higher K-factor for players with few matches
const ELO_NEW_THRESHOLD = 10; // Matches below this = "new player"

/**
 * Calculate new ELO ratings for two players after a match.
 */
function calculateELO(
  ratingA: number,
  ratingB: number,
  result: "win" | "loss" | "draw",
  matchesA: number,
  matchesB: number
): { newRatingA: number; newRatingB: number } {
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const expectedB = 1 - expectedA;

  let scoreA: number;
  let scoreB: number;
  switch (result) {
    case "win":
      scoreA = 1;
      scoreB = 0;
      break;
    case "loss":
      scoreA = 0;
      scoreB = 1;
      break;
    case "draw":
      scoreA = 0.5;
      scoreB = 0.5;
      break;
  }

  const kA = matchesA < ELO_NEW_THRESHOLD ? ELO_K_FACTOR_NEW : ELO_K_FACTOR;
  const kB = matchesB < ELO_NEW_THRESHOLD ? ELO_K_FACTOR_NEW : ELO_K_FACTOR;

  return {
    newRatingA: Math.round(ratingA + kA * (scoreA - expectedA)),
    newRatingB: Math.round(ratingB + kB * (scoreB - expectedB)),
  };
}

/**
 * Update ELO ratings and W/L/D after a match result.
 * Called from match.updateScore when a match is completed.
 */
export async function updateRatingsAfterMatch(
  player1Id: string,
  player2Id: string,
  winnerId: string | null,
  sportId: string
): Promise<void> {
  // Get or create userSports records
  let sport1 = await db.query.userSports.findFirst({
    where: and(eq(userSports.userId, player1Id), eq(userSports.sportId, sportId)),
  });
  let sport2 = await db.query.userSports.findFirst({
    where: and(eq(userSports.userId, player2Id), eq(userSports.sportId, sportId)),
  });

  // Create records if they don't exist
  if (!sport1) {
    [sport1] = await db
      .insert(userSports)
      .values({
        id: crypto.randomUUID(),
        userId: player1Id,
        sportId,
        rating: "1000",
        wins: 0,
        losses: 0,
        draws: 0,
        createdAt: new Date(),
      })
      .onConflictDoNothing()
      .returning();
    if (!sport1) {
      sport1 = await db.query.userSports.findFirst({
        where: and(eq(userSports.userId, player1Id), eq(userSports.sportId, sportId)),
      });
    }
  }

  if (!sport2) {
    [sport2] = await db
      .insert(userSports)
      .values({
        id: crypto.randomUUID(),
        userId: player2Id,
        sportId,
        rating: "1000",
        wins: 0,
        losses: 0,
        draws: 0,
        createdAt: new Date(),
      })
      .onConflictDoNothing()
      .returning();
    if (!sport2) {
      sport2 = await db.query.userSports.findFirst({
        where: and(eq(userSports.userId, player2Id), eq(userSports.sportId, sportId)),
      });
    }
  }

  if (!sport1 || !sport2) return;

  const rating1 = Number(sport1.rating ?? 1000);
  const rating2 = Number(sport2.rating ?? 1000);
  const matches1 = (sport1.wins ?? 0) + (sport1.losses ?? 0) + (sport1.draws ?? 0);
  const matches2 = (sport2.wins ?? 0) + (sport2.losses ?? 0) + (sport2.draws ?? 0);

  let result: "win" | "loss" | "draw";
  if (winnerId === player1Id) {
    result = "win";
  } else if (winnerId === player2Id) {
    result = "loss";
  } else {
    result = "draw";
  }

  const { newRatingA, newRatingB } = calculateELO(rating1, rating2, result, matches1, matches2);

  // Update player 1
  if (result === "win") {
    await db
      .update(userSports)
      .set({ rating: newRatingA.toString(), wins: sql`${userSports.wins} + 1` })
      .where(eq(userSports.id, sport1.id));
  } else if (result === "loss") {
    await db
      .update(userSports)
      .set({ rating: newRatingA.toString(), losses: sql`${userSports.losses} + 1` })
      .where(eq(userSports.id, sport1.id));
  } else {
    await db
      .update(userSports)
      .set({ rating: newRatingA.toString(), draws: sql`${userSports.draws} + 1` })
      .where(eq(userSports.id, sport1.id));
  }

  // Update player 2
  if (result === "loss") {
    // Player 2 won (result is from player 1's perspective)
    await db
      .update(userSports)
      .set({ rating: newRatingB.toString(), wins: sql`${userSports.wins} + 1` })
      .where(eq(userSports.id, sport2.id));
  } else if (result === "win") {
    await db
      .update(userSports)
      .set({ rating: newRatingB.toString(), losses: sql`${userSports.losses} + 1` })
      .where(eq(userSports.id, sport2.id));
  } else {
    await db
      .update(userSports)
      .set({ rating: newRatingB.toString(), draws: sql`${userSports.draws} + 1` })
      .where(eq(userSports.id, sport2.id));
  }

  // Award XP to both players
  if (winnerId === player1Id) {
    awardXP(player1Id, "match_won", { sportId }).catch(() => {});
    awardXP(player2Id, "match_lost", { sportId }).catch(() => {});
  } else if (winnerId === player2Id) {
    awardXP(player2Id, "match_won", { sportId }).catch(() => {});
    awardXP(player1Id, "match_lost", { sportId }).catch(() => {});
  } else {
    awardXP(player1Id, "match_draw", { sportId }).catch(() => {});
    awardXP(player2Id, "match_draw", { sportId }).catch(() => {});
  }
}

// ==================== DAILY BONUS SYSTEM ====================

/**
 * Claim daily login bonus. Returns GCoins awarded.
 * Can only be claimed once per day.
 */
export async function claimDailyBonus(userId: string): Promise<{
  awarded: boolean;
  amount: number;
  streak: number;
}> {
  // Check last daily bonus transaction
  const lastBonus = await db.query.gcoinTransactions.findFirst({
    where: and(
      eq(gcoinTransactions.userId, userId),
      eq(gcoinTransactions.category, "daily_bonus")
    ),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (lastBonus) {
    const lastDate = new Date(lastBonus.createdAt);
    const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());

    // Already claimed today
    if (lastDay.getTime() === today.getTime()) {
      return { awarded: false, amount: 0, streak: 0 };
    }
  }

  // Calculate streak (consecutive days)
  let streak = 1;
  if (lastBonus) {
    const lastDate = new Date(lastBonus.createdAt);
    const yesterday = new Date(today.getTime() - 86400000);
    const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());

    if (lastDay.getTime() === yesterday.getTime()) {
      // Parse streak from description or default to 1
      const match = lastBonus.description?.match(/Dia (\d+)/);
      streak = match ? parseInt(match[1]) + 1 : 2;
    }
  }

  // Bonus amount increases with streak (10 base + 5 per day, max 50)
  const amount = Math.min(10 + (streak - 1) * 5, 50);

  // Award bonus
  await db
    .update(users)
    .set({ gcoinsGamification: sql`${users.gcoinsGamification} + ${amount}` })
    .where(eq(users.id, userId));

  await db.insert(gcoinTransactions).values({
    userId,
    type: "gamification",
    category: "daily_bonus",
    amount: amount.toString(),
    description: `Bonus diario - Dia ${streak} (sequencia)`,
  });

  // Award XP
  awardXP(userId, "daily_login").catch(() => {});

  return { awarded: true, amount, streak };
}

// ==================== TOURNAMENT COMPLETION ====================

/**
 * Called when a tournament is completed to award placement prizes and XP.
 */
export async function processTournamentCompletion(
  tournamentId: string,
  placements: Array<{ userId: string; placement: number }>
): Promise<void> {
  for (const { userId, placement } of placements) {
    if (placement === 1) {
      await awardXP(userId, "tournament_won");
    } else if (placement === 2) {
      await awardXP(userId, "tournament_runner_up");
    } else if (placement === 3) {
      await awardXP(userId, "tournament_third");
    }
  }
}

// ==================== LEVEL SYSTEM INFO ====================

/**
 * Get level progression info for a user.
 */
export function getLevelInfo(xp: number): {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  progress: number;
  xpToNext: number;
} {
  const level = calculateLevel(xp);
  const currentThreshold = levelThreshold(level);
  const nextThreshold = levelThreshold(level + 1);
  const xpInLevel = xp - currentThreshold;
  const xpNeeded = nextThreshold - currentThreshold;

  return {
    level,
    currentXP: xp,
    nextLevelXP: nextThreshold,
    progress: xpNeeded > 0 ? Math.min((xpInLevel / xpNeeded) * 100, 100) : 100,
    xpToNext: Math.max(nextThreshold - xp, 0),
  };
}

/**
 * Get ELO tier/division name based on rating.
 */
export function getRatingTier(rating: number): {
  tier: string;
  color: string;
  minRating: number;
} {
  if (rating >= 2200) return { tier: "Lenda", color: "#ff6b35", minRating: 2200 };
  if (rating >= 2000) return { tier: "Mestre", color: "#e63946", minRating: 2000 };
  if (rating >= 1800) return { tier: "Diamante", color: "#457b9d", minRating: 1800 };
  if (rating >= 1600) return { tier: "Platina", color: "#2a9d8f", minRating: 1600 };
  if (rating >= 1400) return { tier: "Ouro", color: "#e9c46a", minRating: 1400 };
  if (rating >= 1200) return { tier: "Prata", color: "#adb5bd", minRating: 1200 };
  if (rating >= 1000) return { tier: "Bronze", color: "#cd7f32", minRating: 1000 };
  return { tier: "Iniciante", color: "#6c757d", minRating: 0 };
}
