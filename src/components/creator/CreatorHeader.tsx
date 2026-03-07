"use client";

import { useState } from "react";
import { MapPin, Trophy, Star, Users, Heart, ChevronDown, Gift, Video, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CreatorProfile, SubscriptionTier } from "@/lib/mock/creator-data";
import { formatGCoins } from "@/lib/utils";

interface CreatorHeaderProps {
  creator: CreatorProfile;
  tiers: SubscriptionTier[];
  onGiftClick: () => void;
  onShoutoutClick?: () => void;
}

const sportEmojis: Record<string, string> = {
  corrida: "\uD83C\uDFC3",
  "beach-tennis": "\uD83C\uDFBE",
  futebol: "\u26BD",
  crossfit: "\uD83C\uDFCB\uFE0F",
  natacao: "\uD83C\uDFCA",
  surf: "\uD83C\uDFC4",
  ciclismo: "\uD83D\uDEB4",
  padel: "\uD83C\uDFBE",
};

function formatCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

export function CreatorHeader({ creator, tiers, onGiftClick }: CreatorHeaderProps) {
  const [showTiers, setShowTiers] = useState(false);

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
        {/* Avatar with level badge */}
        <div className="relative flex-shrink-0">
          <Avatar
            src={creator.avatar}
            name={creator.name}
            size="xl"
            className="w-28 h-28 sm:w-32 sm:h-32 ring-4 ring-white shadow-lg text-3xl"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-amber-400 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md ring-2 ring-white"
          >
            Nv {creator.level}
          </motion.div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 pb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 truncate">
              {creator.name}
            </h1>
            {creator.isVerified && (
              <BadgeCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-slate-500 text-sm mt-0.5">@{creator.username}</p>

          {/* Sport badges */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {creator.sports.map((sport) => (
              <Badge key={sport.id} variant="primary" className="gap-1">
                <span>{sportEmojis[sport.id] || "\uD83C\uDFC5"}</span>
                {sport.name}
              </Badge>
            ))}
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="w-3.5 h-3.5" />
              {creator.location}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 sm:gap-6 mt-3 flex-wrap">
            <StatItem icon={<Star className="w-4 h-4 text-amber-500" />} value={`Nv ${creator.level}`} label="Level" />
            <StatItem icon={<Trophy className="w-4 h-4 text-blue-500" />} value={String(creator.stats.tournamentsWon)} label="Titulos" />
            <StatItem icon={<Star className="w-4 h-4 text-amber-500" />} value={String(creator.stats.rating)} label="Rating" />
          </div>

          {/* Follower counts */}
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-slate-700">
              <strong>{formatCount(creator.stats.followers)}</strong>{" "}
              <span className="text-slate-500">seguidores</span>
            </span>
            <span className="text-slate-700">
              <strong>{formatCount(creator.stats.subscribers)}</strong>{" "}
              <span className="text-slate-500">assinantes</span>
            </span>
            <span className="text-slate-700">
              <strong>{formatCount(creator.stats.activeFans)}</strong>{" "}
              <span className="text-slate-500">fas ativos</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <Button variant="primary" size="md" className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 shadow-green-500/20">
          <Users className="w-4 h-4" />
          Seguir
        </Button>

        <div className="relative">
          <Button
            variant="accent"
            size="md"
            onClick={() => setShowTiers(!showTiers)}
          >
            <Heart className="w-4 h-4" />
            Assinar
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTiers ? "rotate-180" : ""}`} />
          </Button>

          {showTiers && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl border border-slate-100 shadow-xl z-30 p-3 space-y-2"
            >
              {tiers.map((tier) => (
                <button
                  key={tier.id}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100"
                  onClick={() => setShowTiers(false)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-900">{tier.name}</span>
                    <span className="text-sm font-bold text-blue-600">
                      R${tier.price.toFixed(2).replace(".", ",")}/mes
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {tier.benefits.slice(0, 2).join(" \u2022 ")}
                  </p>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <Button variant="outline" size="md" onClick={onGiftClick}>
          <Gift className="w-4 h-4" />
          Gift
        </Button>

        <Button variant="ghost" size="md">
          <Video className="w-4 h-4" />
          Shoutout
        </Button>
      </div>

      {/* Bio */}
      <p className="text-slate-700 text-sm leading-relaxed mt-4 max-w-2xl">
        {creator.bio}
      </p>

      {/* XP Progress bar */}
      <div className="mt-3 max-w-md">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>XP: {formatGCoins(creator.xp).replace(" GC", "")}</span>
          <span>Proximo nivel: {formatGCoins(creator.xpToNextLevel).replace(" GC", "")}</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(creator.xp / creator.xpToNextLevel) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-sm font-bold text-slate-900">{value}</span>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}
