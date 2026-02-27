# Modelo de Dados - Sportio

## Diagrama de Entidades Principais

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  users   │────<│ user_roles   │     │   sports     │
│          │     └──────────────┘     └──────┬───────┘
│          │                                  │
│          │──────────────────────────────────┐│
│          │     ┌──────────────┐     ┌──────┴───────┐
│          │────<│ user_sports  │────>│  tournaments │
│          │     └──────────────┘     │              │
│          │                          │              │
│          │     ┌──────────────┐     │              │
│          │────<│ gcoin_txns   │     │              │
│          │     └──────────────┘     │              │
│          │                          │              │
│          │     ┌──────────────┐     │              │
│          │────<│ enrollments  │────>│              │
│          │     └──────────────┘     └──────────────┘
│          │                                  │
│          │     ┌──────────────┐     ┌──────┴───────┐
│          │────<│    bets      │────>│   matches    │
│          │     └──────────────┘     └──────────────┘
│          │                                  │
│          │     ┌──────────────┐     ┌──────┴───────┐
│          │────<│   posts      │     │match_results │
│          │     └──────────────┘     └──────────────┘
│          │
│          │     ┌──────────────┐
│          │────<│  followers   │
└──────────┘     └──────────────┘
```

---

## Schema Detalhado (Drizzle ORM)

### users

```typescript
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  emailVerified: timestamp('email_verified'),
  phone: varchar('phone', { length: 20 }).unique(),
  phoneVerified: timestamp('phone_verified'),
  name: varchar('name', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 100 }),
  avatarUrl: text('avatar_url'),
  coverUrl: text('cover_url'),
  bio: text('bio'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 2 }),
  country: varchar('country', { length: 2 }).default('BR'),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  isVerified: boolean('is_verified').default(false),
  verifiedAt: timestamp('verified_at'),
  // GCoins
  gcoinsReal: integer('gcoins_real').default(0),
  gcoinsGamification: integer('gcoins_gamification').default(0),
  // Streak
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  streakMultiplier: doublePrecision('streak_multiplier').default(1.0),
  lastActivityAt: timestamp('last_activity_at'),
  // Social
  instagramHandle: varchar('instagram_handle', { length: 100 }),
  tiktokHandle: varchar('tiktok_handle', { length: 100 }),
  // Meta
  referralCode: varchar('referral_code', { length: 20 }).unique(),
  referredBy: uuid('referred_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### user_roles

```typescript
export const userRoles = pgTable('user_roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: roleEnum('role').notNull(), // athlete, organizer, brand, fan, bettor, referee, trainer, nutritionist, photographer, arena_owner
  isActive: boolean('is_active').default(true),
  verificationStatus: verificationEnum('verification_status').default('pending'),
  verificationDocs: jsonb('verification_docs'), // documentos enviados
  metadata: jsonb('metadata'), // dados especificos do role
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userRoleUnique: unique().on(table.userId, table.role),
}));
```

### sports

```typescript
export const sports = pgTable('sports', {
  id: varchar('id', { length: 50 }).primaryKey(), // 'futebol', 'beach-tennis', etc.
  name: varchar('name', { length: 100 }).notNull(),
  icon: varchar('icon', { length: 50 }),
  category: sportCategoryEnum('category').notNull(), // 'core', 'expanded'
  isActive: boolean('is_active').default(true),
  config: jsonb('config'), // regras especificas do esporte
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### user_sports

```typescript
export const userSports = pgTable('user_sports', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  sportId: varchar('sport_id', { length: 50 }).references(() => sports.id).notNull(),
  level: levelEnum('level').default('C'), // A, B, C
  position: varchar('position', { length: 50 }), // ex: 'armador', 'ponteira'
  rating: doublePrecision('rating').default(0),
  totalMatches: integer('total_matches').default(0),
  wins: integer('wins').default(0),
  losses: integer('losses').default(0),
  stats: jsonb('stats'), // estatisticas especificas do esporte
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userSportUnique: unique().on(table.userId, table.sportId),
}));
```

### tournaments

```typescript
export const tournaments = pgTable('tournaments', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizerId: uuid('organizer_id').references(() => users.id).notNull(),
  sportId: varchar('sport_id', { length: 50 }).references(() => sports.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  description: text('description'),
  coverImage: text('cover_image'),
  // Config
  format: formatEnum('format').notNull(), // cup, league, swiss, rapid, virtual
  maxParticipants: integer('max_participants'),
  minParticipants: integer('min_participants'),
  teamSize: integer('team_size'), // 1=individual, 2=dupla, 3=3x3, 5=5x5
  level: levelEnum('level'), // A, B, C ou null=todos
  // Datas
  registrationStart: timestamp('registration_start').notNull(),
  registrationEnd: timestamp('registration_end').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  // Local
  isOnline: boolean('is_online').default(false),
  venueName: varchar('venue_name', { length: 255 }),
  venueAddress: text('venue_address'),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  arenaId: uuid('arena_id').references(() => arenas.id),
  // Financeiro
  entryFee: integer('entry_fee').default(0), // em centavos
  currency: varchar('currency', { length: 3 }).default('BRL'),
  prizePool: integer('prize_pool').default(0),
  prizeDistribution: jsonb('prize_distribution'), // {1st: 60%, 2nd: 30%, 3rd: 10%}
  // Status
  status: tournamentStatusEnum('status').default('draft'),
  // Patrocinio
  sponsorId: uuid('sponsor_id').references(() => users.id),
  sponsorConfig: jsonb('sponsor_config'),
  // Meta
  rules: text('rules'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### enrollments

```typescript
export const enrollments = pgTable('enrollments', {
  id: uuid('id').defaultRandom().primaryKey(),
  tournamentId: uuid('tournament_id').references(() => tournaments.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  teamId: uuid('team_id').references(() => teams.id),
  status: enrollmentStatusEnum('status').default('pending'), // pending, confirmed, checked_in, eliminated, completed
  paymentStatus: paymentStatusEnum('payment_status').default('pending'),
  paymentId: varchar('payment_id', { length: 255 }),
  seed: integer('seed'), // posicao no chaveamento
  result: jsonb('result'), // resultado final
  gcoinsEarned: integer('gcoins_earned').default(0),
  checkedInAt: timestamp('checked_in_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userTournamentUnique: unique().on(table.userId, table.tournamentId),
}));
```

### matches

```typescript
export const matches = pgTable('matches', {
  id: uuid('id').defaultRandom().primaryKey(),
  tournamentId: uuid('tournament_id').references(() => tournaments.id).notNull(),
  round: integer('round').notNull(),
  matchNumber: integer('match_number').notNull(),
  // Participantes
  homeId: uuid('home_id'), // userId ou teamId
  awayId: uuid('away_id'),
  // Resultado
  homeScore: integer('home_score'),
  awayScore: integer('away_score'),
  winnerId: uuid('winner_id'),
  status: matchStatusEnum('status').default('scheduled'), // scheduled, live, completed, cancelled
  // Arbitragem
  refereeId: uuid('referee_id').references(() => users.id),
  refereeValidated: boolean('referee_validated').default(false),
  validatedAt: timestamp('validated_at'),
  // Detalhes
  scheduledAt: timestamp('scheduled_at'),
  startedAt: timestamp('started_at'),
  endedAt: timestamp('ended_at'),
  stats: jsonb('stats'), // estatisticas detalhadas
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### teams

```typescript
export const teams = pgTable('teams', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  captainId: uuid('captain_id').references(() => users.id).notNull(),
  sportId: varchar('sport_id', { length: 50 }).references(() => sports.id).notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const teamMembers = pgTable('team_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  teamId: uuid('team_id').references(() => teams.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: varchar('role', { length: 50 }), // capitao, jogador, reserva
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
}, (table) => ({
  teamMemberUnique: unique().on(table.teamId, table.userId),
}));
```

### gcoin_transactions

```typescript
export const gcoinTransactions = pgTable('gcoin_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: gcoinTypeEnum('type').notNull(), // 'real', 'gamification'
  amount: integer('amount').notNull(), // positivo=credito, negativo=debito
  balance: integer('balance').notNull(), // saldo apos transacao
  category: gcoinCategoryEnum('category').notNull(),
  // Categorias: tournament_prize, match_reward, bet_win, bet_loss,
  //             referral, social_engagement, challenge, withdrawal,
  //             purchase, sponsorship, streak_bonus, validation
  description: text('description'),
  // Referencia
  referenceType: varchar('reference_type', { length: 50 }), // tournament, match, bet, challenge
  referenceId: uuid('reference_id'),
  // Meta
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### bets

```typescript
export const bets = pgTable('bets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  matchId: uuid('match_id').references(() => matches.id).notNull(),
  type: betTypeEnum('type').notNull(), // winner, exact_score, mvp, combined
  gcoinType: gcoinTypeEnum('gcoin_type').notNull(), // real, gamification
  amount: integer('amount').notNull(),
  odds: doublePrecision('odds').notNull(),
  prediction: jsonb('prediction').notNull(), // {winner: 'home', score: '2-1', mvp: userId}
  result: betResultEnum('result'), // pending, won, lost, cancelled
  payout: integer('payout'),
  settledAt: timestamp('settled_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### posts (Feed Social)

```typescript
export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  content: text('content'),
  mediaUrls: jsonb('media_urls'), // [{url, type: 'image'|'video'}]
  // Referencia (pode ser sobre torneio, partida, desafio)
  referenceType: varchar('reference_type', { length: 50 }),
  referenceId: uuid('reference_id'),
  sportId: varchar('sport_id', { length: 50 }).references(() => sports.id),
  // Metricas
  likesCount: integer('likes_count').default(0),
  commentsCount: integer('comments_count').default(0),
  sharesCount: integer('shares_count').default(0),
  viewsCount: integer('views_count').default(0),
  // Status
  isSponsored: boolean('is_sponsored').default(false),
  sponsorId: uuid('sponsor_id').references(() => users.id),
  isPinned: boolean('is_pinned').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id').references(() => posts.id).notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  parentId: uuid('parent_id'), // para respostas aninhadas
  likesCount: integer('likes_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const likes = pgTable('likes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  postId: uuid('post_id').references(() => posts.id),
  commentId: uuid('comment_id').references(() => comments.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userPostUnique: unique().on(table.userId, table.postId),
}));
```

### followers

```typescript
export const followers = pgTable('followers', {
  id: uuid('id').defaultRandom().primaryKey(),
  followerId: uuid('follower_id').references(() => users.id).notNull(),
  followingId: uuid('following_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  followerUnique: unique().on(table.followerId, table.followingId),
}));
```

### challenges

```typescript
export const challenges = pgTable('challenges', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  sportId: varchar('sport_id', { length: 50 }).references(() => sports.id),
  type: challengeTypeEnum('type').notNull(), // daily, weekly, monthly, sponsored
  // Meta
  goal: jsonb('goal').notNull(), // {metric: 'distance_km', target: 50}
  reward: integer('reward').notNull(), // GCoins
  rewardType: gcoinTypeEnum('reward_type').notNull(),
  // Patrocinio
  sponsorId: uuid('sponsor_id').references(() => users.id),
  // Periodo
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  maxParticipants: integer('max_participants'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const challengeParticipants = pgTable('challenge_participants', {
  id: uuid('id').defaultRandom().primaryKey(),
  challengeId: uuid('challenge_id').references(() => challenges.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  progress: doublePrecision('progress').default(0),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at'),
  gcoinsEarned: integer('gcoins_earned').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### arenas

```typescript
export const arenas = pgTable('arenas', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  description: text('description'),
  address: text('address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 2 }).notNull(),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  photos: jsonb('photos'),
  // Facilidades
  sports: jsonb('sports'), // esportes suportados
  amenities: jsonb('amenities'), // churrasqueira, vestiario, etc.
  courts: integer('courts').default(1),
  // Financeiro
  hourlyRate: integer('hourly_rate'), // centavos
  cashbackPercent: doublePrecision('cashback_percent').default(5),
  // Metricas
  rating: doublePrecision('rating').default(0),
  totalBookings: integer('total_bookings').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### notifications

```typescript
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  body: text('body'),
  data: jsonb('data'),
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### blog_posts

```typescript
export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  seoTitle: varchar('seo_title', { length: 255 }),
  description: text('description'),
  content: text('content').notNull(), // markdown
  coverImage: text('cover_image'),
  authorName: varchar('author_name', { length: 100 }).notNull(),
  authorRole: varchar('author_role', { length: 100 }),
  authorAvatar: text('author_avatar'),
  readTime: integer('read_time'), // minutos
  sportId: varchar('sport_id', { length: 50 }).references(() => sports.id),
  targetRole: varchar('target_role', { length: 50 }), // para quem e o artigo
  tags: jsonb('tags'), // array de strings
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### chat_messages

```typescript
export const chatRooms = pgTable('chat_rooms', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: chatRoomTypeEnum('type').notNull(), // direct, group, tournament
  name: varchar('name', { length: 255 }),
  referenceId: uuid('reference_id'), // tournamentId, matchId, etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const chatMembers = pgTable('chat_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  roomId: uuid('room_id').references(() => chatRooms.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  lastReadAt: timestamp('last_read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  roomId: uuid('room_id').references(() => chatRooms.id).notNull(),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  content: text('content'),
  mediaUrl: text('media_url'),
  type: messageTypeEnum('type').default('text'), // text, image, video, system
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

---

## Indices Importantes

```sql
-- Performance queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_sports_user ON user_sports(user_id);
CREATE INDEX idx_user_sports_sport ON user_sports(sport_id);

-- Torneios
CREATE INDEX idx_tournaments_sport ON tournaments(sport_id);
CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_tournaments_start ON tournaments(start_date);
CREATE INDEX idx_tournaments_organizer ON tournaments(organizer_id);
CREATE INDEX idx_enrollments_tournament ON enrollments(tournament_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);

-- Partidas
CREATE INDEX idx_matches_tournament ON matches(tournament_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_referee ON matches(referee_id);

-- GCoins
CREATE INDEX idx_gcoin_txns_user ON gcoin_transactions(user_id);
CREATE INDEX idx_gcoin_txns_created ON gcoin_transactions(created_at);
CREATE INDEX idx_gcoin_txns_category ON gcoin_transactions(category);

-- Social
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_sport ON posts(sport_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_followers_follower ON followers(follower_id);
CREATE INDEX idx_followers_following ON followers(following_id);

-- Apostas
CREATE INDEX idx_bets_user ON bets(user_id);
CREATE INDEX idx_bets_match ON bets(match_id);
CREATE INDEX idx_bets_result ON bets(result);

-- Notificacoes
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- Blog
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_sport ON blog_posts(sport_id);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at DESC);

-- Geo
CREATE INDEX idx_users_location ON users USING gist (
  ll_to_earth(latitude, longitude)
);
CREATE INDEX idx_arenas_location ON arenas USING gist (
  ll_to_earth(latitude, longitude)
);
```

---

## Enums

```typescript
export const roleEnum = pgEnum('role', [
  'athlete', 'organizer', 'brand', 'fan', 'bettor',
  'referee', 'trainer', 'nutritionist', 'photographer',
  'arena_owner', 'admin'
]);

export const levelEnum = pgEnum('level', ['A', 'B', 'C']);

export const verificationEnum = pgEnum('verification_status', [
  'pending', 'submitted', 'verified', 'rejected'
]);

export const tournamentStatusEnum = pgEnum('tournament_status', [
  'draft', 'registration_open', 'registration_closed',
  'in_progress', 'completed', 'cancelled'
]);

export const formatEnum = pgEnum('format', [
  'cup', 'league', 'swiss', 'rapid', 'virtual'
]);

export const matchStatusEnum = pgEnum('match_status', [
  'scheduled', 'live', 'completed', 'cancelled'
]);

export const betTypeEnum = pgEnum('bet_type', [
  'winner', 'exact_score', 'mvp', 'combined'
]);

export const betResultEnum = pgEnum('bet_result', [
  'pending', 'won', 'lost', 'cancelled'
]);

export const gcoinTypeEnum = pgEnum('gcoin_type', ['real', 'gamification']);

export const gcoinCategoryEnum = pgEnum('gcoin_category', [
  'tournament_prize', 'match_reward', 'bet_win', 'bet_loss',
  'referral', 'social_engagement', 'challenge', 'withdrawal',
  'purchase', 'sponsorship', 'streak_bonus', 'validation',
  'signup_bonus', 'transfer'
]);
```
