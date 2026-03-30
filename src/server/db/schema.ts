import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  decimal,
  pgEnum,
  uuid,
  jsonb,
  index,
  uniqueIndex,
  date,
  real,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==================== ENUMS ====================

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "processing",
  "completed",
  "failed",
  "refunded",
  "expired",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "pix",
  "credit_card",
  "debit_card",
  "boleto",
]);

export const withdrawalStatusEnum = pgEnum("withdrawal_status", [
  "pending",
  "approved",
  "processing",
  "completed",
  "rejected",
]);

export const userRoleEnum = pgEnum("user_role", [
  "athlete",
  "organizer",
  "brand",
  "fan",
  "bettor",
  "referee",
  "trainer",
  "nutritionist",
  "photographer",
  "arena_owner",
  "admin",
]);

export const sponsorshipStatusEnum = pgEnum("sponsorship_status", [
  "pending",
  "active",
  "paused",
  "completed",
  "rejected",
]);

export const adPlacementEnum = pgEnum("ad_placement", [
  "feed_banner",
  "sidebar",
  "tournament_sponsor",
  "profile_banner",
  "challenge_sponsor",
  "post_promoted",
]);

export const campaignTypeEnum = pgEnum("campaign_type", [
  "banner",
  "product_giveaway",
  "gcoin_reward",
  "tournament_sponsor",
  "challenge_sponsor",
]);

export const levelEnum = pgEnum("level", ["A", "B", "C"]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "pending",
  "submitted",
  "verified",
  "rejected",
]);

export const tournamentStatusEnum = pgEnum("tournament_status", [
  "draft",
  "registration_open",
  "registration_closed",
  "in_progress",
  "completed",
  "cancelled",
]);

export const tournamentFormatEnum = pgEnum("tournament_format", [
  "single_elimination",
  "double_elimination",
  "round_robin",
  "swiss",
  "league",
]);

export const matchStatusEnum = pgEnum("match_status", [
  "scheduled",
  "live",
  "completed",
  "cancelled",
]);

export const challengeStatusEnum = pgEnum("challenge_status", [
  "pending",         // Created, waiting opponent to accept
  "accepted",        // Opponent accepted, waiting to open bets
  "betting_open",    // Open for bets
  "in_progress",     // Challenge happening (bets closed)
  "completed",       // Result determined
  "cancelled",       // Cancelled/declined
]);

export const challengeTypeEnum = pgEnum("challenge_type", [
  "duel",            // 1v1 challenge between two players
  "community",       // Community challenge (original type - goal-based)
]);

export const betTypeEnum = pgEnum("bet_type", [
  "winner",
  "score",
  "mvp",
  "custom",
]);

export const betResultEnum = pgEnum("bet_result", [
  "pending",
  "won",
  "lost",
  "cancelled",
  "refunded",
]);

export const gcoinTypeEnum = pgEnum("gcoin_type", ["real", "gamification"]);

export const gcoinCategoryEnum = pgEnum("gcoin_category", [
  "tournament_prize",
  "tournament_entry",
  "bet_win",
  "bet_place",
  "challenge_reward",
  "purchase",
  "withdrawal",
  "referral_bonus",
  "daily_bonus",
  "achievement",
  "brand_reward",
  "transfer",
  "bet_cashout",
  "gift_sent",
  "gift_received",
  "subscription_payment",
  "subscription_revenue",
  "shoutout_payment",
  "shoutout_revenue",
  "affiliate_commission",
]);

export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "pending",
  "confirmed",
  "checked_in",
  "eliminated",
  "winner",
  "cancelled",
]);

export const sponsorTierEnum = pgEnum("sponsor_tier", [
  "main",
  "gold",
  "silver",
  "bronze",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "tournament",
  "match",
  "gcoin",
  "social",
  "bet",
  "chat",
  "system",
  "challenge",
]);

// ==================== TABLES ====================

// Users
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password"),
    emailVerified: timestamp("email_verified"),
    image: text("image"),
    phone: varchar("phone", { length: 20 }),
    bio: text("bio"),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 50 }),
    country: varchar("country", { length: 50 }).default("Brasil"),
    gcoinsReal: decimal("gcoins_real", { precision: 12, scale: 2 }).default("0"),
    gcoinsGamification: decimal("gcoins_gamification", { precision: 12, scale: 2 }).default("0"),
    xp: integer("xp").default(0),
    level: integer("level").default(1),
    isPro: boolean("is_pro").default(false),
    isVerified: boolean("is_verified").default(false),
    instagram: varchar("instagram", { length: 100 }),
    twitter: varchar("twitter", { length: 100 }),
    youtube: varchar("youtube", { length: 100 }),
    pixKey: varchar("pix_key", { length: 255 }),
    stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
    index("users_city_idx").on(table.city),
  ]
);

// Auth Accounts (NextAuth)
export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    idToken: text("id_token"),
    sessionState: varchar("session_state", { length: 255 }),
  },
  (table) => [
    uniqueIndex("accounts_provider_idx").on(table.provider, table.providerAccountId),
    index("accounts_user_idx").on(table.userId),
  ]
);

// Sessions (NextAuth)
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
    expires: timestamp("expires").notNull(),
  },
  (table) => [index("sessions_user_idx").on(table.userId)]
);

// Verification Tokens (NextAuth)
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expires: timestamp("expires").notNull(),
  },
  (table) => [
    uniqueIndex("verification_tokens_idx").on(table.identifier, table.token),
  ]
);

// User Roles
export const userRoles = pgTable(
  "user_roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: userRoleEnum("role").notNull(),
    verificationStatus: verificationStatusEnum("verification_status").default("pending"),
    verifiedAt: timestamp("verified_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("user_roles_unique_idx").on(table.userId, table.role),
    index("user_roles_user_idx").on(table.userId),
  ]
);

// Sports
export const sports = pgTable("sports", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 20 }),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User Sports (which sports a user plays)
export const userSports = pgTable(
  "user_sports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sportId: uuid("sport_id")
      .notNull()
      .references(() => sports.id, { onDelete: "cascade" }),
    level: levelEnum("level").default("C"),
    position: varchar("position", { length: 50 }),
    rating: decimal("rating", { precision: 8, scale: 2 }).default("1000"),
    wins: integer("wins").default(0),
    losses: integer("losses").default(0),
    draws: integer("draws").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("user_sports_unique_idx").on(table.userId, table.sportId),
    index("user_sports_user_idx").on(table.userId),
    index("user_sports_sport_idx").on(table.sportId),
  ]
);

