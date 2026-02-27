"use client";

import { Trophy, Coins, Target, TrendingUp, Users, Star } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const recentTournaments = [
  { id: "1", name: "Copa Beach Tennis SP", sport: "Beach Tennis", status: "in_progress", date: "15 Mar", prize: "5.000" },
  { id: "2", name: "Liga CrossFit Brasil", sport: "CrossFit", status: "registration_open", date: "22 Mar", prize: "10.000" },
  { id: "3", name: "Torneio Futebol Society", sport: "Futebol", status: "completed", date: "10 Mar", prize: "3.000" },
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

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Bem-vindo de volta! Aqui esta seu resumo.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Tournaments */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Torneios Recentes</CardTitle>
            <Link href="/tournaments" className="text-sm text-emerald-600 hover:text-emerald-700">
              Ver todos
            </Link>
          </div>
          <CardContent>
            <div className="space-y-3">
              {recentTournaments.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">
                      {t.sport} &middot; {t.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={statusMap[t.status]?.variant}>
                      {statusMap[t.status]?.label}
                    </Badge>
                    <p className="text-xs text-amber-600 font-medium mt-1">
                      {t.prize} GCoins
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bets */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Palpites Recentes</CardTitle>
            <Link href="/bets" className="text-sm text-emerald-600 hover:text-emerald-700">
              Ver todos
            </Link>
          </div>
          <CardContent>
            <div className="space-y-3">
              {recentBets.map((bet) => (
                <div
                  key={bet.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{bet.match}</p>
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
            <Button variant="outline" size="lg" className="w-full flex-col gap-2 h-auto py-4">
              <Trophy className="w-6 h-6" />
              <span className="text-xs">Criar Torneio</span>
            </Button>
          </Link>
          <Link href="/social">
            <Button variant="outline" size="lg" className="w-full flex-col gap-2 h-auto py-4">
              <Users className="w-6 h-6" />
              <span className="text-xs">Publicar</span>
            </Button>
          </Link>
          <Link href="/bets">
            <Button variant="outline" size="lg" className="w-full flex-col gap-2 h-auto py-4">
              <Target className="w-6 h-6" />
              <span className="text-xs">Fazer Palpite</span>
            </Button>
          </Link>
          <Link href="/gcoins">
            <Button variant="outline" size="lg" className="w-full flex-col gap-2 h-auto py-4">
              <Coins className="w-6 h-6" />
              <span className="text-xs">Comprar GCoins</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
