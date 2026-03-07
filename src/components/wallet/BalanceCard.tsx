"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Coins, Banknote, Send, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BalanceCardProps {
  real: number;
  gamification: number;
  total: number;
  isLoading: boolean;
  onBuy: () => void;
  onWithdraw: () => void;
  onTransfer: () => void;
}

function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const startTime = performance.now();
    const ms = duration * 1000;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / ms, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplay(current);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        prevValue.current = end;
      }
    }

    requestAnimationFrame(tick);
  }, [value, duration]);

  return <>{display.toLocaleString("pt-BR")}</>;
}

export function BalanceCard({
  real,
  gamification,
  total,
  isLoading,
  onBuy,
  onWithdraw,
  onTransfer,
}: BalanceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 p-6 sm:p-8 text-white"
    >
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-white/5 rounded-full blur-2xl" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 mb-6">
          <Coins className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">
            Seu Saldo
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-300" />
            <span className="text-sm text-white/60">Carregando saldo...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Real GCoins */}
            <div>
              <p className="text-blue-300 text-xs font-medium mb-1 uppercase tracking-wide">
                GCoins Reais
              </p>
              <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                <AnimatedCounter value={real} />
              </p>
              <p className="text-white/50 text-xs mt-1">
                = R$ {(real * 0.1).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} (sacavel via PIX)
              </p>
            </div>

            {/* Gamification GCoins */}
            <div>
              <p className="text-amber-300 text-xs font-medium mb-1 uppercase tracking-wide">
                GCoins Gamificacao
              </p>
              <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                <AnimatedCounter value={gamification} />
              </p>
              <p className="text-white/50 text-xs mt-1">
                Para apostas sociais e loja virtual
              </p>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            size="md"
            className="bg-white/15 hover:bg-white/25 text-white border-0 shadow-none backdrop-blur-sm"
            onClick={onBuy}
          >
            <Plus className="w-4 h-4" />
            Comprar GCoins
          </Button>
          <Button
            size="md"
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10"
            onClick={onWithdraw}
          >
            <Banknote className="w-4 h-4" />
            Sacar via PIX
          </Button>
          <Button
            size="md"
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10"
            onClick={onTransfer}
          >
            <Send className="w-4 h-4" />
            Transferir
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
