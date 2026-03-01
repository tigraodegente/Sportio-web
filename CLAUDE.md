# Sportio-web - Project Memory

## Infrastructure & Credentials

### GitHub Repository
- **Repo:** tigraodegente/Sportio-web
- **Main branch:** main
- **GitHub PAT env var:** GITHUB_GLOBAL_KEY

### GitHub Secrets (configured)
| Secret | Source | Purpose |
|--------|--------|---------|
| `DATABASE_URL` | Neon PostgreSQL | Database connection string |
| `VERCEL_TOKEN` | Vercel | Deploy CLI token |
| `VERCEL_ORG_ID` | Vercel | Organization ID |
| `VERCEL_PROJECT_ID` | Vercel | Project ID |
| `AUTH_SECRET` | Generated (openssl rand -base64 32) | NextAuth session encryption |
| `GOOGLE_CLIENT_ID` | Env: AUTH_GOOGLE_ID | Google OAuth login |
| `CLOUDFLARE_API_TOKEN` | Env: CLOUDFLARE_API_TOKEN | Cloudflare API access |
| `CLOUDFLARE_ACCOUNT_ID` | Env: CLOUDFLARE_ACCOUNT_ID | Cloudflare account |
| `CLOUDFLARE_ZONE_ID` | Env: CLOUDFLARE_ZONE_ID | Cloudflare DNS zone |
| `CLERK_SECRET_KEY` | Env: CLERK_SECRET_KEY | Clerk auth (backup) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Env: PUBLIC_CLERK_PUBLISHABLE_KEY | Clerk frontend key |

### How to Set GitHub Secrets
```bash
export GH_TOKEN=$GITHUB_GLOBAL_KEY
gh secret set SECRET_NAME --body "value" --repo tigraodegente/Sportio-web
gh secret list --repo tigraodegente/Sportio-web
```

### Environment Variables Available in This Container
```
AUTH_GOOGLE_ID          → Google OAuth Client ID
CLOUDFLARE_API_TOKEN    → Cloudflare API Token
CLOUDFLARE_ACCOUNT_ID   → Cloudflare Account ID
CLOUDFLARE_ZONE_ID      → Cloudflare Zone ID
CLOUDFARE_GLOBAL_KEY    → Cloudflare Global API Key (note: typo in env name)
CLERK_SECRET_KEY        → Clerk Secret Key
PUBLIC_CLERK_PUBLISHABLE_KEY → Clerk Publishable Key
GITHUB_GLOBAL_KEY       → GitHub PAT for API access
GRAFANO_API_KEY         → Grafana API Key (note: typo in env name)
railway_GLOBAL_KEY      → Railway API Key
VITE_TYPESENSE_HOST     → Typesense search host (gdg-typesense.fly.dev)
VITE_TYPESENSE_SEARCH_KEY → Typesense search API key
```

### Database
- **Provider:** Neon PostgreSQL (serverless)
- **Driver:** @neondatabase/serverless + drizzle-orm/neon-http
- **Config:** drizzle.config.ts (reads DATABASE_URL from env)
- **Schema:** src/server/db/schema.ts
- **Seed:** src/server/db/seed.ts (43 sports + admin user)

### Database Commands
```bash
npm run db:push    # Push schema to database (drizzle-kit push)
npm run db:seed    # Seed with 43 sports + initial data
npm run db:setup   # Push schema + seed in one command
```

### Deployment
- **Platform:** Vercel
- **Package manager:** pnpm 9
- **Node version:** 20
- **Framework:** Next.js 15 (App Router)

### GitHub Actions Workflows
1. **deploy.yml** - Deploy to Vercel (on push to main or PR)
   - Preview deploy on PRs (comments URL on PR)
   - Production deploy on main push or manual dispatch
2. **db-setup.yml** - Push schema & seed database
   - Triggered on schema changes or manual dispatch
   - Uses DATABASE_URL from GitHub secrets

### How to Trigger Workflows
```bash
export GH_TOKEN=$GITHUB_GLOBAL_KEY
# Trigger deploy
gh workflow run deploy.yml --repo tigraodegente/Sportio-web
# Trigger db setup
gh workflow run db-setup.yml --repo tigraodegente/Sportio-web
# Check run status
gh run list --repo tigraodegente/Sportio-web --limit 5
gh run view <run-id> --repo tigraodegente/Sportio-web
```

## Tech Stack
- **Frontend:** Next.js 15, React, TailwindCSS, Lucide Icons
- **Backend:** tRPC (type-safe API), Drizzle ORM
- **Auth:** NextAuth.js v5 (credentials + Google OAuth)
- **DB:** Neon PostgreSQL (serverless)
- **Deploy:** Vercel via GitHub Actions
- **Search:** Typesense (gdg-typesense.fly.dev)

## Key Architecture Decisions
- **Personas:** Fan is auto-assigned to all users. Primary personas: Organizer, Athlete, Brand. Secondary: Trainer, Nutritionist, Photographer, Arena Owner, Referee.
- **GCoins:** Dual currency (real + gamification). Real can be withdrawn, gamification earned through activities.
- **Sponsorship:** Brands create campaigns (banner, product_giveaway, gcoin_reward, tournament_sponsor, challenge_sponsor). Ads display in feed (every 5th post) and sidebar.
- **Betting:** Parimutuel odds system. Settlement via bet-settlement.ts service on match completion.
- **Notifications:** Centralized notification-service.ts fires on: comments, likes, follows, bets, gcoins, chat messages, tournament enrollment.

## Project Structure
```
src/
├── app/
│   ├── (auth)/          → login, register
│   ├── (dashboard)/     → social, tournaments, bets, chat, gcoins, notifications, profile, settings, brand, challenges
│   ├── (admin)/         → admin panel (RBAC: admin/organizer only)
│   └── brands/          → public brand landing page
├── components/
│   ├── ads/             → SponsorBanner (feed + sidebar ads)
│   ├── dashboard/       → Sidebar, Header, BottomNav
│   ├── feed/            → FeedPost, CreatePostForm, FeedFilters, FeedSidebar
│   └── ui/              → Card, Button, Badge, Avatar, Modal, Tabs, StatsCard, etc.
├── server/
│   ├── api/routers/     → social, user, tournament, match, bet, chat, gcoin, notification, brand, challenge
│   ├── db/              → schema.ts, index.ts, seed.ts
│   └── services/        → notification-service.ts, bet-settlement.ts, auto-feed.ts
├── lib/                 → trpc.ts, utils.ts, constants.ts
└── stores/              → ui-store.ts
```
