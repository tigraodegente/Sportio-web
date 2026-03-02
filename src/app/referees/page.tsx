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

      {/* Earnings Potential */}
      <section className="py-20">
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
