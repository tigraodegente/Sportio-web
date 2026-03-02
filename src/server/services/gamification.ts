import { db } from "@/server/db";
import { users, userSports, userRoles, gcoinTransactions, userAchievements, achievements, userMissions, missions } from "@/server/db/schema";
import { eq, and, sql, lte, gte, isNull } from "drizzle-orm";
import { createAutoPost } from "./auto-feed";
import { createNotification } from "./notification-service";

// ==================== XP SYSTEM - ALL PERSONAS ====================

// XP amounts for each activity, organized by persona
const XP_TABLE = {
  // === ATLETA ===
  match_won: 100,
  match_lost: 25,
  match_draw: 50,
  tournament_enrolled: 30,
  tournament_won: 500,
  tournament_runner_up: 250,
  tournament_third: 150,
  tournament_checkin: 20,

  // === ORGANIZADOR ===
  tournament_created: 80,
  tournament_started: 50,
  tournament_completed: 200,
  bracket_generated: 30,
  sponsorship_approved: 40,
  prizes_awarded: 60,
  invite_sent: 10,

  // === MARCA / PATROCINADOR ===
  campaign_created: 60,
  tournament_sponsored: 100,
  gcoins_purchased: 20,
  product_giveaway_created: 40,
  campaign_1000_impressions: 30,
  campaign_100_clicks: 50,
  campaign_redemption_received: 15,

  // === ARBITRO ===
  match_refereed: 80,
  score_updated: 20,

  // === TREINADOR ===
  athlete_trained: 40,    // when an athlete they follow wins
  training_post: 30,      // post with training tips

  // === NUTRICIONISTA ===
  nutrition_post: 30,     // post with nutrition tips
  athlete_followed: 15,

  // === FOTOGRAFO ===
  photo_post: 25,         // post with tournament photos
  tournament_covered: 60, // posts during tournament

  // === DONO DE ARENA ===
  arena_created: 50,
  tournament_hosted: 80,

  // === FA / BETTOR ===
  bet_placed: 10,
  bet_won: 30,
  bet_streak_3: 50,
  bet_streak_5: 100,

  // === SOCIAL (ALL PERSONAS) ===
  post_created: 5,
  comment_created: 3,
  like_given: 1,
  follow_given: 2,
  follow_received: 5,
  like_received: 2,
  daily_login: 10,
  profile_completed: 50,
  first_gcoin_purchase: 30,
  first_transfer: 20,
  chat_message_sent: 1,
  challenge_joined: 15,
  challenge_completed: 100,
} as const;

// Level thresholds: level N requires levelThreshold(N) total XP
function levelThreshold(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * (level - 1) * (level / 2));
}

function calculateLevel(xp: number): number {
  let level = 1;
  while (levelThreshold(level + 1) <= xp) {
    level++;
    if (level >= 100) break;
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
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { xp: true, level: true },
  });

  const currentXP = user?.xp ?? 0;
  const currentLevel = user?.level ?? 1;
  const newXP = currentXP + xpAmount;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > currentLevel;

  await db
    .update(users)
    .set({ xp: newXP, level: newLevel })
    .where(eq(users.id, userId));

  if (leveledUp) {
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

    createAutoPost({
      type: "level_up",
      userId,
      data: { level: newLevel },
      sportId: context?.sportId,
    }).catch(() => {});

    createNotification({
      userId,
      type: "system",
      title: `Nivel ${newLevel}!`,
      message: `Parabens! Voce subiu para o nivel ${newLevel} e ganhou ${levelBonus} GCoins de bonus!`,
      data: { level: newLevel, xp: newXP, bonus: levelBonus },
    }).catch(() => {});
  }

  // Check achievements and missions after XP award
  checkAchievements(userId, activity).catch(() => {});
  updateMissionProgress(userId, activity).catch(() => {});

  return { xpGained: xpAmount, newXP, newLevel, leveledUp };
}

// ==================== ELO RATING SYSTEM ====================

const ELO_K_FACTOR = 32;
const ELO_K_FACTOR_NEW = 40;
const ELO_NEW_THRESHOLD = 10;

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
    case "win": scoreA = 1; scoreB = 0; break;
    case "loss": scoreA = 0; scoreB = 1; break;
    case "draw": scoreA = 0.5; scoreB = 0.5; break;
  }

  const kA = matchesA < ELO_NEW_THRESHOLD ? ELO_K_FACTOR_NEW : ELO_K_FACTOR;
  const kB = matchesB < ELO_NEW_THRESHOLD ? ELO_K_FACTOR_NEW : ELO_K_FACTOR;

  return {
    newRatingA: Math.round(ratingA + kA * (scoreA - expectedA)),
    newRatingB: Math.round(ratingB + kB * (scoreB - expectedB)),
  };
}

