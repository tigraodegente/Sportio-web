"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Send, CreditCard, TrendingUp, History, Plus, Search, User, Star, Loader2, AlertCircle, Coins, Banknote, QrCode, CheckCircle2, Clock, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { StatsCard } from "@/components/ui/stats-card";
import { trpc } from "@/lib/trpc";

const categoryLabels: Record<string, string> = {
  tournament_prize: "Premio",
  tournament_entry: "Inscricao",
  bet_win: "Palpite Ganho",
  bet_place: "Palpite",
  purchase: "Compra",
  transfer: "Transferencia",
  daily_bonus: "Bonus Diario",
  referral_bonus: "Indicacao",
  challenge_reward: "Desafio",
  achievement: "Conquista",
  brand_reward: "Marca",
  withdrawal: "Saque",
};

function formatNumber(n: number): string {
  return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr: string | Date): { date: string; time: string } {
  const d = new Date(dateStr);
  const date = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return { date, time };
}

export default function GCoinsPage() {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card">("pix");
  const [buyStep, setBuyStep] = useState<"select" | "processing" | "success">("select");
  const [buyError, setBuyError] = useState("");
  const [transferSearch, setTransferSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; email: string; avatar: string } | null>(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferType, setTransferType] = useState<"real" | "gamification">("real");
  const [transferError, setTransferError] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // tRPC queries
  const balance = trpc.gcoin.balance.useQuery();
  const summary = trpc.gcoin.summary.useQuery();
  const history = trpc.gcoin.history.useQuery({ limit: 20 });
  const myWithdrawals = trpc.payment.myWithdrawals.useQuery({ limit: 5 });
  const myOrders = trpc.payment.myOrders.useQuery({ limit: 5 });

  // User search for transfer
  const userSearchResults = trpc.user.search.useQuery(
    { query: transferSearch, limit: 10 },
    { enabled: transferSearch.length >= 2 && !selectedUser }
  );

  // tRPC mutations
  const transfer = trpc.gcoin.transfer.useMutation({
    onSuccess: () => {
      balance.refetch();
      history.refetch();
      summary.refetch();
      setShowTransferModal(false);
      resetTransferForm();
    },
    onError: (error) => {
      setTransferError(error.message);
    },
  });

  const quickBuy = trpc.payment.quickBuy.useMutation({
    onSuccess: () => {
      setBuyStep("success");
      balance.refetch();
      history.refetch();
      summary.refetch();
      myOrders.refetch();
    },
    onError: (error) => {
      setBuyError(error.message);
      setBuyStep("select");
    },
  });

  const requestWithdrawal = trpc.payment.requestWithdrawal.useMutation({
    onSuccess: () => {
      setWithdrawSuccess(true);
      balance.refetch();
      history.refetch();
      summary.refetch();
      myWithdrawals.refetch();
      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawSuccess(false);
        setWithdrawAmount("");
      }, 3000);
    },
    onError: (error) => {
      setWithdrawError(error.message);
    },
  });

  const buyAmounts = [100, 250, 500, 1000, 2500, 5000];

  function handleBuy() {
    const amount = selectedAmount ?? Number(customAmount);
    if (!amount || amount < 50) {
      setBuyError("Valor minimo: 50 GCoins");
      return;
    }
    setBuyError("");
    setBuyStep("processing");
    quickBuy.mutate({ gcoinAmount: amount, method: paymentMethod });
  }

  function resetBuyModal() {
    setSelectedAmount(null);
    setCustomAmount("");
    setPaymentMethod("pix");
    setBuyStep("select");
    setBuyError("");
  }

  function handleWithdraw() {
    const amount = Number(withdrawAmount);
    if (!amount || amount < 100) {
      setWithdrawError("Valor minimo: 100 GCoins");
      return;
    }
    setWithdrawError("");
    requestWithdrawal.mutate({ gcoinAmount: amount });
  }

  function resetTransferForm() {
    setTransferSearch("");
    setSelectedUser(null);
    setTransferAmount("");
    setTransferType("real");
    setTransferError("");
  }

  function handleTransfer() {
    if (!selectedUser) {
      setTransferError("Selecione um destinatario");
      return;
    }
    const amount = Number(transferAmount);
    if (!amount || amount <= 0) {
      setTransferError("Informe um valor valido");
      return;
    }
    setTransferError("");
    transfer.mutate({
      toUserId: selectedUser.id,
      amount,
      type: transferType,
    });
  }

  const isLoading = balance.isLoading || summary.isLoading || history.isLoading;
  const hasError = balance.isError || summary.isError || history.isError;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">GCoins</h1>
        <p className="text-sm sm:text-base text-slate-500 mt-1">Gerencie sua carteira de GCoins</p>
      </div>

      {/* Error Banner */}
      {hasError && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Erro ao carregar dados</p>
            <p className="text-xs mt-0.5">
              {balance.error?.message || summary.error?.message || history.error?.message || "Tente novamente mais tarde."}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="ml-auto shrink-0"
            onClick={() => {
              balance.refetch();
              summary.refetch();
              history.refetch();
            }}
          >
            Tentar novamente
          </Button>
        </div>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Real GCoins Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white border-0">
          {/* Decorative blur circles */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-400/15 rounded-full blur-2xl" />
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full blur-xl" />
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          <div className="relative">
            <p className="text-blue-200 text-xs sm:text-sm font-medium">GCoins Reais</p>
            {balance.isLoading ? (
              <div className="flex items-center gap-2 mt-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-200" />
              </div>
            ) : (
              <p className="text-3xl sm:text-4xl font-bold mt-1 tracking-tight">
                {formatNumber(balance.data?.real ?? 0)}
              </p>
            )}
            <p className="text-blue-300/80 text-xs mt-2">Saque disponivel via PIX</p>
          </div>
        </Card>

        {/* Gamification GCoins Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white border-0">
          {/* Decorative blur circles */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-300/15 rounded-full blur-2xl" />
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full blur-xl" />
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          <div className="relative">
            <p className="text-amber-200 text-xs sm:text-sm font-medium">GCoins Gamificacao</p>
            {balance.isLoading ? (
              <div className="flex items-center gap-2 mt-2">
                <Loader2 className="w-5 h-5 animate-spin text-amber-200" />
              </div>
            ) : (
              <p className="text-3xl sm:text-4xl font-bold mt-1 tracking-tight">
                {formatNumber(balance.data?.gamification ?? 0)}
              </p>
            )}
            <p className="text-amber-300/80 text-xs mt-2">Uso em palpites e desafios</p>
          </div>
        </Card>

        {/* Total Balance Card - with gradient border effect */}
        <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-blue-400 via-blue-500 to-amber-400">
          <div className="rounded-[14px] bg-white p-5 sm:p-6 h-full">
            <p className="text-slate-500 text-xs sm:text-sm font-medium">Saldo Total</p>
            {balance.isLoading ? (
              <div className="flex items-center gap-2 mt-2">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            ) : (
              <p className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1 tracking-tight">
                {formatNumber(balance.data?.total ?? 0)}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              <Button size="sm" onClick={() => { resetBuyModal(); setShowBuyModal(true); }}>
                <Plus className="w-4 h-4" />
                Comprar
              </Button>
              <Button size="sm" variant="outline" onClick={() => { resetTransferForm(); setShowTransferModal(true); }}>
                <Send className="w-4 h-4" />
                Transferir
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setWithdrawAmount(""); setWithdrawError(""); setWithdrawSuccess(false); setShowWithdrawModal(true); }}>
                <Banknote className="w-4 h-4" />
                Sacar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {summary.isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative bg-white rounded-xl border border-slate-100 p-4 sm:p-5 flex items-center justify-center min-h-[100px]">
                <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
              </div>
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="Total Ganho"
              value={formatNumber(summary.data?.totalEarned ?? 0)}
              changeType="positive"
              change="GCoins recebidos"
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <StatsCard
              title="Total Gasto"
              value={formatNumber(summary.data?.totalSpent ?? 0)}
              changeType="negative"
              change="Em inscricoes e palpites"
              icon={<ArrowDownRight className="w-5 h-5" />}
            />
            <StatsCard
              title="Saldo Liquido"
              value={formatNumber((summary.data?.totalEarned ?? 0) - (summary.data?.totalSpent ?? 0))}
              changeType={(summary.data?.totalEarned ?? 0) - (summary.data?.totalSpent ?? 0) >= 0 ? "positive" : "negative"}
              change="Ganho - Gasto"
              icon={<Send className="w-5 h-5" />}
            />
            <StatsCard
              title="Transacoes"
              value={summary.data?.transactionCount ?? 0}
              changeType="neutral"
              change="Total de transacoes"
              icon={<History className="w-5 h-5" />}
            />
          </>
        )}
      </div>

      {/* Transaction History */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Historico de Transacoes</CardTitle>
        </div>

        {history.isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
            <p className="text-sm text-slate-400">Carregando transacoes...</p>
          </div>
        ) : history.isError ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
            <p className="text-sm text-red-500 font-medium">Erro ao carregar transacoes</p>
            <p className="text-xs text-slate-400 mt-1">{history.error?.message}</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => history.refetch()}>
              Tentar novamente
            </Button>
          </div>
        ) : (
          <Tabs
            tabs={[
              { id: "all", label: "Todas" },
              { id: "real", label: "Reais" },
              { id: "gamification", label: "Gamificacao" },
            ]}
          >
            {(tab) => {
              const filtered = (history.data?.items ?? []).filter(
                (t) => tab === "all" || t.type === tab
              );

              if (filtered.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Coins className="w-10 h-10 text-slate-200 mb-3" />
                    <p className="text-sm font-medium text-slate-400">Nenhuma transacao encontrada</p>
                    <p className="text-xs text-slate-300 mt-1">
                      {tab === "all"
                        ? "Suas transacoes aparecerão aqui"
                        : tab === "real"
                          ? "Nenhuma transacao com GCoins reais"
                          : "Nenhuma transacao de gamificacao"}
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-2">
                  {filtered.map((tx) => {
                    const { date, time } = formatDate(tx.createdAt);
                    return (
                      <div
                        key={tx.id}
                        className={`flex items-center justify-between py-3 px-3 sm:px-4 rounded-xl transition-all duration-200 hover:bg-slate-50/80 group border-l-[3px] ${
                          Number(tx.amount) > 0
                            ? "border-l-blue-500"
                            : "border-l-red-400"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                              Number(tx.amount) > 0 ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            {Number(tx.amount) > 0 ? (
                              <ArrowUpRight className="w-5 h-5 text-green-600" />
                            ) : (
                              <ArrowDownRight className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{tx.description}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant={Number(tx.amount) > 0 ? "primary" : "danger"} className="text-[10px] px-1.5 py-0">
                                {categoryLabels[tx.category] || tx.category}
                              </Badge>
                              <span className="text-[11px] text-slate-400 font-medium">{date}</span>
                              <span className="text-[10px] text-slate-300">|</span>
                              <span className="text-[11px] text-slate-400">{time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p
                            className={`text-sm font-bold tracking-tight ${
                              Number(tx.amount) > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {Number(tx.amount) > 0 ? "+" : ""}{tx.amount.toLocaleString()} GC
                          </p>
                          <Badge variant={tx.type === "real" ? "primary" : "accent"} className="text-[10px] mt-0.5">
                            {tx.type === "real" ? "Real" : "Game"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }}
          </Tabs>
        )}
      </Card>

      {/* Buy Modal */}
      <Modal isOpen={showBuyModal} onClose={() => { setShowBuyModal(false); resetBuyModal(); }} title="Comprar GCoins">
        {buyStep === "success" ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Compra Realizada!</h3>
            <p className="text-sm text-slate-500 text-center">
              {selectedAmount ?? customAmount} GCoins foram adicionados ao seu saldo.
            </p>
            <Button onClick={() => { setShowBuyModal(false); resetBuyModal(); }}>
              Fechar
            </Button>
          </div>
        ) : buyStep === "processing" ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <p className="text-sm text-slate-500">Processando pagamento...</p>
            <p className="text-xs text-slate-400">
              {paymentMethod === "pix" ? "Simulando PIX..." : "Simulando cartao..."}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-sm text-slate-500">Selecione o valor que deseja comprar:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {buyAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => { setSelectedAmount(amount); setCustomAmount(""); }}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-center group ${
                    selectedAmount === amount
                      ? "border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20"
                      : "border-slate-200 hover:border-blue-400 hover:shadow-md hover:shadow-blue-500/5"
                  }`}
                >
                  {amount === 500 && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-amber-400 text-white text-[10px] font-bold rounded-full shadow-sm shadow-amber-500/30 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      Popular
                    </span>
                  )}
                  <p className={`text-xl font-bold transition-colors ${
                    selectedAmount === amount ? "text-blue-700" : "text-slate-900 group-hover:text-blue-700"
                  }`}>
                    {amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">R$ {(amount * 0.1).toFixed(2)}</p>
                  {selectedAmount === amount && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-medium">ou</span>
              </div>
            </div>

            <Input
              label="Valor personalizado (min. 50)"
              type="number"
              placeholder="Quantidade de GCoins"
              value={customAmount}
              onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
            />

            {/* Payment Method Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Forma de Pagamento</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod("pix")}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    paymentMethod === "pix"
                      ? "border-green-500 bg-green-50 ring-2 ring-green-500/20"
                      : "border-slate-200 hover:border-green-400"
                  }`}
                >
                  <QrCode className={`w-5 h-5 ${paymentMethod === "pix" ? "text-green-600" : "text-slate-400"}`} />
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${paymentMethod === "pix" ? "text-green-700" : "text-slate-700"}`}>PIX</p>
                    <p className="text-[10px] text-slate-400">Instantaneo</p>
                  </div>
                </button>
                <button
                  onClick={() => setPaymentMethod("credit_card")}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    paymentMethod === "credit_card"
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20"
                      : "border-slate-200 hover:border-blue-400"
                  }`}
                >
                  <CreditCard className={`w-5 h-5 ${paymentMethod === "credit_card" ? "text-blue-600" : "text-slate-400"}`} />
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${paymentMethod === "credit_card" ? "text-blue-700" : "text-slate-700"}`}>Cartao</p>
                    <p className="text-[10px] text-slate-400">Credito/Debito</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">GCoins:</span>
                <span className="font-bold text-slate-900">
                  {(selectedAmount ?? (Number(customAmount) || 0)).toLocaleString()} GC
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total a pagar:</span>
                <span className="font-bold text-blue-700">
                  R$ {((selectedAmount ?? (Number(customAmount) || 0)) * 0.1).toFixed(2)}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Pagamento simulado — credito instantaneo
              </p>
            </div>

            {buyError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="text-sm">{buyError}</p>
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={handleBuy}
              disabled={quickBuy.isPending || (!(selectedAmount) && !(Number(customAmount) >= 50))}
            >
              {paymentMethod === "pix" ? <QrCode className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
              {paymentMethod === "pix" ? "Pagar com PIX" : "Pagar com Cartao"}
            </Button>
          </div>
        )}
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => { setShowWithdrawModal(false); setWithdrawSuccess(false); }}
        title="Solicitar Saque"
      >
        {withdrawSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Saque Solicitado!</h3>
            <p className="text-sm text-slate-500 text-center">
              Sua solicitacao foi enviada e sera processada em breve.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200/50">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">Saldo disponivel para saque</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {formatNumber(balance.data?.real ?? 0)} GCoins Reais
              </p>
            </div>

            <Input
              label="Quantidade de GCoins para sacar (min. 100)"
              type="number"
              placeholder="Ex: 500"
              value={withdrawAmount}
              onChange={(e) => { setWithdrawAmount(e.target.value); setWithdrawError(""); }}
            />

            {Number(withdrawAmount) >= 100 && (
              <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-200/50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Valor solicitado:</span>
                  <span className="font-bold text-slate-900">{Number(withdrawAmount).toLocaleString()} GC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Taxa (5%):</span>
                  <span className="text-red-600">-{Math.ceil(Number(withdrawAmount) * 0.05)} GC</span>
                </div>
                <div className="flex justify-between text-sm border-t border-amber-300/50 pt-2">
                  <span className="text-slate-600">Voce recebe via PIX:</span>
                  <span className="font-bold text-green-700">
                    R$ {((Number(withdrawAmount) - Math.ceil(Number(withdrawAmount) * 0.05)) * 0.1).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {withdrawError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="text-sm">{withdrawError}</p>
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={handleWithdraw}
              disabled={requestWithdrawal.isPending || Number(withdrawAmount) < 100}
            >
              {requestWithdrawal.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Banknote className="w-5 h-5" />
              )}
              {requestWithdrawal.isPending ? "Processando..." : "Solicitar Saque via PIX"}
            </Button>
          </div>
        )}
      </Modal>

      {/* Transfer Modal */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => {
          setShowTransferModal(false);
          resetTransferForm();
        }}
        title="Transferir GCoins"
      >
        <div className="space-y-5">
          <Input
            label="Email ou nome do destinatario"
            placeholder="Buscar usuario..."
            icon={<Search className="w-4 h-4" />}
            value={transferSearch}
            onChange={(e) => {
              setTransferSearch(e.target.value);
              setSelectedUser(null);
              setTransferError("");
            }}
          />

          {/* Search results */}
          {transferSearch.length >= 2 && !selectedUser && (
            <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl">
              {userSearchResults.isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                </div>
              ) : !userSearchResults.data?.items?.length ? (
                <p className="text-sm text-slate-400 text-center py-4">Nenhum usuario encontrado</p>
              ) : (
                userSearchResults.data.items.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setSelectedUser({
                        id: u.id,
                        name: u.name,
                        email: u.email,
                        avatar: u.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "",
                      });
                      setTransferSearch(u.name);
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {u.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">{u.name}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Selected user preview */}
          {selectedUser && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200/60">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {selectedUser.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{selectedUser.name}</p>
                <p className="text-xs text-slate-500">{selectedUser.email}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setTransferSearch("");
                }}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors font-medium"
              >
                Alterar
              </button>
            </div>
          )}

          {/* Transfer type selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de GCoin</label>
            <div className="flex gap-2">
              <button
                onClick={() => setTransferType("real")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  transferType === "real"
                    ? "bg-blue-100 text-blue-700 ring-2 ring-blue-500/30"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                Real
              </button>
              <button
                onClick={() => setTransferType("gamification")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  transferType === "gamification"
                    ? "bg-amber-100 text-amber-700 ring-2 ring-amber-500/30"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                Gamificacao
              </button>
            </div>
          </div>

          <Input
            label="Quantidade"
            type="number"
            placeholder="0"
            value={transferAmount}
            onChange={(e) => {
              setTransferAmount(e.target.value);
              setTransferError("");
            }}
          />
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
            Taxa de transferencia: 0 GCoins
          </p>

          {/* Transfer error message */}
          {transferError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-sm">{transferError}</p>
            </div>
          )}

          <Button
            size="lg"
            className="w-full"
            onClick={handleTransfer}
            disabled={transfer.isPending || !selectedUser || !transferAmount}
          >
            {transfer.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {transfer.isPending ? "Transferindo..." : "Transferir"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
