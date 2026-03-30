# Sportio WhatsApp Bot - Project Memory

## Architecture: 100% WhatsApp-First

This is a pure WhatsApp-based sports platform. NO web frontend.
Users interact exclusively through WhatsApp.

## Tech Stack
- **Runtime:** Node.js + TypeScript (tsx)
- **WhatsApp:** Evolution API (dev) / WhatsApp Cloud API (prod)
- **Database:** Neon PostgreSQL (serverless) + Drizzle ORM
- **Payments:** PIX (BR Code EMV) + Stripe
- **AI:** Claude API (optional, for natural language understanding)

## Project Structure
```
src/
├── whatsapp/                  # WhatsApp bot (main application)
│   ├── server.ts              # Entry point (HTTP server, port 3001)
│   ├── config.ts              # All configuration
│   ├── types.ts               # TypeScript types
│   ├── router.ts              # Message router (brain of the bot)
│   ├── webhook.ts             # Webhook parser (Evolution + Cloud API)
│   ├── index.ts               # Public exports
│   ├── handlers/              # Feature handlers
│   │   ├── onboarding.ts      # User registration/login
│   │   ├── tournaments.ts     # Browse, enroll, create tournaments
│   │   ├── betting.ts         # Place bets, view odds, results
│   │   ├── challenges.ts      # Create/accept duels
│   │   ├── gcoins.ts          # Balance, buy via PIX, transfer
│   │   ├── social.ts          # Feed, create posts, trending
│   │   ├── profile.ts         # View/edit profile
│   │   ├── leaderboard.ts     # Rankings (XP, bets, GCoins)
│   │   ├── notifications.ts   # View notifications
│   │   └── ai-chat.ts         # Natural language + Claude fallback
│   ├── services/
│   │   ├── whatsapp-client.ts # Send messages (Evolution + Cloud API)
│   │   ├── session-manager.ts # Conversation state management
│   │   ├── menu-builder.ts    # WhatsApp menu templates
│   │   ├── pix-generator.ts   # PIX QR code generation
│   │   ├── notification-sender.ts # Proactive WhatsApp notifications
│   │   └── community-manager.ts   # Auto WhatsApp groups
│   └── flows/                 # WhatsApp Flows JSON schemas
│       ├── tournament-enrollment.json
│       ├── bet-placement.json
│       ├── create-challenge.json
│       └── create-tournament.json
├── server/
│   ├── db/
│   │   ├── schema.ts          # Database schema (48 tables)
│   │   ├── index.ts           # DB connection
│   │   └── seed.ts            # Seed data (43 sports + admin)
│   ├── api/
│   │   ├── routers/           # tRPC routers (business logic reference)
│   │   ├── trpc.ts            # tRPC setup
│   │   └── root.ts            # Router registry
│   ├── services/              # Business logic services
│   │   ├── notification-service.ts
│   │   ├── bet-settlement.ts
│   │   ├── bracket-generator.ts
│   │   ├── challenge-settlement.ts
│   │   ├── gamification.ts
│   │   ├── odds-calculator.ts
│   │   ├── rules-engine.ts
│   │   └── sports-data.ts
│   ├── auth/index.ts          # Auth helpers (phone-based)
│   └── lib/                   # Stripe, storage utilities
```

## Commands
```bash
npm run dev          # Start bot with hot reload
npm run start        # Start bot (production)
npm run db:push      # Push schema to database
npm run db:seed      # Seed database
npm run db:setup     # Push + seed
npm run db:studio    # Open Drizzle Studio (DB GUI)
```

## How It Works

1. User sends message to WhatsApp number
2. Evolution API receives it, sends webhook to `POST /webhook`
3. `webhook.ts` parses the message into `IncomingMessage`
4. `router.ts` checks session state and routes to handler
5. Handler processes the action, queries DB, sends response
6. `whatsapp-client.ts` sends response back via Evolution/Cloud API

## Key Design Decisions

- **No tRPC dependency for WhatsApp:** Handlers query DB directly via Drizzle
- **Session state in memory:** Simple Map-based sessions (swap Redis in prod)
- **PIX payments:** EMV BR Code generated as "copia e cola" text
- **Auth by phone:** WhatsApp number = user identity, no passwords needed
- **AI optional:** Works with keyword matching, Claude enhances understanding

## Infrastructure & Credentials

### GitHub Repository
- **Repo:** tigraodegente/Sportio-web
- **Main branch:** main
- **GitHub PAT env var:** GITHUB_GLOBAL_KEY

### Database
- **Provider:** Neon PostgreSQL (serverless)
- **Driver:** @neondatabase/serverless + drizzle-orm/neon-http
- **Config:** drizzle.config.ts (reads DATABASE_URL from env)
- **Schema:** src/server/db/schema.ts

### Database Commands
```bash
npm run db:push    # Push schema to database
npm run db:seed    # Seed with 43 sports + initial data
npm run db:setup   # Push schema + seed
```

### Environment Variables
See `.env.example` for all required variables.

Key variables:
- `DATABASE_URL` - Neon PostgreSQL connection
- `WHATSAPP_PROVIDER` - "evolution" or "cloud"
- `EVOLUTION_API_URL` / `EVOLUTION_API_KEY` - Evolution API connection
- `PIX_KEY` - PIX payment key
- `ANTHROPIC_API_KEY` - Claude AI (optional)

## Monetization (7 revenue streams)
1. **Rake on bets** (5-10%)
2. **Tournament entry fees** (10-20%)
3. **GCoin sales via PIX**
4. **Premium communities** (monthly subscription)
5. **Brand sponsorships** (CPM messaging)
6. **Bolao** (social betting pools)
7. **Affiliate commissions**
