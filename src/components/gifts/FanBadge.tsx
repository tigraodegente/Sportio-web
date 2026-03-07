"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getFanTier } from "@/lib/mock/gift-data";

interface FanBadgeProps {
  totalGCoins: number;
  className?: string;
}

/**
 * Small inline badge next to a fan's name showing their tier.
 * Returns null if below 100 GCoins (no tier).
 */
export function FanBadge({ totalGCoins, className }: FanBadgeProps) {
  const tier = getFanTier(totalGCoins);
  if (!tier) return null;

  return (
    <motion.span
      className={cn(
        "inline-flex items-center text-xs cursor-default",
        className
      )}
      title={`${tier.label} Fan`}
      whileHover={{ scale: 1.2 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      {tier.emoji}
    </motion.span>
  );
}
