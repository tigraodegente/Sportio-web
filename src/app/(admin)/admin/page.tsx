"use client";

import { useState } from "react";
import {
  Users,
  Trophy,
  Coins,
  TrendingUp,
  Shield,
  Settings,
  Search,
  Loader2,
  Medal,
  ListOrdered,
} from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

const tournamentStatusLabels: Record<string, string> = {
  draft: "Rascunho",
  registration_open: "Inscricoes Abertas",
  registration_closed: "Inscricoes Fechadas",
  in_progress: "Em Andamento",
  completed: "Finalizado",
  cancelled: "Cancelado",
};

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={`animate-spin text-blue-500 ${className ?? "w-6 h-6"}`}
    />
  );
}

function LoadingRow() {
  return (
    <tr>
      <td colSpan={5} className="py-8">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </td>
    </tr>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm">{description}</p>
    </div>
  );
}

export default function AdminPage() {
  const [userSearch, setUserSearch] = useState("");

  // --- tRPC Queries ---
  const currentUser = trpc.user.me.useQuery(undefined, { retry: false });

  // RBAC: Check if user has admin or organizer role
  const userRoles = currentUser.data?.roles?.map((r: { role: string }) => r.role) ?? [];
  const isAdmin = userRoles.includes("admin");
  const isOrganizer = userRoles.includes("organizer");
  const hasAccess = isAdmin || isOrganizer;

  if (currentUser.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center">
          <Shield className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Acesso Restrito</h1>
        <p className="text-slate-500 text-center max-w-md">
          Voce nao tem permissao para acessar o painel administrativo.
          Entre em contato com um administrador se precisar de acesso.
        </p>
      </div>
    );
  }

  // user.search requires query with min(1), so only query when there is input
  const usersQuery = trpc.user.search.useQuery(
    { query: userSearch || "a", limit: 20 },
    { enabled: userSearch.length > 0 }
  );

  const tournamentsQuery = trpc.tournament.list.useInfiniteQuery(
    { limit: 20 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const leaderboardQuery = trpc.bet.leaderboard.useQuery({ limit: 10 });

  const rankingQuery = trpc.user.ranking.useQuery({ limit: 10 });

  const unreadCount = trpc.notification.unreadCount.useQuery(undefined, {
    retry: false,
  });

  // --- Derived data ---
  const users = usersQuery.data?.items ?? [];

  const allTournaments =
    tournamentsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const totalTournaments = allTournaments.length;
  const activeTournaments = allTournaments.filter(
    (t) =>
      t.status === "in_progress" ||
      t.status === "registration_open" ||
      t.status === "registration_closed"
  ).length;

  const leaderboard = leaderboardQuery.data ?? [];
  const rankings = rankingQuery.data ?? [];

  const notifications =
    typeof unreadCount.data === "number" ? unreadCount.data : 0;

  const isStatsLoading =
    tournamentsQuery.isLoading || leaderboardQuery.isLoading;

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              Painel Admin
            </h1>
            <p className="text-slate-500">
              Visao geral da plataforma Sportio
              {currentUser.data ? ` — ${currentUser.data.name}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {notifications > 0 && (
              <Badge variant="danger">{notifications} notificacoes</Badge>
            )}
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
              Configuracoes
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isStatsLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="relative bg-white rounded-xl border border-slate-100 p-5 animate-pulse"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-4 bg-slate-200 rounded w-24" />
                    <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                  </div>
                  <div className="h-7 bg-slate-200 rounded w-16 mb-1" />
                  <div className="h-3 bg-slate-100 rounded w-20" />
                </div>
              ))}
            </>
          ) : (
            <>
              <StatsCard
                title="Torneios"
                value={totalTournaments.toLocaleString()}
                change={`${activeTournaments} ativos agora`}
                changeType="positive"
                icon={<Trophy className="w-5 h-5" />}
              />
              <StatsCard
                title="Torneios em Andamento"
                value={
                  allTournaments
                    .filter((t) => t.status === "in_progress")
                    .length.toLocaleString()
                }
                change="Em andamento agora"
                changeType="neutral"
                icon={<TrendingUp className="w-5 h-5" />}
              />
              <StatsCard
                title="Top Palpiteiros"
                value={leaderboard.length.toLocaleString()}
                change="No leaderboard"
                changeType="neutral"
                icon={<Coins className="w-5 h-5" />}
              />
              <StatsCard
                title="Ranking Usuarios"
                value={rankings.length.toLocaleString()}
                change="Usuarios ranqueados"
                changeType="positive"
                icon={<Users className="w-5 h-5" />}
              />
            </>
          )}
        </div>

        {/* Alerts */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="border-blue-200 bg-blue-50">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900">
                  {unreadCount.isLoading
                    ? "Carregando..."
                    : notifications > 0
                    ? `${notifications} Notificacoes Nao Lidas`
                    : "Nenhuma notificacao pendente"}
                </p>
                <p className="text-sm text-blue-700">
                  Notificacoes da plataforma
                </p>
              </div>
            </div>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900">
                  {tournamentsQuery.isLoading
                    ? "Carregando..."
                    : `${totalTournaments} Torneios Cadastrados`}
                </p>
                <p className="text-sm text-blue-700">
                  {activeTournaments} ativos no momento
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs
          tabs={[
            { id: "users", label: "Usuarios" },
            { id: "tournaments", label: "Torneios" },
            { id: "leaderboard", label: "Leaderboard" },
            { id: "ranking", label: "Ranking" },
          ]}
        >
          {(tab) => (
            <>
              {/* ===== USERS TAB ===== */}
              {tab === "users" && (
                <Card>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                    <CardTitle>Buscar Usuarios</CardTitle>
                    <div className="w-full sm:w-72">
                      <Input
                        placeholder="Buscar por nome..."
                        icon={<Search className="w-4 h-4" />}
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  {!userSearch && (
                    <EmptyState
                      icon={<Search className="w-7 h-7 text-slate-300" />}
                      title="Buscar usuarios"
                      description="Digite um nome no campo de busca para encontrar usuarios."
                    />
                  )}

                  {userSearch && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left text-xs font-medium text-slate-500 py-3 px-2">
                              Usuario
                            </th>
                            <th className="text-left text-xs font-medium text-slate-500 py-3 px-2">
                              Cidade
                            </th>
                            <th className="text-left text-xs font-medium text-slate-500 py-3 px-2">
                              Nivel
                            </th>
                            <th className="text-left text-xs font-medium text-slate-500 py-3 px-2">
                              Status
                            </th>
                            <th className="text-right text-xs font-medium text-slate-500 py-3 px-2">
                              Acoes
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {usersQuery.isLoading && <LoadingRow />}

                          {!usersQuery.isLoading && users.length === 0 && (
                            <tr>
                              <td colSpan={5}>
                                <EmptyState
                                  icon={
                                    <Users className="w-7 h-7 text-slate-300" />
                                  }
                                  title="Nenhum usuario encontrado"
                                  description={`Nenhum resultado para "${userSearch}". Tente outro termo.`}
                                />
                              </td>
                            </tr>
                          )}

                          {users.map((user) => (
                            <tr
                              key={user.id}
                              className="border-b border-slate-50 hover:bg-slate-50"
                            >
                              <td className="py-3 px-2">
                                <div className="flex items-center gap-2">
                                  <Avatar
                                    src={user.image}
                                    name={user.name}
                                    size="sm"
                                  />
                                  <div>
                                    <p className="text-sm font-medium text-slate-900">
                                      {user.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-2 text-sm text-slate-500">
                                {user.city || "—"}
                              </td>
                              <td className="py-3 px-2">
                                <Badge variant="primary">
                                  Nivel {user.level ?? 1}
                                </Badge>
                              </td>
                              <td className="py-3 px-2">
                                <Badge
                                  variant={
                                    user.isVerified ? "success" : "info"
                                  }
                                >
                                  {user.isVerified ? "Verificado" : "Pendente"}
                                </Badge>
                              </td>
                              <td className="py-3 px-2 text-right">
                                <Button variant="ghost" size="sm">
                                  Ver
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {usersQuery.isFetching && !usersQuery.isLoading && (
                        <div className="flex justify-center py-3">
                          <LoadingSpinner className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              )}

              {/* ===== TOURNAMENTS TAB ===== */}
              {tab === "tournaments" && (
                <Card>
                  <CardTitle className="mb-4">Torneios</CardTitle>

                  {tournamentsQuery.isLoading && (
                    <div className="flex justify-center py-12">
                      <LoadingSpinner />
                    </div>
                  )}

                  {!tournamentsQuery.isLoading &&
                    allTournaments.length === 0 && (
                      <EmptyState
                        icon={<Trophy className="w-7 h-7 text-slate-300" />}
                        title="Nenhum torneio encontrado"
                        description="Nenhum torneio cadastrado na plataforma ainda."
                      />
                    )}

                  {allTournaments.length > 0 && (
                    <div className="space-y-3">
                      {allTournaments.map((tournament) => (
                        <div
                          key={tournament.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                              <Trophy className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {tournament.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {tournament.sport?.name ?? "Esporte"}{" "}
                                &middot;{" "}
                                {tournament.city || "Local nao definido"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge
                              variant={
                                tournament.status === "in_progress" ||
                                tournament.status === "registration_open"
                                  ? "success"
                                  : tournament.status === "completed"
                                  ? "default"
                                  : tournament.status === "cancelled"
                                  ? "danger"
                                  : "info"
                              }
                            >
                              {tournament.status
                                ? tournamentStatusLabels[tournament.status] ??
                                  tournament.status
                                : "Rascunho"}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              Ver
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {tournamentsQuery.hasNextPage && (
                    <div className="flex justify-center mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => tournamentsQuery.fetchNextPage()}
                        loading={tournamentsQuery.isFetchingNextPage}
                      >
                        Carregar mais torneios
                      </Button>
                    </div>
                  )}
                </Card>
              )}

              {/* ===== LEADERBOARD TAB ===== */}
              {tab === "leaderboard" && (
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <Coins className="w-5 h-5 text-blue-500" />
                    <CardTitle>Leaderboard de Palpites</CardTitle>
                  </div>

                  {leaderboardQuery.isLoading && (
                    <div className="flex justify-center py-12">
                      <LoadingSpinner />
                    </div>
                  )}

                  {!leaderboardQuery.isLoading && leaderboard.length === 0 && (
                    <EmptyState
                      icon={
                        <ListOrdered className="w-7 h-7 text-slate-300" />
                      }
                      title="Nenhum palpiteiro no leaderboard"
                      description="O leaderboard de palpites aparecera aqui quando houver dados."
                    />
                  )}

                  {leaderboard.length > 0 && (
                    <div className="space-y-2">
                      {leaderboard.map((entry, index) => (
                        <div
                          key={entry.userId}
                          className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                              index === 0
                                ? "bg-amber-100 text-amber-700"
                                : index === 1
                                ? "bg-slate-200 text-slate-700"
                                : index === 2
                                ? "bg-orange-100 text-orange-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {entry.userId.slice(0, 8)}...
                            </p>
                            <p className="text-xs text-slate-500">
                              {entry.totalBets} palpites
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-blue-600">
                              {entry.totalWins} acertos
                            </p>
                            <p className="text-xs text-slate-500">
                              Lucro: {Number(entry.totalProfit).toFixed(0)} GC
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {/* ===== RANKING TAB ===== */}
              {tab === "ranking" && (
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <Medal className="w-5 h-5 text-blue-500" />
                    <CardTitle>Ranking de Usuarios</CardTitle>
                  </div>

                  {rankingQuery.isLoading && (
                    <div className="flex justify-center py-12">
                      <LoadingSpinner />
                    </div>
                  )}

                  {!rankingQuery.isLoading && rankings.length === 0 && (
                    <EmptyState
                      icon={<Medal className="w-7 h-7 text-slate-300" />}
                      title="Nenhum usuario no ranking"
                      description="O ranking aparecera aqui quando houver dados suficientes."
                    />
                  )}

                  {rankings.length > 0 && (
                    <div className="space-y-2">
                      {rankings.map((entry, index) => (
                        <div
                          key={entry.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                              index === 0
                                ? "bg-amber-100 text-amber-700"
                                : index === 1
                                ? "bg-slate-200 text-slate-700"
                                : index === 2
                                ? "bg-orange-100 text-orange-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <Avatar
                            src={entry.user.image}
                            name={entry.user.name}
                            size="sm"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {entry.user.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {entry.user.city ?? ""}{" "}
                              {entry.level ? `· Nivel ${entry.level}` : ""}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-blue-600">
                              {Number(entry.rating).toFixed(0)} rating
                            </p>
                            <p className="text-xs text-slate-500">
                              {entry.sport.name} · {entry.wins ?? 0}V{" "}
                              {entry.losses ?? 0}D
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
