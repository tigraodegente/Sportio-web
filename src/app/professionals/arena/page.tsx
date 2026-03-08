import {
  Building2,
  Calendar,
  TrendingUp,
  Users,
  ArrowRight,
  Star,
  ChevronRight,
  UserCheck,
  Zap,
  Trophy,
  DollarSign,
  Clock,
  BarChart3,
  Flame,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Donos de Arena | Sportio",
  description:
    "Maximize a ocupacao da sua arena com reservas inteligentes, torneios automaticos e cashback. Preencha horarios ociosos e aumente sua receita.",
};

const steps = [
  {
    number: "01",
    title: "Cadastre sua arena",
    description:
      "Registre seu espaco com fotos, quadras disponiveis, horarios e servicos extras.",
    icon: Building2,
  },
  {
    number: "02",
    title: "Ative reservas online",
    description:
      "Atletas reservam e pagam online. Voce recebe notificacoes e confirmacoes automaticas.",
    icon: Calendar,
  },
  {
    number: "03",
    title: "Receba torneios",
    description:
      "Torneios Sportio sao automaticamente sugeridos para sua arena. Mais jogadores, mais receita.",
    icon: Trophy,
  },
  {
    number: "04",
    title: "Acompanhe resultados",
    description:
      "Dashboard com metricas de ocupacao, receita e feedback dos atletas em tempo real.",
    icon: BarChart3,
  },
];

const benefits = [
  {
    title: "Cashback automatico",
    description:
      "Atletas recebem cashback em GCoins por reservas, incentivando recorrencia e fidelidade.",
    icon: DollarSign,
  },
  {
    title: "Horarios ociosos preenchidos",
    description:
      "IA sugere promocoes para horarios de baixa demanda. Aumente a ocupacao em ate 40%.",
    icon: Clock,
  },
  {
    title: "Torneios automaticos",
    description:
      "A Sportio organiza torneios no seu espaco automaticamente. Voce ganha comissao por torneio.",
    icon: Trophy,
  },
  {
    title: "Comissao por torneios",
    description:
      "Ganhe uma porcentagem de cada inscricao em torneios hospedados na sua arena.",
    icon: TrendingUp,
  },
  {
    title: "Servicos adicionais",
    description:
      "Monetize churrasqueira, aluguel de coletes, bebidas e outros servicos pelo app.",
    icon: Flame,
  },
  {
    title: "Verificacao de qualidade",
    description:
      "Selo de arena verificada para ganhar destaque e confianca dos atletas na plataforma.",
    icon: ShieldCheck,
  },
];

const comparison = [
  {
    feature: "Reservas online 24/7",
    sportio: true,
    others: "Parcial",
  },
  {
    feature: "Torneios automaticos",
    sportio: true,
    others: "Nao",
  },
  {
    feature: "Cashback para atletas",
    sportio: true,
    others: "Nao",
  },
  {
    feature: "Preenchimento de ociosos",
    sportio: true,
    others: "Nao",
  },
  {
    feature: "Dashboard de metricas",
    sportio: true,
    others: "Basico",
  },
  {
    feature: "Comissao por torneios",
    sportio: true,
    others: "Nao",
  },
  {
    feature: "Servicos adicionais no app",
    sportio: true,
    others: "Nao",
  },
];

const earnings = [
  {
    level: "Arena pequena",
    range: "R$ 3.000 - 8.000/mes",
    description:
      "1-2 quadras, horarios comerciais. Receita extra com torneios e servicos adicionais.",
    color: "bg-yellow-50 border-yellow-200",
    accent: "text-yellow-700",
  },
  {
    level: "Arena media",
    range: "R$ 10.000 - 25.000/mes",
    description:
      "3-5 quadras com ocupacao otimizada, torneios semanais e servicos premium.",
    color: "bg-yellow-100 border-yellow-300",
    accent: "text-yellow-800",
  },
  {
    level: "Arena grande",
    range: "R$ 30.000 - 60.000/mes",
    description:
      "6+ quadras, eventos de liga, contratos corporativos e receita diversificada.",
    color: "bg-blue-100 border-blue-300",
    accent: "text-blue-700",
  },
];

export default function ArenaPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 pt-32 pb-20 sm:pt-40 sm:pb-28 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Building2 className="h-4 w-4" />
              Donos de Arena
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Donos de Arena: Maximize Sua Ocupacao
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-100 sm:text-xl">
              Cashback automatico em reservas, preenchimento de horarios ociosos
              e torneios automaticos no seu espaco.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/register?persona=arena"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
              >
                Cadastrar Minha Arena
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white/30 hover:bg-white/10"
              >
                Como Funciona
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Como Funciona
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Em 4 passos, conecte sua arena a milhares de atletas.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="text-sm font-bold text-yellow-600">
                  Passo {step.number}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Por Que a Sportio?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Ferramentas exclusivas para donos de arena maximizarem receita.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className={cn(
                  "rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                )}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Sportio vs Outras Plataformas
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Veja por que donos de arena escolhem a Sportio.
            </p>
          </div>
          <div className="mt-16 mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <div className="grid grid-cols-3 bg-gray-50 p-4 text-sm font-semibold text-gray-700">
                <span>Recurso</span>
                <span className="text-center">Sportio</span>
                <span className="text-center">Outras</span>
              </div>
              {comparison.map((row, i) => (
                <div
                  key={row.feature}
                  className={cn(
                    "grid grid-cols-3 items-center p-4 text-sm",
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  )}
                >
                  <span className="font-medium text-gray-900">
                    {row.feature}
                  </span>
                  <span className="text-center font-semibold text-green-600">
                    Sim
                  </span>
                  <span className="text-center text-gray-400">
                    {row.others}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Earnings */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Potencial de Receita
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Estimativas baseadas em arenas parceiras da Sportio.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {earnings.map((tier) => (
              <div
                key={tier.level}
                className={cn(
                  "rounded-2xl border p-8 text-center transition-all hover:shadow-md",
                  tier.color
                )}
              >
                <h3
                  className={cn(
                    "text-sm font-bold uppercase tracking-wider",
                    tier.accent
                  )}
                >
                  {tier.level}
                </h3>
                <p className="mt-4 text-3xl font-bold text-gray-900">
                  {tier.range}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  {tier.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Star className="mx-auto h-8 w-8 text-yellow-400" />
            <blockquote className="mt-8">
              <p className="text-xl font-medium leading-relaxed text-gray-900 sm:text-2xl">
                &ldquo;Minha arena tinha 30% de ocupacao nos horarios da manha.
                Com a Sportio, preenchemos esses horarios com promocoes
                inteligentes e torneios automaticos. Hoje temos 85% de ocupacao
                geral.&rdquo;
              </p>
            </blockquote>
            <div className="mt-6">
              <p className="font-semibold text-gray-900">Marcos Vieira</p>
              <p className="text-sm text-gray-500">
                Dono de arena de beach tennis
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-16 text-center shadow-xl sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto Para Maximizar Sua Arena?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Junte-se a centenas de arenas que ja aumentaram sua ocupacao com a
              Sportio. Cadastro gratuito e sem compromisso.
            </p>
            <a
              href="/register?persona=arena"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
            >
              Cadastrar Minha Arena
              <ChevronRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
