// Notifications handler
import type { IncomingMessage } from "../types";
import { sessionManager } from "../services/session-manager";
import { whatsapp } from "../services/whatsapp-client";
import { menus } from "../services/menu-builder";
import { db } from "@/server/db";
import { notifications } from "@/server/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { format } from "date-fns";

export async function handleNotifications(
  phone: string,
  _message: IncomingMessage,
  action: string
): Promise<void> {
  const session = sessionManager.getSession(phone);
  const userId = session.userId!;

  // Show notifications
  if (action === "show_notifications" || action === "notifications_list") {
    const userNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: [desc(notifications.createdAt)],
      limit: 10,
    });

    const formatted = userNotifications.map((n) => ({
      title: n.title,
      message: n.message ?? undefined,
      type: n.type,
      createdAt: format(new Date(n.createdAt), "dd/MM HH:mm"),
    }));

    await whatsapp.sendMessage(phone, menus.notificationsList(formatted));
    return;
  }

  // Mark all as read
  if (action === "notifications_mark_read") {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

    await whatsapp.sendButtons(phone, "Todas as notificacoes marcadas como lidas!", [
      { id: "menu_main", title: "Menu principal" },
    ]);
    return;
  }

  // Default
  await handleNotifications(phone, _message, "show_notifications");
}
