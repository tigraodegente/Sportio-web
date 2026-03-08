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
  GraduationCap,
  Heart,
  Layers,
  Shield,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import GCoinCalculator from "@/components/gcoin-calculator";

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
      "Beach tennis, futevolei, padel, corrida e mais de 30 modalidades disponiveis.",
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
      "Converta seus GCoins em dinheiro real via PIX ou use para inscricoes e equipamentos.",
    icon: Trophy,
  },
];

const benefits = [
  {
    title: "Torneios com premiacao",
    description:
      "Participe de torneios com premiacoes reais em GCoins. Quanto mais compete, mais ganha.",
    icon: Trophy,
  },
  {
    title: "Matchmaking inteligente",
    description:
      "Nossa IA encontra adversarios do seu nivel para partidas equilibradas e competitivas.",
    icon: Target,
  },
  {
    title: "Perfil profissional",
    description:
      "Mostre suas estatisticas, conquistas e historico para atrair patrocinadores e parceiros.",
    icon: UserCheck,
  },
  {
    title: "Ranking e visibilidade",
    description:
      "Suba no ranking da sua modalidade e ganhe destaque na plataforma.",
    icon: BarChart3,
  },
  {
    title: "Patrocinios diretos",
    description:
      "Marcas encontram voce diretamente. Receba propostas de patrocinio baseadas no seu desempenho.",
    icon: Handshake,
  },
  {
    title: "Comunidade engajada",
    description:
      "Conecte-se com outros atletas, troque experiencias e cresca junto com a comunidade.",
    icon: Users,
  },
];

const earnings = [
  {
    level: "Amador",
    range: "R$ 200 - 500/mes",
    description:
      "Participe de torneios locais e desafios semanais. Ideal para quem esta comecando.",
    color: "bg-blue-50 border-blue-200",
    accent: "text-blue-600",
  },
  {
    level: "Intermediario",
    range: "R$ 800 - 2.000/mes",
    description:
      "Compete regularmente, participa de ligas e atrai pequenos patrocinios.",
    color: "bg-blue-100 border-blue-300",
    accent: "text-blue-700",
  },
  {
    level: "Avancado",
    range: "R$ 2.000 - 5.000/mes",
    description:
      "Top do ranking, patrocinadores frequentes e convites para eventos premium.",
    color: "bg-blue-200 border-blue-400",
    accent: "text-blue-800",
  },
];

const gcoinActions = [
  { action: "Gol marcado", coins: "100", type: "Real" as const },
  { action: "Assistencia", coins: "50-100", type: "Real" as const },
  { action: "Vitoria em torneio", coins: "1.000-3.000", type: "Real" as const },
  { action: "Campeao de torneio", coins: "1.000-1.500", type: "Real" as const },
  { action: "Completou 5K", coins: "500", type: "Real" as const },
  { action: "Completou 10K", coins: "800", type: "Real" as const },
  { action: "Completou 21K", coins: "1.500", type: "Real" as const },
  { action: "Completou 42K (maratona)", coins: "3.000-3.500", type: "Real" as const },
  { action: "Bateu PR pessoal", coins: "300-1.200", type: "Real" as const },
  { action: "Ace (beach tennis)", coins: "30", type: "Gamificacao" as const },
  { action: "Conteudo viral (5k+ views)", coins: "800", type: "Gamificacao" as const },
];

const testimonials = [
  {
    quote:
      "Beach tennis e minha vida. Com Sportio ja paguei 3 inscricoes de circuito e comprei raquete nova.",
    name: "Ana Beatriz",
    role: "Atleta de Beach Tennis",
  },
  {
    quote:
      "Com o Sportio cada corrida vira GCoins. Ja saquei mais de R$800 em 3 meses.",
    name: "Rodrigo Mendes",
    role: "Corredor",
  },
  {
    quote:
      "O matchmaking me conectou com jogadoras do meu nivel. Ganhei 2 torneios no primeiro mes.",
    name: "Camila Torres",
    role: "Jogadora de Padel",
  },
];

const athleteProfiles = [
  {
    name: "PRO",
    description:
      "Atletas de alto rendimento com patrocinios, ranking e visibilidade premium.",
    icon: Trophy,
    href: "/athletes/pro",
  },
  {
    name: "Universitario",
    description:
      "Competicoes entre universidades, ligas academicas e bolsas esportivas.",
    icon: GraduationCap,
    href: "/athletes/university",
  },
  {
    name: "Feminina",
    description:
      "Torneios exclusivos, comunidade e oportunidades para atletas mulheres.",
    icon: Heart,
    href: "/athletes/women",
  },
  {
    name: "Base (Sub-17)",
    description:
      "Desenvolvimento de jovens talentos com acompanhamento e ranking juvenil.",
    icon: Shield,
    href: "/athletes/base",
  },
  {
    name: "Multi-Esporte",
    description:
      "Para quem pratica mais de uma modalidade e quer ganhar em todas.",
    icon: Layers,
    href: "/athletes/multi",
  },
];

export default function AthletesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 pt-32 pb-20 sm:pt-40 sm:pb-28 text-white">
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
            <p className="mt-6 text-lg leading-relaxed text-blue-100 sm:text-xl">
              Cada partida, cada gol e cada treino se transformam em GCoins
              Reais que viram dinheiro na sua conta.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/register?persona=athlete"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
              >
                Comecar a Ganhar
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
              Em 4 passos simples, voce transforma seu esporte em renda.
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
              Tudo Que Voce Precisa Para Crescer
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Ferramentas pensadas para atletas que querem ir alem.
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

      {/* Earnings Potential */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Potencial de Ganhos
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Seus ganhos crescem conforme sua dedicacao e nivel de competicao.
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

      {/* GCoin Calculator */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Calcule Seus Ganhos
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Descubra quanto voce pode ganhar com seu esporte
            </p>
          </div>
          <GCoinCalculator />
        </div>
      </section>

      {/* GCoin Actions Table */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Quanto Vale Cada Acao
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Veja exatamente quantos GCoins cada atividade gera.
            </p>
          </div>
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Acao
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    GCoins
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Tipo
                  </th>
                </tr>
              </thead>
              <tbody>
                {gcoinActions.map((row, i) => (
                  <tr
                    key={row.action}
                    className={cn(
                      "border-b border-gray-100 transition-colors hover:bg-gray-50",
                      i === gcoinActions.length - 1 && "border-b-0"
                    )}
                  >
                    <td className="px-6 py-3.5 text-sm text-gray-900">
                      {row.action}
                    </td>
                    <td className="px-6 py-3.5 text-center text-sm font-semibold text-gray-900">
                      {row.coins}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                          row.type === "Real"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-700"
                        )}
                      >
                        {row.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <Star className="mb-4 h-6 w-6 text-yellow-400" />
                <blockquote>
                  <p className="text-base font-medium leading-relaxed text-gray-900">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </blockquote>
                <div className="mt-4">
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Athlete Profiles / Subtypes */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Encontre Seu Perfil de Atleta
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Cada perfil tem beneficios e oportunidades unicas.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {athleteProfiles.map((profile) => (
              <a
                key={profile.name}
                href={profile.href}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <profile.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  {profile.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {profile.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors group-hover:text-blue-700">
                  Saiba mais
                  <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-16 text-center shadow-xl sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto Para Transformar Seu Esporte em Renda?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Junte-se a milhares de atletas que ja estao ganhando GCoins.
              Cadastro gratuito e sem compromisso.
            </p>
            <a
              href="/register?persona=athlete"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
            >
              Criar Minha Conta Gratis
              <ChevronRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
