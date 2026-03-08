import {
  Dumbbell,
  Heart,
  Camera,
  Building2,
  GraduationCap,
  ArrowRight,
  ChevronRight,
  Users,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Profissionais | Sportio",
  description:
    "Ganhe dinheiro com sua expertise esportiva. Personal trainers, nutricionistas, fotógrafos, instrutores e donos de arena: a Sportio é a plataforma para você crescer.",
};

const professionals = [
  {
    title: "Personal Trainer",
    description:
      "Crie planos de treino, acompanhe alunos e ganhe GCoins por cada sessão.",
    href: "/professionals/trainer",
    icon: Dumbbell,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Nutricionista",
    description:
      "Consultas online, planos alimentares e renda recorrente com validação CRN.",
    href: "/professionals/nutritionist",
    icon: Heart,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Fotógrafo Esportivo",
    description:
      "Venda suas fotos em um marketplace com reconhecimento facial e proteção anti-pirataria.",
    href: "/professionals/photographer",
    icon: Camera,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Instrutor",
    description:
      "Ensine modalidades esportivas, gerencie turmas e monetize seu conhecimento.",
    href: "/professionals/trainer",
    icon: GraduationCap,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Dono de Arena",
    description:
      "Maximize a ocupação da sua arena com reservas inteligentes e torneios automáticos.",
    href: "/professionals/arena",
    icon: Building2,
    color: "bg-yellow-100 text-yellow-700",
  },
];

export default function ProfessionalsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 pt-32 pb-20 sm:pt-40 sm:pb-28 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Users className="h-4 w-4" />
              Para Profissionais
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Profissionais que Transformam o Esporte
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-100 sm:text-xl">
              Sua expertise esportiva vale dinheiro. Conecte-se com atletas,
              ofereça serviços e ganhe GCoins com cada interação.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/register?persona=professional"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
              >
                Cadastre-se como Profissional
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Types Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Escolha Sua Categoria
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Cada profissional tem ferramentas e ganhos adaptados ao seu tipo de
              serviço.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {professionals.map((prof) => (
              <Link
                key={prof.title}
                href={prof.href}
                className={cn(
                  "group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:border-blue-200"
                )}
              >
                <div
                  className={cn(
                    "mb-5 flex h-14 w-14 items-center justify-center rounded-xl",
                    prof.color
                  )}
                >
                  <prof.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {prof.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {prof.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:text-blue-700">
                  Saiba mais
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            <div>
              <p className="text-4xl font-bold text-blue-600">2.500+</p>
              <p className="mt-2 text-sm text-gray-600">
                Profissionais cadastrados
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">R$ 4.200</p>
              <p className="mt-2 text-sm text-gray-600">
                Renda média mensal
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">98%</p>
              <p className="mt-2 text-sm text-gray-600">
                Taxa de satisfação
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-16 text-center shadow-xl sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Cadastre-se como Profissional
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Junte-se a milhares de profissionais que já monetizam sua expertise
              esportiva. Cadastro gratuito e sem compromisso.
            </p>
            <a
              href="/register?persona=professional"
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
