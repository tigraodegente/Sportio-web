"use client";

import { motion } from "framer-motion";
import { Crown, Check, ExternalLink, Coins } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatGCoins } from "@/lib/utils";
import type { SubscriptionTier, FanEntry } from "@/lib/types/creator";

interface Sponsor {
  name: string;
  logoUrl: string | null;
  category: string;
}

interface CreatorSidebarProps {
  tiers: SubscriptionTier[];
  fans: FanEntry[];
  sponsors?: Sponsor[];
}

const tierColors: Record<string, { bg: string; border: string; button: string }> = {
  blue: { bg: "bg-blue-50", border: "border-blue-200", button: "bg-blue-600 hover:bg-blue-500" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", button: "bg-amber-600 hover:bg-amber-500" },
  purple: { bg: "bg-purple-50", border: "border-purple-200", button: "bg-purple-600 hover:bg-purple-500" },
};

const fanTierBadges: Record<string, { emoji: string; label: string; color: string }> = {
  diamond: { emoji: "\uD83D\uDC8E", label: "Diamante", color: "bg-cyan-50 text-cyan-700" },
  gold: { emoji: "\uD83E\uDD47", label: "Ouro", color: "bg-amber-50 text-amber-700" },
  silver: { emoji: "\uD83E\uDD48", label: "Prata", color: "bg-slate-100 text-slate-600" },
  bronze: { emoji: "\uD83E\uDD49", label: "Bronze", color: "bg-orange-50 text-orange-700" },
};

export function CreatorSidebar({ tiers, fans, sponsors = [] }: CreatorSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Subscription Tiers */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-4 h-4 text-amber-500" />
          <CardTitle>Planos de Assinatura</CardTitle>
        </div>
        <div className="space-y-3">
          {tiers.map((tier, i) => {
            const colors = tierColors[tier.color] || tierColors.blue;
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-xl border p-4 ${colors.bg} ${colors.border}`}
              >
                {tier.popular && (
                  <Badge variant="accent" className="absolute -top-2 right-3 text-[10px]">
                    Popular
                  </Badge>
                )}
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900">{tier.name}</h4>
                  <span className="text-sm font-bold text-slate-700">
                    R${tier.price.toFixed(2).replace(".", ",")}<span className="text-xs font-normal text-slate-500">/mes</span>
                  </span>
                </div>
                <ul className="space-y-1.5 mb-3">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Button
                  size="sm"
                  className={`w-full text-white ${colors.button}`}
                >
                  Assinar
                </Button>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Top Fans Leaderboard */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Coins className="w-4 h-4 text-amber-500" />
          <CardTitle>Top Fas</CardTitle>
        </div>
        <div className="space-y-2">
          {fans.slice(0, 8).map((fan, i) => {
            const badge = fanTierBadges[fan.tier];
            return (
              <div
                key={fan.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <span className="text-xs font-bold text-slate-400 w-5 text-center">
                  {i + 1}
                </span>
                <Avatar src={fan.avatar} name={fan.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{fan.name}</p>
                  <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badge.color}`}>
                    {badge.emoji} {badge.label}
                  </span>
                </div>
                <span className="text-xs font-semibold text-amber-600">
                  {formatGCoins(fan.totalGCoins)}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Sponsors */}
      {sponsors.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-4 h-4 text-amber-500" />
            <CardTitle>Patrocinadores</CardTitle>
          </div>
          <div className="space-y-3">
            {sponsors.map((sponsor) => (
              <div key={sponsor.name} className="flex items-center gap-3 p-2 rounded-lg border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  {sponsor.logoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={sponsor.logoUrl} alt={sponsor.name} className="w-full h-full rounded-lg object-contain" />
                  ) : (
                    <Crown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{sponsor.name}</p>
                  <p className="text-xs text-slate-500">{sponsor.category}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 flex items-center justify-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />
            Quer patrocinar? Saiba Mais
          </button>
        </Card>
      )}
    </div>
  );
}
