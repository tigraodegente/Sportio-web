// WhatsApp API Client - supports Evolution API and Cloud API
import { whatsappConfig } from "../config";
import type { OutgoingMessage } from "../types";

export class WhatsAppClient {
  private provider = whatsappConfig.provider;

  // ==================== SEND MESSAGE (unified) ====================

  async sendMessage(to: string, message: OutgoingMessage): Promise<void> {
    if (this.provider === "evolution") {
      await this.sendViaEvolution(to, message);
    } else {
      await this.sendViaCloudAPI(to, message);
    }
  }

  // ==================== EVOLUTION API ====================

  private async sendViaEvolution(to: string, message: OutgoingMessage): Promise<void> {
    const { baseUrl, apiKey, instanceName } = whatsappConfig.evolution;
    const base = `${baseUrl}/message`;

    switch (message.type) {
      case "text":
        await this.evolutionPost(`${base}/sendText/${instanceName}`, apiKey, {
          number: to,
          text: message.text,
        });
        break;

      case "buttons": {
        // Convert buttons to plain text for maximum compatibility
        const btnHeader = message.header ? `*${message.header}*\n\n` : "";
        const btnList = message.buttons.map((b, i) => `${i + 1}. ${b.title}`).join("\n");
        const btnFooter = message.footer ? `\n\n${message.footer}` : "";
        const btnText = `${btnHeader}${message.text}\n\n${btnList}${btnFooter}\n\n_Responda com o numero da opcao_`;
        await this.evolutionPost(`${base}/sendText/${instanceName}`, apiKey, {
          number: to,
          text: btnText,
        });
        break;
      }

      case "list": {
        // Convert list to plain text for maximum compatibility
        const listHeader = message.header ? `*${message.header}*\n\n` : "";
        let listItems = "";
        for (const section of message.sections) {
          if (section.title) listItems += `*${section.title}*\n`;
          listItems += section.rows.map((r: { title: string; description?: string }, i: number) =>
            `${i + 1}. ${r.title}${r.description ? ` - ${r.description}` : ""}`
          ).join("\n");
          listItems += "\n";
        }
        const listText = `${listHeader}${message.text}\n\n${listItems}\n_Responda com o numero da opcao_`;
        await this.evolutionPost(`${base}/sendText/${instanceName}`, apiKey, {
          number: to,
          text: listText,
        });
        break;
      }

      case "image":
        await this.evolutionPost(`${base}/sendMedia/${instanceName}`, apiKey, {
          number: to,
          mediatype: "image",
          media: message.url,
          caption: message.caption ?? "",
        });
        break;

      case "document":
        await this.evolutionPost(`${base}/sendMedia/${instanceName}`, apiKey, {
          number: to,
          mediatype: "document",
          media: message.url,
          caption: message.caption ?? "",
          fileName: message.filename,
        });
        break;

      case "location":
        await this.evolutionPost(`${base}/sendLocation/${instanceName}`, apiKey, {
          number: to,
          latitude: message.latitude,
          longitude: message.longitude,
          name: message.name ?? "",
          address: message.address ?? "",
        });
        break;

      case "contact":
        await this.evolutionPost(`${base}/sendContact/${instanceName}`, apiKey, {
          number: to,
          contact: [
            {
              fullName: message.name,
              wuid: `${message.phone}@s.whatsapp.net`,
              phoneNumber: message.phone,
            },
          ],
        });
        break;

      case "carousel":
        // Evolution doesn't natively support carousel - send as sequential messages
        for (const card of message.cards) {
          if (card.imageUrl) {
            await this.evolutionPost(`${base}/sendMedia/${instanceName}`, apiKey, {
              number: to,
              mediatype: "image",
              media: card.imageUrl,
              caption: card.body,
            });
          } else {
            await this.evolutionPost(`${base}/sendText/${instanceName}`, apiKey, {
              number: to,
              text: card.body,
            });
          }
        }
        break;

      case "flow":
        // Evolution API - send as button that opens flow URL or fallback to buttons
        await this.evolutionPost(`${base}/sendButtons/${instanceName}`, apiKey, {
          number: to,
          title: message.header ?? "",
          description: message.text,
          footer: message.footer ?? "",
          buttons: [
            {
              type: "reply",
              buttonId: `flow_${message.flowId}`,
              buttonText: { displayText: message.buttonText },
            },
          ],
        });
        break;
    }
  }

