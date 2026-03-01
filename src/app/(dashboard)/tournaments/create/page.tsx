"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, ArrowLeft, Info, Users, MapPin, ScrollText, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { trpc } from "@/lib/trpc";

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

const formatOptions = [
  { value: "single_elimination", label: "Eliminacao Simples" },
  { value: "double_elimination", label: "Eliminacao Dupla" },
  { value: "round_robin", label: "Todos contra Todos" },
  { value: "swiss", label: "Suico" },
  { value: "league", label: "Liga" },
];

const levelOptions = [
  { value: "A", label: "A - Profissional" },
  { value: "B", label: "B - Intermediario" },
  { value: "C", label: "C - Amador" },
];

const steps = [
  { id: 1, label: "Basico", icon: Info },
  { id: 2, label: "Participantes", icon: Users },
  { id: 3, label: "Local", icon: MapPin },
  { id: 4, label: "Regras", icon: ScrollText },
];

interface FormData {
  name: string;
  description: string;
  sportId: string;
  format: string;
  level: string;
  minParticipants: number;
  maxParticipants: number;
  entryFee: number;
  prizePool: number;
  isOnline: boolean;
  city: string;
  state: string;
  address: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  rules: string;
}

export default function CreateTournamentPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    sportId: "",
    format: "single_elimination",
    level: "",
    minParticipants: 4,
    maxParticipants: 32,
    entryFee: 0,
    prizePool: 0,
    isOnline: false,
    city: "",
    state: "",
    address: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    rules: "",
  });

  const createMutation = trpc.tournament.create.useMutation({
    onSuccess: (data) => {
      router.push(`/tournaments/${data?.id ?? ""}`);
    },
    onError: (err) => {
      setError(err.message || "Erro ao criar torneio. Tente novamente.");
    },
  });

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name || form.name.length < 3) {
      setError("O nome do torneio deve ter pelo menos 3 caracteres.");
      return;
    }
    if (!form.sportId) {
      setError("Selecione um esporte.");
      return;
    }

    createMutation.mutate({
      name: form.name,
      description: form.description || undefined,
      rules: form.rules || undefined,
      sportId: form.sportId,
      format: form.format as "single_elimination" | "double_elimination" | "round_robin" | "swiss" | "league",
      maxParticipants: form.maxParticipants,
      minParticipants: form.minParticipants,
      entryFee: form.entryFee,
      entryFeeType: "gamification",
      prizePool: form.prizePool,
      city: form.city || undefined,
      state: form.state || undefined,
      address: form.address || undefined,
      isOnline: form.isOnline,
      level: form.level ? (form.level as "A" | "B" | "C") : undefined,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      registrationDeadline: form.registrationDeadline || undefined,
    });
  };

  const selectedSportLabel = sportOptions.find((s) => s.value === form.sportId)?.label ?? "--";
  const selectedFormatLabel = formatOptions.find((f) => f.value === form.format)?.label ?? "--";

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

      {/* Step Indicator */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = activeStep === step.id;
            const isCompleted = activeStep > step.id;

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : isCompleted
                        ? "bg-blue-50 text-blue-600 ring-2 ring-blue-200"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                  }`}>
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs font-semibold transition-colors hidden sm:block ${
                    isActive
                      ? "text-blue-600"
                      : isCompleted
                        ? "text-blue-500"
                        : "text-slate-400"
                  }`}>
                    {step.label}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-2 sm:mx-3">
                    <div className="h-0.5 rounded-full bg-slate-100 relative overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 bg-blue-400 rounded-full transition-all duration-500 ${
                          isCompleted ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className={`relative overflow-hidden transition-all duration-300 ${
          activeStep === 1 ? "ring-1 ring-blue-200 shadow-md" : ""
        }`}>
          <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${
            activeStep >= 1 ? "bg-blue-500" : "bg-slate-200"
          }`} />
          <div className="pl-3">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <Info className="w-4.5 h-4.5 text-blue-600" />
              </div>
              <CardTitle>Informacoes Basicas</CardTitle>
            </div>
            <CardContent className="mt-4 space-y-4">
              <Input
                label="Nome do Torneio"
                placeholder="Ex: Copa Beach Tennis SP 2025"
                required
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
              <Textarea
                label="Descricao"
                placeholder="Descreva seu torneio..."
                rows={4}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Esporte"
                  options={sportOptions}
                  placeholder="Selecione"
                  required
                  value={form.sportId}
                  onChange={(e) => updateField("sportId", e.target.value)}
                />
                <Select
                  label="Formato"
                  options={formatOptions}
                  placeholder="Selecione"
                  required
                  value={form.format}
                  onChange={(e) => updateField("format", e.target.value)}
                />
              </div>
              <Select
                label="Nivel"
                options={levelOptions}
                placeholder="Selecione"
                value={form.level}
                onChange={(e) => updateField("level", e.target.value)}
              />
            </CardContent>
          </div>
        </Card>

        {/* Participants & Prize */}
        <Card className={`relative overflow-hidden transition-all duration-300 ${
          activeStep === 2 ? "ring-1 ring-blue-200 shadow-md" : ""
        }`}>
          <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${
            activeStep >= 2 ? "bg-blue-500" : "bg-slate-200"
          }`} />
          <div className="pl-3">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <Users className="w-4.5 h-4.5 text-blue-600" />
              </div>
              <CardTitle>Participantes e Premiacao</CardTitle>
            </div>
            <CardContent className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Minimo de Participantes"
                  type="number"
                  min={2}
                  value={form.minParticipants}
                  onChange={(e) => updateField("minParticipants", Number(e.target.value))}
                />
                <Input
                  label="Maximo de Participantes"
                  type="number"
                  min={2}
                  max={256}
                  value={form.maxParticipants}
                  onChange={(e) => updateField("maxParticipants", Number(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Taxa de Inscricao (GCoins)"
                  type="number"
                  min={0}
                  value={form.entryFee}
                  onChange={(e) => updateField("entryFee", Number(e.target.value))}
                />
                <Input
                  label="Premiacao Total (GCoins)"
                  type="number"
                  min={0}
                  value={form.prizePool}
                  onChange={(e) => updateField("prizePool", Number(e.target.value))}
                />
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Location & Dates */}
        <Card className={`relative overflow-hidden transition-all duration-300 ${
          activeStep === 3 ? "ring-1 ring-blue-200 shadow-md" : ""
        }`}>
          <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${
            activeStep >= 3 ? "bg-blue-500" : "bg-slate-200"
          }`} />
          <div className="pl-3">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <MapPin className="w-4.5 h-4.5 text-blue-600" />
              </div>
              <CardTitle>Local e Datas</CardTitle>
            </div>
            <CardContent className="mt-4 space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-blue-600"
                    checked={form.isOnline}
                    onChange={(e) => updateField("isOnline", e.target.checked)}
                  />
                  <span className="text-sm text-slate-700">Torneio Online</span>
                </label>
              </div>
              {!form.isOnline && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Cidade"
                      placeholder="Ex: Sao Paulo"
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                    />
                    <Input
                      label="Estado"
                      placeholder="Ex: SP"
                      value={form.state}
                      onChange={(e) => updateField("state", e.target.value)}
                    />
                  </div>
                  <Input
                    label="Endereco"
                    placeholder="Endereco do local"
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                  />
                </>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Data Inicio"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => updateField("startDate", e.target.value)}
                />
                <Input
                  label="Data Fim"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => updateField("endDate", e.target.value)}
                />
                <Input
                  label="Prazo Inscricao"
                  type="date"
                  value={form.registrationDeadline}
                  onChange={(e) => updateField("registrationDeadline", e.target.value)}
                />
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Rules */}
        <Card className={`relative overflow-hidden transition-all duration-300 ${
          activeStep === 4 ? "ring-1 ring-blue-200 shadow-md" : ""
        }`}>
          <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${
            activeStep >= 4 ? "bg-blue-500" : "bg-slate-200"
          }`} />
          <div className="pl-3">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <ScrollText className="w-4.5 h-4.5 text-blue-600" />
              </div>
              <CardTitle>Regras</CardTitle>
            </div>
            <CardContent className="mt-4">
              <Textarea
                label="Regras do Torneio"
                placeholder="Descreva as regras do torneio..."
                rows={6}
                value={form.rules}
                onChange={(e) => updateField("rules", e.target.value)}
              />
            </CardContent>
          </div>
        </Card>

        {/* Preview Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/60 p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-blue-500/15 flex items-center justify-center">
              <Eye className="w-4.5 h-4.5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-blue-900">Resumo do Torneio</h3>
              <p className="text-xs text-blue-600">Revise as informacoes antes de criar</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/80 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-500 mb-0.5">Esporte</p>
              <p className="text-sm font-semibold text-slate-700">{selectedSportLabel}</p>
            </div>
            <div className="bg-white/80 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-500 mb-0.5">Formato</p>
              <p className="text-sm font-semibold text-slate-700">{selectedFormatLabel}</p>
            </div>
            <div className="bg-white/80 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-500 mb-0.5">Vagas</p>
              <p className="text-sm font-semibold text-slate-700">{form.minParticipants} - {form.maxParticipants}</p>
            </div>
            <div className="bg-white/80 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-500 mb-0.5">Premiacao</p>
              <p className="text-sm font-semibold text-blue-600">{form.prizePool.toLocaleString()} GCoins</p>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 justify-end">
          <Link href="/tournaments">
            <Button variant="ghost" size="lg">Cancelar</Button>
          </Link>
          <Button type="submit" size="lg" loading={createMutation.isPending}>
            <Trophy className="w-5 h-5" />
            Criar Torneio
          </Button>
        </div>
      </form>
    </div>
  );
}
