import {
  Trophy,
  Star,
  Users,
  Award,
  ChevronRight,
  ArrowRight,
  Target,
  Zap,
  Medal,
  Handshake,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Atletas Femininas | Sportio — Igualdade no Esporte",
  description:
    "Premiação igualitária, torneios exclusivos e visibilidade. No Sportio, atletas femininas têm as mesmas oportunidades e recompensas.",
};

const benefits = [
  {
    title: "Premiação igualitária",
    description:
      "Mesmos GCoins, mesmos prêmios e mesma valorização que qualquer outro atleta da plataforma.",
    icon: Trophy,
  },
  {
    title: "Torneios exclusivos femininos + mistos",
    description:
      "Participe de torneios femininos dedicados ou competições mistas. Você escolhe.",
    icon: Target,
  },
  {
    title: "Comunidade de atletas mulheres",
    description:
      "Conecte-se com outras atletas, troque experiências e fortaleça a rede feminina no esporte.",
    icon: Users,
  },
  {
    title: "Patrocinadores focados em esporte feminino",
    description:
      "Marcas que investem no esporte feminino encontram você diretamente na plataforma.",
    icon: Handshake,
  },
  {
    title: "Visibilidade e marca pessoal",
    description:
      "Destaque no ranking feminino, perfil profissional e exposição para mídia e patrocinadores.",
    icon: Star,
  },
  {
    title: "Igualdade de oportunidade",
    description:
      "Mesmos recursos, mesmas ferramentas e mesmo suporte que todos os atletas da plataforma.",
    icon: Heart,
  },
];

const earnings = [
  {
    level: "Amadora",
    range: "R$ 200 - 500/mês",
    description:
      "Torneios locais, desafios semanais e primeiros GCoins. Mesma tabela para todos.",
    color: "bg-blue-50 border-blue-200",
    accent: "text-blue-600",
  },
  {
    level: "Intermediária",
    range: "R$ 800 - 2.000/mês",
    description:
      "Ligas regionais, patrocínios iniciais e visibilidade crescente na plataforma.",
    color: "bg-blue-100 border-blue-300",
    accent: "text-blue-700",
  },
  {
    level: "Avançada",
    range: "R$ 2.000 - 5.000/mês",
    description:
      "Top do ranking, contratos com marcas e convites para eventos premium.",
    color: "bg-blue-200 border-blue-400",
    accent: "text-blue-800",
  },
];

export default function AthletesWomenPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 pt-32 pb-20 sm:pt-40 sm:pb-28 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-blue-200">
            <Link href="/athletes" className="hover:text-white transition-colors">
              Atletas
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white font-medium">Feminina</span>
          </nav>

          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Medal className="h-4 w-4" />
              Atleta Feminina
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Igualdade de Premiação. Igualdade de Oportunidade.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-100 sm:text-xl">
              No Sportio, atletas femininas ganham os mesmos GCoins, os mesmos
              prêmios e têm a mesma visibilidade que atletas masculinos.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/register?persona=athlete&type=women"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
              >
                Começar Agora
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Esporte Feminino com Igualdade Real
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Não é só discurso. É premiação igual, visibilidade igual e
              oportunidade igual.
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
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Mesma Tabela de Ganhos. Sem Diferença.
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Os ganhos são baseados em desempenho, não em gênero.
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
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Star className="mx-auto h-8 w-8 text-yellow-400" />
            <blockquote className="mt-8">
              <p className="text-xl font-medium leading-relaxed text-gray-900 sm:text-2xl">
                &ldquo;No Sportio a premiação é igual. Isso mudou tudo pra
                mim.&rdquo;
              </p>
            </blockquote>
            <div className="mt-6">
              <p className="font-semibold text-gray-900">Juliana Martins</p>
              <p className="text-sm text-gray-500">Atleta de futevôlei</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-16 text-center shadow-xl sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Seu Esporte, Sua Renda. Sem Desigualdade.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Cadastre-se gratuitamente e comece a competir com igualdade de
              premiação e oportunidade.
            </p>
            <a
              href="/register?persona=athlete&type=women"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
            >
              Criar Minha Conta Grátis
              <ChevronRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