// Tournaments
export const tournaments = pgTable(
  "tournaments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    rules: text("rules"),
    coverImage: text("cover_image"),
    sportId: uuid("sport_id")
      .notNull()
      .references(() => sports.id),
    organizerId: uuid("organizer_id")
      .notNull()
      .references(() => users.id),
    format: tournamentFormatEnum("format").default("single_elimination"),
    status: tournamentStatusEnum("status").default("draft"),
    maxParticipants: integer("max_participants").default(32),
    currentParticipants: integer("current_participants").default(0),
    minParticipants: integer("min_participants").default(4),
    entryFee: decimal("entry_fee", { precision: 10, scale: 2 }).default("0"),
    entryFeeType: gcoinTypeEnum("entry_fee_type").default("real"),
    prizePool: decimal("prize_pool", { precision: 12, scale: 2 }).default("0"),
    prizeDistribution: jsonb("prize_distribution"),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 50 }),
    address: text("address"),
    isOnline: boolean("is_online").default(false),
    level: levelEnum("level"),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    registrationDeadline: timestamp("registration_deadline"),
    bracketData: jsonb("bracket_data"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("tournaments_sport_idx").on(table.sportId),
    index("tournaments_organizer_idx").on(table.organizerId),
    index("tournaments_status_idx").on(table.status),
    index("tournaments_start_idx").on(table.startDate),
  ]
);

// Enrollments
export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tournamentId: uuid("tournament_id")
      .notNull()
      .references(() => tournaments.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    teamId: uuid("team_id").references(() => teams.id),
    status: enrollmentStatusEnum("status").default("pending"),
    seed: integer("seed"),
    placement: integer("placement"),
    paidAmount: decimal("paid_amount", { precision: 10, scale: 2 }),
    checkedInAt: timestamp("checked_in_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("enrollments_unique_idx").on(table.tournamentId, table.userId),
    index("enrollments_tournament_idx").on(table.tournamentId),
    index("enrollments_user_idx").on(table.userId),
  ]
);

// Teams
export const teams = pgTable(
  "teams",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    logo: text("logo"),
    sportId: uuid("sport_id").references(() => sports.id),
    captainId: uuid("captain_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("teams_captain_idx").on(table.captainId)]
);

// Team Members
export const teamMembers = pgTable(
  "team_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    role: varchar("role", { length: 50 }).default("member"),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("team_members_unique_idx").on(table.teamId, table.userId),
  ]
);

// Matches
export const matches = pgTable(
  "matches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tournamentId: uuid("tournament_id")
      .notNull()
      .references(() => tournaments.id, { onDelete: "cascade" }),
    round: integer("round").notNull(),
    position: integer("position").notNull(),
    player1Id: uuid("player1_id").references(() => users.id),
    player2Id: uuid("player2_id").references(() => users.id),
    team1Id: uuid("team1_id").references(() => teams.id),
    team2Id: uuid("team2_id").references(() => teams.id),
    winnerId: uuid("winner_id").references(() => users.id),
    score1: integer("score1"),
    score2: integer("score2"),
    setsData: jsonb("sets_data"),
    status: matchStatusEnum("status").default("scheduled"),
    refereeId: uuid("referee_id").references(() => users.id),
    scheduledAt: timestamp("scheduled_at"),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("matches_tournament_idx").on(table.tournamentId),
    index("matches_status_idx").on(table.status),
  ]
);

// GCoin Transactions
export const gcoinTransactions = pgTable(
  "gcoin_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    type: gcoinTypeEnum("type").notNull(),
    category: gcoinCategoryEnum("category").notNull(),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    balanceAfter: decimal("balance_after", { precision: 12, scale: 2 }),
    description: text("description"),
    referenceId: uuid("reference_id"),
    referenceType: varchar("reference_type", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("gcoin_tx_user_idx").on(table.userId),
    index("gcoin_tx_type_idx").on(table.type),
    index("gcoin_tx_created_idx").on(table.createdAt),
  ]
);

// Bets
export const bets = pgTable(
  "bets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    matchId: uuid("match_id").references(() => matches.id),
    tournamentId: uuid("tournament_id").references(() => tournaments.id),
    challengeId: uuid("challenge_id").references(() => challenges.id),
    betType: betTypeEnum("bet_type").notNull(),
    prediction: jsonb("prediction").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    odds: decimal("odds", { precision: 6, scale: 2 }),
    potentialWin: decimal("potential_win", { precision: 12, scale: 2 }),
    result: betResultEnum("result").default("pending"),
    settledAt: timestamp("settled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("bets_user_idx").on(table.userId),
    index("bets_match_idx").on(table.matchId),
    index("bets_challenge_idx").on(table.challengeId),
    index("bets_result_idx").on(table.result),
  ]
);

// Posts (Social Feed)
export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    images: jsonb("images"),
    sportId: uuid("sport_id").references(() => sports.id),
    tournamentId: uuid("tournament_id").references(() => tournaments.id),
    likesCount: integer("likes_count").default(0),
    commentsCount: integer("comments_count").default(0),
    isPublished: boolean("is_published").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("posts_user_idx").on(table.userId),
    index("posts_created_idx").on(table.createdAt),
  ]
);

// Comments
export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    parentId: uuid("parent_id"),
    content: text("content").notNull(),
    likesCount: integer("likes_count").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("comments_post_idx").on(table.postId),
    index("comments_user_idx").on(table.userId),
  ]
);

// Likes
export const likes = pgTable(
  "likes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
    commentId: uuid("comment_id").references(() => comments.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("likes_user_idx").on(table.userId)]
);

// Followers
export const followers = pgTable(
  "followers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    followerId: uuid("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: uuid("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("followers_unique_idx").on(table.followerId, table.followingId),
    index("followers_follower_idx").on(table.followerId),
    index("followers_following_idx").on(table.followingId),
  ]
);

// Challenges
export const challenges = pgTable(
  "challenges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    challengeType: challengeTypeEnum("challenge_type").default("duel").notNull(),
    status: challengeStatusEnum("status").default("pending").notNull(),
    sportId: uuid("sport_id").references(() => sports.id),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => users.id),
    // 1v1 Duel fields
    opponentId: uuid("opponent_id").references(() => users.id),
    winnerId: uuid("winner_id").references(() => users.id),
    score1: integer("score1"),  // creator's score
    score2: integer("score2"),  // opponent's score
    // Betting
    bettingEnabled: boolean("betting_enabled").default(true),
    bettingDeadline: timestamp("betting_deadline"),
    // Reward
    reward: decimal("reward", { precision: 10, scale: 2 }).default("0"),
    rewardType: gcoinTypeEnum("reward_type").default("gamification"),
    wagerAmount: decimal("wager_amount", { precision: 10, scale: 2 }).default("0"), // GCoins each player puts up
    // Community challenge fields (kept for backward compat)
    goal: jsonb("goal"),
    maxParticipants: integer("max_participants"),
    // Timing
    startsAt: timestamp("starts_at"),
    endsAt: timestamp("ends_at"),
    acceptedAt: timestamp("accepted_at"),
    completedAt: timestamp("completed_at"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("challenges_sport_idx").on(table.sportId),
    index("challenges_creator_idx").on(table.creatorId),
    index("challenges_opponent_idx").on(table.opponentId),
    index("challenges_status_idx").on(table.status),
    index("challenges_type_idx").on(table.challengeType),
  ]
);

