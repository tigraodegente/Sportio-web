"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Send, CreditCard, TrendingUp, History, Plus, Search, User, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { StatsCard } from "@/components/ui/stats-card";

const transactions = [
  { id: "1", category: "tournament_prize", description: "Premio - Copa Beach Tennis SP", amount: 2500, type: "real", date: "15 Mar 2025", time: "14:32" },
  { id: "2", category: "bet_place", description: "Palpite - Team Alpha vs Beta", amount: -50, type: "gamification", date: "14 Mar 2025", time: "09:15" },
  { id: "3", category: "bet_win", description: "Palpite ganho - Player A vs B", amount: 180, type: "gamification", date: "13 Mar 2025", time: "21:47" },
  { id: "4", category: "tournament_entry", description: "Inscricao - Liga CrossFit", amount: -100, type: "real", date: "12 Mar 2025", time: "16:03" },
  { id: "5", category: "daily_bonus", description: "Bonus diario", amount: 10, type: "gamification", date: "12 Mar 2025", time: "08:00" },
  { id: "6", category: "referral_bonus", description: "Indicacao - Rafael Costa", amount: 50, type: "gamification", date: "11 Mar 2025", time: "11:22" },
  { id: "7", category: "purchase", description: "Compra de GCoins", amount: 500, type: "real", date: "10 Mar 2025", time: "13:45" },
  { id: "8", category: "transfer", description: "Transferencia para Andre", amount: -100, type: "real", date: "9 Mar 2025", time: "17:30" },
];

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

const mockSearchUsers = [
  { id: "1", name: "Rafael Costa", email: "rafael@email.com", avatar: "RC" },
  { id: "2", name: "Andre Santos", email: "andre@email.com", avatar: "AS" },
  { id: "3", name: "Lucas Mendes", email: "lucas@email.com", avatar: "LM" },
];

export default function GCoinsPage() {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [transferSearch, setTransferSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<(typeof mockSearchUsers)[0] | null>(null);

  const buyAmounts = [100, 250, 500, 1000, 2500, 5000];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">GCoins</h1>
        <p className="text-sm sm:text-base text-slate-500 mt-1">Gerencie sua carteira de GCoins</p>
      </div>

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
            <p className="text-3xl sm:text-4xl font-bold mt-1 tracking-tight">1.250,00</p>
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
            <p className="text-3xl sm:text-4xl font-bold mt-1 tracking-tight">3.480,00</p>
            <p className="text-amber-300/80 text-xs mt-2">Uso em palpites e desafios</p>
          </div>
        </Card>

        {/* Total Balance Card - with gradient border effect */}
        <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-blue-400 via-blue-500 to-amber-400">
          <div className="rounded-[14px] bg-white p-5 sm:p-6 h-full">
            <p className="text-slate-500 text-xs sm:text-sm font-medium">Saldo Total</p>
            <p className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1 tracking-tight">4.730,00</p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={() => setShowBuyModal(true)}>
                <Plus className="w-4 h-4" />
                Comprar
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowTransferModal(true)}>
                <Send className="w-4 h-4" />
                Transferir
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard title="Ganho este mes" value="2.840" changeType="positive" change="+32% vs mes anterior" icon={<TrendingUp className="w-5 h-5" />} />
        <StatsCard title="Gasto este mes" value="250" changeType="negative" change="Em inscricoes e palpites" icon={<ArrowDownRight className="w-5 h-5" />} />
        <StatsCard title="Transferencias" value="3" changeType="neutral" change="Enviadas este mes" icon={<Send className="w-5 h-5" />} />
        <StatsCard title="Transacoes" value="24" changeType="neutral" change="Nos ultimos 30 dias" icon={<History className="w-5 h-5" />} />
      </div>

      {/* Transaction History */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Historico de Transacoes</CardTitle>
        </div>

        <Tabs
          tabs={[
            { id: "all", label: "Todas" },
            { id: "real", label: "Reais" },
            { id: "gamification", label: "Gamificacao" },
          ]}
        >
          {(tab) => (
            <div className="space-y-2">
              {transactions
                .filter((t) => tab === "all" || t.type === tab)
                .map((tx) => (
                  <div
                    key={tx.id}
                    className={`flex items-center justify-between py-3 px-3 sm:px-4 rounded-xl transition-all duration-200 hover:bg-slate-50/80 group border-l-[3px] ${
                      tx.amount > 0
                        ? "border-l-blue-500"
                        : "border-l-red-400"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                          tx.amount > 0 ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {tx.amount > 0 ? (
                          <ArrowUpRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{tx.description}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant={tx.amount > 0 ? "primary" : "danger"} className="text-[10px] px-1.5 py-0">
                            {categoryLabels[tx.category] || tx.category}
                          </Badge>
                          <span className="text-[11px] text-slate-400 font-medium">{tx.date}</span>
                          <span className="text-[10px] text-slate-300">|</span>
                          <span className="text-[11px] text-slate-400">{tx.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p
                        className={`text-sm font-bold tracking-tight ${
                          tx.amount > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()} GC
                      </p>
                      <Badge variant={tx.type === "real" ? "primary" : "accent"} className="text-[10px] mt-0.5">
                        {tx.type === "real" ? "Real" : "Game"}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Tabs>
      </Card>

      {/* Buy Modal */}
      <Modal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} title="Comprar GCoins">
        <div className="space-y-5">
          <p className="text-sm text-slate-500">Selecione o valor que deseja comprar:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {buyAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
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

          <Input label="Digite um valor personalizado" type="number" placeholder="Quantidade de GCoins" />

          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total a pagar:</span>
              <span className="font-bold text-blue-700">
                R$ {selectedAmount ? (selectedAmount * 0.1).toFixed(2) : "0,00"}
              </span>
            </div>
          </div>

          <Button size="lg" className="w-full">
            <CreditCard className="w-5 h-5" />
            Comprar com PIX
          </Button>
        </div>
      </Modal>

      {/* Transfer Modal */}
      <Modal isOpen={showTransferModal} onClose={() => setShowTransferModal(false)} title="Transferir GCoins">
        <div className="space-y-5">
          <Input
            label="Email ou nome do destinatario"
            placeholder="Buscar usuario..."
            icon={<Search className="w-4 h-4" />}
            value={transferSearch}
            onChange={(e) => {
              setTransferSearch(e.target.value);
              setSelectedUser(null);
            }}
          />

          {/* User search preview area */}
          {transferSearch.length > 0 && !selectedUser && (
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Resultados</p>
              </div>
              <div className="divide-y divide-slate-100">
                {mockSearchUsers
                  .filter(
                    (u) =>
                      u.name.toLowerCase().includes(transferSearch.toLowerCase()) ||
                      u.email.toLowerCase().includes(transferSearch.toLowerCase())
                  )
                  .map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setSelectedUser(user);
                        setTransferSearch(user.name);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-3 hover:bg-blue-50/50 transition-colors text-left"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                    </button>
                  ))}
                {mockSearchUsers.filter(
                  (u) =>
                    u.name.toLowerCase().includes(transferSearch.toLowerCase()) ||
                    u.email.toLowerCase().includes(transferSearch.toLowerCase())
                ).length === 0 && (
                  <div className="px-3 py-4 text-center">
                    <User className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                    <p className="text-sm text-slate-400">Nenhum usuario encontrado</p>
                  </div>
                )}
              </div>
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

          <Input label="Quantidade" type="number" placeholder="0" />
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
            Taxa de transferencia: 0 GCoins
          </p>
          <Button size="lg" className="w-full">
            <Send className="w-5 h-5" />
            Transferir
          </Button>
        </div>
      </Modal>
    </div>
  );
}
