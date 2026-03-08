import {
  Trophy,
  Star,
  ChevronRight,
  ArrowRight,
  Target,
  Zap,
  Medal,
  Award,
  BarChart3,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Atletas Multi-Esporte | Sportio",
  description:
    "Pratica mais de um esporte? No Sportio seus GCoins acumulam de todas as modalidades. Mais esportes, mais ganhos.",
};

const benefits = [
  {
    title: "GCoins acumulam de TODOS os esportes",
    description:
      "Cada modalidade que você pratica gera GCoins. Todos somam no seu saldo total.",
    icon: Zap,
  },
  {
    title: "Ranking em cada modalidade",
    description:
      "Tenha um ranking independente em cada esporte. Destaque-se onde você é melhor.",
    icon: BarChart3,
  },
  {
    title: "Mais torneios = mais oportunidades",
    description:
      "Quanto mais esportes você pratica, mais torneios disponíveis e mais chances de ganhar.",
    icon: Trophy,
  },
  {
    title: "Perfil multi-esporte no ranking",
    description:
      "Seu perfil mostra todas as suas modalidades com estatísticas e conquistas de cada uma.",
    icon: Layers,
  },
  {
    title: "Desafios cross-sport",
    description:
      "Participe de desafios especiais que combinam habilidades de diferentes modalidades.",
    icon: Target,
  },
  {
    title: "Reconhecimento de versatilidade",
    description:
      "Atletas multi-esporte ganham badges especiais e destaque na comunidade.",
    icon: Award,
  },
];

const sportsExample = [
  { sport: "Beach Tennis", gcoins: "1.200", color: "bg-blue-100 text-blue-700" },
  { sport: "Corrida", gcoins: "800", color: "bg-green-100 text-green-700" },
  { sport: "Padel", gcoins: "600", color: "bg-yellow-100 text-yellow-700" },
];

export default function AthletesMultiPage() {
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
            <span className="text-white font-medium">Multi-Esporte</span>
          </nav>

          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Medal className="h-4 w-4" />
              Multi-Esporte
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Pratica Mais de Um Esporte? Ganhe em Todos Eles
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-100 sm:text-xl">
              Seus GCoins acumulam de todas as modalidades. Mais esportes,
              mais torneios, mais ganhos.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/register?persona=athlete&type=multi"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
              >
                Começar Multi-Esporte
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Exemplo Visual de GCoins */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Seus GCoins Somam de Cada Esporte
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Veja como seus ganhos se multiplicam praticando mais de uma
              modalidade.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-lg">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Exemplo de ganhos mensais
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {sportsExample.map((item) => (
                  <div
                    key={item.sport}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
                          item.color
                        )}
                      >
                        <Zap className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {item.sport}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-700">
                      {item.gcoins} GCoins
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-blue-200 bg-blue-50 px-6 py-5">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-900">
                    Total Mensal
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    2.600 GCoins/mês
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Vantagens do Atleta Multi-Esporte
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Quanto mais modalidades, mais benefícios na plataforma.
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

      {/* Testimonial */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Star className="mx-auto h-8 w-8 text-yellow-400" />
            <blockquote className="mt-8">
              <p className="text-xl font-medium leading-relaxed text-gray-900 sm:text-2xl">
                &ldquo;Pratico 3 esportes e ganho GCoins em todos. Minha renda
                mensal triplicou.&rdquo;
              </p>
            </blockquote>
            <div className="mt-6">
              <p className="font-semibold text-gray-900">Rafael Souza</p>
              <p className="text-sm text-gray-500">
                Beach tennis + corrida + padel
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
              Mais Esportes. Mais GCoins. Mais Renda.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Cadastre-se e adicione todas as suas modalidades. Seus ganhos
              acumulam de cada uma.
            </p>
            <a
              href="/register?persona=athlete&type=multi"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
            >
              Criar Minha Conta Multi-Esporte
              <ChevronRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
