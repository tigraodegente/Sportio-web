"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Filter,
  TrendingUp,
  Banknote,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";
import { LiveMatchCard } from "./LiveMatchCard";
import { CreatorCard } from "./CreatorCard";
import {
  mockLiveMatches,
  mockActiveBets,
  mockCreators,
  mockFeedActivities,
} from "@/lib/mock/home-data";
import { cn, formatCurrency } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const betStatusConfig = {
  winning: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", label: "Ganhando" },
  pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", label: "Pendente" },
  losing: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Perdendo" },
};

export function FanHome() {
  const liveMatches = mockLiveMatches.filter((m) => m.status === "live");
  const featuredMatch = liveMatches[0];
  const otherLiveMatches = liveMatches.slice(1);
  const upcomingMatches = mockLiveMatches.filter((m) => m.status === "upcoming");

  return (
    <div className="space-y-8">
      {/* Live Matches - Featured + Grid */}
      <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3 }}>
        <SectionHeader title="Ao Vivo" href="/match" linkText="Ver Todas" />
        <div className="grid gap-4 lg:grid-cols-2">
          {featuredMatch && (
            <LiveMatchCard match={featuredMatch} variant="featured" />
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {otherLiveMatches.slice(0, 3).map((match) => (
              <Link
                key={match.id}
                href={`/match/${match.id}`}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Badge variant="live" className="text-[10px] px-1.5 py-0 flex-shrink-0">AO VIVO</Badge>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs">{match.homeTeam.logo}</span>
                    <span className="text-xs font-semibold text-slate-900 truncate">{match.homeTeam.name}</span>
                    <span className="text-xs font-bold text-slate-900">{match.homeTeam.score} - {match.awayTeam.score}</span>
                    <span className="text-xs font-semibold text-slate-900 truncate">{match.awayTeam.name}</span>
                    <span className="text-xs">{match.awayTeam.logo}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">{match.minute}&apos;</span>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Active Bets Tracker */}
      {mockActiveBets.length > 0 && (
        <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.1 }}>
          <SectionHeader title="Suas Apostas Ativas" href="/bets" />
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x snap-mandatory scrollbar-hide">
            {mockActiveBets.map((bet) => {
              const config = betStatusConfig[bet.status];
              const StatusIcon = config.icon;
              return (
                <div
                  key={bet.id}
                  className={cn(
                    "flex-shrink-0 w-[280px] rounded-2xl border bg-white p-4 shadow-sm snap-start",
                    bet.status === "winning" && "border-green-200",
                    bet.status === "pending" && "border-amber-200",
                    bet.status === "losing" && "border-red-200"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500">{bet.match}</span>
                    <span className={cn("flex items-center gap-1 text-xs font-semibold", config.color)}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {config.label}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-slate-900 mb-3">{bet.selection}</p>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span>Aposta: {formatCurrency(bet.amount)}</span>
                    <span>Odds: {bet.odds.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Retorno potencial</span>
                      <span className="text-sm font-bold text-slate-900">{formatCurrency(bet.potentialReturn)}</span>
                    </div>
                    {bet.canCashOut && bet.cashOutValue && (
                      <Button size="sm" variant="accent" className="text-xs px-3 py-1.5">
                        Cash Out {formatCurrency(bet.cashOutValue)}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Featured Creators */}
      <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.2 }}>
        <SectionHeader title="Criadores em Destaque" href="/athletes" />
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x snap-mandatory scrollbar-hide">
          {mockCreators.map((creator) => (
            <div key={creator.id} className="snap-start">
              <CreatorCard creator={creator} />
            </div>
          ))}
        </div>
      </motion.section>

      {/* Upcoming Matches Schedule */}
      <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.3 }}>
        <SectionHeader title="Próximos Jogos" href="/match" />
        <div className="space-y-2">
          {[...liveMatches, ...upcomingMatches].map((match) => (
            <Link
              key={match.id}
              href={`/match/${match.id}`}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-center w-12 flex-shrink-0">
                  {match.status === "live" ? (
                    <Badge variant="live" className="text-[10px] px-1.5 py-0">AO VIVO</Badge>
                  ) : (
                    <>
                      <div className="text-xs font-medium text-slate-900">
                        {new Date(match.startTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(match.startTime).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span>{match.homeTeam.logo}</span>
                    <span className="font-semibold text-slate-900 truncate">{match.homeTeam.name}</span>
                    <span className="text-slate-400">vs</span>
                    <span className="font-semibold text-slate-900 truncate">{match.awayTeam.name}</span>
                    <span>{match.awayTeam.logo}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{match.competition}</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="text-xs flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                Apostar
              </Button>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Trending in Feed */}
      <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.4 }}>
        <SectionHeader title="Trending no Feed" href="/social" />
        <div className="space-y-3">
          {mockFeedActivities.slice(0, 3).map((activity) => (
            <div
              key={activity.id}
              className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <Avatar name={activity.user.name} src={activity.user.image} size="sm" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-slate-900">{activity.user.name}</span>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{activity.content}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <TrendingUp className="w-3 h-3" /> {activity.likes}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
