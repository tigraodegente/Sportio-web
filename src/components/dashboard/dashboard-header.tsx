"use client";

import { Menu, Search, Bell, Coins } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useUIStore } from "@/stores/ui-store";
import Link from "next/link";

export function DashboardHeader() {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-lg border-b border-slate-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 w-72 hover:border-slate-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar torneios, atletas..."
            className="bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none w-full"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Link
          href="/gcoins"
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 px-3.5 py-2 rounded-xl text-sm font-bold hover:shadow-md hover:shadow-amber-500/10 transition-all border border-amber-200/50"
        >
          <Coins className="w-4 h-4" />
          <span className="hidden sm:inline">1.250</span>
        </Link>

        <Link
          href="/notifications"
          className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
        </Link>

        <Link href="/profile" className="flex items-center gap-2 pl-2 border-l border-slate-100 ml-1">
          <Avatar name="Lucas Mendes" size="sm" />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">Lucas</p>
            <p className="text-[10px] text-slate-400 leading-tight">Nivel 15</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
