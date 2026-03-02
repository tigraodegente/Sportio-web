import type { Metadata } from "next";
import Link from "next/link";
import {
  Newspaper,
  ArrowRight,
} from "lucide-react";
import { getBlogPosts } from "@/lib/blog-data";
import BlogContent from "@/components/blog/BlogContent";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Dicas, estratégias e histórias de sucesso para ganhar dinheiro real com esporte. Futebol, beach tennis, corrida, CrossFit e muito mais.",
  openGraph: {
    title: "Blog Sportio - Ganhe Dinheiro com Esporte",
    description:
      "Dicas, estratégias e histórias de sucesso para ganhar dinheiro real com esporte.",
  },
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gray-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6 sm:pt-40 sm:pb-24 lg:px-8 lg:py-28">
          <div className="flex items-center gap-2 text-blue-400">
            <Newspaper className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Blog
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Blog{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Sportio
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300 sm:text-xl">
            Ganhe Dinheiro com Esporte — dicas, estratégias e histórias de quem
            já está transformando paixão em renda real.
          </p>
        </div>
      </section>

      {/* ── Search, Filters & Posts Grid (Client Component) ── */}
      <BlogContent posts={posts} />

      {/* ── CTA ── */}
      <section className="bg-gray-900 text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Pronto para transformar esporte em{" "}
            <span className="text-blue-400">renda real</span>?
          </h2>
          <p className="mt-4 max-w-xl text-gray-400">
            Cadastre-se gratuitamente no Sportio e comece a acumular GCoins com
            cada partida, treino e torneio. Milhares de atletas já estão
            ganhando.
          </p>
          <Link
            href="#cadastro"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Criar Conta Grátis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