  private async evolutionPost(url: string, apiKey: string, body: unknown): Promise<unknown> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text().catch(() => "Unknown error");
      console.error(`[WhatsApp] Evolution API error: ${response.status} - ${error}`);
      throw new Error(`Evolution API error: ${response.status}`);
    }

    return response.json();
  }

  // ==================== WHATSAPP CLOUD API ====================

  private async sendViaCloudAPI(to: string, message: OutgoingMessage): Promise<void> {
    const { baseUrl, accessToken } = whatsappConfig.cloud;

    let payload: Record<string, unknown>;

    switch (message.type) {
      case "text":
        payload = {
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: message.text },
        };
        break;

      case "buttons":
        payload = {
          messaging_product: "whatsapp",
          to,
          type: "interactive",
          interactive: {
            type: "button",
            header: message.header ? { type: "text", text: message.header } : undefined,
            body: { text: message.text },
            footer: message.footer ? { text: message.footer } : undefined,
            action: {
              buttons: message.buttons.map((b) => ({
                type: "reply",
                reply: { id: b.id, title: b.title },
              })),
            },
          },
        };
        break;

      case "list":
        payload = {
          messaging_product: "whatsapp",
          to,
          type: "interactive",
          interactive: {
            type: "list",
            header: message.header ? { type: "text", text: message.header } : undefined,
            body: { text: message.text },
            footer: message.footer ? { text: message.footer } : undefined,
            action: {
              button: message.buttonText,
              sections: message.sections,
            },
          },
        };
        break;

      case "image":
        payload = {
          messaging_product: "whatsapp",
          to,
          type: "image",
          image: { link: message.url, caption: message.caption ?? "" },
        };
        break;

      case "document":
        payload = {
          messaging_product: "whatsapp",
          to,
          type: "document",
          document: {
            link: message.url,
            caption: message.caption ?? "",
            filename: message.filename,
          },
        };
        break;

      case "location":
        payload = {
          messaging_product: "whatsapp",
          to,
          type: "location",
          location: {
            latitude: message.latitude,
            longitude: message.longitude,
            name: message.name ?? "",
            address: message.address ?? "",
          },
        };
        break;

      case "contact":
        payload = {
          messaging_product: "whatsapp",
          to,
          type: "contacts",
          contacts: [
            {
              name: { formatted_name: message.name },
              phones: [{ phone: message.phone, type: "CELL" }],
            },
          ],
        };
        break;

      case "carousel":
        payload = {
          messaging_product: "whatsapp",
          to,
          type: "interactive",
          interactive: {
            type: "carousel",
            header: { type: "text", text: message.header },
            action: {
              cards: message.cards.map((card, i) => ({
                card_index: i,
                components: [
                  ...(card.imageUrl
                    ? [{ type: "header", parameters: [{ type: "image", image: { link: card.imageUrl } }] }]
                    : []),
                  { type: "body", parameters: [{ type: "text", text: card.body }] },
                  ...card.buttons.map((b, bi) => ({
                    type: "button",
                    sub_type: "quick_reply",
                    index: bi,
                    parameters: [{ type: "payload", payload: b.id }],
                  })),
                ],
              })),
            },
          },
        };
        break;

      case "flow":
        payload = {
          messaging_product: "whatsapp",
          to,
          type: "interactive",
          interactive: {
            type: "flow",
            header: message.header ? { type: "text", text: message.header } : undefined,
            body: { text: message.text },
            footer: message.footer ? { text: message.footer } : undefined,
            action: {
              name: "flow",
              parameters: {
                flow_message_version: "3",
                flow_id: message.flowId,
                flow_action: message.flowAction,
                flow_cta: message.buttonText,
                ...(message.screenId ? { flow_action_payload: { screen: message.screenId, data: message.data ?? {} } } : {}),
              },
            },
          },
        };
        break;
    }

    await this.cloudPost(`${baseUrl}/messages`, accessToken, payload!);
  }

  private async cloudPost(url: string, token: string, body: unknown): Promise<unknown> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text().catch(() => "Unknown error");
      console.error(`[WhatsApp] Cloud API error: ${response.status} - ${error}`);
      throw new Error(`Cloud API error: ${response.status}`);
    }

    return response.json();
  }

  // ==================== UTILITY METHODS ====================

  async sendText(to: string, text: string): Promise<void> {
    await this.sendMessage(to, { type: "text", text });
  }

  async sendButtons(
    to: string,
    text: string,
    buttons: Array<{ id: string; title: string }>,
    header?: string,
    footer?: string
  ): Promise<void> {
    await this.sendMessage(to, { type: "buttons", text, buttons, header, footer });
  }

  async sendList(
    to: string,
    text: string,
    buttonText: string,
    sections: Array<{
      title: string;
      rows: Array<{ id: string; title: string; description?: string }>;
    }>,
    header?: string,
    footer?: string
  ): Promise<void> {
    await this.sendMessage(to, { type: "list", text, buttonText, sections, header, footer });
  }

  async sendImage(to: string, url: string, caption?: string): Promise<void> {
    await this.sendMessage(to, { type: "image", url, caption });
  }

  // ==================== GROUP/COMMUNITY MANAGEMENT ====================

  async createGroup(name: string, participants: string[]): Promise<string | null> {
    if (this.provider === "evolution") {
      const { baseUrl, apiKey, instanceName } = whatsappConfig.evolution;
      const result = await this.evolutionPost(`${baseUrl}/group/create/${instanceName}`, apiKey, {
        subject: name,
        participants: participants.map((p) => `${p}@s.whatsapp.net`),
      }) as { id?: string };
      return result?.id ?? null;
    }
    // Cloud API group creation (limited - requires Official Business Account)
    console.warn("[WhatsApp] Group creation via Cloud API requires Official Business Account");
    return null;
  }

  async addToGroup(groupId: string, participants: string[]): Promise<void> {
    if (this.provider === "evolution") {
      const { baseUrl, apiKey, instanceName } = whatsappConfig.evolution;
      await this.evolutionPost(`${baseUrl}/group/updateParticipant/${instanceName}`, apiKey, {
        groupJid: groupId,
        action: "add",
        participants: participants.map((p) => `${p}@s.whatsapp.net`),
      });
    }
  }

  async sendToGroup(groupId: string, message: OutgoingMessage): Promise<void> {
    await this.sendMessage(groupId, message);
  }
}

// Singleton instance
export const whatsapp = new WhatsAppClient();
