import {
  Camera,
  Image,
  Shield,
  DollarSign,
  ArrowRight,
  Star,
  ChevronRight,
  UserCheck,
  Upload,
  ScanFace,
  Droplets,
  Lock,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Fotografos Esportivos | Sportio",
  description:
    "Marketplace para fotografos esportivos. Upload com reconhecimento facial, watermark automatico e protecao anti-pirataria. Venda suas fotos e ganhe.",
};

const steps = [
  {
    number: "01",
    title: "Cadastre-se",
    description:
      "Crie seu perfil de fotografo com portfolio, equipamento e especialidades.",
    icon: UserCheck,
  },
  {
    number: "02",
    title: "Faca coberturas",
    description:
      "Cubra torneios, treinos e eventos esportivos. Receba convites de organizadores.",
    icon: Camera,
  },
  {
    number: "03",
    title: "Upload inteligente",
    description:
      "Envie suas fotos. Nossa IA identifica atletas por reconhecimento facial e aplica watermark.",
    icon: Upload,
  },
  {
    number: "04",
    title: "Receba por venda",
    description:
      "Atletas compram suas fotos individualmente ou a cobertura completa. Voce recebe 70%.",
    icon: DollarSign,
  },
];

const features = [
  {
    title: "Reconhecimento facial",
    description:
      "IA identifica automaticamente os atletas em cada foto. Eles recebem notificacao quando aparecem.",
    icon: ScanFace,
  },
  {
    title: "Watermark automatico",
    description:
      "Preview com watermark transparente. Foto original em alta resolucao liberada apos pagamento.",
    icon: Droplets,
  },
  {
    title: "Protecao anti-pirataria",
    description:
      "Metadados EXIF protegidos, monitoramento de uso e DMCA automatizado contra copias ilegais.",
    icon: Shield,
  },
  {
    title: "Copyright garantido",
    description:
      "Suas fotos, seus direitos. Licenciamento claro com termo de uso para compradores.",
    icon: Lock,
  },
  {
    title: "Pagamento automatico",
    description:
      "Receba via PIX automaticamente a cada venda. Sem burocracia nem atrasos.",
    icon: CreditCard,
  },
  {
    title: "Portfolio profissional",
    description:
      "Pagina publica com seu portfolio, avaliacoes de clientes e estatisticas de coberturas.",
    icon: Image,
  },
];

const earnings = [
  {
    level: "Venda por foto",
    range: "R$ 15 - 50/foto",
    description:
      "Atletas compram fotos individuais em alta resolucao. Voce recebe 70% do valor.",
    color: "bg-purple-50 border-purple-200",
    accent: "text-purple-600",
  },
  {
    level: "Cobertura completa",
    range: "R$ 200 - 800/evento",
    description:
      "Venda o pacote completo de fotos de um evento para organizadores ou atletas.",
    color: "bg-purple-100 border-purple-300",
    accent: "text-purple-700",
  },
  {
    level: "Contrato recorrente",
    range: "R$ 2.000 - 5.000/mes",
    description:
      "Feche contratos mensais com ligas, arenas e organizadores de torneios.",
    color: "bg-blue-50 border-blue-200",
    accent: "text-blue-600",
  },
];

export default function PhotographerPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 pt-32 pb-20 sm:pt-40 sm:pb-28 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Camera className="h-4 w-4" />
              Fotografos Esportivos
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Fotografos Esportivos: Seu Talento, Seu Lucro
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-100 sm:text-xl">
              Marketplace exclusivo para fotos esportivas. Upload com
              reconhecimento facial, watermark automatico e protecao
              anti-pirataria.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/register?persona=photographer"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
              >
                Comecar a Vender
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
              Em 4 passos, transforme suas fotos em renda.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="text-sm font-bold text-purple-500">
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
              Tecnologia a Seu Favor
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Ferramentas inteligentes para proteger e monetizar seu trabalho.
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
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
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

      {/* Modelo de Comissao */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Modelo Transparente
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Voce define o preco. Sportio cobra 30% de comissao. Sem taxas
              ocultas.
            </p>
          </div>
          <div className="mt-16 mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <div className="grid grid-cols-3 bg-gray-50 p-4 text-sm font-semibold text-gray-700">
                <span>Preco da foto</span>
                <span className="text-center">Comissao Sportio (30%)</span>
                <span className="text-right">Voce recebe (70%)</span>
              </div>
              {[
                { price: "R$ 20", commission: "R$ 6", you: "R$ 14" },
                { price: "R$ 35", commission: "R$ 10,50", you: "R$ 24,50" },
                { price: "R$ 50", commission: "R$ 15", you: "R$ 35" },
                {
                  price: "R$ 500 (cobertura)",
                  commission: "R$ 150",
                  you: "R$ 350",
                },
              ].map((row, i) => (
                <div
                  key={i}
                  className={cn(
                    "grid grid-cols-3 p-4 text-sm",
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  )}
                >
                  <span className="font-medium text-gray-900">{row.price}</span>
                  <span className="text-center text-gray-500">
                    {row.commission}
                  </span>
                  <span className="text-right font-semibold text-green-600">
                    {row.you}
                  </span>
                </div>
              ))}
            </div>
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
              Venda individual, coberturas ou contratos recorrentes.
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
                &ldquo;Antes eu cobria eventos e torcia para vender as fotos
                depois. Com a Sportio, o reconhecimento facial avisa os atletas
                automaticamente e as vendas disparam. Tripliquei minha renda em
                3 meses.&rdquo;
              </p>
            </blockquote>
            <div className="mt-6">
              <p className="font-semibold text-gray-900">Bruno Tavares</p>
              <p className="text-sm text-gray-500">Fotografo esportivo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-16 text-center shadow-xl sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto Para Monetizar Suas Fotos?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Junte-se ao marketplace de fotos esportivas da Sportio. Cadastro
              gratuito, protecao total.
            </p>
            <a
              href="/register?persona=photographer"
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
