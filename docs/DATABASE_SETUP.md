# Database Setup -- Sportio

## 1. Create a Neon PostgreSQL Database

1. Go to [neon.tech](https://neon.tech) and create a project
2. Copy the connection string (DATABASE_URL)
3. Add to `.env.local`:
   ```
   DATABASE_URL=postgres://user:pass@host/dbname?sslmode=require
   ```

## 2. Push Schema

```bash
npx drizzle-kit push
```

This creates all 57 tables, 26 enums, and associated indexes directly from the Drizzle schema.

Alternatively, to use the SQL migration file:

```bash
npx drizzle-kit migrate
```

## 3. Run Seed

```bash
npm run db:seed
```

Seeds the following reference data:

| Category | Count | Description |
|----------|-------|-------------|
| Admin user | 1 | admin@sportio.com.br with admin role |
| Sports | 43 | Traditional, e-sports, card games, and more |
| Achievements | 55+ | Across all 10 persona types (athlete, organizer, brand, referee, etc.) |
| Missions | 16+ | Daily and weekly missions for all personas |
| Gift types | 7 | Virtual gifts from 5 to 1000 GCoins |
| Pro teams | 20 | Brasileirao Serie A 2026 teams |
| Pro competitions | 5 | Serie A, Serie B, Copa do Brasil, Libertadores, Sula |

## 4. Verify

```bash
npx drizzle-kit studio
```

Opens Drizzle Studio at `https://local.drizzle.studio` to inspect your database.

## Tables Overview

| Category | Tables | Description |
|----------|--------|-------------|
| Auth | users, accounts, sessions, verification_tokens | NextAuth.js authentication |
| User System | user_roles, user_sports, user_settings, user_favorites | User profiles and preferences |
| Social | posts, comments, likes, followers | Social feed and interactions |
| Competitions | tournaments, enrollments, matches, teams, team_members | User-organized competitions |
| Challenges | challenges, challenge_participants | 1v1 duels and community challenges |
| Creator Economy | creator_tiers, fan_subscriptions, gated_content, gifts, gift_types | Monetization features |
| Creator Analytics | fan_badges, shoutout_requests, affiliate_products, super_comments, creator_stats | Creator tools |
| Pro Sports | pro_teams, pro_athletes, pro_competitions, pro_matches, pro_match_odds | Professional league data |
| Betting | bets, pro_bets, parlays, parlay_legs | GCoin betting (amateur and pro) |
| Gamification | achievements, user_achievements, missions, user_missions | XP, levels, and rewards |
| Payments | payment_orders, withdrawal_requests, gcoin_transactions | Financial transactions |
| Brand | brand_campaigns, campaign_redemptions, tournament_sponsors, tournament_prizes, tournament_invites | B2B sponsorship |
| Chat | chat_rooms, chat_members, chat_messages | Messaging |
| Content | blog_posts, notifications | Blog and notifications |
| Venues | arenas | Arena/venue management |

## Useful Commands

```bash
# Generate new migration after schema changes
npm run db:generate

# Push schema directly (development)
npm run db:push

# Run migrations (production)
npm run db:migrate

# Open visual database explorer
npm run db:studio

# Seed reference data
npm run db:seed

# Full setup (push + seed)
npm run db:setup
```

## Schema File

The source of truth for the database schema is:

```
src/server/db/schema.ts
```

Seed scripts are at:

```
src/server/db/seed.ts              -- Main seed orchestrator
src/server/db/seed-gift-types.ts   -- Gift type definitions
src/server/db/seed-pro-teams.ts    -- Brasileirao Serie A teams
src/server/db/seed-pro-competitions.ts -- Pro competition definitions
```

## Enums (26 total)

The schema defines 26 PostgreSQL enums covering: payment status, payment method, withdrawal status, user roles, sponsorship status, ad placement, campaign type, skill level, verification status, tournament status/format, match status, challenge status/type, bet type/result, GCoin type/category, enrollment status, sponsor tier, notification type, pro match status, pro bet status, parlay status, favorite entity type, achievement tier, mission frequency, subscription status, shoutout status, fan badge tier, invite type, and invite status.
