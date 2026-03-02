"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy,
  Coins,
  Users,
  MessageSquare,
  Bell,
  Target,
  Settings,
  User,
  X,
  Zap,
  Megaphone,
  Mail,
  Medal,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { trpc } from "@/lib/trpc";
import { SportioLogo } from "@/components/shared/sportio-logo";

interface NavItem {
  href: string;
  label: string;
  icon: typeof Trophy;
  badgeKey?: "invites";
  section?: "main" | "account";
}

const allNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, section: "main" },
  { href: "/social", label: "Feed", icon: Users, section: "main" },
  { href: "/tournaments", label: "Torneios", icon: Trophy, section: "main" },
  { href: "/tournaments/invites", label: "Convites", icon: Mail, badgeKey: "invites", section: "main" },
  { href: "/gcoins", label: "GCoins", icon: Coins, section: "main" },
  { href: "/bets", label: "Palpites", icon: Target, section: "main" },
  { href: "/achievements", label: "Conquistas", icon: Medal, section: "main" },
  { href: "/missions", label: "Missões", icon: Target, section: "main" },
  { href: "/leaderboard", label: "Ranking", icon: TrendingUp, section: "main" },
  { href: "/chat", label: "Chat", icon: MessageSquare, section: "main" },
  { href: "/notifications", label: "Notificações", icon: Bell, section: "main" },
  { href: "/brand", label: "Marca", icon: Megaphone, section: "main" },
  { href: "/profile", label: "Perfil", icon: User, section: "account" },
  { href: "/settings", label: "Configurações", icon: Settings, section: "account" },
];

// Nav items prioritized per persona (shown first in sidebar)
const rolePriority: Record<string, string[]> = {
  athlete: ["/dashboard", "/social", "/tournaments", "/tournaments/invites", "/bets", "/achievements", "/missions", "/leaderboard"],
  organizer: ["/dashboard", "/tournaments", "/social", "/gcoins", "/chat", "/notifications"],
  brand: ["/dashboard", "/brand", "/social", "/gcoins", "/chat"],
  referee: ["/dashboard", "/tournaments/invites", "/tournaments", "/gcoins", "/leaderboard"],
  trainer: ["/dashboard", "/tournaments", "/social", "/leaderboard", "/chat"],
};

function getOrderedNavItems(userRoles: string[]): NavItem[] {
  // Collect priority hrefs from all user roles
  const prioritySet = new Set<string>();
  for (const role of userRoles) {
    const items = rolePriority[role];
    if (items) items.forEach((href) => prioritySet.add(href));
  }

  // If no persona-specific ordering, use default order
  if (prioritySet.size === 0) {
    return allNavItems;
  }

  // Hide "Marca" from non-brand users
  const hasBrand = userRoles.includes("brand");
  const mainItems = allNavItems.filter((item) => item.section === "main" && (item.href !== "/brand" || hasBrand));
  const accountItems = allNavItems.filter((item) => item.section === "account");

  // Sort: priority items first (in order), then the rest
  const prioritized = mainItems.filter((item) => prioritySet.has(item.href));
  const rest = mainItems.filter((item) => !prioritySet.has(item.href));

  return [...prioritized, ...rest, ...accountItems];
}

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  // Live data for sidebar widgets
  const user = trpc.user.me.useQuery(undefined, { retry: false });
  const balance = trpc.gcoin.balance.useQuery(undefined, { refetchInterval: 30000 });
  const unreadCount = trpc.notification.unreadCount.useQuery(undefined, { refetchInterval: 15000 });
  const pendingInvites = trpc.tournament.pendingInvitesCount.useQuery(undefined, { refetchInterval: 30000 });
  const totalBalance = balance.data?.total ?? 0;

  const userRoles = user.data?.roles?.map((r: { role: string }) => r.role) ?? [];
  const navItems = getOrderedNavItems(userRoles);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[260px] bg-slate-900 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <Link href="/social" className="flex items-center">
            <SportioLogo white className="h-8" />
          </Link>
          <button
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="space-y-0.5">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (pathname.startsWith(item.href + "/") && !navItems.some(other => other.href !== item.href && other.href.startsWith(item.href + "/") && (pathname === other.href || pathname.startsWith(other.href + "/"))));
              const prevItem = navItems[idx - 1];
              const showSeparator = prevItem && prevItem.section !== item.section;
              return (
                <div key={item.href}>
                  {showSeparator && (
                    <div className="my-3 border-t border-white/5" />
                  )}
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-blue-500/15 text-blue-400"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                    {item.label}
                    {item.href === "/notifications" && (unreadCount.data ?? 0) > 0 && (
                      <span className="ml-auto flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold px-1">
                        {(unreadCount.data ?? 0) > 99 ? "99+" : unreadCount.data}
                      </span>
                    )}
                    {item.badgeKey === "invites" && (pendingInvites.data ?? 0) > 0 && (
                      <span className="ml-auto flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-blue-500 text-white text-[10px] font-bold px-1">
                        {(pendingInvites.data ?? 0) > 99 ? "99+" : pendingInvites.data}
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>

        {/* GCoins Balance */}
        <div className="p-3">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-4 text-white">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-blue-200" />
                <p className="text-xs font-medium text-blue-200">Saldo GCoins</p>
              </div>
              <p className="text-2xl font-bold tracking-tight">
                {balance.isLoading ? "--,--" : totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <div className="flex gap-2 mt-3">
                <Link
                  href="/gcoins"
                  className="flex-1 text-center text-xs font-medium bg-white/20 hover:bg-white/30 rounded-lg py-2 transition-colors"
                >
                  Comprar
                </Link>
                <Link
                  href="/gcoins"
                  className="flex-1 text-center text-xs font-medium bg-white/20 hover:bg-white/30 rounded-lg py-2 transition-colors"
                >
                  Sacar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