// Challenge Participants
export const challengeParticipants = pgTable(
  "challenge_participants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    challengeId: uuid("challenge_id")
      .notNull()
      .references(() => challenges.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    progress: jsonb("progress"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("challenge_participants_unique_idx").on(table.challengeId, table.userId),
  ]
);

// Arenas
export const arenas = pgTable(
  "arenas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id),
    address: text("address"),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 50 }),
    phone: varchar("phone", { length: 20 }),
    images: jsonb("images"),
    sports: jsonb("sports"),
    pricePerHour: decimal("price_per_hour", { precision: 8, scale: 2 }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("arenas_owner_idx").on(table.ownerId),
    index("arenas_city_idx").on(table.city),
  ]
);

// Notifications
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message"),
    data: jsonb("data"),
    isRead: boolean("is_read").default(false),
    whatsappSent: boolean("whatsapp_sent").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("notifications_user_idx").on(table.userId),
    index("notifications_read_idx").on(table.userId, table.isRead),
  ]
);

// Chat Rooms
export const chatRooms = pgTable("chat_rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }),
  isGroup: boolean("is_group").default(false),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Chat Members
export const chatMembers = pgTable(
  "chat_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roomId: uuid("room_id")
      .notNull()
      .references(() => chatRooms.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    lastReadAt: timestamp("last_read_at"),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("chat_members_unique_idx").on(table.roomId, table.userId),
  ]
);

// Chat Messages
export const chatMessages = pgTable(
  "chat_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roomId: uuid("room_id")
      .notNull()
      .references(() => chatRooms.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id),
    content: text("content").notNull(),
    images: jsonb("images"),
    isEdited: boolean("is_edited").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("chat_messages_room_idx").on(table.roomId),
    index("chat_messages_created_idx").on(table.createdAt),
  ]
);

// Blog Posts (for DB-backed blog in future)
export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    content: text("content").notNull(),
    excerpt: text("excerpt"),
    coverImage: text("cover_image"),
    authorId: uuid("author_id").references(() => users.id),
    sport: varchar("sport", { length: 50 }),
    tags: jsonb("tags"),
    isPublished: boolean("is_published").default(false),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("blog_posts_slug_idx").on(table.slug),
    index("blog_posts_published_idx").on(table.isPublished),
  ]
);

// Brand Campaigns (sponsorship)
export const brandCampaigns = pgTable(
  "brand_campaigns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    brandUserId: uuid("brand_user_id")
      .notNull()
      .references(() => users.id),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    type: campaignTypeEnum("type").notNull(),
    placement: adPlacementEnum("placement").notNull(),
    status: sponsorshipStatusEnum("status").default("pending"),
    budget: decimal("budget", { precision: 12, scale: 2 }).default("0"),
    spent: decimal("spent", { precision: 12, scale: 2 }).default("0"),
    imageUrl: text("image_url"),
    linkUrl: text("link_url"),
    targetSportId: uuid("target_sport_id").references(() => sports.id),
    targetTournamentId: uuid("target_tournament_id").references(() => tournaments.id),
    impressions: integer("impressions").default(0),
    clicks: integer("clicks").default(0),
    productName: varchar("product_name", { length: 255 }),
    productDescription: text("product_description"),
    productImage: text("product_image"),
    gcoinRewardAmount: decimal("gcoin_reward_amount", { precision: 10, scale: 2 }),
    maxRedemptions: integer("max_redemptions"),
    currentRedemptions: integer("current_redemptions").default(0),
    startsAt: timestamp("starts_at"),
    endsAt: timestamp("ends_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("brand_campaigns_brand_idx").on(table.brandUserId),
    index("brand_campaigns_status_idx").on(table.status),
    index("brand_campaigns_placement_idx").on(table.placement),
  ]
);

