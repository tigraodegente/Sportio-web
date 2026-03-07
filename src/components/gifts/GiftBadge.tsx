"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatGCoins } from "@/lib/utils";

interface GiftBadgeProps {
  totalGCoins: number;
  giftCount: number;
  fanCount: number;
  className?: string;
}

export function GiftBadge({ totalGCoins, giftCount, fanCount, className }: GiftBadgeProps) {
  const [expanded, setExpanded] = useState(false);

  if (totalGCoins === 0) return null;

  return (
    <div
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Compact badge */}
      <motion.span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200/50 cursor-default"
        whileHover={{ scale: 1.05 }}
      >
        {"\u{1F381}"} {formatGCoins(totalGCoins)}
      </motion.span>

      {/* Expanded tooltip */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap shadow-xl z-30"
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {giftCount} {giftCount === 1 ? "presente" : "presentes"} de {fanCount}{" "}
            {fanCount === 1 ? "fa" : "fas"}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
