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
    title: "Inscrição confirmada",
    message: `Você se inscreveu no torneio "${tournamentName}"`,
    data: { tournamentId },
  });
}

export async function notifyTournamentStart(userIds: string[], tournamentName: string, tournamentId: string) {
  return createBulkNotifications(userIds, {
    type: "tournament",
    title: "Torneio começou!",
    message: `O torneio "${tournamentName}" está em andamento`,
    data: { tournamentId },
  });
}

export async function notifyBetResult(userId: string, won: boolean, amount: number, betId: string) {
  return createNotification({
    userId,
    type: "bet",
    title: won ? "Palpite ganho!" : "Palpite não acertou",
    message: won
      ? `Você ganhou ${amount} GCoins no seu palpite!`
      : "Não foi dessa vez. Tente novamente!",
    data: { betId, won, amount },
  });
}

export async function notifyNewFollower(userId: string, followerName: string, followerId: string) {
  return createNotification({
    userId,
    type: "social",
    title: "Novo seguidor",
    message: `${followerName} começou a seguir você`,
    data: { followerId },
  });
}

export async function notifyComment(userId: string, commenterName: string, postId: string) {
  return createNotification({
    userId,
    type: "social",
    title: "Novo comentário",
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
    message: `Você recebeu ${amount} GCoins de ${fromName}`,
    data: { amount },
  });
}

export async function notifyChallengeComplete(userId: string, challengeTitle: string, reward: number) {
  return createNotification({
    userId,
    type: "challenge",
    title: "Desafio completo!",
    message: `Você completou o desafio "${challengeTitle}" e ganhou ${reward} GCoins`,
    data: { challengeTitle, reward },
  });
}

export async function notifyChallengeDuel(userId: string, challengerName: string, challengeTitle: string, challengeId: string, wager?: number) {
  return createNotification({
    userId,
    type: "challenge",
    title: "Desafio 1v1 recebido!",
    message: `${challengerName} te desafiou: "${challengeTitle}"${wager ? ` (aposta: ${wager} GCoins)` : ""}`,
    data: { challengeId, challengerName, wager },
  });
}

export async function notifyChallengeBettingOpen(userIds: string[], challengeTitle: string, challengeId: string) {
  return createBulkNotifications(userIds, {
    type: "challenge",
    title: "Apostas abertas!",
    message: `As apostas estão abertas para o desafio "${challengeTitle}". Faça seu palpite!`,
    data: { challengeId },
  });
}

export async function notifyChallengeWinner(
  userId: string,
  challengeTitle: string,
  placement: number,
  reward: number,
  challengeId: string
) {
  const placementLabels: Record<number, string> = {
    1: "1º lugar",
    2: "2º lugar",
    3: "3º lugar",
  };
  const label = placementLabels[placement] ?? `${placement}º lugar`;
  return createNotification({
    userId,
    type: "challenge",
    title: `${label} no desafio!`,
    message: `Parabéns! Você ficou em ${label} no desafio "${challengeTitle}" e ganhou ${reward} GCoins`,
    data: { challengeId, challengeTitle, placement, reward },
  });
}