// Campaign Redemptions (for product giveaways / gcoin rewards)
export const campaignRedemptions = pgTable(
  "campaign_redemptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    campaignId: uuid("campaign_id")
      .notNull()
      .references(() => brandCampaigns.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    redeemedAt: timestamp("redeemed_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("campaign_redemptions_unique_idx").on(table.campaignId, table.userId),
    index("campaign_redemptions_campaign_idx").on(table.campaignId),
  ]
);

// Tournament Sponsors (multiple brands per tournament)
export const tournamentSponsors = pgTable(
  "tournament_sponsors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tournamentId: uuid("tournament_id")
      .notNull()
      .references(() => tournaments.id, { onDelete: "cascade" }),
    brandUserId: uuid("brand_user_id")
      .notNull()
      .references(() => users.id),
    campaignId: uuid("campaign_id")
      .references(() => brandCampaigns.id),
    tier: sponsorTierEnum("tier").notNull().default("bronze"),
    gcoinContribution: decimal("gcoin_contribution", { precision: 12, scale: 2 }).default("0"),
    productPrizes: jsonb("product_prizes"), // [{name, description, image, forPlacement}]
    logoUrl: text("logo_url"),
    message: text("message"),
    status: sponsorshipStatusEnum("status").default("pending"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("tournament_sponsors_tournament_idx").on(table.tournamentId),
    index("tournament_sponsors_brand_idx").on(table.brandUserId),
    uniqueIndex("tournament_sponsors_unique_idx").on(table.tournamentId, table.brandUserId),
  ]
);

// Tournament Prizes (GCoins or products awarded to placement winners)
export const tournamentPrizes = pgTable(
  "tournament_prizes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tournamentId: uuid("tournament_id")
      .notNull()
      .references(() => tournaments.id, { onDelete: "cascade" }),
    sponsorId: uuid("sponsor_id")
      .references(() => tournamentSponsors.id, { onDelete: "set null" }),
    placement: integer("placement").notNull(), // 1 = champion, 2 = runner-up, 3 = third, etc.
    prizeType: varchar("prize_type", { length: 20 }).notNull(), // 'gcoin' or 'product'
    gcoinAmount: decimal("gcoin_amount", { precision: 12, scale: 2 }),
    productName: varchar("product_name", { length: 255 }),
    productDescription: text("product_description"),
    productImage: text("product_image"),
    isAwarded: boolean("is_awarded").default(false),
    awardedToUserId: uuid("awarded_to_user_id").references(() => users.id),
    awardedAt: timestamp("awarded_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("tournament_prizes_tournament_idx").on(table.tournamentId),
    index("tournament_prizes_sponsor_idx").on(table.sponsorId),
  ]
);

// Tournament Invites (organizer invites athletes/brands)
export const inviteTypeEnum = pgEnum("invite_type", ["athlete", "sponsor"]);
export const inviteStatusEnum = pgEnum("invite_status", ["pending", "accepted", "declined", "expired"]);

export const tournamentInvites = pgTable(
  "tournament_invites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tournamentId: uuid("tournament_id")
      .notNull()
      .references(() => tournaments.id, { onDelete: "cascade" }),
    invitedUserId: uuid("invited_user_id")
      .notNull()
      .references(() => users.id),
    invitedByUserId: uuid("invited_by_user_id")
      .notNull()
      .references(() => users.id),
    type: inviteTypeEnum("type").notNull(),
    status: inviteStatusEnum("status").default("pending"),
    message: text("message"),
    // For sponsor invites: suggested tier
    suggestedTier: sponsorTierEnum("suggested_tier"),
    respondedAt: timestamp("responded_at"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("tournament_invites_unique_idx").on(table.tournamentId, table.invitedUserId, table.type),
    index("tournament_invites_tournament_idx").on(table.tournamentId),
    index("tournament_invites_invited_idx").on(table.invitedUserId),
    index("tournament_invites_status_idx").on(table.invitedUserId, table.status),
  ]
);

// User Settings (notification + privacy preferences)
export const userSettings = pgTable("user_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  // Notification preferences
  notifyTournaments: boolean("notify_tournaments").default(true),
  notifyMatches: boolean("notify_matches").default(true),
  notifyGcoins: boolean("notify_gcoins").default(true),
  notifySocial: boolean("notify_social").default(true),
  notifyChat: boolean("notify_chat").default(true),
  notifyBets: boolean("notify_bets").default(true),
  notifyMarketing: boolean("notify_marketing").default(false),
  // Privacy preferences
  publicProfile: boolean("public_profile").default(true),
  showResults: boolean("show_results").default(true),
  showGcoins: boolean("show_gcoins").default(true),
  allowMessages: boolean("allow_messages").default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payment Orders (GCoin purchases)
export const paymentOrders = pgTable(
  "payment_orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    gcoinAmount: decimal("gcoin_amount", { precision: 12, scale: 2 }).notNull(),
    brlAmount: decimal("brl_amount", { precision: 12, scale: 2 }).notNull(),
    method: paymentMethodEnum("method").notNull(),
    status: paymentStatusEnum("status").default("pending"),
    gatewayId: varchar("gateway_id", { length: 255 }), // simulated gateway transaction ID
    gatewayData: jsonb("gateway_data"), // PIX code, card last4, etc.
    paidAt: timestamp("paid_at"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("payment_orders_user_idx").on(table.userId),
    index("payment_orders_status_idx").on(table.status),
    index("payment_orders_created_idx").on(table.createdAt),
  ]
);

// Withdrawal Requests (GCoin → BRL via PIX)
export const withdrawalRequests = pgTable(
  "withdrawal_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    gcoinAmount: decimal("gcoin_amount", { precision: 12, scale: 2 }).notNull(),
    brlAmount: decimal("brl_amount", { precision: 12, scale: 2 }).notNull(),
    pixKey: varchar("pix_key", { length: 255 }).notNull(),
    status: withdrawalStatusEnum("status").default("pending"),
    reviewedBy: uuid("reviewed_by").references(() => users.id),
    reviewedAt: timestamp("reviewed_at"),
    rejectionReason: text("rejection_reason"),
    processedAt: timestamp("processed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("withdrawal_requests_user_idx").on(table.userId),
    index("withdrawal_requests_status_idx").on(table.status),
  ]
);

// Achievement Definitions (system-defined, not user-created)
export const achievementTierEnum = pgEnum("achievement_tier", [
  "bronze",
  "silver",
  "gold",
  "platinum",
  "diamond",
]);

export const missionFrequencyEnum = pgEnum("mission_frequency", [
  "daily",
  "weekly",
  "monthly",
  "one_time",
]);

export const achievements = pgTable(
  "achievements",
  {
    id: varchar("id", { length: 100 }).primaryKey(), // e.g. "athlete_first_win"
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    icon: varchar("icon", { length: 50 }),
    tier: achievementTierEnum("tier").notNull(),
    category: varchar("category", { length: 50 }).notNull(), // e.g. "athlete", "organizer", "brand"
    targetRole: userRoleEnum("target_role"), // which persona this is for (null = all)
    requirement: jsonb("requirement").notNull(), // { type: "count", metric: "matches_won", value: 1 }
    xpReward: integer("xp_reward").default(0),
    gcoinReward: integer("gcoin_reward").default(0),
    sortOrder: integer("sort_order").default(0),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("achievements_category_idx").on(table.category),
    index("achievements_role_idx").on(table.targetRole),
  ]
);

// User Achievements (earned by users)
export const userAchievements = pgTable(
  "user_achievements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    achievementId: varchar("achievement_id", { length: 100 })
      .notNull()
      .references(() => achievements.id),
    progress: integer("progress").default(0), // current progress toward requirement
    completedAt: timestamp("completed_at"), // null = in progress
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("user_achievements_unique_idx").on(table.userId, table.achievementId),
    index("user_achievements_user_idx").on(table.userId),
    index("user_achievements_completed_idx").on(table.completedAt),
  ]
);

// Mission Definitions (daily/weekly rotating quests)
export const missions = pgTable(
  "missions",
  {
    id: varchar("id", { length: 100 }).primaryKey(), // e.g. "daily_post_1"
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    icon: varchar("icon", { length: 50 }),
    frequency: missionFrequencyEnum("frequency").notNull(),
    targetRole: userRoleEnum("target_role"), // null = all
    requirement: jsonb("requirement").notNull(), // { type: "action", action: "create_post", count: 1 }
    xpReward: integer("xp_reward").default(0),
    gcoinReward: integer("gcoin_reward").default(0),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("missions_frequency_idx").on(table.frequency),
    index("missions_role_idx").on(table.targetRole),
  ]
);

// User Missions (tracking user progress on missions)
export const userMissions = pgTable(
  "user_missions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    missionId: varchar("mission_id", { length: 100 })
      .notNull()
      .references(() => missions.id),
    progress: integer("progress").default(0),
    completedAt: timestamp("completed_at"),
    periodStart: timestamp("period_start").notNull(), // start of daily/weekly period
    periodEnd: timestamp("period_end").notNull(), // end of period
    rewardClaimed: boolean("reward_claimed").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("user_missions_user_idx").on(table.userId),
    index("user_missions_period_idx").on(table.periodStart, table.periodEnd),
    uniqueIndex("user_missions_unique_idx").on(table.userId, table.missionId, table.periodStart),
  ]
);

