import { cn } from "@/lib/utils";
import { SPORTS, USER_TYPES } from "@/lib/constants";
import {
  Trophy,
  Coins,
  Users,
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
  Shield,
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

function SectionContainer({
  children,
  className,
  narrow = false,
}: {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div className={cn("mx-auto w-full px-8 sm:px-10 lg:px-16", narrow ? "max-w-4xl" : "max-w-6xl", className)}>
      {children}
    </div>
  );
}

// ============================================
// HERO Section - Blue gradient + Yellow CTA
// ============================================

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white pt-32 sm:pt-40 pb-24 sm:pb-32 lg:min-h-screen lg:flex lg:items-center lg:py-0">
      {/* Gradient orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full bg-blue-500/20 blur-[120px] animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-yellow-400/10 blur-[100px] animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating sport icons - desktop only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        {[
          { icon: "⚽", top: "15%", left: "8%", delay: "0s", size: "text-4xl" },
          { icon: "🎾", top: "25%", right: "12%", delay: "1s", size: "text-3xl" },
          { icon: "🏀", bottom: "30%", left: "15%", delay: "2s", size: "text-3xl" },
          { icon: "🏆", top: "10%", right: "30%", delay: "2.5s", size: "text-3xl" },
        ].map((item, i) => (
          <div
            key={i}
            className={cn("absolute opacity-15 animate-float", item.size)}
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

      <SectionContainer>
        <div className="relative grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400" />
              </span>
              <span className="text-xs sm:text-sm font-medium text-yellow-200">Plataforma #1 de esportes no Brasil</span>
            </div>

            <h1 className="text-[2.5rem] sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-8">
              Transforme{" "}
              <span className="text-yellow-400">Esporte</span>
              {" "}em Renda Real
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-blue-200 mb-12 max-w-xl leading-relaxed">
              Junte-se a <span className="text-white font-semibold">12.500+ atletas</span> que ja transformam paixao em lucro real. Ganhe <span className="text-yellow-400 font-semibold">GCoins</span> competindo no que voce ama.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/register"
                className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-8 py-4 text-base sm:text-lg font-bold text-blue-900 shadow-2xl shadow-yellow-400/30 transition-all duration-300 hover:bg-yellow-300 hover:shadow-yellow-400/50 hover:-translate-y-1 hover:scale-105 min-h-[56px]"
              >
                Comecar Gratis
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm px-8 py-4 text-base sm:text-lg font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/30"
              >
                <Play className="h-5 w-5" />
                Como Funciona
              </a>
            </div>
          </div>

          {/* Right side - floating cards (desktop only) */}
          <div className="relative hidden lg:block">
            <div className="relative h-[500px]">
              <div className="absolute top-8 left-8 right-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-400/30">
                    <Trophy className="h-7 w-7 text-blue-900" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-300">Torneio Finalizado</p>
                    <p className="text-xl font-bold text-white">Copa Sportio SP</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-400">R$ 5.000</p>
                    <p className="text-xs text-blue-300 mt-1">Premiacao</p>
                  </div>
                  <div className="flex-1 rounded-2xl bg-blue-400/10 border border-blue-400/20 p-4 text-center">
                    <p className="text-2xl font-bold text-blue-300">128</p>
                    <p className="text-xs text-blue-300 mt-1">Atletas</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-16 -left-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-2xl animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-blue-900" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">+250 GCoins</p>
                    <p className="text-xs text-yellow-400">Vitoria no torneio!</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 right-0 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-2xl animate-float" style={{ animationDelay: "2s" }}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">#3 Ranking</p>
                    <p className="text-xs text-blue-300">Beach Tennis SP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 sm:mt-24 lg:mt-28">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6">
            {[
              { value: "12.500+", label: "Atletas Ativos", icon: Users, color: "from-yellow-400 to-amber-500" },
              { value: "850+", label: "Torneios/mes", icon: Trophy, color: "from-blue-400 to-blue-600" },
              { value: "R$ 2M+", label: "Em Premiacoes", icon: CircleDollarSign, color: "from-blue-300 to-blue-500" },
              { value: "13", label: "Modalidades", icon: Medal, color: "from-yellow-300 to-yellow-500" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center transition-all duration-300 hover:bg-white/10 hover:border-white/20"
              >
                <div className={cn("mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg", stat.color)}>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-900" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
                <div className="mt-1.5 text-xs sm:text-sm text-blue-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}

// ============================================
// HOW IT WORKS Section
// ============================================

function HowItWorksSection() {
  const steps = [
    { number: "01", title: "Crie sua conta", description: "Cadastro rapido em segundos, 100% gratuito", icon: UserPlus, color: "from-blue-500 to-blue-700" },
    { number: "02", title: "Escolha o esporte", description: "13 modalidades disponiveis para voce", icon: Medal, color: "from-blue-400 to-blue-600" },
    { number: "03", title: "Participe e Compita", description: "Torneios, desafios e competicoes diarias", icon: Trophy, color: "from-yellow-400 to-amber-500" },
    { number: "04", title: "Ganhe GCoins", description: "Converta seus GCoins em dinheiro via PIX", icon: Coins, color: "from-yellow-400 to-amber-500" },
  ];

  return (
    <section id="como-funciona" className="relative py-24 sm:py-32 lg:py-40 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-600" />

      <SectionContainer>
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-5 py-2.5 mb-6 sm:mb-8">
            <Rocket className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Simples e rapido</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-5">
            Como <span className="text-blue-600">Funciona</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Em 4 passos simples voce comeca a ganhar com seu esporte favorito
          </p>
        </div>

        {/* Mobile: vertical cards */}
        <div className="space-y-5 sm:hidden">
          {steps.map((step) => (
            <div key={step.number} className="flex items-start gap-5 rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
              <div className={cn("shrink-0 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg", step.color)}>
                <step.icon className="h-7 w-7 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Passo {step.number}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-1.5">{step.title}</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="group relative">
              {index < steps.length - 1 && (
                <div className="absolute top-12 left-[calc(50%+3rem)] hidden h-[2px] w-[calc(100%-6rem)] bg-gradient-to-r from-blue-200 to-blue-100 lg:block" />
              )}
              <div className="relative rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:border-blue-200 overflow-hidden">
                <span className="absolute -top-2 -right-1 text-7xl font-black text-gray-50 select-none group-hover:text-blue-50 transition-colors">
                  {step.number}
                </span>
                <div className={cn("relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-110", step.color)}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}

// ============================================
// GCOINS ECONOMY Section
// ============================================

function GCoinsEconomySection() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-yellow-400/10 blur-[120px]" />
      </div>

      <SectionContainer className="relative">
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2.5 mb-6 sm:mb-8">
            <BadgeDollarSign className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-300">Economia digital</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5">
            A Economia do <span className="text-yellow-400">Sportio</span>
          </h2>
          <p className="text-base sm:text-lg text-blue-200 max-w-2xl mx-auto leading-relaxed">
            Dois tipos de GCoins para maximizar seus ganhos e recompensas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* GCoins Reais */}
          <div className="group rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 to-yellow-400/5 backdrop-blur-sm p-8 sm:p-10 transition-all duration-500 hover:border-yellow-400/40 hover:shadow-2xl hover:shadow-yellow-400/10">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-400/30">
                <CircleDollarSign className="h-8 w-8 text-blue-900" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">GCoins Reais</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-semibold text-yellow-300 mt-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                  Dinheiro de verdade
                </span>
              </div>
            </div>
            <p className="text-base text-blue-200 mb-8 leading-relaxed">
              Ganhe dinheiro de verdade praticando esporte. Converta GCoins para sua conta via <span className="text-yellow-400 font-semibold">PIX instantaneo</span>.
            </p>
            <div className="space-y-4">
              {["Vitorias em torneios", "Premios de competicoes", "Assinaturas de torcedores", "Saque via PIX instantaneo"].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-400/20">
                    <Check className="h-4 w-4 text-yellow-400" />
                  </div>
                  <span className="text-base text-blue-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* GCoins Gamificacao */}
          <div className="group rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-400/10 to-blue-400/5 backdrop-blur-sm p-8 sm:p-10 transition-all duration-500 hover:border-blue-400/40 hover:shadow-2xl hover:shadow-blue-400/10">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-400/30">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">GCoins Gamificacao</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-400/20 px-3 py-1 text-xs font-semibold text-blue-300 mt-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  Recompensas e vantagens
                </span>
              </div>
            </div>
            <p className="text-base text-blue-200 mb-8 leading-relaxed">
              Ganhe recompensas por participar da comunidade. Troque por <span className="text-blue-300 font-semibold">produtos exclusivos</span> e vantagens especiais.
            </p>
            <div className="space-y-4">
              {["Engajamento social", "Desafios tecnicos", "Rankings especiais", "Troque por produtos exclusivos"].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-400/20">
                    <Check className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-base text-blue-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}

// ============================================
// SPORTS GRID Section
// ============================================

function SportsGridSection() {
  const sportColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
    "text-emerald-500": { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", gradient: "from-blue-400 to-blue-600" },
    "text-amber-500": { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200", gradient: "from-yellow-400 to-amber-500" },
    "text-blue-500": { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", gradient: "from-blue-400 to-blue-600" },
    "text-red-500": { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", gradient: "from-red-400 to-red-600" },
    "text-yellow-500": { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200", gradient: "from-yellow-400 to-amber-500" },
    "text-orange-500": { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", gradient: "from-orange-400 to-orange-600" },
    "text-purple-500": { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", gradient: "from-purple-400 to-purple-600" },
    "text-orange-600": { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", gradient: "from-orange-400 to-orange-600" },
    "text-cyan-500": { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200", gradient: "from-cyan-400 to-cyan-600" },
    "text-lime-500": { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200", gradient: "from-teal-400 to-teal-600" },
    "text-pink-500": { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200", gradient: "from-pink-400 to-pink-600" },
    "text-red-600": { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", gradient: "from-red-400 to-red-600" },
    "text-teal-500": { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200", gradient: "from-teal-400 to-teal-600" },
  };

  return (
    <section className="relative py-24 sm:py-32 lg:py-40 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
      <SectionContainer>
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-5 py-2.5 mb-6 sm:mb-8">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">13 modalidades</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-5">
            Encontre Seu <span className="text-blue-600">Esporte</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Do futebol ao e-sports, encontre a modalidade perfeita para seu estilo
          </p>
        </div>

        {/* Mobile: 3-col */}
        <div className="grid grid-cols-3 gap-4 sm:hidden">
          {SPORTS.map((sport) => {
            const IconComponent = SPORT_ICON_MAP[sport.icon] || Target;
            const colors = sportColors[sport.color] || sportColors["text-blue-500"];
            return (
              <div key={sport.id} className={cn("flex flex-col items-center text-center rounded-2xl border bg-white py-6 px-3 shadow-sm", colors.border)}>
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl mb-3", colors.bg)}>
                  <IconComponent className={cn("h-6 w-6", colors.text)} />
                </div>
                <h3 className="text-xs font-bold text-gray-900 leading-tight">{sport.name}</h3>
              </div>
            );
          })}
        </div>

        {/* Desktop */}
        <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {SPORTS.map((sport) => {
            const IconComponent = SPORT_ICON_MAP[sport.icon] || Target;
            const colors = sportColors[sport.color] || sportColors["text-blue-500"];
            return (
              <div key={sport.id} className={cn("group relative rounded-2xl border bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl cursor-pointer", colors.border, "hover:border-transparent")}>
                <div className={cn("absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100", colors.gradient)} />
                <div className="relative">
                  <div className={cn("mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500", colors.bg, "group-hover:bg-white/20")}>
                    <IconComponent className={cn("h-6 w-6 transition-colors duration-500", colors.text, "group-hover:text-white")} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-white transition-colors duration-500">{sport.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 group-hover:text-white/80 transition-colors duration-500">{sport.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </SectionContainer>
    </section>
  );
}

// ============================================
// USER TYPES Section
// ============================================

function UserTypesSection() {
  const typeColors: Record<string, { gradient: string }> = {
    "text-emerald-500": { gradient: "from-blue-400 to-blue-600" },
    "text-blue-500": { gradient: "from-blue-400 to-blue-600" },
    "text-purple-500": { gradient: "from-purple-400 to-purple-600" },
    "text-red-500": { gradient: "from-red-400 to-red-600" },
    "text-amber-500": { gradient: "from-yellow-400 to-amber-500" },
    "text-slate-500": { gradient: "from-gray-400 to-gray-600" },
  };

  return (
    <section className="relative py-24 sm:py-32 lg:py-40 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-0 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute bottom-1/3 right-0 h-72 w-72 rounded-full bg-yellow-400/10 blur-[100px]" />
      </div>

      <SectionContainer className="relative">
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-5 py-2.5 mb-6 sm:mb-8">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-300">Para cada perfil</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5">
            Ha um Lugar Para <span className="text-yellow-400">Voce</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Seja atleta, organizador ou fa — o Sportio tem algo especial para voce
          </p>
        </div>

        {/* Mobile */}
        <div className="grid grid-cols-2 gap-5 sm:hidden">
          {USER_TYPES.map((userType) => {
            const IconComponent = USER_TYPE_ICON_MAP[userType.icon] || Users;
            const colors = typeColors[userType.color] || typeColors["text-blue-500"];
            return (
              <a key={userType.id} href={userType.href} className="group flex flex-col items-center text-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:bg-white/10">
                <div className={cn("mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg", colors.gradient)}>
                  <IconComponent className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white leading-tight">{userType.name}</h3>
              </a>
            );
          })}
        </div>

        {/* Desktop */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {USER_TYPES.map((userType) => {
            const IconComponent = USER_TYPE_ICON_MAP[userType.icon] || Users;
            const colors = typeColors[userType.color] || typeColors["text-blue-500"];
            return (
              <a key={userType.id} href={userType.href} className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-10 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:-translate-y-2 hover:shadow-2xl">
                <div className={cn("mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg", colors.gradient)}>
                  <IconComponent className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{userType.name}</h3>
                <p className="text-gray-400 leading-relaxed mb-6">{userType.description}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 transition-all group-hover:gap-3">
                  Saiba mais
                  <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            );
          })}
        </div>
      </SectionContainer>
    </section>
  );
}

// ============================================
// TESTIMONIALS Section
// ============================================

function TestimonialsSection() {
  const testimonials = [
    { quote: "Comecei jogando futebol e hoje tiro $2.000 por mes competindo e apostando. O Sportio transformou minha paixao em renda real.", author: "Joao Silva", role: "Atleta de Futebol", earnings: "R$ 2.000/mes", color: "from-blue-500 to-blue-700" },
    { quote: "Organizei 12 torneios e lucrei R$ 15 mil em tres meses. Tudo automatizado pela plataforma.", author: "Maria Santos", role: "Organizadora", earnings: "R$ 15.000", color: "from-yellow-400 to-amber-500" },
    { quote: "Comecei apostando 50 GCoins e hoje ja saquei R$ 1.800 via PIX.", author: "Pedro Costa", role: "Apostador", earnings: "R$ 1.800", color: "from-blue-400 to-blue-600" },
  ];

  return (
    <section className="relative py-24 sm:py-32 lg:py-40 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <SectionContainer>
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-5 py-2.5 mb-6 sm:mb-8">
            <Star className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-700">Depoimentos reais</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-5">
            Quem Ja Esta <span className="text-yellow-500">Ganhando</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.author} className="group relative rounded-3xl border border-gray-100 bg-white p-8 sm:p-10 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className={cn("inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-4 py-2 mb-6", t.color)}>
                <Coins className="h-4 w-4 text-white" />
                <span className="text-sm font-bold text-white">{t.earnings}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-lg font-bold text-white", t.color)}>
                  {t.author.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-base font-bold text-gray-900">{t.author}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}

// ============================================
// CTA Section
// ============================================

function CTASection() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <SectionContainer narrow className="relative text-center">
        <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-yellow-400/20 backdrop-blur-sm shadow-2xl">
          <Coins className="h-10 w-10 text-yellow-400" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
          Comece a Ganhar com Seu Esporte Hoje
        </h2>

        <p className="text-base sm:text-xl text-blue-200 mb-10 max-w-2xl mx-auto leading-relaxed">
          Cadastro gratuito. Ganhe GCoins instantaneamente ao criar sua conta.
        </p>

        <a
          href="/register"
          className="group inline-flex items-center gap-3 rounded-2xl bg-yellow-400 px-10 py-5 text-base sm:text-lg font-bold text-blue-900 shadow-2xl shadow-yellow-400/30 transition-all duration-300 hover:bg-yellow-300 hover:-translate-y-1 hover:scale-105"
        >
          Cadastre-se e comece a ganhar
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </a>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-blue-200">
          <div className="flex items-center gap-2.5">
            <Lock className="h-4 w-4" />
            <span className="text-sm">100% seguro</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Zap className="h-4 w-4" />
            <span className="text-sm">PIX instantaneo</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Users className="h-4 w-4" />
            <span className="text-sm">12.500+ atletas</span>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}

// ============================================
// FAQ Section
// ============================================

function FAQSection() {
  const faqs = [
    { question: "O que e o Sportio?", answer: "O Sportio e a plataforma esportiva mais completa do Brasil. Conectamos atletas, organizadores, marcas, fas e arbitros em um ecossistema digital onde voce pode competir em torneios, ganhar GCoins e transformar sua paixao pelo esporte em renda real." },
    { question: "O que sao GCoins?", answer: "GCoins sao a moeda digital do Sportio. Existem dois tipos: GCoins Reais (convertidos em dinheiro via PIX) e GCoins de Gamificacao (recompensas por engajamento, trocaveis por produtos exclusivos)." },
    { question: "Como ganho dinheiro no Sportio?", answer: "Participe e venca torneios, organize eventos, construa uma base de torcedores, de palpites certeiros e como marca, patrocine atletas. Os GCoins Reais podem ser sacados via PIX a qualquer momento." },
    { question: "E seguro usar o Sportio?", answer: "100%. Sistema antifraude com IA, validacao por arbitros certificados e total transparencia nas transacoes." },
    { question: "Quais esportes sao suportados?", answer: "13 modalidades: Futebol, Beach Tennis, Corrida, CrossFit, Volei, Futevolei, E-Sports, Basquete, Natacao, Tenis, Skate, Lutas e Ciclismo." },
    { question: "Preciso pagar para usar?", answer: "Nao! Criar uma conta e 100% gratuito. Participe de torneios gratuitos, interaja na comunidade e ganhe GCoins sem custo." },
  ];

  return (
    <section className="relative py-24 sm:py-32 lg:py-40 bg-gray-50 overflow-hidden">
      <SectionContainer narrow>
        <div className="text-center mb-14 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-5">
            Perguntas <span className="text-blue-600">Frequentes</span>
          </h2>
        </div>

        <div className="space-y-5">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-md open:shadow-lg open:border-blue-200">
              <summary className="flex cursor-pointer items-center justify-between p-6 sm:p-7 [&::-webkit-details-marker]:hidden">
                <span className="pr-6 text-base sm:text-lg font-bold text-gray-900 group-open:text-blue-600 transition-colors">
                  {faq.question}
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 transition-all duration-300 group-open:rotate-180 group-open:bg-blue-100">
                  <ChevronDown className="h-4 w-4 text-gray-500 group-open:text-blue-600" />
                </span>
              </summary>
              <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-base text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </SectionContainer>
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
