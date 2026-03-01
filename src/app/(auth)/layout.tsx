import { Trophy, Star, Coins, Zap } from "lucide-react";
import Link from "next/link";
import { SportioLogo } from "@/components/shared/sportio-logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

        {/* Floating sport element decorations */}
        <div className="absolute top-20 right-16 w-16 h-16 border-2 border-white/10 rounded-2xl rotate-12 animate-pulse" />
        <div className="absolute bottom-32 right-24 w-10 h-10 border border-blue-300/15 rounded-full" />
        <div className="absolute top-1/2 right-10 w-24 h-24 border border-white/5 rounded-full" />
        <div className="absolute bottom-48 left-8 w-8 h-8 bg-amber-400/10 rounded-lg rotate-45" />
        <div className="absolute top-40 left-1/3 w-3 h-3 bg-blue-300/20 rounded-full" />
        <div className="absolute top-60 right-1/3 w-2 h-2 bg-white/15 rounded-full" />

        <Link href="/" className="relative z-10">
          <SportioLogo className="h-10" white />
        </Link>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-blue-200 text-sm mb-6">
            <Zap className="w-4 h-4" />
            A plataforma #1 de esportes
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
            Transforme Esporte em{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-amber-300">
              Renda Real
            </span>
          </h1>
          <p className="text-blue-100 text-lg max-w-md leading-relaxed">
            A plataforma que conecta atletas, organizadores, marcas e fas
            em um ecossistema esportivo movido a GCoins.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { icon: Trophy, value: "500K+", label: "Atletas" },
              { icon: Star, value: "850", label: "Torneios/mes" },
              { icon: Coins, value: "13", label: "Esportes" },
              { icon: Zap, value: "R$ 2M+", label: "Em premios" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 shadow-lg shadow-black/5 hover:bg-white/15 transition-colors duration-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/20 mb-2">
                  <stat.icon className="w-4 h-4 text-blue-300" />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-blue-200 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-300/60 text-sm relative z-10">
          &copy; 2025 Sportio. Todos os direitos reservados.
        </p>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-gradient-to-b from-white to-slate-50/80 lg:bg-white lg:bg-none">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
