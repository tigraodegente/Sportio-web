"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Coins, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Atletas", href: "/athletes" },
  { label: "Organizadores", href: "/organizers" },
  { label: "Marcas", href: "/brands" },
  { label: "Fans", href: "/fans" },
  { label: "Apostadores", href: "/bettors" },
  { label: "Arbitros", href: "/referees" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20">
            <Coins className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-gray-900">Sportio</span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:bg-slate-50 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/login" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-slate-50">
            Entrar
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5"
          >
            Criar Conta Gratis
          </Link>
        </div>

        <button
          className="rounded-xl p-2 text-gray-600 hover:bg-slate-50 lg:hidden transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden bg-white border-t border-slate-100 transition-all duration-300 lg:hidden",
          mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 border-t-0"
        )}
      >
        <div className="space-y-0.5 px-6 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-gray-600 hover:bg-slate-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-4">
            <Link
              href="/login"
              className="rounded-xl px-3 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-slate-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-3 py-3 text-center text-sm font-bold text-white shadow-md shadow-emerald-500/20"
              onClick={() => setMobileOpen(false)}
            >
              Criar Conta Gratis
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
