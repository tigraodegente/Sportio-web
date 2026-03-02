"use client";

import { useState } from "react";
import {
  Swords,
  Trophy,
  Users,
  Plus,
  Clock,
  Coins,
  Loader2,
  X,
  Calendar,
  Target,
  Search,
  TrendingUp,
  Eye,
  ChevronRight,
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

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Aguardando", color: "bg-amber-100 text-amber-700" },
  accepted: { label: "Aceito", color: "bg-blue-100 text-blue-700" },
  betting_open: { label: "Apostas Abertas", color: "bg-green-100 text-green-700" },
  in_progress: { label: "Em Andamento", color: "bg-purple-100 text-purple-700" },
  completed: { label: "Finalizado", color: "bg-slate-100 text-slate-700" },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-700" },
};

type TabType = "duels" | "bettable" | "my" | "community";

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("duels");
  const [showCreateDuel, setShowCreateDuel] = useState(false);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  // Create duel form
  const [duelForm, setDuelForm] = useState({
    title: "",
    description: "",
    opponentSearch: "",
    opponentId: "",
    opponentName: "",
    wagerAmount: "",
    bettingEnabled: true,
    sportId: "",
    startsAt: "",
  });

  // Community form
  const [communityForm, setCommunityForm] = useState({
    title: "",
    description: "",
    reward: "",
    rewardType: "gamification",
    goal: "",
    maxParticipants: "",
    startsAt: "",
    endsAt: "",
  });

  // Bet form
  const [betForm, setBetForm] = useState({ amount: "", winnerId: "" });

  const utils = trpc.useUtils();

  // Queries
  const duelsQuery = trpc.challenge.list.useQuery(
    { type: "duel", limit: 20 },
    { enabled: activeTab === "duels" }
  );
  const bettableQuery = trpc.challenge.listBettable.useQuery(
    { limit: 20 },
    { enabled: activeTab === "bettable" }
  );
  const myQuery = trpc.challenge.myChallenges.useQuery(
    { limit: 20 },
    { enabled: activeTab === "my" }
  );
  const communityQuery = trpc.challenge.list.useQuery(
    { type: "community", limit: 20 },
    { enabled: activeTab === "community" }
  );
  const detailQuery = trpc.challenge.getById.useQuery(
    { id: selectedChallenge! },
    { enabled: !!selectedChallenge }
  );

  // Opponent search
  const opponentSearch = trpc.challenge.searchOpponents.useQuery(
    { query: duelForm.opponentSearch },
    { enabled: duelForm.opponentSearch.length >= 2 }
  );

  // Mutations
  const createDuelMut = trpc.challenge.createDuel.useMutation({
    onSuccess: () => {
      utils.challenge.list.invalidate();
      utils.challenge.myChallenges.invalidate();
      setShowCreateDuel(false);
      setDuelForm({ title: "", description: "", opponentSearch: "", opponentId: "", opponentName: "", wagerAmount: "", bettingEnabled: true, sportId: "", startsAt: "" });
    },
  });

  const createCommunityMut = trpc.challenge.create.useMutation({
    onSuccess: () => {
      utils.challenge.list.invalidate();
      setShowCreateCommunity(false);
      setCommunityForm({ title: "", description: "", reward: "", rewardType: "gamification", goal: "", maxParticipants: "", startsAt: "", endsAt: "" });
    },
  });

  const acceptMut = trpc.challenge.acceptDuel.useMutation({
    onSuccess: () => { utils.challenge.invalidate(); },
  });
  const declineMut = trpc.challenge.declineDuel.useMutation({
    onSuccess: () => { utils.challenge.invalidate(); },
  });
  const startMut = trpc.challenge.startChallenge.useMutation({
    onSuccess: () => { utils.challenge.invalidate(); },
  });
  const cancelMut = trpc.challenge.cancel.useMutation({
    onSuccess: () => { utils.challenge.invalidate(); },
  });
  const submitResultMut = trpc.challenge.submitResult.useMutation({
    onSuccess: () => { utils.challenge.invalidate(); },
  });
  const joinMut = trpc.challenge.join.useMutation({
    onSuccess: () => { utils.challenge.list.invalidate(); },
  });
  const placeBetMut = trpc.bet.placeChallengeBet.useMutation({
    onSuccess: () => {
      utils.challenge.invalidate();
      utils.bet.invalidate();
      setBetForm({ amount: "", winnerId: "" });
    },
  });

  // Handlers
  function handleCreateDuel(e: React.FormEvent) {
    e.preventDefault();
    createDuelMut.mutate({
      title: duelForm.title,
      description: duelForm.description || undefined,
      opponentId: duelForm.opponentId,
      wagerAmount: duelForm.wagerAmount ? Number(duelForm.wagerAmount) : 0,
      bettingEnabled: duelForm.bettingEnabled,
      sportId: duelForm.sportId || undefined,
      startsAt: duelForm.startsAt ? new Date(duelForm.startsAt).toISOString() : undefined,
    });
  }

  function handleCreateCommunity(e: React.FormEvent) {
    e.preventDefault();
    createCommunityMut.mutate({
      title: communityForm.title,
      description: communityForm.description || undefined,
      reward: communityForm.reward ? Number(communityForm.reward) : undefined,
      rewardType: (communityForm.rewardType as "real" | "gamification") || undefined,
      goal: communityForm.goal ? { description: communityForm.goal } : undefined,
      maxParticipants: communityForm.maxParticipants ? Number(communityForm.maxParticipants) : undefined,
      startsAt: communityForm.startsAt ? new Date(communityForm.startsAt).toISOString() : undefined,
      endsAt: communityForm.endsAt ? new Date(communityForm.endsAt).toISOString() : undefined,
    });
  }

  function renderDuelCard(challenge: any) {
    const status = statusLabels[challenge.status] ?? { label: challenge.status, color: "bg-slate-100 text-slate-600" };

    return (
      <Card key={challenge.id} hover className="h-full overflow-hidden group cursor-pointer" onClick={() => setSelectedChallenge(challenge.id)}>
        {/* Status bar */}
        <div className={`h-1.5 -mt-5 sm:-mt-6 -mx-5 sm:-mx-6 mb-4 rounded-t-2xl ${
          challenge.status === "betting_open" ? "bg-gradient-to-r from-green-400 to-emerald-500" :
          challenge.status === "in_progress" ? "bg-gradient-to-r from-purple-400 to-purple-600" :
          challenge.status === "completed" ? "bg-gradient-to-r from-slate-300 to-slate-400" :
          "bg-gradient-to-r from-blue-400 to-blue-600"
        }`} />

        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
            {status.label}
          </span>
          {challenge.sport && (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {challenge.sport.name}
            </span>
          )}
        </div>

        <h3 className="font-bold text-lg text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
          {challenge.title}
        </h3>

        {/* VS Display */}
        <div className="flex items-center justify-between gap-3 mb-4 p-3 rounded-xl bg-slate-50">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-xs font-bold text-blue-700">
              {challenge.creator?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <span className="text-sm font-medium text-slate-700 truncate">
              {challenge.creator?.name ?? "Criador"}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400 shrink-0">VS</span>
          <div className="flex items-center gap-2 min-w-0 justify-end">
            <span className="text-sm font-medium text-slate-700 truncate text-right">
              {challenge.opponent?.name ?? "Aguardando..."}
            </span>
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-xs font-bold text-red-700">
              {challenge.opponent?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          </div>
        </div>

        {/* Score (if completed) */}
        {challenge.status === "completed" && challenge.score1 != null && (
          <div className="text-center mb-3">
            <span className="text-2xl font-bold text-slate-900">{challenge.score1} x {challenge.score2}</span>
            {challenge.winner && (
              <p className="text-sm text-green-600 font-medium mt-1">
                Vencedor: {challenge.winner.name}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
          {Number(challenge.wagerAmount ?? 0) > 0 ? (
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-amber-600">{challenge.wagerAmount} GCoins</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Sem aposta</span>
          )}
          {challenge.bettingEnabled && challenge.status === "betting_open" && (
            <div className="flex items-center gap-1.5 text-green-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">Apostar</span>
            </div>
          )}
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>
      </Card>
    );
  }

  function renderBettableCard(challenge: any) {
    const stats = challenge.betStats;

    return (
      <Card key={challenge.id} hover className="h-full overflow-hidden group cursor-pointer" onClick={() => setSelectedChallenge(challenge.id)}>
        <div className="h-1.5 -mt-5 sm:-mt-6 -mx-5 sm:-mx-6 mb-4 rounded-t-2xl bg-gradient-to-r from-green-400 to-emerald-500" />

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
            Apostas Abertas
          </span>
          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <Eye className="w-3.5 h-3.5" />
            {stats?.totalBets ?? 0} palpites
          </div>
        </div>

        <h3 className="font-bold text-lg text-slate-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
          {challenge.title}
        </h3>

        {/* VS com odds */}
        <div className="flex items-center justify-between gap-2 mb-3 p-3 rounded-xl bg-slate-50">
          <div className="flex-1 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-1 text-sm font-bold text-blue-700">
              {challenge.creator?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <p className="text-xs font-medium text-slate-700 truncate">{challenge.creator?.name}</p>
            <p className="text-xs text-blue-600 font-bold">{stats?.betsOnCreator ?? 0} apostas</p>
          </div>
          <span className="text-xs font-bold text-slate-400">VS</span>
          <div className="flex-1 text-center">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-1 text-sm font-bold text-red-700">
              {challenge.opponent?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <p className="text-xs font-medium text-slate-700 truncate">{challenge.opponent?.name}</p>
            <p className="text-xs text-red-600 font-bold">{stats?.betsOnOpponent ?? 0} apostas</p>
          </div>
        </div>

        {/* Pool total */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-amber-600">{stats?.totalPool ?? 0} pool</span>
          </div>
          <Button size="sm" variant="primary" onClick={(e) => { e.stopPropagation(); setSelectedChallenge(challenge.id); }}>
            <TrendingUp className="w-3.5 h-3.5" />
            Apostar
          </Button>
        </div>
      </Card>
    );
  }

  function renderCommunityCard(challenge: any) {
    return (
      <Card key={challenge.id} hover className="h-full overflow-hidden group">
        <div className="h-1.5 -mt-5 sm:-mt-6 -mx-5 sm:-mx-6 mb-4 rounded-t-2xl bg-gradient-to-r from-blue-400 to-blue-600" />

        <div className="flex items-start justify-between mb-3">
          <Badge variant={challenge.isActive ? "primary" : "default"}>
            {challenge.isActive ? "Ativo" : "Encerrado"}
          </Badge>
          {challenge.sport && (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {challenge.sport.name}
            </span>
          )}
        </div>

        <h3 className="font-bold text-lg text-slate-900 mb-1.5 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
          {challenge.title}
        </h3>

        {challenge.description && (
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">{challenge.description}</p>
        )}

        <div className="space-y-2 text-sm text-slate-600">
          {challenge.creator && (
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Criado por <span className="font-medium">{challenge.creator.name}</span></span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTimeRemaining(challenge.endsAt)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-500" />
            {challenge.reward && Number(challenge.reward) > 0 ? (
              <span className="text-sm font-bold text-amber-600">{challenge.reward} GCoins</span>
            ) : (
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">Honra</span>
            )}
          </div>
          <Button size="sm" disabled={!challenge.isActive || joinMut.isPending} onClick={() => joinMut.mutate({ challengeId: challenge.id })}>
            <Target className="w-4 h-4" />
            Participar
          </Button>
        </div>
      </Card>
    );
  }

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: "duels", label: "Duelos 1v1", icon: <Swords className="w-4 h-4" /> },
    { key: "bettable", label: "Apostar", icon: <TrendingUp className="w-4 h-4" /> },
    { key: "my", label: "Meus Desafios", icon: <Target className="w-4 h-4" /> },
    { key: "community", label: "Comunidade", icon: <Users className="w-4 h-4" /> },
  ];

  const currentQuery = activeTab === "duels" ? duelsQuery : activeTab === "bettable" ? bettableQuery : activeTab === "my" ? myQuery : communityQuery;
  const isLoading = currentQuery.isLoading;
  const error = currentQuery.error;
  const data = currentQuery.data as any[] | undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Desafios</h1>
          <p className="text-slate-500">Desafie oponentes e aposte em duelos 1v1</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCreateCommunity(true)}>
            <Plus className="w-4 h-4" />
            Comunidade
          </Button>
          <Button onClick={() => setShowCreateDuel(true)}>
            <Swords className="w-4 h-4" />
            Desafiar
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-slate-100">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setSelectedChallenge(null); }}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
          <p className="text-slate-500 text-sm">Carregando...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center py-20">
          <Target className="w-10 h-10 text-red-400 mb-3" />
          <p className="text-slate-700 font-semibold mb-1">Erro ao carregar</p>
          <p className="text-slate-500 text-sm">{error.message}</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && data && data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Swords className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-slate-700 font-semibold mb-1">
            {activeTab === "duels" ? "Nenhum duelo encontrado" :
             activeTab === "bettable" ? "Nenhum desafio aberto para apostas" :
             activeTab === "my" ? "Você ainda não tem desafios" :
             "Nenhum desafio da comunidade"}
          </p>
          <p className="text-slate-500 text-sm mb-4">
            {activeTab === "duels" || activeTab === "my"
              ? "Crie um desafio e convide um oponente!"
              : "Aguarde novos desafios ou crie o seu!"}
          </p>
        </div>
      )}

      {/* Cards Grid */}
      {!isLoading && !error && data && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((challenge: any) => {
            if (activeTab === "bettable") return renderBettableCard(challenge);
            if (activeTab === "community") return renderCommunityCard(challenge);
            return renderDuelCard(challenge);
          })}
        </div>
      )}

      {/* ==================== Challenge Detail Modal ==================== */}
      {selectedChallenge && detailQuery.data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedChallenge(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">{detailQuery.data.title}</h2>
              <button onClick={() => setSelectedChallenge(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status */}
            {(() => {
              const s = statusLabels[detailQuery.data.status] ?? { label: detailQuery.data.status, color: "bg-slate-100 text-slate-600" };
              return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.color}`}>{s.label}</span>;
            })()}

            {detailQuery.data.description && (
              <p className="text-sm text-slate-500 mt-3">{detailQuery.data.description}</p>
            )}

            {/* VS */}
            {detailQuery.data.challengeType === "duel" && (
              <div className="flex items-center justify-between gap-3 my-4 p-4 rounded-xl bg-slate-50">
                <div className="flex-1 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2 text-lg font-bold text-blue-700">
                    {detailQuery.data.creator?.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{detailQuery.data.creator?.name}</p>
                  {detailQuery.data.score1 != null && (
                    <p className="text-2xl font-bold text-slate-900 mt-1">{detailQuery.data.score1}</p>
                  )}
                </div>
                <div className="text-center px-3">
                  <span className="text-sm font-bold text-slate-400">VS</span>
                  {detailQuery.data.status === "completed" && detailQuery.data.winner && (
                    <div className="mt-2">
                      <Trophy className="w-5 h-5 text-amber-500 mx-auto" />
                      <p className="text-xs text-green-600 font-semibold mt-0.5">{detailQuery.data.winner.name}</p>
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2 text-lg font-bold text-red-700">
                    {detailQuery.data.opponent?.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{detailQuery.data.opponent?.name ?? "Aguardando"}</p>
                  {detailQuery.data.score2 != null && (
                    <p className="text-2xl font-bold text-slate-900 mt-1">{detailQuery.data.score2}</p>
                  )}
                </div>
              </div>
            )}

            {/* Wager */}
            {Number(detailQuery.data.wagerAmount ?? 0) > 0 && (
              <div className="flex items-center gap-2 mb-3 p-3 rounded-xl bg-amber-50">
                <Coins className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-semibold text-amber-700">
                  Aposta: {detailQuery.data.wagerAmount} GCoins cada (prêmio: {Number(detailQuery.data.wagerAmount) * 2} GCoins)
                </span>
              </div>
            )}

            {/* Bet Stats */}
            {detailQuery.data.betStats && Number(detailQuery.data.betStats.totalBets) > 0 && (
              <div className="p-3 rounded-xl bg-green-50 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">
                    {detailQuery.data.betStats.totalBets} palpites | Pool: {detailQuery.data.betStats.totalPool} GCoins
                  </span>
                </div>
                <div className="flex gap-3 text-xs">
                  <span className="text-blue-600 font-medium">
                    {detailQuery.data.creator?.name}: {detailQuery.data.betStats.betsOnCreator} apostas
                  </span>
                  <span className="text-red-600 font-medium">
                    {detailQuery.data.opponent?.name}: {detailQuery.data.betStats.betsOnOpponent} apostas
                  </span>
                </div>
              </div>
            )}

            {/* Actions based on status + role */}
            <div className="space-y-3 mt-4">
              {/* Accept/Decline (opponent, pending) */}
              {detailQuery.data.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    className="flex-1"
                    loading={acceptMut.isPending}
                    onClick={() => acceptMut.mutate({ challengeId: detailQuery.data!.id })}
                  >
                    Aceitar Desafio
                  </Button>
                  <Button
                    variant="danger"
                    className="flex-1"
                    loading={declineMut.isPending}
                    onClick={() => declineMut.mutate({ challengeId: detailQuery.data!.id })}
                  >
                    Recusar
                  </Button>
                </div>
              )}

              {/* Start (participants, betting_open) */}
              {detailQuery.data.status === "betting_open" && (
                <Button
                  variant="accent"
                  className="w-full"
                  loading={startMut.isPending}
                  onClick={() => startMut.mutate({ challengeId: detailQuery.data!.id })}
                >
                  <Swords className="w-4 h-4" />
                  Iniciar Desafio (Fechar Apostas)
                </Button>
              )}

              {/* Submit result (participants, in_progress) */}
              {detailQuery.data.status === "in_progress" && detailQuery.data.challengeType === "duel" && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-700">Quem venceu?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" placeholder="Placar 1" min={0} onChange={(e) => {
                      const v = e.target.value;
                      setBetForm(prev => ({ ...prev, amount: v }));
                    }} />
                    <Input type="number" placeholder="Placar 2" min={0} onChange={(e) => {
                      const v = e.target.value;
                      setBetForm(prev => ({ ...prev, winnerId: v }));
                    }} />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      className="flex-1"
                      loading={submitResultMut.isPending}
                      onClick={() => submitResultMut.mutate({
                        challengeId: detailQuery.data!.id,
                        winnerId: detailQuery.data!.creatorId,
                        score1: Number(betForm.amount) || undefined,
                        score2: Number(betForm.winnerId) || undefined,
                      })}
                    >
                      {detailQuery.data.creator?.name} venceu
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      loading={submitResultMut.isPending}
                      onClick={() => submitResultMut.mutate({
                        challengeId: detailQuery.data!.id,
                        winnerId: detailQuery.data!.opponentId!,
                        score1: Number(betForm.amount) || undefined,
                        score2: Number(betForm.winnerId) || undefined,
                      })}
                    >
                      {detailQuery.data.opponent?.name} venceu
                    </Button>
                  </div>
                </div>
              )}

              {/* Place bet (spectators, betting_open) */}
              {detailQuery.data.status === "betting_open" && detailQuery.data.bettingEnabled && (
                <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    Fazer Palpite
                  </h3>
                  <Input
                    type="number"
                    placeholder="Quantidade de GCoins"
                    min={1}
                    value={betForm.amount}
                    onChange={(e) => setBetForm(prev => ({ ...prev, amount: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      className="flex-1"
                      size="sm"
                      disabled={!betForm.amount || Number(betForm.amount) <= 0}
                      loading={placeBetMut.isPending}
                      onClick={() => placeBetMut.mutate({
                        challengeId: detailQuery.data!.id,
                        winnerId: detailQuery.data!.creatorId,
                        amount: Number(betForm.amount),
                      })}
                    >
                      {detailQuery.data.creator?.name}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      size="sm"
                      disabled={!betForm.amount || Number(betForm.amount) <= 0}
                      loading={placeBetMut.isPending}
                      onClick={() => placeBetMut.mutate({
                        challengeId: detailQuery.data!.id,
                        winnerId: detailQuery.data!.opponentId!,
                        amount: Number(betForm.amount),
                      })}
                    >
                      {detailQuery.data.opponent?.name}
                    </Button>
                  </div>
                  {placeBetMut.error && (
                    <p className="text-xs text-red-600">{placeBetMut.error.message}</p>
                  )}
                </div>
              )}

              {/* Cancel */}
              {detailQuery.data.status !== "completed" && detailQuery.data.status !== "cancelled" && (
                <Button
                  variant="ghost"
                  className="w-full text-red-500 hover:text-red-700"
                  loading={cancelMut.isPending}
                  onClick={() => cancelMut.mutate({ challengeId: detailQuery.data!.id })}
                >
                  Cancelar Desafio
                </Button>
              )}
            </div>

            {submitResultMut.error && (
              <p className="text-sm text-red-600 mt-2">{submitResultMut.error.message}</p>
            )}
          </div>
        </div>
      )}

      {/* ==================== Create Duel Modal ==================== */}
      {showCreateDuel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateDuel(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Desafiar Oponente</h2>
                <p className="text-sm text-slate-500">Crie um desafio 1v1 com apostas</p>
              </div>
              <button onClick={() => setShowCreateDuel(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDuel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Titulo *</label>
                <Input
                  placeholder="Ex: Beach Tennis - Desafio do mês"
                  value={duelForm.title}
                  onChange={(e) => setDuelForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Descrição</label>
                <textarea
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all resize-none"
                  rows={2}
                  placeholder="Detalhes do desafio..."
                  value={duelForm.description}
                  onChange={(e) => setDuelForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {/* Opponent Search */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Oponente *</label>
                {duelForm.opponentId ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="text-sm font-medium text-blue-800">{duelForm.opponentName}</span>
                    <button type="button" onClick={() => setDuelForm(prev => ({ ...prev, opponentId: "", opponentName: "", opponentSearch: "" }))} className="text-blue-400 hover:text-blue-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      className="pl-10"
                      placeholder="Buscar oponente por nome..."
                      value={duelForm.opponentSearch}
                      onChange={(e) => setDuelForm(prev => ({ ...prev, opponentSearch: e.target.value }))}
                    />
                    {opponentSearch.data && opponentSearch.data.length > 0 && duelForm.opponentSearch.length >= 2 && (
                      <div className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-slate-200 max-h-48 overflow-y-auto">
                        {opponentSearch.data.map((u: any) => (
                          <button
                            key={u.id}
                            type="button"
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
                            onClick={() => setDuelForm(prev => ({ ...prev, opponentId: u.id, opponentName: u.name, opponentSearch: "" }))}
                          >
                            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                              {u.name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <span className="text-sm text-slate-800">{u.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wager */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Aposta (GCoins)</label>
                <Input
                  type="number"
                  placeholder="0 = sem aposta"
                  min={0}
                  value={duelForm.wagerAmount}
                  onChange={(e) => setDuelForm(prev => ({ ...prev, wagerAmount: e.target.value }))}
                />
                <p className="text-xs text-slate-400 mt-1">Cada jogador aposta esse valor. Vencedor leva tudo.</p>
              </div>

              {/* Betting toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={duelForm.bettingEnabled}
                  onChange={(e) => setDuelForm(prev => ({ ...prev, bettingEnabled: e.target.checked }))}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-slate-700">Permitir apostas de espectadores</span>
                  <p className="text-xs text-slate-400">Outros usuários podem apostar no resultado</p>
                </div>
              </label>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Data do desafio</label>
                <input
                  type="datetime-local"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  value={duelForm.startsAt}
                  onChange={(e) => setDuelForm(prev => ({ ...prev, startsAt: e.target.value }))}
                />
              </div>

              {createDuelMut.error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{createDuelMut.error.message}</div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCreateDuel(false)}>Cancelar</Button>
                <Button type="submit" className="flex-1" loading={createDuelMut.isPending} disabled={!duelForm.title.trim() || !duelForm.opponentId}>
                  <Swords className="w-4 h-4" />
                  Desafiar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== Create Community Modal ==================== */}
      {showCreateCommunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateCommunity(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Criar Desafio</h2>
                <p className="text-sm text-slate-500">Desafio da comunidade</p>
              </div>
              <button onClick={() => setShowCreateCommunity(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCommunity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Titulo *</label>
                <Input placeholder="Nome do desafio" value={communityForm.title} onChange={(e) => setCommunityForm(prev => ({ ...prev, title: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Descrição</label>
                <textarea className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all resize-none" rows={3} placeholder="Descreva o desafio..." value={communityForm.description} onChange={(e) => setCommunityForm(prev => ({ ...prev, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Recompensa</label>
                  <Input type="number" placeholder="Ex: 100" value={communityForm.reward} onChange={(e) => setCommunityForm(prev => ({ ...prev, reward: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Meta</label>
                  <Input placeholder="Ex: Correr 50km" value={communityForm.goal} onChange={(e) => setCommunityForm(prev => ({ ...prev, goal: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Início</label>
                  <input type="datetime-local" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all" value={communityForm.startsAt} onChange={(e) => setCommunityForm(prev => ({ ...prev, startsAt: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Fim</label>
                  <input type="datetime-local" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all" value={communityForm.endsAt} onChange={(e) => setCommunityForm(prev => ({ ...prev, endsAt: e.target.value }))} />
                </div>
              </div>
              {createCommunityMut.error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{createCommunityMut.error.message}</div>
              )}
              <div className="flex items-center gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCreateCommunity(false)}>Cancelar</Button>
                <Button type="submit" className="flex-1" loading={createCommunityMut.isPending} disabled={!communityForm.title.trim()}>
                  <Trophy className="w-4 h-4" />
                  Criar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
