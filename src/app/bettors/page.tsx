import {
  BarChart3,
  Eye,
  Radio,
  Users,
  History,
  ShieldCheck,
  ArrowRight,
  Star,
  Coins,
  TrendingUp,
  ChevronRight,
  Wallet,
  Flame,
  Bell,
  Trophy,
  Lock,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Apostadores | Sportio - Aposte com Inteligência no Esporte",
  description:
    "Use seus GCoins para apostar em partidas reais. Dados transparentes, odds justas e pagamento automático via PIX.",
};

const steps = [
  {
    number: "01",
    title: "Analise estatísticas",
    description:
      "Acesse dados completos de atletas, histórico de confrontos e tendências em tempo real.",
    icon: BarChart3,
  },
  {
    number: "02",
    title: "Escolha sua aposta",
    description:
      "Selecione o tipo de aposta, defina o valor em GCoins e confirme com um toque.",
    icon: TrendingUp,
  },
  {
    number: "03",
    title: "Acompanhe ao vivo",
    description:
      "Siga a partida em tempo real com atualizações de placar e estatísticas.",
    icon: Radio,
  },
  {
    number: "04",
    title: "Receba seus ganhos",
    description:
      "GCoins creditados automaticamente. Saque via PIX ou use na plataforma.",
    icon: Wallet,
  },
];

const benefits = [
  {
    title: "Estatísticas em tempo real",
    description:
      "Dados detalhados de cada atleta e partida para decisões informadas.",
    icon: BarChart3,
  },
  {
    title: "Odds transparentes",
    description:
      "Algoritmo justo e auditável. Sem manipulação, sem surpresas desagradáveis.",
    icon: Eye,
  },
  {
    title: "Live betting",
    description:
      "Aposte durante as partidas com odds que se atualizam em tempo real.",
    icon: Radio,
  },
  {
    title: "Apostas entre amigos",
    description:
      "Crie apostas privadas com seus amigos em partidas reais da plataforma.",
    icon: Users,
  },
  {
    title: "Histórico completo",
    description:
      "Acompanhe todas as suas apostas, ganhos e perdas em um dashboard detalhado.",
    icon: History,
  },
  {
    title: "Jogo responsável",
    description:
      "Limites de aposta, alertas de comportamento e ferramentas de autocontrole integradas.",
    icon: ShieldCheck,
  },
];

const bettingTypes = [
  {
    type: "GCoins Reais",
    subtitle: "Saque via PIX",
    description:
      "Aposte GCoins que podem ser convertidos em dinheiro real. Ganhos são sacáveis via PIX a qualquer momento.",
    features: [
      "Saque direto via PIX",
      "Odds competitivas",
      "Limites configuráveis",
      "Verificação de identidade",
    ],
    color: "bg-blue-50 border-blue-300",
    accent: "text-blue-700",
    badgeColor: "bg-blue-500",
  },
  {
    type: "GCoins Gamificação",
    subtitle: "Troque por prêmios",
    description:
      "Aposte GCoins de gamificação e troque por prêmios exclusivos: equipamentos, ingressos e experiências.",
    features: [
      "Prêmios exclusivos",
      "Sem risco financeiro",
      "Ideal para iniciantes",
      "Recompensas diárias",
    ],
    color: "bg-blue-50 border-blue-300",
    accent: "text-blue-700",
    badgeColor: "bg-blue-500",
  },
];

