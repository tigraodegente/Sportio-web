import { db } from "@/server/db";
import { notifications } from "@/server/db/schema";

type NotificationType =
  | "tournament"
  | "match"
  | "gcoin"
  | "social"
  | "bet"
  | "chat"
  | "system"
  | "challenge";

interface NotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message?: string;
  data?: Record<string, unknown>;
}

/**
 * Create a notification for a user.
 * This is the central function used by all services to create notifications.
 */
export async function createNotification(input: NotificationInput): Promise<void> {
  await db.insert(notifications).values({
    userId: input.userId,
    type: input.type,
    title: input.title,
    message: input.message,
    data: input.data,
  });
}

/**
 * Create notifications for multiple users at once.
 */
export async function createBulkNotifications(
  userIds: string[],
  notification: Omit<NotificationInput, "userId">
): Promise<void> {
  if (userIds.length === 0) return;

  const values = userIds.map((userId) => ({
    userId,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    data: notification.data,
  }));

  await db.insert(notifications).values(values);
}

// ==================== Event-specific notification helpers ====================

export async function notifyTournamentEnrollment(userId: string, tournamentName: string, tournamentId: string) {
  return createNotification({
    userId,
    type: "tournament",
    title: "Inscricao confirmada",
    message: `Voce se inscreveu no torneio "${tournamentName}"`,
    data: { tournamentId },
  });
}

export async function notifyTournamentStart(userIds: string[], tournamentName: string, tournamentId: string) {
  return createBulkNotifications(userIds, {
    type: "tournament",
    title: "Torneio comecou!",
    message: `O torneio "${tournamentName}" esta em andamento`,
    data: { tournamentId },
  });
}

export async function notifyBetResult(userId: string, won: boolean, amount: number, betId: string) {
  return createNotification({
    userId,
    type: "bet",
    title: won ? "Palpite ganho!" : "Palpite nao acertou",
    message: won
      ? `Voce ganhou ${amount} GCoins no seu palpite!`
      : "Nao foi dessa vez. Tente novamente!",
    data: { betId, won, amount },
  });
}

export async function notifyNewFollower(userId: string, followerName: string, followerId: string) {
  return createNotification({
    userId,
    type: "social",
    title: "Novo seguidor",
    message: `${followerName} comecou a seguir voce`,
    data: { followerId },
  });
}

export async function notifyComment(userId: string, commenterName: string, postId: string) {
  return createNotification({
    userId,
    type: "social",
    title: "Novo comentario",
    message: `${commenterName} comentou no seu post`,
    data: { postId },
  });
}

export async function notifyLike(userId: string, likerName: string, postId: string) {
  return createNotification({
    userId,
    type: "social",
    title: "Nova curtida",
    message: `${likerName} curtiu seu post`,
    data: { postId },
  });
}

export async function notifyGcoinReceived(userId: string, amount: number, fromName: string) {
  return createNotification({
    userId,
    type: "gcoin",
    title: "GCoins recebidos",
    message: `Voce recebeu ${amount} GCoins de ${fromName}`,
    data: { amount },
  });
}

export async function notifyChallengeComplete(userId: string, challengeTitle: string, reward: number) {
  return createNotification({
    userId,
    type: "challenge",
    title: "Desafio completo!",
    message: `Voce completou o desafio "${challengeTitle}" e ganhou ${reward} GCoins`,
    data: { challengeTitle, reward },
  });
}

export async function notifyChatMessage(userId: string, senderName: string, roomId: string) {
  return createNotification({
    userId,
    type: "chat",
    title: "Nova mensagem",
    message: `${senderName} enviou uma mensagem`,
    data: { roomId },
  });
}
