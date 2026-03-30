// Main message router - processes incoming WhatsApp messages
import type { IncomingMessage } from "./types";
import { sessionManager } from "./services/session-manager";
import { whatsapp } from "./services/whatsapp-client";
import { menus } from "./services/menu-builder";
import { handleOnboarding } from "./handlers/onboarding";
import { handleTournaments } from "./handlers/tournaments";
import { handleBetting } from "./handlers/betting";
import { handleChallenges } from "./handlers/challenges";
import { handleSocial } from "./handlers/social";
import { handleGCoins } from "./handlers/gcoins";
import { handleProfile } from "./handlers/profile";
import { handleLeaderboard } from "./handlers/leaderboard";
import { handleNotifications } from "./handlers/notifications";
import { handleAIChat } from "./handlers/ai-chat";

export async function routeMessage(message: IncomingMessage): Promise<void> {
  const { from, text } = message;
  const session = sessionManager.getSession(from);

  try {
    // Extract the action from interactive responses or text
    const action = extractAction(message);

    // ==================== GLOBAL COMMANDS (work from any state) ====================
    const lowerText = action.toLowerCase().trim();

    if (["menu", "inicio", "voltar", "menu_main"].includes(lowerText)) {
      if (!session.userId) {
        const user = await sessionManager.findUserByPhone(from);
        if (user) {
          sessionManager.setUserId(from, user.id);
        } else {
          sessionManager.setState(from, "onboarding");
          await whatsapp.sendMessage(from, menus.welcome());
          return;
        }
      }
      sessionManager.resetToMenu(from);
      await whatsapp.sendMessage(from, menus.mainMenu());
      return;
    }

    if (["ajuda", "help", "menu_help"].includes(lowerText)) {
      await whatsapp.sendMessage(from, menus.helpMessage());
      return;
    }

    // Quick text commands
    if (["torneios", "torneio"].includes(lowerText)) {
      return handleMenuSelection(from, "menu_tournaments");
    }
    if (["apostas", "aposta", "apostar"].includes(lowerText)) {
      return handleMenuSelection(from, "menu_bets");
    }
    if (["desafio", "desafiar", "desafios"].includes(lowerText)) {
      return handleMenuSelection(from, "menu_challenges");
    }
    if (["saldo", "gcoins", "gcoin"].includes(lowerText)) {
      return handleMenuSelection(from, "menu_gcoins");
    }
    if (["perfil", "profile"].includes(lowerText)) {
      return handleMenuSelection(from, "menu_profile");
    }
    if (["ranking", "leaderboard"].includes(lowerText)) {
      return handleMenuSelection(from, "menu_leaderboard");
    }
    if (["feed", "social", "posts"].includes(lowerText)) {
      return handleMenuSelection(from, "menu_social");
    }
    if (["notificacoes", "notificacao"].includes(lowerText)) {
      return handleMenuSelection(from, "menu_notifications");
    }

    // ==================== STATE-BASED ROUTING ====================

    // New user - needs onboarding
    if (session.state === "idle") {
      const user = await sessionManager.findUserByPhone(from);
      if (user) {
        sessionManager.setUserId(from, user.id);
        sessionManager.setState(from, "main_menu");
        await whatsapp.sendText(from, `Ola, ${user.name}! Que bom te ver de volta!`);
        await whatsapp.sendMessage(from, menus.mainMenu());
        return;
      }
      // New user
      sessionManager.setState(from, "onboarding");
      await whatsapp.sendMessage(from, menus.welcome());
      return;
    }

    // Onboarding flow
    if (session.state.startsWith("onboarding")) {
      return handleOnboarding(from, message, action);
    }

    // Menu selection
    if (session.state === "main_menu" && action.startsWith("menu_")) {
      return handleMenuSelection(from, action);
    }

    // Feature-specific routing
    if (session.state.startsWith("tournament")) {
      return handleTournaments(from, message, action);
    }
    if (session.state.startsWith("bet")) {
      return handleBetting(from, message, action);
    }
    if (session.state.startsWith("challenge")) {
      return handleChallenges(from, message, action);
    }
    if (session.state.startsWith("social")) {
      return handleSocial(from, message, action);
    }
    if (session.state.startsWith("gcoin")) {
      return handleGCoins(from, message, action);
    }
    if (session.state === "profile" || session.state === "profile_edit") {
      return handleProfile(from, message, action);
    }
    if (session.state === "leaderboard") {
      return handleLeaderboard(from, message, action);
    }
    if (session.state === "notifications") {
      return handleNotifications(from, message, action);
    }

    // Handle menu button presses from any state
    if (action.startsWith("menu_") || action.startsWith("tournaments_") || action.startsWith("bets_") ||
        action.startsWith("challenges_") || action.startsWith("social_") || action.startsWith("gcoins_") ||
        action.startsWith("leaderboard_") || action.startsWith("notifications_") ||
        action.startsWith("enroll_") || action.startsWith("bet_") || action.startsWith("challenge_") ||
        action.startsWith("profile_") || action.startsWith("buy_")) {
      return handleMenuSelection(from, action);
    }

    // AI fallback for natural language
    if (session.userId) {
      return handleAIChat(from, message, action);
    }

    // Unknown - show menu or onboarding
    if (session.userId) {
      await whatsapp.sendMessage(from, menus.unknownCommand());
    } else {
      await whatsapp.sendMessage(from, menus.welcome());
    }
  } catch (error) {
    console.error(`[Router] Error processing message from ${from}:`, error);
    await whatsapp.sendMessage(from, menus.error());
  }
}

