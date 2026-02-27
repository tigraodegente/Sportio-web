"use client";

import { useState } from "react";
import { Trophy, MapPin, Calendar, Users, Coins, Clock, Share2, Flag, Swords, ChevronRight } from "lucide-react";
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
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-6 lg:p-8 text-white">
        <div className="flex items-start justify-between mb-4">
          <Badge className="bg-white/20 text-white border-0">Inscricoes Abertas</Badge>
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold mb-2">{tournament.name}</h1>
        <p className="text-emerald-100 mb-6">{tournament.description}</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-300" />
            <span className="text-sm">{tournament.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-300" />
            <span className="text-sm">{tournament.startDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-300" />
            <span className="text-sm">{tournament.participants}/{tournament.maxParticipants}</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
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
                      <div>
                        <p className="text-sm text-slate-500">Formato</p>
                        <p className="font-medium">{tournament.format}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Nivel</p>
                        <p className="font-medium">Categoria {tournament.level}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Inicio</p>
                        <p className="font-medium">{tournament.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Termino</p>
                        <p className="font-medium">{tournament.endDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Inscricao</p>
                        <p className="font-medium">{tournament.entryFee} GCoins</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Limite de inscricao</p>
                        <p className="font-medium">{tournament.registrationDeadline}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Endereco</p>
                      <p className="font-medium">{tournament.address}</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <Card>
                    <CardTitle>Premiacao</CardTitle>
                    <CardContent className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🥇</span>
                          <span className="text-sm">1o Lugar</span>
                        </div>
                        <span className="font-bold text-amber-600">2.500 GCoins</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🥈</span>
                          <span className="text-sm">2o Lugar</span>
                        </div>
                        <span className="font-bold text-slate-500">1.500 GCoins</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🥉</span>
                          <span className="text-sm">3o Lugar</span>
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
                  {participants.map((p, i) => (
                    <div key={p.id} className="flex items-center justify-between py-3 px-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-400 w-6">#{p.seed}</span>
                        <Avatar name={p.name} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{p.name}</p>
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
                <CardTitle className="mb-4">Chave do Torneio</CardTitle>
                <div className="space-y-6">
                  {[1, 2].map((round) => (
                    <div key={round}>
                      <h4 className="text-sm font-medium text-slate-500 mb-3">
                        {round === 1 ? "Quartas de Final" : "Semifinal"}
                      </h4>
                      <div className="space-y-2">
                        {bracketMatches
                          .filter((m) => m.round === round)
                          .map((match, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100"
                            >
                              <div className="flex-1">
                                <p className={`text-sm ${match.winner === match.player1 ? "font-bold text-emerald-700" : "text-slate-700"}`}>
                                  {match.player1}
                                </p>
                                <p className={`text-sm ${match.winner === match.player2 ? "font-bold text-emerald-700" : "text-slate-700"}`}>
                                  {match.player2}
                                </p>
                              </div>
                              {match.score ? (
                                <span className="text-sm font-mono text-slate-600">{match.score}</span>
                              ) : (
                                <Badge variant="info">Agendado</Badge>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {tab === "rules" && (
              <Card>
                <CardTitle className="mb-4">Regras do Torneio</CardTitle>
                <div className="prose prose-sm max-w-none">
                  {tournament.rules.split("\n").map((rule, i) => (
                    <p key={i} className="text-slate-700 flex items-start gap-2">
                      <span className="text-emerald-600 mt-0.5">
                        <Flag className="w-4 h-4" />
                      </span>
                      {rule}
                    </p>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}
