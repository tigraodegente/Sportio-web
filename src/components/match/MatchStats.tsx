"use client";

import { cn } from "@/lib/utils";
import type { MatchStat, MatchTeam } from "@/lib/mock/match-data";

interface MatchStatsProps {
  stats: MatchStat[];
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
}

function StatBar({
  stat,
  homeColor,
  awayColor,
}: {
  stat: MatchStat;
  homeColor: string;
  awayColor: string;
}) {
  const total = stat.home + stat.away;
  const homePercent = total > 0 ? (stat.home / total) * 100 : 50;
  const suffix = stat.format === "percent" ? "%" : "";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span
          className={cn(
            "font-bold tabular-nums",
            stat.home > stat.away ? "text-white" : "text-slate-400"
          )}
        >
          {stat.home}{suffix}
        </span>
        <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
        <span
          className={cn(
            "font-bold tabular-nums",
            stat.away > stat.home ? "text-white" : "text-slate-400"
          )}
        >
          {stat.away}{suffix}
        </span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-slate-700/30 gap-0.5">
        <div
          className="rounded-l-full transition-all duration-700 ease-out"
          style={{
            width: `${homePercent}%`,
            backgroundColor: homeColor,
            opacity: stat.home >= stat.away ? 1 : 0.5,
          }}
        />
        <div
          className="rounded-r-full transition-all duration-700 ease-out"
          style={{
            width: `${100 - homePercent}%`,
            backgroundColor: awayColor,
            opacity: stat.away >= stat.home ? 1 : 0.5,
          }}
        />
      </div>
    </div>
  );
}

export function MatchStats({ stats, homeTeam, awayTeam }: MatchStatsProps) {
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Estatísticas</h3>
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 space-y-4">
        {/* Team names header */}
        <div className="flex items-center justify-between text-xs font-semibold">
          <span style={{ color: homeTeam.color }}>{homeTeam.shortName}</span>
          <span style={{ color: awayTeam.color }}>{awayTeam.shortName}</span>
        </div>
        {stats.map((stat) => (
          <StatBar key={stat.label} stat={stat} homeColor={homeTeam.color} awayColor={awayTeam.color} />
        ))}
      </div>
    </div>
  );
}
