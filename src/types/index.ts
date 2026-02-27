import type { users, tournaments, matches, posts, bets, sports, teams, notifications, chatRooms, chatMessages, challenges, arenas, gcoinTransactions } from "@/server/db/schema";

// Inferred types from Drizzle schema
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Tournament = typeof tournaments.$inferSelect;
export type NewTournament = typeof tournaments.$inferInsert;

export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type Bet = typeof bets.$inferSelect;
export type NewBet = typeof bets.$inferInsert;

export type Sport = typeof sports.$inferSelect;
export type NewSport = typeof sports.$inferInsert;

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;

export type Notification = typeof notifications.$inferSelect;

export type ChatRoom = typeof chatRooms.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type Challenge = typeof challenges.$inferSelect;
export type Arena = typeof arenas.$inferSelect;

export type GCoinTransaction = typeof gcoinTransactions.$inferSelect;

// Extended types with relations
export type UserWithRoles = User & {
  roles: { role: string; verificationStatus: string }[];
};

export type TournamentWithDetails = Tournament & {
  sport: Sport;
  organizer: Pick<User, "id" | "name" | "image">;
  _count?: { enrollments: number };
};

export type MatchWithPlayers = Match & {
  player1: Pick<User, "id" | "name" | "image"> | null;
  player2: Pick<User, "id" | "name" | "image"> | null;
  referee: Pick<User, "id" | "name" | "image"> | null;
};

export type PostWithAuthor = Post & {
  user: Pick<User, "id" | "name" | "image">;
  isLiked?: boolean;
};

export type BetWithDetails = Bet & {
  match: MatchWithPlayers;
  tournament: Pick<Tournament, "id" | "name">;
};

export type ChatRoomWithMembers = ChatRoom & {
  members: Pick<User, "id" | "name" | "image">[];
  lastMessage?: ChatMessage;
};

// Pagination
export type PaginatedResult<T> = {
  items: T[];
  nextCursor?: string;
  total?: number;
};

// Dashboard stats
export type DashboardStats = {
  gcoinsReal: number;
  gcoinsGamification: number;
  totalTournaments: number;
  wins: number;
  losses: number;
  ranking: number;
  xp: number;
  level: number;
};
