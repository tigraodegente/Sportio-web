"use client";

import { useState } from "react";
import {
  Target,
  Trophy,
  Users,
  Plus,
  Clock,
  Coins,
  Loader2,
  X,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

function formatTimeRemaining(endsAt: string | Date | null): string {
  if (!endsAt) return "Sem prazo";
  const now = new Date();
  const end = new Date(endsAt);
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) return "Encerrado";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h restantes`;
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m restantes`;
}

function formatDate(date: string | Date | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ChallengesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    reward: "",
    rewardType: "gcoins",
    goal: "",
    maxParticipants: "",
    startsAt: "",
    endsAt: "",
  });

  const utils = trpc.useUtils();

  const {
    data: challenges,
    isLoading,
    error,
  } = trpc.challenge.list.useQuery({});

  const joinMutation = trpc.challenge.join.useMutation({
    onSuccess: () => {
      utils.challenge.list.invalidate();
    },
  });

  const createMutation = trpc.challenge.create.useMutation({
    onSuccess: () => {
      utils.challenge.list.invalidate();
      setShowCreateModal(false);
      setNewChallenge({
        title: "",
        description: "",
        reward: "",
        rewardType: "gcoins",
        goal: "",
        maxParticipants: "",
        startsAt: "",
        endsAt: "",
      });
    },
  });

  function handleJoin(challengeId: string) {
    joinMutation.mutate({ challengeId });
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    createMutation.mutate({
      title: newChallenge.title,
      description: newChallenge.description || undefined,
      reward: newChallenge.reward ? Number(newChallenge.reward) : undefined,
      rewardType: (newChallenge.rewardType as "real" | "gamification") || undefined,
      goal: newChallenge.goal ? { description: newChallenge.goal } : undefined,
      maxParticipants: newChallenge.maxParticipants
        ? Number(newChallenge.maxParticipants)
        : undefined,
      startsAt: newChallenge.startsAt
        ? new Date(newChallenge.startsAt).toISOString()
        : undefined,
      endsAt: newChallenge.endsAt
        ? new Date(newChallenge.endsAt).toISOString()
        : undefined,
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Desafios</h1>
          <p className="text-slate-500">
            Participe de desafios e ganhe recompensas
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          Criar Desafio
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
          <p className="text-slate-500 text-sm">Carregando desafios...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center py-20">
          <Target className="w-10 h-10 text-red-400 mb-3" />
          <p className="text-slate-700 font-semibold mb-1">
            Erro ao carregar desafios
          </p>
          <p className="text-slate-500 text-sm">{error.message}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && challenges && challenges.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-slate-700 font-semibold mb-1">
            Nenhum desafio encontrado
          </p>
          <p className="text-slate-500 text-sm mb-4">
            Crie o primeiro desafio e convide seus amigos!
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            Criar Desafio
          </Button>
        </div>
      )}

      {/* Challenge Cards Grid */}
      {!isLoading && !error && challenges && challenges.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((challenge: any) => {
            const timeRemaining = formatTimeRemaining(challenge.endsAt);
            const isEnded = timeRemaining === "Encerrado";

            return (
              <Card key={challenge.id} hover className="h-full overflow-hidden group">
                {/* Blue accent bar */}
                <div className="h-1.5 -mt-5 sm:-mt-6 -mx-5 sm:-mx-6 mb-4 rounded-t-2xl bg-gradient-to-r from-blue-400 to-blue-600" />

                <div className="flex items-start justify-between mb-3">
                  <Badge variant={challenge.isActive ? "primary" : "default"}>
                    {challenge.isActive ? "Ativo" : "Encerrado"}
                  </Badge>
                  {challenge.sport && (
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {challenge.sport.name || challenge.sport}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-lg text-slate-900 mb-1.5 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
                  {challenge.title}
                </h3>

                {challenge.description && (
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {challenge.description}
                  </p>
                )}

                <div className="space-y-2.5 text-sm text-slate-600">
                  {/* Creator */}
                  {challenge.creator && (
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <span>
                        Criado por{" "}
                        <span className="font-medium">
                          {challenge.creator.name || challenge.creator.username || "Usuario"}
                        </span>
                      </span>
                    </div>
                  )}

                  {/* Participants */}
                  {challenge.maxParticipants && (
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <span>
                        {challenge._count?.participants ?? 0}/{challenge.maxParticipants} participantes
                      </span>
                    </div>
                  )}

                  {/* Time Remaining */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <span
                      className={
                        isEnded ? "text-red-500 font-medium" : ""
                      }
                    >
                      {timeRemaining}
                    </span>
                  </div>

                  {/* Dates */}
                  {challenge.startsAt && (
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <span>
                        {formatDate(challenge.startsAt)}
                        {challenge.endsAt &&
                          ` - ${formatDate(challenge.endsAt)}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer: Reward + Join */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                      <Coins className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Recompensa</p>
                      {challenge.reward ? (
                        <p className="text-sm font-bold text-amber-600">
                          {challenge.reward}{" "}
                          {challenge.rewardType === "gcoins"
                            ? "GCoins"
                            : challenge.rewardType || "GCoins"}
                        </p>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-xs font-bold text-blue-700 bg-blue-50 rounded-full ring-1 ring-blue-200/50">
                          Honra
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={isEnded || !challenge.isActive ? "ghost" : "primary"}
                    disabled={
                      isEnded ||
                      !challenge.isActive ||
                      joinMutation.isPending
                    }
                    onClick={() => handleJoin(challenge.id)}
                  >
                    {joinMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Target className="w-4 h-4" />
                    )}
                    Participar
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Criar Desafio
                </h2>
                <p className="text-sm text-slate-500">
                  Crie um novo desafio para a comunidade
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Titulo *
                </label>
                <Input
                  placeholder="Nome do desafio"
                  value={newChallenge.title}
                  onChange={(e) =>
                    setNewChallenge((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Descricao
                </label>
                <textarea
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all resize-none"
                  rows={3}
                  placeholder="Descreva o desafio..."
                  value={newChallenge.description}
                  onChange={(e) =>
                    setNewChallenge((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Reward & Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Recompensa
                  </label>
                  <Input
                    type="number"
                    placeholder="Ex: 100"
                    value={newChallenge.reward}
                    onChange={(e) =>
                      setNewChallenge((prev) => ({
                        ...prev,
                        reward: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Tipo
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                    value={newChallenge.rewardType}
                    onChange={(e) =>
                      setNewChallenge((prev) => ({
                        ...prev,
                        rewardType: e.target.value,
                      }))
                    }
                  >
                    <option value="gcoins">GCoins</option>
                    <option value="trophy">Trofeu</option>
                    <option value="badge">Badge</option>
                  </select>
                </div>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Meta
                </label>
                <Input
                  placeholder="Ex: Correr 50km em 30 dias"
                  value={newChallenge.goal}
                  onChange={(e) =>
                    setNewChallenge((prev) => ({
                      ...prev,
                      goal: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Max Participants */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Max. Participantes
                </label>
                <Input
                  type="number"
                  placeholder="Sem limite"
                  value={newChallenge.maxParticipants}
                  onChange={(e) =>
                    setNewChallenge((prev) => ({
                      ...prev,
                      maxParticipants: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Inicio
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                    value={newChallenge.startsAt}
                    onChange={(e) =>
                      setNewChallenge((prev) => ({
                        ...prev,
                        startsAt: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Fim
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                    value={newChallenge.endsAt}
                    onChange={(e) =>
                      setNewChallenge((prev) => ({
                        ...prev,
                        endsAt: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Error message */}
              {createMutation.error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">
                  {createMutation.error.message}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  loading={createMutation.isPending}
                  disabled={!newChallenge.title.trim()}
                >
                  <Trophy className="w-4 h-4" />
                  Criar Desafio
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
