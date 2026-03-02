"use client";

import { Target, CheckCircle, Clock, Loader2, AlertCircle, Flame, Calendar, RotateCcw } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

export default function MissionsPage() {
  const missions = trpc.gamification.myMissions.useQuery();

  if (missions.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (missions.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-slate-600 font-medium">Erro ao carregar missoes</p>
        <Button variant="outline" size="sm" onClick={() => missions.refetch()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  const allMissions = missions.data ?? [];
  const dailyMissions = allMissions.filter(m => m.mission?.frequency === "daily");
  const weeklyMissions = allMissions.filter(m => m.mission?.frequency === "weekly");
  const completedCount = allMissions.filter(m => m.completedAt).length;

  function getTimeRemaining(endDate: Date | string) {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return "Expirado";
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    return `${hours}h ${mins}m`;
  }

  function MissionCard({ um }: { um: typeof allMissions[number] }) {
    const mission = um.mission;
    if (!mission) return null;
    const req = mission.requirement as { action: string; count: number };
    const progress = um.progress ?? 0;
    const target = req?.count ?? 1;
    const pct = Math.min((progress / target) * 100, 100);
    const completed = !!um.completedAt;
    const claimed = !!um.rewardClaimed;

    return (
      <Card className={`transition-all duration-300 ${completed ? "border-green-200 bg-green-50/50" : ""}`}>
        <div className="flex items-start gap-3">
          <div className={`flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0 ${
            completed ? "bg-green-100" : "bg-blue-100"
          }`}>
            {completed ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Target className="w-5 h-5 text-blue-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">{mission.name}</h3>
              {completed && claimed && (
                <Badge variant="success" className="text-[10px]">Concluida</Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{mission.description}</p>

            {/* Progress */}
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">{progress}/{target}</span>
                <div className="flex items-center gap-2">
                  {(mission.gcoinReward ?? 0) > 0 && (
                    <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                      <Flame className="w-3 h-3" />
                      +{mission.gcoinReward}
                    </span>
                  )}
                  {(mission.xpReward ?? 0) > 0 && (
                    <span className="text-blue-600 font-semibold text-[10px]">+{mission.xpReward} XP</span>
                  )}
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    completed
                      ? "bg-gradient-to-r from-green-400 to-green-500"
                      : "bg-gradient-to-r from-blue-400 to-blue-500"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Time remaining */}
          {!completed && (
            <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
              <Clock className="w-3 h-3" />
              {getTimeRemaining(um.periodEnd)}
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-500" />
            Missoes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {completedCount} de {allMissions.length} concluidas hoje
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => missions.refetch()}>
          <RotateCcw className="w-4 h-4" />
          Atualizar
        </Button>
      </div>

      {/* Daily Missions */}
      {dailyMissions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-orange-500" />
            <CardTitle className="text-base">Missoes Diarias</CardTitle>
            <Badge variant="accent" className="text-[10px]">
              {dailyMissions.filter(m => m.completedAt).length}/{dailyMissions.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {dailyMissions.map(um => (
              <MissionCard key={um.id} um={um} />
            ))}
          </div>
        </div>
      )}

      {/* Weekly Missions */}
      {weeklyMissions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-purple-500" />
            <CardTitle className="text-base">Missoes Semanais</CardTitle>
            <Badge variant="primary" className="text-[10px]">
              {weeklyMissions.filter(m => m.completedAt).length}/{weeklyMissions.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {weeklyMissions.map(um => (
              <MissionCard key={um.id} um={um} />
            ))}
          </div>
        </div>
      )}

      {allMissions.length === 0 && (
        <Card className="text-center py-12">
          <Target className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="font-medium text-slate-600">Nenhuma missao disponivel</p>
          <p className="text-sm text-slate-400 mt-1">Suas missoes aparecerao aqui quando estiverem ativas</p>
        </Card>
      )}
    </div>
  );
}