// ==================== PRO SPORTS (Professional Leagues) ====================

export const proMatchStatusEnum = pgEnum("pro_match_status", [
  "scheduled",
  "live",
  "halftime",
  "completed",
  "cancelled",
  "postponed",
]);

export const proBetStatusEnum = pgEnum("pro_bet_status", [
  "pending",
  "won",
  "lost",
  "cashed_out",
  "void",
]);

export const parlayStatusEnum = pgEnum("parlay_status", [
  "pending",
  "won",
  "lost",
  "partial",
  "cashed_out",
  "void",
]);

export const proMarketTypeEnum = pgEnum("pro_market_type", [
  "1x2",
  "over_under",
  "btts",
  "handicap",
  "correct_score",
  "goalscorer",
]);

export const parlayLegStatusEnum = pgEnum("parlay_leg_status", [
  "pending",
  "won",
  "lost",
  "void",
]);

export const favoriteEntityTypeEnum = pgEnum("favorite_entity_type", [
  "team",
  "athlete",
  "competition",
]);

export const proTeams = pgTable(
  "pro_teams",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    shortName: varchar("short_name", { length: 50 }),
    logoUrl: text("logo_url"),
    sportId: uuid("sport_id")
      .notNull()
      .references(() => sports.id),
    league: text("league"),
    country: varchar("country", { length: 100 }),
    externalId: text("external_id").unique(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("pro_teams_sport_idx").on(table.sportId),
    uniqueIndex("pro_teams_external_id_idx").on(table.externalId),
  ]
);

export const proAthletes = pgTable(
  "pro_athletes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    photoUrl: text("photo_url"),
    teamId: uuid("team_id").references(() => proTeams.id),
    sportId: uuid("sport_id")
      .notNull()
      .references(() => sports.id),
    position: varchar("position", { length: 100 }),
    nationality: varchar("nationality", { length: 100 }),
    externalId: text("external_id").unique(),
    stats: jsonb("stats"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("pro_athletes_team_idx").on(table.teamId),
    index("pro_athletes_sport_idx").on(table.sportId),
    uniqueIndex("pro_athletes_external_id_idx").on(table.externalId),
  ]
);

export const proCompetitions = pgTable(
  "pro_competitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    sportId: uuid("sport_id")
      .notNull()
      .references(() => sports.id),
    country: varchar("country", { length: 100 }),
    season: varchar("season", { length: 50 }),
    logoUrl: text("logo_url"),
    externalId: text("external_id").unique(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("pro_competitions_sport_idx").on(table.sportId),
    uniqueIndex("pro_competitions_external_id_idx").on(table.externalId),
  ]
);

export const proMatches = pgTable(
  "pro_matches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    competitionId: uuid("competition_id")
      .notNull()
      .references(() => proCompetitions.id),
    homeTeamId: uuid("home_team_id")
      .notNull()
      .references(() => proTeams.id),
    awayTeamId: uuid("away_team_id")
      .notNull()
      .references(() => proTeams.id),
    status: proMatchStatusEnum("status").default("scheduled"),
    homeScore: integer("home_score").default(0),
    awayScore: integer("away_score").default(0),
    kickoffAt: timestamp("kickoff_at"),
    venue: text("venue"),
    externalId: text("external_id").unique(),
    stats: jsonb("stats"),
    events: jsonb("events"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("pro_matches_competition_idx").on(table.competitionId),
    index("pro_matches_home_team_idx").on(table.homeTeamId),
    index("pro_matches_away_team_idx").on(table.awayTeamId),
    index("pro_matches_status_idx").on(table.status),
    index("pro_matches_kickoff_idx").on(table.kickoffAt),
    uniqueIndex("pro_matches_external_id_idx").on(table.externalId),
  ]
);

export const proMatchOdds = pgTable(
  "pro_match_odds",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => proMatches.id, { onDelete: "cascade" }),
    marketType: proMarketTypeEnum("market_type").notNull(),
    selection: text("selection").notNull(),
    oddsDecimal: decimal("odds_decimal", { precision: 8, scale: 2 }).notNull(),
    isActive: boolean("is_active").default(true),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("pro_match_odds_match_idx").on(table.matchId),
    index("pro_match_odds_market_idx").on(table.marketType),
  ]
);

export const proBets = pgTable(
  "pro_bets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    matchId: uuid("match_id")
      .notNull()
      .references(() => proMatches.id),
    marketType: proMarketTypeEnum("market_type").notNull(),
    selection: text("selection").notNull(),
    gcoinAmount: integer("gcoin_amount").notNull(),
    oddsAtPlacement: decimal("odds_at_placement", { precision: 8, scale: 2 }).notNull(),
    potentialWinnings: integer("potential_winnings").notNull(),
    status: proBetStatusEnum("status").default("pending"),
    settledAt: timestamp("settled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("pro_bets_user_idx").on(table.userId),
    index("pro_bets_match_idx").on(table.matchId),
    index("pro_bets_status_idx").on(table.status),
  ]
);

export const parlays = pgTable(
  "parlays",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    gcoinAmount: integer("gcoin_amount").notNull(),
    totalOdds: decimal("total_odds", { precision: 10, scale: 2 }).notNull(),
    potentialWinnings: integer("potential_winnings").notNull(),
    status: parlayStatusEnum("status").default("pending"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    settledAt: timestamp("settled_at"),
  },
  (table) => [
    index("parlays_user_idx").on(table.userId),
    index("parlays_status_idx").on(table.status),
  ]
);

export const parlayLegs = pgTable(
  "parlay_legs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    parlayId: uuid("parlay_id")
      .notNull()
      .references(() => parlays.id, { onDelete: "cascade" }),
    matchId: uuid("match_id")
      .notNull()
      .references(() => proMatches.id),
    marketType: proMarketTypeEnum("market_type").notNull(),
    selection: text("selection").notNull(),
    odds: decimal("odds", { precision: 8, scale: 2 }).notNull(),
    status: parlayLegStatusEnum("status").default("pending"),
  },
  (table) => [
    index("parlay_legs_parlay_idx").on(table.parlayId),
    index("parlay_legs_match_idx").on(table.matchId),
  ]
);