// Route menu selections to the right handler
async function handleMenuSelection(phone: string, action: string): Promise<void> {
  const session = sessionManager.getSession(phone);

  // Ensure user is authenticated for protected actions
  if (!session.userId && !action.startsWith("onboarding")) {
    const user = await sessionManager.findUserByPhone(phone);
    if (user) {
      sessionManager.setUserId(phone, user.id);
    } else {
      sessionManager.setState(phone, "onboarding");
      await whatsapp.sendMessage(phone, menus.welcome());
      return;
    }
  }

  switch (action) {
    // Main menu areas
    case "menu_tournaments":
      sessionManager.setState(phone, "tournaments");
      await whatsapp.sendMessage(phone, menus.tournamentsMenu());
      break;

    case "menu_bets":
      sessionManager.setState(phone, "betting");
      await whatsapp.sendMessage(phone, menus.bettingMenu());
      break;

    case "menu_challenges":
      sessionManager.setState(phone, "challenges");
      await whatsapp.sendMessage(phone, menus.challengesMenu());
      break;

    case "menu_social":
      sessionManager.setState(phone, "social");
      await whatsapp.sendMessage(phone, menus.socialMenu());
      break;

    case "menu_gcoins":
      sessionManager.setState(phone, "gcoins");
      await handleGCoins(phone, null as unknown as IncomingMessage, "show_balance");
      break;

    case "menu_profile":
      sessionManager.setState(phone, "profile");
      await handleProfile(phone, null as unknown as IncomingMessage, "show_profile");
      break;

    case "menu_leaderboard":
      sessionManager.setState(phone, "leaderboard");
      await whatsapp.sendMessage(phone, menus.leaderboardMenu());
      break;

    case "menu_notifications":
      sessionManager.setState(phone, "notifications");
      await handleNotifications(phone, null as unknown as IncomingMessage, "show_notifications");
      break;

    case "menu_settings":
      await whatsapp.sendMessage(phone, menus.helpMessage());
      break;

    default:
      // Delegate to specific handlers based on action prefix
      if (action.startsWith("tournaments_") || action.startsWith("enroll_")) {
        sessionManager.setState(phone, "tournaments");
        await handleTournaments(phone, null as unknown as IncomingMessage, action);
      } else if (action.startsWith("bets_") || action.startsWith("bet_")) {
        sessionManager.setState(phone, "betting");
        await handleBetting(phone, null as unknown as IncomingMessage, action);
      } else if (action.startsWith("challenges_") || action.startsWith("challenge_")) {
        sessionManager.setState(phone, "challenges");
        await handleChallenges(phone, null as unknown as IncomingMessage, action);
      } else if (action.startsWith("social_")) {
        sessionManager.setState(phone, "social");
        await handleSocial(phone, null as unknown as IncomingMessage, action);
      } else if (action.startsWith("gcoins_") || action.startsWith("buy_")) {
        sessionManager.setState(phone, "gcoins");
        await handleGCoins(phone, null as unknown as IncomingMessage, action);
      } else if (action.startsWith("leaderboard_")) {
        sessionManager.setState(phone, "leaderboard");
        await handleLeaderboard(phone, null as unknown as IncomingMessage, action);
      } else if (action.startsWith("notifications_")) {
        sessionManager.setState(phone, "notifications");
        await handleNotifications(phone, null as unknown as IncomingMessage, action);
      } else if (action.startsWith("profile_")) {
        sessionManager.setState(phone, "profile");
        await handleProfile(phone, null as unknown as IncomingMessage, action);
      } else {
        await whatsapp.sendMessage(phone, menus.unknownCommand());
      }
      break;
  }
}

// Extract actionable text from any message type
function extractAction(message: IncomingMessage): string {
  // Button reply
  if (message.interactive?.buttonReply) {
    return message.interactive.buttonReply.id;
  }
  if (message.buttonReply) {
    return message.buttonReply.id;
  }

  // List reply
  if (message.interactive?.listReply) {
    return message.interactive.listReply.id;
  }
  if (message.listReply) {
    return message.listReply.id;
  }

  // Flow reply
  if (message.interactive?.nfmReply) {
    return `flow_reply_${message.interactive.nfmReply.flowId}`;
  }
  if (message.flowReply) {
    return `flow_reply_${message.flowReply.flowId}`;
  }

  // Text
  return message.text ?? "";
}
