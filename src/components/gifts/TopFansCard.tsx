"use client";

import { motion } from "framer-motion";
import { Card, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { formatGCoins } from "@/lib/utils";
import { getFanTier, type TopFan } from "@/lib/mock/gift-data";

interface TopFansCardProps {
  fans: TopFan[];
  className?: string;
}

function getRankIcon(index: number, totalGCoins: number): string {
  const tier = getFanTier(totalGCoins);
  if (tier) return tier.emoji;
  return `${index + 1}.`;
}

export function TopFansCard({ fans, className }: TopFansCardProps) {
  const topFans = fans.slice(0, 5);

  return (
    <Card className={className}>
      <CardTitle className="flex items-center gap-2 mb-4">
        {"\u{1F3C6}"} Top Fas
      </CardTitle>

      <div className="space-y-3">
        {topFans.map((fan, index) => (
          <motion.div
            key={fan.userId}
            className="flex items-center gap-3 group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            {/* Rank icon */}
            <span className="w-6 text-center text-sm flex-shrink-0">
              {getRankIcon(index, fan.totalGCoins)}
            </span>

            {/* Avatar */}
            <Avatar src={fan.image} name={fan.name} size="sm" />

            {/* Name + GCoins */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors cursor-pointer">
                {fan.name}
              </p>
            </div>

            {/* GCoin amount */}
            <span className="text-xs font-bold text-amber-600 flex-shrink-0">
              {formatGCoins(fan.totalGCoins)}
            </span>
          </motion.div>
        ))}
      </div>

      {fans.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-4">
          Nenhum fa ainda.
        </p>
      )}
    </Card>
  );
}
