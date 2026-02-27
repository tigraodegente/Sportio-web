"use client";

import { Users, Trophy, Coins, TrendingUp, Activity, AlertTriangle, Shield, Settings, BarChart3, Flag } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";

const platformStats = {
  totalUsers: 12583,
  activeUsers: 8420,
  totalTournaments: 856,
  activeTournaments: 34,
  totalGcoins: 2450000,
  revenue: 124500,
  pendingReports: 12,
  pendingVerifications: 28,
};

const recentUsers = [
  { id: "1", name: "Lucas Mendes", email: "lucas@email.com", role: "athlete", joined: "Hoje", status: "active" },
  { id: "2", name: "Arena Sportio", email: "arena@email.com", role: "arena_owner", joined: "Hoje", status: "pending" },
  { id: "3", name: "Nike Brasil", email: "nike@brand.com", role: "brand", joined: "Ontem", status: "active" },
  { id: "4", name: "Rafael Costa", email: "rafael@email.com", role: "athlete", joined: "Ontem", status: "active" },
  { id: "5", name: "Maria Silva", email: "maria@email.com", role: "referee", joined: "2 dias", status: "pending" },
];

const reports = [
  { id: "1", type: "Spam", reporter: "Lucas M.", target: "Post #432", status: "pending", date: "Hoje" },
  { id: "2", type: "Fraude", reporter: "Rafael C.", target: "User: FakeUser123", status: "pending", date: "Hoje" },
  { id: "3", type: "Comportamento", reporter: "Andre S.", target: "Comment #891", status: "reviewing", date: "Ontem" },
  { id: "4", type: "Bug", reporter: "Pedro L.", target: "Torneio #56", status: "resolved", date: "2 dias" },
];

const roleLabels: Record<string, string> = {
  athlete: "Atleta",
  organizer: "Organizador",
  brand: "Marca",
  fan: "Fa",
  bettor: "Palpiteiro",
  referee: "Arbitro",
  arena_owner: "Arena",
  admin: "Admin",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-600" />
              Painel Admin
            </h1>
            <p className="text-slate-500">Visao geral da plataforma Sportio</p>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
            Configuracoes
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Usuarios" value={platformStats.totalUsers.toLocaleString()} change={`${platformStats.activeUsers.toLocaleString()} ativos`} changeType="positive" icon={<Users className="w-5 h-5" />} />
          <StatsCard title="Torneios" value={platformStats.totalTournaments.toLocaleString()} change={`${platformStats.activeTournaments} ativos agora`} changeType="neutral" icon={<Trophy className="w-5 h-5" />} />
          <StatsCard title="GCoins em Circulacao" value={`${(platformStats.totalGcoins / 1000000).toFixed(1)}M`} change="Volume total" changeType="neutral" icon={<Coins className="w-5 h-5" />} />
          <StatsCard title="Receita (R$)" value={`${(platformStats.revenue / 1000).toFixed(0)}K`} change="+18% vs mes anterior" changeType="positive" icon={<TrendingUp className="w-5 h-5" />} />
        </div>

        {/* Alerts */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="border-orange-200 bg-orange-50">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <div>
                <p className="font-semibold text-orange-900">{platformStats.pendingReports} Reports Pendentes</p>
                <p className="text-sm text-orange-700">Denuncias aguardando revisao</p>
              </div>
            </div>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900">{platformStats.pendingVerifications} Verificacoes Pendentes</p>
                <p className="text-sm text-blue-700">Usuarios aguardando verificacao</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs
          tabs={[
            { id: "users", label: "Usuarios" },
            { id: "reports", label: "Denuncias" },
            { id: "analytics", label: "Analytics" },
          ]}
        >
          {(tab) => (
            <>
              {tab === "users" && (
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle>Usuarios Recentes</CardTitle>
                    <Button variant="outline" size="sm">Ver todos</Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left text-xs font-medium text-slate-500 py-3 px-2">Usuario</th>
                          <th className="text-left text-xs font-medium text-slate-500 py-3 px-2">Tipo</th>
                          <th className="text-left text-xs font-medium text-slate-500 py-3 px-2">Cadastro</th>
                          <th className="text-left text-xs font-medium text-slate-500 py-3 px-2">Status</th>
                          <th className="text-right text-xs font-medium text-slate-500 py-3 px-2">Acoes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentUsers.map((user) => (
                          <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50">
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-2">
                                <Avatar name={user.name} size="sm" />
                                <div>
                                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                                  <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <Badge>{roleLabels[user.role] || user.role}</Badge>
                            </td>
                            <td className="py-3 px-2 text-sm text-slate-500">{user.joined}</td>
                            <td className="py-3 px-2">
                              <Badge variant={user.status === "active" ? "success" : "info"}>
                                {user.status === "active" ? "Ativo" : "Pendente"}
                              </Badge>
                            </td>
                            <td className="py-3 px-2 text-right">
                              <Button variant="ghost" size="sm">Ver</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {tab === "reports" && (
                <Card>
                  <CardTitle className="mb-4">Denuncias</CardTitle>
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                        <div className="flex items-center gap-3">
                          <Flag className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {report.type} - {report.target}
                            </p>
                            <p className="text-xs text-slate-500">
                              Reportado por {report.reporter} &middot; {report.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              report.status === "pending" ? "danger" : report.status === "reviewing" ? "info" : "success"
                            }
                          >
                            {report.status === "pending" ? "Pendente" : report.status === "reviewing" ? "Em revisao" : "Resolvido"}
                          </Badge>
                          <Button variant="ghost" size="sm">Revisar</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {tab === "analytics" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card>
                    <CardTitle>Usuarios por Tipo</CardTitle>
                    <CardContent className="mt-4 space-y-3">
                      {[
                        { role: "Atletas", count: 8500, percent: 68 },
                        { role: "Fas", count: 2100, percent: 17 },
                        { role: "Palpiteiros", count: 980, percent: 8 },
                        { role: "Organizadores", count: 520, percent: 4 },
                        { role: "Marcas", count: 280, percent: 2 },
                        { role: "Arbitros", count: 203, percent: 1 },
                      ].map((item) => (
                        <div key={item.role}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-slate-700">{item.role}</span>
                            <span className="text-slate-500">{item.count.toLocaleString()} ({item.percent}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div
                              className="bg-emerald-600 rounded-full h-2 transition-all"
                              style={{ width: `${item.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardTitle>Esportes Mais Populares</CardTitle>
                    <CardContent className="mt-4 space-y-3">
                      {[
                        { sport: "Futebol", tournaments: 320, percent: 37 },
                        { sport: "Beach Tennis", tournaments: 180, percent: 21 },
                        { sport: "CrossFit", tournaments: 120, percent: 14 },
                        { sport: "Corrida", tournaments: 95, percent: 11 },
                        { sport: "E-Sports", tournaments: 70, percent: 8 },
                        { sport: "Volei", tournaments: 71, percent: 9 },
                      ].map((item) => (
                        <div key={item.sport}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-slate-700">{item.sport}</span>
                            <span className="text-slate-500">{item.tournaments} torneios ({item.percent}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div
                              className="bg-amber-500 rounded-full h-2 transition-all"
                              style={{ width: `${item.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
