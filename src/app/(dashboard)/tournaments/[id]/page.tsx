"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Trophy, MapPin, Calendar, Users, Coins, Share2, Swords, Loader2, AlertCircle } from "lucide-react";
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

const sportEmojiMap: Record<string, string> = {
  "Beach Tennis": "\u{1F3D6}\uFE0F",
  "CrossFit": "\u{1F3CB}\uFE0F",
  "Futebol": "\u26BD",
  "E-Sports": "\u{1F3AE}",
  "Corrida": "\u{1F3C3}",
  "Volei": "\u{1F3D0}",
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

  const handleEnroll = () => {
    setEnrolling(true);
    setEnrollError(null);
    enrollMutation.mutate({ tournamentId });
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
  const sportEmoji = sportEmojiMap[sportName] || "\u{1F3C6}";
  const cityDisplay = tournament.isOnline
    ? "Online"
    : [tournament.city, tournament.state].filter(Boolean).join(", ") || "--";
  const canEnroll = tournament.status === "registration_open" && !enrollSuccess;

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
                {statusMap[tournament.status]?.label ?? tournament.status}
              </Badge>
              <Badge className="bg-white/15 text-white border-0 backdrop-blur-sm">
                <span className="mr-0.5">{sportEmoji}</span> {sportName}
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
                          <span className="text-lg">{"\u{1F947}"}</span>
                          <span className="text-sm font-medium text-slate-700">1o Lugar</span>
                        </div>
                        <span className="font-bold text-amber-600">{Math.round(prizePool * 0.5).toLocaleString()} GCoins</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{"\u{1F948}"}</span>
                          <span className="text-sm font-medium text-slate-700">2o Lugar</span>
                        </div>
                        <span className="font-bold text-slate-500">{Math.round(prizePool * 0.3).toLocaleString()} GCoins</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50/50">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{"\u{1F949}"}</span>
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
                                        {match.player1Id ? `Jogador` : "TBD"}
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
                                        {match.player2Id ? `Jogador` : "TBD"}
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
