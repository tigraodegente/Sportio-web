import {
  ShoppingBag,
  Tag,
  Truck,
  Award,
  ArrowRight,
  ChevronRight,
  Mail,
  Percent,
  Star,
  Dumbbell,
  Waves,
  Bike,
  Footprints,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Loja Sportio | Em Breve",
  description:
    "A loja oficial da Sportio esta chegando. Equipamentos esportivos com ate 40% de desconto para usuarios ativos. Cadastre-se para ser avisado.",
};

const perks = [
  {
    title: "20% off para usuarios ativos",
    description:
      "Mantenha seu perfil ativo na plataforma e ganhe 20% de desconto em todos os produtos.",
    icon: Percent,
  },
  {
    title: "40% off para embaixadores",
    description:
      "Embaixadores Sportio tem acesso a descontos exclusivos de ate 40% em equipamentos premium.",
    icon: Award,
  },
  {
    title: "Frete gratis acima de R$ 200",
    description:
      "Compras acima de R$ 200 tem frete gratis para todo o Brasil. Sem pegadinhas.",
    icon: Truck,
  },
];

const categories = [
  {
    name: "Beach Tennis",
    icon: Waves,
  },
  {
    name: "Padel",
    icon: Dumbbell,
  },
  {
    name: "Corrida",
    icon: Footprints,
  },
  {
    name: "Ciclismo",
    icon: Bike,
  },
  {
    name: "Futevolei",
    icon: Star,
  },
  {
    name: "Fitness",
    icon: Dumbbell,
  },
];

const brands = ["Nike", "Wilson", "Speedo", "Adidas", "Asics", "Head"];

export default function StorePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 pt-32 pb-20 sm:pt-40 sm:pb-28 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-yellow-400/20 px-4 py-2 text-sm font-bold text-yellow-300 backdrop-blur-sm">
              <ShoppingBag className="h-4 w-4" />
              Em Breve
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Loja Sportio — Em Breve
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-100 sm:text-xl">
              Equipamentos esportivos com descontos exclusivos para quem faz
              parte da comunidade Sportio. Cadastre-se para ser o primeiro a
              saber.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#waitlist"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
              >
                Me Avise do Lancamento
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Beneficios Exclusivos
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Quanto mais voce usa a Sportio, mais voce economiza na loja.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className={cn(
                  "rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md text-center"
                )}
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <perk.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {perk.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {perk.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Equipamentos por Esporte
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Categorias planejadas para o lancamento da loja.
            </p>
          </div>
          <div className="mt-16 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md hover:border-blue-200"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <cat.icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {cat.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Brands */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Marcas Parceiras
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Trabalhando com as melhores marcas do mercado esportivo.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
            {brands.map((brand) => (
              <div
                key={brand}
                className="flex h-16 w-32 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-lg font-bold text-gray-400"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <Mail className="mx-auto h-10 w-10 text-blue-600" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Seja Avisado
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Deixe seu email e seja o primeiro a saber quando a Loja Sportio
              abrir.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="seu@email.com"
                className="flex-1 rounded-full border border-gray-300 bg-white px-6 py-4 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
              >
                Me Avise
                <Mail className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Sem spam. Apenas uma notificacao quando a loja abrir.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-16 text-center shadow-xl sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Cadastre-se Agora para Garantir Desconto
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Usuarios ativos da Sportio terao descontos exclusivos no
              lancamento da loja. Crie sua conta gratuitamente.
            </p>
            <a
              href="/register"
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
