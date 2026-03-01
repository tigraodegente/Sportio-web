"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, MapPin, Calendar, Users, Coins, Trophy, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Select } from "@/components/ui/select";

const sportEmojiMap: Record<string, string> = {
  "Beach Tennis": "\u{1F3D6}\uFE0F",
  "CrossFit": "\u{1F3CB}\uFE0F",
  "Futebol": "\u26BD",
  "E-Sports": "\u{1F3AE}",
  "Corrida": "\u{1F3C3}",
  "Volei": "\u{1F3D0}",
};

const sportGradientMap: Record<string, string> = {
  "bg-yellow-500": "from-yellow-400 to-amber-500",
  "bg-red-500": "from-red-400 to-rose-600",
  "bg-green-500": "from-green-400 to-blue-600",
  "bg-purple-500": "from-purple-400 to-violet-600",
  "bg-blue-500": "from-blue-400 to-indigo-600",
};

const mockTournaments = [
  {
    id: "1",
    name: "Copa Beach Tennis Sao Paulo 2025",
    sport: "Beach Tennis",
    sportColor: "bg-yellow-500",
    status: "registration_open",
    city: "Sao Paulo, SP",
    startDate: "15 Mar 2025",
    participants: 24,
    maxParticipants: 32,
    entryFee: 50,
    prizePool: 5000,
    format: "single_elimination",
    level: "B",
    image: null,
  },
  {
    id: "2",
    name: "Liga CrossFit Brasil - Etapa 1",
    sport: "CrossFit",
    sportColor: "bg-red-500",
    status: "in_progress",
    city: "Rio de Janeiro, RJ",
    startDate: "10 Mar 2025",
    participants: 64,
    maxParticipants: 64,
    entryFee: 100,
    prizePool: 15000,
    format: "round_robin",
    level: "A",
    image: null,
  },
  {
    id: "3",
    name: "Torneio Society Amador",
    sport: "Futebol",
    sportColor: "bg-green-500",
    status: "registration_open",
    city: "Belo Horizonte, MG",
    startDate: "22 Mar 2025",
    participants: 8,
    maxParticipants: 16,
    entryFee: 0,
    prizePool: 1000,
    format: "single_elimination",
    level: "C",
    image: null,
  },
  {
    id: "4",
    name: "Copa E-Sports Valorant",
    sport: "E-Sports",
    sportColor: "bg-purple-500",
    status: "registration_open",
    city: "Online",
    startDate: "1 Abr 2025",
    participants: 48,
    maxParticipants: 64,
    entryFee: 25,
    prizePool: 8000,
    format: "double_elimination",
    level: "B",
    image: null,
  },
  {
    id: "5",
    name: "Corrida 10K Sportio",
    sport: "Corrida",
    sportColor: "bg-blue-500",
    status: "completed",
    city: "Curitiba, PR",
    startDate: "5 Mar 2025",
    participants: 200,
    maxParticipants: 200,
    entryFee: 30,
    prizePool: 3000,
    format: "league",
    level: "C",
    image: null,
  },
];

const statusMap: Record<string, { label: string; variant: "primary" | "info" | "success" | "danger" }> = {
  registration_open: { label: "Inscricoes Abertas", variant: "primary" },
  in_progress: { label: "Em Andamento", variant: "info" },
  completed: { label: "Finalizado", variant: "success" },
};

const sportOptions = [
  { value: "", label: "Todos os esportes" },
  { value: "futebol", label: "Futebol" },
  { value: "beach-tennis", label: "Beach Tennis" },
  { value: "crossfit", label: "CrossFit" },
  { value: "corrida", label: "Corrida" },
  { value: "esports", label: "E-Sports" },
  { value: "volei", label: "Volei" },
];

export default function TournamentsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Torneios</h1>
          <p className="text-slate-500">Encontre e participe de torneios esportivos</p>
        </div>
        <Link href="/tournaments/create">
          <Button>
            <Plus className="w-4 h-4" />
            Criar Torneio
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Buscar torneios..."
            icon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select options={sportOptions} placeholder="Esporte" className="sm:w-48" />
        <Select
          options={[
            { value: "", label: "Status" },
            { value: "registration_open", label: "Inscricoes abertas" },
            { value: "in_progress", label: "Em andamento" },
            { value: "completed", label: "Finalizado" },
          ]}
          placeholder="Status"
          className="sm:w-48"
        />
      </div>

      <Tabs
        tabs={[
          { id: "all", label: "Todos" },
          { id: "my", label: "Meus Torneios" },
          { id: "enrolled", label: "Inscritos" },
        ]}
      >
        {() => (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTournaments.map((tournament) => {
              const fillPercent = Math.round((tournament.participants / tournament.maxParticipants) * 100);
              const sportEmoji = sportEmojiMap[tournament.sport] || "\u{1F3C6}";
              const gradient = sportGradientMap[tournament.sportColor] || "from-blue-400 to-blue-600";

              return (
                <Link key={tournament.id} href={`/tournaments/${tournament.id}`}>
                  <Card hover className="h-full overflow-hidden group">
                    {/* Sport color bar - thicker with gradient */}
                    <div className={`h-1.5 -mt-5 sm:-mt-6 -mx-5 sm:-mx-6 mb-4 rounded-t-2xl bg-gradient-to-r ${gradient}`} />

                    <div className="flex items-start justify-between mb-3">
                      <Badge variant={statusMap[tournament.status]?.variant}>
                        {statusMap[tournament.status]?.label}
                      </Badge>
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-xs font-bold text-slate-600 ring-1 ring-slate-200/50">
                        {tournament.level}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-slate-900 mb-1.5 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
                      {tournament.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 flex items-center gap-1.5">
                      <span className="text-base leading-none">{sportEmoji}</span>
                      <span className="font-medium">{tournament.sport}</span>
                    </p>

                    <div className="space-y-2.5 text-sm text-slate-600">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <span>{tournament.city}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <span>{tournament.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span>{tournament.participants}/{tournament.maxParticipants} participantes</span>
                            <span className="text-xs text-slate-400 font-medium">{fillPercent}%</span>
                          </div>
                          {/* Participant progress bar */}
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                fillPercent === 100
                                  ? "bg-gradient-to-r from-red-400 to-red-500"
                                  : fillPercent >= 75
                                    ? "bg-gradient-to-r from-amber-400 to-amber-500"
                                    : "bg-gradient-to-r from-blue-400 to-blue-500"
                              }`}
                              style={{ width: `${fillPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          tournament.entryFee > 0
                            ? "bg-slate-100"
                            : "bg-blue-50"
                        }`}>
                          <Ticket className={`w-4 h-4 ${
                            tournament.entryFee > 0
                              ? "text-slate-500"
                              : "text-blue-600"
                          }`} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Inscricao</p>
                          {tournament.entryFee > 0 ? (
                            <p className="text-sm font-semibold text-slate-900">
                              {tournament.entryFee} GCoins
                            </p>
                          ) : (
                            <span className="inline-block px-2 py-0.5 text-xs font-bold text-blue-700 bg-blue-50 rounded-full ring-1 ring-blue-200/50">
                              Gratis
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Premiacao</p>
                          <p className="text-sm font-bold text-amber-600">
                            {tournament.prizePool.toLocaleString()}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                          <Trophy className="w-4 h-4 text-amber-500" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </Tabs>
    </div>
  );
}
