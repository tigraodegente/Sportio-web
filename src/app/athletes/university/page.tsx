import {
  GraduationCap,
  Trophy,
  Star,
  Users,
  Award,
  BookOpen,
  ChevronRight,
  ArrowRight,
  Target,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Atletas Universitários | Sportio",
  description:
    "Compete pela sua universidade, ganhe bolsas de estudo e construa sua marca pessoal. Sportio conecta atletas universitários a oportunidades reais.",
};

const benefits = [
  {
    title: "Bolsas de estudo",
    description:
      "Destaque-se no esporte e conquiste bolsas parciais ou integrais em universidades parceiras.",
    icon: BookOpen,
  },
  {
    title: "Reconhecimento acadêmico",
    description:
      "Seu desempenho esportivo é registrado e pode ser usado para horas complementares e currículo.",
    icon: Award,
  },
  {
    title: "Competições CNU / Jogos Universitários",
    description:
      "Participe de competições universitárias oficiais e ganhe GCoins por cada resultado.",
    icon: Trophy,
  },
  {
    title: "Construir marca pessoal cedo",
    description:
      "Crie seu perfil profissional de atleta enquanto ainda está na universidade. Saia na frente.",
    icon: Star,
  },
  {
    title: "Networking esportivo",
    description:
      "Conecte-se com atletas de outras universidades, treinadores e recrutadores.",
    icon: Users,
  },
  {
    title: "Torneios interuniversitários",
    description:
      "Desafie outras universidades em torneios exclusivos com premiação em GCoins.",
    icon: Target,
  },
];

const earnings = [
  {
    level: "Calouro",
    range: "R$ 200 - 400/mês",
    description:
      "Participe de desafios semanais e torneios internos da sua universidade.",
    color: "bg-blue-50 border-blue-200",
    accent: "text-blue-600",
  },
  {
    level: "Veterano",
    range: "R$ 400 - 700/mês",
    description:
      "Compete em ligas interuniversitárias e ganhe bônus por representar sua instituição.",
    color: "bg-blue-100 border-blue-300",
    accent: "text-blue-700",
  },
  {
    level: "Destaque",
    range: "R$ 700 - 1.000/mês",
    description:
      "Top do ranking universitário, bolsas de estudo e primeiros patrocínios.",
    color: "bg-blue-200 border-blue-400",
    accent: "text-blue-800",
  },
];

export default function AthletesUniversityPage() {
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
            <span className="text-white font-medium">Universitário</span>
          </nav>

          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <GraduationCap className="h-4 w-4" />
              Atleta Universitário
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Compete pela Sua Universidade e Ganhe
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-100 sm:text-xl">
              Bolsas de estudo, competições interuniversitárias e networking.
              Transforme seu esporte universitário em oportunidade.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/register?persona=athlete&type=university"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
              >
                Cadastrar como Universitário
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
              Por Que Ser Atleta Universitário no Sportio
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Oportunidades pensadas para quem compete enquanto estuda.
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
              Potencial de Ganhos
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Ganhe GCoins competindo pela sua universidade e em torneios abertos.
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
                &ldquo;Ganhei uma bolsa parcial graças ao meu ranking no
                Sportio.&rdquo;
              </p>
            </blockquote>
            <div className="mt-6">
              <p className="font-semibold text-gray-900">Lucas Oliveira</p>
              <p className="text-sm text-gray-500">
                Atleta universitário de vôlei
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
              Represente Sua Universidade e Ganhe
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Cadastro gratuito. Comece a competir e ganhar GCoins representando
              sua instituição.
            </p>
            <a
              href="/register?persona=athlete&type=university"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
            >
              Criar Minha Conta Universitária
              <ChevronRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