export const userFavorites = pgTable(
  "user_favorites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    entityType: favoriteEntityTypeEnum("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("user_favorites_unique_idx").on(table.userId, table.entityType, table.entityId),
    index("user_favorites_user_idx").on(table.userId),
    index("user_favorites_entity_idx").on(table.entityType, table.entityId),
  ]
);

// ==================== RELATIONS ====================

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  roles: many(userRoles),
  sports: many(userSports),
  tournaments: many(tournaments),
  enrollments: many(enrollments),
  teams: many(teams),
  posts: many(posts),
  bets: many(bets),
  proBets: many(proBets),
  parlays: many(parlays),
  favorites: many(userFavorites),
  gcoinTransactions: many(gcoinTransactions),
  notifications: many(notifications),
  followers: many(followers, { relationName: "following" }),
  following: many(followers, { relationName: "follower" }),
  settings: one(userSettings, { fields: [users.id], references: [userSettings.userId] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, { fields: [userRoles.userId], references: [users.id] }),
}));

export const sportsRelations = relations(sports, ({ many }) => ({
  userSports: many(userSports),
  tournaments: many(tournaments),
  proTeams: many(proTeams),
  proAthletes: many(proAthletes),
  proCompetitions: many(proCompetitions),
}));

export const userSportsRelations = relations(userSports, ({ one }) => ({
  user: one(users, { fields: [userSports.userId], references: [users.id] }),
  sport: one(sports, { fields: [userSports.sportId], references: [sports.id] }),
}));

export const tournamentsRelations = relations(tournaments, ({ one, many }) => ({
  sport: one(sports, { fields: [tournaments.sportId], references: [sports.id] }),
  organizer: one(users, { fields: [tournaments.organizerId], references: [users.id] }),
  enrollments: many(enrollments),
  matches: many(matches),
  sponsors: many(tournamentSponsors),
  prizes: many(tournamentPrizes),
  invites: many(tournamentInvites),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  tournament: one(tournaments, { fields: [enrollments.tournamentId], references: [tournaments.id] }),
  user: one(users, { fields: [enrollments.userId], references: [users.id] }),
  team: one(teams, { fields: [enrollments.teamId], references: [teams.id] }),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  captain: one(users, { fields: [teams.captainId], references: [users.id] }),
  sport: one(sports, { fields: [teams.sportId], references: [sports.id] }),
  members: many(teamMembers),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, { fields: [teamMembers.teamId], references: [teams.id] }),
  user: one(users, { fields: [teamMembers.userId], references: [users.id] }),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  tournament: one(tournaments, { fields: [matches.tournamentId], references: [tournaments.id] }),
  player1: one(users, { fields: [matches.player1Id], references: [users.id], relationName: "player1" }),
  player2: one(users, { fields: [matches.player2Id], references: [users.id], relationName: "player2" }),
  referee: one(users, { fields: [matches.refereeId], references: [users.id], relationName: "referee" }),
  bets: many(bets),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  sport: one(sports, { fields: [posts.sportId], references: [sports.id] }),
  comments: many(comments),
  likes: many(likes),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, { fields: [likes.userId], references: [users.id] }),
  post: one(posts, { fields: [likes.postId], references: [posts.id] }),
  comment: one(comments, { fields: [likes.commentId], references: [comments.id] }),
}));

export const followersRelations = relations(followers, ({ one }) => ({
  follower: one(users, { fields: [followers.followerId], references: [users.id], relationName: "follower" }),
  following: one(users, { fields: [followers.followingId], references: [users.id], relationName: "following" }),
}));

export const betsRelations = relations(bets, ({ one }) => ({
  user: one(users, { fields: [bets.userId], references: [users.id] }),
  match: one(matches, { fields: [bets.matchId], references: [matches.id] }),
  tournament: one(tournaments, { fields: [bets.tournamentId], references: [tournaments.id] }),
  challenge: one(challenges, { fields: [bets.challengeId], references: [challenges.id] }),
}));

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  sport: one(sports, { fields: [challenges.sportId], references: [sports.id] }),
  creator: one(users, { fields: [challenges.creatorId], references: [users.id], relationName: "challengeCreator" }),
  opponent: one(users, { fields: [challenges.opponentId], references: [users.id], relationName: "challengeOpponent" }),
  winner: one(users, { fields: [challenges.winnerId], references: [users.id], relationName: "challengeWinner" }),
  participants: many(challengeParticipants),
  bets: many(bets),
}));

