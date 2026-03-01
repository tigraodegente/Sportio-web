"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Trophy, MapPin, Calendar, Users, Coins, Share2, Swords, Loader2, AlertCircle, Sun, Dumbbell, Target, Gamepad2, Footprints, Circle, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";

const statusMap: Record<string, { label: string; variant: "primary" | "info" | "success" | "danger" }> = {
  draft: { label: "Rascunho", variant: "info" },
  registration_open: { label: "Inscricoes Abertas", variant: "primary" },
  registration_closed: { label: "Inscricoes Fechadas", variant: "info" },
  in_progress: { label: "Em Andamento", variant: "info" },
  completed: { label: "Finalizado", variant: "success" },
  cancelled: { label: "Cancelado", variant: "danger" },
};

const formatMap: Record<string, string> = {
  single_elimination: "Eliminacao Simples",
  double_elimination: "Eliminacao Dupla",
  round_robin: "Todos contra Todos",
  swiss: "Suico",
  league: "Liga",
};

const sportIconMap: Record<string, LucideIcon> = {
  "Beach Tennis": Sun,
  "CrossFit": Dumbbell,
  "Futebol": Target,
  "E-Sports": Gamepad2,
  "Corrida": Footprints,
  "Volei": Circle,
};

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "--";
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" });
}

