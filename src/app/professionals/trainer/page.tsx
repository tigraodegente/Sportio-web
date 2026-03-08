import {
  Dumbbell,
  UserCheck,
  BarChart3,
  Target,
  ArrowRight,
  Star,
  ChevronRight,
  Zap,
  ClipboardList,
  Video,
  FileText,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Personal Trainers e Instrutores | Sportio",
  description:
    "Ganhe com sua expertise como personal trainer ou instrutor. Crie planos de treino digitais, análise técnica por IA e receba via PIX.",
};

const steps = [
  {
    number: "01",
    title: "Cadastre-se",
    description:
      "Crie sua conta gratuita em menos de 2 minutos e selecione o perfil de profissional.",
    icon: UserCheck,
  },
  {
    number: "02",
    title: "Crie seu perfil profissional",
    description:
      "Adicione certificações (CREF), especialidades, fotos e vídeos de treinos.",
    icon: ClipboardList,
  },
  {
    number: "03",
    title: "Conecte-se com alunos",
    description:
      "Receba solicitações de atletas buscando treino personalizado na sua região.",
    icon: Target,
  },
  {
    number: "04",
    title: "Ganhe GCoins",
    description:
      "Cada sessão, plano de treino e consulta gera GCoins convertíveis em dinheiro via PIX.",
    icon: Zap,
  },
];

const benefits = [
  {
    title: "Planos de treino digitais",
    description:
      "Crie e compartilhe planos de treino personalizados com seus alunos diretamente pela plataforma.",
    icon: ClipboardList,
  },
  {
    title: "Análise técnica por vídeo (IA)",
    description:
      "Use nossa IA para analisar movimentos dos alunos em vídeo e gerar relatórios de melhoria.",
    icon: Video,
  },
  {
    title: "Templates profissionais",
    description:
      "Biblioteca de templates de treino por modalidade. Personalize e envie em segundos.",
    icon: FileText,
  },
  {
    title: "Pagamentos via PIX",
    description:
      "Receba automaticamente via PIX. Sem burocracia, sem taxas ocultas. O dinheiro cai na hora.",
    icon: Wallet,
  },
  {
    title: "Dashboard de desempenho",
    description:
      "Acompanhe a evolução de cada aluno com métricas detalhadas e gráficos de progresso.",
    icon: BarChart3,
  },
  {
    title: "Agenda inteligente",
    description:
      "Gerencie horários, aulas e compromissos com sistema de agendamento integrado.",
    icon: Target,
  },
];

const earnings = [
  {
    level: "Aluno ativo",
    range: "R$ 120 - 200/mês",
    description:
      "Acompanhamento mensal com plano de treino personalizado e check-ins semanais.",
    color: "bg-blue-50 border-blue-200",
    accent: "text-blue-600",
  },
  {
    level: "Aluno fidelizado",
    range: "R$ 250 - 350/mês",
    description:
      "Plano completo com análise de vídeo, ajustes semanais e suporte por chat.",
    color: "bg-blue-100 border-blue-300",
    accent: "text-blue-700",
  },
  {
    level: "Aula particular",
    range: "R$ 400/sessão",
    description:
      "Sessão individual presencial ou online com foco em objetivos específicos.",
    color: "bg-orange-50 border-orange-200",
    accent: "text-orange-600",
  },
  {
    level: "Consultoria",
    range: "R$ 500 - 800/sessão",
    description:
      "Avaliação completa, periodização e planejamento de competição para atletas de alto nível.",
    color: "bg-orange-100 border-orange-300",
    accent: "text-orange-700",
  },
  {
    level: "Curso online",
    range: "R$ 3.000 - 5.000",
    description:
      "Crie e venda cursos gravados na plataforma. Renda passiva com conteúdo escalável.",
    color: "bg-yellow-50 border-yellow-300",
    accent: "text-yellow-700",
  },
];

export default function TrainerPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 pt-32 pb-20 sm:pt-40 sm:pb-28 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Dumbbell className="h-4 w-4" />
              Personal Trainers & Instrutores
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Personal Trainers e Instrutores: Ganhe com Sua Expertise
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-100 sm:text-xl">
              Transforme seu conhecimento em renda real. Crie planos de treino,
              acompanhe alunos e receba via PIX.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/register?persona=trainer"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
              >
                Começar Agora
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
              Em 4 passos simples, comece a ganhar com seu conhecimento.
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
              Ferramentas Para Você Crescer
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tudo que você precisa para oferecer um serviço profissional e
              escalar seus ganhos.
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
              Diferentes modalidades de serviço, diferentes faixas de renda.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Testimonial */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Star className="mx-auto h-8 w-8 text-yellow-400" />
            <blockquote className="mt-8">
              <p className="text-xl font-medium leading-relaxed text-gray-900 sm:text-2xl">
                &ldquo;Desde que comecei na Sportio, triplicou o numero de
                alunos. A plataforma facilita tudo: agendamento, pagamentos e
                acompanhamento de evolucao. Hoje ganho mais de R$ 8.000 por
                mes.&rdquo;
              </p>
            </blockquote>
            <div className="mt-6">
              <p className="font-semibold text-gray-900">Ricardo Ferreira</p>
              <p className="text-sm text-gray-500">Personal Trainer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-16 text-center shadow-xl sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto Para Monetizar Sua Expertise?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Junte-se a milhares de personal trainers e instrutores que ja
              ganham GCoins. Cadastro gratuito e sem compromisso.
            </p>
            <a
              href="/register?persona=trainer"
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
