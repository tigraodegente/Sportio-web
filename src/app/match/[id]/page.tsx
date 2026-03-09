"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Trophy,
  Calendar,
  Loader2,
  AlertCircle,
  Coins,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUuid(s: string): boolean {
  return UUID_RE.test(s);
}

/** Extract initials from a name (up to 2 chars). */
function initials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Format a date for display. */
function formatScheduledDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const DEFAULT_ODDS = 2.0;

const QUICK_AMOUNTS = [50, 100, 250, 500];

const resultIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-4 h-4 text-blue-400" />,
  won: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  lost: <XCircle className="w-4 h-4 text-red-400" />,
  cancelled: <XCircle className="w-4 h-4 text-slate-500" />,
  refunded: <Clock className="w-4 h-4 text-slate-500" />,
};

const resultLabels: Record<string, string> = {
  pending: "Pendente",
  won: "Ganhou",
  lost: "Perdeu",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

// ---------------------------------------------------------------------------
// Status badge component
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: string | null }) {
  switch (status) {
    case "live":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          Ao Vivo
        </span>
      );
    case "scheduled":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wide">
          <Calendar className="w-3 h-3" />
          Agendado
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wide">
          <Trophy className="w-3 h-3" />
          Finalizado
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-600/30 text-slate-400 text-xs font-bold uppercase tracking-wide">
          Cancelado
        </span>
      );
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Player card component
// ---------------------------------------------------------------------------

