"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, MapPin, Calendar, Users, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Select } from "@/components/ui/select";

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTournaments.map((tournament) => (
              <Link key={tournament.id} href={`/tournaments/${tournament.id}`}>
                <Card hover className="h-full">
                  {/* Sport color bar */}
                  <div className={`h-1 -mt-6 -mx-6 mb-4 rounded-t-xl ${tournament.sportColor}`} />

                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={statusMap[tournament.status]?.variant}>
                      {statusMap[tournament.status]?.label}
                    </Badge>
                    <Badge>{tournament.level}</Badge>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">
                    {tournament.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">{tournament.sport}</p>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {tournament.city}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {tournament.startDate}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      {tournament.participants}/{tournament.maxParticipants} participantes
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500">Inscricao</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {tournament.entryFee > 0 ? `${tournament.entryFee} GCoins` : "Gratis"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Premiacao</p>
                      <p className="text-sm font-semibold text-amber-600 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" />
                        {tournament.prizePool.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Tabs>
    </div>
  );
}
