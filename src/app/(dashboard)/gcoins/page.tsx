"use client";

import { useState, useCallback } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

import { BalanceCard } from "@/components/wallet/BalanceCard";
import { MonthlySummary } from "@/components/wallet/MonthlySummary";
import { BalanceChart } from "@/components/wallet/BalanceChart";
import { BuyGcoins } from "@/components/wallet/BuyGcoins";
import { WithdrawSection } from "@/components/wallet/WithdrawSection";
import { TransactionHistory } from "@/components/wallet/TransactionHistory";
import { TransferModal } from "@/components/wallet/TransferModal";

export default function GCoinsPage() {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferSearch, setTransferSearch] = useState("");
  const [transferError, setTransferError] = useState("");
  const [buyError, setBuyError] = useState("");
  const [buySuccess, setBuySuccess] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // tRPC queries
  const balance = trpc.gcoin.balance.useQuery();
  const summary = trpc.gcoin.summary.useQuery();
  const history = trpc.gcoin.history.useQuery({ limit: 50 });

  // User search for transfers
  const userSearchResults = trpc.user.search.useQuery(
    { query: transferSearch, limit: 10 },
    { enabled: transferSearch.length >= 2 }
  );

  const refetchAll = useCallback(() => {
    balance.refetch();
    summary.refetch();
    history.refetch();
  }, [balance, summary, history]);

  // Mutations
  const quickBuy = trpc.payment.quickBuy.useMutation({
    onSuccess: () => {
      setBuySuccess(true);
      setBuyError("");
      refetchAll();
    },
    onError: (error) => {
      setBuyError(error.message);
    },
  });

  const requestWithdrawal = trpc.payment.requestWithdrawal.useMutation({
    onSuccess: () => {
      setWithdrawSuccess(true);
      setWithdrawError("");
      refetchAll();
    },
    onError: (error) => {
      setWithdrawError(error.message);
    },
  });

  const transfer = trpc.gcoin.transfer.useMutation({
    onSuccess: () => {
      setShowTransferModal(false);
      setTransferError("");
      setTransferSearch("");
      refetchAll();
    },
    onError: (error) => {
      setTransferError(error.message);
    },
  });

  const hasError = balance.isError || summary.isError || history.isError;

  function handleBuy(amount: number, method: "pix" | "credit_card" | "debit_card" | "boleto") {
    setBuyError("");
    setBuySuccess(false);
    quickBuy.mutate({ gcoinAmount: amount, method });
  }

  function handleWithdraw(amount: number) {
    setWithdrawError("");
    setWithdrawSuccess(false);
    requestWithdrawal.mutate({ gcoinAmount: amount });
  }

  function handleTransfer(toUserId: string, amount: number, type: "real" | "gamification") {
    setTransferError("");
    transfer.mutate({ toUserId, amount, type });
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Carteira GCoins</h1>
        <p className="text-sm sm:text-base text-slate-500 mt-1">Gerencie, compre e saque seus GCoins</p>
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
          <Button size="sm" variant="outline" className="ml-auto shrink-0" onClick={refetchAll}>
            Tentar novamente
          </Button>
        </div>
      )}

      {/* 1. Balance Hero Card */}
      <BalanceCard
        real={balance.data?.real ?? 0}
        gamification={balance.data?.gamification ?? 0}
        total={balance.data?.total ?? 0}
        isLoading={balance.isLoading}
        onBuy={() => {
          setBuySuccess(false);
          setBuyError("");
          // Scroll to buy section
          document.getElementById("buy-section")?.scrollIntoView({ behavior: "smooth" });
        }}
        onWithdraw={() => {
          setWithdrawSuccess(false);
          setWithdrawError("");
          document.getElementById("withdraw-section")?.scrollIntoView({ behavior: "smooth" });
        }}
        onTransfer={() => {
          setTransferSearch("");
          setTransferError("");
          setShowTransferModal(true);
        }}
      />

      {/* 2. Monthly Summary Stats */}
      <MonthlySummary
        totalEarned={summary.data?.totalEarned ?? 0}
        totalSpent={summary.data?.totalSpent ?? 0}
        transactionCount={summary.data?.transactionCount ?? 0}
        isLoading={summary.isLoading}
      />

      {/* 3. Balance Evolution Chart */}
      {history.data?.items && history.data.items.length > 0 && (
        <BalanceChart
          transactions={history.data.items}
          currentReal={balance.data?.real ?? 0}
          currentGamification={balance.data?.gamification ?? 0}
        />
      )}

      {/* 4. Buy GCoins Section */}
      <div id="buy-section">
        <BuyGcoins
          onBuy={handleBuy}
          isPending={quickBuy.isPending}
          isSuccess={buySuccess}
          error={buyError}
          onReset={() => {
            setBuySuccess(false);
            setBuyError("");
          }}
        />
      </div>

      {/* 5. Withdraw Section */}
      <div id="withdraw-section">
        <WithdrawSection
          realBalance={balance.data?.real ?? 0}
          onWithdraw={handleWithdraw}
          isPending={requestWithdrawal.isPending}
          isSuccess={withdrawSuccess}
          error={withdrawError}
          onReset={() => {
            setWithdrawSuccess(false);
            setWithdrawError("");
          }}
        />
      </div>

      {/* 6. Transaction History */}
      <TransactionHistory
        transactions={history.data?.items ?? []}
        isLoading={history.isLoading}
        isError={history.isError}
        errorMessage={history.error?.message}
        onRefetch={() => history.refetch()}
        hasMore={!!history.data?.nextCursor}
      />

      {/* 7. Transfer Modal */}
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => {
          setShowTransferModal(false);
          setTransferError("");
          setTransferSearch("");
        }}
        onTransfer={handleTransfer}
        isPending={transfer.isPending}
        error={transferError}
        searchResults={userSearchResults.data?.items ?? []}
        isSearching={userSearchResults.isLoading}
        onSearch={setTransferSearch}
        realBalance={balance.data?.real ?? 0}
        gamBalance={balance.data?.gamification ?? 0}
      />
    </div>
  );
}