function PlayerCard({
  player,
  isWinner,
  side,
}: {
  player: { id: string; name: string; image: string | null } | null | undefined;
  isWinner: boolean;
  side: "left" | "right";
}) {
  const name = player?.name ?? "TBD";
  const img = player?.image;

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: side === "left" ? 0.1 : 0.2 }}
      className={`flex flex-col items-center gap-2 flex-1 ${
        side === "right" ? "order-3" : "order-1"
      }`}
    >
      <div
        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 transition-all duration-300 ${
          isWinner
            ? "border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]"
            : "border-slate-600"
        }`}
      >
        {img ? (
          <Image
            src={img}
            alt={name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
            {initials(name)}
          </div>
        )}
        {isWinner && (
          <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5">
            <Trophy className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <p
        className={`text-sm sm:text-base font-semibold text-center leading-tight ${
          isWinner ? "text-emerald-400" : "text-white"
        }`}
      >
        {name}
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton loader
// ---------------------------------------------------------------------------

function MatchSkeleton() {
  return (
    <div className="min-h-screen bg-[#0A1628]">
      <div className="sticky top-0 z-40 bg-[#0A1628]/90 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 rounded bg-slate-800 animate-pulse" />
            <div className="h-3 w-32 rounded bg-slate-800/60 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Header card skeleton */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-6">
          <div className="flex justify-center">
            <div className="h-6 w-24 rounded-full bg-slate-700 animate-pulse" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full bg-slate-700 animate-pulse" />
              <div className="h-4 w-24 rounded bg-slate-700 animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-8 rounded bg-slate-700 animate-pulse" />
              <div className="h-6 w-4 rounded bg-slate-700/60 animate-pulse" />
              <div className="h-10 w-8 rounded bg-slate-700 animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full bg-slate-700 animate-pulse" />
              <div className="h-4 w-24 rounded bg-slate-700 animate-pulse" />
            </div>
          </div>
        </div>
        {/* Betting skeleton */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-4">
          <div className="h-5 w-40 rounded bg-slate-700 animate-pulse" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-14 rounded-xl bg-slate-700 animate-pulse" />
            <div className="h-14 rounded-xl bg-slate-700 animate-pulse" />
          </div>
          <div className="h-12 rounded-xl bg-slate-700 animate-pulse" />
          <div className="h-12 rounded-xl bg-slate-700 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error / Not Found state
// ---------------------------------------------------------------------------

function MatchNotFound() {
  return (
    <div className="min-h-screen bg-[#0A1628] flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        <AlertCircle className="w-16 h-16 text-slate-500 mx-auto" />
        <h1 className="text-xl font-bold text-white">
          Partida nao encontrada
        </h1>
        <p className="text-slate-400 text-sm max-w-sm">
          A partida que voce esta procurando nao existe ou foi removida.
        </p>
        <Link
          href="/bets"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Apostas
        </Link>
      </motion.div>
    </div>
  );
}

// ===========================================================================
// Main Page Component
// ===========================================================================

export default function MatchPage() {
  const params = useParams();
  const rawId = typeof params.id === "string" ? params.id : "";
  const isValid = isValidUuid(rawId);

  const { data: session, status: authStatus } = useSession();
  const isLoggedIn = authStatus === "authenticated" && !!session?.user;

  // ---- tRPC queries -------------------------------------------------------
  const matchQuery = trpc.match.getById.useQuery(
    { id: rawId },
    { enabled: isValid }
  );

  const balanceQuery = trpc.gcoin.balance.useQuery(undefined, {
    enabled: isLoggedIn,
  });

  const myBetsQuery = trpc.bet.myBets.useQuery(
    { limit: 50 },
    { enabled: isLoggedIn }
  );

  const utils = trpc.useUtils();

  // ---- Local state --------------------------------------------------------
  const [selectedPlayer, setSelectedPlayer] = useState<1 | 2 | null>(null);
  const [betAmount, setBetAmount] = useState("");
  const [oddsP1, setOddsP1] = useState(DEFAULT_ODDS);
  const [oddsP2, setOddsP2] = useState(DEFAULT_ODDS);
  const [oddsLoading, setOddsLoading] = useState(false);

  const match = matchQuery.data;

  // ---- Fetch odds for both players when match loads -------------------------
  useEffect(() => {
    if (!match?.id || !match.player1Id || !match.player2Id) return;
    if (match.status !== "live" && match.status !== "scheduled") return;

    setOddsLoading(true);

    const fetchOdds = async () => {
      try {
        const [r1, r2] = await Promise.all([
          utils.bet.getOdds.fetch({
            matchId: match.id,
            betType: "winner",
            prediction: { winnerId: match.player1Id },
          }),
          utils.bet.getOdds.fetch({
            matchId: match.id,
            betType: "winner",
            prediction: { winnerId: match.player2Id },
          }),
        ]);
        setOddsP1(r1.odds);
        setOddsP2(r2.odds);
      } catch {
        setOddsP1(DEFAULT_ODDS);
        setOddsP2(DEFAULT_ODDS);
      } finally {
        setOddsLoading(false);
      }
    };

    fetchOdds();
  }, [match?.id, match?.player1Id, match?.player2Id, match?.status, utils.bet.getOdds]);

  // ---- Place bet mutation ---------------------------------------------------
  const placeBet = trpc.bet.place.useMutation({
    onSuccess: () => {
      toast.success("Aposta realizada com sucesso!");
      myBetsQuery.refetch();
      balanceQuery.refetch();
      setSelectedPlayer(null);
      setBetAmount("");
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao realizar aposta");
    },
  });

  // ---- Derived data ---------------------------------------------------------
  const matchBets = useMemo(() => {
    if (!myBetsQuery.data || !match) return [];
    return (myBetsQuery.data as Array<{
      id: string;
      matchId: string | null;
      betType: string;
      prediction: Record<string, unknown>;
      amount: string;
      odds: string | null;
      potentialWin: string | null;
      result: string | null;
      createdAt: Date;
    }>).filter((b) => b.matchId === match.id);
  }, [myBetsQuery.data, match]);

  const player1Name = match?.player1?.name ?? "Jogador 1";
  const player2Name = match?.player2?.name ?? "Jogador 2";

  const selectedOdds = selectedPlayer === 1 ? oddsP1 : selectedPlayer === 2 ? oddsP2 : 0;
  const potentialReturn =
    betAmount && selectedPlayer
      ? Math.round(Number(betAmount) * selectedOdds * 100) / 100
      : 0;

  const canBet =
    isLoggedIn &&
    match &&
    (match.status === "live" || match.status === "scheduled") &&
    match.player1Id &&
    match.player2Id;

  // ---- Handlers -------------------------------------------------------------
  const handlePlaceBet = () => {
    if (!match || !selectedPlayer || !betAmount) return;
    const amount = Number(betAmount);
    if (amount <= 0) return;

    const playerId =
      selectedPlayer === 1 ? match.player1Id : match.player2Id;
    const playerLabel =
      selectedPlayer === 1 ? player1Name : player2Name;

    if (!playerId) return;

    placeBet.mutate({
      matchId: match.id,
      tournamentId: match.tournamentId,
      betType: "winner",
      prediction: { winnerId: playerId, label: playerLabel },
      amount,
    });
  };

  // ---- Render ---------------------------------------------------------------

  // Invalid UUID
  if (!isValid) {
    return <MatchNotFound />;
  }

  // Loading
  if (matchQuery.isLoading) {
    return <MatchSkeleton />;
  }

  // Not found / error
  if (!match || matchQuery.isError) {
    return <MatchNotFound />;
  }

  const isCompleted = match.status === "completed";
  const isCancelled = match.status === "cancelled";
  const winnerName =
    match.winnerId === match.player1Id
      ? player1Name
      : match.winnerId === match.player2Id
        ? player2Name
        : null;

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* ===== Top bar ===== */}
      <div className="sticky top-0 z-40 bg-[#0A1628]/90 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/bets"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {player1Name} vs {player2Name}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {match.tournament?.name ?? "Torneio"} &middot; Round {match.round}
            </p>
          </div>
        </div>
      </div>

      {/* ===== Main content ===== */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* ===== Match Header Card ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-b from-slate-800/80 to-slate-900/50 border border-slate-700/50 rounded-2xl p-5 sm:p-6 space-y-5"
        >
          {/* Tournament + Sport + Status */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-slate-300">
                {match.tournament?.name}
              </p>
              {match.tournament?.sport && (
                <p className="text-xs text-slate-500">
                  {match.tournament.sport.name}
                </p>
              )}
            </div>
            <StatusBadge status={match.status} />
          </div>

          {/* Players + Score */}
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <PlayerCard
              player={match.player1}
              isWinner={isCompleted && match.winnerId === match.player1Id}
              side="left"
            />

            {/* Score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="order-2 flex items-center gap-2 sm:gap-3"
            >
              <span className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
                {match.score1 ?? 0}
              </span>
              <span className="text-lg sm:text-xl text-slate-500 font-light">
                x
              </span>
              <span className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
                {match.score2 ?? 0}
              </span>
            </motion.div>

            <PlayerCard
              player={match.player2}
              isWinner={isCompleted && match.winnerId === match.player2Id}
              side="right"
            />
          </div>

          {/* Scheduled date */}
          {match.status === "scheduled" && match.scheduledAt && (
            <p className="text-center text-xs text-slate-400">
              <Calendar className="inline w-3 h-3 mr-1 -mt-0.5" />
              {formatScheduledDate(match.scheduledAt)}
            </p>
          )}

          {/* Winner banner */}
          {isCompleted && winnerName && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
            >
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-400">
                Vencedor: {winnerName}
              </span>
            </motion.div>
          )}

          {/* Cancelled notice */}
          {isCancelled && (
            <div className="text-center py-2 px-4 rounded-xl bg-slate-700/30 border border-slate-600/30">
              <span className="text-sm text-slate-400">
                Esta partida foi cancelada
              </span>
            </div>
          )}
        </motion.div>

        {/* ===== Betting Section ===== */}
        {canBet ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 sm:p-6 space-y-5"
          >
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              Apostar no Vencedor
            </h2>

            {/* Player selection buttons */}
            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map((side) => {
                const pName = side === 1 ? player1Name : player2Name;
                const pOdds = side === 1 ? oddsP1 : oddsP2;
                const isSelected = selectedPlayer === side;

                return (
                  <button
                    key={side}
                    onClick={() =>
                      setSelectedPlayer(isSelected ? null : (side as 1 | 2))
                    }
                    className={`relative flex flex-col items-center gap-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.15)]"
                        : "border-slate-600 bg-slate-700/30 hover:border-slate-500 hover:bg-slate-700/50"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold truncate w-full text-center ${
                        isSelected ? "text-emerald-400" : "text-white"
                      }`}
                    >
                      {pName}
                    </span>
                    <span
                      className={`text-xs font-mono ${
                        oddsLoading
                          ? "text-slate-500"
                          : isSelected
                            ? "text-emerald-300"
                            : "text-slate-400"
                      }`}
                    >
                      {oddsLoading ? "..." : `${pOdds.toFixed(2)}x`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Amount input */}
            <AnimatePresence>
              {selectedPlayer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Quick amounts */}
                  <div className="flex flex-wrap gap-2">
                    {QUICK_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setBetAmount(String(amt))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          betAmount === String(amt)
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {amt} GC
                      </button>
                    ))}
                  </div>

                  {/* Custom amount input */}
                  <div className="relative">
                    <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      placeholder="Valor da aposta (GCoins)"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
                    />
                  </div>

                  {/* Balance + potential return */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Saldo:{" "}
                      <span className="text-white font-semibold">
                        {balanceQuery.data
                          ? `${balanceQuery.data.gamification.toLocaleString("pt-BR")} GC`
                          : "..."}
                      </span>
                    </span>
                    {potentialReturn > 0 && (
                      <span className="text-slate-400">
                        Retorno:{" "}
                        <span className="text-emerald-400 font-semibold">
                          {potentialReturn.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          GC
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Confirm button */}
                  <button
                    onClick={handlePlaceBet}
                    disabled={
                      !betAmount ||
                      Number(betAmount) <= 0 ||
                      placeBet.isPending
                    }
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {placeBet.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      "CONFIRMAR APOSTA"
                    )}
                  </button>

                  {/* Error message */}
                  {placeBet.isError && (
                    <p className="text-xs text-red-400 text-center">
                      {placeBet.error.message}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : !isLoggedIn && !isCompleted && !isCancelled ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 sm:p-6 text-center space-y-3"
          >
            <p className="text-slate-400 text-sm">
              Faca login para apostar nesta partida
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-semibold hover:from-emerald-500 hover:to-emerald-400 transition-all"
            >
              Fazer Login
            </Link>
          </motion.div>
        ) : null}

        {/* ===== User's Bets on this Match ===== */}
        {matchBets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 sm:p-6 space-y-4"
          >
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Suas Apostas
            </h2>
            <div className="space-y-3">
              {matchBets.map((bet) => {
                const predLabel =
                  (bet.prediction as Record<string, unknown>)?.label ??
                  (bet.prediction as Record<string, unknown>)?.winnerId ??
                  "?";
                const result = bet.result ?? "pending";
                return (
                  <div
                    key={bet.id}
                    className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-700/30 border border-slate-600/30"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {resultIcons[result] ?? resultIcons.pending}
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {String(predLabel)}
                        </p>
                        <p className="text-xs text-slate-400">
                          {Number(bet.amount).toLocaleString("pt-BR")} GC
                          {bet.odds && (
                            <> &middot; {Number(bet.odds).toFixed(2)}x</>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p
                        className={`text-xs font-semibold ${
                          result === "won"
                            ? "text-emerald-400"
                            : result === "lost"
                              ? "text-red-400"
                              : "text-slate-400"
                        }`}
                      >
                        {resultLabels[result] ?? result}
                      </p>
                      {bet.potentialWin && (
                        <p className="text-xs text-slate-500">
                          Retorno:{" "}
                          {Number(bet.potentialWin).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          GC
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

