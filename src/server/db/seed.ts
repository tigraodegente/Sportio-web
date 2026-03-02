import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Achievement definitions for all 10 personas
const ACHIEVEMENT_DEFINITIONS = [
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

// Mission definitions for all personas (daily + weekly)
const MISSION_DEFINITIONS = [
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

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const sql = neon(connectionString);
  const db = drizzle(sql, { schema });

  console.log("[INFO] Seeding database...\n");

  // Seed Sports
  console.log("[INFO] Inserting sports...");
  const sportsData = [
    // Traditional Sports
    { name: "Futebol", slug: "futebol", icon: "Goal", color: "#22c55e", description: "O esporte mais popular do Brasil. Participe de peladas, campeonatos e muito mais." },
    { name: "Beach Tennis", slug: "beach-tennis", icon: "Sun", color: "#f59e0b", description: "O esporte que mais cresce no Brasil. Encontre parceiros e torneios na areia." },
    { name: "Padel", slug: "padel", icon: "Racquet", color: "#3b82f6", description: "Esporte de raquete em quadra fechada com paredes de vidro." },
    { name: "Volei", slug: "volei", icon: "Circle", color: "#ef4444", description: "Volei de quadra. Monte seu time e participe de torneios." },
    { name: "Volei de Praia", slug: "volei-de-praia", icon: "Waves", color: "#f97316", description: "Volei jogado na areia. Duplas competitivas e recreativas." },
    { name: "Basquete", slug: "basquete", icon: "Target", color: "#f97316", description: "Basquete 5x5 e 3x3. Das quadras de rua aos ginasios." },
    { name: "Tenis", slug: "tenis", icon: "Trophy", color: "#84cc16", description: "Tenis de quadra. Singles ou duplas, encontre adversarios do seu nivel." },
    { name: "Futsal", slug: "futsal", icon: "Goal", color: "#06b6d4", description: "Futebol de salao. Velocidade e tecnica em quadra reduzida." },
    { name: "Handebol", slug: "handebol", icon: "Hand", color: "#8b5cf6", description: "Handebol de quadra. Forca, velocidade e estrategia em equipe." },
    { name: "Natacao", slug: "natacao", icon: "Waves", color: "#0ea5e9", description: "Natacao em piscina. Melhore seus tempos e participe de competicoes." },
    { name: "Corrida", slug: "corrida", icon: "Timer", color: "#ec4899", description: "Corrida de rua e trail. Acompanhe seus tempos e evolua constantemente." },
    { name: "Ciclismo", slug: "ciclismo", icon: "Bike", color: "#14b8a6", description: "Ciclismo de estrada e mountain bike. Rotas, pedais em grupo e competicoes." },
    { name: "Jiu-Jitsu", slug: "jiu-jitsu", icon: "Swords", color: "#1e293b", description: "Jiu-Jitsu Brasileiro (BJJ). A arte suave nas academias e competicoes." },
    { name: "Muay Thai", slug: "muay-thai", icon: "Swords", color: "#dc2626", description: "Arte marcial tailandesa. Treinos, lutas e evolucao constante." },
    { name: "CrossFit", slug: "crossfit", icon: "Dumbbell", color: "#7c3aed", description: "Treinamento funcional de alta intensidade. Desafie seus limites." },
    { name: "Surf", slug: "surf", icon: "Waves", color: "#0891b2", description: "Surf e bodyboard. Conecte-se com a comunidade das ondas." },
    { name: "Skate", slug: "skate", icon: "Zap", color: "#a3a3a3", description: "Skate street e park. Mostre suas manobras e conecte-se com a cena." },
    { name: "Tenis de Mesa", slug: "tenis-de-mesa", icon: "Racquet", color: "#e11d48", description: "Pingue-pongue competitivo. Reflexo e precisao na mesa." },
    { name: "Badminton", slug: "badminton", icon: "Racquet", color: "#16a34a", description: "Badminton indoor. Velocidade e agilidade com a peteca." },
    { name: "Rugby", slug: "rugby", icon: "Swords", color: "#92400e", description: "Rugby sevens e XV. Forca, uniao e espirito de equipe." },

    // Games / E-Sports
    { name: "League of Legends", slug: "league-of-legends", icon: "Gamepad2", color: "#1e40af", description: "O MOBA mais jogado do mundo. Monte seu time e domine o Rift." },
    { name: "Counter-Strike", slug: "counter-strike", icon: "Gamepad2", color: "#ea580c", description: "O FPS tatico mais competitivo. Estrategia e mira precisa." },
    { name: "Valorant", slug: "valorant", icon: "Gamepad2", color: "#dc2626", description: "FPS tatico com agentes unicos. Habilidade e trabalho em equipe." },
    { name: "Fortnite", slug: "fortnite", icon: "Gamepad2", color: "#7c3aed", description: "Battle Royale com construcao. Criatividade e sobrevivencia." },
    { name: "FIFA / EA FC", slug: "fifa-ea-fc", icon: "Gamepad2", color: "#16a34a", description: "O simulador de futebol mais popular. Torneios online e presenciais." },
    { name: "Free Fire", slug: "free-fire", icon: "Gamepad2", color: "#f59e0b", description: "Battle Royale mobile. Competicoes acessiveis para todos." },
    { name: "Dota 2", slug: "dota-2", icon: "Gamepad2", color: "#b91c1c", description: "MOBA de estrategia profunda. Torneios com as maiores premiacoes do mundo." },
    { name: "Rocket League", slug: "rocket-league", icon: "Gamepad2", color: "#2563eb", description: "Futebol com carros. Acrobacias aereas e gols espetaculares." },

    // Card / Table Games
    { name: "Truco", slug: "truco", icon: "Spade", color: "#dc2626", description: "O jogo de cartas mais brasileiro. Blefe, estrategia e muita diversao." },
    { name: "Poker", slug: "poker", icon: "Spade", color: "#059669", description: "O jogo de cartas mais famoso do mundo. Torneios e cash games." },
    { name: "Xadrez", slug: "xadrez", icon: "Crown", color: "#1e293b", description: "O jogo de estrategia milenar. Desafie sua mente em cada partida." },
    { name: "Damas", slug: "damas", icon: "Grid", color: "#78350f", description: "Jogo de tabuleiro classico. Estrategia e raciocinio logico." },
    { name: "Sinuca/Bilhar", slug: "sinuca-bilhar", icon: "Circle", color: "#166534", description: "Precisao e tecnica no pano verde. Torneios e partidas casuais." },
    { name: "Domino", slug: "domino", icon: "Dice", color: "#4b5563", description: "Jogo de mesa tradicional. Estrategia com pecas numeradas." },
    { name: "Buraco", slug: "buraco", icon: "Spade", color: "#7c3aed", description: "Jogo de cartas em duplas. Canastras e estrategia com seu parceiro." },
    { name: "Uno", slug: "uno", icon: "Palette", color: "#dc2626", description: "O jogo de cartas colorido mais divertido. Competicoes e diversao garantida." },

    // Additional Sports
    { name: "Futevolei", slug: "futevolei", icon: "Flame", color: "#ea580c", description: "A mistura perfeita de futebol e volei. Habilidade e estilo na rede." },
    { name: "Golfe", slug: "golfe", icon: "Flag", color: "#16a34a", description: "Precisao e elegancia nos campos. Torneios e rodadas entre amigos." },
    { name: "Atletismo", slug: "atletismo", icon: "Timer", color: "#dc2626", description: "Provas de pista e campo. Velocidade, resistencia e forca." },
    { name: "Boxe", slug: "boxe", icon: "Swords", color: "#b91c1c", description: "A nobre arte. Treinos, lutas e superacao no ringue." },
    { name: "Escalada", slug: "escalada", icon: "Mountain", color: "#78350f", description: "Escalada indoor e outdoor. Supere obstaculos e alcance o topo." },
    { name: "Remo", slug: "remo", icon: "Waves", color: "#1e40af", description: "Esporte aquatico de forca e sincronia. Competicoes e treinos em equipe." },
    { name: "Polo Aquatico", slug: "polo-aquatico", icon: "Waves", color: "#0284c7", description: "Esporte aquatico de equipe. Natacao, forca e estrategia na piscina." },
  ];

  await db.insert(schema.sports).values(sportsData).onConflictDoNothing();
  console.log(`  [OK] ${sportsData.length} sports inserted\n`);

  // Seed Achievements (55+ for all 10 personas)
  console.log("[INFO] Inserting achievements...");
  for (const def of ACHIEVEMENT_DEFINITIONS) {
    await db.insert(schema.achievements).values({
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
    }).onConflictDoNothing();
  }
  console.log(`  [OK] ${ACHIEVEMENT_DEFINITIONS.length} achievements inserted\n`);

  // Seed Missions (16+ daily/weekly for all personas)
  console.log("[INFO] Inserting missions...");
  for (const def of MISSION_DEFINITIONS) {
    await db.insert(schema.missions).values({
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
    }).onConflictDoNothing();
  }
  console.log(`  [OK] ${MISSION_DEFINITIONS.length} missions inserted\n`);

  console.log("[OK] Seed completed successfully!");
  console.log("  - 43 sports");
  console.log(`  - ${ACHIEVEMENT_DEFINITIONS.length} achievements (all personas)`);
  console.log(`  - ${MISSION_DEFINITIONS.length} missions (daily + weekly)`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[ERROR] Seed failed:", error);
    process.exit(1);
  });