export default function BettorsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 pt-32 pb-20 sm:pt-40 sm:pb-28 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Coins className="h-4 w-4" />
              Para Apostadores
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Aposte com Inteligência no Esporte
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-100 sm:text-xl">
              Use seus GCoins para apostar em partidas reais. Dados
              transparentes, odds justas e pagamento automático.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
              >
                Começar a Apostar
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
              Aposte com dados reais em 4 passos simples.
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
              Apostas Inteligentes e Seguras
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Ferramentas para apostar com informação e responsabilidade.
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

      {/* 7 Tipos de Aposta */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
              <Coins className="h-4 w-4" />
              7 Tipos de Aposta
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tabela Completa de Apostas
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Escolha o tipo que combina com seu estilo. GCoins Reais ou Gamificacao.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tipo de Aposta</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Detalhe</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Categoria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Vencedor</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Quem ganha a partida</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">Real</span>
                    <span className="ml-1 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">Gamif.</span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Placar Exato</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">300 GCoins</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">Real</span>
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">MVP da Partida</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">200 GCoins</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">Real</span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Combinada</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Multiplicador acumulado</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">Real</span>
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Live Bet</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Aposta em tempo real</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">Real</span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Entre Amigos</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Apostas privadas</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">Real</span>
                    <span className="ml-1 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">Gamif.</span>
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Gamificada</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Pura diversao, sem risco</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">Gamif.</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Sistema de Odds e Seguranca */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Sistema de Odds */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Sistema de Odds Transparente
              </h2>
              <p className="mt-4 text-gray-600">
                Algoritmo justo baseado em dados reais dos atletas e torneios.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: BarChart3, text: "Baseado em historico real de partidas" },
                  { icon: Zap, text: "Atualizado em tempo real durante jogos" },
                  { icon: Bell, text: "Alertas de oportunidades de apostas" },
                  { icon: Eye, text: "Odds transparentes e auditaveis" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seguranca */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Seguranca e Jogo Responsavel
              </h2>
              <p className="mt-4 text-gray-600">
                Tecnologia e controles para uma experiencia segura.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: ShieldCheck, text: "IA antifraude em todas as apostas" },
                  { icon: Trophy, text: "Validacao por arbitros verificados" },
                  { icon: Lock, text: "Limites configuraveis por usuario" },
                  { icon: ShieldCheck, text: "Ferramentas de jogo responsavel" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Streaks */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
              <Flame className="h-4 w-4" />
              Streaks
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Sequencias de Vitorias
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Cada vitoria seguida aumenta seu multiplicador. Construa sua reputacao no ranking de acuracia.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              { streak: "3 seguidas", mult: "1.5x", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
              { streak: "5 seguidas", mult: "2x", color: "bg-orange-50 border-orange-200 text-orange-700" },
              { streak: "10 seguidas", mult: "3x", color: "bg-red-50 border-red-200 text-red-700" },
            ].map((s) => (
              <div key={s.streak} className={cn("rounded-2xl border-2 p-6 text-center", s.color)}>
                <p className="text-sm font-bold uppercase tracking-wider">{s.streak}</p>
                <p className="mt-2 text-4xl font-black">{s.mult}</p>
                <p className="mt-1 text-sm">multiplicador</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-xl text-center text-sm text-gray-500">
            Ranking de acuracia: acompanhe sua taxa de acerto e suba no ranking dos melhores apostadores da plataforma.
          </p>
        </div>
      </section>

      {/* Betting Types (original - two modes) */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Dois Modos de Apostar
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Escolha entre GCoins Reais para sacar dinheiro ou GCoins
              Gamificacao para ganhar premios.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {bettingTypes.map((option) => (
              <div
                key={option.type}
                className={cn(
                  "rounded-2xl border-2 p-8 transition-all hover:shadow-md",
                  option.color
                )}
              >
                <div className="mb-2">
                  <span
                    className={cn(
                      "inline-block rounded-full px-3 py-1 text-xs font-bold text-white",
                      option.badgeColor
                    )}
                  >
                    {option.subtitle}
                  </span>
                </div>
                <h3
                  className={cn(
                    "text-2xl font-bold",
                    option.accent
                  )}
                >
                  {option.type}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {option.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {option.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <ShieldCheck className="h-4 w-4 text-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
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
                &ldquo;Comecei apostando 50 GCoins e hoje já saquei R$ 1.800
                via PIX.&rdquo;
              </p>
            </blockquote>
            <div className="mt-6">
              <p className="font-semibold text-gray-900">Felipe</p>
              <p className="text-sm text-gray-500">Apostador</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-16 text-center shadow-xl sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto Para Apostar com Inteligência?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Crie sua conta, analise os dados e faça sua primeira aposta com
              GCoins. Cadastro gratuito.
            </p>
            <a
              href="/register"
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