export async function updateRatingsAfterMatch(
  player1Id: string,
  player2Id: string,
  winnerId: string | null,
  sportId: string
): Promise<void> {
  let sport1 = await db.query.userSports.findFirst({
    where: and(eq(userSports.userId, player1Id), eq(userSports.sportId, sportId)),
  });
  let sport2 = await db.query.userSports.findFirst({
    where: and(eq(userSports.userId, player2Id), eq(userSports.sportId, sportId)),
  });

  if (!sport1) {
    [sport1] = await db.insert(userSports).values({
      id: crypto.randomUUID(), userId: player1Id, sportId,
      rating: "1000", wins: 0, losses: 0, draws: 0, createdAt: new Date(),
    }).onConflictDoNothing().returning();
    if (!sport1) {
      sport1 = await db.query.userSports.findFirst({
        where: and(eq(userSports.userId, player1Id), eq(userSports.sportId, sportId)),
      });
    }
  }
  if (!sport2) {
    [sport2] = await db.insert(userSports).values({
      id: crypto.randomUUID(), userId: player2Id, sportId,
      rating: "1000", wins: 0, losses: 0, draws: 0, createdAt: new Date(),
    }).onConflictDoNothing().returning();
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

  const result: "win" | "loss" | "draw" =
    winnerId === player1Id ? "win" : winnerId === player2Id ? "loss" : "draw";

  const { newRatingA, newRatingB } = calculateELO(rating1, rating2, result, matches1, matches2);

  // Update player 1
  const field1 = result === "win" ? "wins" : result === "loss" ? "losses" : "draws";
  await db.update(userSports)
    .set({ rating: newRatingA.toString(), [field1]: sql`${userSports[field1]} + 1` })
    .where(eq(userSports.id, sport1.id));

  // Update player 2
  const field2 = result === "loss" ? "wins" : result === "win" ? "losses" : "draws";
  await db.update(userSports)
    .set({ rating: newRatingB.toString(), [field2]: sql`${userSports[field2]} + 1` })
    .where(eq(userSports.id, sport2.id));

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

export async function claimDailyBonus(userId: string): Promise<{
  awarded: boolean;
  amount: number;
  streak: number;
}> {
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
    if (lastDay.getTime() === today.getTime()) {
      return { awarded: false, amount: 0, streak: 0 };
    }
  }

  let streak = 1;
  if (lastBonus) {
    const lastDate = new Date(lastBonus.createdAt);
    const yesterday = new Date(today.getTime() - 86400000);
    const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
    if (lastDay.getTime() === yesterday.getTime()) {
      const match = lastBonus.description?.match(/Dia (\d+)/);
      streak = match ? parseInt(match[1]) + 1 : 2;
    }
  }

  const amount = Math.min(10 + (streak - 1) * 5, 50);

  await db.update(users)
    .set({ gcoinsGamification: sql`${users.gcoinsGamification} + ${amount}` })
    .where(eq(users.id, userId));

  await db.insert(gcoinTransactions).values({
    userId,
    type: "gamification",
    category: "daily_bonus",
    amount: amount.toString(),
    description: `Bonus diario - Dia ${streak} (sequencia)`,
  });

  awardXP(userId, "daily_login").catch(() => {});

  return { awarded: true, amount, streak };
}

// ==================== ACHIEVEMENT SYSTEM ====================

/**
 * All achievement definitions for all personas.
 * These get seeded into the achievements table.
 */
export const ACHIEVEMENT_DEFINITIONS = [
  // ===== ATLETA =====
  { id: "athlete_first_match", name: "Primeira Partida", description: "Jogue sua primeira partida", icon: "swords", tier: "bronze" as const, category: "athlete", targetRole: "athlete" as const, requirement: { metric: "match_won+match_lost+match_draw", value: 1 }, xpReward: 50, gcoinReward: 10, sortOrder: 1 },
  { id: "athlete_5_wins", name: "Competidor", description: "Venca 5 partidas", icon: "trophy", tier: "bronze" as const, category: "athlete", targetRole: "athlete" as const, requirement: { metric: "match_won", value: 5 }, xpReward: 100, gcoinReward: 25, sortOrder: 2 },
  { id: "athlete_25_wins", name: "Guerreiro", description: "Venca 25 partidas", icon: "sword", tier: "silver" as const, category: "athlete", targetRole: "athlete" as const, requirement: { metric: "match_won", value: 25 }, xpReward: 250, gcoinReward: 50, sortOrder: 3 },
  { id: "athlete_100_wins", name: "Lendario", description: "Venca 100 partidas", icon: "crown", tier: "gold" as const, category: "athlete", targetRole: "athlete" as const, requirement: { metric: "match_won", value: 100 }, xpReward: 500, gcoinReward: 100, sortOrder: 4 },
  { id: "athlete_first_tournament_win", name: "Campeao", description: "Venca seu primeiro torneio", icon: "medal", tier: "silver" as const, category: "athlete", targetRole: "athlete" as const, requirement: { metric: "tournament_won", value: 1 }, xpReward: 300, gcoinReward: 75, sortOrder: 5 },
  { id: "athlete_5_tournaments_won", name: "Pentacampeao", description: "Venca 5 torneios", icon: "star", tier: "gold" as const, category: "athlete", targetRole: "athlete" as const, requirement: { metric: "tournament_won", value: 5 }, xpReward: 1000, gcoinReward: 200, sortOrder: 6 },
  { id: "athlete_10_enrollments", name: "Atleta Dedicado", description: "Inscricao em 10 torneios", icon: "calendar", tier: "bronze" as const, category: "athlete", targetRole: "athlete" as const, requirement: { metric: "tournament_enrolled", value: 10 }, xpReward: 150, gcoinReward: 30, sortOrder: 7 },
  { id: "athlete_elo_1200", name: "Prata", description: "Atinja rating 1200 (Prata)", icon: "trending-up", tier: "silver" as const, category: "athlete", targetRole: "athlete" as const, requirement: { metric: "elo_rating", value: 1200 }, xpReward: 200, gcoinReward: 50, sortOrder: 8 },
  { id: "athlete_elo_1600", name: "Platina", description: "Atinja rating 1600 (Platina)", icon: "gem", tier: "gold" as const, category: "athlete", targetRole: "athlete" as const, requirement: { metric: "elo_rating", value: 1600 }, xpReward: 500, gcoinReward: 150, sortOrder: 9 },
  { id: "athlete_elo_2000", name: "Mestre", description: "Atinja rating 2000 (Mestre)", icon: "flame", tier: "platinum" as const, category: "athlete", targetRole: "athlete" as const, requirement: { metric: "elo_rating", value: 2000 }, xpReward: 1000, gcoinReward: 300, sortOrder: 10 },

  // ===== ORGANIZADOR =====
  { id: "organizer_first_tournament", name: "Primeiro Evento", description: "Crie seu primeiro torneio", icon: "calendar-plus", tier: "bronze" as const, category: "organizer", targetRole: "organizer" as const, requirement: { metric: "tournament_created", value: 1 }, xpReward: 100, gcoinReward: 25, sortOrder: 1 },
  { id: "organizer_5_tournaments", name: "Promotor", description: "Crie 5 torneios", icon: "calendar-range", tier: "silver" as const, category: "organizer", targetRole: "organizer" as const, requirement: { metric: "tournament_created", value: 5 }, xpReward: 300, gcoinReward: 75, sortOrder: 2 },
  { id: "organizer_20_tournaments", name: "Mega Promotor", description: "Crie 20 torneios", icon: "building", tier: "gold" as const, category: "organizer", targetRole: "organizer" as const, requirement: { metric: "tournament_created", value: 20 }, xpReward: 800, gcoinReward: 200, sortOrder: 3 },
  { id: "organizer_first_completed", name: "Missao Cumprida", description: "Complete seu primeiro torneio", icon: "check-circle", tier: "bronze" as const, category: "organizer", targetRole: "organizer" as const, requirement: { metric: "tournament_completed", value: 1 }, xpReward: 150, gcoinReward: 40, sortOrder: 4 },
  { id: "organizer_10_completed", name: "Organizador Elite", description: "Complete 10 torneios", icon: "award", tier: "gold" as const, category: "organizer", targetRole: "organizer" as const, requirement: { metric: "tournament_completed", value: 10 }, xpReward: 600, gcoinReward: 150, sortOrder: 5 },
  { id: "organizer_first_sponsor", name: "Atraiu Patrocinio", description: "Tenha um patrocinador aprovado", icon: "handshake", tier: "silver" as const, category: "organizer", targetRole: "organizer" as const, requirement: { metric: "sponsorship_approved", value: 1 }, xpReward: 200, gcoinReward: 50, sortOrder: 6 },
  { id: "organizer_32_participants", name: "Torneio Lotado", description: "Tenha 32 inscritos em um torneio", icon: "users", tier: "silver" as const, category: "organizer", targetRole: "organizer" as const, requirement: { metric: "max_participants_reached", value: 1 }, xpReward: 250, gcoinReward: 60, sortOrder: 7 },

  // ===== MARCA / PATROCINADOR =====
  { id: "brand_first_campaign", name: "Primeira Campanha", description: "Crie sua primeira campanha publicitaria", icon: "megaphone", tier: "bronze" as const, category: "brand", targetRole: "brand" as const, requirement: { metric: "campaign_created", value: 1 }, xpReward: 80, gcoinReward: 20, sortOrder: 1 },
  { id: "brand_5_campaigns", name: "Marca Ativa", description: "Crie 5 campanhas", icon: "trending-up", tier: "silver" as const, category: "brand", targetRole: "brand" as const, requirement: { metric: "campaign_created", value: 5 }, xpReward: 250, gcoinReward: 60, sortOrder: 2 },
  { id: "brand_first_sponsorship", name: "Primeiro Patrocinio", description: "Patrocine um torneio", icon: "heart", tier: "bronze" as const, category: "brand", targetRole: "brand" as const, requirement: { metric: "tournament_sponsored", value: 1 }, xpReward: 150, gcoinReward: 40, sortOrder: 3 },
  { id: "brand_5_sponsorships", name: "Grande Patrocinador", description: "Patrocine 5 torneios", icon: "star", tier: "gold" as const, category: "brand", targetRole: "brand" as const, requirement: { metric: "tournament_sponsored", value: 5 }, xpReward: 500, gcoinReward: 150, sortOrder: 4 },
  { id: "brand_1000_impressions", name: "Visibilidade", description: "Alcance 1000 impressoes em campanhas", icon: "eye", tier: "bronze" as const, category: "brand", targetRole: "brand" as const, requirement: { metric: "campaign_1000_impressions", value: 1 }, xpReward: 100, gcoinReward: 25, sortOrder: 5 },
  { id: "brand_10000_impressions", name: "Marca Popular", description: "Alcance 10000 impressoes totais", icon: "zap", tier: "silver" as const, category: "brand", targetRole: "brand" as const, requirement: { metric: "campaign_1000_impressions", value: 10 }, xpReward: 300, gcoinReward: 75, sortOrder: 6 },
  { id: "brand_gcoins_invested", name: "Investidor", description: "Invista 1000 GCoins na plataforma", icon: "coins", tier: "silver" as const, category: "brand", targetRole: "brand" as const, requirement: { metric: "gcoins_purchased", value: 10 }, xpReward: 200, gcoinReward: 50, sortOrder: 7 },

  // ===== ARBITRO =====
  { id: "referee_first_match", name: "Primeiro Apito", description: "Arbitre sua primeira partida", icon: "flag", tier: "bronze" as const, category: "referee", targetRole: "referee" as const, requirement: { metric: "match_refereed", value: 1 }, xpReward: 80, gcoinReward: 20, sortOrder: 1 },
  { id: "referee_10_matches", name: "Arbitro Experiente", description: "Arbitre 10 partidas", icon: "shield", tier: "silver" as const, category: "referee", targetRole: "referee" as const, requirement: { metric: "match_refereed", value: 10 }, xpReward: 300, gcoinReward: 75, sortOrder: 2 },
  { id: "referee_50_matches", name: "Arbitro Oficial", description: "Arbitre 50 partidas", icon: "badge", tier: "gold" as const, category: "referee", targetRole: "referee" as const, requirement: { metric: "match_refereed", value: 50 }, xpReward: 800, gcoinReward: 200, sortOrder: 3 },

  // ===== TREINADOR =====
  { id: "trainer_first_post", name: "Primeiro Treino", description: "Publique sua primeira dica de treino", icon: "dumbbell", tier: "bronze" as const, category: "trainer", targetRole: "trainer" as const, requirement: { metric: "training_post", value: 1 }, xpReward: 50, gcoinReward: 10, sortOrder: 1 },
  { id: "trainer_10_posts", name: "Treinador Ativo", description: "Publique 10 dicas de treino", icon: "activity", tier: "silver" as const, category: "trainer", targetRole: "trainer" as const, requirement: { metric: "training_post", value: 10 }, xpReward: 200, gcoinReward: 50, sortOrder: 2 },
  { id: "trainer_50_followers", name: "Treinador Popular", description: "Tenha 50 seguidores", icon: "users", tier: "gold" as const, category: "trainer", targetRole: "trainer" as const, requirement: { metric: "follow_received", value: 50 }, xpReward: 400, gcoinReward: 100, sortOrder: 3 },

  // ===== NUTRICIONISTA =====
  { id: "nutritionist_first_post", name: "Primeira Receita", description: "Publique sua primeira dica de nutricao", icon: "apple", tier: "bronze" as const, category: "nutritionist", targetRole: "nutritionist" as const, requirement: { metric: "nutrition_post", value: 1 }, xpReward: 50, gcoinReward: 10, sortOrder: 1 },
  { id: "nutritionist_10_posts", name: "Nutricionista Ativo", description: "Publique 10 conteudos de nutricao", icon: "salad", tier: "silver" as const, category: "nutritionist", targetRole: "nutritionist" as const, requirement: { metric: "nutrition_post", value: 10 }, xpReward: 200, gcoinReward: 50, sortOrder: 2 },

  // ===== FOTOGRAFO =====
  { id: "photographer_first_photo", name: "Primeira Foto", description: "Publique sua primeira foto de evento", icon: "camera", tier: "bronze" as const, category: "photographer", targetRole: "photographer" as const, requirement: { metric: "photo_post", value: 1 }, xpReward: 50, gcoinReward: 10, sortOrder: 1 },
  { id: "photographer_10_photos", name: "Fotografo Ativo", description: "Publique 10 fotos de eventos", icon: "image", tier: "silver" as const, category: "photographer", targetRole: "photographer" as const, requirement: { metric: "photo_post", value: 10 }, xpReward: 200, gcoinReward: 50, sortOrder: 2 },
  { id: "photographer_tournament_covered", name: "Cobertura Completa", description: "Cubra um torneio completo com fotos", icon: "film", tier: "gold" as const, category: "photographer", targetRole: "photographer" as const, requirement: { metric: "tournament_covered", value: 1 }, xpReward: 300, gcoinReward: 80, sortOrder: 3 },

  // ===== DONO DE ARENA =====
  { id: "arena_first_arena", name: "Primeira Arena", description: "Cadastre sua primeira arena", icon: "building", tier: "bronze" as const, category: "arena_owner", targetRole: "arena_owner" as const, requirement: { metric: "arena_created", value: 1 }, xpReward: 80, gcoinReward: 20, sortOrder: 1 },
  { id: "arena_tournament_hosted", name: "Sede de Torneio", description: "Seja sede de um torneio", icon: "map-pin", tier: "silver" as const, category: "arena_owner", targetRole: "arena_owner" as const, requirement: { metric: "tournament_hosted", value: 1 }, xpReward: 200, gcoinReward: 50, sortOrder: 2 },

  // ===== PALPITEIRO / BETTOR =====
  { id: "bettor_first_bet", name: "Primeiro Palpite", description: "Faca seu primeiro palpite", icon: "dice", tier: "bronze" as const, category: "bettor", targetRole: "bettor" as const, requirement: { metric: "bet_placed", value: 1 }, xpReward: 30, gcoinReward: 5, sortOrder: 1 },
  { id: "bettor_10_bets", name: "Palpiteiro", description: "Faca 10 palpites", icon: "target", tier: "bronze" as const, category: "bettor", targetRole: "bettor" as const, requirement: { metric: "bet_placed", value: 10 }, xpReward: 100, gcoinReward: 25, sortOrder: 2 },
  { id: "bettor_first_win", name: "Vidente", description: "Acerte seu primeiro palpite", icon: "sparkles", tier: "bronze" as const, category: "bettor", targetRole: "bettor" as const, requirement: { metric: "bet_won", value: 1 }, xpReward: 50, gcoinReward: 15, sortOrder: 3 },
  { id: "bettor_10_wins", name: "Oracle", description: "Acerte 10 palpites", icon: "brain", tier: "silver" as const, category: "bettor", targetRole: "bettor" as const, requirement: { metric: "bet_won", value: 10 }, xpReward: 300, gcoinReward: 75, sortOrder: 4 },
  { id: "bettor_streak_3", name: "Sequencia de Acertos", description: "Acerte 3 palpites seguidos", icon: "flame", tier: "silver" as const, category: "bettor", targetRole: "bettor" as const, requirement: { metric: "bet_streak_3", value: 1 }, xpReward: 200, gcoinReward: 50, sortOrder: 5 },

  // ===== SOCIAL (TODOS) =====
  { id: "social_first_post", name: "Primeira Publicacao", description: "Faca sua primeira publicacao", icon: "edit", tier: "bronze" as const, category: "social", targetRole: null, requirement: { metric: "post_created", value: 1 }, xpReward: 20, gcoinReward: 5, sortOrder: 1 },
  { id: "social_10_posts", name: "Comunicador", description: "Faca 10 publicacoes", icon: "message-circle", tier: "bronze" as const, category: "social", targetRole: null, requirement: { metric: "post_created", value: 10 }, xpReward: 80, gcoinReward: 20, sortOrder: 2 },
  { id: "social_50_posts", name: "Influencer", description: "Faca 50 publicacoes", icon: "radio", tier: "silver" as const, category: "social", targetRole: null, requirement: { metric: "post_created", value: 50 }, xpReward: 250, gcoinReward: 60, sortOrder: 3 },
  { id: "social_first_follower", name: "Primeiro Seguidor", description: "Tenha seu primeiro seguidor", icon: "user-plus", tier: "bronze" as const, category: "social", targetRole: null, requirement: { metric: "follow_received", value: 1 }, xpReward: 30, gcoinReward: 5, sortOrder: 4 },
  { id: "social_50_followers", name: "Popular", description: "Tenha 50 seguidores", icon: "users", tier: "silver" as const, category: "social", targetRole: null, requirement: { metric: "follow_received", value: 50 }, xpReward: 300, gcoinReward: 75, sortOrder: 5 },
  { id: "social_100_followers", name: "Celebridade", description: "Tenha 100 seguidores", icon: "star", tier: "gold" as const, category: "social", targetRole: null, requirement: { metric: "follow_received", value: 100 }, xpReward: 600, gcoinReward: 150, sortOrder: 6 },
  { id: "social_level_10", name: "Nivel 10", description: "Atinja o nivel 10", icon: "zap", tier: "silver" as const, category: "social", targetRole: null, requirement: { metric: "level", value: 10 }, xpReward: 200, gcoinReward: 50, sortOrder: 7 },
  { id: "social_level_25", name: "Nivel 25", description: "Atinja o nivel 25", icon: "flame", tier: "gold" as const, category: "social", targetRole: null, requirement: { metric: "level", value: 25 }, xpReward: 500, gcoinReward: 150, sortOrder: 8 },
  { id: "social_level_50", name: "Nivel 50", description: "Atinja o nivel 50", icon: "crown", tier: "platinum" as const, category: "social", targetRole: null, requirement: { metric: "level", value: 50 }, xpReward: 1500, gcoinReward: 500, sortOrder: 9 },
  { id: "social_first_challenge", name: "Desafiante", description: "Participe de um desafio", icon: "swords", tier: "bronze" as const, category: "social", targetRole: null, requirement: { metric: "challenge_joined", value: 1 }, xpReward: 30, gcoinReward: 10, sortOrder: 10 },
  { id: "social_profile_complete", name: "Perfil Completo", description: "Complete todas as informacoes do perfil", icon: "user-check", tier: "bronze" as const, category: "social", targetRole: null, requirement: { metric: "profile_completed", value: 1 }, xpReward: 50, gcoinReward: 15, sortOrder: 11 },
];

/**
 * All mission definitions for all personas.
 */
export const MISSION_DEFINITIONS = [
  // === DAILY MISSIONS (ALL) ===
  { id: "daily_login", name: "Login Diario", description: "Acesse a plataforma", icon: "log-in", frequency: "daily" as const, targetRole: null, requirement: { action: "daily_login", count: 1 }, xpReward: 10, gcoinReward: 5 },
  { id: "daily_post", name: "Publicar Hoje", description: "Faca uma publicacao", icon: "edit", frequency: "daily" as const, targetRole: null, requirement: { action: "post_created", count: 1 }, xpReward: 15, gcoinReward: 5 },
  { id: "daily_interact", name: "Interagir", description: "Curta ou comente em uma publicacao", icon: "heart", frequency: "daily" as const, targetRole: null, requirement: { action: "like_given+comment_created", count: 1 }, xpReward: 10, gcoinReward: 3 },

  // === DAILY MISSIONS (ATLETA) ===
  { id: "daily_athlete_play", name: "Jogar Partida", description: "Jogue uma partida hoje", icon: "swords", frequency: "daily" as const, targetRole: "athlete" as const, requirement: { action: "match_won+match_lost+match_draw", count: 1 }, xpReward: 30, gcoinReward: 10 },

  // === DAILY MISSIONS (BETTOR) ===
  { id: "daily_bet", name: "Fazer Palpite", description: "Faca um palpite hoje", icon: "dice", frequency: "daily" as const, targetRole: "bettor" as const, requirement: { action: "bet_placed", count: 1 }, xpReward: 15, gcoinReward: 5 },

  // === WEEKLY MISSIONS (ALL) ===
  { id: "weekly_5_posts", name: "Comunicador Semanal", description: "Faca 5 publicacoes esta semana", icon: "message-circle", frequency: "weekly" as const, targetRole: null, requirement: { action: "post_created", count: 5 }, xpReward: 50, gcoinReward: 20 },
  { id: "weekly_10_interactions", name: "Sociavel", description: "Faca 10 interacoes esta semana", icon: "users", frequency: "weekly" as const, targetRole: null, requirement: { action: "like_given+comment_created+follow_given", count: 10 }, xpReward: 40, gcoinReward: 15 },
  { id: "weekly_3_logins", name: "Assiduo", description: "Acesse 3 dias esta semana", icon: "calendar-check", frequency: "weekly" as const, targetRole: null, requirement: { action: "daily_login", count: 3 }, xpReward: 30, gcoinReward: 10 },

  // === WEEKLY MISSIONS (ATLETA) ===
  { id: "weekly_3_matches", name: "Semana de Competicao", description: "Jogue 3 partidas esta semana", icon: "swords", frequency: "weekly" as const, targetRole: "athlete" as const, requirement: { action: "match_won+match_lost+match_draw", count: 3 }, xpReward: 80, gcoinReward: 30 },
  { id: "weekly_win_match", name: "Vitorioso", description: "Venca uma partida esta semana", icon: "trophy", frequency: "weekly" as const, targetRole: "athlete" as const, requirement: { action: "match_won", count: 1 }, xpReward: 50, gcoinReward: 20 },

  // === WEEKLY MISSIONS (ORGANIZADOR) ===
  { id: "weekly_manage_tournament", name: "Gerenciar Torneio", description: "Atualize um placar esta semana", icon: "clipboard", frequency: "weekly" as const, targetRole: "organizer" as const, requirement: { action: "score_updated", count: 1 }, xpReward: 40, gcoinReward: 15 },

  // === WEEKLY MISSIONS (MARCA) ===
  { id: "weekly_brand_activity", name: "Marca Presente", description: "Crie um conteudo ou campanha esta semana", icon: "megaphone", frequency: "weekly" as const, targetRole: "brand" as const, requirement: { action: "campaign_created+post_created", count: 1 }, xpReward: 40, gcoinReward: 15 },

  // === WEEKLY MISSIONS (ARBITRO) ===
  { id: "weekly_referee_match", name: "Arbitrar Partida", description: "Arbitre uma partida esta semana", icon: "flag", frequency: "weekly" as const, targetRole: "referee" as const, requirement: { action: "match_refereed", count: 1 }, xpReward: 50, gcoinReward: 20 },

  // === WEEKLY MISSIONS (BETTOR) ===
  { id: "weekly_5_bets", name: "Palpiteiro da Semana", description: "Faca 5 palpites esta semana", icon: "target", frequency: "weekly" as const, targetRole: "bettor" as const, requirement: { action: "bet_placed", count: 5 }, xpReward: 60, gcoinReward: 25 },
];

/**
 * Check and update achievement progress for a user.
 */
export async function checkAchievements(
  userId: string,
  activity: string
): Promise<void> {
  // Get all active achievements
  const allAchievements = await db.query.achievements.findMany({
    where: eq(achievements.isActive, true),
  });

  // Get user roles to filter relevant achievements
  const roles = await db.query.userRoles.findMany({
    where: eq(userRoles.userId, userId),
  });
  const roleSet = new Set(roles.map(r => r.role));

  for (const achievement of allAchievements) {
    // Check if achievement applies to this user (by role or all)
    if (achievement.targetRole && !roleSet.has(achievement.targetRole)) continue;

    const req = achievement.requirement as { metric: string; value: number };
    if (!req?.metric) continue;

    // Check if activity is relevant to this achievement
    const metrics = req.metric.split("+");
    if (!metrics.some(m => activity.includes(m) || m.includes(activity))) continue;

    // Get or create user achievement
    let ua = await db.query.userAchievements.findFirst({
      where: and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementId, achievement.id)
      ),
    });

    if (ua?.completedAt) continue; // Already completed

    if (!ua) {
      [ua] = await db.insert(userAchievements).values({
        id: crypto.randomUUID(),
        userId,
        achievementId: achievement.id,
        progress: 0,
        completedAt: null,
        createdAt: new Date(),
      }).onConflictDoNothing().returning();

      if (!ua) {
        ua = await db.query.userAchievements.findFirst({
          where: and(
            eq(userAchievements.userId, userId),
            eq(userAchievements.achievementId, achievement.id)
          ),
        });
      }
    }

    if (!ua) continue;

    // Increment progress
    const newProgress = (ua.progress ?? 0) + 1;
    const completed = newProgress >= req.value;

    await db.update(userAchievements)
      .set({
        progress: newProgress,
        ...(completed ? { completedAt: new Date() } : {}),
      })
      .where(eq(userAchievements.id, ua.id));

    // If completed, award rewards
    if (completed) {
      if (achievement.gcoinReward && achievement.gcoinReward > 0) {
        await db.update(users)
          .set({ gcoinsGamification: sql`${users.gcoinsGamification} + ${achievement.gcoinReward}` })
          .where(eq(users.id, userId));

        await db.insert(gcoinTransactions).values({
          userId,
          type: "gamification",
          category: "achievement",
          amount: achievement.gcoinReward.toString(),
          description: `Conquista: ${achievement.name}`,
        });
      }

      // Auto-post achievement
      createAutoPost({
        type: "achievement",
        userId,
        data: { achievementName: achievement.name },
      }).catch(() => {});

      // Notify achievement
      createNotification({
        userId,
        type: "system",
        title: `Conquista Desbloqueada!`,
        message: `Voce desbloqueou "${achievement.name}": ${achievement.description}${achievement.gcoinReward ? ` (+${achievement.gcoinReward} GCoins)` : ""}`,
        data: { achievementId: achievement.id, tier: achievement.tier },
      }).catch(() => {});
    }
  }
}

