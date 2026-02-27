import {
  Trophy,
  Target,
  UserCheck,
  BarChart3,
  Handshake,
  Users,
  ArrowRight,
  Star,
  Zap,
  Medal,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Atletas | Sportio - Ganhe Dinheiro com Seu Esporte",
  description:
    "Cada partida, cada gol e cada treino se transformam em GCoins reais que viram dinheiro na sua conta. Cadastre-se gratuitamente e comece a ganhar.",
};

const steps = [
  {
    number: "01",
    title: "Cadastre-se",
    description:
      "Crie sua conta gratuita em menos de 2 minutos e escolha seu perfil de atleta.",
    icon: UserCheck,
  },
  {
    number: "02",
    title: "Escolha seu esporte",
    description:
      "Beach tennis, futevôlei, padel, corrida e mais de 30 modalidades disponíveis.",
    icon: Target,
  },
  {
    number: "03",
    title: "Compete e treine",
    description:
      "Participe de torneios, desafios e treinos. Cada atividade gera GCoins.",
    icon: Zap,
  },
  {
    number: "04",
    title: "Ganhe GCoins",
    description:
      "Converta seus GCoins em dinheiro real via PIX ou use para inscrições e equipamentos.",
    icon: Trophy,
  },
];

const benefits = [
  {
    title: "Torneios com premiação",
    description:
      "Participe de torneios com premiações reais em GCoins. Quanto mais compete, mais ganha.",
    icon: Trophy,
  },
  {
    title: "Matchmaking inteligente",
    description:
      "Nossa IA encontra adversários do seu nível para partidas equilibradas e competitivas.",
    icon: Target,
  },
  {
    title: "Perfil profissional",
    description:
      "Mostre suas estatísticas, conquistas e histórico para atrair patrocinadores e parceiros.",
    icon: UserCheck,
  },
  {
    title: "Ranking e visibilidade",
    description:
      "Suba no ranking da sua modalidade e ganhe destaque na plataforma.",
    icon: BarChart3,
  },
  {
    title: "Patrocínios diretos",
    description:
      "Marcas encontram você diretamente. Receba propostas de patrocínio baseadas no seu desempenho.",
    icon: Handshake,
  },
  {
    title: "Comunidade engajada",
    description:
      "Conecte-se com outros atletas, troque experiências e cresça junto com a comunidade.",
    icon: Users,
  },
];

const earnings = [
  {
    level: "Amador",
    range: "R$ 200 - 500/mês",
    description:
      "Participe de torneios locais e desafios semanais. Ideal para quem está começando.",
    color: "bg-emerald-50 border-emerald-200",
    accent: "text-emerald-600",
  },
  {
    level: "Intermediário",
    range: "R$ 800 - 2.000/mês",
    description:
      "Compete regularmente, participa de ligas e atrai pequenos patrocínios.",
    color: "bg-emerald-100 border-emerald-300",
    accent: "text-emerald-700",
  },
  {
    level: "Avançado",
    range: "R$ 2.000 - 5.000/mês",
    description:
      "Top do ranking, patrocinadores frequentes e convites para eventos premium.",
    color: "bg-emerald-200 border-emerald-400",
    accent: "text-emerald-800",
  },
];

export default function AthletesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 py-24 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Medal className="h-4 w-4" />
              Para Atletas
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Ganhe Dinheiro com Seu Esporte
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-emerald-50 sm:text-xl">
              Cada partida, cada gol e cada treino se transformam em GCoins
              Reais que viram dinheiro na sua conta.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-emerald-600 shadow-lg transition-all hover:bg-emerald-50 hover:shadow-xl"
              >
                Começar a Ganhar
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10"
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
              Em 4 passos simples, você transforma seu esporte em renda.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="text-sm font-bold text-emerald-500">
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
              Tudo Que Você Precisa Para Crescer
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Ferramentas pensadas para atletas que querem ir além.
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
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
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

      {/* Earnings Potential */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Potencial de Ganhos
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Seus ganhos crescem conforme sua dedicação e nível de competição.
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
                &ldquo;Beach tennis é minha vida. Com Sportio já paguei 3
                inscrições de circuito e comprei raquete nova.&rdquo;
              </p>
            </blockquote>
            <div className="mt-6">
              <p className="font-semibold text-gray-900">Ana Beatriz</p>
              <p className="text-sm text-gray-500">
                Atleta de Beach Tennis
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 px-8 py-16 text-center shadow-xl sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto Para Transformar Seu Esporte em Renda?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-50">
              Junte-se a milhares de atletas que já estão ganhando GCoins.
              Cadastro gratuito e sem compromisso.
            </p>
            <a
              href="#"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-emerald-600 shadow-lg transition-all hover:bg-emerald-50 hover:shadow-xl"
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