function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-slate-200 rounded-2xl h-72" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-slate-100 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-40 bg-slate-100 rounded-2xl" />
          <div className="h-28 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function TournamentDetailPage() {
  const params = useParams();
  const tournamentId = params.id as string;

  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  const tournamentQuery = trpc.tournament.getById.useQuery(
    { id: tournamentId },
    { enabled: !!tournamentId }
  );

  const matchesQuery = trpc.match.listByTournament.useQuery(
    { tournamentId },
    { enabled: !!tournamentId }
  );

  const currentUserQuery = trpc.user.me.useQuery(undefined, { retry: false });

  const enrollMutation = trpc.tournament.enroll.useMutation({
    onSuccess: () => {
      setEnrollSuccess(true);
      setEnrollError(null);
      tournamentQuery.refetch();
    },
    onError: (error) => {
      setEnrollError(error.message || "Erro ao se inscrever.");
    },
    onSettled: () => {
      setEnrolling(false);
    },
  });

  const generateBracketMutation = trpc.tournament.generateBracket.useMutation({
    onSuccess: () => {
      tournamentQuery.refetch();
      matchesQuery.refetch();
    },
  });

  const standingsQuery = trpc.tournament.standings.useQuery(
    { tournamentId },
    { enabled: !!tournamentId }
  );

  // Build a map of player IDs to names from enrollment data
  const playerNameMap = useMemo(() => {
    const map = new Map<string, string>();
    const enrollments = tournamentQuery.data?.enrollments;
    if (enrollments) {
      for (const enrollment of enrollments) {
        if (enrollment.userId && enrollment.user?.name) {
          map.set(enrollment.userId, enrollment.user.name);
        }
      }
    }
    return map;
  }, [tournamentQuery.data?.enrollments]);

  const handleEnroll = () => {
    setEnrolling(true);
    setEnrollError(null);
    enrollMutation.mutate({ tournamentId });
  };

  const handleGenerateBracket = () => {
    generateBracketMutation.mutate({ tournamentId });
  };

  if (tournamentQuery.isLoading) {
    return <DetailSkeleton />;
  }

  if (tournamentQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Erro ao carregar torneio</h3>
        <p className="text-sm text-slate-500 mb-4">{tournamentQuery.error.message}</p>
        <Button variant="ghost" onClick={() => tournamentQuery.refetch()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  const tournament = tournamentQuery.data;

  if (!tournament) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Trophy className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Torneio nao encontrado</h3>
        <p className="text-sm text-slate-500">O torneio que voce procura nao existe ou foi removido.</p>
      </div>
    );
  }

  const enrollmentCount = tournament.enrollments?.length ?? 0;
  const maxParticipants = tournament.maxParticipants ?? 32;
  const fillPercent = Math.round((enrollmentCount / maxParticipants) * 100);
  const entryFee = Number(tournament.entryFee ?? 0);
  const prizePool = Number(tournament.prizePool ?? 0);
  const sportName = tournament.sport?.name ?? "Esporte";
  const SportIcon = sportIconMap[sportName] || Trophy;
  const cityDisplay = tournament.isOnline
    ? "Online"
    : [tournament.city, tournament.state].filter(Boolean).join(", ") || "--";
  const canEnroll = tournament.status === "registration_open" && !enrollSuccess;
  const currentUserId = currentUserQuery.data?.id;
  const isOrganizer = currentUserId === tournament.organizerId;
  const canGenerateBracket =
    isOrganizer && tournament.status === "registration_closed";
  const showStandingsTab =
    tournament.format === "round_robin" ||
    tournament.format === "league" ||
    tournament.format === "swiss";

  const getPlayerName = (playerId: string | null): string => {
    if (!playerId) return "TBD";
    return playerNameMap.get(playerId) ?? "Jogador";
  };

  const matchList = matchesQuery.data ?? [];
  const rounds = [...new Set(matchList.map((m) => m.round))].sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-0">
                {statusMap[tournament.status as string]?.label ?? tournament.status}
              </Badge>
              <Badge className="bg-white/15 text-white border-0 backdrop-blur-sm">
                <SportIcon className="w-3.5 h-3.5 mr-0.5 inline-block" /> {sportName}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold mb-2">{tournament.name}</h1>
          {tournament.description && (
            <p className="text-blue-100 mb-6 max-w-2xl">{tournament.description}</p>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-blue-200" />
              </div>
              <span className="text-sm">{cityDisplay}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-blue-200" />
              </div>
              <span className="text-sm">{formatDate(tournament.startDate)}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-blue-200" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm">{enrollmentCount}/{maxParticipants}</span>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-white/70 to-white transition-all duration-500"
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-400/25 flex items-center justify-center shrink-0">
                <Coins className="w-4 h-4 text-amber-300" />
              </div>
              <span className="text-sm font-semibold">{prizePool.toLocaleString()} GCoins</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {canEnroll ? (
              <Button variant="accent" size="lg" onClick={handleEnroll} loading={enrolling}>
                <Trophy className="w-5 h-5" />
                {enrolling ? "Inscrevendo..." : `Inscrever-se (${entryFee} GCoins)`}
              </Button>
            ) : enrollSuccess ? (
              <Button variant="accent" size="lg" disabled>
                <Trophy className="w-5 h-5" />
                Inscrito!
              </Button>
            ) : (
              <Button variant="accent" size="lg" disabled>
                <Trophy className="w-5 h-5" />
                Inscricoes {tournament.status === "completed" ? "encerradas" : "fechadas"}
              </Button>
            )}
            <Button variant="ghost" size="lg" className="text-white border border-white/30 hover:bg-white/10">
              <Swords className="w-5 h-5" />
              Fazer Palpite
            </Button>
          </div>

          {canGenerateBracket && (
            <div className="mt-4">
              <Button
                variant="accent"
                size="lg"
                onClick={handleGenerateBracket}
                loading={generateBracketMutation.isPending}
                disabled={generateBracketMutation.isPending}
              >
                <Swords className="w-5 h-5" />
                {generateBracketMutation.isPending
                  ? "Gerando chaves..."
                  : "Gerar Chaves"}
              </Button>
              {generateBracketMutation.isError && (
                <p className="mt-2 text-sm text-red-200 bg-red-500/20 rounded-lg px-3 py-2">
                  {generateBracketMutation.error.message}
                </p>
              )}
              {generateBracketMutation.isSuccess && (
                <p className="mt-2 text-sm text-green-200 bg-green-500/20 rounded-lg px-3 py-2">
                  Chaves geradas com sucesso!
                </p>
              )}
            </div>
          )}

          {enrollError && (
            <p className="mt-3 text-sm text-red-200 bg-red-500/20 rounded-lg px-3 py-2">{enrollError}</p>
          )}
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs
        tabs={[
          { id: "info", label: "Informacoes" },
          { id: "participants", label: `Participantes (${enrollmentCount})` },
          { id: "bracket", label: "Chaves" },
          ...(showStandingsTab
            ? [{ id: "standings", label: "Classificacao" }]
            : []),
          { id: "rules", label: "Regras" },
        ]}
      >
        {(tab) => (
          <>
            {tab === "info" && (
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardTitle>Detalhes do Torneio</CardTitle>
                  <CardContent className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-slate-50">
                        <p className="text-xs text-slate-500 mb-0.5">Formato</p>
                        <p className="font-semibold text-slate-900">
                          {formatMap[tournament.format ?? ""] ?? tournament.format ?? "--"}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50">
                        <p className="text-xs text-slate-500 mb-0.5">Nivel</p>
                        <p className="font-semibold text-slate-900">
                          {tournament.level ? `Categoria ${tournament.level}` : "--"}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50">
                        <p className="text-xs text-slate-500 mb-0.5">Inicio</p>
                        <p className="font-semibold text-slate-900">{formatDate(tournament.startDate)}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50">
                        <p className="text-xs text-slate-500 mb-0.5">Termino</p>
                        <p className="font-semibold text-slate-900">{formatDate(tournament.endDate)}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50">
                        <p className="text-xs text-slate-500 mb-0.5">Inscricao</p>
                        <p className="font-semibold text-slate-900">
                          {entryFee > 0 ? `${entryFee} GCoins` : "Gratis"}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50">
                        <p className="text-xs text-slate-500 mb-0.5">Limite de inscricao</p>
                        <p className="font-semibold text-slate-900">
                          {formatDate(tournament.registrationDeadline)}
                        </p>
                      </div>
                    </div>
                    {tournament.address && (
                      <div className="p-3 rounded-xl bg-slate-50">
                        <p className="text-xs text-slate-500 mb-0.5">Endereco</p>
                        <p className="font-semibold text-slate-900">{tournament.address}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <Card>
                    <CardTitle>Premiacao</CardTitle>
                    <CardContent className="mt-4 space-y-3">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">1</span>
                          </div>
                          <span className="text-sm font-medium text-slate-700">1o Lugar</span>
                        </div>
                        <span className="font-bold text-amber-600">{Math.round(prizePool * 0.5).toLocaleString()} GCoins</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-400 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">2</span>
                          </div>
                          <span className="text-sm font-medium text-slate-700">2o Lugar</span>
                        </div>
                        <span className="font-bold text-slate-500">{Math.round(prizePool * 0.3).toLocaleString()} GCoins</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50/50">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-amber-700 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">3</span>
                          </div>
                          <span className="text-sm font-medium text-slate-700">3o Lugar</span>
                        </div>
                        <span className="font-bold text-amber-800">{Math.round(prizePool * 0.2).toLocaleString()} GCoins</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardTitle>Organizador</CardTitle>
                    <CardContent className="mt-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={tournament.organizer?.name ?? "Organizador"} size="lg" />
                        <div>
                          <p className="font-medium text-slate-900">{tournament.organizer?.name ?? "Organizador"}</p>
                          <p className="text-sm text-slate-500">Organizador verificado</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {tab === "participants" && (
              <Card>
                {tournament.enrollments && tournament.enrollments.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {tournament.enrollments.map((enrollment, index) => (
                      <div
                        key={enrollment.id}
                        className={`flex items-center justify-between py-3.5 px-3 rounded-lg transition-colors hover:bg-blue-500/5 ${
                          index % 2 === 0 ? "bg-slate-50/50" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-slate-400 w-7 text-center">
                            #{enrollment.seed ?? index + 1}
                          </span>
                          <Avatar name={enrollment.user?.name ?? "Participante"} size="sm" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {enrollment.user?.name ?? "Participante"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {enrollment.status === "confirmed" ? "Confirmado" :
                               enrollment.status === "checked_in" ? "Check-in realizado" :
                               enrollment.status === "eliminated" ? "Eliminado" :
                               enrollment.status === "winner" ? "Vencedor" :
                               enrollment.status === "cancelled" ? "Cancelado" :
                               "Pendente"}
                            </p>
                          </div>
                        </div>
                        <Badge variant={
                          enrollment.status === "confirmed" || enrollment.status === "checked_in"
                            ? "success"
                            : enrollment.status === "winner"
                              ? "accent"
                              : "default"
                        }>
                          {enrollment.status === "winner" ? "Vencedor" :
                           enrollment.status === "confirmed" ? "Confirmado" :
                           enrollment.status === "checked_in" ? "Check-in" :
                           enrollment.status === "eliminated" ? "Eliminado" :
                           "Pendente"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="w-10 h-10 text-slate-300 mb-3" />
                    <p className="text-sm text-slate-500">Nenhum participante inscrito ainda.</p>
                  </div>
                )}
              </Card>
            )}

            {tab === "bracket" && (
              <Card>
                <CardTitle className="mb-6">Chave do Torneio</CardTitle>
                {matchesQuery.isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  </div>
                ) : matchList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Swords className="w-10 h-10 text-slate-300 mb-3" />
                    <p className="text-sm text-slate-500">As chaves ainda nao foram definidas.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {rounds.map((round) => {
                      const roundMatches = matchList.filter((m) => m.round === round);
                      const roundLabel =
                        round === 1 ? "Primeira Rodada" :
                        round === rounds.length ? "Final" :
                        round === rounds.length - 1 ? "Semifinal" :
                        `Rodada ${round}`;

                      return (
                        <div key={round}>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">{round}</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-700">{roundLabel}</h4>
                          </div>
                          <div className="space-y-3">
                            {roundMatches.map((match) => {
                              const isCompleted = match.status === "completed";
                              const p1Won = match.winnerId === match.player1Id && match.player1Id;
                              const p2Won = match.winnerId === match.player2Id && match.player2Id;

                              return (
                                <div
                                  key={match.id}
                                  className={`rounded-xl border overflow-hidden transition-all ${
                                    isCompleted
                                      ? "bg-white border-slate-200 shadow-sm"
                                      : "bg-slate-50 border-slate-100"
                                  }`}
                                >
                                  {/* Player 1 */}
                                  <div className={`flex items-center justify-between px-4 py-2.5 ${
                                    p1Won ? "bg-blue-500/5" : ""
                                  }`}>
                                    <div className="flex items-center gap-2.5">
                                      {p1Won && (
                                        <Trophy className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                      )}
                                      <span className={`text-sm ${
                                        p1Won
                                          ? "font-bold text-blue-700"
                                          : isCompleted
                                            ? "text-slate-400"
                                            : "text-slate-700 font-medium"
                                      }`}>
                                        {getPlayerName(match.player1Id)}
                                      </span>
                                    </div>
                                    {match.score1 != null && (
                                      <span className={`text-xs font-mono ${
                                        p1Won ? "text-blue-600 font-semibold" : "text-slate-400"
                                      }`}>
                                        {match.score1}
                                      </span>
                                    )}
                                  </div>

                                  {/* VS divider */}
                                  <div className="flex items-center px-4">
                                    <div className="flex-1 h-px bg-slate-200" />
                                    <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">vs</span>
                                    <div className="flex-1 h-px bg-slate-200" />
                                  </div>

                                  {/* Player 2 */}
                                  <div className={`flex items-center justify-between px-4 py-2.5 ${
                                    p2Won ? "bg-blue-500/5" : ""
                                  }`}>
                                    <div className="flex items-center gap-2.5">
                                      {p2Won && (
                                        <Trophy className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                      )}
                                      <span className={`text-sm ${
                                        p2Won
                                          ? "font-bold text-blue-700"
                                          : isCompleted
                                            ? "text-slate-400"
                                            : "text-slate-700 font-medium"
                                      }`}>
                                        {getPlayerName(match.player2Id)}
                                      </span>
                                    </div>
                                    {match.score2 != null && (
                                      <span className={`text-xs font-mono ${
                                        p2Won ? "text-blue-600 font-semibold" : "text-slate-400"
                                      }`}>
                                        {match.score2}
                                      </span>
                                    )}
                                  </div>

                                  {/* Status footer for non-completed matches */}
                                  {!isCompleted && (
                                    <div className="px-4 py-1.5 bg-slate-100/50 border-t border-slate-100">
                                      <Badge variant={match.status === "live" ? "danger" : "info"} className="text-[10px]">
                                        {match.status === "live" ? "Ao Vivo" :
                                         match.status === "cancelled" ? "Cancelado" :
                                         "Agendado"}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            )}

            {tab === "standings" && showStandingsTab && (
              <Card>
                <CardTitle className="mb-6">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Classificacao
                  </div>
                </CardTitle>
                {standingsQuery.isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  </div>
                ) : standingsQuery.data && standingsQuery.data.length > 0 ? (
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-2 px-2 font-semibold text-slate-500 text-xs">#</th>
                            <th className="text-left py-2 px-2 font-semibold text-slate-500 text-xs">Jogador</th>
                            <th className="text-center py-2 px-2 font-semibold text-slate-500 text-xs">J</th>
                            <th className="text-center py-2 px-2 font-semibold text-slate-500 text-xs">V</th>
                            <th className="text-center py-2 px-2 font-semibold text-slate-500 text-xs">E</th>
                            <th className="text-center py-2 px-2 font-semibold text-slate-500 text-xs">D</th>
                            <th className="text-center py-2 px-2 font-semibold text-slate-500 text-xs">GP</th>
                            <th className="text-center py-2 px-2 font-semibold text-slate-500 text-xs">GC</th>
                            <th className="text-center py-2 px-2 font-semibold text-slate-500 text-xs">SG</th>
                            <th className="text-center py-2 px-2 font-semibold text-slate-500 text-xs">Pts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {standingsQuery.data.map((row, index) => (
                            <tr
                              key={row.participantId}
                              className={`border-b border-slate-100 transition-colors hover:bg-blue-500/5 ${
                                index < 3 ? "bg-slate-50/50" : ""
                              }`}
                            >
                              <td className="py-2.5 px-2">
                                <span className={`text-sm font-bold ${
                                  index === 0
                                    ? "text-amber-500"
                                    : index === 1
                                      ? "text-slate-400"
                                      : index === 2
                                        ? "text-amber-700"
                                        : "text-slate-400"
                                }`}>
                                  {index + 1}
                                </span>
                              </td>
                              <td className="py-2.5 px-2">
                                <div className="flex items-center gap-2">
                                  <Avatar name={row.participantName} size="sm" />
                                  <span className="font-medium text-slate-900">{row.participantName}</span>
                                </div>
                              </td>
                              <td className="text-center py-2.5 px-2 text-slate-600">{row.played}</td>
                              <td className="text-center py-2.5 px-2 text-green-600 font-medium">{row.wins}</td>
                              <td className="text-center py-2.5 px-2 text-slate-500">{row.draws}</td>
                              <td className="text-center py-2.5 px-2 text-red-500">{row.losses}</td>
                              <td className="text-center py-2.5 px-2 text-slate-600">{row.goalsFor}</td>
                              <td className="text-center py-2.5 px-2 text-slate-600">{row.goalsAgainst}</td>
                              <td className="text-center py-2.5 px-2 font-medium text-slate-700">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                              <td className="text-center py-2.5 px-2">
                                <span className="font-bold text-blue-600">{row.points}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <BarChart3 className="w-10 h-10 text-slate-300 mb-3" />
                    <p className="text-sm text-slate-500">Nenhuma classificacao disponivel ainda.</p>
                  </div>
                )}
              </Card>
            )}

            {tab === "rules" && (
              <Card>
                <CardTitle className="mb-6">Regras do Torneio</CardTitle>
                {tournament.rules ? (
                  <div className="space-y-3">
                    {tournament.rules.split("\n").filter(Boolean).map((rule, i) => {
                      const ruleNumber = rule.match(/^(\d+)\./)?.[1];
                      const ruleText = rule.replace(/^\d+\.\s*/, "");

                      return (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-sm font-bold text-blue-600">{ruleNumber || i + 1}</span>
                          </div>
                          <p className="text-slate-700 text-sm leading-relaxed pt-1.5">{ruleText}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-sm text-slate-500">Nenhuma regra definida para este torneio.</p>
                  </div>
                )}
              </Card>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}
