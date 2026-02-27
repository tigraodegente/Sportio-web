"use client";

import { Trophy, MapPin, Calendar, Users, Coins, Share2, Flag, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";

const tournament = {
  id: "1",
  name: "Copa Beach Tennis Sao Paulo 2025",
  description: "O maior torneio de Beach Tennis de Sao Paulo! Venha competir com os melhores atletas da regiao em 3 dias de muita acao e diversao. Premiacao total de 5.000 GCoins para os primeiros colocados.",
  sport: "Beach Tennis",
  status: "registration_open",
  format: "Eliminacao Simples",
  level: "B",
  city: "Sao Paulo, SP",
  address: "Arena Beach Tennis - Av. Paulista, 1000",
  startDate: "15 Mar 2025",
  endDate: "17 Mar 2025",
  registrationDeadline: "13 Mar 2025",
  participants: 24,
  maxParticipants: 32,
  entryFee: 50,
  prizePool: 5000,
  organizer: { name: "Carlos Silva", image: null },
  rules: "1. Duplas masculinas e femininas\n2. Cada set vai ate 6 games\n3. Tie-break no set decisivo\n4. Tempo maximo de 1h por partida\n5. Uso obrigatorio de uniforme adequado",
};

const participants = [
  { id: "1", name: "Lucas Mendes", level: "A", rating: 1850, seed: 1 },
  { id: "2", name: "Rafael Costa", level: "A", rating: 1780, seed: 2 },
  { id: "3", name: "Andre Santos", level: "B", rating: 1650, seed: 3 },
  { id: "4", name: "Pedro Lima", level: "B", rating: 1620, seed: 4 },
  { id: "5", name: "Gabriel Oliveira", level: "B", rating: 1580, seed: 5 },
  { id: "6", name: "Thiago Rocha", level: "B", rating: 1550, seed: 6 },
];

const bracketMatches = [
  { round: 1, position: 1, player1: "Lucas Mendes", player2: "Jogador 8", score: "6-3, 6-2", status: "completed", winner: "Lucas Mendes" },
  { round: 1, position: 2, player1: "Andre Santos", player2: "Jogador 6", score: "6-4, 7-5", status: "completed", winner: "Andre Santos" },
  { round: 1, position: 3, player1: "Rafael Costa", player2: "Jogador 7", score: "6-1, 6-0", status: "completed", winner: "Rafael Costa" },
  { round: 1, position: 4, player1: "Pedro Lima", player2: "Jogador 5", score: null, status: "scheduled", winner: null },
  { round: 2, position: 1, player1: "Lucas Mendes", player2: "Andre Santos", score: null, status: "scheduled", winner: null },
];

export default function TournamentDetailPage() {
  const fillPercent = Math.round((tournament.participants / tournament.maxParticipants) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        {/* Decorative blur elements for depth */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-0">Inscricoes Abertas</Badge>
              {/* Sport badge pill */}
              <Badge className="bg-white/15 text-white border-0 backdrop-blur-sm">
                <span className="mr-0.5">{"\u{1F3D6}\uFE0F"}</span> {tournament.sport}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold mb-2">{tournament.name}</h1>
          <p className="text-emerald-100 mb-6 max-w-2xl">{tournament.description}</p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-emerald-200" />
              </div>
              <span className="text-sm">{tournament.city}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-emerald-200" />
              </div>
              <span className="text-sm">{tournament.startDate}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-emerald-200" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm">{tournament.participants}/{tournament.maxParticipants}</span>
                {/* Participant progress bar */}
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
              <span className="text-sm font-semibold">{tournament.prizePool.toLocaleString()} GCoins</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="accent" size="lg">
              <Trophy className="w-5 h-5" />
              Inscrever-se ({tournament.entryFee} GCoins)
            </Button>
            <Button variant="ghost" size="lg" className="text-white border border-white/30 hover:bg-white/10">
              <Swords className="w-5 h-5" />
              Fazer Palpite
            </Button>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs
        tabs={[
          { id: "info", label: "Informacoes" },
          { id: "participants", label: `Participantes (${tournament.participants})` },
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
                        <p className="font-semibold text-slate-900">{tournament.format}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50">
                        <p className="text-xs text-slate-500 mb-0.5">Nivel</p>
                        <p className="font-semibold text-slate-900">Categoria {tournament.level}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50">
                        <p className="text-xs text-slate-500 mb-0.5">Inicio</p>
                        <p className="font-semibold text-slate-900">{tournament.startDate}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50">
                        <p className="text-xs text-slate-500 mb-0.5">Termino</p>
                        <p className="font-semibold text-slate-900">{tournament.endDate}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50">
                        <p className="text-xs text-slate-500 mb-0.5">Inscricao</p>
                        <p className="font-semibold text-slate-900">{tournament.entryFee} GCoins</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50">
                        <p className="text-xs text-slate-500 mb-0.5">Limite de inscricao</p>
                        <p className="font-semibold text-slate-900">{tournament.registrationDeadline}</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50">
                      <p className="text-xs text-slate-500 mb-0.5">Endereco</p>
                      <p className="font-semibold text-slate-900">{tournament.address}</p>
                    </div>
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
                        <span className="font-bold text-amber-600">2.500 GCoins</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{"\u{1F948}"}</span>
                          <span className="text-sm font-medium text-slate-700">2o Lugar</span>
                        </div>
                        <span className="font-bold text-slate-500">1.500 GCoins</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50/50">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{"\u{1F949}"}</span>
                          <span className="text-sm font-medium text-slate-700">3o Lugar</span>
                        </div>
                        <span className="font-bold text-amber-800">1.000 GCoins</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardTitle>Organizador</CardTitle>
                    <CardContent className="mt-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={tournament.organizer.name} size="lg" />
                        <div>
                          <p className="font-medium text-slate-900">{tournament.organizer.name}</p>
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
                <div className="divide-y divide-slate-100">
                  {participants.map((p, index) => (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between py-3.5 px-3 rounded-lg transition-colors hover:bg-emerald-500/5 ${
                        index % 2 === 0 ? "bg-slate-50/50" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-400 w-7 text-center">#{p.seed}</span>
                        <Avatar name={p.name} size="sm" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                          <p className="text-xs text-slate-500">Rating: {p.rating}</p>
                        </div>
                      </div>
                      <Badge variant={p.level === "A" ? "accent" : "default"}>
                        Nivel {p.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {tab === "bracket" && (
              <Card>
                <CardTitle className="mb-6">Chave do Torneio</CardTitle>
                <div className="space-y-8">
                  {[1, 2].map((round) => (
                    <div key={round}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-emerald-600">{round}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-700">
                          {round === 1 ? "Quartas de Final" : "Semifinal"}
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {bracketMatches
                          .filter((m) => m.round === round)
                          .map((match, i) => {
                            const isCompleted = match.status === "completed";
                            const p1IsWinner = match.winner === match.player1;
                            const p2IsWinner = match.winner === match.player2;

                            return (
                              <div
                                key={i}
                                className={`rounded-xl border overflow-hidden transition-all ${
                                  isCompleted
                                    ? "bg-white border-slate-200 shadow-sm"
                                    : "bg-slate-50 border-slate-100"
                                }`}
                              >
                                {/* Player 1 */}
                                <div className={`flex items-center justify-between px-4 py-2.5 ${
                                  p1IsWinner ? "bg-emerald-500/5" : ""
                                }`}>
                                  <div className="flex items-center gap-2.5">
                                    {p1IsWinner && (
                                      <Trophy className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    )}
                                    <span className={`text-sm ${
                                      p1IsWinner
                                        ? "font-bold text-emerald-700"
                                        : isCompleted
                                          ? "text-slate-400"
                                          : "text-slate-700 font-medium"
                                    }`}>
                                      {match.player1}
                                    </span>
                                  </div>
                                  {match.score && (
                                    <span className={`text-xs font-mono ${
                                      p1IsWinner ? "text-emerald-600 font-semibold" : "text-slate-400"
                                    }`}>
                                      {match.score.split(", ")[0]}
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
                                  p2IsWinner ? "bg-emerald-500/5" : ""
                                }`}>
                                  <div className="flex items-center gap-2.5">
                                    {p2IsWinner && (
                                      <Trophy className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    )}
                                    <span className={`text-sm ${
                                      p2IsWinner
                                        ? "font-bold text-emerald-700"
                                        : isCompleted
                                          ? "text-slate-400"
                                          : "text-slate-700 font-medium"
                                    }`}>
                                      {match.player2}
                                    </span>
                                  </div>
                                  {match.score && (
                                    <span className={`text-xs font-mono ${
                                      p2IsWinner ? "text-emerald-600 font-semibold" : "text-slate-400"
                                    }`}>
                                      {match.score.split(", ")[1]}
                                    </span>
                                  )}
                                </div>

                                {/* Status footer for scheduled matches */}
                                {!isCompleted && (
                                  <div className="px-4 py-1.5 bg-slate-100/50 border-t border-slate-100">
                                    <Badge variant="info" className="text-[10px]">Agendado</Badge>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {tab === "rules" && (
              <Card>
                <CardTitle className="mb-6">Regras do Torneio</CardTitle>
                <div className="space-y-3">
                  {tournament.rules.split("\n").map((rule, i) => {
                    const ruleNumber = rule.match(/^(\d+)\./)?.[1];
                    const ruleText = rule.replace(/^\d+\.\s*/, "");

                    return (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-sm font-bold text-emerald-600">{ruleNumber || i + 1}</span>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed pt-1.5">{ruleText}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}
