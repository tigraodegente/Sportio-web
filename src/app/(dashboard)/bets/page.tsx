"use client";

import { useState, useMemo } from "react";
import { Target, TrendingUp, Trophy, Clock, CheckCircle2, XCircle, Swords, Flame, Zap, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/ui/stats-card";
import { Tabs } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

// ---------------------------------------------------------------------------
// Sport colour mapping (reused from the original design)
// ---------------------------------------------------------------------------
const sportColors: Record<string, { bg: string; text: string; border: string }> = {
  "Beach Tennis": { bg: "bg-orange-100", text: "text-orange-700", border: "border-l-orange-500" },
  CrossFit:       { bg: "bg-purple-100", text: "text-purple-700", border: "border-l-purple-500" },
  Futebol:        { bg: "bg-blue-100",   text: "text-blue-700",   border: "border-l-blue-500" },
  Volei:          { bg: "bg-blue-100",   text: "text-blue-700",   border: "border-l-blue-500" },
  Futevolei:      { bg: "bg-cyan-100",   text: "text-cyan-700",   border: "border-l-cyan-500" },
};
const defaultSportColor = { bg: "bg-slate-100", text: "text-slate-700", border: "border-l-slate-500" };

const getSportColor = (sport: string) => sportColors[sport] || defaultSportColor;

// ---------------------------------------------------------------------------
// Result icons
// ---------------------------------------------------------------------------
const resultIcons: Record<string, React.ReactNode> = {
  pending:   <Clock className="w-4 h-4 text-blue-500" />,
  won:       <CheckCircle2 className="w-4 h-4 text-green-500" />,
  lost:      <XCircle className="w-4 h-4 text-red-500" />,
  cancelled: <XCircle className="w-4 h-4 text-slate-400" />,
  refunded:  <Clock className="w-4 h-4 text-slate-400" />,
};

const HOT_THRESHOLD = 100;

// Fixed odds shown in the UI (the backend uses a simple 1.8x for winner bets)
const WINNER_ODDS = 1.8;

// ---------------------------------------------------------------------------
// Types derived from DB schema (matches & bets with their relations)
// ---------------------------------------------------------------------------
interface LiveMatch {
  id: string;
  tournamentId: string;
  round: number;
  position: number;
  player1Id: string | null;
  player2Id: string | null;
  team1Id: string | null;
  team2Id: string | null;
  winnerId: string | null;
  score1: number | null;
  score2: number | null;
  status: string | null;
  scheduledAt: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  tournament: {
    id: string;
    name: string;
    sport: { id: string; name: string; slug: string } | null;
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
}

interface MyBet {
  id: string;
  userId: string;
  matchId: string;
  tournamentId: string;
  betType: string;
  prediction: unknown;
  amount: string;
  odds: string | null;
  potentialWin: string | null;
  result: string | null;
  settledAt: Date | null;
  createdAt: Date;
  match: {
    id: string;
    round: number;
    position: number;
    score1: number | null;
    score2: number | null;
    [key: string]: unknown;
  } | null;
  tournament: {
    id: string;
    name: string;
    [key: string]: unknown;
  } | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getMatchScore(match: LiveMatch): string {
  if (match.score1 != null && match.score2 != null) {
    return `${match.score1}-${match.score2}`;
  }
  return "0-0";
}

function getMatchSportName(match: LiveMatch): string {
  return match.tournament?.sport?.name ?? "";
}

function getMatchTournamentName(match: LiveMatch): string {
  return match.tournament?.name ?? "";
}

/** Display name for a side of the match. Falls back to "Jogador N" / "Time N". */
function getPlayerLabel(match: LiveMatch, side: 1 | 2): string {
  if (side === 1) {
    if (match.team1Id) return "Time 1";
    return match.player1Id ? "Jogador 1" : "TBD";
  }
  if (match.team2Id) return "Time 2";
  return match.player2Id ? "Jogador 2" : "TBD";
}

function formatRelativeDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  return `${diffDays} dias atras`;
}

function getBetPrediction(bet: MyBet): string {
  const p = bet.prediction as Record<string, unknown> | null;
  if (!p) return "";
  if (typeof p.winner === "string") return p.winner;
  if (typeof p.value === "string") return p.value;
  const first = Object.values(p)[0];
  if (typeof first === "string") return first;
  return "";
}

function getBetMatchLabel(bet: MyBet): string {
  if (bet.match) {
    const m = bet.match;
    const s1 = m.score1 ?? 0;
    const s2 = m.score2 ?? 0;
    return `Partida R${m.round}-${m.position} (${s1}-${s2})`;
  }
  return "Partida";
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function BetsPage() {
  const [showBetModal, setShowBetModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<LiveMatch | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<1 | 2 | null>(null);
  const [betAmount, setBetAmount] = useState("");

  // ---- tRPC queries -------------------------------------------------------
  const liveMatches = trpc.match.live.useQuery();
  const myBets = trpc.bet.myBets.useQuery({ limit: 50 });
  const balance = trpc.gcoin.balance.useQuery();
  const leaderboard = trpc.bet.leaderboard.useQuery({ limit: 50 });

  const placeBet = trpc.bet.place.useMutation({
    onSuccess: () => {
      myBets.refetch();
      balance.refetch();
      setShowBetModal(false);
      setSelectedMatch(null);
      setSelectedPlayer(null);
      setBetAmount("");
    },
  });

  // ---- Derived stats ------------------------------------------------------
  const stats = useMemo(() => {
    const bets = (myBets.data ?? []) as MyBet[];
    const total = bets.length;
    const won = bets.filter((b) => b.result === "won").length;
    const lost = bets.filter((b) => b.result === "lost").length;
    const settled = won + lost;
    const hitRate = settled > 0 ? Math.round((won / settled) * 100) : 0;
    return { total, won, lost, hitRate };
  }, [myBets.data]);

  // Find user rank in leaderboard (the query doesn't flag currentUser, so skip for now)
  const _leaderboardData = leaderboard.data;

  // ---- Modal helpers ------------------------------------------------------
  const openBetModal = (match: LiveMatch) => {
    setSelectedMatch(match);
    setSelectedPlayer(null);
    setBetAmount("");
    placeBet.reset();
    setShowBetModal(true);
  };

  const handlePlaceBet = () => {
    if (!selectedMatch || !selectedPlayer || !betAmount) return;
    const amount = Number(betAmount);
    if (amount <= 0) return;

    const playerLabel = getPlayerLabel(selectedMatch, selectedPlayer);

    placeBet.mutate({
      matchId: selectedMatch.id,
      tournamentId: selectedMatch.tournamentId,
      betType: "winner",
      prediction: { winner: playerLabel },
      amount,
    });
  };

  const potentialReturn =
    betAmount && selectedPlayer
      ? Math.round(Number(betAmount) * WINNER_ODDS * 100) / 100
      : 0;

  // ---- Shorthand ----------------------------------------------------------
  const matchesData = (liveMatches.data ?? []) as LiveMatch[];
  const betsData = (myBets.data ?? []) as MyBet[];
  const balanceData = balance.data;

  // =========================================================================
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Palpites</h1>
        <p className="text-sm sm:text-base text-slate-500 mt-1">Faca palpites nas partidas e ganhe GCoins</p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Stats                                                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {myBets.isLoading || balance.isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 sm:p-5 flex items-center justify-center min-h-[100px]">
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            </div>
          ))
        ) : (
          <>
            <StatsCard
              title="Taxa de Acerto"
              value={`${stats.hitRate}%`}
              changeType={stats.hitRate >= 50 ? "positive" : stats.hitRate > 0 ? "negative" : "neutral"}
              change={
                stats.won + stats.lost > 0
                  ? `${stats.won} de ${stats.won + stats.lost} acertos`
                  : "Sem palpites finalizados"
              }
              icon={<Target className="w-5 h-5" />}
            />
            <StatsCard
              title="Saldo GCoins"
              value={balanceData ? balanceData.total.toLocaleString("pt-BR") : "--"}
              changeType="positive"
              change={
                balanceData
                  ? `${balanceData.gamification.toLocaleString("pt-BR")} gamificacao`
                  : "Carregando..."
              }
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <StatsCard
              title="Total de Palpites"
              value={String(stats.total)}
              changeType="neutral"
              change={`${stats.won} ganhos, ${stats.lost} perdidos`}
              icon={<Swords className="w-5 h-5" />}
            />
            <StatsCard
              title="Ranking"
              value="--"
              changeType="neutral"
              change={_leaderboardData ? `${_leaderboardData.length} no ranking` : "Carregando..."}
              icon={<Trophy className="w-5 h-5" />}
            />
          </>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Live Matches                                                        */}
      {/* ------------------------------------------------------------------ */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <CardTitle>Partidas ao Vivo</CardTitle>
          <Badge variant="live" className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            AO VIVO
          </Badge>
        </div>

        {liveMatches.isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            <span className="ml-2 text-sm text-slate-500">Carregando partidas...</span>
          </div>
        ) : liveMatches.isError ? (
          <div className="flex items-center justify-center py-12 text-red-500">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="text-sm">Erro ao carregar partidas. Tente novamente.</span>
          </div>
        ) : matchesData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Swords className="w-10 h-10 mb-3 opacity-50" />
            <p className="text-sm font-medium">Nenhuma partida ao vivo no momento</p>
            <p className="text-xs mt-1">Volte mais tarde para ver partidas disponiveis</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matchesData.map((match) => {
              const sport = getMatchSportName(match);
              const sportColor = getSportColor(sport);
              const betsCount = 0; // bets relation not loaded in live query
              const isHot = betsCount >= HOT_THRESHOLD;
              const player1 = getPlayerLabel(match, 1);
              const player2 = getPlayerLabel(match, 2);
              const score = getMatchScore(match);
              const tournamentName = getMatchTournamentName(match);

              return (
                <div
                  key={match.id}
                  className={`relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-100 transition-all duration-300 hover:shadow-md hover:border-slate-200 group border-l-[4px] ${sportColor.border}`}
                >
                  {/* Hot badge */}
                  {isHot && (
                    <div className="absolute -top-2 right-4 sm:right-auto sm:left-12">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold rounded-full shadow-sm shadow-orange-500/30">
                        <Flame className="w-2.5 h-2.5 fill-current" />
                        Hot
                      </span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    {/* Tournament and sport info */}
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${sportColor.bg} ${sportColor.text}`}>
                        {sport || "Esporte"}
                      </span>
                      <span className="text-xs text-slate-400 truncate">{tournamentName}</span>
                    </div>

                    {/* Match display */}
                    <div className="flex items-center gap-3">
                      {/* Player 1 */}
                      <div className="flex-1 text-right">
                        <p className="text-sm font-semibold text-slate-900 truncate">{player1}</p>
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 border border-blue-200/50 rounded-md text-xs font-bold text-blue-700">
                            {WINNER_ODDS.toFixed(2)}x
                          </span>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="px-4 py-2 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 shrink-0">
                        {score}
                      </div>

                      {/* Player 2 */}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">{player2}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 border border-blue-200/50 rounded-md text-xs font-bold text-blue-700">
                            {WINNER_ODDS.toFixed(2)}x
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button size="sm" onClick={() => openBetModal(match)} className="shrink-0 self-end sm:self-center">
                    Palpitar
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* My Bets                                                             */}
      {/* ------------------------------------------------------------------ */}
      <Card>
        <CardTitle className="mb-4">Meus Palpites</CardTitle>

        {myBets.isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            <span className="ml-2 text-sm text-slate-500">Carregando palpites...</span>
          </div>
        ) : myBets.isError ? (
          <div className="flex items-center justify-center py-12 text-red-500">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="text-sm">Erro ao carregar palpites. Tente novamente.</span>
          </div>
        ) : (
          <Tabs
            tabs={[
              { id: "all", label: "Todos" },
              { id: "pending", label: "Pendentes" },
              { id: "won", label: "Ganhos" },
              { id: "lost", label: "Perdidos" },
            ]}
          >
            {(tab) => {
              const filteredBets = betsData.filter(
                (b) => tab === "all" || b.result === tab
              );

              if (filteredBets.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <Target className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm font-medium">
                      {tab === "all"
                        ? "Voce ainda nao fez nenhum palpite"
                        : tab === "pending"
                          ? "Nenhum palpite pendente"
                          : tab === "won"
                            ? "Nenhum palpite ganho ainda"
                            : "Nenhum palpite perdido"}
                    </p>
                    {tab === "all" && (
                      <p className="text-xs mt-1">Faca seu primeiro palpite nas partidas ao vivo acima!</p>
                    )}
                  </div>
                );
              }

              return (
                <div className="space-y-2">
                  {filteredBets.map((bet) => {
                    const result = bet.result ?? "pending";
                    const matchLabel = getBetMatchLabel(bet);
                    const prediction = getBetPrediction(bet);
                    const amount = Number(bet.amount);
                    const odds = Number(bet.odds ?? 1);
                    const potentialWin = Number(bet.potentialWin ?? amount * odds);
                    const date = formatRelativeDate(bet.createdAt);
                    const tournamentName = bet.tournament?.name ?? "";

                    return (
                      <div
                        key={bet.id}
                        className={`flex items-center justify-between py-3 px-3 sm:px-4 rounded-xl transition-all duration-200 ${
                          result === "won"
                            ? "bg-green-50/60 border border-green-100 shadow-[inset_0_0_20px_rgba(34,197,94,0.05)]"
                            : result === "lost"
                              ? "bg-red-50/40 border border-red-100/60"
                              : "bg-blue-50/30 border border-blue-100/50"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                              result === "won"
                                ? "bg-green-100 shadow-sm shadow-green-200"
                                : result === "lost"
                                  ? "bg-red-100"
                                  : "bg-blue-100"
                            }`}
                          >
                            {resultIcons[result] ?? resultIcons.pending}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{matchLabel}</p>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                              {prediction && (
                                <span className="text-xs text-slate-500 truncate">
                                  Palpite: <span className="font-medium text-slate-700">{prediction}</span>
                                </span>
                              )}
                              {odds > 1 && (
                                <span className="inline-flex items-center px-1.5 py-0 bg-slate-100 rounded text-[11px] font-semibold text-slate-600">
                                  {odds.toFixed(2)}x
                                </span>
                              )}
                              {date && <span className="text-[11px] text-slate-400">{date}</span>}
                              {tournamentName && (
                                <span className="text-[11px] text-slate-400 truncate hidden sm:inline">
                                  {tournamentName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p className="text-sm font-bold text-slate-900">{amount} GC</p>
                          <p
                            className={`text-xs font-semibold ${
                              result === "won"
                                ? "text-green-600"
                                : result === "lost"
                                  ? "text-red-500"
                                  : "text-blue-600"
                            }`}
                          >
                            {result === "won"
                              ? `+${potentialWin} GC`
                              : result === "lost"
                                ? "Perdeu"
                                : `Potencial: +${potentialWin}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }}
          </Tabs>
        )}
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Bet Modal                                                           */}
      {/* ------------------------------------------------------------------ */}
      <Modal isOpen={showBetModal} onClose={() => setShowBetModal(false)} title="Fazer Palpite">
        {selectedMatch && (() => {
          const sport = getMatchSportName(selectedMatch);
          const sportColor = getSportColor(sport);
          const player1 = getPlayerLabel(selectedMatch, 1);
          const player2 = getPlayerLabel(selectedMatch, 2);
          const score = getMatchScore(selectedMatch);
          const tournamentName = getMatchTournamentName(selectedMatch);

          return (
            <div className="space-y-5">
              {/* Tournament info */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${sportColor.bg} ${sportColor.text}`}>
                  {sport || "Esporte"}
                </span>
                <span className="text-sm text-slate-500">{tournamentName}</span>
              </div>

              {/* Live score */}
              <div className="flex items-center justify-center">
                <div className="px-5 py-2 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl text-lg font-bold shadow-lg shadow-slate-900/20">
                  {score}
                </div>
              </div>

              {/* Player selection */}
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Selecione seu palpite</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedPlayer(1)}
                  className={`relative p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                    selectedPlayer === 1
                      ? "border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20"
                      : "border-slate-200 hover:border-blue-400 hover:shadow-md hover:shadow-blue-500/5"
                  }`}
                >
                  {selectedPlayer === 1 && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <p className={`font-semibold truncate ${selectedPlayer === 1 ? "text-blue-800" : "text-slate-900"}`}>
                    {player1}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <p className="text-lg font-bold text-blue-600">{WINNER_ODDS.toFixed(2)}x</p>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedPlayer(2)}
                  className={`relative p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                    selectedPlayer === 2
                      ? "border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20"
                      : "border-slate-200 hover:border-blue-400 hover:shadow-md hover:shadow-blue-500/5"
                  }`}
                >
                  {selectedPlayer === 2 && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <p className={`font-semibold truncate ${selectedPlayer === 2 ? "text-blue-800" : "text-slate-900"}`}>
                    {player2}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <p className="text-lg font-bold text-blue-600">{WINNER_ODDS.toFixed(2)}x</p>
                  </div>
                </button>
              </div>

              {/* Amount input with balance info */}
              <div>
                <Input
                  label="Quantidade (GCoins)"
                  type="number"
                  placeholder="0"
                  min={1}
                  max={balanceData?.total}
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                />
                {balanceData && (
                  <p className="text-xs text-slate-400 mt-1">
                    Saldo disponivel:{" "}
                    <span className="font-semibold text-slate-600">
                      {balanceData.total.toLocaleString("pt-BR")} GCoins
                    </span>
                  </p>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Retorno potencial:</span>
                  <span className="font-bold text-blue-700">
                    {potentialReturn > 0 ? potentialReturn.toLocaleString("pt-BR") : "0"} GCoins
                  </span>
                </div>
              </div>

              {/* Error message */}
              {placeBet.isError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-sm text-red-600">
                    {placeBet.error?.message ?? "Erro ao fazer palpite. Tente novamente."}
                  </p>
                </div>
              )}

              <Button
                size="lg"
                className="w-full"
                disabled={!selectedPlayer || !betAmount || Number(betAmount) <= 0}
                loading={placeBet.isPending}
                onClick={handlePlaceBet}
              >
                <Target className="w-5 h-5" />
                Confirmar Palpite
              </Button>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
