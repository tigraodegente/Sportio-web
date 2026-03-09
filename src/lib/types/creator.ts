// ============================================
// Shared types for Creator/Athlete Profile
// ============================================

export interface CreatorProfile {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  bannerImage: string | null;
  bio: string;
  location: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  sports: { id: string; name: string; icon: string }[];
  stats: {
    tournamentsWon: number;
    rating: number;
    followers: number;
    subscribers: number;
    activeFans: number;
  };
  isVerified: boolean;
  sponsor: {
    name: string;
    logoUrl: string | null;
  } | null;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  color: string;
  popular?: boolean;
}

export interface CreatorPost {
  id: string;
  content: string;
  images: string[];
  likesCount: number;
  commentsCount: number;
  giftsReceived: number;
  createdAt: Date;
  isGated: boolean;
  requiredTier: string | null;
  tierPrice: number | null;
}

export interface CreatorStat {
  sport: string;
  stats: { label: string; value: string; change?: string; changeType?: "positive" | "negative" | "neutral" }[];
  chartData: { month: string; value: number }[];
}

export interface EquipmentProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string | null;
  affiliateUrl: string;
  category: string;
}

export interface FanEntry {
  id: string;
  name: string;
  avatar: string | null;
  totalGCoins: number;
  tier: "diamond" | "gold" | "silver" | "bronze";
}

export interface GiftType {
  id: string;
  name: string;
  emoji: string;
  cost: number;
}
