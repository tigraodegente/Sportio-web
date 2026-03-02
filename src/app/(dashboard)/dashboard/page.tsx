"use client";

import Link from "next/link";
import {
  Trophy,
  Coins,
  Users,
  Target,
  Megaphone,
  Medal,
  TrendingUp,
  Swords,
  BarChart3,
  Calendar,
  Zap,
  ArrowRight,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

const personaQuickActions: Record<string, { label: string; description: string; href: string; icon: typeof Trophy; color: string }[]> = {
  athlete: [
    { label: "Torneios", description: "Encontre torneios para competir", href: "/tournaments", icon: Trophy, color: "from-blue-500 to-blue-700" },
    { label: "Duelos 1v1", description: "Desafie outros atletas", href: "/duels", icon: Swords, color: "from-red-500 to-red-700" },
    { label: "Conquistas", description: "Veja suas conquistas", href: "/achievements", icon: Medal, color: "from-amber-500 to-amber-700" },
    { label: "Ranking", description: "Confira sua posição", href: "/leaderboard", icon: TrendingUp, color: "from-emerald-500 to-emerald-700" },
  ],
  organizer: [
    { label: "Criar Torneio", description: "Organize um novo evento", href: "/tournaments/create", icon: Calendar, color: "from-blue-500 to-blue-700" },
    { label: "Meus Torneios", description: "Gerencie seus torneios", href: "/tournaments", icon: Trophy, color: "from-purple-500 to-purple-700" },
    { label: "Estatísticas", description: "Veja dados dos seus eventos", href: "/tournaments", icon: BarChart3, color: "from-emerald-500 to-emerald-700" },
    { label: "GCoins", description: "Acompanhe seus ganhos", href: "/gcoins", icon: Coins, color: "from-amber-500 to-amber-700" },
  ],
  brand: [
    { label: "Campanhas", description: "Gerencie suas campanhas", href: "/brand", icon: Megaphone, color: "from-purple-500 to-purple-700" },
    { label: "Patrocínios", description: "Patrocine torneios", href: "/brand", icon: Trophy, color: "from-blue-500 to-blue-700" },
    { label: "Comprar GCoins", description: "Adquira GCoins para campanhas", href: "/gcoins", icon: Coins, color: "from-amber-500 to-amber-700" },
    { label: "Métricas", description: "ROI e alcance da marca", href: "/brand", icon: BarChart3, color: "from-emerald-500 to-emerald-700" },
  ],
  referee: [
    { label: "Convites", description: "Partidas para apitar", href: "/tournaments/invites", icon: Trophy, color: "from-blue-500 to-blue-700" },
    { label: "Ranking", description: "Sua reputação como árbitro", href: "/leaderboard", icon: TrendingUp, color: "from-emerald-500 to-emerald-700" },
    { label: "GCoins", description: "Ganhos por arbitragem", href: "/gcoins", icon: Coins, color: "from-amber-500 to-amber-700" },
    { label: "Conquistas", description: "Suas conquistas", href: "/achievements", icon: Medal, color: "from-purple-500 to-purple-700" },
  ],
  trainer: [
    { label: "Torneios", description: "Organize treinos e torneios", href: "/tournaments", icon: Trophy, color: "from-blue-500 to-blue-700" },
    { label: "Atletas", description: "Conecte-se com atletas", href: "/social", icon: Users, color: "from-emerald-500 to-emerald-700" },
    { label: "Ranking", description: "Sua posição como treinador", href: "/leaderboard", icon: TrendingUp, color: "from-purple-500 to-purple-700" },
    { label: "GCoins", description: "Acompanhe seus ganhos", href: "/gcoins", icon: Coins, color: "from-amber-500 to-amber-700" },
  ],
};

const defaultActions = [
  { label: "Feed", description: "Veja o que está acontecendo", href: "/social", icon: Users, color: "from-blue-500 to-blue-700" },
  { label: "Torneios", description: "Encontre torneios", href: "/tournaments", icon: Trophy, color: "from-purple-500 to-purple-700" },
  { label: "Palpites", description: "Aposte em partidas", href: "/bets", icon: Target, color: "from-emerald-500 to-emerald-700" },
  { label: "GCoins", description: "Sua carteira de GCoins", href: "/gcoins", icon: Coins, color: "from-amber-500 to-amber-700" },
];

export default function DashboardPage() {
  const user = trpc.user.me.useQuery();
  const balance = trpc.gcoin.balance.useQuery();
  const missions = trpc.gamification.myMissions.useQuery(undefined, { retry: false });

  const userRoles = user.data?.roles?.map((r: { role: string }) => r.role) ?? [];
  const primaryRole = userRoles[0];
  const actions = primaryRole && personaQuickActions[primaryRole]
    ? personaQuickActions[primaryRole]
    : defaultActions;

  const totalBalance = balance.data?.total ?? 0;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {user.isLoading ? "Carregando..." : `Olá, ${user.data?.name?.split(" ")[0] ?? "Atleta"}!`}
        </h1>
        <p className="mt-1 text-slate-500">
          {primaryRole
            ? `Seu perfil principal: ${roles_labels[primaryRole] ?? primaryRole}`
            : "Bem-vindo ao Sportio"}
        </p>
      </div>

      {/* GCoins Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-blue-200" />
              <span className="text-sm font-medium text-blue-200">Saldo GCoins</span>
            </div>
            <p className="text-3xl font-bold tracking-tight sm:text-4xl">
              {balance.isLoading
                ? "--,--"
                : totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/gcoins"
              className="rounded-xl bg-white/20 px-4 py-2 text-sm font-medium hover:bg-white/30 transition-colors"
            >
              Comprar
            </Link>
            <Link
              href="/gcoins"
              className="rounded-xl bg-white/20 px-4 py-2 text-sm font-medium hover:bg-white/30 transition-colors"
            >
              Sacar
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href + action.label}
                href={action.href}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white", action.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{action.label}</h3>
                <p className="mt-1 text-xs text-slate-500">{action.description}</p>
                <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-slate-300 transition-all group-hover:text-blue-500 group-hover:translate-x-1" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Persona badges */}
      {userRoles.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Seus Perfis</h2>
          <div className="flex flex-wrap gap-2">
            {userRoles.map((role: string) => (
              <span
                key={role}
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 border border-blue-200"
              >
                {roles_labels[role] ?? role}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missions preview */}
      {missions.data && missions.data.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Missões Ativas</h2>
            <Link href="/missions" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Ver todas
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {missions.data.slice(0, 4).map((um: Record<string, unknown>) => {
              const missionData = um.mission as Record<string, unknown> | undefined;
              const requirement = missionData?.requirement as Record<string, unknown> | undefined;
              const target = (requirement?.count as number) ?? 1;
              return (
                <div key={um.id as string} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900">{missionData?.name as string}</h3>
                  <p className="mt-1 text-xs text-slate-500">{missionData?.description as string}</p>
                  <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                      style={{ width: `${Math.min(100, (((um.progress as number) ?? 0) / target) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{(um.progress as number) ?? 0}/{target}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Go to Feed */}
      <Link
        href="/social"
        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-600 shadow-sm transition-all hover:shadow-md hover:border-blue-300 hover:text-blue-600"
      >
        <Users className="h-4 w-4" />
        Ir para o Feed
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

const roles_labels: Record<string, string> = {
  athlete: "Atleta",
  organizer: "Organizador",
  brand: "Marca",
  referee: "Árbitro",
  trainer: "Treinador",
  nutritionist: "Nutricionista",
  photographer: "Fotógrafo",
  arena_owner: "Dono de Arena",
  fan: "Torcedor",
  bettor: "Apostador",
};
