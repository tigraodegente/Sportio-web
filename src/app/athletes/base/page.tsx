import {
  Trophy,
  Star,
  Users,
  Award,
  ChevronRight,
  ArrowRight,
  Target,
  Shield,
  Medal,
  Eye,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Atletas de Base | Sportio — O Futuro do Esporte",
  description:
    "Categorias de formação com proteção para menores. Desenvolvimento de habilidades, competições por faixa etária e visibilidade para olheiros.",
};

const benefits = [
  {
    title: "Desenvolvimento de habilidades",
    description:
      "Acompanhe sua evolução com estatísticas detalhadas e metas de desenvolvimento por faixa etária.",
    icon: Target,
  },
  {
    title: "Competições por faixa etária",
    description:
      "Torneios organizados por categoria (sub-13, sub-15, sub-17) para competições justas e equilibradas.",
    icon: Trophy,
  },
  {
    title: "Acompanhamento por responsáveis",
    description:
      "Pais e responsáveis acompanham desempenho, agenda e resultados em tempo real pelo app.",
    icon: Users,
  },
  {
    title: "Selo de categoria de base",
    description:
      "Identificação especial no perfil que destaca o atleta como categoria de formação.",
    icon: Award,
  },
  {
    title: "Visibilidade para olheiros",
    description:
      "Clubes e olheiros acompanham os destaques das categorias de base na plataforma.",
    icon: Eye,
  },
  {
    title: "Ambiente seguro",
    description:
      "Plataforma com proteções específicas para menores de idade. Segurança em primeiro lugar.",
    icon: Shield,
  },
];

const protections = [
  {
    title: "Conta supervisionada por responsável",
    description:
      "Todo atleta de base tem um responsável vinculado que aprova atividades e acompanha a conta.",
    icon: UserCheck,
  },
  {
    title: "Sem apostas",
    description:
      "Atletas de base não têm acesso a funcionalidades de apostas ou desafios com dinheiro real.",
    icon: Shield,
  },
  {
    title: "Sem saque direto",
    description:
      "GCoins acumulados só podem ser sacados com autorização expressa do responsável legal.",
    icon: Award,
  },
];

export default function AthletesBasePage() {
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
            <span className="text-white font-medium">Base</span>
          </nav>

          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Medal className="h-4 w-4" />
              Atleta de Base
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Categorias de Formação: O Futuro Começa Aqui
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-100 sm:text-xl">
              Desenvolvimento, competições por faixa etária e proteção para
              menores. O ambiente ideal para o atleta do futuro crescer.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/register?persona=athlete&type=base"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
              >
                Cadastrar Atleta de Base
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
              Formação Completa Para Jovens Atletas
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tudo que um atleta em formação precisa para se desenvolver com
              segurança.
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

      {/* Proteção de Menores */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Proteção e Segurança
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              A segurança dos jovens atletas é nossa prioridade absoluta.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {protections.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-blue-100 bg-blue-50 p-8 text-center transition-all hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-200 text-blue-700">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {item.description}
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
                &ldquo;Comecei a jogar torneios pelo Sportio e já fui chamado
                pra peneira de um clube.&rdquo;
              </p>
            </blockquote>
            <div className="mt-6">
              <p className="font-semibold text-gray-900">Pedro Henrique, 16</p>
              <p className="text-sm text-gray-500">
                Jogador de futebol sub-17
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
              O Futuro do Esporte Começa Agora
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Cadastre o jovem atleta com acompanhamento do responsável.
              Seguro, gratuito e cheio de oportunidades.
            </p>
            <a
              href="/register?persona=athlete&type=base"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
            >
              Cadastrar Atleta de Base
              <ChevronRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
