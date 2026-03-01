"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SportioLogo } from "./sportio-logo";

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-14 sm:h-[72px] max-w-6xl items-center justify-between px-5 sm:px-10 lg:px-12">
        <Link href="/">
          <SportioLogo className="h-8 sm:h-9" white={!scrolled} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-medium transition-all",
                scrolled
                  ? "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className={cn(
              "rounded-xl px-5 py-2.5 text-sm font-semibold transition-all",
              scrolled
                ? "text-gray-700 hover:bg-gray-50"
                : "text-white hover:bg-white/10"
            )}
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-yellow-400 px-6 py-2.5 text-sm font-bold text-blue-900 shadow-lg shadow-yellow-400/25 transition-all hover:bg-yellow-300 hover:shadow-xl hover:-translate-y-0.5"
          >
            Cadastre-se Gratis
          </Link>
        </div>

        <button
          className={cn(
            "rounded-xl p-2.5 lg:hidden transition-colors",
            scrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/10"
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden bg-white border-t border-gray-100 transition-all duration-300 lg:hidden",
          mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 border-t-0"
        )}
      >
        <div className="space-y-1 px-8 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-5">
            <Link
              href="/login"
              className="rounded-xl px-4 py-3.5 text-center text-[15px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-yellow-400 px-4 py-3.5 text-center text-[15px] font-bold text-blue-900 shadow-lg shadow-yellow-400/25"
              onClick={() => setMobileOpen(false)}
            >
              Cadastre-se Gratis
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
