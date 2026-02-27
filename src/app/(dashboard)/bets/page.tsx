"use client";

import { useState } from "react";
import { Target, TrendingUp, Trophy, Clock, CheckCircle2, XCircle, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/ui/stats-card";
import { Tabs } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";

const liveMatches = [
  { id: "1", tournament: "Copa Beach Tennis SP", player1: "Lucas Mendes", player2: "Rafael Costa", score: "4-3", sport: "Beach Tennis", odds1: 1.65, odds2: 2.20, betsCount: 48 },
  { id: "2", tournament: "Liga CrossFit Brasil", player1: "Team Alpha", player2: "Team Beta", score: "Set 2", sport: "CrossFit", odds1: 1.90, odds2: 1.85, betsCount: 127 },
  { id: "3", tournament: "Torneio Futebol Society", player1: "FC Santos", player2: "Palmeiras FC", score: "2-1", sport: "Futebol", odds1: 2.10, odds2: 1.70, betsCount: 256 },
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

export default function BetsPage() {
  const [showBetModal, setShowBetModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<(typeof liveMatches)[0] | null>(null);

  const openBetModal = (match: (typeof liveMatches)[0]) => {
    setSelectedMatch(match);
    setShowBetModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Palpites</h1>
        <p className="text-slate-500">Faca palpites nas partidas e ganhe GCoins</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Taxa de Acerto" value="67%" changeType="positive" change="+5% este mes" icon={<Target className="w-5 h-5" />} />
        <StatsCard title="Lucro Total" value="1.280" changeType="positive" change="GCoins ganhos" icon={<TrendingUp className="w-5 h-5" />} />
        <StatsCard title="Total de Palpites" value="48" changeType="neutral" change="32 ganhos, 16 perdidos" icon={<Swords className="w-5 h-5" />} />
        <StatsCard title="Ranking" value="#23" changeType="positive" change="Entre os melhores" icon={<Trophy className="w-5 h-5" />} />
      </div>

      {/* Live Matches */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <CardTitle>Partidas ao Vivo</CardTitle>
          <Badge variant="live">AO VIVO</Badge>
        </div>
        <div className="space-y-3">
          {liveMatches.map((match) => (
            <div key={match.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-1">{match.tournament} &middot; {match.sport}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 text-right">
                    <p className="text-sm font-medium text-slate-900">{match.player1}</p>
                    <p className="text-xs text-emerald-600 font-semibold">{match.odds1}x</p>
                  </div>
                  <div className="px-3 py-1 bg-slate-900 text-white rounded-lg text-sm font-bold">
                    {match.score}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{match.player2}</p>
                    <p className="text-xs text-emerald-600 font-semibold">{match.odds2}x</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1">{match.betsCount} palpites</p>
              </div>
              <Button size="sm" onClick={() => openBetModal(match)}>
                Palpitar
              </Button>
            </div>
          ))}
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
            <div className="divide-y divide-slate-100">
              {myBets
                .filter((b) => tab === "all" || b.result === tab)
                .map((bet) => (
                  <div key={bet.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      {resultIcons[bet.result as keyof typeof resultIcons]}
                      <div>
                        <p className="text-sm font-medium text-slate-900">{bet.match}</p>
                        <p className="text-xs text-slate-500">
                          Palpite: {bet.prediction} &middot; Odds {bet.odds}x &middot; {bet.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{bet.amount} GC</p>
                      <p className={`text-xs ${bet.result === "won" ? "text-green-600" : bet.result === "lost" ? "text-red-600" : "text-blue-600"}`}>
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
          <div className="space-y-4">
            <p className="text-sm text-slate-500">{selectedMatch.tournament}</p>

            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-600 text-center transition-all">
                <p className="font-semibold text-slate-900">{selectedMatch.player1}</p>
                <p className="text-lg font-bold text-emerald-600">{selectedMatch.odds1}x</p>
              </button>
              <button className="p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-600 text-center transition-all">
                <p className="font-semibold text-slate-900">{selectedMatch.player2}</p>
                <p className="text-lg font-bold text-emerald-600">{selectedMatch.odds2}x</p>
              </button>
            </div>

            <Input label="Quantidade (GCoins)" type="number" placeholder="0" min={1} />

            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Retorno potencial:</span>
                <span className="font-bold text-emerald-600">0 GCoins</span>
              </div>
            </div>

            <Button size="lg" className="w-full">
              <Target className="w-5 h-5" />
              Confirmar Palpite
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
