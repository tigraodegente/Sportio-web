import type { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  Clock,
  User,
  Calendar,
  ArrowRight,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getBlogPosts } from "@/lib/blog-data";

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

const sportFilters = [
  { id: "todos", label: "Todos" },
  { id: "futebol", label: "Futebol" },
  { id: "beach-tennis", label: "Beach Tennis" },
  { id: "corrida", label: "Corrida" },
  { id: "crossfit", label: "CrossFit" },
];

const accentColors: Record<string, string> = {
  futebol: "bg-emerald-500",
  "beach-tennis": "bg-amber-500",
  corrida: "bg-blue-500",
  crossfit: "bg-red-500",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gray-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="flex items-center gap-2 text-emerald-400">
            <Newspaper className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Blog
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Blog{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Sportio
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300 sm:text-xl">
            Ganhe Dinheiro com Esporte — dicas, estratégias e histórias de quem
            já está transformando paixão em renda real.
          </p>
        </div>
      </section>

      {/* ── Search & Filters ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar artigos..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 shadow-lg shadow-gray-900/5 outline-none placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              readOnly
            />
          </div>

          {/* Sport filter tabs */}
          <div className="flex flex-wrap gap-2">
            {sportFilters.map((filter, idx) => (
              <span
                key={filter.id}
                className={cn(
                  "cursor-default rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  idx === 0
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                    : "bg-white text-gray-600 shadow-sm hover:bg-gray-50"
                )}
              >
                {filter.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Posts Grid ── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-900/5"
            >
              {/* Accent bar */}
              <div
                className={cn(
                  "h-1.5 w-full",
                  post.sport && accentColors[post.sport]
                    ? accentColors[post.sport]
                    : "bg-gradient-to-r from-emerald-500 to-teal-400"
                )}
              />

              {/* Card body */}
              <div className="flex flex-1 flex-col p-6">
                {/* Emoji cover */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                  {post.coverImage}
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold leading-snug text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {post.title}
                </h2>

                {/* Description (2 lines) */}
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
                  {post.description}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Meta */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-900">
                        {post.author.name}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {post.author.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gray-900 text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Pronto para transformar esporte em{" "}
            <span className="text-emerald-400">renda real</span>?
          </h2>
          <p className="mt-4 max-w-xl text-gray-400">
            Cadastre-se gratuitamente no Sportio e comece a acumular GCoins com
            cada partida, treino e torneio. Milhares de atletas já estão
            ganhando.
          </p>
          <Link
            href="#cadastro"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25"
          >
            Criar Conta Grátis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
