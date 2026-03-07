"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronUp, ChevronDown, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatGCoins } from "@/lib/utils";

export interface BetSlipItem {
  id: string;
  market: string;
  selection: string;
  odds: number;
}

interface BetSlipProps {
  items: BetSlipItem[];
  balance: number;
  onRemove: (id: string) => void;
  onClear: () => void;
  onConfirm: (stake: number) => void;
}

const quickAmounts = [50, 100, 250, 500];

export function BetSlip({ items, balance, onRemove, onClear, onConfirm }: BetSlipProps) {
  const [stake, setStake] = useState(100);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isParlay = items.length > 1;
  const combinedOdds = items.reduce((acc, item) => acc * item.odds, 1);
  const displayOdds = isParlay ? combinedOdds : items[0]?.odds ?? 0;
  const potentialReturn = Math.round(stake * displayOdds * 100) / 100;
  const hasItems = items.length > 0;
  const canConfirm = hasItems && stake > 0 && stake <= balance;

  // Desktop sidebar
  const slipContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-200">Aposta</h3>
          {hasItems && (
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
              {items.length}
            </span>
          )}
        </div>
        {hasItems && (
          <button onClick={onClear} className="text-xs text-slate-400 hover:text-red-400 transition-colors">
            Limpar
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {!hasItems ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500">
            <Wallet className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm font-medium">Selecione odds para apostar</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, x: -50 }}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-400 truncate">{item.market}</p>
                  <p className="text-sm font-semibold text-slate-200 truncate">{item.selection}</p>
                  <span className="text-xs font-bold text-emerald-400">{item.odds.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Stake + confirm */}
      {hasItems && (
        <div className="p-4 border-t border-slate-700/50 space-y-3">
          {isParlay && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Tipo</span>
              <span className="font-semibold text-amber-400">
                Parlay ({items.length} selecoes)
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Odds {isParlay ? "combinadas" : ""}</span>
            <span className="font-bold text-emerald-400">{displayOdds.toFixed(2)}</span>
          </div>

          {/* Quick amounts */}
          <div className="grid grid-cols-4 gap-1.5">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setStake(amount)}
                className={cn(
                  "py-1.5 text-xs font-semibold rounded-lg transition-colors",
                  stake === amount
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                )}
              >
                {amount}
              </button>
            ))}
          </div>

          {/* Custom stake input */}
          <div className="relative">
            <input
              type="number"
              value={stake}
              onChange={(e) => setStake(Math.max(0, Number(e.target.value)))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-semibold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
              min={0}
              max={balance}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
              GC
            </span>
          </div>

          {/* Balance */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Saldo</span>
            <span className="text-slate-300 font-medium">{formatGCoins(balance)}</span>
          </div>

          {/* Potential return */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-300">Retorno potencial</span>
              <span className="text-lg font-bold text-emerald-400">
                {formatGCoins(potentialReturn)}
              </span>
            </div>
          </div>

          {/* Confirm button */}
          <button
            onClick={() => canConfirm && onConfirm(stake)}
            disabled={!canConfirm}
            className={cn(
              "w-full py-3 rounded-xl text-sm font-bold transition-all duration-200",
              canConfirm
                ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            )}
          >
            CONFIRMAR APOSTA
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block sticky top-4 bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden max-h-[calc(100vh-2rem)]">
        {slipContent}
      </div>

      {/* Mobile bottom sheet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />
          )}
        </AnimatePresence>

        <motion.div
          animate={{ height: isMobileOpen ? "70vh" : "auto" }}
          className="relative bg-slate-900 border-t border-slate-700/50 rounded-t-2xl overflow-hidden"
        >
          {/* Toggle handle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="w-full flex items-center justify-center py-2"
          >
            {isMobileOpen ? (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Collapsed preview */}
          {!isMobileOpen && hasItems && (
            <div className="flex items-center justify-between px-4 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
                  {items.length}
                </span>
                <span className="text-sm text-slate-300 font-medium">
                  {isParlay ? "Parlay" : items[0].selection}
                </span>
                <span className="text-xs text-emerald-400 font-bold">{displayOdds.toFixed(2)}</span>
              </div>
              <span className="text-sm font-bold text-emerald-400">{formatGCoins(potentialReturn)}</span>
            </div>
          )}

          {!isMobileOpen && !hasItems && (
            <div className="flex items-center justify-center px-4 pb-3">
              <span className="text-sm text-slate-500">Selecione odds para apostar</span>
            </div>
          )}

          {/* Expanded content */}
          {isMobileOpen && <div className="h-full overflow-y-auto">{slipContent}</div>}
        </motion.div>
      </div>
    </>
  );
}
