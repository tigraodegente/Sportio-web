import { db } from "@/server/db";
import { posts } from "@/server/db/schema";

type FeedEventType =
  | "tournament_enrolled"
  | "tournament_created"
  | "match_won"
  | "match_lost"
  | "tournament_won"
  | "challenge_joined"
  | "challenge_completed"
  | "challenge_created"
  | "challenge_won"
  | "bet_won"
  | "bet_lost"
  | "level_up"
  | "follow"
  | "achievement";

interface FeedEvent {
  type: FeedEventType;
  userId: string;
  data: Record<string, unknown>;
  sportId?: string;
  tournamentId?: string;
}

// Template messages for each event type (in Portuguese)
const templates: Record<FeedEventType, (data: Record<string, unknown>) => string> = {
  tournament_enrolled: (d) =>
    `Se inscreveu no torneio "${d.tournamentName}"! Hora de competir.`,
  tournament_created: (d) =>
    `Criou o torneio "${d.tournamentName}". Inscrições abertas!`,
  match_won: (d) =>
    `Venceu a partida contra ${d.opponentName} por ${d.score}! Avançando no torneio "${d.tournamentName}".`,
  match_lost: (d) =>
    `Perdeu a partida contra ${d.opponentName} por ${d.score}. A jornada continua!`,
  tournament_won: (d) =>
    `Campeão do torneio "${d.tournamentName}"! Conquista incrível.`,
  challenge_joined: (d) =>
    `Aceitou o desafio "${d.challengeTitle}". Bora!`,
  challenge_completed: (d) =>
    `Completou o desafio "${d.challengeTitle}"${d.opponentName ? ` contra ${d.opponentName}` : ""}${d.score ? ` (${d.score})` : ""}. Recompensa conquistada!`,
  challenge_created: (d) =>
    `Desafiou ${d.opponentName} para um duelo: "${d.challengeTitle}"!`,
  challenge_won: (d) =>
    `Venceu o desafio "${d.challengeTitle}" contra ${d.opponentName}${d.score ? ` por ${d.score}` : ""}!`,
  bet_won: (d) =>
    `Acertou o palpite e ganhou ${d.amount} GCoins!`,
  bet_lost: () =>
    `Não acertou o palpite dessa vez. Mais sorte na próxima!`,
  level_up: (d) =>
    `Subiu para o nível ${d.level}! Evoluindo cada vez mais.`,
  follow: (d) =>
    `Começou a seguir ${d.targetName}.`,
  achievement: (d) =>
    `Desbloqueou a conquista "${d.achievementName}".`,
};

export async function createAutoPost(event: FeedEvent): Promise<void> {
  const template = templates[event.type];
  if (!template) return;

  const content = template(event.data);

  await db.insert(posts).values({
    userId: event.userId,
    content,
    sportId: event.sportId ?? null,
    tournamentId: event.tournamentId ?? null,
    isPublished: true,
  });
}
