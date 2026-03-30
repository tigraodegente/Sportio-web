// WhatsApp Integration Configuration
// Supports both Evolution API (dev/self-hosted) and WhatsApp Cloud API (production)

export const whatsappConfig = {
  // Provider: "evolution" | "cloud"
  provider: (process.env.WHATSAPP_PROVIDER ?? "evolution") as "evolution" | "cloud",

  // Evolution API settings
  evolution: {
    baseUrl: process.env.EVOLUTION_API_URL ?? "http://localhost:8080",
    apiKey: process.env.EVOLUTION_API_KEY ?? "",
    instanceName: process.env.EVOLUTION_INSTANCE ?? "sportio",
  },

  // WhatsApp Cloud API settings (production)
  cloud: {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ?? "",
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN ?? "",
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN ?? "sportio-verify-2024",
    appSecret: process.env.WHATSAPP_APP_SECRET ?? "",
    apiVersion: "v21.0",
    get baseUrl() {
      return `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}`;
    },
  },

  // Bot settings
  bot: {
    name: "Sportio",
    welcomeMessage:
      "Fala, craque! Sou o Sportio Bot, seu assistente esportivo.\nAqui voce pode apostar, participar de torneios, desafiar amigos e muito mais!",
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxMenuRetries: 3,
  },

  // PIX settings
  pix: {
    key: process.env.PIX_KEY ?? "",
    merchantName: process.env.PIX_MERCHANT_NAME ?? "SPORTIO LTDA",
    merchantCity: process.env.PIX_MERCHANT_CITY ?? "SAO PAULO",
    gcoinPriceInCents: 10, // R$0.10 per GCoin
  },

  // AI settings (Claude for natural language understanding)
  ai: {
    enabled: process.env.WHATSAPP_AI_ENABLED === "true",
    apiKey: process.env.ANTHROPIC_API_KEY ?? "",
    model: "claude-sonnet-4-20250514",
  },

  // Community settings
  communities: {
    autoCreate: true,
    maxGroupSize: 256,
    announcementOnly: false,
  },
} as const;

export type WhatsAppProvider = typeof whatsappConfig.provider;
