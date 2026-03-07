"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { MomentumPoint, MatchTeam } from "@/lib/mock/match-data";

interface MomentumGraphProps {
  data: MomentumPoint[];
  currentMinute: number;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
}

export function MomentumGraph({ data, currentMinute, homeTeam, awayTeam }: MomentumGraphProps) {
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Momentum</h3>
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        {/* Legend */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: homeTeam.color }} />
            <span className="text-slate-400 font-medium">{homeTeam.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">{awayTeam.name}</span>
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: awayTeam.color }} />
          </div>
        </div>

        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="homeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={homeTeam.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={homeTeam.color} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="awayGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="5%" stopColor={awayTeam.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={awayTeam.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} />
            <XAxis
              dataKey="minute"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#475569" }}
              tickFormatter={(v: number) => `${v}'`}
            />
            <YAxis
              domain={[-100, 100]}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              ticks={[-100, -50, 0, 50, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                fontSize: 12,
                color: "#e2e8f0",
              }}
              formatter={(value) => {
                const v = Number(value ?? 0);
                return [
                  v > 0
                    ? `${homeTeam.shortName}: +${v}`
                    : `${awayTeam.shortName}: +${Math.abs(v)}`,
                  "Momentum",
                ];
              }}
              labelFormatter={(label) => `${label}'`}
            />
            {/* Zero line */}
            <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
            {/* Current minute indicator */}
            <ReferenceLine
              x={currentMinute}
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="4 4"
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={homeTeam.color}
              fill="url(#homeGrad)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#fff", stroke: homeTeam.color }}
              baseValue={0}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
