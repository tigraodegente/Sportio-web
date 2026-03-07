"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchResult {
  id: string;
  name: string;
  email: string;
}

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (toUserId: string, amount: number, type: "real" | "gamification") => void;
  isPending: boolean;
  error: string;
  searchResults: SearchResult[];
  isSearching: boolean;
  onSearch: (query: string) => void;
  realBalance: number;
  gamBalance: number;
}

export function TransferModal({
  isOpen,
  onClose,
  onTransfer,
  isPending,
  error,
  searchResults,
  isSearching,
  onSearch,
  realBalance,
  gamBalance,
}: TransferModalProps) {
  const [step, setStep] = useState<"search" | "confirm" | "success">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"real" | "gamification">("real");
  const [localError, setLocalError] = useState("");

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setSelectedUser(null);
    if (value.length >= 2) {
      onSearch(value);
    }
  }

  function handleSelectUser(user: SearchResult) {
    setSelectedUser(user);
    setSearchQuery(user.name);
  }

  function handleNext() {
    if (!selectedUser) {
      setLocalError("Selecione um destinatario");
      return;
    }
    const num = Number(amount);
    if (!num || num <= 0) {
      setLocalError("Informe um valor valido");
      return;
    }
    const bal = type === "real" ? realBalance : gamBalance;
    if (num > bal) {
      setLocalError("Saldo insuficiente");
      return;
    }
    setLocalError("");
    setStep("confirm");
  }

  function handleConfirm() {
    if (!selectedUser) return;
    onTransfer(selectedUser.id, Number(amount), type);
  }

  function handleClose() {
    setStep("search");
    setSearchQuery("");
    setSelectedUser(null);
    setAmount("");
    setType("real");
    setLocalError("");
    onClose();
  }

  const displayError = error || localError;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Transferir GCoins" size="md">
      <AnimatePresence mode="wait">
        {step === "confirm" && selectedUser ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-5"
          >
            <div className="text-center py-4">
              <p className="text-sm text-slate-500 mb-2">Confirmar transferencia</p>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold mx-auto mb-1">
                    Eu
                  </div>
                  <p className="text-xs text-slate-500">Voce</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400" />
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold mx-auto mb-1">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <p className="text-xs text-slate-500 max-w-[100px] truncate">{selectedUser.name}</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {Number(amount).toLocaleString("pt-BR")} GC
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {type === "real" ? "GCoins Reais" : "GCoins Gamificacao"}
              </p>
            </div>

            {displayError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="text-sm">{displayError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button size="lg" variant="outline" className="flex-1" onClick={() => setStep("search")}>
                Voltar
              </Button>
              <Button size="lg" className="flex-1" onClick={handleConfirm} loading={isPending}>
                <Send className="w-4 h-4" />
                Confirmar
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="search"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            className="space-y-5"
          >
            {/* User search */}
            <Input
              label="Email ou nome do destinatario"
              placeholder="Buscar usuario..."
              icon={<Search className="w-4 h-4" />}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />

            {/* Search results dropdown */}
            {searchQuery.length >= 2 && !selectedUser && (
              <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl">
                {isSearching ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  </div>
                ) : searchResults.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">Nenhum usuario encontrado</p>
                ) : (
                  searchResults.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleSelectUser(u)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {u.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
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

            {/* Selected user chip */}
            {selectedUser && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200/60">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {selectedUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{selectedUser.name}</p>
                  <p className="text-xs text-slate-500">{selectedUser.email}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setSearchQuery("");
                  }}
                  className="text-xs text-slate-400 hover:text-red-500 transition-colors font-medium"
                >
                  Alterar
                </button>
              </div>
            )}

            {/* GCoin type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de GCoin</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setType("real")}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    type === "real"
                      ? "bg-blue-100 text-blue-700 ring-2 ring-blue-500/30"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  Real ({realBalance.toLocaleString("pt-BR")} GC)
                </button>
                <button
                  onClick={() => setType("gamification")}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    type === "gamification"
                      ? "bg-amber-100 text-amber-700 ring-2 ring-amber-500/30"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  Game ({gamBalance.toLocaleString("pt-BR")} GC)
                </button>
              </div>
            </div>

            {/* Amount */}
            <Input
              label="Quantidade"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setLocalError("");
              }}
            />

            {displayError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="text-sm">{displayError}</p>
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={handleNext}
              disabled={!selectedUser || !amount}
            >
              <Send className="w-5 h-5" />
              Continuar
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
