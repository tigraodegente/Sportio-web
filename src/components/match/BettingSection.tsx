"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BettingMarket, OddOption } from "@/lib/mock/match-data";

interface BettingSectionProps {
  markets: BettingMarket[];
  selectedBets: string[];
  onToggleBet: (optionId: string, marketName: string, label: string, odds: number) => void;
}

function OddButton({
  option,
  isSelected,
  onToggle,
}: {
  option: OddOption;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const oddsChange =
    option.previousOdds !== undefined
      ? option.odds > option.previousOdds
        ? "up"
        : option.odds < option.previousOdds
          ? "down"
          : null
      : null;

  if (option.suspended) {
    return (
      <button
        disabled
        className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-700/30 border border-slate-600/30 opacity-50 cursor-not-allowed"
      >
        <Lock className="w-4 h-4 text-slate-500 mb-1" />
        <span className="text-xs text-slate-500">{option.label}</span>
      </button>
    );
  }

  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 min-w-0",
        isSelected
          ? "bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/10"
          : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600 hover:bg-slate-700/50"
      )}
    >
      <span className={cn("text-xs font-medium mb-1", isSelected ? "text-emerald-300" : "text-slate-400")}>
        {option.label}
      </span>
      <div className="flex items-center gap-1">
        <motion.span
          key={option.odds}
          initial={oddsChange ? { color: oddsChange === "up" ? "#4ade80" : "#f87171" } : false}
          animate={{ color: isSelected ? "#6ee7b7" : "#e2e8f0" }}
          transition={{ duration: 1.5 }}
          className="text-lg font-bold tabular-nums"
        >
          {option.odds.toFixed(2)}
        </motion.span>
        {oddsChange === "up" && (
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="text-emerald-400 text-xs"
          >
            ▲
          </motion.span>
        )}
        {oddsChange === "down" && (
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="text-red-400 text-xs"
          >
            ▼
          </motion.span>
        )}
      </div>
    </motion.button>
  );
}

function MarketAccordion({
  market,
  selectedBets,
  onToggleBet,
  defaultOpen,
}: {
  market: BettingMarket;
  selectedBets: string[];
  onToggleBet: BettingSectionProps["onToggleBet"];
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false);

  return (
    <div className="border border-slate-700/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-3 bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-200">{market.name}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {market.options.map((option) => (
                <OddButton
                  key={option.id}
                  option={option}
                  isSelected={selectedBets.includes(option.id)}
                  onToggle={() => onToggleBet(option.id, market.name, option.label, option.odds)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function BettingSection({ markets, selectedBets, onToggleBet }: BettingSectionProps) {
  const mainMarket = markets.find((m) => m.id === "1x2");
  const otherMarkets = markets.filter((m) => m.id !== "1x2");

  return (
    <div>
      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Apostas</h3>

      {/* Main 1x2 market */}
      {mainMarket && (
        <div className="mb-4">
          <p className="text-xs text-slate-400 font-medium mb-2">{mainMarket.name}</p>
          <div className="grid grid-cols-3 gap-2">
            {mainMarket.options.map((option) => (
              <OddButton
                key={option.id}
                option={option}
                isSelected={selectedBets.includes(option.id)}
                onToggle={() => onToggleBet(option.id, mainMarket.name, option.label, option.odds)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Additional markets */}
      <div className="space-y-2">
        {otherMarkets.map((market, i) => (
          <MarketAccordion
            key={market.id}
            market={market}
            selectedBets={selectedBets}
            onToggleBet={onToggleBet}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </div>
  );
}
