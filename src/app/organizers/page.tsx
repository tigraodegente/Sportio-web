import {
  LayoutDashboard,
  BrainCircuit,
  CreditCard,
  Megaphone,
  Award,
  Building2,
  ArrowRight,
  Star,
  CalendarCheck,
  Banknote,
  ChevronRight,
  Coins,
  Zap,
  Camera,
  Users,
  Repeat,
  Briefcase,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Organizadores | Sportio - Organize Torneios Profissionais sem Bagunça",
  description:
    "Automatize 90% do trabalho, elimine inadimplência e ganhe múltiplas fontes de renda por evento. Plataforma completa para organizadores.",
};

const steps = [
  {
    number: "01",
    title: "Crie o evento",
    description:
      "Configure seu torneio em minutos: modalidade, regras, vagas, preço e local.",
    icon: CalendarCheck,
  },
  {
    number: "02",
    title: "Divulgue",
    description:
      "Marketing automático para atletas da sua região e modalidade. Zero esforço.",
    icon: Megaphone,
  },
  {
    number: "03",
    title: "Gerencie",
    description:
      "Chaveamento por IA, controle de resultados e comunicação centralizada.",
    icon: BrainCircuit,
  },
  {
    number: "04",
    title: "Lucre",
    description:
      "Pagamento automático de inscrições, patrocínios e premiações via PIX e cartão.",
    icon: Banknote,
  },
];

const benefits = [
  {
    title: "Dashboard completo",
    description:
      "Visão geral de todos os seus eventos, inscritos, receitas e métricas em tempo real.",
    icon: LayoutDashboard,
  },
  {
    title: "Chaveamento automático por IA",
    description:
      "Algoritmo inteligente que gera chaves equilibradas baseadas no ranking dos atletas.",
    icon: BrainCircuit,
  },
  {
    title: "Pagamento integrado (PIX/cartão)",
    description:
      "Receba inscrições automaticamente. Sem inadimplência, sem planilha, sem dor de cabeça.",
    icon: CreditCard,
  },
  {
    title: "Marketing automatizado",
    description:
      "Divulgação inteligente para o público certo. Notificações, e-mails e redes sociais.",
    icon: Megaphone,
  },
  {
    title: "Certificados digitais",
    description:
      "Gere certificados automáticos para participantes e vencedores de cada evento.",
    icon: Award,
  },
  {
    title: "Patrocínios de marcas",
    description:
      "Conecte seu evento a marcas que buscam visibilidade esportiva. Receita extra garantida.",
    icon: Building2,
  },
];

const earnings = [
  {
    level: "Evento Pequeno",
    range: "R$ 2.000 - 5.000",
    description:
      "Torneios locais de até 32 participantes. Ideal para quem está começando a organizar.",
    color: "bg-blue-50 border-blue-200",
    accent: "text-blue-600",
  },
  {
    level: "Evento Médio",
    range: "R$ 5.000 - 15.000",
    description:
      "Torneios regionais com 64-128 atletas e patrocínios de marcas locais.",
    color: "bg-blue-100 border-blue-300",
    accent: "text-blue-700",
  },
  {
    level: "Liga Anual",
    range: "R$ 60.000 - 120.000",
    description:
      "Circuitos com etapas mensais, ranking acumulado e patrocinadores recorrentes.",
    color: "bg-blue-200 border-blue-400",
    accent: "text-blue-800",
  },
];

export default function OrganizersPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 pt-32 pb-20 sm:pt-40 sm:pb-28 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <CalendarCheck className="h-4 w-4" />
              Para Organizadores
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Organize Torneios Profissionais sem Bagunça
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-100 sm:text-xl">
              Automatize 90% do trabalho, elimine inadimplência e ganhe
              múltiplas fontes de renda por evento.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/register?persona=organizer"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
              >
                Criar Meu Primeiro Evento
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
              Do cadastro ao lucro em 4 etapas automatizadas.
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
              Ferramentas Profissionais Para Seus Eventos
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tudo que você precisa para organizar, gerenciar e lucrar.
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
              GCoins para Organizadores
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ganhe GCoins Por Cada Evento
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Cada evento organizado gera GCoins automaticamente. Quanto maior o evento, mais voce ganha.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tipo de Evento</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">GCoins</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm text-gray-700">Torneio criado</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">1.000 - 8.000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">Corrida 5K (500 inscritos)</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">8.000</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm text-gray-700">Campeonato regional (32 times)</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">10.000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">Copa relampago</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">2.500</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm text-gray-700">Bonus por inscrito (variavel)</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">50 / inscrito</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Ferramentas Inteligentes */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ferramentas Inteligentes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tecnologia que faz o trabalho pesado por voce.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: BrainCircuit, title: "IA preve inscritos", desc: "Algoritmo que estima participantes com base em historico, regiao e modalidade." },
              { icon: Zap, title: "Early Bird automatico", desc: "Precos escalonados que incentivam inscricoes antecipadas sem esforco manual." },
              { icon: Users, title: "Vagas limitadas com urgencia", desc: "Contagem regressiva e vagas limitadas para aumentar conversoes de inscricao." },
              { icon: CreditCard, title: "Check-in via app", desc: "Atletas fazem check-in pelo celular. Sem filas, sem listas impressas." },
              { icon: BarChart3, title: "Placar ao vivo", desc: "Resultados atualizados em tempo real para todos os participantes e torcedores." },
            ].map((tool) => (
              <div key={tool.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <tool.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{tool.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modelo de Receita */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Multiplas Fontes de Receita
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Nao dependa so de inscricoes. Monetize cada aspecto do seu evento.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: CreditCard, title: "Taxa de inscricao", desc: "Cobranca automatica via PIX e cartao. Sem inadimplencia." },
              { icon: Building2, title: "Patrocinios", desc: "Logo, banner, stands — conecte marcas ao seu evento e receba receita extra." },
              { icon: Camera, title: "Upsells", desc: "Foto, video, medalha e kit premium para participantes. Receita adicional por evento." },
              { icon: Repeat, title: "Ligas anuais", desc: "Crie circuitos mensais com ranking acumulado e receita recorrente." },
              { icon: Briefcase, title: "Eventos corporativos", desc: "Team building esportivo para empresas com precificacao premium." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.desc}</p>
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
              Potencial de Lucro por Evento
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Múltiplas fontes de receita: inscrições, patrocínios e taxa de
              plataforma.
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
                &ldquo;Organizei 12 torneios e lucrei R$ 15 mil. Tudo
                automatizado, do cadastro ao pagamento.&rdquo;
              </p>
            </blockquote>
            <div className="mt-6">
              <p className="font-semibold text-gray-900">Ricardo</p>
              <p className="text-sm text-gray-500">Organizador de Torneios</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-16 text-center shadow-xl sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto Para Organizar Seu Primeiro Torneio?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Comece gratuitamente e descubra como a Sportio simplifica tudo
              para você lucrar mais.
            </p>
            <a
              href="/register?persona=organizer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
            >
              Começar Agora
              <ChevronRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
