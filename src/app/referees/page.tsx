import {
  BadgeCheck,
  Bell,
  Banknote,
  BarChart3,
  HeadphonesIcon,
  GraduationCap,
  ArrowRight,
  Star,
  Scale,
  FileCheck,
  ChevronRight,
  Coins,
  Video,
  Clock,
  Shield,
  Award,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Árbitros | Sportio - O Esporte Precisa de Árbitros Justos",
  description:
    "Cada validação feita por você é registrada, avaliada e remunerada. Ganhe GCoins por cada partida apitada na plataforma.",
};

const steps = [
  {
    number: "01",
    title: "Cadastre-se e envie documentação",
    description:
      "Crie seu perfil de árbitro e envie suas certificações para validação.",
    icon: FileCheck,
  },
  {
    number: "02",
    title: "Receba convites",
    description:
      "A plataforma envia convites automáticos baseados na sua região e disponibilidade.",
    icon: Bell,
  },
  {
    number: "03",
    title: "Valide resultados",
    description:
      "Registre placares, ocorrências e valide os resultados das partidas.",
    icon: BadgeCheck,
  },
  {
    number: "04",
    title: "Ganhe por partida",
    description:
      "Receba GCoins automaticamente após cada partida validada. Saque via PIX.",
    icon: Banknote,
  },
];

const benefits = [
  {
    title: "Verificação profissional",
    description:
      "Selo de árbitro verificado que comprova sua qualificação e experiência na plataforma.",
    icon: BadgeCheck,
  },
  {
    title: "Convites automáticos",
    description:
      "Receba convites para partidas e torneios na sua região, de acordo com sua agenda.",
    icon: Bell,
  },
  {
    title: "Pagamento por partida",
    description:
      "Remuneração automática em GCoins após cada jogo. Sem burocracia, sem atrasos.",
    icon: Banknote,
  },
  {
    title: "Ranking de qualidade",
    description:
      "Avaliações dos atletas constroem seu ranking. Melhores árbitros recebem mais convites.",
    icon: BarChart3,
  },
  {
    title: "Suporte dedicado",
    description:
      "Canal exclusivo para árbitros com suporte prioritário para dúvidas e ocorrências.",
    icon: HeadphonesIcon,
  },
  {
    title: "Treinamento gratuito",
    description:
      "Acesse cursos e materiais de capacitação para aprimorar suas habilidades.",
    icon: GraduationCap,
  },
];

const earnings = [
  {
    level: "Iniciante",
    range: "R$ 500 - 1.000/mês",
    description:
      "Apite partidas locais e torneios menores. Ideal para começar a construir seu ranking.",
    color: "bg-blue-50 border-blue-200",
    accent: "text-blue-600",
  },
  {
    level: "Intermediário",
    range: "R$ 1.500 - 2.500/mês",
    description:
      "Árbitro ativo em torneios regionais com boa avaliação e convites frequentes.",
    color: "bg-blue-100 border-blue-300",
    accent: "text-blue-700",
  },
  {
    level: "Top 10%",
    range: "R$ 4.000+/mês",
    description:
      "Árbitros top do ranking com acesso a eventos premium e taxas diferenciadas.",
    color: "bg-blue-200 border-blue-400",
    accent: "text-blue-800",
  },
];

export default function RefereesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 pt-32 pb-20 sm:pt-40 sm:pb-28 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Scale className="h-4 w-4" />
              Para Árbitros
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              O Esporte Precisa de Árbitros Justos
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-100 sm:text-xl">
              Cada validação feita por você é registrada, avaliada e
              remunerada. Ganhe GCoins por cada partida.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/register?persona=referee"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
              >
                Cadastrar como Árbitro
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
              Do cadastro à remuneração em 4 etapas claras.
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
              Valorizamos Quem Garante o Fair Play
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Ferramentas e benefícios exclusivos para árbitros da plataforma.
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

      {/* GCoins Table */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
              <Coins className="h-4 w-4" />
              GCoins para Arbitros
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ganhe GCoins Por Cada Partida
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Remuneracao automatica e bonus por desempenho.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Acao</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">GCoins</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Tipo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm text-gray-700">Partida arbitrada</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">200</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">Real</span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">Bonus rapidez na validacao</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Variavel</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">Real</span>
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm text-gray-700">Aprovacao em todas as partidas do mes</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">500</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">Gamificacao</span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">150+ partidas — Badge especial</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Badge</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">Gamificacao</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Remuneracao e Requisitos */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Remuneracao */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Remuneracao
              </h2>
              <p className="mt-4 text-gray-600">
                Quanto mais partidas e melhor sua avaliacao, mais voce ganha.
              </p>
              <div className="mt-8 space-y-4">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Media mensal</span>
                    <span className="text-lg font-bold text-gray-900">R$ 1.800/mes</span>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Top 10% arbitros</span>
                    <span className="text-lg font-bold text-green-600">R$ 4.000+/mes</span>
                  </div>
                </div>
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-yellow-800">Primeiros 3 jogos</span>
                    <span className="text-lg font-bold text-yellow-700">+20% premium</span>
                  </div>
                  <p className="mt-2 text-xs text-yellow-600">Bonus de boas-vindas para novos arbitros</p>
                </div>
              </div>
            </div>

            {/* Requisitos */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Requisitos
              </h2>
              <p className="mt-4 text-gray-600">
                Processo simples e rapido para comecar a arbitrar.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: FileCheck, text: "Verificacao de documentos (24h)", desc: "Envie RG/CPF e receba aprovacao em ate 24 horas." },
                  { icon: Award, text: "Certificacao CBF/federacao", desc: "Certificado de arbitragem aceito (estadual, federal ou CBF)." },
                  { icon: GraduationCap, text: "Treinamento gratuito", desc: "Acesse cursos e materiais de capacitacao sem custo." },
                ].map((req) => (
                  <div key={req.text} className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <req.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{req.text}</h4>
                      <p className="mt-1 text-sm text-gray-500">{req.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funcoes do Arbitro */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Funcoes do Arbitro na Plataforma
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Responsabilidades claras e ferramentas para cada tarefa.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BadgeCheck, title: "Validar resultados", desc: "Confirme placares e resultados oficiais das partidas." },
              { icon: BarChart3, title: "Aprovar estatisticas", desc: "Valide estatisticas individuais e coletivas dos jogos." },
              { icon: Video, title: "Confirmar jogadas em video", desc: "Revise lances polemicos com suporte de replay em video." },
              { icon: Star, title: "Ranking de qualidade", desc: "Sua avaliacao define seu ranking e acesso a eventos premium." },
            ].map((func) => (
              <div key={func.title} className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <func.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{func.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{func.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Potential */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Potencial de Ganhos
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Quanto mais partidas apitar e melhor sua avaliação, mais você
              ganha.
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
                &ldquo;Apitava 2-3 jogos ganhando R$ 100 cada. No Sportio,
                apito 12 jogos/mês com taxa média de R$ 180.&rdquo;
              </p>
            </blockquote>
            <div className="mt-6">
              <p className="font-semibold text-gray-900">Carlos</p>
              <p className="text-sm text-gray-500">Árbitro</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-16 text-center shadow-xl sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto Para Ser Valorizado Como Árbitro?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Cadastre-se, envie suas credenciais e comece a receber convites
              para partidas na sua região.
            </p>
            <a
              href="/register?persona=referee"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
            >
              Cadastrar Agora
              <ChevronRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
