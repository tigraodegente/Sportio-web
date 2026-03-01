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
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-8 sm:px-10 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25">
            <Coins className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">Sportio</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-gray-500 transition-all hover:bg-slate-50 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login" className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-slate-50">
            Entrar
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
          >
            Criar Conta Gratis
          </Link>
        </div>

        <button
          className="rounded-xl p-2.5 text-gray-600 hover:bg-slate-100 lg:hidden transition-colors"
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
        <div className="space-y-1 px-8 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-medium text-gray-600 hover:bg-slate-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-5">
            <Link
              href="/login"
              className="rounded-xl px-4 py-3.5 text-center text-[15px] font-semibold text-gray-700 hover:bg-slate-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3.5 text-center text-[15px] font-bold text-white shadow-lg shadow-emerald-500/25"
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
