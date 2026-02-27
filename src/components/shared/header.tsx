"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Atletas", href: "/athletes" },
  { label: "Organizadores", href: "/organizers" },
  { label: "Marcas", href: "/brands" },
  { label: "Fãs", href: "/fans" },
  { label: "Apostadores", href: "/bettors" },
  { label: "Árbitros", href: "/referees" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <Coins className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-gray-900">Sportio</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            Entrar
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25"
          >
            Criar Conta Grátis
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-gray-600 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-gray-100 bg-white transition-all duration-300 lg:hidden",
          mobileOpen ? "max-h-[500px]" : "max-h-0 border-t-0"
        )}
      >
        <div className="space-y-1 px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileOpen(false)}
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-emerald-500 px-3 py-2.5 text-center text-sm font-semibold text-white"
              onClick={() => setMobileOpen(false)}
            >
              Criar Conta Grátis
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
