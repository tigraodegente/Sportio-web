import { Coins } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-900 p-12 flex-col justify-between">
        <Link href="/" className="flex items-center gap-2 text-white">
          <Coins className="w-8 h-8" />
          <span className="text-2xl font-bold">Sportio</span>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Transforme Esporte em Renda Real
          </h1>
          <p className="text-emerald-100 text-lg max-w-md">
            A plataforma que conecta atletas, organizadores, marcas e fas
            em um ecossistema esportivo movido a GCoins.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold text-white">500K+</p>
              <p className="text-emerald-200 text-sm">Atletas</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold text-white">850</p>
              <p className="text-emerald-200 text-sm">Torneios/mes</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold text-white">13</p>
              <p className="text-emerald-200 text-sm">Esportes</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold text-white">R$ 2M+</p>
              <p className="text-emerald-200 text-sm">Em premios</p>
            </div>
          </div>
        </div>
        <p className="text-emerald-200 text-sm">
          &copy; 2025 Sportio. Todos os direitos reservados.
        </p>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
