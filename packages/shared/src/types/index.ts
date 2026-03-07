// ============================================
// Sportio Shared Types
// Domain types that can be used across web and mobile
// ============================================

// User types
export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  username: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  cpf: string | null;
  level: number;
  xp: number;
  gcoinsReal: number;
  gcoinsGamification: number;
  isPremium: boolean;
  onboardingCompleted: boolean;
  createdAt: Date;
}

export type UserRole =
  | "athlete"
  | "organizer"
  | "brand"
  | "fan"
  | "bettor"
  | "referee"
  | "trainer"
  | "nutritionist"
  | "photographer"
  | "arena_owner"
  | "admin";

export interface UserWithRoles extends UserProfile {
  roles: { role: UserRole; verificationStatus: VerificationStatus }[];
}

// Tournament types
export type TournamentStatus =
  | "draft"
  | "registration_open"
  | "registration_closed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type TournamentFormat =
  | "single_elimination"
  | "double_elimination"
  | "round_robin"
  | "swiss"
  | "league";

export interface TournamentSummary {
  id: string;
  name: string;
  sportId: string;
  status: TournamentStatus;
  format: TournamentFormat;
  maxParticipants: number;
  entryFee: number;
  prizePot: number;
  startDate: Date;
  enrollmentCount?: number;
}

// Match types
export type MatchStatus = "scheduled" | "live" | "completed" | "cancelled";

export interface MatchSummary {
  id: string;
  tournamentId: string;
  status: MatchStatus;
  player1: { id: string; name: string | null; image: string | null } | null;
  player2: { id: string; name: string | null; image: string | null } | null;
  score1: number | null;
  score2: number | null;
  scheduledAt: Date | null;
}

// Challenge types
export type ChallengeStatus =
  | "pending"
  | "accepted"
  | "betting_open"
  | "in_progress"
  | "completed"
  | "cancelled";

export type ChallengeType = "duel" | "community";

// Bet types
export type BetType = "winner" | "score" | "mvp" | "custom";
export type BetResult = "pending" | "won" | "lost" | "cancelled" | "refunded";

// GCoin types
export type GCoinType = "real" | "gamification";

export type GCoinCategory =
  | "tournament_prize"
  | "tournament_entry"
  | "bet_win"
  | "bet_place"
  | "challenge_reward"
  | "purchase"
  | "withdrawal"
  | "referral_bonus"
  | "daily_bonus"
  | "achievement"
  | "brand_reward"
  | "transfer";

export interface GCoinTransaction {
  id: string;
  userId: string;
  amount: number;
  type: GCoinType;
  category: GCoinCategory;
  description: string | null;
  createdAt: Date;
}

// Payment types
export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded"
  | "expired";

export type PaymentMethod = "pix" | "credit_card" | "debit_card" | "boleto";

export type WithdrawalStatus =
  | "pending"
  | "approved"
  | "processing"
  | "completed"
  | "rejected";

// Verification
export type VerificationStatus = "pending" | "submitted" | "verified" | "rejected";

// Social / Feed
export interface PostSummary {
  id: string;
  userId: string;
  content: string;
  imageUrl: string | null;
  likesCount: number;
  commentsCount: number;
  author: { id: string; name: string | null; image: string | null };
  isLiked?: boolean;
  createdAt: Date;
}

// Dashboard stats
export interface DashboardStats {
  gcoinsReal: number;
  gcoinsGamification: number;
  totalTournaments: number;
  wins: number;
  losses: number;
  ranking: number;
  xp: number;
  level: number;
}

// Pagination
export interface PaginatedResult<T> {
  items: T[];
  nextCursor?: string;
  total?: number;
}

// Chat
export interface ChatRoomSummary {
  id: string;
  name: string | null;
  members: { id: string; name: string | null; image: string | null }[];
  lastMessage?: {
    content: string;
    createdAt: Date;
  };
}

// Notification
export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// Sport definition (UI-level, not DB)
export interface SportDefinition {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}
