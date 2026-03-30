// WhatsApp Webhook Handler
// Handles incoming webhooks from both Evolution API and WhatsApp Cloud API
import { whatsappConfig } from "./config";
import { routeMessage } from "./router";
import type { IncomingMessage } from "./types";

/**
 * Process incoming webhook from Evolution API
 */
export function parseEvolutionWebhook(body: unknown): IncomingMessage | null {
  const data = body as Record<string, unknown>;

  // Evolution API webhook format
  const event = data.event as string;
  if (event !== "messages.upsert") return null;

  const messageData = data.data as Record<string, unknown>;
  if (!messageData) return null;

  const key = messageData.key as Record<string, unknown>;
  const message = messageData.message as Record<string, unknown>;
  const pushName = messageData.pushName as string;

  if (!key || !message) return null;

  // Skip messages sent by us
  if (key.fromMe) return null;

  const from = (key.remoteJid as string)?.replace("@s.whatsapp.net", "") ?? "";
  if (!from) return null;

  const messageId = key.id as string;
  const timestamp = (messageData.messageTimestamp as number) ?? Date.now();

  // Parse message content
  if (message.conversation || message.extendedTextMessage) {
    const text =
      (message.conversation as string) ??
      (message.extendedTextMessage as Record<string, unknown>)?.text;
    return {
      from,
      name: pushName,
      messageId,
      timestamp,
      type: "text",
      text: text as string,
    };
  }

  if (message.imageMessage) {
    const img = message.imageMessage as Record<string, unknown>;
    return {
      from,
      name: pushName,
      messageId,
      timestamp,
      type: "image",
      image: {
        id: messageId,
        url: img.url as string,
        mimeType: (img.mimetype as string) ?? "image/jpeg",
        caption: img.caption as string,
      },
      text: img.caption as string,
    };
  }

  if (message.buttonsResponseMessage) {
    const btn = message.buttonsResponseMessage as Record<string, unknown>;
    return {
      from,
      name: pushName,
      messageId,
      timestamp,
      type: "button_reply",
      buttonReply: {
        id: btn.selectedButtonId as string,
        title: btn.selectedDisplayText as string,
      },
      text: btn.selectedButtonId as string,
    };
  }

  if (message.listResponseMessage) {
    const list = message.listResponseMessage as Record<string, unknown>;
    const row = list.singleSelectReply as Record<string, unknown>;
    return {
      from,
      name: pushName,
      messageId,
      timestamp,
      type: "list_reply",
      listReply: {
        id: row?.selectedRowId as string,
        title: row?.title as string,
      },
      text: row?.selectedRowId as string,
    };
  }

  if (message.locationMessage) {
    const loc = message.locationMessage as Record<string, unknown>;
    return {
      from,
      name: pushName,
      messageId,
      timestamp,
      type: "location",
      location: {
        latitude: loc.degreesLatitude as number,
        longitude: loc.degreesLongitude as number,
        name: loc.name as string,
        address: loc.address as string,
      },
    };
  }

  // Unsupported message type - treat as text with indicator
  return {
    from,
    name: pushName,
    messageId,
    timestamp,
    type: "text",
    text: "[mensagem nao suportada]",
  };
}

/**
 * Process incoming webhook from WhatsApp Cloud API
 */
export function parseCloudAPIWebhook(body: unknown): IncomingMessage | null {
  const data = body as Record<string, unknown>;
  const entry = (data.entry as Array<Record<string, unknown>>)?.[0];
  if (!entry) return null;

  const changes = (entry.changes as Array<Record<string, unknown>>)?.[0];
  if (!changes) return null;

  const value = changes.value as Record<string, unknown>;
  if (!value) return null;

  const messages = (value.messages as Array<Record<string, unknown>>)?.[0];
  if (!messages) return null;

  const contacts = (value.contacts as Array<Record<string, unknown>>)?.[0];

  const from = messages.from as string;
  const messageId = messages.id as string;
  const timestamp = parseInt(messages.timestamp as string) * 1000;
  const name = (contacts?.profile as Record<string, unknown>)?.name as string;
  const msgType = messages.type as string;

  if (msgType === "text") {
    const textBody = messages.text as Record<string, unknown>;
    return {
      from,
      name,
      messageId,
      timestamp,
      type: "text",
      text: textBody?.body as string,
    };
  }

  if (msgType === "interactive") {
    const interactive = messages.interactive as Record<string, unknown>;
    const interactiveType = interactive?.type as string;

    if (interactiveType === "button_reply") {
      const reply = interactive.button_reply as Record<string, unknown>;
      return {
        from,
        name,
        messageId,
        timestamp,
        type: "interactive",
        interactive: {
          type: "button_reply",
          buttonReply: {
            id: reply?.id as string,
            title: reply?.title as string,
          },
        },
        text: reply?.id as string,
      };
    }

    if (interactiveType === "list_reply") {
      const reply = interactive.list_reply as Record<string, unknown>;
      return {
        from,
        name,
        messageId,
        timestamp,
        type: "interactive",
        interactive: {
          type: "list_reply",
          listReply: {
            id: reply?.id as string,
            title: reply?.title as string,
            description: reply?.description as string,
          },
        },
        text: reply?.id as string,
      };
    }

    if (interactiveType === "nfm_reply") {
      const nfm = interactive.nfm_reply as Record<string, unknown>;
      return {
        from,
        name,
        messageId,
        timestamp,
        type: "interactive",
        interactive: {
          type: "nfm_reply",
          nfmReply: {
            flowId: nfm?.name as string,
            screenId: "",
            data: JSON.parse((nfm?.response_json as string) ?? "{}"),
          },
        },
      };
    }
  }

  if (msgType === "image") {
    const img = messages.image as Record<string, unknown>;
    return {
      from,
      name,
      messageId,
      timestamp,
      type: "image",
      image: {
        id: img?.id as string,
        mimeType: (img?.mime_type as string) ?? "image/jpeg",
        caption: img?.caption as string,
      },
      text: img?.caption as string,
    };
  }

  if (msgType === "location") {
    const loc = messages.location as Record<string, unknown>;
    return {
      from,
      name,
      messageId,
      timestamp,
      type: "location",
      location: {
        latitude: loc?.latitude as number,
        longitude: loc?.longitude as number,
        name: loc?.name as string,
        address: loc?.address as string,
      },
    };
  }

  return null;
}

/**
 * Main webhook handler - called by the HTTP server
 */
export async function handleWebhook(body: unknown): Promise<void> {
  let message: IncomingMessage | null = null;

  if (whatsappConfig.provider === "evolution") {
    message = parseEvolutionWebhook(body);
  } else {
    message = parseCloudAPIWebhook(body);
  }

  if (!message) return;

  console.log(`[Webhook] ${message.from}: ${message.text ?? message.type}`);

  try {
    await routeMessage(message);
  } catch (error) {
    console.error(`[Webhook] Error processing message:`, error);
  }
}

/**
 * Cloud API webhook verification (GET request)
 */
export function verifyCloudAPIWebhook(query: {
  "hub.mode"?: string;
  "hub.verify_token"?: string;
  "hub.challenge"?: string;
}): string | null {
  if (
    query["hub.mode"] === "subscribe" &&
    query["hub.verify_token"] === whatsappConfig.cloud.verifyToken
  ) {
    return query["hub.challenge"] ?? null;
  }
  return null;
}
