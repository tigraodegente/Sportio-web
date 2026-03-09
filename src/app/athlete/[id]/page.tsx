"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CreatorBanner } from "@/components/creator/CreatorBanner";
import { CreatorHeader } from "@/components/creator/CreatorHeader";
import { CreatorTabs } from "@/components/creator/CreatorTabs";
import { CreatorSidebar } from "@/components/creator/CreatorSidebar";
import { GiftPickerModal } from "@/components/creator/GiftPickerModal";
import { PostsTab } from "@/components/creator/tabs/PostsTab";
import { StatsTab } from "@/components/creator/tabs/StatsTab";
import { EquipmentTab } from "@/components/creator/tabs/EquipmentTab";
import { ExclusiveTab } from "@/components/creator/tabs/ExclusiveTab";
import { Trophy, Award, Loader2, UserX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import type { CreatorProfile, SubscriptionTier, FanEntry, GiftType } from "@/lib/types/creator";

// Static gift types (app-level configuration)
const GIFT_TYPES: GiftType[] = [
  { id: "gift-heart", name: "Coracao", emoji: "\u2764\uFE0F", cost: 10 },
  { id: "gift-fire", name: "Fogo", emoji: "\uD83D\uDD25", cost: 25 },
  { id: "gift-trophy", name: "Trofeu", emoji: "\uD83C\uDFC6", cost: 50 },
  { id: "gift-star", name: "Estrela", emoji: "\u2B50", cost: 100 },
  { id: "gift-rocket", name: "Foguete", emoji: "\uD83D\uDE80", cost: 250 },
  { id: "gift-diamond", name: "Diamante", emoji: "\uD83D\uDC8E", cost: 500 },
  { id: "gift-crown", name: "Coroa", emoji: "\uD83D\uDC51", cost: 1000 },
  { id: "gift-medal", name: "Medalha", emoji: "\uD83C\uDFC5", cost: 2500 },
];

// Placeholder tabs for Torneios and Conquistas (to be wired to real data later)
function TorneiosTab() {
  return (
    <div className="text-center py-16 text-slate-400">
      <Trophy className="w-10 h-10 mx-auto mb-3" />
      <p className="text-sm font-medium">Nenhum torneio registrado ainda.</p>
      <p className="text-xs mt-1">Os torneios do atleta aparecerão aqui.</p>
    </div>
  );
}

function ConquistasTab() {
  return (
    <div className="text-center py-16 text-slate-400">
      <Award className="w-10 h-10 mx-auto mb-3" />
      <p className="text-sm font-medium">Nenhuma conquista registrada ainda.</p>
      <p className="text-xs mt-1">As conquistas do atleta aparecerão aqui.</p>
    </div>
  );
}

// Loading skeleton
function ProfileSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50/50">
      {/* Banner skeleton */}
      <div className="w-full h-48 sm:h-64 lg:h-72 bg-slate-200 animate-pulse rounded-b-2xl sm:rounded-b-3xl" />

      {/* Header skeleton */}
      <div className="px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-300 animate-pulse ring-4 ring-white" />
          <div className="flex-1 space-y-3 pb-1">
            <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg" />
            <div className="h-4 w-32 bg-slate-200 animate-pulse rounded-lg" />
            <div className="flex gap-2">
              <div className="h-6 w-24 bg-slate-200 animate-pulse rounded-full" />
              <div className="h-6 w-24 bg-slate-200 animate-pulse rounded-full" />
            </div>
            <div className="flex gap-4">
              <div className="h-4 w-20 bg-slate-200 animate-pulse rounded-lg" />
              <div className="h-4 w-20 bg-slate-200 animate-pulse rounded-lg" />
              <div className="h-4 w-20 bg-slate-200 animate-pulse rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="h-10 w-full bg-slate-200 animate-pulse rounded-lg" />
            <div className="h-32 w-full bg-slate-200 animate-pulse rounded-xl" />
            <div className="h-32 w-full bg-slate-200 animate-pulse rounded-xl" />
          </div>
          <div className="w-full lg:w-80 space-y-4">
            <div className="h-48 w-full bg-slate-200 animate-pulse rounded-xl" />
            <div className="h-48 w-full bg-slate-200 animate-pulse rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}

// Not found state
function ProfileNotFound() {
  return (
    <main className="min-h-screen bg-slate-50/50 flex items-center justify-center">
      <div className="text-center">
        <UserX className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-700 mb-2">Atleta nao encontrado</h1>
        <p className="text-slate-500">Este perfil nao existe ou foi removido.</p>
      </div>
    </main>
  );
}

/**
 * Map fan badge tier from the totalGcoinsGiven amount.
 * The fan_badges table stores a tier enum, but topFans from the
 * creator profile endpoint returns raw data. We use the tier field
 * directly if available, or derive it from gcoins amount.
 */
function deriveFanTier(tier: string | undefined, totalGcoins: number): "diamond" | "gold" | "silver" | "bronze" {
  if (tier === "diamond" || tier === "gold" || tier === "silver" || tier === "bronze") {
    return tier;
  }
  if (totalGcoins >= 10000) return "diamond";
  if (totalGcoins >= 5000) return "gold";
  if (totalGcoins >= 1000) return "silver";
  return "bronze";
}

export default function AthleteProfilePage() {
  const params = useParams();
  const athleteId = params.id as string;

  const [giftModalOpen, setGiftModalOpen] = useState(false);

  // Fetch creator profile (includes tiers, subscriber count, top fans)
  const profileQuery = trpc.creator.getCreatorProfile.useQuery(
    { creatorId: athleteId },
    { enabled: !!athleteId, retry: false }
  );

  // Fetch user data (includes roles, sports)
  const userQuery = trpc.user.getById.useQuery(
    { id: athleteId },
    { enabled: !!athleteId, retry: false }
  );

  // Fetch follower counts
  const followCountsQuery = trpc.user.getFollowCounts.useQuery(
    { userId: athleteId },
    { enabled: !!athleteId }
  );

  // Loading state
  if (profileQuery.isLoading || userQuery.isLoading) {
    return <ProfileSkeleton />;
  }

  // Error / not found state
  if (profileQuery.error || userQuery.error || !profileQuery.data || !userQuery.data) {
    return <ProfileNotFound />;
  }

  const profileData = profileQuery.data;
  const userData = userQuery.data;
  const followCounts = followCountsQuery.data;

  // Map real data into the CreatorProfile shape expected by components
  const creator: CreatorProfile = {
    id: userData.id,
    name: userData.name,
    username: userData.email?.split("@")[0] ?? userData.name.toLowerCase().replace(/\s/g, ""),
    avatar: userData.image ?? null,
    bannerImage: null, // not stored in user table
    bio: profileData.bio ?? userData.bio ?? "",
    location: [profileData.city ?? userData.city, profileData.state ?? userData.state]
      .filter(Boolean)
      .join(", "),
    level: userData.level ?? 1,
    xp: userData.xp ?? 0,
    xpToNextLevel: 6000,
    sports: (userData.sports ?? []).map((s: any) => ({
      id: s.sport?.slug ?? s.sportId ?? "",
      name: s.sport?.name ?? "",
      icon: s.sport?.icon ?? "",
    })),
    stats: {
      tournamentsWon: 0, // to be wired to tournament data later
      rating: Number(userData.sports?.[0]?.rating ?? 0),
      followers: followCounts?.followers ?? 0,
      subscribers: Number(profileData.subscriberCount) ?? 0,
      activeFans: profileData.topFans?.length ?? 0,
    },
    isVerified: userData.isVerified ?? false,
    sponsor: null, // no sponsor data in current schema
  };

  // Map tiers from creator profile to the SubscriptionTier shape
  const tiers: SubscriptionTier[] = (profileData.tiers ?? []).map((t: any, index: number) => ({
    id: t.id,
    name: t.name,
    price: (t.priceMonthlyC ?? 0) / 100, // stored in cents
    benefits: t.benefits ?? [],
    color: index === 0 ? "blue" : index === 1 ? "amber" : "purple",
    popular: index === 1, // second tier is usually the popular one
  }));

  // Map top fans to FanEntry shape
  const fans: FanEntry[] = (profileData.topFans ?? []).map((f: any) => ({
    id: f.fanId,
    name: f.fanName ?? "Fan",
    avatar: f.fanAvatar ?? null,
    totalGCoins: f.totalGcoinsGiven ?? 0,
    tier: deriveFanTier(f.tier, f.totalGcoinsGiven ?? 0),
  }));

  return (
    <main className="min-h-screen bg-slate-50/50">
      {/* Banner */}
      <CreatorBanner creator={creator} />

      {/* Header */}
      <CreatorHeader
        creator={creator}
        tiers={tiers}
        onGiftClick={() => setGiftModalOpen(true)}
      />

      {/* Main content with sidebar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content area */}
          <div className="flex-1 min-w-0">
            <CreatorTabs>
              {(tab) => {
                switch (tab) {
                  case "posts":
                    return (
                      <div className="text-center py-16 text-slate-400">
                        <p className="text-sm font-medium">Nenhum post ainda.</p>
                        <p className="text-xs mt-1">Os posts do atleta aparecerão aqui.</p>
                      </div>
                    );
                  case "stats":
                    return (
                      <div className="text-center py-16 text-slate-400">
                        <p className="text-sm font-medium">Estatisticas em breve.</p>
                        <p className="text-xs mt-1">As estatisticas do atleta aparecerão aqui.</p>
                      </div>
                    );
                  case "torneios":
                    return <TorneiosTab />;
                  case "exclusivo":
                    return <ExclusiveTab posts={[]} tiers={tiers} />;
                  case "conquistas":
                    return <ConquistasTab />;
                  case "equipamento":
                    return (
                      <div className="text-center py-16 text-slate-400">
                        <p className="text-sm font-medium">Nenhum equipamento cadastrado.</p>
                        <p className="text-xs mt-1">Os equipamentos do atleta aparecerão aqui.</p>
                      </div>
                    );
                  default:
                    return null;
                }
              }}
            </CreatorTabs>
          </div>

          {/* Sidebar (desktop) */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <CreatorSidebar tiers={tiers} fans={fans} />
            </div>
          </div>
        </div>
      </div>

      {/* Gift Picker Modal */}
      <GiftPickerModal
        isOpen={giftModalOpen}
        onClose={() => setGiftModalOpen(false)}
        gifts={GIFT_TYPES}
        recipientName={creator.name}
      />
    </main>
  );
}