export async function notifyChallengeEnded(
  userIds: string[],
  challengeTitle: string,
  challengeId: string
) {
  return createBulkNotifications(userIds, {
    type: "challenge",
    title: "Desafio encerrado",
    message: `O desafio "${challengeTitle}" foi encerrado. Confira os resultados!`,
    data: { challengeId, challengeTitle },
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

// ==================== Brand/Sponsorship notifications ====================

export async function notifyBrandReward(userId: string, brandName: string, amount: number, campaignId: string) {
  return createNotification({
    userId,
    type: "gcoin",
    title: "Recompensa de marca",
    message: `Você ganhou ${amount} GCoins da marca "${brandName}"`,
    data: { campaignId, amount, brandName },
  });
}

export async function notifyProductRedeemed(userId: string, brandName: string, productName: string, campaignId: string) {
  return createNotification({
    userId,
    type: "system",
    title: "Produto resgatado",
    message: `Você resgatou "${productName}" da marca "${brandName}". A marca entrará em contato para entrega.`,
    data: { campaignId, productName, brandName },
  });
}

export async function notifyNewSponsor(organizerId: string, brandName: string, tournamentName: string, tier: string, tournamentId: string) {
  return createNotification({
    userId: organizerId,
    type: "tournament",
    title: "Novo patrocinador!",
    message: `A marca "${brandName}" quer patrocinar o torneio "${tournamentName}" como ${tier === "main" ? "Principal" : tier === "gold" ? "Ouro" : tier === "silver" ? "Prata" : "Bronze"}`,
    data: { tournamentId, brandName, tier },
  });
}

export async function notifySponsorshipApproved(brandUserId: string, tournamentName: string, tournamentId: string) {
  return createNotification({
    userId: brandUserId,
    type: "tournament",
    title: "Patrocínio aprovado!",
    message: `Seu patrocínio do torneio "${tournamentName}" foi aprovado. Sua marca já está visível!`,
    data: { tournamentId },
  });
}

// ==================== Invite notifications ====================

export async function notifyTournamentInviteAthlete(userId: string, organizerName: string, tournamentName: string, tournamentId: string, inviteId: string) {
  return createNotification({
    userId,
    type: "tournament",
    title: "Convite para torneio!",
    message: `${organizerName} convidou você para participar do torneio "${tournamentName}"`,
    data: { tournamentId, inviteId, inviteType: "athlete" },
  });
}

export async function notifyTournamentInviteSponsor(userId: string, organizerName: string, tournamentName: string, tournamentId: string, inviteId: string, tier?: string) {
  const tierLabel = tier === "main" ? "Principal" : tier === "gold" ? "Ouro" : tier === "silver" ? "Prata" : tier === "bronze" ? "Bronze" : "";
  return createNotification({
    userId,
    type: "tournament",
    title: "Convite para patrocinar!",
    message: `${organizerName} convidou sua marca para patrocinar o torneio "${tournamentName}"${tierLabel ? ` como ${tierLabel}` : ""}`,
    data: { tournamentId, inviteId, inviteType: "sponsor", tier },
  });
}

export async function notifyInviteAccepted(organizerId: string, userName: string, tournamentName: string, tournamentId: string, inviteType: string) {
  return createNotification({
    userId: organizerId,
    type: "tournament",
    title: inviteType === "athlete" ? "Convite aceito!" : "Patrocínio aceito!",
    message: inviteType === "athlete"
      ? `${userName} aceitou o convite e se inscreveu no torneio "${tournamentName}"`
      : `${userName} aceitou patrocinar o torneio "${tournamentName}"`,
    data: { tournamentId, inviteType },
  });
}

export async function notifyInviteDeclined(organizerId: string, userName: string, tournamentName: string, tournamentId: string, inviteType: string) {
  return createNotification({
    userId: organizerId,
    type: "tournament",
    title: "Convite recusado",
    message: inviteType === "athlete"
      ? `${userName} recusou o convite para o torneio "${tournamentName}"`
      : `${userName} recusou patrocinar o torneio "${tournamentName}"`,
    data: { tournamentId, inviteType },
  });
}

export async function notifyPrizeAwarded(userId: string, tournamentName: string, placement: number, prizeDescription: string, tournamentId: string) {
  const placementLabels: Record<number, string> = { 1: "Campeão", 2: "Vice-campeão", 3: "Terceiro lugar" };
  const label = placementLabels[placement] ?? `${placement}º lugar`;
  return createNotification({
    userId,
    type: "tournament",
    title: `${label}!`,
    message: `Parabéns! Você ficou em ${label} no torneio "${tournamentName}" e ganhou: ${prizeDescription}`,
    data: { tournamentId, placement, prizeDescription },
  });
}
