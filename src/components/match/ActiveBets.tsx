"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatGCoins } from "@/lib/utils";
import type { ActiveBet } from "@/lib/mock/match-data";

interface ActiveBetsProps {
  bets: ActiveBet[];
  onCashOut?: (betId: string) => void;
}

const statusConfig = {
  pending: { label: "Pendente", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-400" },
  winning: { label: "Ganhando", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  losing: { label: "Perdendo", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", dot: "bg-red-400" },
};

export function ActiveBets({ bets, onCashOut }: ActiveBetsProps) {
  if (bets.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Suas Apostas</h3>
      <div className="space-y-2">
        {bets.map((bet, index) => {
          const config = statusConfig[bet.status];
          return (
            <motion.div
              key={bet.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-4 rounded-xl border",
                config.bg,
                config.border
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("relative flex h-2 w-2", config.dot)}>
                      <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", config.dot)} />
                      <span className={cn("relative inline-flex rounded-full h-2 w-2", config.dot)} />
                    </span>
                    <span className={cn("text-xs font-semibold uppercase", config.color)}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{bet.market}</p>
                  <p className="text-sm font-semibold text-slate-200">{bet.selection}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                    <span>Odds: <span className="text-slate-300 font-bold">{bet.odds.toFixed(2)}</span></span>
                    <span>Valor: <span className="text-slate-300 font-bold">{formatGCoins(bet.stake)}</span></span>
                    <span>Retorno: <span className="text-emerald-400 font-bold">{formatGCoins(bet.potentialWin)}</span></span>
                  </div>
                </div>

                {bet.cashOutValue && onCashOut && (
                  <button
                    onClick={() => onCashOut(bet.id)}
                    className="shrink-0 px-3 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-xs font-bold text-amber-400 hover:bg-amber-500/30 transition-colors"
                  >
                    Cash Out
                    <br />
                    <span className="text-amber-300">{formatGCoins(bet.cashOutValue)}</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
