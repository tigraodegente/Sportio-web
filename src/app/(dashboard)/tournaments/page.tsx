"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Plus, Search, MapPin, Calendar, Users, Trophy, Ticket, Loader2, Sun, Dumbbell, Target, Gamepad2, Footprints, Circle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Select } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";

const sportIconMap: Record<string, LucideIcon> = {
  "Beach Tennis": Sun,
  "CrossFit": Dumbbell,
  "Futebol": Target,
  "E-Sports": Gamepad2,
  "Corrida": Footprints,
  "Volei": Circle,
};

const sportGradientMap: Record<string, string> = {
  "bg-yellow-500": "from-yellow-400 to-amber-500",
  "bg-red-500": "from-red-400 to-rose-600",
  "bg-green-500": "from-green-400 to-blue-600",
  "bg-purple-500": "from-purple-400 to-violet-600",
  "bg-blue-500": "from-blue-400 to-indigo-600",
};

const sportColorMap: Record<string, string> = {
  "Beach Tennis": "bg-yellow-500",
  "CrossFit": "bg-red-500",
  "Futebol": "bg-green-500",
  "E-Sports": "bg-purple-500",
  "Corrida": "bg-blue-500",
  "Volei": "bg-blue-500",
};

const statusMap: Record<string, { label: string; variant: "primary" | "info" | "success" | "danger" }> = {
  draft: { label: "Rascunho", variant: "info" },
  registration_open: { label: "Inscricoes Abertas", variant: "primary" },
  registration_closed: { label: "Inscricoes Fechadas", variant: "info" },
  in_progress: { label: "Em Andamento", variant: "info" },
  completed: { label: "Finalizado", variant: "success" },
  cancelled: { label: "Cancelado", variant: "danger" },
};

const formatMap: Record<string, string> = {
  single_elimination: "Eliminacao Simples",
  double_elimination: "Eliminacao Dupla",
  round_robin: "Todos contra Todos",
  swiss: "Suico",
  league: "Liga",
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

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "--";
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" });
}