export const challengeParticipantsRelations = relations(challengeParticipants, ({ one }) => ({
  challenge: one(challenges, { fields: [challengeParticipants.challengeId], references: [challenges.id] }),
  user: one(users, { fields: [challengeParticipants.userId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const chatRoomsRelations = relations(chatRooms, ({ many }) => ({
  members: many(chatMembers),
  messages: many(chatMessages),
}));

export const chatMembersRelations = relations(chatMembers, ({ one }) => ({
  room: one(chatRooms, { fields: [chatMembers.roomId], references: [chatRooms.id] }),
  user: one(users, { fields: [chatMembers.userId], references: [users.id] }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  room: one(chatRooms, { fields: [chatMessages.roomId], references: [chatRooms.id] }),
  sender: one(users, { fields: [chatMessages.senderId], references: [users.id] }),
}));

export const brandCampaignsRelations = relations(brandCampaigns, ({ one, many }) => ({
  brandUser: one(users, { fields: [brandCampaigns.brandUserId], references: [users.id] }),
  targetSport: one(sports, { fields: [brandCampaigns.targetSportId], references: [sports.id] }),
  targetTournament: one(tournaments, { fields: [brandCampaigns.targetTournamentId], references: [tournaments.id] }),
  redemptions: many(campaignRedemptions),
}));

export const campaignRedemptionsRelations = relations(campaignRedemptions, ({ one }) => ({
  campaign: one(brandCampaigns, { fields: [campaignRedemptions.campaignId], references: [brandCampaigns.id] }),
  user: one(users, { fields: [campaignRedemptions.userId], references: [users.id] }),
}));

export const tournamentSponsorsRelations = relations(tournamentSponsors, ({ one, many }) => ({
  tournament: one(tournaments, { fields: [tournamentSponsors.tournamentId], references: [tournaments.id] }),
  brandUser: one(users, { fields: [tournamentSponsors.brandUserId], references: [users.id] }),
  campaign: one(brandCampaigns, { fields: [tournamentSponsors.campaignId], references: [brandCampaigns.id] }),
  prizes: many(tournamentPrizes),
}));

export const tournamentPrizesRelations = relations(tournamentPrizes, ({ one }) => ({
  tournament: one(tournaments, { fields: [tournamentPrizes.tournamentId], references: [tournaments.id] }),
  sponsor: one(tournamentSponsors, { fields: [tournamentPrizes.sponsorId], references: [tournamentSponsors.id] }),
  awardedTo: one(users, { fields: [tournamentPrizes.awardedToUserId], references: [users.id] }),
}));

export const tournamentInvitesRelations = relations(tournamentInvites, ({ one }) => ({
  tournament: one(tournaments, { fields: [tournamentInvites.tournamentId], references: [tournaments.id] }),
  invitedUser: one(users, { fields: [tournamentInvites.invitedUserId], references: [users.id] }),
  invitedBy: one(users, { fields: [tournamentInvites.invitedByUserId], references: [users.id] }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, { fields: [userSettings.userId], references: [users.id] }),
}));

export const paymentOrdersRelations = relations(paymentOrders, ({ one }) => ({
  user: one(users, { fields: [paymentOrders.userId], references: [users.id] }),
}));

export const withdrawalRequestsRelations = relations(withdrawalRequests, ({ one }) => ({
  user: one(users, { fields: [withdrawalRequests.userId], references: [users.id] }),
  reviewer: one(users, { fields: [withdrawalRequests.reviewedBy], references: [users.id] }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, { fields: [userAchievements.userId], references: [users.id] }),
  achievement: one(achievements, { fields: [userAchievements.achievementId], references: [achievements.id] }),
}));

export const missionsRelations = relations(missions, ({ many }) => ({
  userMissions: many(userMissions),
}));

export const userMissionsRelations = relations(userMissions, ({ one }) => ({
  user: one(users, { fields: [userMissions.userId], references: [users.id] }),
  mission: one(missions, { fields: [userMissions.missionId], references: [missions.id] }),
}));

// ==================== CREATOR ECONOMY ====================

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "cancelled",
  "expired",
  "past_due",
]);

export const shoutoutStatusEnum = pgEnum("shoutout_status", [
  "pending",
  "accepted",
  "completed",
  "cancelled",
  "expired",
]);

export const fanBadgeTierEnum = pgEnum("fan_badge_tier", [
  "bronze",
  "silver",
  "gold",
  "diamond",
]);

// Creator Tiers (subscription levels a creator offers)
export const creatorTiers = pgTable(
  "creator_tiers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    priceMonthlyC: integer("price_monthly_cents").notNull(),
    description: text("description"),
    benefits: jsonb("benefits").$type<string[]>().default([]),
    sortOrder: integer("sort_order").default(0),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("creator_tiers_creator_idx").on(table.creatorId),
    index("creator_tiers_active_idx").on(table.creatorId, table.isActive),
  ]
);

// Fan Subscriptions (fan subscribes to a creator's tier)
export const fanSubscriptions = pgTable(
  "fan_subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fanId: uuid("fan_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tierId: uuid("tier_id")
      .notNull()
      .references(() => creatorTiers.id),
    status: subscriptionStatusEnum("status").default("active"),
    startedAt: timestamp("started_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at"),
    autoRenew: boolean("auto_renew").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("fan_subscriptions_fan_idx").on(table.fanId),
    index("fan_subscriptions_creator_idx").on(table.creatorId),
    index("fan_subscriptions_status_idx").on(table.status),
    uniqueIndex("fan_subscriptions_unique_idx").on(table.fanId, table.creatorId),
  ]
);

// Gift Types (system-defined gift options)
export const giftTypes = pgTable("gift_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  emoji: varchar("emoji", { length: 10 }).notNull(),
  gcoinCost: integer("gcoin_cost").notNull(),
  animationUrl: text("animation_url"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Gifts (sent from one user to another)
export const gifts = pgTable(
  "gifts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id),
    receiverId: uuid("receiver_id")
      .notNull()
      .references(() => users.id),
    giftTypeId: uuid("gift_type_id")
      .notNull()
      .references(() => giftTypes.id),
    message: text("message"),
    postId: uuid("post_id").references(() => posts.id),
    gcoinAmount: integer("gcoin_amount").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("gifts_sender_idx").on(table.senderId),
    index("gifts_receiver_idx").on(table.receiverId),
    index("gifts_created_idx").on(table.createdAt),
  ]
);

// Fan Badges (tracks fan engagement with a creator)
export const fanBadges = pgTable(
  "fan_badges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fanId: uuid("fan_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tier: fanBadgeTierEnum("tier").notNull(),
    totalGcoinsGiven: integer("total_gcoins_given").default(0),
    monthsSubscribed: integer("months_subscribed").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("fan_badges_unique_idx").on(table.fanId, table.creatorId),
    index("fan_badges_creator_idx").on(table.creatorId),
  ]
);

// Shoutout Requests (personalized video requests, Cameo model)
export const shoutoutRequests = pgTable(
  "shoutout_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fanId: uuid("fan_id")
      .notNull()
      .references(() => users.id),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => users.id),
    message: text("message").notNull(),
    gcoinAmount: integer("gcoin_amount").notNull(),
    status: shoutoutStatusEnum("status").default("pending"),
    videoUrl: text("video_url"),
    deadline: timestamp("deadline").notNull(),
    completedAt: timestamp("completed_at"),
    cancelledAt: timestamp("cancelled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("shoutout_requests_fan_idx").on(table.fanId),
    index("shoutout_requests_creator_idx").on(table.creatorId),
    index("shoutout_requests_status_idx").on(table.status),
  ]
);

// Affiliate Products ("Meu Equipamento")
export const affiliateProducts = pgTable(
  "affiliate_products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productName: varchar("product_name", { length: 255 }).notNull(),
    productUrl: text("product_url").notNull(),
    imageUrl: text("image_url"),
    priceCents: integer("price_cents").notNull(),
    commissionPct: decimal("commission_pct", { precision: 5, scale: 2 }).notNull(),
    clicks: integer("clicks").default(0),
    purchases: integer("purchases").default(0),
    totalRevenue: integer("total_revenue").default(0),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("affiliate_products_creator_idx").on(table.creatorId),
    index("affiliate_products_active_idx").on(table.creatorId, table.isActive),
  ]
);

// Gated Content (posts locked behind a subscription tier)
export const gatedContent = pgTable(
  "gated_content",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    minTierId: uuid("min_tier_id")
      .notNull()
      .references(() => creatorTiers.id),
    teaserText: text("teaser_text"),
    teaserImageUrl: text("teaser_image_url"),
  },
  (table) => [
    index("gated_content_creator_idx").on(table.creatorId),
    index("gated_content_post_idx").on(table.postId),
  ]
);

