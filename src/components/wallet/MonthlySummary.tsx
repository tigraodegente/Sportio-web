"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Target, Gift, Loader2 } from "lucide-react";

interface MonthlySummaryProps {
  totalEarned: number;
  totalSpent: number;
  transactionCount: number;
  isLoading: boolean;
}

const cards = [
  {
    key: "earned",
    label: "Ganhos",
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
    sign: "+",
  },
  {
    key: "spent",
    label: "Gastos",
    icon: TrendingDown,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
    sign: "-",
  },
  {
    key: "net",
    label: "Liquido",
    icon: Target,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    sign: "",
  },
  {
    key: "count",
    label: "Transacoes",
    icon: Gift,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    sign: "",
  },
] as const;

export function MonthlySummary({ totalEarned, totalSpent, transactionCount, isLoading }: MonthlySummaryProps) {
  const net = totalEarned - totalSpent;

  const values: Record<string, string> = {
    earned: `+${totalEarned.toLocaleString("pt-BR")} GC`,
    spent: `-${totalSpent.toLocaleString("pt-BR")} GC`,
    net: `${net >= 0 ? "+" : ""}${net.toLocaleString("pt-BR")} GC`,
    count: `${transactionCount}`,
  };

  const subtexts: Record<string, string> = {
    earned: "GCoins recebidos",
    spent: "Em inscricoes e palpites",
    net: net >= 0 ? "Balanco positivo" : "Balanco negativo",
    count: "Total de transacoes",
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className={`relative bg-white rounded-xl border ${card.border} p-4 sm:p-5 overflow-hidden transition-all duration-300 hover:shadow-md group`}
          >
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${
              card.key === "earned" ? "from-green-400 to-green-600"
              : card.key === "spent" ? "from-red-400 to-red-600"
              : card.key === "net" ? "from-blue-400 to-blue-600"
              : "from-purple-400 to-purple-600"
            } rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity`} />

            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm font-medium text-slate-500">{card.label}</span>
              <div className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${card.bg} ${card.color} transition-transform group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-8">
                <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
              </div>
            ) : (
              <>
                <div className={`text-xl sm:text-2xl font-bold tracking-tight ${
                  card.key === "net" ? (net >= 0 ? "text-green-700" : "text-red-700") : "text-slate-900"
                }`}>
                  {values[card.key]}
                </div>
                <p className="text-[11px] sm:text-xs mt-1 font-medium text-slate-400">
                  {subtexts[card.key]}
                </p>
              </>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
