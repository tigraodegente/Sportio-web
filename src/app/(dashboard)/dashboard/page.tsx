"use client";

import { Trophy, Coins, Target, TrendingUp, Users, Star, ArrowRight, Zap, Calendar, Flame, Loader2 } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { trpc } from "@/lib/trpc";

const statusMap: Record<string, { label: string; variant: "primary" | "info" | "success" | "danger" }> = {
  draft: { label: "Rascunho", variant: "info" },
  registration_open: { label: "Inscricoes abertas", variant: "primary" },
  in_progress: { label: "Em andamento", variant: "info" },
  completed: { label: "Finalizado", variant: "success" },
  cancelled: { label: "Cancelado", variant: "danger" },
};

const tournamentColors = [
  "from-amber-400 to-amber-500",
  "from-red-400 to-red-500",
  "from-blue-400 to-blue-500",
  "from-green-400 to-green-500",
  "from-purple-400 to-purple-500",
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function getFirstName(name: string) {
  return name.split(" ")[0];
}

export default function DashboardPage() {
  const { data, isLoading } = trpc.user.dashboardStats.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const userName = data?.user?.name ? getFirstName(data.user.name) : "Atleta";
  const stats = data?.stats;
  const recentTournaments = data?.recentTournaments ?? [];
  const recentBets = data?.recentBets ?? [];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{getGreeting()}, {userName}!</h1>
          <p className="text-slate-500">Aqui esta seu resumo de hoje</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full font-medium">
            <Flame className="w-4 h-4" />
            Nivel {stats?.gcoinsReal !== undefined ? data?.user?.level ?? 1 : 1}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          title="GCoins (Real)"
          value={stats?.gcoinsReal?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) ?? "0,00"}
          change={`${stats?.activeTournaments ?? 0} torneios ativos`}
          changeType="neutral"
          icon={<Coins className="w-5 h-5" />}
        />
        <StatsCard
          title="Torneios"
          value={String(stats?.totalTournaments ?? 0)}
          change={`${stats?.activeTournaments ?? 0} ativos agora`}
          changeType="neutral"
          icon={<Trophy className="w-5 h-5" />}
        />
        <StatsCard
          title="Vitorias"
          value={String(stats?.victories ?? 0)}
          change={`${stats?.winRate ?? 0}% win rate`}
          changeType="positive"
          icon={<Star className="w-5 h-5" />}
        />
        <StatsCard
          title="Seguidores"
          value={String(stats?.followers ?? 0)}
          change={`${stats?.following ?? 0} seguindo`}
          changeType="neutral"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Tournaments */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Torneios Recentes</CardTitle>
            <Link href="/tournaments" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <CardContent>
            <div className="space-y-3">
              {recentTournaments.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">Nenhum torneio ainda. Inscreva-se em um!</p>
              ) : (
                recentTournaments.map((t, i) => (
                  <Link
                    key={t.id}
                    href={`/tournaments/${t.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all group"
                  >
                    <div className={`w-1 h-12 rounded-full bg-gradient-to-b ${tournamentColors[i % tournamentColors.length]} shrink-0`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{t.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {t.sport} &middot; {t.date}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant={statusMap[t.status ?? "draft"]?.variant}>
                        {statusMap[t.status ?? "draft"]?.label}
                      </Badge>
                      <p className="text-xs text-amber-600 font-bold mt-1">
                        {t.prize} GC
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bets */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Palpites Recentes</CardTitle>
            <Link href="/bets" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <CardContent>
            <div className="space-y-3">
              {recentBets.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">Nenhum palpite ainda. Faca seu primeiro!</p>
              ) : (
                recentBets.map((bet) => (
                  <div
                    key={bet.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50"
                  >
                    <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                      bet.status === "won" ? "bg-blue-100 text-blue-600" :
                      bet.status === "lost" ? "bg-red-100 text-red-500" :
                      "bg-blue-100 text-blue-600"
                    }`}>
                      <Target className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">{bet.match}</p>
                      <p className="text-xs text-slate-500">
                        {bet.amount} GCoins &middot; Odds {bet.odds}x
                      </p>
                    </div>
                    <Badge
                      variant={
                        bet.status === "won" ? "success" : bet.status === "lost" ? "danger" : "info"
                      }
                    >
                      {bet.status === "won" ? "Ganhou" : bet.status === "lost" ? "Perdeu" : "Pendente"}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardTitle className="mb-4">Acoes Rapidas</CardTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/tournaments/create">
            <Button variant="outline" size="lg" className="w-full flex-col gap-2 h-auto py-5 hover:border-blue-300 hover:bg-blue-50/50">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold">Criar Torneio</span>
            </Button>
          </Link>
          <Link href="/social">
            <Button variant="outline" size="lg" className="w-full flex-col gap-2 h-auto py-5 hover:border-blue-300 hover:bg-blue-50/50">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold">Publicar</span>
            </Button>
          </Link>
          <Link href="/bets">
            <Button variant="outline" size="lg" className="w-full flex-col gap-2 h-auto py-5 hover:border-purple-300 hover:bg-purple-50/50">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold">Fazer Palpite</span>
            </Button>
          </Link>
          <Link href="/gcoins">
            <Button variant="outline" size="lg" className="w-full flex-col gap-2 h-auto py-5 hover:border-amber-300 hover:bg-amber-50/50">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Coins className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold">Comprar GCoins</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