/**
 * Update mission progress for a user activity.
 */
export async function updateMissionProgress(
  userId: string,
  activity: string
): Promise<void> {
  const now = new Date();

  // Get user's active missions for current period
  const activeMissions = await db.query.userMissions.findMany({
    where: and(
      eq(userMissions.userId, userId),
      lte(userMissions.periodStart, now),
      gte(userMissions.periodEnd, now),
      isNull(userMissions.completedAt)
    ),
    with: { mission: true },
  });

  for (const um of activeMissions) {
    if (!um.mission) continue;
    const req = um.mission.requirement as { action: string; count: number };
    if (!req?.action) continue;

    // Check if activity matches this mission
    const actions = req.action.split("+");
    if (!actions.some(a => activity.includes(a) || a.includes(activity))) continue;

    const newProgress = (um.progress ?? 0) + 1;
    const completed = newProgress >= req.count;

    await db.update(userMissions)
      .set({
        progress: newProgress,
        ...(completed ? { completedAt: new Date() } : {}),
      })
      .where(eq(userMissions.id, um.id));

    // If completed, award rewards
    if (completed && !um.rewardClaimed) {
      await db.update(userMissions)
        .set({ rewardClaimed: true })
        .where(eq(userMissions.id, um.id));

      if (um.mission.gcoinReward && um.mission.gcoinReward > 0) {
        await db.update(users)
          .set({ gcoinsGamification: sql`${users.gcoinsGamification} + ${um.mission.gcoinReward}` })
          .where(eq(users.id, userId));

        await db.insert(gcoinTransactions).values({
          userId,
          type: "gamification",
          category: "daily_bonus",
          amount: um.mission.gcoinReward.toString(),
          description: `Missao concluida: ${um.mission.name}`,
        });
      }

      createNotification({
        userId,
        type: "system",
        title: `Missao Concluida!`,
        message: `Voce completou a missao "${um.mission.name}"${um.mission.gcoinReward ? ` e ganhou ${um.mission.gcoinReward} GCoins!` : "!"}`,
        data: { missionId: um.mission.id },
      }).catch(() => {});
    }
  }
}

