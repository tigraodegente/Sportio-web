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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ============================================
// Icon Mapping
// ============================================

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
// HERO Section
// ============================================

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 pt-24 pb-16 sm:pt-32 sm:pb-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400 animate-fade-in">
            <Zap className="h-4 w-4" />
            <span>Plataforma #1 de esportes no Brasil</span>
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl animate-slide-up">
            Transforme Esporte em{" "}
            <span className="text-gradient-hero">Renda Real</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300 sm:text-xl animate-slide-up animate-delay-100">
            A plataforma esportiva que transforma paixão em lucro real.
            Junte-se a mais de 12.500 atletas que já estão ganhando.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up animate-delay-200">
            <a
              href="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
            >
              Criar Conta Grátis
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#como-funciona"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-8 py-4 text-lg font-semibold text-slate-300 transition-all duration-300 hover:border-slate-400 hover:text-white hover:bg-white/5"
            >
              <Play className="h-5 w-5" />
              Saiba Mais
            </a>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 sm:mt-20 animate-slide-up animate-delay-300">
          <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
              {[
                { value: "12.500+", label: "Atletas", icon: Users },
                { value: "850", label: "Torneios/mês", icon: Trophy },
                { value: "500k+", label: "Usuários", icon: Target },
                { value: "13", label: "Esportes", icon: Medal },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="mb-2 flex justify-center">
                    <stat.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-slate-400">
                    {stat.label}
                  </div>
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
// HOW IT WORKS Section
// ============================================

function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Cadastre-se",
      description: "Crie sua conta grátis em segundos",
      icon: UserPlus,
    },
    {
      number: "2",
      title: "Escolha seu esporte",
      description: "Futebol, beach tennis, corrida e mais",
      icon: Medal,
    },
    {
      number: "3",
      title: "Participe",
      description: "Torneios, desafios e competições",
      icon: Trophy,
    },
    {
      number: "4",
      title: "Ganhe GCoins",
      description: "Converta em dinheiro real via PIX",
      icon: Coins,
    },
  ];

  return (
    <section id="como-funciona" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Simples e rápido
          </span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Como Funciona
          </h2>
          <p className="text-lg text-gray-600">
            Em 4 passos simples você começa a ganhar com seu esporte favorito
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative text-center">
              {/* Connector line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="absolute top-10 left-[calc(50%+2rem)] hidden h-0.5 w-[calc(100%-4rem)] bg-gradient-to-r from-emerald-300 to-emerald-100 lg:block" />
              )}

              {/* Step circle */}
              <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-100" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-xl font-bold text-white shadow-lg shadow-emerald-500/25">
                  {step.number}
                </div>
              </div>

              {/* Icon */}
              <div className="mb-4 flex justify-center">
                <step.icon className="h-6 w-6 text-emerald-600" />
              </div>

              {/* Content */}
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// GCOINS ECONOMY Section
// ============================================

function GCoinsEconomySection() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-amber-600">
            Economia digital
          </span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            A Economia do Sportio
          </h2>
          <p className="text-lg text-gray-600">
            Dois tipos de GCoins para maximizar seus ganhos e recompensas
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* GCoins Reais Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 sm:p-10">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-emerald-500/5 blur-2xl transition-all duration-500 group-hover:h-40 group-hover:w-40 group-hover:bg-emerald-500/10" />

            <div className="relative">
              {/* Icon + Badge */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100">
                  <CircleDollarSign className="h-7 w-7 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    GCoins Reais
                  </h3>
                  <span className="inline-block rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700">
                    Dinheiro de verdade
                  </span>
                </div>
              </div>

              <p className="mb-6 text-gray-600">
                Ganhe dinheiro de verdade praticando seu esporte favorito.
                Converta GCoins Reais diretamente para sua conta via PIX.
              </p>

              {/* Bullet points */}
              <ul className="space-y-3">
                {[
                  "Vitórias em torneios",
                  "Prêmios de competições",
                  "Assinaturas de torcedores",
                  "Saque via PIX instantâneo",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* GCoins Gamificação Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 sm:p-10">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-amber-500/5 blur-2xl transition-all duration-500 group-hover:h-40 group-hover:w-40 group-hover:bg-amber-500/10" />

            <div className="relative">
              {/* Icon + Badge */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100">
                  <Gift className="h-7 w-7 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    GCoins Gamificação
                  </h3>
                  <span className="inline-block rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-700">
                    Recompensas e vantagens
                  </span>
                </div>
              </div>

              <p className="mb-6 text-gray-600">
                Ganhe recompensas e vantagens exclusivas por participar
                ativamente da comunidade Sportio.
              </p>

              {/* Bullet points */}
              <ul className="space-y-3">
                {[
                  "Engajamento social",
                  "Desafios técnicos",
                  "Rankings especiais",
                  "Troque por produtos",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100">
                      <Check className="h-3.5 w-3.5 text-amber-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SPORTS GRID Section
// ============================================

function SportsGridSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Variedade para todos
          </span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            13 Esportes Para Você
          </h2>
          <p className="text-lg text-gray-600">
            Do futebol ao e-sports, encontre a modalidade perfeita para o seu
            estilo
          </p>
        </div>

        {/* Sports Grid */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {SPORTS.map((sport) => {
            const IconComponent = SPORT_ICON_MAP[sport.icon] || Target;
            return (
              <div
                key={sport.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-gray-200"
              >
                {/* Icon */}
                <div
                  className={cn(
                    "mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                    sport.color === "text-emerald-500" && "bg-emerald-100",
                    sport.color === "text-amber-500" && "bg-amber-100",
                    sport.color === "text-blue-500" && "bg-blue-100",
                    sport.color === "text-red-500" && "bg-red-100",
                    sport.color === "text-yellow-500" && "bg-yellow-100",
                    sport.color === "text-orange-500" && "bg-orange-100",
                    sport.color === "text-purple-500" && "bg-purple-100",
                    sport.color === "text-orange-600" && "bg-orange-100",
                    sport.color === "text-cyan-500" && "bg-cyan-100",
                    sport.color === "text-lime-500" && "bg-lime-100",
                    sport.color === "text-pink-500" && "bg-pink-100",
                    sport.color === "text-red-600" && "bg-red-100",
                    sport.color === "text-teal-500" && "bg-teal-100"
                  )}
                >
                  <IconComponent className={cn("h-6 w-6", sport.color)} />
                </div>

                {/* Name */}
                <h3 className="mb-1 text-lg font-semibold text-gray-900">
                  {sport.name}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-gray-500 line-clamp-2">
                  {sport.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// USER TYPES Section
// ============================================

function UserTypesSection() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Para cada perfil
          </span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Há um Lugar para Você no Sportio
          </h2>
          <p className="text-lg text-gray-600">
            Seja atleta, organizador, marca, fã, palpiteiro ou árbitro - o
            Sportio tem algo especial para você
          </p>
        </div>

        {/* User Type Cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {USER_TYPES.map((userType) => {
            const IconComponent =
              USER_TYPE_ICON_MAP[userType.icon] || Users;
            return (
              <a
                key={userType.id}
                href={userType.href}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-gray-200"
              >
                {/* Decorative corner accent */}
                <div
                  className={cn(
                    "absolute -top-10 -right-10 h-24 w-24 rounded-full opacity-10 transition-all duration-500 group-hover:opacity-20",
                    userType.color === "text-emerald-500" && "bg-emerald-500",
                    userType.color === "text-blue-500" && "bg-blue-500",
                    userType.color === "text-purple-500" && "bg-purple-500",
                    userType.color === "text-red-500" && "bg-red-500",
                    userType.color === "text-amber-500" && "bg-amber-500",
                    userType.color === "text-slate-500" && "bg-slate-500"
                  )}
                />

                {/* Icon */}
                <div
                  className={cn(
                    "mb-5 flex h-14 w-14 items-center justify-center rounded-xl",
                    userType.color === "text-emerald-500" && "bg-emerald-100",
                    userType.color === "text-blue-500" && "bg-blue-100",
                    userType.color === "text-purple-500" && "bg-purple-100",
                    userType.color === "text-red-500" && "bg-red-100",
                    userType.color === "text-amber-500" && "bg-amber-100",
                    userType.color === "text-slate-500" && "bg-slate-100"
                  )}
                >
                  <IconComponent
                    className={cn("h-7 w-7", userType.color)}
                  />
                </div>

                {/* Name */}
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {userType.name}
                </h3>

                {/* Description */}
                <p className="mb-4 text-gray-600 leading-relaxed">
                  {userType.description}
                </p>

                {/* Link */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-sm font-semibold transition-all duration-300 group-hover:gap-2",
                    userType.color
                  )}
                >
                  Saiba mais
                  <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// TESTIMONIALS Section
// ============================================

function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Comecei jogando torneios de futebol e hoje tiro R$ 2.000 por mês competindo e apostando.",
      author: "João Silva",
      role: "Atleta de Futebol",
      rating: 5,
    },
    {
      quote:
        "Organizei 12 torneios e lucrei R$ 15 mil em três meses. Tudo automatizado.",
      author: "Maria Santos",
      role: "Organizadora",
      rating: 5,
    },
    {
      quote:
        "Ganhei prêmios só por torcer e comentar no app. É viciante!",
      author: "Pedro Costa",
      role: "Fã/Torcedor",
      rating: 5,
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Depoimentos
          </span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Quem Já Está Ganhando
          </h2>
          <p className="text-lg text-gray-600">
            Veja o que nossos usuários estão dizendo sobre o Sportio
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              {/* Quote mark decorative */}
              <div className="absolute -top-3 left-8 text-5xl font-serif text-emerald-200 select-none">
                &ldquo;
              </div>

              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mb-6 text-gray-700 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-600">
                  {testimonial.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
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
// CTA Section
// ============================================

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 py-20 sm:py-24">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-amber-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* GCoin icon */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 animate-pulse-glow">
              <Coins className="h-8 w-8 text-emerald-400" />
            </div>
          </div>

          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Comece a Ganhar com Seu Esporte Hoje
          </h2>

          <p className="mb-10 text-lg text-slate-300">
            Cadastro em segundos &bull; Sem cartão de crédito &bull; Ganhe
            GCoins instantaneamente
          </p>

          <a
            href="/register"
            className="group inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-10 py-5 text-lg font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
          >
            Criar Minha Conta Grátis
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>Dados seguros</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span>PIX instantâneo</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-400" />
              <span>12.500+ atletas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FAQ Section
// ============================================

function FAQSection() {
  const faqs = [
    {
      question: "O que é o Sportio?",
      answer:
        "O Sportio é a plataforma esportiva mais completa do Brasil. Conectamos atletas, organizadores, marcas, fãs e árbitros em um ecossistema digital onde você pode competir em torneios, ganhar GCoins (nossa moeda digital), acompanhar estatísticas e transformar sua paixão pelo esporte em renda real. Suportamos 13 modalidades esportivas, desde futebol até e-sports.",
    },
    {
      question: "O que são GCoins?",
      answer:
        "GCoins são a moeda digital do Sportio. Existem dois tipos: GCoins Reais, que podem ser convertidos em dinheiro real via PIX (ganhos através de vitórias em torneios, prêmios e assinaturas de torcedores), e GCoins de Gamificação, que são recompensas por engajamento na plataforma (curtidas, comentários, desafios técnicos) e podem ser trocados por produtos e vantagens exclusivas.",
    },
    {
      question: "Como ganho dinheiro no Sportio?",
      answer:
        "Existem várias formas de ganhar dinheiro no Sportio: participe e vença torneios para ganhar GCoins Reais; organize torneios e lucre com inscrições e patrocínios; construa uma base de torcedores que assinem seu perfil; dê palpites certeiros em competições; e como marca, conecte-se com atletas para patrocínios. Os GCoins Reais podem ser sacados via PIX a qualquer momento.",
    },
    {
      question: "É seguro usar o Sportio?",
      answer:
        "Sim! A segurança é prioridade no Sportio. Utilizamos criptografia de ponta a ponta para proteger seus dados, autenticação em duas etapas, e todas as transações financeiras são protegidas por protocolos bancários seguros. Seu dinheiro em GCoins Reais está sempre disponível para saque, e nosso suporte está disponível 24/7 para qualquer dúvida.",
    },
    {
      question: "Quais esportes são suportados?",
      answer:
        "Atualmente o Sportio suporta 13 modalidades esportivas: Futebol, Beach Tennis, Corrida, CrossFit, Vôlei, Futevôlei, E-Sports, Basquete, Natação, Tênis, Skate, Lutas (MMA, Jiu-Jitsu, Boxe) e Ciclismo. Estamos constantemente expandindo nossa lista de esportes baseando-nos no feedback da comunidade.",
    },
    {
      question: "Preciso pagar para usar o Sportio?",
      answer:
        "Não! Criar uma conta no Sportio é 100% gratuito. Você pode participar de torneios gratuitos, interagir na comunidade e ganhar GCoins de Gamificação sem custo. Alguns torneios premium podem ter taxa de inscrição, mas esses valores são revertidos em premiação. Não existe mensalidade ou taxa escondida para usar a plataforma.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Tire suas dúvidas
          </span>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-gray-600">
            Tudo o que você precisa saber para começar no Sportio
          </p>
        </div>

        {/* FAQ Items */}
        <div className="mx-auto mt-16 max-w-3xl divide-y divide-gray-200">
          {faqs.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="flex cursor-pointer items-center justify-between py-6 text-left transition-colors hover:text-emerald-600 [&::-webkit-details-marker]:hidden">
                <span className="pr-6 text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {faq.question}
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 transition-all duration-300 group-open:rotate-180 group-open:border-emerald-500 group-open:bg-emerald-50">
                  <ChevronDown className="h-4 w-4 text-gray-500 group-open:text-emerald-600" />
                </span>
              </summary>
              <div className="pb-6 pr-12 text-gray-600 leading-relaxed">
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
// Main Page Component (Server Component)
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