// Super Comments (highlighted / pinned comments with GCoin payment)
export const superComments = pgTable(
  "super_comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    commentId: uuid("comment_id")
      .notNull()
      .references(() => comments.id, { onDelete: "cascade" }),
    gcoinAmount: integer("gcoin_amount").notNull(),
    highlightColor: varchar("highlight_color", { length: 20 }),
    isPinned: boolean("is_pinned").default(false),
  },
  (table) => [
    uniqueIndex("super_comments_comment_idx").on(table.commentId),
  ]
);

// Creator Stats (daily aggregated analytics for a creator)
export const creatorStats = pgTable(
  "creator_stats",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    subscribers: integer("subscribers").default(0),
    giftsReceived: integer("gifts_received").default(0),
    giftRevenueCents: integer("gift_revenue_cents").default(0),
    subscriptionRevenueCents: integer("subscription_revenue_cents").default(0),
    affiliateRevenueCents: integer("affiliate_revenue_cents").default(0),
    impressions: integer("impressions").default(0),
    profileViews: integer("profile_views").default(0),
  },
  (table) => [
    index("creator_stats_creator_idx").on(table.creatorId),
    index("creator_stats_date_idx").on(table.date),
    uniqueIndex("creator_stats_unique_idx").on(table.creatorId, table.date),
  ]
);

// ==================== CREATOR ECONOMY RELATIONS ====================

export const creatorTiersRelations = relations(creatorTiers, ({ one, many }) => ({
  creator: one(users, { fields: [creatorTiers.creatorId], references: [users.id] }),
  subscriptions: many(fanSubscriptions),
  gatedContent: many(gatedContent),
}));

export const fanSubscriptionsRelations = relations(fanSubscriptions, ({ one }) => ({
  fan: one(users, { fields: [fanSubscriptions.fanId], references: [users.id], relationName: "fanSubscriptions" }),
  creator: one(users, { fields: [fanSubscriptions.creatorId], references: [users.id], relationName: "creatorSubscriptions" }),
  tier: one(creatorTiers, { fields: [fanSubscriptions.tierId], references: [creatorTiers.id] }),
}));

export const giftTypesRelations = relations(giftTypes, ({ many }) => ({
  gifts: many(gifts),
}));

export const giftsRelations = relations(gifts, ({ one }) => ({
  sender: one(users, { fields: [gifts.senderId], references: [users.id], relationName: "giftsSent" }),
  receiver: one(users, { fields: [gifts.receiverId], references: [users.id], relationName: "giftsReceived" }),
  giftType: one(giftTypes, { fields: [gifts.giftTypeId], references: [giftTypes.id] }),
  post: one(posts, { fields: [gifts.postId], references: [posts.id] }),
}));

export const fanBadgesRelations = relations(fanBadges, ({ one }) => ({
  fan: one(users, { fields: [fanBadges.fanId], references: [users.id] }),
  creator: one(users, { fields: [fanBadges.creatorId], references: [users.id] }),
}));

export const shoutoutRequestsRelations = relations(shoutoutRequests, ({ one }) => ({
  fan: one(users, { fields: [shoutoutRequests.fanId], references: [users.id] }),
  creator: one(users, { fields: [shoutoutRequests.creatorId], references: [users.id] }),
}));

export const affiliateProductsRelations = relations(affiliateProducts, ({ one }) => ({
  creator: one(users, { fields: [affiliateProducts.creatorId], references: [users.id] }),
}));

export const gatedContentRelations = relations(gatedContent, ({ one }) => ({
  creator: one(users, { fields: [gatedContent.creatorId], references: [users.id] }),
  post: one(posts, { fields: [gatedContent.postId], references: [posts.id] }),
  minTier: one(creatorTiers, { fields: [gatedContent.minTierId], references: [creatorTiers.id] }),
}));

export const superCommentsRelations = relations(superComments, ({ one }) => ({
  comment: one(comments, { fields: [superComments.commentId], references: [comments.id] }),
}));

export const creatorStatsRelations = relations(creatorStats, ({ one }) => ({
  creator: one(users, { fields: [creatorStats.creatorId], references: [users.id] }),
}));

// ==================== PRO SPORTS RELATIONS ====================

export const proTeamsRelations = relations(proTeams, ({ one, many }) => ({
  sport: one(sports, { fields: [proTeams.sportId], references: [sports.id] }),
  athletes: many(proAthletes),
  homeMatches: many(proMatches, { relationName: "homeTeam" }),
  awayMatches: many(proMatches, { relationName: "awayTeam" }),
}));

export const proAthletesRelations = relations(proAthletes, ({ one }) => ({
  team: one(proTeams, { fields: [proAthletes.teamId], references: [proTeams.id] }),
  sport: one(sports, { fields: [proAthletes.sportId], references: [sports.id] }),
}));

export const proCompetitionsRelations = relations(proCompetitions, ({ one, many }) => ({
  sport: one(sports, { fields: [proCompetitions.sportId], references: [sports.id] }),
  matches: many(proMatches),
}));

export const proMatchesRelations = relations(proMatches, ({ one, many }) => ({
  competition: one(proCompetitions, { fields: [proMatches.competitionId], references: [proCompetitions.id] }),
  homeTeam: one(proTeams, { fields: [proMatches.homeTeamId], references: [proTeams.id], relationName: "homeTeam" }),
  awayTeam: one(proTeams, { fields: [proMatches.awayTeamId], references: [proTeams.id], relationName: "awayTeam" }),
  odds: many(proMatchOdds),
  bets: many(proBets),
  parlayLegs: many(parlayLegs),
}));

export const proMatchOddsRelations = relations(proMatchOdds, ({ one }) => ({
  match: one(proMatches, { fields: [proMatchOdds.matchId], references: [proMatches.id] }),
}));

export const proBetsRelations = relations(proBets, ({ one }) => ({
  user: one(users, { fields: [proBets.userId], references: [users.id] }),
  match: one(proMatches, { fields: [proBets.matchId], references: [proMatches.id] }),
}));

export const parlaysRelations = relations(parlays, ({ one, many }) => ({
  user: one(users, { fields: [parlays.userId], references: [users.id] }),
  legs: many(parlayLegs),
}));

export const parlayLegsRelations = relations(parlayLegs, ({ one }) => ({
  parlay: one(parlays, { fields: [parlayLegs.parlayId], references: [parlays.id] }),
  match: one(proMatches, { fields: [parlayLegs.matchId], references: [proMatches.id] }),
}));

export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  user: one(users, { fields: [userFavorites.userId], references: [users.id] }),
}));

