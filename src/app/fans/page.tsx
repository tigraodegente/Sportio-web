import {
  Rss,
  MessageCircle,
  Users,
  Coins,
  Lock,
  BarChart3,
  ArrowRight,
  Star,
  Heart,
  Target,
  ChevronRight,
  Share2,
  Trophy,
  Video,
  Flame,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Torcedores | Sportio - O Esporte é Mais Emocionante Quando Você Faz Parte",
  description:
    "Acompanhe torneios, torça pelos seus atletas preferidos e ganhe GCoins por cada interação. Faça parte da comunidade esportiva.",
};

const steps = [
  {
    number: "01",
    title: "Siga atletas e torneios",
    description:
      "Escolha seus atletas favoritos e os torneios que quer acompanhar de perto.",
    icon: Heart,
  },
  {
    number: "02",
    title: "Curta, comente, compartilhe",
    description:
      "Interaja com o conteúdo esportivo e ganhe GCoins por cada engajamento.",
    icon: MessageCircle,
  },
  {
    number: "03",
    title: "Acerte palpites",
    description:
      "Dê seus palpites nos jogos e acumule GCoins extras por acertos.",
    icon: Target,
  },
  {
    number: "04",
    title: "Ganhe recompensas",
    description:
      "Troque seus GCoins por prêmios exclusivos, ingressos e produtos esportivos.",
    icon: Coins,
  },
];

const benefits = [
  {
    title: "Feed esportivo ao vivo",
    description:
      "Acompanhe resultados, placares e destaques em tempo real dos torneios que você segue.",
    icon: Rss,
  },
  {
    title: "Palpites e previsões",
    description:
      "Teste seus conhecimentos esportivos e ganhe GCoins acertando resultados.",
    icon: Target,
  },
  {
    title: "Comunidade engajada",
    description:
      "Conecte-se com outros torcedores, debata jogadas e celebre conquistas juntos.",
    icon: Users,
  },
  {
    title: "GCoins por engajamento",
    description:
      "Cada curtida, comentário e compartilhamento gera GCoins na sua carteira.",
    icon: Coins,
  },
  {
    title: "Conteúdo exclusivo",
    description:
      "Acesse bastidores, entrevistas e conteúdos exclusivos dos seus atletas favoritos.",
    icon: Lock,
  },
  {
    title: "Ranking de fãs",
    description:
      "Suba no ranking dos torcedores mais engajados e ganhe recompensas especiais.",
    icon: BarChart3,
  },
];

const earningExamples = [
  {
    activity: "Curtidas e Comentários",
    reward: "20 - 50 GCoins",
    description:
      "Interaja com publicações de atletas e torneios para acumular GCoins diariamente.",
    color: "bg-blue-50 border-blue-200",
    accent: "text-blue-600",
  },
  {
    activity: "Palpites Corretos",
    reward: "100 - 300 GCoins",
    description:
      "Acerte resultados de partidas e receba GCoins proporcionais à dificuldade.",
    color: "bg-blue-100 border-blue-300",
    accent: "text-blue-700",
  },
  {
    activity: "Top Fã do Mês",
    reward: "1.000 GCoins",
    description:
      "Os torcedores mais engajados do mês recebem bônus exclusivos e destaque na plataforma.",
    color: "bg-blue-200 border-blue-400",
    accent: "text-blue-800",
  },
];

export default function FansPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 pt-32 pb-20 sm:pt-40 sm:pb-28 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Heart className="h-4 w-4" />
              Para Torcedores
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              O Esporte é Mais Emocionante Quando Você Faz Parte
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-100 sm:text-xl">
              Acompanhe torneios, torça pelos seus atletas preferidos e ganhe
              GCoins por cada interação.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
              >
                Começar a Torcer
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
              Torça, interaja e ganhe recompensas em 4 passos simples.
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
              Uma Nova Forma de Viver o Esporte
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Mais do que assistir: participe, interaja e seja recompensado.
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

      {/* GCoins Gamificacao Table */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
              <Coins className="h-4 w-4" />
              GCoins para Torcedores
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Cada Interacao Vale GCoins
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Quanto mais voce torce, mais voce ganha. Confira a tabela completa.
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
                  <td className="px-6 py-4 text-sm text-gray-700">Assistir partida</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">50 / hora</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">Gamificacao</span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">Curtir torneio</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">20</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">Gamificacao</span>
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm text-gray-700">Comentar em partida</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">50</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">Gamificacao</span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">Compartilhar resultado</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">100</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">Gamificacao</span>
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 text-sm text-gray-700">10 pessoas seguiram seu palpite</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">300 extras</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">Bonus</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Funcionalidades Para Torcedores
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tudo que voce precisa para viver o esporte de um jeito novo.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Target, title: "Apostas gamificadas", desc: "Dê palpites e ganhe GCoins sem risco financeiro. Pura diversao." },
              { icon: BarChart3, title: "Ranking de fas", desc: "Suba no ranking dos torcedores mais engajados da plataforma." },
              { icon: Trophy, title: "Desafios de torcida", desc: "Complete desafios semanais e ganhe recompensas exclusivas." },
              { icon: Video, title: "Stories e conteudo exclusivo", desc: "Acesse bastidores, entrevistas e conteudos dos seus atletas favoritos." },
              { icon: Eye, title: "Lives de partidas", desc: "Assista partidas ao vivo com comentarios e interacao em tempo real." },
            ].map((feat) => (
              <div key={feat.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <feat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feat.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ganhe GCoins Por Torcer
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Cada interação na plataforma é recompensada. Veja como acumular.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {earningExamples.map((example) => (
              <div
                key={example.activity}
                className={cn(
                  "rounded-2xl border p-8 text-center transition-all hover:shadow-md",
                  example.color
                )}
              >
                <h3
                  className={cn(
                    "text-sm font-bold uppercase tracking-wider",
                    example.accent
                  )}
                >
                  {example.activity}
                </h3>
                <p className="mt-4 text-3xl font-bold text-gray-900">
                  {example.reward}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  {example.description}
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
                &ldquo;Ganhei prêmios só por torcer e comentar no app. É
                viciante!&rdquo;
              </p>
            </blockquote>
            <div className="mt-6">
              <p className="font-semibold text-gray-900">Pedro Costa</p>
              <p className="text-sm text-gray-500">Torcedor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-16 text-center shadow-xl sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto Para Torcer e Ganhar?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Junte-se a milhares de torcedores que já estão ganhando GCoins
              por acompanhar o esporte que amam.
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
