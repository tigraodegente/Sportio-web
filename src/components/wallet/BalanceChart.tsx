"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface Transaction {
  id: string;
  amount: string | number;
  type: string;
  createdAt: string | Date;
}

interface BalanceChartProps {
  transactions: Transaction[];
  currentReal: number;
  currentGamification: number;
}

export function BalanceChart({ transactions, currentReal, currentGamification }: BalanceChartProps) {
  const chartData = useMemo(() => {
    // Generate last 30 days of balance data by walking backwards through transactions
    const now = new Date();
    const days: { date: string; real: number; gamification: number }[] = [];

    // Sort transactions oldest first
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Build daily snapshots for the last 30 days
    let runningReal = currentReal;
    let runningGam = currentGamification;

    // Walk backwards: subtract recent transactions to reconstruct past balances
    const dailyChanges = new Map<string, { real: number; gamification: number }>();

    for (const tx of sorted) {
      const d = new Date(tx.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const amount = Number(tx.amount);
      if (!dailyChanges.has(key)) {
        dailyChanges.set(key, { real: 0, gamification: 0 });
      }
      const entry = dailyChanges.get(key)!;
      if (tx.type === "real") entry.real += amount;
      else entry.gamification += amount;
    }

    // Build 30-day array going backwards
    let r = currentReal;
    let g = currentGamification;

    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const label = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;

      days.unshift({ date: label, real: Math.max(0, Math.round(r)), gamification: Math.max(0, Math.round(g)) });

      // Subtract this day's changes to get previous day's balance
      const changes = dailyChanges.get(key);
      if (changes) {
        r -= changes.real;
        g -= changes.gamification;
      }
    }

    return days;
  }, [transactions, currentReal, currentGamification]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <CardTitle>Evolucao do Saldo</CardTitle>
        </div>

        <div className="h-[280px] sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  fontSize: "13px",
                }}
                formatter={(value, name) => [
                  `${Number(value).toLocaleString("pt-BR")} GC`,
                  name === "real" ? "GCoins Reais" : "GCoins Gamificacao",
                ]}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                formatter={(value) => (value === "real" ? "GCoins Reais" : "GCoins Gamificacao")}
              />
              <Line
                type="monotone"
                dataKey="real"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#3b82f6", stroke: "white", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="gamification"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={false}
                activeDot={{ r: 5, fill: "#f59e0b", stroke: "white", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}
