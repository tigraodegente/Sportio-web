"use client";

import { Trophy, Coins, Target, TrendingUp, Users, Star, ArrowRight, Zap, Calendar, Flame } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const recentTournaments = [
  { id: "1", name: "Copa Beach Tennis SP", sport: "Beach Tennis", status: "in_progress", date: "15 Mar", prize: "5.000", color: "from-amber-400 to-amber-500" },
  { id: "2", name: "Liga CrossFit Brasil", sport: "CrossFit", status: "registration_open", date: "22 Mar", prize: "10.000", color: "from-red-400 to-red-500" },
  { id: "3", name: "Torneio Futebol Society", sport: "Futebol", status: "completed", date: "10 Mar", prize: "3.000", color: "from-blue-400 to-blue-500" },
];

const recentBets = [
  { id: "1", match: "Team Alpha vs Team Beta", amount: 50, odds: 1.8, status: "pending" },
  { id: "2", match: "Player A vs Player B", amount: 100, odds: 2.5, status: "won" },
  { id: "3", match: "Squad X vs Squad Y", amount: 30, odds: 1.5, status: "lost" },
];

const statusMap: Record<string, { label: string; variant: "primary" | "info" | "success" | "danger" }> = {
  draft: { label: "Rascunho", variant: "info" },
  registration_open: { label: "Inscricoes abertas", variant: "primary" },
  in_progress: { label: "Em andamento", variant: "info" },
  completed: { label: "Finalizado", variant: "success" },
  cancelled: { label: "Cancelado", variant: "danger" },
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{getGreeting()}, Lucas!</h1>
          <p className="text-slate-500">Aqui esta seu resumo de hoje</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full font-medium">
            <Flame className="w-4 h-4" />
            7 dias seguidos
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          title="GCoins (Real)"
          value="1.250,00"
          change="+250 esta semana"
          changeType="positive"
          icon={<Coins className="w-5 h-5" />}
        />
        <StatsCard
          title="Torneios"
          value="12"
          change="3 ativos agora"
          changeType="neutral"
          icon={<Trophy className="w-5 h-5" />}
        />
        <StatsCard
          title="Vitorias"
          value="34"
          change="67% win rate"
          changeType="positive"
          icon={<Star className="w-5 h-5" />}
        />
        <StatsCard
          title="Ranking"
          value="#127"
          change="+15 posicoes"
          changeType="positive"
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
              {recentTournaments.map((t) => (
                <Link
                  key={t.id}
                  href={`/tournaments/${t.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all group"
                >
                  <div className={`w-1 h-12 rounded-full bg-gradient-to-b ${t.color} shrink-0`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{t.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {t.sport} &middot; {t.date}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant={statusMap[t.status]?.variant}>
                      {statusMap[t.status]?.label}
                    </Badge>
                    <p className="text-xs text-amber-600 font-bold mt-1">
                      {t.prize} GC
                    </p>
                  </div>
                </Link>
              ))}
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
              {recentBets.map((bet) => (
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
              ))}
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
