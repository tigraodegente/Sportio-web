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
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==================== ENUMS ====================

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
]);

export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "pending",
  "confirmed",
  "checked_in",
  "eliminated",
  "winner",
  "cancelled",
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
    rating: decimal("rating", { precision: 4, scale: 2 }).default("1000"),
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
    matchId: uuid("match_id")
      .notNull()
      .references(() => matches.id),
    tournamentId: uuid("tournament_id")
      .notNull()
      .references(() => tournaments.id),
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
    sportId: uuid("sport_id").references(() => sports.id),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => users.id),
    reward: decimal("reward", { precision: 10, scale: 2 }).default("0"),
    rewardType: gcoinTypeEnum("reward_type").default("gamification"),
    goal: jsonb("goal"),
    maxParticipants: integer("max_participants"),
    startsAt: timestamp("starts_at"),
    endsAt: timestamp("ends_at"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("challenges_sport_idx").on(table.sportId)]
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
}));

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  sport: one(sports, { fields: [challenges.sportId], references: [sports.id] }),
  creator: one(users, { fields: [challenges.creatorId], references: [users.id] }),
  participants: many(challengeParticipants),
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

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, { fields: [userSettings.userId], references: [users.id] }),
}));
