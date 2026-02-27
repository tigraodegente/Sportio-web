"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Send, CreditCard, TrendingUp, History, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { StatsCard } from "@/components/ui/stats-card";

const transactions = [
  { id: "1", category: "tournament_prize", description: "Premio - Copa Beach Tennis SP", amount: 2500, type: "real", date: "15 Mar 2025" },
  { id: "2", category: "bet_place", description: "Palpite - Team Alpha vs Beta", amount: -50, type: "gamification", date: "14 Mar 2025" },
  { id: "3", category: "bet_win", description: "Palpite ganho - Player A vs B", amount: 180, type: "gamification", date: "13 Mar 2025" },
  { id: "4", category: "tournament_entry", description: "Inscricao - Liga CrossFit", amount: -100, type: "real", date: "12 Mar 2025" },
  { id: "5", category: "daily_bonus", description: "Bonus diario", amount: 10, type: "gamification", date: "12 Mar 2025" },
  { id: "6", category: "referral_bonus", description: "Indicacao - Rafael Costa", amount: 50, type: "gamification", date: "11 Mar 2025" },
  { id: "7", category: "purchase", description: "Compra de GCoins", amount: 500, type: "real", date: "10 Mar 2025" },
  { id: "8", category: "transfer", description: "Transferencia para Andre", amount: -100, type: "real", date: "9 Mar 2025" },
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

export default function GCoinsPage() {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">GCoins</h1>
        <p className="text-slate-500">Gerencie sua carteira de GCoins</p>
      </div>

      {/* Balance Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white border-0">
          <p className="text-emerald-200 text-sm">GCoins Reais</p>
          <p className="text-3xl font-bold mt-1">1.250,00</p>
          <p className="text-emerald-200 text-xs mt-1">Saque disponivel via PIX</p>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-700 text-white border-0">
          <p className="text-amber-200 text-sm">GCoins Gamificacao</p>
          <p className="text-3xl font-bold mt-1">3.480,00</p>
          <p className="text-amber-200 text-xs mt-1">Uso em palpites e desafios</p>
        </Card>
        <Card>
          <p className="text-slate-500 text-sm">Saldo Total</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">4.730,00</p>
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
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="divide-y divide-slate-100">
              {transactions
                .filter((t) => tab === "all" || t.type === tab)
                .map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.amount > 0 ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {tx.amount > 0 ? (
                          <ArrowUpRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{tx.description}</p>
                        <p className="text-xs text-slate-500">
                          {categoryLabels[tx.category] || tx.category} &middot; {tx.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          tx.amount > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()} GC
                      </p>
                      <Badge variant={tx.type === "real" ? "primary" : "accent"} className="text-[10px]">
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
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Selecione o valor que deseja comprar:</p>
          <div className="grid grid-cols-3 gap-3">
            {[100, 250, 500, 1000, 2500, 5000].map((amount) => (
              <button
                key={amount}
                className="p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-600 transition-colors text-center"
              >
                <p className="text-lg font-bold text-slate-900">{amount}</p>
                <p className="text-xs text-slate-500">R$ {(amount * 0.1).toFixed(2)}</p>
              </button>
            ))}
          </div>
          <Input label="Ou digite um valor" type="number" placeholder="Quantidade de GCoins" />
          <Button size="lg" className="w-full">
            <CreditCard className="w-5 h-5" />
            Comprar com PIX
          </Button>
        </div>
      </Modal>

      {/* Transfer Modal */}
      <Modal isOpen={showTransferModal} onClose={() => setShowTransferModal(false)} title="Transferir GCoins">
        <div className="space-y-4">
          <Input label="Email ou nome do destinatario" placeholder="Buscar usuario..." />
          <Input label="Quantidade" type="number" placeholder="0" />
          <p className="text-xs text-slate-500">Taxa de transferencia: 0 GCoins</p>
          <Button size="lg" className="w-full">
            <Send className="w-5 h-5" />
            Transferir
          </Button>
        </div>
      </Modal>
    </div>
  );
}
