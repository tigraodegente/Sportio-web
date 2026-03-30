// WhatsApp Notification Sender
// Proactively sends notifications to users via WhatsApp
import { whatsapp } from "./whatsapp-client";
import { db } from "@/server/db";
import { notifications, users } from "@/server/db/schema";
import { eq, and, desc } from "drizzle-orm";

const typeEmoji: Record<string, string> = {
  tournament: "[Torneio]",
  match: "[Jogo]",
  gcoin: "[GCoin]",
  social: "[Social]",
  bet: "[Aposta]",
  chat: "[Chat]",
  system: "[Sistema]",
  challenge: "[Desafio]",
};

/**
 * Send pending notifications to users via WhatsApp.
 * Call this on a schedule (e.g., every minute via cron/setInterval).
 */
export async function sendPendingNotifications(): Promise<number> {
  // Get unread notifications for users who have phone numbers
  const pendingNotifications = await db
    .select({
      notificationId: notifications.id,
      userId: notifications.userId,
      type: notifications.type,
      title: notifications.title,
      message: notifications.message,
      phone: users.phone,
    })
    .from(notifications)
    .innerJoin(users, eq(notifications.userId, users.id))
    .where(and(eq(notifications.isRead, false), eq(notifications.whatsappSent, false)))
    .orderBy(desc(notifications.createdAt))
    .limit(50);

  let sent = 0;

  for (const n of pendingNotifications) {
    if (!n.phone) continue;

    try {
      const emoji = typeEmoji[n.type] ?? "";
      let text = `${emoji} *${n.title}*`;
      if (n.message) text += `\n${n.message}`;

      await whatsapp.sendText(n.phone, text);

      // Mark as sent
      await db
        .update(notifications)
        .set({ whatsappSent: true })
        .where(eq(notifications.id, n.notificationId));

      sent++;
    } catch (error) {
      console.error(`[NotificationSender] Failed to send to ${n.phone}:`, error);
    }
  }

  return sent;
}

/**
 * Send a direct notification to a specific user via WhatsApp
 */
export async function sendWhatsAppNotification(
  userId: string,
  title: string,
  message?: string,
  type: string = "system"
): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { phone: true },
  });

  if (!user?.phone) return false;

  try {
    const emoji = typeEmoji[type] ?? "";
    let text = `${emoji} *${title}*`;
    if (message) text += `\n${message}`;

    await whatsapp.sendText(user.phone, text);
    return true;
  } catch (error) {
    console.error(`[NotificationSender] Direct send failed:`, error);
    return false;
  }
}

/**
 * Broadcast a message to all users with phone numbers
 */
export async function broadcastMessage(
  text: string,
  filter?: { city?: string; role?: string }
): Promise<number> {
  let query = db
    .select({ phone: users.phone })
    .from(users);

  // Note: filtering would need joins for roles/city
  const allUsers = await query;
  let sent = 0;

  for (const u of allUsers) {
    if (!u.phone) continue;

    try {
      await whatsapp.sendText(u.phone, text);
      sent++;

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`[Broadcast] Failed to send to ${u.phone}:`, error);
    }
  }

  return sent;
}

/**
 * Send bet result notification
 */
export async function notifyBetResult(
  userId: string,
  won: boolean,
  amount: number,
  matchDescription: string
): Promise<void> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { phone: true, name: true },
  });

  if (!user?.phone) return;

  if (won) {
    await whatsapp.sendButtons(user.phone, `[Aposta] PARABENS, ${user.name}!\n\nVoce GANHOU sua aposta!\n${matchDescription}\n\n+${amount.toFixed(0)} GCoins creditados!`, [
      { id: "bets_mine", title: "Minhas apostas" },
      { id: "menu_main", title: "Menu principal" },
    ]);
  } else {
    await whatsapp.sendButtons(user.phone, `[Aposta] ${user.name}, sua aposta em:\n${matchDescription}\n\nInfelizmente nao foi dessa vez. Tente novamente!`, [
      { id: "bets_open", title: "Novas apostas" },
      { id: "menu_main", title: "Menu principal" },
    ]);
  }
}

/**
 * Send tournament reminder
 */
export async function notifyTournamentReminder(
  userId: string,
  tournamentName: string,
  dateStr: string,
  location?: string
): Promise<void> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { phone: true },
  });

  if (!user?.phone) return;

  let text = `[Torneio] LEMBRETE!\n\n*${tournamentName}*\nData: ${dateStr}`;
  if (location) text += `\nLocal: ${location}`;
  text += "\n\nBoa sorte!";

  await whatsapp.sendText(user.phone, text);
}
