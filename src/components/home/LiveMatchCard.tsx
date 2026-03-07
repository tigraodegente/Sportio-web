"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { LiveMatch } from "@/lib/mock/home-data";

interface LiveMatchCardProps {
  match: LiveMatch;
  variant?: "compact" | "featured";
  className?: string;
}

export function LiveMatchCard({ match, variant = "compact", className }: LiveMatchCardProps) {
  const isLive = match.status === "live";

  if (variant === "featured") {
    return (
      <Link
        href={`/match/${match.id}`}
        className={cn(
          "block relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 sm:p-6 text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-1",
          className
        )}
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-slate-400">{match.competition}</span>
            {isLive && (
              <Badge variant="live">AO VIVO {match.minute}&apos;</Badge>
            )}
          </div>

          <div className="flex items-center justify-between mb-5">
            <div className="flex-1 text-center">
              <div className="text-2xl mb-1">{match.homeTeam.logo}</div>
              <p className="text-sm font-semibold truncate">{match.homeTeam.name}</p>
            </div>
            <div className="px-4">
              <div className="text-3xl font-bold tracking-tight">
                {match.homeTeam.score} <span className="text-slate-500 mx-1">-</span> {match.awayTeam.score}
              </div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-2xl mb-1">{match.awayTeam.logo}</div>
              <p className="text-sm font-semibold truncate">{match.awayTeam.name}</p>
            </div>
          </div>

          {match.odds && (
            <div className="grid grid-cols-3 gap-2">
              <button className="rounded-xl bg-white/10 hover:bg-white/20 py-2 text-center transition-colors">
                <span className="text-[10px] text-slate-400 block">Casa</span>
                <span className="text-sm font-bold">{match.odds.home.toFixed(2)}</span>
              </button>
              {match.odds.draw > 0 && (
                <button className="rounded-xl bg-white/10 hover:bg-white/20 py-2 text-center transition-colors">
                  <span className="text-[10px] text-slate-400 block">Empate</span>
                  <span className="text-sm font-bold">{match.odds.draw.toFixed(2)}</span>
                </button>
              )}
              <button className="rounded-xl bg-white/10 hover:bg-white/20 py-2 text-center transition-colors">
                <span className="text-[10px] text-slate-400 block">Fora</span>
                <span className="text-sm font-bold">{match.odds.away.toFixed(2)}</span>
              </button>
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/match/${match.id}`}
      className={cn(
        "block flex-shrink-0 w-[260px] rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-medium text-slate-400 truncate max-w-[160px]">{match.competition}</span>
        {isLive ? (
          <Badge variant="live" className="text-[10px] px-1.5 py-0">AO VIVO</Badge>
        ) : (
          <span className="text-[10px] text-slate-400">
            {new Date(match.startTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">{match.homeTeam.logo}</span>
            <span className="text-sm font-semibold text-slate-900 truncate">{match.homeTeam.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">{match.awayTeam.logo}</span>
            <span className="text-sm font-semibold text-slate-900 truncate">{match.awayTeam.name}</span>
          </div>
        </div>
        {isLive && (
          <div className="text-right pl-3">
            <div className="text-lg font-bold text-slate-900">{match.homeTeam.score}</div>
            <div className="text-lg font-bold text-slate-900">{match.awayTeam.score}</div>
          </div>
        )}
      </div>

      {isLive && (
        <div className="mt-2 text-[10px] text-slate-400 text-center">{match.minute}&apos; min</div>
      )}
    </Link>
  );
}
