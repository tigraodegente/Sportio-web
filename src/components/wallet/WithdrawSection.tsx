"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Banknote, Wallet, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WithdrawSectionProps {
  realBalance: number;
  onWithdraw: (amount: number) => void;
  isPending: boolean;
  isSuccess: boolean;
  error: string;
  onReset: () => void;
}

const FEE_PCT = 0.05;

export function WithdrawSection({
  realBalance,
  onWithdraw,
  isPending,
  isSuccess,
  error,
  onReset,
}: WithdrawSectionProps) {
  const [amount, setAmount] = useState("");

  const numAmount = Number(amount) || 0;
  const fee = Math.ceil(numAmount * FEE_PCT);
  const netGcoins = numAmount - fee;
  const brlReceive = netGcoins * 0.1;
  const isValid = numAmount >= 100 && numAmount <= realBalance;

  function handleSubmit() {
    if (!isValid) return;
    onWithdraw(numAmount);
  }

  function handleMax() {
    setAmount(String(Math.floor(realBalance)));
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="text-center py-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </motion.div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Saque Solicitado!</h3>
          <p className="text-sm text-slate-500 mb-6">
            Sua solicitacao sera processada em breve.
          </p>
          <Button variant="outline" onClick={onReset}>
            Novo Saque
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <Banknote className="w-5 h-5 text-green-600" />
          <CardTitle>Sacar via PIX</CardTitle>
        </div>

        {/* Available balance */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200/50 mb-5">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Saldo disponivel</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {realBalance.toLocaleString("pt-BR")} GCoins Reais
          </p>
        </div>

        {/* Amount input with MAX button */}
        <div className="relative mb-4">
          <Input
            label="Quantidade de GCoins para sacar (min. 100)"
            type="number"
            placeholder="Ex: 500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            onClick={handleMax}
            className="absolute right-2 top-8 px-2 py-1 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors uppercase"
          >
            Max
          </button>
        </div>

        {/* Fee breakdown */}
        <AnimatePresence>
          {numAmount >= 100 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-200/50 space-y-2 mb-5"
            >
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Valor solicitado:</span>
                <span className="font-bold text-slate-900">{numAmount.toLocaleString("pt-BR")} GC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Taxa (5%):</span>
                <span className="text-red-600">-{fee} GC</span>
              </div>
              <div className="flex justify-between text-sm border-t border-amber-300/50 pt-2">
                <span className="text-slate-600">Voce recebe via PIX:</span>
                <span className="font-bold text-green-700">
                  R$ {brlReceive.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <Button
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          disabled={isPending || !isValid}
          loading={isPending}
        >
          <Banknote className="w-5 h-5" />
          {isPending ? "Processando..." : "Solicitar Saque via PIX"}
        </Button>
      </Card>
    </motion.div>
  );
}
