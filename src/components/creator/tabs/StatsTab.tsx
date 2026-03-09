"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardTitle } from "@/components/ui/card";
import type { CreatorStat } from "@/lib/types/creator";
import { Activity, TrendingUp, Timer, Trophy } from "lucide-react";

interface StatsTabProps {
  stats: CreatorStat[];
}

const statIcons: Record<string, React.ReactNode> = {
  "Pace Medio": <Timer className="w-4 h-4" />,
  "Km/mes": <Activity className="w-4 h-4" />,
  "Ranking": <Trophy className="w-4 h-4" />,
  "V/D Ratio": <TrendingUp className="w-4 h-4" />,
  "Rating": <TrendingUp className="w-4 h-4" />,
  "Titulos": <Trophy className="w-4 h-4" />,
};

export function StatsTab({ stats }: StatsTabProps) {
  return (
    <div className="space-y-8">
      {stats.map((sportStat, sIdx) => (
        <motion.div
          key={sportStat.sport}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sIdx * 0.1 }}
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4">{sportStat.sport}</h3>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {sportStat.stats.map((stat) => (
              <StatsCard
                key={stat.label}
                title={stat.label}
                value={stat.value}
                change={stat.change}
                changeType={stat.changeType}
                icon={statIcons[stat.label] || <Activity className="w-4 h-4" />}
              />
            ))}
          </div>

          {/* Evolution chart */}
          <Card className="p-4">
            <CardTitle className="text-sm mb-4">Evolucao — Ultimos 12 meses</CardTitle>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sportStat.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      fontSize: "13px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "#3b82f6", stroke: "white", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
