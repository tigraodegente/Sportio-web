import {
  Heart,
  Video,
  BarChart3,
  Apple,
  ArrowRight,
  Star,
  ChevronRight,
  UserCheck,
  ShieldCheck,
  ClipboardList,
  Calculator,
  Utensils,
  Activity,
  Watch,
  Smartphone,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Nutricionistas | Sportio",
  description:
    "Consultas online com renda recorrente para nutricionistas esportivos. CRN validado, videochamada integrada e media R$350/cliente/mes.",
};

const steps = [
  {
    number: "01",
    title: "Cadastre-se com CRN",
    description:
      "Crie sua conta e valide seu registro no Conselho Regional de Nutricionistas.",
    icon: ShieldCheck,
  },
  {
    number: "02",
    title: "Configure suas consultas",
    description:
      "Defina valores, horários disponíveis e especialidades para atrair os pacientes certos.",
    icon: ClipboardList,
  },
  {
    number: "03",
    title: "Atenda via videochamada",
    description:
      "Consultas integradas na plataforma com prontuário digital e receitas automatizadas.",
    icon: Video,
  },
  {
    number: "04",
    title: "Ganhe recorrente",
    description:
      "Acompanhamento mensal gera renda recorrente. Media de R$350 por cliente por mes.",
    icon: Heart,
  },
];

const features = [
  {
    title: "Biblioteca de planos",
    description:
      "Acesse e personalize centenas de planos alimentares por objetivo: emagrecimento, hipertrofia, performance.",
    icon: ClipboardList,
  },
  {
    title: "Calculadora de macros",
    description:
      "Calcule automaticamente macronutrientes baseado no perfil, modalidade e objetivo do atleta.",
    icon: Calculator,
  },
  {
    title: "Gerador de cardapios",
    description:
      "IA que gera cardapios personalizados considerando preferencias, restricoes e orcamento.",
    icon: Utensils,
  },
  {
    title: "Dashboard de resultados",
    description:
      "Acompanhe a evolucao de cada paciente com graficos de peso, composicao corporal e adesao.",
    icon: BarChart3,
  },
  {
    title: "Prontuario digital",
    description:
      "Historico completo de consultas, exames e evolucao. Tudo em um so lugar, seguro e acessivel.",
    icon: Heart,
  },
  {
    title: "Receitas automatizadas",
    description:
      "Gere receitas e prescricoes com assinatura digital valida. Envie direto ao paciente.",
    icon: ShieldCheck,
  },
];

const integrations = [
  {
    name: "MyFitnessPal",
    description: "Sincronize diarios alimentares dos pacientes automaticamente.",
    icon: Apple,
  },
  {
    name: "Strava",
    description: "Acesse dados de treino para ajustar planos alimentares.",
    icon: Activity,
  },
  {
    name: "Whoop / Garmin",
    description:
      "Dados de sono, recuperacao e HRV para prescricoes mais precisas.",
    icon: Watch,
  },
  {
    name: "InBody",
    description:
      "Importe bioimpedancia e composicao corporal para acompanhamento.",
    icon: Scale,
  },
];

const earnings = [
  {
    level: "Consulta avulsa",
    range: "R$ 150 - 250",
    description:
      "Primeira consulta ou avaliacao pontual com plano alimentar basico.",
    color: "bg-green-50 border-green-200",
    accent: "text-green-600",
  },
  {
    level: "Acompanhamento mensal",
    range: "R$ 350/cliente/mes",
    description:
      "Consulta de retorno + ajustes semanais + suporte por chat. Renda recorrente.",
    color: "bg-green-100 border-green-300",
    accent: "text-green-700",
  },
  {
    level: "Pacote trimestral",
    range: "R$ 900 - 1.200",
    description:
      "Programa completo com 3 meses de acompanhamento, exames e reavaliacao.",
    color: "bg-blue-50 border-blue-200",
    accent: "text-blue-600",
  },
];

export default function NutritionistPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 pt-32 pb-20 sm:pt-40 sm:pb-28 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Heart className="h-4 w-4" />
              Nutricionistas
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Nutricionistas: Consultas Online com Renda Recorrente
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-100 sm:text-xl">
              CRN validado obrigatorio. Consultas via videochamada integrada.
              Media de R$350 por cliente por mes.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/register?persona=nutritionist"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
              >
                Comecar Agora
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
              Em 4 passos, comece a atender e ganhar de forma recorrente.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="text-sm font-bold text-green-500">
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

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ferramentas Exclusivas
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tudo que voce precisa para oferecer consultas de alta qualidade.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={cn(
                  "rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                )}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Integracoes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Conecte-se com os apps que seus pacientes ja usam.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <integration.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {integration.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {integration.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Potencial de Ganhos
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Renda recorrente e previsivel com acompanhamento nutricional.
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

      {/* Testimonial */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Star className="mx-auto h-8 w-8 text-yellow-400" />
            <blockquote className="mt-8">
              <p className="text-xl font-medium leading-relaxed text-gray-900 sm:text-2xl">
                &ldquo;A Sportio mudou minha pratica. Antes atendia 15 pacientes
                presenciais. Hoje acompanho 40+ atletas online com renda mensal
                previsivel. A integracao com Strava e um diferencial
                incrivel.&rdquo;
              </p>
            </blockquote>
            <div className="mt-6">
              <p className="font-semibold text-gray-900">Dra. Fernanda Alves</p>
              <p className="text-sm text-gray-500">Nutricionista esportiva</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-16 text-center shadow-xl sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto Para Atender Atletas Online?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Junte-se a centenas de nutricionistas que ja ganham com consultas
              online. Cadastro gratuito com validacao CRN.
            </p>
            <a
              href="/register?persona=nutritionist"
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
