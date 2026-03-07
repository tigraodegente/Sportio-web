"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  Users,
  Coins,
  Star,
  Plus,
  CheckCircle,
  XCircle,
  Settings,
  Bell,
  BarChart3,
  UserPlus,
  FileText,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/ui/stats-card";
import { SectionHeader } from "./SectionHeader";
import {
  mockManagedTournaments,
  mockPendingEnrollments,
  mockOrganizerEvents,
} from "@/lib/mock/home-data";
import { cn, formatCurrency } from "@/lib/utils";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const statusConfig = {
  active: { label: "Ativo", variant: "success" as const },
  upcoming: { label: "Em Breve", variant: "primary" as const },
  completed: { label: "Concluído", variant: "default" as const },
};

const eventIcons = {
  enrollment: UserPlus,
  result: FileText,
  payment: CreditCard,
  review: Star,
};

export function OrganizerHome() {
  const totalAthletes = mockManagedTournaments.reduce((sum, t) => sum + t.totalParticipants, 0);
  const totalRevenue = mockManagedTournaments.reduce((sum, t) => sum + t.revenue, 0);

  return (
    <div className="space-y-8">
      {/* Quick Metrics */}
      <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3 }}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatsCard
            title="Total Torneios"
            value={mockManagedTournaments.length.toString()}
            change="+1 este mês"
            changeType="positive"
            icon={<Trophy className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Atletas"
            value={totalAthletes.toString()}
            change="+12 esta semana"
            changeType="positive"
            icon={<Users className="w-5 h-5" />}
          />
          <StatsCard
            title="Receita (GCoins)"
            value={totalRevenue.toLocaleString("pt-BR")}
            change="+18% vs mês anterior"
            changeType="positive"
            icon={<Coins className="w-5 h-5" />}
          />
          <StatsCard
            title="Avaliação Média"
            value="4.8"
            change="Baseado em 156 avaliações"
            changeType="neutral"
            icon={<Star className="w-5 h-5" />}
          />
        </div>
      </motion.section>

      {/* Active Tournaments */}
      <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.1 }}>
        <SectionHeader title="Torneios Ativos" href="/tournaments" />
        <div className="grid gap-3 sm:grid-cols-2">
          {mockManagedTournaments.map((tournament) => {
            const config = statusConfig[tournament.status];
            const checkinPct = tournament.totalParticipants > 0
              ? (tournament.checkedIn / tournament.totalParticipants) * 100
              : 0;
            return (
              <div
                key={tournament.id}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-slate-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{tournament.name}</h3>
                    <span className="text-xs text-slate-500">{tournament.sport}</span>
                  </div>
                  <Badge variant={config.variant} className="text-[10px] flex-shrink-0">{config.label}</Badge>
                </div>

                {tournament.status === "active" && (
                  <>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Check-in: {tournament.checkedIn}/{tournament.totalParticipants}</span>
                      <span className="font-semibold text-blue-600">{Math.round(checkinPct)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${checkinPct}%` }}
                      />
                    </div>
                    {tournament.nextMatch && (
                      <p className="text-xs text-slate-500 mb-3">
                        Próxima partida: <span className="font-medium text-slate-700">{tournament.nextMatch}</span>
                      </p>
                    )}
                  </>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Receita: <span className="font-semibold text-slate-700">{tournament.revenue.toLocaleString("pt-BR")} GC</span>
                  </span>
                  <div className="flex gap-1.5">
                    <Link href={`/tournaments/${tournament.id}`}>
                      <Button size="sm" className="text-[10px] px-2 py-1">Gerenciar</Button>
                    </Link>
                    <Link href={`/tournaments/${tournament.id}/results`}>
                      <Button size="sm" variant="outline" className="text-[10px] px-2 py-1">Resultados</Button>
                    </Link>
                    <Button size="sm" variant="ghost" className="text-[10px] px-1.5 py-1">
                      <Bell className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Create Tournament CTA */}
      <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.15 }}>
        <Link
          href="/tournaments/create"
          className="flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-6 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all group"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-colors">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold">Criar Novo Torneio</p>
            <p className="text-xs text-blue-500">Organize seu próximo evento esportivo</p>
          </div>
        </Link>
      </motion.section>

      {/* Pending Enrollments */}
      {mockPendingEnrollments.length > 0 && (
        <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.2 }}>
          <SectionHeader title="Inscrições Pendentes" href="/tournaments" linkText={`${mockPendingEnrollments.length} pendentes`} />
          <div className="space-y-2">
            {mockPendingEnrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={enrollment.athleteName} src={enrollment.athleteImage} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{enrollment.athleteName}</p>
                    <p className="text-xs text-slate-500">{enrollment.tournamentName} &middot; {enrollment.requestedAt}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="text-xs px-3 py-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Aprovar
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs px-2 py-1.5 text-red-500 hover:text-red-600 hover:bg-red-50">
                    <XCircle className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Recent Activity */}
      <motion.section variants={fadeIn} initial="hidden" animate="visible" transition={{ duration: 0.3, delay: 0.3 }}>
        <SectionHeader title="Atividade Recente" />
        <div className="space-y-0">
          {mockOrganizerEvents.map((event, idx) => {
            const Icon = eventIcons[event.type];
            return (
              <div key={event.id} className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0",
                  event.type === "enrollment" && "bg-blue-50 text-blue-500",
                  event.type === "result" && "bg-green-50 text-green-500",
                  event.type === "payment" && "bg-amber-50 text-amber-500",
                  event.type === "review" && "bg-purple-50 text-purple-500"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{event.description}</p>
                  <span className="text-xs text-slate-400">{event.timeAgo} atrás</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}
