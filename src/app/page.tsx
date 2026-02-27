import { cn } from "@/lib/utils";
import { SPORTS, USER_TYPES } from "@/lib/constants";
import {
  Trophy,
  Coins,
  Users,
  Shield,
  Zap,
  Target,
  Medal,
  ArrowRight,
  Star,
  Check,
  ChevronDown,
  Timer,
  Dumbbell,
  Flame,
  Gamepad2,
  Waves,
  Bike,
  Swords,
  Heart,
  Building2,
  ShieldCheck,
  TrendingUp,
  CalendarDays,
  CircleDollarSign,
  Gift,
  UserPlus,
  Play,
  Sun,
  Circle,
  Sparkles,
  BadgeDollarSign,
  Crown,
  Rocket,
  Lock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const SPORT_ICON_MAP: Record<string, LucideIcon> = {
  Goal: Target,
  Sun: Sun,
  Timer: Timer,
  Dumbbell: Dumbbell,
  Circle: Circle,
  Flame: Flame,
  Gamepad2: Gamepad2,
  Target: Target,
  Waves: Waves,
  Trophy: Trophy,
  Zap: Zap,
  Swords: Swords,
  Bike: Bike,
};

const USER_TYPE_ICON_MAP: Record<string, LucideIcon> = {
  Users: Users,
  CalendarDays: CalendarDays,
  Building2: Building2,
  Heart: Heart,
  TrendingUp: TrendingUp,
  ShieldCheck: ShieldCheck,
};

// ============================================
// HERO Section - Completely Redesigned
// ============================================

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0a0f1a] pt-24 pb-16 sm:pt-32 sm:pb-20 lg:min-h-screen lg:flex lg:items-center lg:py-0">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full bg-emerald-600/20 blur-[120px] animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-amber-500/15 blur-[100px] animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating sport icons - hidden on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        {[
          { icon: "⚽", top: "15%", left: "8%", delay: "0s", size: "text-4xl" },
          { icon: "🎾", top: "25%", right: "12%", delay: "1s", size: "text-3xl" },
          { icon: "🏀", bottom: "30%", left: "15%", delay: "2s", size: "text-3xl" },
          { icon: "🏆", top: "10%", right: "30%", delay: "2.5s", size: "text-3xl" },
        ].map((item, i) => (
          <div
            key={i}
            className={cn("absolute opacity-20 animate-float", item.size)}
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              bottom: item.bottom,
              animationDelay: item.delay,
              animationDuration: "6s",
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs sm:text-sm font-medium text-emerald-300">Plataforma #1 de esportes no Brasil</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.15] mb-5">
              Transforme{" "}
              <span className="text-gradient-hero">Esporte</span>
              {" "}em Renda Real
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-400 mb-8 max-w-xl leading-relaxed">
              Junte-se a <span className="text-white font-semibold">12.500+ atletas</span> que já transformam paixão em lucro real. Ganhe <span className="text-amber-400 font-semibold">GCoins</span> competindo no que você ama.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/register"
                className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white shadow-2xl shadow-emerald-500/30 transition-all duration-300 hover:shadow-emerald-500/50 hover:-translate-y-1 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-300 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative flex items-center gap-2">
                  Começar Grátis
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/20"
              >
                <Play className="h-5 w-5" />
                Como Funciona
              </a>
            </div>
          </div>

          {/* Right side - Stats cards floating (desktop only) */}
          <div className="relative hidden lg:block">
            <div className="relative h-[500px]">
              <div className="absolute top-8 left-8 right-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Trophy className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Torneio Finalizado</p>
                    <p className="text-xl font-bold text-white">Copa Sportio SP</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-400">R$ 5.000</p>
                    <p className="text-xs text-slate-400 mt-1">Premiação</p>
                  </div>
                  <div className="flex-1 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-center">
                    <p className="text-2xl font-bold text-amber-400">128</p>
                    <p className="text-xs text-slate-400 mt-1">Atletas</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-16 -left-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-2xl animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">+250 GCoins</p>
                    <p className="text-xs text-emerald-400">Vitória no torneio!</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 right-0 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-2xl animate-float" style={{ animationDelay: "2s" }}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">#3 Ranking</p>
                    <p className="text-xs text-purple-400">Beach Tennis SP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-10 sm:mt-16 lg:mt-24">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {[
              { value: "12.500+", label: "Atletas Ativos", icon: Users, color: "from-emerald-400 to-emerald-600" },
              { value: "850+", label: "Torneios/mês", icon: Trophy, color: "from-amber-400 to-amber-600" },
              { value: "R$ 2M+", label: "Em Premiações", icon: CircleDollarSign, color: "from-blue-400 to-blue-600" },
              { value: "13", label: "Modalidades", icon: Medal, color: "from-purple-400 to-purple-600" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 sm:p-6 text-center transition-all duration-300 hover:bg-white/10 hover:border-white/20"
              >
                <div className={cn("mx-auto mb-2 sm:mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg", stat.color)}>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="text-xl sm:text-3xl font-black text-white">{stat.value}</div>
                <div className="mt-0.5 text-xs sm:text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// HOW IT WORKS Section - Redesigned
// ============================================

function HowItWorksSection() {
  const steps = [
    { number: "01", title: "Crie sua conta", description: "Cadastro rápido em segundos, 100% gratuito", icon: UserPlus, color: "from-emerald-400 to-emerald-600" },
    { number: "02", title: "Escolha o esporte", description: "13 modalidades disponíveis para você", icon: Medal, color: "from-blue-400 to-blue-600" },
    { number: "03", title: "Participe e Compita", description: "Torneios, desafios e competições diárias", icon: Trophy, color: "from-purple-400 to-purple-600" },
    { number: "04", title: "Ganhe GCoins", description: "Converta seus GCoins em dinheiro via PIX", icon: Coins, color: "from-amber-400 to-amber-600" },
  ];

  return (
    <section id="como-funciona" className="relative py-16 sm:py-24 lg:py-28 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 mb-4 sm:mb-6">
            <Rocket className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Simples e rápido</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3">
            Como <span className="text-gradient-primary">Funciona</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Em 4 passos simples você começa a ganhar com seu esporte favorito
          </p>
        </div>

        <div className="space-y-4 sm:hidden">
          {steps.map((step) => (
            <div key={step.number} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className={cn("shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg", step.color)}>
                <step.icon className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Passo {step.number}</span>
                <h3 className="text-base font-bold text-gray-900 mt-0.5">{step.title}</h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="group relative">
              {index < steps.length - 1 && (
                <div className="absolute top-12 left-[calc(50%+3rem)] hidden h-[2px] w-[calc(100%-6rem)] bg-gradient-to-r from-gray-200 to-gray-100 lg:block" />
              )}

              <div className="relative rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:border-gray-200 overflow-hidden">
                <span className="absolute -top-2 -right-1 text-7xl font-black text-gray-50 select-none group-hover:text-emerald-50 transition-colors">
                  {step.number}
                </span>

                <div className={cn("relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-110", step.color)}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// GCOINS ECONOMY Section - Redesigned
// ============================================

function GCoinsEconomySection() {
  return (
    <section className="relative py-16 sm:py-24 lg:py-28 bg-[#0a0f1a] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-emerald-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 mb-4 sm:mb-6">
            <BadgeDollarSign className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-300">Economia digital</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-3">
            A Economia do <span className="text-gradient-hero">Sportio</span>
          </h2>
          <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Dois tipos de GCoins para maximizar seus ganhos e recompensas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
          {/* GCoins Reais */}
          <div className="group relative rounded-2xl sm:rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 backdrop-blur-sm p-6 sm:p-10 transition-all duration-500 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10">
            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
                <CircleDollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-bold text-white">GCoins Reais</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-emerald-300 mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Dinheiro de verdade
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-300 mb-5 sm:mb-8 leading-relaxed">
              Ganhe dinheiro de verdade praticando esporte. Converta GCoins para sua conta via <span className="text-emerald-400 font-semibold">PIX instantâneo</span>.
            </p>

            <div className="space-y-3">
              {["Vitórias em torneios", "Prêmios de competições", "Assinaturas de torcedores", "Saque via PIX instantâneo"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/20">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <span className="text-sm sm:text-base text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* GCoins Gamificação */}
          <div className="group relative rounded-2xl sm:rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/5 backdrop-blur-sm p-6 sm:p-10 transition-all duration-500 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10">
            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30">
                <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-bold text-white">GCoins Gamificação</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-amber-300 mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Recompensas e vantagens
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-300 mb-5 sm:mb-8 leading-relaxed">
              Ganhe recompensas por participar da comunidade. Troque por <span className="text-amber-400 font-semibold">produtos exclusivos</span> e vantagens especiais.
            </p>

            <div className="space-y-3">
              {["Engajamento social", "Desafios técnicos", "Rankings especiais", "Troque por produtos exclusivos"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-500/20">
                    <Check className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <span className="text-sm sm:text-base text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SPORTS GRID Section - Redesigned
// ============================================

function SportsGridSection() {
  const sportColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
    "text-emerald-500": { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", gradient: "from-emerald-400 to-emerald-600" },
    "text-amber-500": { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", gradient: "from-amber-400 to-amber-600" },
    "text-blue-500": { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", gradient: "from-blue-400 to-blue-600" },
    "text-red-500": { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", gradient: "from-red-400 to-red-600" },
    "text-yellow-500": { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200", gradient: "from-yellow-400 to-yellow-600" },
    "text-orange-500": { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", gradient: "from-orange-400 to-orange-600" },
    "text-purple-500": { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", gradient: "from-purple-400 to-purple-600" },
    "text-orange-600": { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", gradient: "from-orange-400 to-orange-600" },
    "text-cyan-500": { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200", gradient: "from-cyan-400 to-cyan-600" },
    "text-lime-500": { bg: "bg-lime-50", text: "text-lime-600", border: "border-lime-200", gradient: "from-lime-400 to-lime-600" },
    "text-pink-500": { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200", gradient: "from-pink-400 to-pink-600" },
    "text-red-600": { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", gradient: "from-red-400 to-red-600" },
    "text-teal-500": { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200", gradient: "from-teal-400 to-teal-600" },
  };

  return (
    <section className="relative py-16 sm:py-24 lg:py-28 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 mb-4 sm:mb-6">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">13 modalidades</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3">
            Encontre Seu <span className="text-gradient-primary">Esporte</span>
          </h2>
          <p className="text-sm sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Do futebol ao e-sports, encontre a modalidade perfeita para seu estilo
          </p>
        </div>

        {/* Mobile: compact list */}
        <div className="space-y-3 sm:hidden">
          {SPORTS.map((sport) => {
            const IconComponent = SPORT_ICON_MAP[sport.icon] || Target;
            const colors = sportColors[sport.color] || sportColors["text-emerald-500"];
            return (
              <div
                key={sport.id}
                className={cn("flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm", colors.border)}
              >
                <div className={cn("shrink-0 flex h-11 w-11 items-center justify-center rounded-xl", colors.bg)}>
                  <IconComponent className={cn("h-5 w-5", colors.text)} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-gray-900">{sport.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-1">{sport.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {SPORTS.map((sport) => {
            const IconComponent = SPORT_ICON_MAP[sport.icon] || Target;
            const colors = sportColors[sport.color] || sportColors["text-emerald-500"];
            return (
              <div
                key={sport.id}
                className={cn(
                  "group relative rounded-2xl border bg-white p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl cursor-pointer",
                  colors.border,
                  "hover:border-transparent"
                )}
              >
                <div className={cn("absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100", colors.gradient)} />
                <div className="relative">
                  <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500", colors.bg, "group-hover:bg-white/20")}>
                    <IconComponent className={cn("h-6 w-6 transition-colors duration-500", colors.text, "group-hover:text-white")} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-white transition-colors duration-500">
                    {sport.name}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 group-hover:text-white/80 transition-colors duration-500">
                    {sport.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// USER TYPES Section - Redesigned
// ============================================

function UserTypesSection() {
  const typeColors: Record<string, { gradient: string; light: string }> = {
    "text-emerald-500": { gradient: "from-emerald-400 to-emerald-600", light: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    "text-blue-500": { gradient: "from-blue-400 to-blue-600", light: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    "text-purple-500": { gradient: "from-purple-400 to-purple-600", light: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    "text-red-500": { gradient: "from-red-400 to-red-600", light: "bg-red-500/10 text-red-400 border-red-500/20" },
    "text-amber-500": { gradient: "from-amber-400 to-amber-600", light: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    "text-slate-500": { gradient: "from-slate-400 to-slate-600", light: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  };

  return (
    <section className="relative py-16 sm:py-24 lg:py-28 bg-[#0a0f1a] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-0 h-72 w-72 rounded-full bg-purple-600/10 blur-[100px]" />
        <div className="absolute bottom-1/3 right-0 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 mb-4 sm:mb-6">
            <Users className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">Para cada perfil</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-3">
            Há um Lugar Para <span className="text-gradient-hero">Você</span>
          </h2>
          <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Seja atleta, organizador ou fã — o Sportio tem algo especial para você
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {USER_TYPES.map((userType) => {
            const IconComponent = USER_TYPE_ICON_MAP[userType.icon] || Users;
            const colors = typeColors[userType.color] || typeColors["text-emerald-500"];
            return (
              <a
                key={userType.id}
                href={userType.href}
                className="group flex items-start gap-4 sm:block rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 sm:p-8 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className={cn("shrink-0 sm:mb-6 inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br shadow-lg", colors.gradient)}>
                  <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base sm:text-xl font-bold text-white sm:mb-3">{userType.name}</h3>
                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed mt-1 sm:mb-6">{userType.description}</p>

                  <span className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 transition-all group-hover:gap-3">
                    Saiba mais
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// TESTIMONIALS Section - Redesigned
// ============================================

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Comecei jogando torneios de futebol e hoje tiro R$ 2.000 por mês competindo e fazendo palpites.",
      author: "João Silva",
      role: "Atleta de Futebol",
      earnings: "R$ 2.000/mês",
      color: "from-emerald-400 to-emerald-600",
    },
    {
      quote: "Organizei 12 torneios e lucrei R$ 15 mil em três meses. Tudo automatizado pela plataforma.",
      author: "Maria Santos",
      role: "Organizadora",
      earnings: "R$ 15.000",
      color: "from-blue-400 to-blue-600",
    },
    {
      quote: "Ganhei prêmios só por torcer e comentar no app. Melhor plataforma esportiva que já usei!",
      author: "Pedro Costa",
      role: "Fã/Torcedor",
      earnings: "500+ GCoins",
      color: "from-amber-400 to-amber-600",
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 lg:py-28 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 mb-4 sm:mb-6">
            <Star className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">Depoimentos reais</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3">
            Quem Já Está <span className="text-gradient-accent">Ganhando</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="group relative rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-5 sm:p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="flex gap-1 mb-4 sm:mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <blockquote className="text-sm sm:text-lg text-gray-700 leading-relaxed mb-5 sm:mb-8">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className={cn("inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6", t.color)}>
                <Coins className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                <span className="text-xs sm:text-sm font-bold text-white">{t.earnings}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm sm:text-lg font-bold text-white", t.color)}>
                  {t.author.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-sm sm:text-base font-bold text-gray-900">{t.author}</div>
                  <div className="text-xs sm:text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA Section - Redesigned
// ============================================

function CTASection() {
  return (
    <section className="relative py-16 sm:py-24 lg:py-28 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 sm:px-6 lg:px-8 text-center">
        <div className="mb-6 sm:mb-8 inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl bg-white/20 backdrop-blur-sm shadow-2xl">
          <Coins className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black text-white mb-4 sm:mb-6 leading-tight">
          Comece a Ganhar com Seu Esporte Hoje
        </h2>

        <p className="text-sm sm:text-xl text-white/80 mb-8 sm:mb-10 max-w-2xl mx-auto">
          Cadastro gratuito, sem cartão de crédito. Ganhe GCoins instantaneamente.
        </p>

        <a
          href="/register"
          className="group inline-flex items-center gap-2 sm:gap-3 rounded-2xl bg-white px-7 py-4 sm:px-10 sm:py-5 text-base sm:text-lg font-bold text-emerald-600 shadow-2xl transition-all duration-300 hover:shadow-white/30 hover:-translate-y-1"
        >
          Criar Minha Conta Grátis
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </a>

        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-white/70">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Dados seguros</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="text-xs sm:text-sm">PIX instantâneo</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-xs sm:text-sm">12.500+ atletas</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FAQ Section - Redesigned
// ============================================

function FAQSection() {
  const faqs = [
    {
      question: "O que é o Sportio?",
      answer: "O Sportio é a plataforma esportiva mais completa do Brasil. Conectamos atletas, organizadores, marcas, fãs e árbitros em um ecossistema digital onde você pode competir em torneios, ganhar GCoins e transformar sua paixão pelo esporte em renda real.",
    },
    {
      question: "O que são GCoins?",
      answer: "GCoins são a moeda digital do Sportio. Existem dois tipos: GCoins Reais (convertidos em dinheiro via PIX) e GCoins de Gamificação (recompensas por engajamento, trocáveis por produtos exclusivos).",
    },
    {
      question: "Como ganho dinheiro no Sportio?",
      answer: "Participe e vença torneios, organize eventos, construa uma base de torcedores, dê palpites certeiros e como marca, patrocine atletas. Os GCoins Reais podem ser sacados via PIX a qualquer momento.",
    },
    {
      question: "É seguro usar o Sportio?",
      answer: "Sim! Utilizamos criptografia de ponta a ponta, autenticação em duas etapas, e todas as transações financeiras são protegidas por protocolos bancários seguros. Suporte 24/7 disponível.",
    },
    {
      question: "Quais esportes são suportados?",
      answer: "13 modalidades: Futebol, Beach Tennis, Corrida, CrossFit, Vôlei, Futevôlei, E-Sports, Basquete, Natação, Tênis, Skate, Lutas e Ciclismo. Estamos sempre expandindo!",
    },
    {
      question: "Preciso pagar para usar?",
      answer: "Não! Criar uma conta é 100% gratuito. Participe de torneios gratuitos, interaja na comunidade e ganhe GCoins sem custo. Não existe mensalidade ou taxa escondida.",
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 lg:py-28 bg-gray-50 overflow-hidden">
      <div className="relative mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3">
            Perguntas <span className="text-gradient-primary">Frequentes</span>
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-xl sm:rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-md open:shadow-lg open:border-emerald-200">
              <summary className="flex cursor-pointer items-center justify-between p-4 sm:p-6 [&::-webkit-details-marker]:hidden">
                <span className="pr-4 text-sm sm:text-lg font-bold text-gray-900 group-open:text-emerald-600 transition-colors">
                  {faq.question}
                </span>
                <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 transition-all duration-300 group-open:rotate-180 group-open:bg-emerald-100">
                  <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 group-open:text-emerald-600" />
                </span>
              </summary>
              <div className="px-4 pb-4 sm:px-6 sm:pb-6 text-sm sm:text-base text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Main Page
// ============================================

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <GCoinsEconomySection />
      <SportsGridSection />
      <UserTypesSection />
      <TestimonialsSection />
      <CTASection />
      <FAQSection />
    </>
  );
}
