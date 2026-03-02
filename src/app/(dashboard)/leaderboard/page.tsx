"use client";

import { Crown, Medal, TrendingUp, Loader2, AlertCircle, Zap, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

function getRankStyle(index: number) {
  if (index === 0) return { bg: "bg-gradient-to-r from-amber-400 to-yellow-500", text: "text-amber-900", icon: Crown };
  if (index === 1) return { bg: "bg-gradient-to-r from-slate-300 to-slate-400", text: "text-slate-800", icon: Medal };
  if (index === 2) return { bg: "bg-gradient-to-r from-amber-600 to-amber-700", text: "text-amber-100", icon: Medal };
  return { bg: "bg-slate-100", text: "text-slate-600", icon: null };
}

export default function LeaderboardPage() {
  const leaderboard = trpc.gamification.xpLeaderboard.useQuery({ limit: 50 });
  const myProfile = trpc.gamification.myProfile.useQuery();

  if (leaderboard.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (leaderboard.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-slate-600 font-medium">Erro ao carregar ranking</p>
        <Button variant="outline" size="sm" onClick={() => leaderboard.refetch()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  const players = leaderboard.data ?? [];
  const profile = myProfile.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          Ranking
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Os jogadores mais ativos da plataforma
        </p>
      </div>

      {/* My stats */}
      {profile && (
        <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-200 font-medium">Seu progresso</p>
              <p className="text-3xl font-extrabold mt-1">{profile.currentXP?.toLocaleString() ?? 0} XP</p>
              <div className="flex items-center gap-3 mt-2">
                <Badge className="bg-white/20 text-white border-0">
                  <Star className="w-3 h-3 mr-1" />
                  Nivel {profile.level}
                </Badge>
                <span className="text-sm text-blue-200">
                  {profile.achievementsCompleted}/{profile.achievementsTotal} conquistas
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur">
                <Zap className="w-8 h-8 text-yellow-300" />
              </div>
            </div>
          </div>
          {/* XP Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-blue-200 mb-1">
              <span>Nivel {profile.level}</span>
              <span>{Math.round(profile.progress ?? 0)}%</span>
              <span>Nivel {(profile.level ?? 1) + 1}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-300 to-amber-400 h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${profile.progress ?? 0}%` }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Top 3 podium */}
      {players.length >= 3 && (
        <div className="grid grid-cols-3 gap-3">
          {[1, 0, 2].map((idx) => {
            const player = players[idx];
            if (!player) return null;
            const isFirst = idx === 0;
            return (
              <Card
                key={player.id}
                className={`text-center ${isFirst ? "ring-2 ring-amber-400 shadow-lg shadow-amber-100 -mt-2" : ""}`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <Avatar src={player.image} name={player.name} size={isFirst ? "lg" : "md"} />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === 0 ? "bg-amber-400 text-amber-900" : idx === 1 ? "bg-slate-300 text-slate-700" : "bg-amber-600 text-white"
                    }`}>
                      {idx + 1}
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 truncate max-w-[100px]">{player.name}</p>
                    <p className="text-xs text-slate-500">Nivel {player.level ?? 1}</p>
                  </div>
                  <Badge variant={isFirst ? "accent" : "default"} className="text-[10px]">
                    {(player.xp ?? 0).toLocaleString()} XP
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Full ranking list */}
      <div className="space-y-2">
        {players.map((player, index) => {
          const rank = getRankStyle(index);
          const Icon = rank.icon;
          return (
            <Card key={player.id} hover className="flex items-center gap-3 py-3">
              {/* Rank number */}
              <div className={`flex items-center justify-center w-9 h-9 rounded-xl font-bold text-sm flex-shrink-0 ${rank.bg} ${rank.text}`}>
                {Icon ? <Icon className="w-4 h-4" /> : index + 1}
              </div>

              {/* Player info */}
              <Avatar src={player.image} name={player.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-900 truncate">{player.name}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Nivel {player.level ?? 1}</span>
                  {player.city && <span>· {player.city}</span>}
                </div>
              </div>

              {/* XP */}
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-sm text-blue-600">{(player.xp ?? 0).toLocaleString()}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">XP</p>
              </div>
            </Card>
          );
        })}
      </div>

      {players.length === 0 && (
        <Card className="text-center py-12">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="font-medium text-slate-600">Ranking vazio</p>
          <p className="text-sm text-slate-400 mt-1">Seja o primeiro a acumular XP!</p>
        </Card>
      )}
    </div>
  );
}
