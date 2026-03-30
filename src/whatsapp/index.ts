// Sportio WhatsApp Bot - Main Entry Point
// This module exports everything needed to run the WhatsApp bot

export { whatsappConfig } from "./config";
export { routeMessage } from "./router";
export { handleWebhook, verifyCloudAPIWebhook } from "./webhook";
export { whatsapp } from "./services/whatsapp-client";
export { sessionManager } from "./services/session-manager";
export { menus } from "./services/menu-builder";
export { generatePixPayload } from "./services/pix-generator";
export {
  sendPendingNotifications,
  sendWhatsAppNotification,
  broadcastMessage,
  notifyBetResult,
  notifyTournamentReminder,
} from "./services/notification-sender";
export {
  createTournamentGroup,
  addToTournamentGroup,
  sendTournamentUpdate,
  notifyMatchResult,
} from "./services/community-manager";

export type { IncomingMessage, OutgoingMessage, UserSession } from "./types";