function TournamentCard({ tournament }: { tournament: any }) { // eslint-disable-line
  const enrollmentCount = tournament.enrollments?.length ?? 0;
  const maxParticipants = tournament.maxParticipants ?? 32;
  const fillPercent = Math.round((enrollmentCount / maxParticipants) * 100);
  const sportName = tournament.sport?.name ?? "Esporte";
  const SportIcon = sportIconMap[sportName] || Trophy;
  const sportColor = tournament.sport?.color || sportColorMap[sportName] || "bg-blue-500";
  const gradient = sportGradientMap[sportColor] || "from-blue-400 to-blue-600";
  const entryFee = Number(tournament.entryFee ?? 0);
  const prizePool = Number(tournament.prizePool ?? 0);
  const cityDisplay = tournament.isOnline
    ? "Online"
    : [tournament.city, tournament.state].filter(Boolean).join(", ") || "--";

  return (
    <Link href={`/tournaments/${tournament.id}`}>
      <Card hover className="h-full overflow-hidden group">
        {/* Sport color bar */}
        <div className={`h-1.5 -mt-5 sm:-mt-6 -mx-5 sm:-mx-6 mb-4 rounded-t-2xl bg-gradient-to-r ${gradient}`} />

        <div className="flex items-start justify-between mb-3">
          <Badge variant={statusMap[tournament.status]?.variant ?? "info"}>
            {statusMap[tournament.status]?.label ?? tournament.status}
          </Badge>
          {tournament.level && (
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-xs font-bold text-slate-600 ring-1 ring-slate-200/50">
              {tournament.level}
            </span>
          )}
        </div>

        <h3 className="font-bold text-lg text-slate-900 mb-1.5 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
          {tournament.name}
        </h3>
        <p className="text-sm text-slate-500 mb-4 flex items-center gap-1.5">
          <SportIcon className="w-4 h-4 text-slate-400" />
          <span className="font-medium">{sportName}</span>
        </p>

        <div className="space-y-2.5 text-sm text-slate-600">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <span>{cityDisplay}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <span>{formatDate(tournament.startDate)}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span>{enrollmentCount}/{maxParticipants} participantes</span>
                <span className="text-xs text-slate-400 font-medium">{fillPercent}%</span>
              </div>
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
              entryFee > 0 ? "bg-slate-100" : "bg-blue-50"
            }`}>
              <Ticket className={`w-4 h-4 ${
                entryFee > 0 ? "text-slate-500" : "text-blue-600"
              }`} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Inscricao</p>
              {entryFee > 0 ? (
                <p className="text-sm font-semibold text-slate-900">
                  {entryFee} GCoins
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
                {prizePool.toLocaleString()}
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
}

function TournamentGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 animate-pulse">
          <div className="h-1.5 -mt-5 sm:-mt-6 -mx-5 sm:-mx-6 mb-4 rounded-t-2xl bg-slate-200" />
          <div className="flex justify-between mb-3">
            <div className="h-6 w-28 bg-slate-200 rounded-full" />
            <div className="h-7 w-7 bg-slate-100 rounded-full" />
          </div>
          <div className="h-5 w-3/4 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-1/3 bg-slate-100 rounded mb-4" />
          <div className="space-y-3">
            <div className="h-4 w-1/2 bg-slate-100 rounded" />
            <div className="h-4 w-1/3 bg-slate-100 rounded" />
            <div className="h-4 w-full bg-slate-100 rounded" />
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-slate-100">
            <div className="h-10 w-24 bg-slate-100 rounded" />
            <div className="h-10 w-24 bg-slate-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TournamentGrid({ tournaments, loadMoreRef, isFetchingNextPage, hasNextPage }: {
  tournaments: any[]; // eslint-disable-line
  loadMoreRef?: React.RefObject<HTMLDivElement | null>;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
}) {
  if (tournaments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Trophy className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Nenhum torneio encontrado</h3>
        <p className="text-sm text-slate-500 max-w-md">
          Tente alterar os filtros ou crie um novo torneio.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tournaments.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </div>
      {loadMoreRef && (
        <div ref={loadMoreRef} className="py-4">
          {isFetchingNextPage && (
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          )}
          {!hasNextPage && tournaments.length > 0 && (
            <p className="text-center text-sm text-slate-400">
              Voce viu todos os torneios
            </p>
          )}
        </div>
      )}
    </>
  );
}

export default function TournamentsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // All tournaments (infinite query)
  const allQuery = trpc.tournament.list.useInfiniteQuery(
    {
      limit: 20,
      search: debouncedSearch || undefined,
      status: (status as "draft" | "registration_open" | "registration_closed" | "in_progress" | "completed" | "cancelled") || undefined,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: activeTab === "all",
    }
  );

  // My tournaments (as organizer)
  const myQuery = trpc.tournament.myTournaments.useQuery(undefined, {
    enabled: activeTab === "my",
    retry: false,
  });

  // My enrollments
  const enrolledQuery = trpc.tournament.myEnrollments.useQuery(undefined, {
    enabled: activeTab === "enrolled",
    retry: false,
  });

  const allTournaments = allQuery.data?.pages.flatMap((page) => page.items) ?? [];

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target?.isIntersecting && allQuery.hasNextPage && !allQuery.isFetchingNextPage) {
        allQuery.fetchNextPage();
      }
    },
    [allQuery]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => observer.disconnect();
  }, [handleObserver]);

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
        <Select
          options={sportOptions}
          placeholder="Esporte"
          className="sm:w-48"
        />
        <Select
          options={[
            { value: "", label: "Status" },
            { value: "registration_open", label: "Inscricoes abertas" },
            { value: "in_progress", label: "Em andamento" },
            { value: "completed", label: "Finalizado" },
          ]}
          placeholder="Status"
          className="sm:w-48"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>

      <Tabs
        tabs={[
          { id: "all", label: "Todos" },
          { id: "my", label: "Meus Torneios" },
          { id: "enrolled", label: "Inscritos" },
        ]}
        onChange={setActiveTab}
      >
        {(tab) => (
          <>
            {tab === "all" && (
              <>
                {allQuery.isLoading ? (
                  <TournamentGridSkeleton />
                ) : allQuery.isError ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-sm text-red-500 mb-2">Erro ao carregar torneios.</p>
                    <Button variant="ghost" onClick={() => allQuery.refetch()}>
                      Tentar novamente
                    </Button>
                  </div>
                ) : (
                  <TournamentGrid
                    tournaments={allTournaments}
                    loadMoreRef={loadMoreRef}
                    isFetchingNextPage={allQuery.isFetchingNextPage}
                    hasNextPage={allQuery.hasNextPage}
                  />
                )}
              </>
            )}

            {tab === "my" && (
              <>
                {myQuery.isLoading ? (
                  <TournamentGridSkeleton />
                ) : myQuery.isError ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-sm text-red-500 mb-2">Erro ao carregar seus torneios.</p>
                    <Button variant="ghost" onClick={() => myQuery.refetch()}>
                      Tentar novamente
                    </Button>
                  </div>
                ) : (
                  <TournamentGrid tournaments={myQuery.data ?? []} />
                )}
              </>
            )}

            {tab === "enrolled" && (
              <>
                {enrolledQuery.isLoading ? (
                  <TournamentGridSkeleton />
                ) : enrolledQuery.isError ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-sm text-red-500 mb-2">Erro ao carregar inscricoes.</p>
                    <Button variant="ghost" onClick={() => enrolledQuery.refetch()}>
                      Tentar novamente
                    </Button>
                  </div>
                ) : (
                  <TournamentGrid
                    tournaments={(enrolledQuery.data ?? []).map((e) => e.tournament)}
                  />
                )}
              </>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}
