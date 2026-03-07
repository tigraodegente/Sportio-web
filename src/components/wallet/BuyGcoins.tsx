"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  QrCode,
  Star,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
  FileText,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BuyGcoinsProps {
  onBuy: (amount: number, method: "pix" | "credit_card" | "debit_card" | "boleto") => void;
  isPending: boolean;
  isSuccess: boolean;
  error: string;
  onReset: () => void;
}

const packages = [
  { amount: 100, price: 10, perUnit: 0.1, discount: 0, label: null },
  { amount: 500, price: 45, perUnit: 0.09, discount: 10, label: "Popular" },
  { amount: 1000, price: 80, perUnit: 0.08, discount: 20, label: "Melhor Custo" },
  { amount: 5000, price: 350, perUnit: 0.07, discount: 30, label: "Maximo" },
];

const paymentMethods = [
  { id: "pix" as const, label: "PIX", desc: "Instantaneo", icon: QrCode, color: "green" },
  { id: "credit_card" as const, label: "Cartao", desc: "Credito/Debito", icon: CreditCard, color: "blue" },
  { id: "boleto" as const, label: "Boleto", desc: "1-2 dias uteis", icon: FileText, color: "slate" },
];

export function BuyGcoins({ onBuy, isPending, isSuccess, error, onReset }: BuyGcoinsProps) {
  const [selectedPkg, setSelectedPkg] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState<"pix" | "credit_card" | "debit_card" | "boleto">("pix");

  const activeAmount = selectedPkg ?? (Number(customAmount) || 0);
  const activePrice = selectedPkg
    ? packages.find((p) => p.amount === selectedPkg)?.price ?? activeAmount * 0.1
    : activeAmount * 0.1;

  function handleConfirm() {
    if (activeAmount < 50) return;
    onBuy(activeAmount, method);
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
          <h3 className="text-lg font-bold text-slate-900 mb-2">Compra Realizada!</h3>
          <p className="text-sm text-slate-500 mb-6">
            {activeAmount.toLocaleString("pt-BR")} GCoins foram adicionados ao seu saldo.
          </p>
          <Button variant="outline" onClick={onReset}>
            Nova Compra
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <CardTitle>Comprar GCoins</CardTitle>
        </div>

        {/* Package selection */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {packages.map((pkg) => (
            <motion.button
              key={pkg.amount}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedPkg(pkg.amount);
                setCustomAmount("");
              }}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                selectedPkg === pkg.amount
                  ? "border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20"
                  : "border-slate-200 hover:border-blue-300 hover:shadow-md"
              }`}
            >
              {pkg.label && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-amber-400 text-white text-[10px] font-bold rounded-full shadow-sm flex items-center gap-1 whitespace-nowrap">
                  {pkg.amount === 500 && <Star className="w-2.5 h-2.5 fill-current" />}
                  {pkg.amount === 1000 && <Zap className="w-2.5 h-2.5" />}
                  {pkg.label}
                </span>
              )}
              <p className={`text-xl font-bold ${selectedPkg === pkg.amount ? "text-blue-700" : "text-slate-900"}`}>
                {pkg.amount.toLocaleString("pt-BR")} GC
              </p>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                R$ {pkg.price.toFixed(2).replace(".", ",")}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                R${pkg.perUnit.toFixed(2).replace(".", ",")}/GC
              </p>
              {pkg.discount > 0 && (
                <span className="inline-block mt-1.5 px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-full">
                  -{pkg.discount}%
                </span>
              )}
              {selectedPkg === pkg.amount && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-400 font-medium">ou valor personalizado</span>
          </div>
        </div>

        <Input
          label="Quantidade personalizada (min. 50)"
          type="number"
          placeholder="Ex: 300"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setSelectedPkg(null);
          }}
          className="mb-5"
        />

        {/* Payment method */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">Forma de Pagamento</label>
          <div className="grid grid-cols-3 gap-3">
            {paymentMethods.map((pm) => {
              const Icon = pm.icon;
              const isActive = method === pm.id;
              return (
                <button
                  key={pm.id}
                  onClick={() => setMethod(pm.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    isActive
                      ? `border-${pm.color}-500 bg-${pm.color}-50 ring-2 ring-${pm.color}-500/20`
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? `text-${pm.color}-600` : "text-slate-400"}`} />
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${isActive ? `text-${pm.color}-700` : "text-slate-700"}`}>
                      {pm.label}
                    </p>
                    <p className="text-[10px] text-slate-400">{pm.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <AnimatePresence>
          {activeAmount >= 50 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50 space-y-2 mb-5"
            >
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">GCoins:</span>
                <span className="font-bold text-slate-900">{activeAmount.toLocaleString("pt-BR")} GC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total a pagar:</span>
                <span className="font-bold text-blue-700">
                  R$ {activePrice.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Pagamento simulado — credito instantaneo
              </p>
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

        {/* Confirm */}
        <Button
          size="lg"
          className="w-full"
          onClick={handleConfirm}
          disabled={isPending || activeAmount < 50}
          loading={isPending}
        >
          {method === "pix" ? <QrCode className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
          {isPending
            ? "Processando..."
            : `Comprar ${activeAmount >= 50 ? activeAmount.toLocaleString("pt-BR") : ""} GCoins`}
        </Button>
      </Card>
    </motion.div>
  );
}
