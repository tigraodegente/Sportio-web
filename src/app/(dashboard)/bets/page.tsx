"use client";

import { useState, useMemo } from "react";
import { Target, TrendingUp, Trophy, Clock, CheckCircle2, XCircle, Swords, Flame, ArrowUpRight, ArrowDownRight, Zap, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/ui/stats-card";
import { Tabs } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

const sportColors: Record<string, { bg: string; text: string; gradient: string; border: string }> = {
  "Beach Tennis": { bg: "bg-orange-100", text: "text-orange-700", gradient: "from-orange-400 to-orange-600", border: "border-l-orange-500" },
  "CrossFit": { bg: "bg-purple-100", text: "text-purple-700", gradient: "from-purple-400 to-purple-600", border: "border-l-purple-500" },
  "Futebol": { bg: "bg-blue-100", text: "text-blue-700", gradient: "from-blue-400 to-blue-600", border: "border-l-blue-500" },
  "Volei": { bg: "bg-blue-100", text: "text-blue-700", gradient: "from-blue-400 to-blue-600", border: "border-l-blue-500" },
  "Futevolei": { bg: "bg-cyan-100", text: "text-cyan-700", gradient: "from-cyan-400 to-cyan-600", border: "border-l-cyan-500" },
};

const defaultSportColor = { bg: "bg-slate-100", text: "text-slate-700", gradient: "from-slate-400 to-slate-600", border: "border-l-slate-500" };

const resultIcons = {
  pending: <Clock className="w-4 h-4 text-blue-500" />,
  won: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  lost: <XCircle className="w-4 h-4 text-red-500" />,
};

const HOT_THRESHOLD = 100;

export default function BetsPage() {
  const [showBetModal, setShowBetModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Record<string, unknown> | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<1 | 2 | null>(null);
  const [betAmount, setBetAmount] = useState("");

  // tRPC queries
  const liveMatches = trpc.match.live.useQuery();
  const myBets = trpc.bet.myBets.useQuery({ limit: 50 });
  const balance = trpc.gcoin.balance.useQuery();
  const leaderboard = trpc.bet.leaderboard.useQuery({ limit: 10 });

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

  // Derive stats from real data
  const stats = useMemo(() => {
    const bets = myBets.data ?? [];
    const total = bets.length;
    const won = bets.filter((b: Record<string, unknown>) => b.result === "won").length;
    const lost = bets.filter((b: Record<string, unknown>) => b.result === "lost").length;
    const settled = won + lost;
    const hitRate = settled > 0 ? Math.round((won / settled) * 100) : 0;

    // Sum up winnings from won bets
    const totalProfit = bets
      .filter((b: Record<string, unknown>) => b.result === "won")
      .reduce((sum: number, b: Record<string, unknown>) => sum + (Number(b.potentialWin ?? b.payout ?? 0)), 0);

    return { total, won, lost, hitRate, totalProfit };
  }, [myBets.data]);

  // Find user rank in leaderboard
  const userRank = useMemo(() => {
    if (!leaderboard.data) return null;
    // The leaderboard query returns an array; we check for the user's rank if available
    const data = leaderboard.data as Array<Record<string, unknown>>;
    const entry = data.find((e) => e.isCurrentUser);
    if (entry) return entry.rank;
    return null;
  }, [leaderboard.data]);

  const openBetModal = (match: Record<string, unknown>) => {
    setSelectedMatch(match);
    setSelectedPlayer(null);
    setBetAmount("");
    placeBet.reset();
    setShowBetModal(true);
  };

  const getSportColor = (sport: string) => sportColors[sport] || defaultSportColor;

  const handlePlaceBet = () => {
    if (!selectedMatch || !selectedPlayer || !betAmount) return;

    const amount = Number(betAmount);
    if (amount <= 0) return;

    const playerKey = selectedPlayer === 1 ? "player1" : "player2";
    const playerName = String(selectedMatch[playerKey] ?? selectedMatch[`${playerKey}Name`] ?? "");

    placeBet.mutate({
      matchId: String(selectedMatch.id),
      tournamentId: String(selectedMatch.tournamentId ?? selectedMatch.tournament?.id ?? ""),
      betType: "winner" as const,
      prediction: { winner: playerName },
      amount,
    });
  };

  // Compute potential return for the modal
  const selectedOdds = selectedMatch
    ? Number(selectedPlayer === 1 ? (selectedMatch.odds1 ?? 1) : selectedPlayer === 2 ? (selectedMatch.odds2 ?? 1) : 0)
    : 0;
  const potentialReturn = betAmount && selectedOdds ? Math.round(Number(betAmount) * selectedOdds * 100) / 100 : 0;

  // Helpers
  const matchesData = (liveMatches.data ?? []) as Array<Record<string, unknown>>;
  const betsData = (myBets.data ?? []) as Array<Record<string, unknown>>;
  const balanceData = balance.data as { real: number; gamification: number; total: number } | undefined;

  const getMatchSport = (match: Record<string, unknown>): string => {
    if (typeof match.sport === "string") return match.sport;
    if (match.sport && typeof match.sport === "object" && "name" in (match.sport as object)) return String((match.sport as Record<string, unknown>).name);
    if (match.tournament && typeof match.tournament === "object") {
      const t = match.tournament as Record<string, unknown>;
      if (t.sport && typeof t.sport === "object" && "name" in (t.sport as object)) return String((t.sport as Record<string, unknown>).name);
      if (typeof t.sport === "string") return t.sport;
    }
    return "";
  };

  const getMatchTournamentName = (match: Record<string, unknown>): string => {
    if (typeof match.tournament === "string") return match.tournament;
    if (match.tournament && typeof match.tournament === "object") {
      const t = match.tournament as Record<string, unknown>;
      return String(t.name ?? t.title ?? "");
    }
    if (typeof match.tournamentName === "string") return match.tournamentName;
    return "";
  };

  const getMatchPlayer = (match: Record<string, unknown>, num: 1 | 2): string => {
    const key = `player${num}`;
    const nameKey = `player${num}Name`;
    if (typeof match[key] === "string") return match[key] as string;
    if (typeof match[nameKey] === "string") return match[nameKey] as string;
    if (match[key] && typeof match[key] === "object") {
      const p = match[key] as Record<string, unknown>;
      return String(p.name ?? p.displayName ?? "");
    }
    // Try teams
    const teamKey = `team${num}`;
    const teamNameKey = `team${num}Name`;
    if (typeof match[teamKey] === "string") return match[teamKey] as string;
    if (typeof match[teamNameKey] === "string") return match[teamNameKey] as string;
    if (match[teamKey] && typeof match[teamKey] === "object") {
      const t = match[teamKey] as Record<string, unknown>;
      return String(t.name ?? t.displayName ?? "");
    }
    return `Player ${num}`;
  };

  const getMatchScore = (match: Record<string, unknown>): string => {
    if (typeof match.score === "string") return match.score;
    if (typeof match.currentScore === "string") return match.currentScore;
    return "0-0";
  };

  const getBetResult = (bet: Record<string, unknown>): string => {
    if (typeof bet.result === "string") return bet.result;
    if (typeof bet.status === "string") {
      const s = bet.status as string;
      if (s === "settled" || s === "completed") return bet.won ? "won" : "lost";
      return "pending";
    }
    return "pending";
  };

  const getBetMatchName = (bet: Record<string, unknown>): string => {
    if (typeof bet.matchName === "string") return bet.matchName;
    if (typeof bet.match === "string") return bet.match;
    if (bet.match && typeof bet.match === "object") {
      const m = bet.match as Record<string, unknown>;
      const p1 = getMatchPlayer(m, 1);
      const p2 = getMatchPlayer(m, 2);
      if (p1 && p2) return `${p1} vs ${p2}`;
      return String(m.name ?? m.title ?? "");
    }
    return "Partida";
  };

  const getBetTournament = (bet: Record<string, unknown>): string => {
    if (typeof bet.tournamentName === "string") return bet.tournamentName;
    if (typeof bet.tournament === "string") return bet.tournament;
    if (bet.tournament && typeof bet.tournament === "object") {
      const t = bet.tournament as Record<string, unknown>;
      return String(t.name ?? t.title ?? "");
    }
    if (bet.match && typeof bet.match === "object") {
      return getMatchTournamentName(bet.match as Record<string, unknown>);
    }
    return "";
  };

  const getBetPrediction = (bet: Record<string, unknown>): string => {
    if (typeof bet.prediction === "string") return bet.prediction;
    if (bet.prediction && typeof bet.prediction === "object") {
      const p = bet.prediction as Record<string, unknown>;
      return String(p.winner ?? p.value ?? JSON.stringify(p));
    }
    return "";
  };

  const formatDate = (bet: Record<string, unknown>): string => {
    if (typeof bet.date === "string") return bet.date;
    const dateValue = bet.createdAt ?? bet.placedAt ?? bet.date;
    if (!dateValue) return "";
    try {
      const d = new Date(dateValue as string);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return "Hoje";
      if (diffDays === 1) return "Ontem";
      return `${diffDays} dias atras`;
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Palpites</h1>
        <p className="text-sm sm:text-base text-slate-500 mt-1">Faca palpites nas partidas e ganhe GCoins</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {myBets.isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 sm:p-5 flex items-center justify-center min-h-[100px]">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="Taxa de Acerto"
              value={`${stats.hitRate}%`}
              changeType={stats.hitRate >= 50 ? "positive" : stats.hitRate > 0 ? "negative" : "neutral"}
              change={stats.won + stats.lost > 0 ? `${stats.won} de ${stats.won + stats.lost} acertos` : "Sem palpites finalizados"}
              icon={<Target className="w-5 h-5" />}
            />
            <StatsCard
              title="Saldo GCoins"
              value={balanceData ? balanceData.total.toLocaleString("pt-BR") : "--"}
              changeType="positive"
              change={balanceData ? `${balanceData.gamification.toLocaleString("pt-BR")} gamificacao` : "Carregando..."}
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
              value={userRank ? `#${userRank}` : "--"}
              changeType={userRank ? "positive" : "neutral"}
              change={userRank ? "Entre os melhores" : "Sem ranking"}
              icon={<Trophy className="w-5 h-5" />}
            />
          </>
        )}
      </div>

      {/* Live Matches */}
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
              const sport = getMatchSport(match);
              const sportColor = getSportColor(sport);
              const betsCount = Number(match.betsCount ?? 0);
              const isHot = betsCount >= HOT_THRESHOLD;
              const player1 = getMatchPlayer(match, 1);
              const player2 = getMatchPlayer(match, 2);
              const score = getMatchScore(match);
              const tournamentName = getMatchTournamentName(match);
              const odds1 = Number(match.odds1 ?? 1);
              const odds2 = Number(match.odds2 ?? 1);

              return (
                <div
                  key={String(match.id)}
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
                            {odds1.toFixed(2)}x
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
                            {odds2.toFixed(2)}x
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bets count */}
                    {betsCount > 0 && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <Zap className="w-3 h-3 text-slate-400" />
                        <p className="text-xs text-slate-400 font-medium">{betsCount} palpites</p>
                      </div>
                    )}
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

      {/* My Bets */}
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
              const filteredBets = betsData.filter((b) => {
                const result = getBetResult(b);
                return tab === "all" || result === tab;
              });

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
                    const result = getBetResult(bet);
                    const matchName = getBetMatchName(bet);
                    const prediction = getBetPrediction(bet);
                    const amount = Number(bet.amount ?? 0);
                    const odds = Number(bet.odds ?? 1);
                    const potentialWin = Number(bet.potentialWin ?? bet.payout ?? amount * odds);
                    const date = formatDate(bet);
                    const tournament = getBetTournament(bet);

                    return (
                      <div
                        key={String(bet.id)}
                        className={`flex items-center justify-between py-3 px-3 sm:px-4 rounded-xl transition-all duration-200 ${
                          result === "won"
                            ? "bg-green-50/60 border border-green-100 shadow-[inset_0_0_20px_rgba(34,197,94,0.05)]"
                            : result === "lost"
                              ? "bg-red-50/40 border border-red-100/60"
                              : "bg-blue-50/30 border border-blue-100/50"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            result === "won"
                              ? "bg-green-100 shadow-sm shadow-green-200"
                              : result === "lost"
                                ? "bg-red-100"
                                : "bg-blue-100"
                          }`}>
                            {resultIcons[result as keyof typeof resultIcons] ?? resultIcons.pending}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{matchName}</p>
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
                              {tournament && <span className="text-[11px] text-slate-400 truncate hidden sm:inline">{tournament}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p className="text-sm font-bold text-slate-900">{amount} GC</p>
                          <p className={`text-xs font-semibold ${result === "won" ? "text-green-600" : result === "lost" ? "text-red-500" : "text-blue-600"}`}>
                            {result === "won" ? `+${potentialWin} GC` : result === "lost" ? "Perdeu" : `Potencial: +${potentialWin}`}
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

      {/* Bet Modal */}
      <Modal isOpen={showBetModal} onClose={() => setShowBetModal(false)} title="Fazer Palpite">
        {selectedMatch && (() => {
          const sport = getMatchSport(selectedMatch);
          const sportColor = getSportColor(sport);
          const player1 = getMatchPlayer(selectedMatch, 1);
          const player2 = getMatchPlayer(selectedMatch, 2);
          const score = getMatchScore(selectedMatch);
          const tournamentName = getMatchTournamentName(selectedMatch);
          const odds1 = Number(selectedMatch.odds1 ?? 1);
          const odds2 = Number(selectedMatch.odds2 ?? 1);

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
                    <p className="text-lg font-bold text-blue-600">{odds1.toFixed(2)}x</p>
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
                    <p className="text-lg font-bold text-blue-600">{odds2.toFixed(2)}x</p>
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
                    Saldo disponivel: <span className="font-semibold text-slate-600">{balanceData.total.toLocaleString("pt-BR")} GCoins</span>
                  </p>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Retorno potencial:</span>
                  <span className="font-bold text-blue-700">{potentialReturn > 0 ? potentialReturn.toLocaleString("pt-BR") : "0"} GCoins</span>
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
