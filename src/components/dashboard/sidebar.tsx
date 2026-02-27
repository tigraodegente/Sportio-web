"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tournaments", label: "Torneios", icon: Trophy },
  { href: "/gcoins", label: "GCoins", icon: Coins },
  { href: "/social", label: "Feed", icon: Users },
  { href: "/bets", label: "Palpites", icon: Target },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/notifications", label: "Notificacoes", icon: Bell },
  { href: "/profile", label: "Perfil", icon: User },
  { href: "/settings", label: "Configuracoes", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

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
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Sportio</span>
          </Link>
          <button
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                {item.label}
                {item.href === "/notifications" && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* GCoins Balance */}
        <div className="p-3">
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-4 text-white">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-emerald-200" />
                <p className="text-xs font-medium text-emerald-200">Saldo GCoins</p>
              </div>
              <p className="text-2xl font-bold tracking-tight">1.250,00</p>
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
