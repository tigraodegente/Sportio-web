import {
  Medal,
  Trophy,
  Star,
  UserCheck,
  Shield,
  Award,
  Handshake,
  ChevronRight,
  ArrowRight,
  BarChart3,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Atletas PRO | Sportio — Monetize Sua Carreira",
  description:
    "Atletas profissionais verificados ganham patrocínios diretos, destaque nacional e contratos com marcas. Monetize sua carreira esportiva com o Sportio.",
};

const verificationSteps = [
  {
    title: "Ranking / Federação",
    description: "Comprove seu ranking em federação oficial da sua modalidade.",
    icon: BarChart3,
  },
  {
    title: "Histórico de Torneios",
    description: "Apresente resultados em competições oficiais ou circuitos reconhecidos.",
    icon: Trophy,
  },
  {
    title: "Certificado de Atleta",
    description: "Envie certificado ou carteirinha de atleta profissional.",
    icon: Award,
  },
  {
    title: "Selo Verificado",
    description: "Após aprovação, seu perfil recebe o selo PRO com destaque na plataforma.",
    icon: Shield,
  },
];

const benefits = [
  {
    title: "Patrocínios diretos de marcas",
    description:
      "Marcas encontram você pelo seu desempenho e selo PRO. Receba propostas diretamente no seu perfil.",
    icon: Handshake,
  },
  {
    title: "Destaque nacional no ranking",
    description:
      "Atletas PRO aparecem em destaque nos rankings nacionais e regionais da plataforma.",
    icon: BarChart3,
  },
  {
    title: "Convites para eventos premium",
    description:
      "Acesso exclusivo a torneios de alto nível, exibições e eventos fechados para atletas PRO.",
    icon: Star,
  },
  {
    title: "Contratos com marcas",
    description:
      "Facilite negociações de contratos de patrocínio com ferramentas integradas na plataforma.",
    icon: Award,
  },
  {
    title: "GCoins multiplicados",
    description:
      "Atletas PRO ganham multiplicador de GCoins em torneios e desafios. Mais desempenho, mais recompensa.",
    icon: Zap,
  },
];

const earnings = [
  {
    level: "PRO Iniciante",
    range: "R$ 2.000 - 3.500/mês",
    description:
      "Patrocínios iniciais, torneios regionais e multiplicador PRO de GCoins.",
    color: "bg-blue-50 border-blue-200",
    accent: "text-blue-600",
  },
  {
    level: "PRO Consolidado",
    range: "R$ 3.500 - 5.000/mês",
    description:
      "Múltiplos patrocinadores, convites para circuitos nacionais e eventos premium.",
    color: "bg-blue-100 border-blue-300",
    accent: "text-blue-700",
  },
  {
    level: "Top 10 Nacional",
    range: "R$ 5.000 - 10.000+/mês",
    description:
      "Contratos fixos com marcas, destaque máximo na plataforma e convites internacionais.",
    color: "bg-yellow-50 border-yellow-300",
    accent: "text-yellow-700",
  },
];

export default function AthletesProPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 pt-32 pb-20 sm:pt-40 sm:pb-28 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-blue-200">
            <Link href="/athletes" className="hover:text-white transition-colors">
              Atletas
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white font-medium">PRO</span>
          </nav>

          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-yellow-400/20 px-4 py-2 text-sm font-medium text-yellow-300 backdrop-blur-sm">
              <Medal className="h-4 w-4" />
              Atleta PRO
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Atletas PRO: Monetize Sua Carreira Esportiva
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-100 sm:text-xl">
              Selo verificado, patrocínios diretos e ganhos multiplicados.
              Leve sua carreira esportiva ao próximo nível.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/register?persona=athlete&type=pro"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
              >
                Quero Ser PRO
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Verificação PRO */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Verificação PRO
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprove seu nível profissional e ganhe o selo verificado.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {verificationSteps.map((step, i) => (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="text-sm font-bold text-blue-500">
                  Passo {String(i + 1).padStart(2, "0")}
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

      {/* Benefícios Exclusivos */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Benefícios Exclusivos PRO
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Vantagens que só atletas verificados têm acesso.
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

      {/* Potencial de Ganhos */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Potencial de Ganhos PRO
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Atletas PRO têm ganhos significativamente maiores com o multiplicador e patrocínios.
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
                  className={cn("text-sm font-bold uppercase tracking-wider", tier.accent)}
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
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Star className="mx-auto h-8 w-8 text-yellow-400" />
            <blockquote className="mt-8">
              <p className="text-xl font-medium leading-relaxed text-gray-900 sm:text-2xl">
                &ldquo;O selo PRO me deu visibilidade com marcas. Hoje tenho 3
                patrocinadores fixos.&rdquo;
              </p>
            </blockquote>
            <div className="mt-6">
              <p className="font-semibold text-gray-900">Fernando Costa</p>
              <p className="text-sm text-gray-500">
                Jogador profissional de beach tennis
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-blue-900 px-8 py-16 text-center shadow-xl sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto Para o Selo PRO?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Comprove seu nível, ganhe visibilidade e monetize sua carreira
              esportiva como nunca antes.
            </p>
            <a
              href="/register?persona=athlete&type=pro"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
            >
              Solicitar Verificação PRO
              <ChevronRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
