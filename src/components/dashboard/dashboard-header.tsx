"use client";

import { Menu, Search, Bell, Coins } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useUIStore } from "@/stores/ui-store";
import Link from "next/link";

export function DashboardHeader() {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-64">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar torneios, atletas..."
            className="bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none w-full"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* GCoins mini */}
        <Link
          href="/gcoins"
          className="hidden sm:flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-amber-100 transition-colors"
        >
          <Coins className="w-4 h-4" />
          1.250
        </Link>

        {/* Notifications */}
        <Link
          href="/notifications"
          className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Link>

        {/* Profile */}
        <Link href="/profile" className="flex items-center gap-2">
          <Avatar name="Usuario" size="sm" />
          <span className="hidden sm:block text-sm font-medium text-slate-700">
            Usuario
          </span>
        </Link>
      </div>
    </header>
  );
}
