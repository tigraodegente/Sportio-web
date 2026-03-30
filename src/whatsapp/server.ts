// Standalone WhatsApp Bot Server
// Run this independently from Next.js for dedicated WhatsApp handling
// Usage: npx tsx src/whatsapp/server.ts

import { createServer } from "http";
import { handleWebhook, verifyCloudAPIWebhook } from "./webhook";
import { sendPendingNotifications } from "./services/notification-sender";
import { sessionManager } from "./services/session-manager";
import { whatsappConfig } from "./config";

const PORT = parseInt(process.env.WHATSAPP_PORT ?? "3001");

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        provider: whatsappConfig.provider,
        activeSessions: sessionManager.getActiveCount(),
        uptime: process.uptime(),
      })
    );
    return;
  }

  // WhatsApp webhook - POST
  if (url.pathname === "/webhook" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const parsed = JSON.parse(body);
        handleWebhook(parsed).catch((err) =>
          console.error("[Server] Webhook error:", err)
        );
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok" }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  // WhatsApp Cloud API verification - GET
  if (url.pathname === "/webhook" && req.method === "GET") {
    const challenge = verifyCloudAPIWebhook({
      "hub.mode": url.searchParams.get("hub.mode") ?? undefined,
      "hub.verify_token": url.searchParams.get("hub.verify_token") ?? undefined,
      "hub.challenge": url.searchParams.get("hub.challenge") ?? undefined,
    });

    if (challenge) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(challenge);
      return;
    }

    res.writeHead(403);
    res.end("Verification failed");
    return;
  }

  // Stats
  if (url.pathname === "/stats") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        activeSessions: sessionManager.getActiveCount(),
        provider: whatsappConfig.provider,
      })
    );
    return;
  }

  // 404
  res.writeHead(404);
  res.end("Not found");
});

// Start notification polling (every 60 seconds)
const NOTIFICATION_INTERVAL = 60_000;
setInterval(async () => {
  try {
    const sent = await sendPendingNotifications();
    if (sent > 0) {
      console.log(`[Notifications] Sent ${sent} notifications via WhatsApp`);
    }
  } catch (error) {
    console.error("[Notifications] Error:", error);
  }
}, NOTIFICATION_INTERVAL);

// Session cleanup (every 5 minutes)
setInterval(() => {
  const cleaned = sessionManager.cleanupExpired();
  if (cleaned > 0) {
    console.log(`[Sessions] Cleaned up ${cleaned} expired sessions`);
  }
}, 5 * 60_000);

server.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║     SPORTIO WHATSAPP BOT SERVER          ║
  ╠══════════════════════════════════════════╣
  ║                                          ║
  ║  Status:   ONLINE                        ║
  ║  Port:     ${PORT}                          ║
  ║  Provider: ${whatsappConfig.provider.padEnd(28)}║
  ║  Webhook:  http://localhost:${PORT}/webhook  ║
  ║  Health:   http://localhost:${PORT}/health   ║
  ║                                          ║
  ╠══════════════════════════════════════════╣
  ║  Configure Evolution API webhook to:     ║
  ║  POST http://your-server:${PORT}/webhook    ║
  ║                                          ║
  ║  Or for Cloud API, set webhook URL to:   ║
  ║  https://your-domain.com/api/whatsapp    ║
  ╚══════════════════════════════════════════╝
  `);
});
