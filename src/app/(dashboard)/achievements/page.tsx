"use client";

import { Trophy, Lock, CheckCircle, Loader2, AlertCircle, Star, Shield, Flame } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const TIER_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  bronze: { label: "Bronze", color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-300" },
  silver: { label: "Prata", color: "text-slate-500", bg: "bg-slate-100", border: "border-slate-300" },
  gold: { label: "Ouro", color: "text-yellow-600", bg: "bg-yellow-100", border: "border-yellow-400" },
  platinum: { label: "Platina", color: "text-cyan-600", bg: "bg-cyan-100", border: "border-cyan-400" },
  diamond: { label: "Diamante", color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-400" },
};

export default function AchievementsPage() {
  const categories = trpc.gamification.achievementCategories.useQuery();
  const allAchievements = trpc.gamification.achievements.useQuery({});

  if (allAchievements.isLoading || categories.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (allAchievements.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-slate-600 font-medium">Erro ao carregar conquistas</p>
        <Button variant="outline" size="sm" onClick={() => allAchievements.refetch()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  const achievements = allAchievements.data ?? [];
  const cats = categories.data ?? {};
  const totalCompleted = achievements.filter(a => a.completed).length;
  const totalAll = achievements.length;

  const categoryList = Object.entries(cats).map(([key, val]) => ({
    id: key,
    label: val.label,
  }));

  const tabs = [{ id: "all", label: `Todas (${totalAll})` }, ...categoryList];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Conquistas
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {totalCompleted} de {totalAll} desbloqueadas
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold text-blue-600">{Math.round((totalCompleted / Math.max(totalAll, 1)) * 100)}%</div>
          <p className="text-xs text-slate-400">completo</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 h-3 rounded-full transition-all duration-700"
          style={{ width: `${(totalCompleted / Math.max(totalAll, 1)) * 100}%` }}
        />
      </div>

      {/* Tabs by category */}
      <Tabs tabs={tabs}>
        {(tab) => {
          const filtered = tab === "all"
            ? achievements
            : achievements.filter(a => a.category === tab);

          if (filtered.length === 0) {
            return (
              <div className="text-center py-12 text-slate-400">
                <Shield className="w-10 h-10 mx-auto mb-2" />
                <p className="font-medium">Nenhuma conquista nesta categoria</p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((a) => {
                const tier = TIER_CONFIG[a.tier] ?? TIER_CONFIG.bronze;
                const progress = Math.min((a.progress / Math.max(a.target, 1)) * 100, 100);

                return (
                  <Card
                    key={a.id}
                    className={`relative overflow-hidden transition-all duration-300 ${
                      a.completed
                        ? `border-2 ${tier.border} shadow-md`
                        : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    {a.completed && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${tier.bg} ${a.completed ? "" : "grayscale"}`}>
                        {a.completed ? (
                          <Star className={`w-6 h-6 ${tier.color}`} />
                        ) : (
                          <Lock className="w-5 h-5 text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm">{a.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{a.description}</p>
                        <Badge variant="default" className={`mt-1.5 ${tier.color} ${tier.bg} border-0 text-[10px]`}>
                          {tier.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">{a.progress}/{a.target}</span>
                        {(a.gcoinReward ?? 0) > 0 && (
                          <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                            <Flame className="w-3 h-3" />
                            +{a.gcoinReward} GCoins
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            a.completed
                              ? "bg-gradient-to-r from-green-400 to-green-500"
                              : "bg-gradient-to-r from-blue-400 to-blue-500"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {a.completed && a.completedAt && (
                      <p className="text-[10px] text-slate-400 mt-2">
                        Desbloqueada em {new Date(a.completedAt).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          );
        }}
      </Tabs>
    </div>
  );
}
