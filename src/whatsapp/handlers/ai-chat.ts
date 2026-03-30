// AI Chat handler - natural language understanding using Claude
import type { IncomingMessage } from "../types";
import { sessionManager } from "../services/session-manager";
import { whatsapp } from "../services/whatsapp-client";
import { menus } from "../services/menu-builder";
import { whatsappConfig } from "../config";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

// Intent detection using keyword matching (no AI dependency required)
// When AI is enabled, uses Claude for more sophisticated understanding

interface DetectedIntent {
  action: string;
  confidence: number;
  params?: Record<string, string>;
}

const INTENT_PATTERNS: Array<{
  patterns: RegExp[];
  action: string;
}> = [
  {
    patterns: [/quer[o]?\s+apostar/i, /apostar\s+em/i, /fazer\s+(uma\s+)?aposta/i, /quero\s+bet/i],
    action: "menu_bets",
  },
  {
    patterns: [/torneio/i, /campeonato/i, /inscri[çc][ãa]o/i, /me\s+inscrev/i],
    action: "menu_tournaments",
  },
  {
    patterns: [/desafi[oa]/i, /quero\s+desafiar/i, /1\s*v\s*1/i, /duelo/i],
    action: "menu_challenges",
  },
  {
    patterns: [/saldo/i, /gcoin/i, /meus?\s+gcoins?/i, /quanto\s+tenho/i, /comprar\s+gcoin/i],
    action: "menu_gcoins",
  },
  {
    patterns: [/perfil/i, /meu\s+perfil/i, /minha\s+conta/i],
    action: "menu_profile",
  },
  {
    patterns: [/ranking/i, /leaderboard/i, /melhores/i, /top\s+\d/i],
    action: "menu_leaderboard",
  },
  {
    patterns: [/feed/i, /post/i, /publicar/i, /compartilhar/i],
    action: "menu_social",
  },
  {
    patterns: [/notifica/i, /avisos?/i],
    action: "menu_notifications",
  },
  {
    patterns: [/ajuda/i, /help/i, /como\s+funciona/i, /o\s+que\s+faz/i],
    action: "menu_help",
  },
  {
    patterns: [/menu/i, /inicio/i, /come[çc]ar/i, /voltar/i],
    action: "menu_main",
  },
  {
    patterns: [/oi/i, /ola/i, /bom\s+dia/i, /boa\s+tarde/i, /boa\s+noite/i, /eae/i, /fala/i],
    action: "greeting",
  },
];

function detectIntent(text: string): DetectedIntent {
  const lower = text.toLowerCase().trim();

  for (const { patterns, action } of INTENT_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(lower)) {
        return { action, confidence: 0.8 };
      }
    }
  }

  return { action: "unknown", confidence: 0 };
}

export async function handleAIChat(
  phone: string,
  message: IncomingMessage,
  text: string
): Promise<void> {
  const intent = detectIntent(text);

  if (intent.confidence >= 0.5) {
    if (intent.action === "greeting") {
      const session = sessionManager.getSession(phone);
      const user = await db.query.users.findFirst({
        where: eq(users.id, session.userId!),
        columns: { name: true },
      });

      await whatsapp.sendText(phone, `Fala, ${user?.name ?? "craque"}! Tudo certo?`);
      await whatsapp.sendMessage(phone, menus.mainMenu());
      return;
    }

    // Route to detected intent
    const { routeMessage } = await import("../router");
    const syntheticMessage: IncomingMessage = {
      ...message,
      text: intent.action,
      type: "text",
    };
    await routeMessage(syntheticMessage);
    return;
  }

  // If AI is enabled, use Claude for understanding
  if (whatsappConfig.ai.enabled && whatsappConfig.ai.apiKey) {
    try {
      const response = await callClaudeForIntent(text);
      if (response) {
        await whatsapp.sendText(phone, response);
        return;
      }
    } catch (error) {
      console.error("[AI Chat] Claude API error:", error);
    }
  }

  // Fallback
  await whatsapp.sendMessage(phone, menus.unknownCommand());
}

async function callClaudeForIntent(userMessage: string): Promise<string | null> {
  const { apiKey, model } = whatsappConfig.ai;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 200,
      system:
        "Voce e o Sportio Bot, assistente esportivo brasileiro. " +
        "Responda de forma curta e amigavel em portugues. " +
        "O usuario pode perguntar sobre torneios, apostas, desafios, GCoins, ranking. " +
        "Se a pergunta for sobre algo que o bot pode fazer, sugira o comando. " +
        'Exemplo: "Para ver torneios, digite: torneios"',
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    content: Array<{ type: string; text?: string }>;
  };
  return data.content?.[0]?.text ?? null;
}
