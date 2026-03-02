import {
  Users,
  TrendingUp,
  BarChart3,
  Trophy,
  Target,
  FlaskConical,
  ArrowRight,
  Star,
  Building2,
  Eye,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Marcas | Sportio - Conecte Sua Marca a 500k+ Atletas",
  description:
    "Alcance consumidores apaixonados pelo esporte com ROI de 3-5x. Segmentação precisa e dados reais para suas campanhas esportivas.",
};

const steps = [
  {
    number: "01",
    title: "Cadastre sua marca",
    description:
      "Crie o perfil da sua empresa e defina seus objetivos de marketing esportivo.",
    icon: Building2,
  },
  {
    number: "02",
    title: "Escolha seu público",
    description:
      "Segmente por esporte, região, faixa etária, nível e comportamento dos atletas.",
    icon: Target,
  },
  {
    number: "03",
    title: "Lance campanha",
    description:
      "Patrocine torneios, crie desafios ou distribua recompensas em GCoins.",
    icon: TrendingUp,
  },
  {
    number: "04",
    title: "Acompanhe resultados",
    description:
      "Analytics em tempo real: impressões, engajamento, conversões e ROI detalhado.",
    icon: BarChart3,
  },
];

const benefits = [
  {
    title: "500k+ atletas segmentados",
    description:
      "Acesso a uma base ativa e engajada de atletas em mais de 30 modalidades esportivas.",
    icon: Users,
  },
  {
    title: "ROI 3-5x comprovado",
    description:
      "Retorno sobre investimento superior às mídias tradicionais, com dados para comprovar.",
    icon: TrendingUp,
  },
  {
    title: "Analytics em tempo real",
    description:
      "Dashboard completo com métricas de impressões, cliques, engajamento e conversões.",
    icon: BarChart3,
  },
  {
    title: "Patrocínio de torneios",
    description:
      "Associe sua marca a eventos esportivos e ganhe visibilidade entre participantes e fãs.",
    icon: Trophy,
  },
  {
    title: "Campanhas segmentadas",
    description:
      "Alcance exatamente o público que interessa: por esporte, nível, região e perfil.",
    icon: Target,
  },
  {
    title: "A/B testing integrado",
    description:
      "Teste diferentes criativos e mensagens para maximizar seus resultados.",
    icon: FlaskConical,
  },
];

const roiExamples = [
  {
    investment: "Campanha R$ 500",
    result: "1.200 atletas impactados",
    detail:
      "Distribuição de GCoins como recompensa. Alta taxa de engajamento e recall de marca.",
    color: "bg-blue-50 border-blue-200",
    accent: "text-blue-600",
  },
  {
    investment: "Patrocínio R$ 2.000",
    result: "700 jogadores + 2.000 views",
    detail:
      "Naming rights de torneio, logo em chaveamento e presença nos resultados.",
    color: "bg-blue-100 border-blue-300",
    accent: "text-blue-700",
  },
  {
    investment: "Liga R$ 10.000",
    result: "5.000 atletas + 25.000 impressões",
    detail:
      "Patrocínio de circuito mensal com presença recorrente em todas as etapas.",
    color: "bg-blue-200 border-blue-400",
    accent: "text-blue-800",
  },
];

export default function BrandsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 pt-32 pb-20 sm:pt-40 sm:pb-28 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Building2 className="h-4 w-4" />
              Para Marcas
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Conecte Sua Marca a 500k+ Atletas
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-100 sm:text-xl">
              Alcance consumidores apaixonados pelo esporte com ROI de 3-5x.
              Segmentação precisa e dados reais.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/register?persona=brand"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
              >
                Falar com Comercial
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white/30 hover:bg-white/10"
              >
                Ver Resultados
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
              Lance campanhas esportivas segmentadas em minutos.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="text-sm font-bold text-blue-500">
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
              Por Que Marcas Escolhem a Sportio
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Marketing esportivo com dados reais e resultados mensuráveis.
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
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
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

      {/* ROI Examples */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Exemplos de ROI
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Veja o retorno real que marcas estão obtendo na plataforma.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {roiExamples.map((example) => (
              <div
                key={example.investment}
                className={cn(
                  "rounded-2xl border p-8 text-center transition-all hover:shadow-md",
                  example.color
                )}
              >
                <h3
                  className={cn(
                    "text-sm font-bold uppercase tracking-wider",
                    example.accent
                  )}
                >
                  {example.investment}
                </h3>
                <div className="my-4 flex items-center justify-center gap-2">
                  <Eye className="h-5 w-5 text-gray-400" />
                  <p className="text-2xl font-bold text-gray-900">
                    {example.result}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">
                  {example.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Star className="mx-auto h-8 w-8 text-yellow-400" />
            <blockquote className="mt-8">
              <p className="text-xl font-medium leading-relaxed text-gray-900 sm:text-2xl">
                &ldquo;Cada torneio vira uma campanha. A visibilidade e o ROI
                são imediatos.&rdquo;
              </p>
            </blockquote>
            <div className="mt-6">
              <p className="font-semibold text-gray-900">
                Consultora de Marketing Esportivo
              </p>
              <p className="text-sm text-gray-500">
                Agência parceira Sportio
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
              Pronto Para Alcançar Atletas Apaixonados?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Fale com nosso time comercial e descubra como sua marca pode
              crescer com o esporte.
            </p>
            <a
              href="/register?persona=brand"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
            >
              Agendar Demonstração
              <ChevronRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
