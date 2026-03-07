"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Trophy,
  Target,
  Star,
  CreditCard,
  Banknote,
  Gift,
  RefreshCw,
  Loader2,
  AlertCircle,
  Coins,
  History,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  amount: string | number;
  type: string;
  category: string;
  description: string | null;
  createdAt: string | Date;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRefetch: () => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const categoryLabels: Record<string, string> = {
  tournament_prize: "Premio",
  tournament_entry: "Inscricao",
  bet_win: "Palpite Ganho",
  bet_place: "Palpite",
  purchase: "Compra",
  transfer: "Transferencia",
  daily_bonus: "Bonus Diario",
  referral_bonus: "Indicacao",
  challenge_reward: "Desafio",
  achievement: "Conquista",
  brand_reward: "Marca",
  withdrawal: "Saque",
};

const categoryIcons: Record<string, React.ReactNode> = {
  tournament_prize: <Trophy className="w-4 h-4" />,
  tournament_entry: <Trophy className="w-4 h-4" />,
  bet_win: <Target className="w-4 h-4" />,
  bet_place: <Target className="w-4 h-4" />,
  purchase: <CreditCard className="w-4 h-4" />,
  transfer: <RefreshCw className="w-4 h-4" />,
  daily_bonus: <Star className="w-4 h-4" />,
  referral_bonus: <Gift className="w-4 h-4" />,
  challenge_reward: <Star className="w-4 h-4" />,
  achievement: <Star className="w-4 h-4" />,
  brand_reward: <Gift className="w-4 h-4" />,
  withdrawal: <Banknote className="w-4 h-4" />,
};

function formatDate(dateStr: string | Date): { date: string; time: string } {
  const d = new Date(dateStr);
  const date = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return { date, time };
}

const tabs = [
  { id: "all", label: "Tudo" },
  { id: "earned", label: "Ganhos" },
  { id: "spent", label: "Gastos" },
  { id: "purchase", label: "Compras" },
  { id: "withdrawal", label: "Saques" },
];

export function TransactionHistory({
  transactions,
  isLoading,
  isError,
  errorMessage,
  onRefetch,
  hasMore,
  onLoadMore,
}: TransactionHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-slate-600" />
          <CardTitle>Historico de Transacoes</CardTitle>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
            <p className="text-sm text-slate-400">Carregando transacoes...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
            <p className="text-sm text-red-500 font-medium">Erro ao carregar transacoes</p>
            <p className="text-xs text-slate-400 mt-1">{errorMessage}</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={onRefetch}>
              Tentar novamente
            </Button>
          </div>
        ) : (
          <Tabs tabs={tabs}>
            {(tab) => {
              const filtered = transactions.filter((t) => {
                if (tab === "all") return true;
                if (tab === "earned") return Number(t.amount) > 0;
                if (tab === "spent") return Number(t.amount) < 0 && t.category !== "withdrawal";
                if (tab === "purchase") return t.category === "purchase";
                if (tab === "withdrawal") return t.category === "withdrawal";
                return true;
              });

              if (filtered.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Coins className="w-10 h-10 text-slate-200 mb-3" />
                    <p className="text-sm font-medium text-slate-400">Nenhuma transacao encontrada</p>
                    <p className="text-xs text-slate-300 mt-1">Suas transacoes aparecerão aqui</p>
                  </div>
                );
              }

              return (
                <div className="space-y-1.5">
                  <AnimatePresence>
                    {filtered.map((tx, i) => {
                      const amt = Number(tx.amount);
                      const isPositive = amt > 0;
                      const { date, time } = formatDate(tx.createdAt);
                      const icon = categoryIcons[tx.category] || (
                        isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />
                      );

                      return (
                        <motion.div
                          key={tx.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={`flex items-center justify-between py-3 px-3 sm:px-4 rounded-xl transition-all duration-200 hover:bg-slate-50/80 group border-l-[3px] ${
                            isPositive ? "border-l-green-500" : tx.category === "purchase" ? "border-l-blue-500" : "border-l-red-400"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div
                              className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                                isPositive
                                  ? "bg-green-100 text-green-600"
                                  : tx.category === "purchase"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-red-100 text-red-600"
                              }`}
                            >
                              {icon}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {tx.description ?? "Transacao"}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge
                                  variant={isPositive ? "success" : tx.category === "purchase" ? "primary" : "danger"}
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  {categoryLabels[tx.category] || tx.category}
                                </Badge>
                                <span className="text-[11px] text-slate-400 font-medium">{date}</span>
                                <span className="text-[10px] text-slate-300">|</span>
                                <span className="text-[11px] text-slate-400">{time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            <p className={`text-sm font-bold tracking-tight ${
                              isPositive ? "text-green-600" : "text-red-600"
                            }`}>
                              {isPositive ? "+" : ""}{Number(tx.amount).toLocaleString("pt-BR")} GC
                            </p>
                            <Badge
                              variant={tx.type === "real" ? "primary" : "accent"}
                              className="text-[10px] mt-0.5"
                            >
                              {tx.type === "real" ? "Real" : "Game"}
                            </Badge>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {hasMore && onLoadMore && (
                    <div className="text-center pt-4">
                      <Button size="sm" variant="ghost" onClick={onLoadMore}>
                        Carregar mais
                      </Button>
                    </div>
                  )}
                </div>
              );
            }}
          </Tabs>
        )}
      </Card>
    </motion.div>
  );
}
