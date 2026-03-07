"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Trophy,
  Coins,
  Heart,
  MessageCircle,
  Gift,
  TrendingUp,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/ui/stats-card";
import { SectionHeader } from "./SectionHeader";
import { LiveMatchCard } from "./LiveMatchCard";
import { TournamentCard } from "./TournamentCard";
import {
  mockLiveMatches,
  mockChallenges,
  mockNearbyTournaments,
  mockFeedActivities,
} from "@/lib/mock/home-data";
import { cn } from "@/lib/utils";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export function AthleteHome() {
  const liveMatches = mockLiveMatches.filter((m) => m.status === "live");

  return (
    <div className="space-y-8">
      {/* Live Matches Carousel */}
      {liveMatches.length > 0 && (
        <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3 }}>
          <SectionHeader title="Ao Vivo Agora" href="/match" linkText="Ver Todas" />
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x snap-mandatory scrollbar-hide">
            {liveMatches.map((match) => (
              <div key={match.id} className="snap-start">
                <LiveMatchCard match={match} />
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Active Challenges */}
      <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.1 }}>
        <SectionHeader title="Desafios Ativos" href="/challenges" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mockChallenges.map((challenge) => {
            const pct = Math.min(100, (challenge.progress / challenge.target) * 100);
            return (
              <div
                key={challenge.id}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-slate-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{challenge.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{challenge.description}</p>
                  </div>
                  <Badge variant="accent" className="text-[10px] flex-shrink-0">{challenge.sport}</Badge>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">
                      {challenge.progress} / {challenge.target} {challenge.unit}
                    </span>
                    <span className="font-bold text-blue-600">{Math.round(pct)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Coins className="w-3 h-3 text-amber-500" />
                      {challenge.prize} GC
                    </span>
                    <span>{challenge.participants.toLocaleString("pt-BR")} participantes</span>
                  </div>
                  <Button size="sm" className="text-xs px-3 py-1">Participar</Button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Nearby Tournaments */}
      <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.2 }}>
        <SectionHeader title="Torneios Perto de Você" href="/tournaments" />
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x snap-mandatory scrollbar-hide">
          {mockNearbyTournaments.map((tournament) => (
            <div key={tournament.id} className="snap-start">
              <TournamentCard tournament={tournament} />
            </div>
          ))}
        </div>
      </motion.section>

      {/* Social Feed */}
      <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.3 }}>
        <SectionHeader title="Feed de Atividades" href="/social" />
        <div className="space-y-3">
          {mockFeedActivities.map((activity, idx) => (
            <div key={activity.id}>
              {activity.sponsored && (
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1 block">Patrocinado</span>
              )}
              <div
                className={cn(
                  "rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md",
                  activity.sponsored ? "border-blue-200 bg-blue-50/30" : "border-slate-100"
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar name={activity.user.name} src={activity.user.image} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900">{activity.user.name}</span>
                      {activity.user.verified && (
                        <Zap className="w-3.5 h-3.5 text-blue-500" />
                      )}
                      <Badge variant="default" className="text-[10px] ml-1">{activity.sport}</Badge>
                      <span className="text-xs text-slate-400 ml-auto flex-shrink-0">{activity.timeAgo}</span>
                    </div>
                    <p className="text-sm text-slate-700 mt-1">{activity.content}</p>

                    {activity.details && (
                      <div className="flex gap-3 mt-2 p-2.5 rounded-xl bg-slate-50 text-xs">
                        {activity.details.distance && (
                          <span className="text-slate-600"><strong>{activity.details.distance}</strong> distância</span>
                        )}
                        {activity.details.time && (
                          <span className="text-slate-600"><strong>{activity.details.time}</strong> tempo</span>
                        )}
                        {activity.details.pace && (
                          <span className="text-slate-600"><strong>{activity.details.pace}</strong> pace</span>
                        )}
                        {activity.details.score && (
                          <span className="text-slate-600"><strong>{activity.details.score}</strong></span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                      <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                        <Heart className="w-3.5 h-3.5" /> {activity.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" /> {activity.comments}
                      </button>
                      {activity.gifts > 0 && (
                        <span className="flex items-center gap-1 text-amber-500">
                          <Gift className="w-3.5 h-3.5" /> {activity.gifts}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Weekly Stats */}
      <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.4 }}>
        <SectionHeader title="Resumo da Semana" href="/profile" />
        <div className="grid grid-cols-3 gap-3">
          <StatsCard
            title="Treinos"
            value="5"
            change="+2 vs semana anterior"
            changeType="positive"
            icon={<Dumbbell className="w-5 h-5" />}
          />
          <StatsCard
            title="Vitórias"
            value="75%"
            change="3 de 4 partidas"
            changeType="positive"
            icon={<Trophy className="w-5 h-5" />}
          />
          <StatsCard
            title="GCoins"
            value="350"
            change="+120 esta semana"
            changeType="positive"
            icon={<Coins className="w-5 h-5" />}
          />
        </div>
      </motion.section>
    </div>
  );
}
