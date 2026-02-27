"use client";

import { useState } from "react";
import { Trophy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

const sportOptions = [
  { value: "futebol", label: "Futebol" },
  { value: "beach-tennis", label: "Beach Tennis" },
  { value: "crossfit", label: "CrossFit" },
  { value: "corrida", label: "Corrida" },
  { value: "volei", label: "Volei" },
  { value: "futevolei", label: "Futevolei" },
  { value: "esports", label: "E-Sports" },
  { value: "basquete", label: "Basquete" },
  { value: "natacao", label: "Natacao" },
  { value: "tenis", label: "Tenis" },
  { value: "skate", label: "Skate" },
  { value: "lutas", label: "Lutas" },
  { value: "ciclismo", label: "Ciclismo" },
];

export default function CreateTournamentPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Call tRPC mutation
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/tournaments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Criar Torneio</h1>
          <p className="text-slate-500">Configure os detalhes do seu torneio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardTitle>Informacoes Basicas</CardTitle>
          <CardContent className="mt-4 space-y-4">
            <Input label="Nome do Torneio" placeholder="Ex: Copa Beach Tennis SP 2025" required />
            <Textarea label="Descricao" placeholder="Descreva seu torneio..." rows={4} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Esporte" options={sportOptions} placeholder="Selecione" required />
              <Select
                label="Formato"
                options={[
                  { value: "single_elimination", label: "Eliminacao Simples" },
                  { value: "double_elimination", label: "Eliminacao Dupla" },
                  { value: "round_robin", label: "Todos contra Todos" },
                  { value: "swiss", label: "Suico" },
                  { value: "league", label: "Liga" },
                ]}
                placeholder="Selecione"
                required
              />
            </div>
            <Select
              label="Nivel"
              options={[
                { value: "A", label: "A - Profissional" },
                { value: "B", label: "B - Intermediario" },
                { value: "C", label: "C - Amador" },
              ]}
              placeholder="Selecione"
            />
          </CardContent>
        </Card>

        {/* Participants & Prize */}
        <Card>
          <CardTitle>Participantes e Premiacao</CardTitle>
          <CardContent className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Minimo de Participantes" type="number" min={2} defaultValue={4} />
              <Input label="Maximo de Participantes" type="number" min={2} max={256} defaultValue={32} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Taxa de Inscricao (GCoins)" type="number" min={0} defaultValue={0} />
              <Input label="Premiacao Total (GCoins)" type="number" min={0} defaultValue={0} />
            </div>
          </CardContent>
        </Card>

        {/* Location & Dates */}
        <Card>
          <CardTitle>Local e Datas</CardTitle>
          <CardContent className="mt-4 space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-300 text-emerald-600" />
                <span className="text-sm text-slate-700">Torneio Online</span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Cidade" placeholder="Ex: Sao Paulo" />
              <Input label="Estado" placeholder="Ex: SP" />
            </div>
            <Input label="Endereco" placeholder="Endereco do local" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Data Inicio" type="date" />
              <Input label="Data Fim" type="date" />
              <Input label="Prazo Inscricao" type="date" />
            </div>
          </CardContent>
        </Card>

        {/* Rules */}
        <Card>
          <CardTitle>Regras</CardTitle>
          <CardContent className="mt-4">
            <Textarea
              label="Regras do Torneio"
              placeholder="Descreva as regras do torneio..."
              rows={6}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3 justify-end">
          <Link href="/tournaments">
            <Button variant="ghost" size="lg">Cancelar</Button>
          </Link>
          <Button type="submit" size="lg" loading={loading}>
            <Trophy className="w-5 h-5" />
            Criar Torneio
          </Button>
        </div>
      </form>
    </div>
  );
}