/**
 * Initialize daily/weekly missions for a user based on their roles.
 * Called on login or when user requests missions.
 */
export async function initializeMissions(userId: string): Promise<void> {
  const now = new Date();

  // Calculate period boundaries
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 86400000 - 1);

  // Monday of current week
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(todayStart.getTime() + mondayOffset * 86400000);
  const weekEnd = new Date(weekStart.getTime() + 7 * 86400000 - 1);

  // Get user roles
  const roles = await db.query.userRoles.findMany({
    where: eq(userRoles.userId, userId),
  });
  const roleSet = new Set(roles.map(r => r.role));

  // Get all missions
  const allMissions = await db.query.missions.findMany({
    where: eq(missions.isActive, true),
  });

  for (const mission of allMissions) {
    // Check if mission applies to this user
    if (mission.targetRole && !roleSet.has(mission.targetRole)) continue;

    const periodStart = mission.frequency === "daily" ? todayStart : weekStart;
    const periodEnd = mission.frequency === "daily" ? todayEnd : weekEnd;

    // Check if already initialized for this period
    const existing = await db.query.userMissions.findFirst({
      where: and(
        eq(userMissions.userId, userId),
        eq(userMissions.missionId, mission.id),
        eq(userMissions.periodStart, periodStart)
      ),
    });

    if (!existing) {
      await db.insert(userMissions).values({
        id: crypto.randomUUID(),
        userId,
        missionId: mission.id,
        progress: 0,
        completedAt: null,
        periodStart,
        periodEnd,
        rewardClaimed: false,
        createdAt: new Date(),
      }).onConflictDoNothing();
    }
  }
}

// ==================== TOURNAMENT COMPLETION ====================

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
