"use client";

import { cn } from "@/lib/utils";
import type { MatchTeam } from "@/lib/mock/match-data";

interface MatchHeaderProps {
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  homeScore: number;
  awayScore: number;
  minute: number;
  period: string;
  competition: string;
  round: string;
  status: "live" | "halftime" | "finished" | "not_started";
}

function TeamBadge({ team, side }: { team: MatchTeam; side: "home" | "away" }) {
  return (
    <div className={cn("flex flex-col items-center gap-2", side === "home" ? "order-1" : "order-3")}>
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg"
        style={{ backgroundColor: team.color }}
      >
        {team.shortName}
      </div>
      <span className="text-sm sm:text-base font-semibold text-slate-200 text-center max-w-[100px] truncate">
        {team.name}
      </span>
    </div>
  );
}

export function MatchHeader({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  minute,
  period,
  competition,
  round,
  status,
}: MatchHeaderProps) {
  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-5 sm:p-8">
      {/* Competition + Live badge */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <span className="text-xs sm:text-sm text-slate-400 font-medium">
          {competition} - {round}
        </span>
        {status === "live" && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/20 rounded-full text-xs font-bold text-red-400 border border-red-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
            </span>
            AO VIVO
          </span>
        )}
        {status === "halftime" && (
          <span className="inline-flex items-center px-2.5 py-1 bg-yellow-500/20 rounded-full text-xs font-bold text-yellow-400 border border-yellow-500/30">
            INTERVALO
          </span>
        )}
      </div>

      {/* Teams + Score */}
      <div className="flex items-center justify-center gap-4 sm:gap-8">
        <TeamBadge team={homeTeam} side="home" />

        <div className="order-2 flex flex-col items-center gap-2">
          <div className="flex items-baseline gap-3 sm:gap-5">
            <span className="text-4xl sm:text-6xl font-black text-white tabular-nums">{homeScore}</span>
            <span className="text-2xl sm:text-3xl font-bold text-slate-500">x</span>
            <span className="text-4xl sm:text-6xl font-black text-white tabular-nums">{awayScore}</span>
          </div>
          {status === "live" && (
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-700/50 rounded-full">
              <span className="text-sm font-mono font-bold text-emerald-400">{minute}&apos;</span>
              <span className="text-xs text-slate-400 font-medium">{period}</span>
            </div>
          )}
        </div>

        <TeamBadge team={awayTeam} side="away" />
      </div>
    </div>
  );
}
