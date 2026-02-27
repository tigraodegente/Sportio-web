"use client";

import { useState } from "react";
import { Target, TrendingUp, Trophy, Clock, CheckCircle2, XCircle, Swords, Flame, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/ui/stats-card";
import { Tabs } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";

const sportColors: Record<string, { bg: string; text: string; gradient: string; border: string }> = {
  "Beach Tennis": { bg: "bg-orange-100", text: "text-orange-700", gradient: "from-orange-400 to-orange-600", border: "border-l-orange-500" },
  "CrossFit": { bg: "bg-purple-100", text: "text-purple-700", gradient: "from-purple-400 to-purple-600", border: "border-l-purple-500" },
  "Futebol": { bg: "bg-emerald-100", text: "text-emerald-700", gradient: "from-emerald-400 to-emerald-600", border: "border-l-emerald-500" },
  "Volei": { bg: "bg-blue-100", text: "text-blue-700", gradient: "from-blue-400 to-blue-600", border: "border-l-blue-500" },
  "Futevolei": { bg: "bg-cyan-100", text: "text-cyan-700", gradient: "from-cyan-400 to-cyan-600", border: "border-l-cyan-500" },
};

const defaultSportColor = { bg: "bg-slate-100", text: "text-slate-700", gradient: "from-slate-400 to-slate-600", border: "border-l-slate-500" };

const liveMatches = [
  { id: "1", tournament: "Copa Beach Tennis SP", player1: "Lucas Mendes", player2: "Rafael Costa", score: "4-3", sport: "Beach Tennis", odds1: 1.65, odds2: 2.20, betsCount: 48, oddsChange1: "up" as const, oddsChange2: "down" as const },
  { id: "2", tournament: "Liga CrossFit Brasil", player1: "Team Alpha", player2: "Team Beta", score: "Set 2", sport: "CrossFit", odds1: 1.90, odds2: 1.85, betsCount: 127, oddsChange1: "down" as const, oddsChange2: "up" as const },
  { id: "3", tournament: "Torneio Futebol Society", player1: "FC Santos", player2: "Palmeiras FC", score: "2-1", sport: "Futebol", odds1: 2.10, odds2: 1.70, betsCount: 256, oddsChange1: "up" as const, oddsChange2: "down" as const },
];

const myBets = [
  { id: "1", match: "Lucas M. vs Rafael C.", tournament: "Copa Beach Tennis SP", amount: 50, odds: 1.65, potentialWin: 82.5, prediction: "Lucas Mendes", result: "pending", date: "Hoje" },
  { id: "2", match: "Player A vs Player B", tournament: "Torneio Volei", amount: 100, odds: 2.50, potentialWin: 250, prediction: "Player A", result: "won", date: "Ontem" },
  { id: "3", match: "Team X vs Team Y", tournament: "Liga Futevolei", amount: 30, odds: 1.50, potentialWin: 45, prediction: "Team Y", result: "lost", date: "2 dias atras" },
  { id: "4", match: "Andre S. vs Pedro L.", tournament: "Copa Beach Tennis SP", amount: 75, odds: 1.80, potentialWin: 135, prediction: "Andre Santos", result: "won", date: "3 dias atras" },
];

const resultIcons = {
  pending: <Clock className="w-4 h-4 text-blue-500" />,
  won: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  lost: <XCircle className="w-4 h-4 text-red-500" />,
};

const HOT_THRESHOLD = 100;

export default function BetsPage() {
  const [showBetModal, setShowBetModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<(typeof liveMatches)[0] | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<1 | 2 | null>(null);

  const openBetModal = (match: (typeof liveMatches)[0]) => {
    setSelectedMatch(match);
    setSelectedPlayer(null);
    setShowBetModal(true);
  };

  const getSportColor = (sport: string) => sportColors[sport] || defaultSportColor;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Palpites</h1>
        <p className="text-sm sm:text-base text-slate-500 mt-1">Faca palpites nas partidas e ganhe GCoins</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard title="Taxa de Acerto" value="67%" changeType="positive" change="+5% este mes" icon={<Target className="w-5 h-5" />} />
        <StatsCard title="Lucro Total" value="1.280" changeType="positive" change="GCoins ganhos" icon={<TrendingUp className="w-5 h-5" />} />
        <StatsCard title="Total de Palpites" value="48" changeType="neutral" change="32 ganhos, 16 perdidos" icon={<Swords className="w-5 h-5" />} />
        <StatsCard title="Ranking" value="#23" changeType="positive" change="Entre os melhores" icon={<Trophy className="w-5 h-5" />} />
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
        <div className="space-y-3">
          {liveMatches.map((match) => {
            const sportColor = getSportColor(match.sport);
            const isHot = match.betsCount >= HOT_THRESHOLD;

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
                      {match.sport}
                    </span>
                    <span className="text-xs text-slate-400 truncate">{match.tournament}</span>
                  </div>

                  {/* Match display */}
                  <div className="flex items-center gap-3">
                    {/* Player 1 */}
                    <div className="flex-1 text-right">
                      <p className="text-sm font-semibold text-slate-900 truncate">{match.player1}</p>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <span className="inline-flex items-center px-2 py-0.5 bg-emerald-50 border border-emerald-200/50 rounded-md text-xs font-bold text-emerald-700">
                          {match.odds1}x
                        </span>
                        {match.oddsChange1 === "up" ? (
                          <ArrowUpRight className="w-3 h-3 text-green-500" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 text-red-400" />
                        )}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="px-4 py-2 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 shrink-0">
                      {match.score}
                    </div>

                    {/* Player 2 */}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">{match.player2}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="inline-flex items-center px-2 py-0.5 bg-emerald-50 border border-emerald-200/50 rounded-md text-xs font-bold text-emerald-700">
                          {match.odds2}x
                        </span>
                        {match.oddsChange2 === "up" ? (
                          <ArrowUpRight className="w-3 h-3 text-green-500" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 text-red-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bets count */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <Zap className="w-3 h-3 text-slate-400" />
                    <p className="text-xs text-slate-400 font-medium">{match.betsCount} palpites</p>
                  </div>
                </div>

                <Button size="sm" onClick={() => openBetModal(match)} className="shrink-0 self-end sm:self-center">
                  Palpitar
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* My Bets */}
      <Card>
        <CardTitle className="mb-4">Meus Palpites</CardTitle>
        <Tabs
          tabs={[
            { id: "all", label: "Todos" },
            { id: "pending", label: "Pendentes" },
            { id: "won", label: "Ganhos" },
            { id: "lost", label: "Perdidos" },
          ]}
        >
          {(tab) => (
            <div className="space-y-2">
              {myBets
                .filter((b) => tab === "all" || b.result === tab)
                .map((bet) => (
                  <div
                    key={bet.id}
                    className={`flex items-center justify-between py-3 px-3 sm:px-4 rounded-xl transition-all duration-200 ${
                      bet.result === "won"
                        ? "bg-green-50/60 border border-green-100 shadow-[inset_0_0_20px_rgba(34,197,94,0.05)]"
                        : bet.result === "lost"
                          ? "bg-red-50/40 border border-red-100/60"
                          : "bg-blue-50/30 border border-blue-100/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        bet.result === "won"
                          ? "bg-green-100 shadow-sm shadow-green-200"
                          : bet.result === "lost"
                            ? "bg-red-100"
                            : "bg-blue-100"
                      }`}>
                        {resultIcons[bet.result as keyof typeof resultIcons]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{bet.match}</p>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                          <span className="text-xs text-slate-500 truncate">
                            Palpite: <span className="font-medium text-slate-700">{bet.prediction}</span>
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0 bg-slate-100 rounded text-[11px] font-semibold text-slate-600">
                            {bet.odds}x
                          </span>
                          <span className="text-[11px] text-slate-400">{bet.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-sm font-bold text-slate-900">{bet.amount} GC</p>
                      <p className={`text-xs font-semibold ${bet.result === "won" ? "text-green-600" : bet.result === "lost" ? "text-red-500" : "text-blue-600"}`}>
                        {bet.result === "won" ? `+${bet.potentialWin} GC` : bet.result === "lost" ? "Perdeu" : `Potencial: +${bet.potentialWin}`}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Tabs>
      </Card>

      {/* Bet Modal */}
      <Modal isOpen={showBetModal} onClose={() => setShowBetModal(false)} title="Fazer Palpite">
        {selectedMatch && (
          <div className="space-y-5">
            {/* Tournament info */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${getSportColor(selectedMatch.sport).bg} ${getSportColor(selectedMatch.sport).text}`}>
                {selectedMatch.sport}
              </span>
              <span className="text-sm text-slate-500">{selectedMatch.tournament}</span>
            </div>

            {/* Live score */}
            <div className="flex items-center justify-center">
              <div className="px-5 py-2 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl text-lg font-bold shadow-lg shadow-slate-900/20">
                {selectedMatch.score}
              </div>
            </div>

            {/* Player selection */}
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Selecione seu palpite</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedPlayer(1)}
                className={`relative p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                  selectedPlayer === 1
                    ? "border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20"
                    : "border-slate-200 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-500/5"
                }`}
              >
                {selectedPlayer === 1 && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <p className={`font-semibold truncate ${selectedPlayer === 1 ? "text-emerald-800" : "text-slate-900"}`}>
                  {selectedMatch.player1}
                </p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <p className="text-lg font-bold text-emerald-600">{selectedMatch.odds1}x</p>
                  {selectedMatch.oddsChange1 === "up" ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
                  )}
                </div>
              </button>
              <button
                onClick={() => setSelectedPlayer(2)}
                className={`relative p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                  selectedPlayer === 2
                    ? "border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20"
                    : "border-slate-200 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-500/5"
                }`}
              >
                {selectedPlayer === 2 && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <p className={`font-semibold truncate ${selectedPlayer === 2 ? "text-emerald-800" : "text-slate-900"}`}>
                  {selectedMatch.player2}
                </p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <p className="text-lg font-bold text-emerald-600">{selectedMatch.odds2}x</p>
                  {selectedMatch.oddsChange2 === "up" ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
                  )}
                </div>
              </button>
            </div>

            <Input label="Quantidade (GCoins)" type="number" placeholder="0" min={1} />

            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-200/50">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Retorno potencial:</span>
                <span className="font-bold text-emerald-700">0 GCoins</span>
              </div>
            </div>

            <Button size="lg" className="w-full" disabled={!selectedPlayer}>
              <Target className="w-5 h-5" />
              Confirmar Palpite
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
