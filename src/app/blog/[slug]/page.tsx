import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  User,
  Facebook,
  Twitter,
  Linkedin,
  Share2,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getBlogPost, getBlogPosts, blogPosts } from "@/lib/blog-data";

// ── Static params ──
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

// ── Metadata ──
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: "Artigo não encontrado" };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: `${post.title} | Blog Sportio`,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

// ── Markdown → HTML (basic) ──
function markdownToHtml(md: string): string {
  let html = md
    // Headings (## → h2)
    .replace(/^## (.+)$/gm, '<h2 class="mt-10 mb-4 text-2xl font-bold text-gray-900">$1</h2>')
    // Bold (**text**)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Unordered list items (- item)
    .replace(
      /^- (.+)$/gm,
      '<li class="ml-1 flex items-start gap-2"><span class="mt-2 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span><span>$1</span></li>'
    );

  // Wrap consecutive <li> in <ul>
  html = html.replace(
    /(<li[\s\S]*?<\/li>\n?)+/g,
    (match) =>
      `<ul class="my-4 space-y-2 text-gray-600">${match}</ul>`
  );

  // Paragraphs: split by double newline, wrap non-tag lines in <p>
  const blocks = html.split(/\n{2,}/);
  html = blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h2") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<li")
      ) {
        return trimmed;
      }
      return `<p class="my-4 leading-relaxed text-gray-600">${trimmed}</p>`;
    })
    .join("\n");

  return html;
}

// ── Date formatter ──
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ── Accent colors ──
const accentColors: Record<string, string> = {
  futebol: "bg-blue-600",
  "beach-tennis": "bg-amber-500",
  corrida: "bg-blue-500",
  crossfit: "bg-red-500",
};

// ── Page Component ──
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const shareUrl = `https://sportio.com/blog/${post.slug}`;
  const shareText = encodeURIComponent(post.title);

  // Related posts: same sport first, then same tags, exclude current
  const allPosts = getBlogPosts();
  const related = allPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const aScore =
        (a.sport === post.sport && post.sport ? 10 : 0) +
        a.tags.filter((t) => post.tags.includes(t)).length;
      const bScore =
        (b.sport === post.sport && post.sport ? 10 : 0) +
        b.tags.filter((t) => post.tags.includes(t)).length;
      return bScore - aScore;
    })
    .slice(0, 3);

  const contentHtml = markdownToHtml(post.content);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Top accent bar ── */}
      <div
        className={cn(
          "h-1.5 w-full",
          post.sport && accentColors[post.sport]
            ? accentColors[post.sport]
            : "bg-gradient-to-r from-blue-500 to-cyan-400"
        )}
      />

      {/* ── Article ── */}
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Blog
        </Link>

        {/* Emoji cover */}
        <div className="mt-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 text-4xl">
          {post.coverImage}
        </div>

        {/* Title */}
        <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">
                {post.author.name}
              </span>
              <span className="text-xs text-gray-400">{post.author.role}</span>
            </div>
          </div>

          <span className="hidden h-4 w-px bg-gray-200 sm:block" />

          {/* Date */}
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-gray-400" />
            {formatDate(post.publishedAt)}
          </span>

          <span className="hidden h-4 w-px bg-gray-200 sm:block" />

          {/* Read time */}
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-gray-400" />
            {post.readTime} min de leitura
          </span>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Tag className="h-4 w-4 text-gray-300" />
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-200" />

        {/* Content */}
        <div
          className="prose-sportio"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Divider */}
        <hr className="my-10 border-gray-200" />

        {/* Share section */}
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-gray-50 p-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Share2 className="h-4 w-4" />
            Compartilhe este artigo
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Compartilhar no Facebook"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                "bg-white text-gray-500 shadow-sm hover:bg-blue-600 hover:text-white"
              )}
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Compartilhar no Twitter"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                "bg-white text-gray-500 shadow-sm hover:bg-sky-500 hover:text-white"
              )}
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Compartilhar no LinkedIn"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                "bg-white text-gray-500 shadow-sm hover:bg-blue-700 hover:text-white"
              )}
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 p-8 text-center text-white sm:p-10">
          <h3 className="text-2xl font-extrabold sm:text-3xl">
            Cadastre-se grátis e comece a ganhar
          </h3>
          <p className="mt-3 max-w-lg text-blue-100">
            Junte-se a milhares de atletas que já transformam esporte em renda
            real. Crie sua conta em menos de 2 minutos.
          </p>
          <Link
            href="#cadastro"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-50 hover:shadow-lg"
          >
            Criar Conta Grátis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>

      {/* ── Related Articles ── */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Artigos Relacionados
          </h2>
          <p className="mt-2 text-center text-gray-500">
            Continue explorando conteúdos para maximizar seus ganhos
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((relPost) => (
              <Link
                key={relPost.slug}
                href={`/blog/${relPost.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-900/5"
              >
                {/* Accent bar */}
                <div
                  className={cn(
                    "h-1.5 w-full",
                    relPost.sport && accentColors[relPost.sport]
                      ? accentColors[relPost.sport]
                      : "bg-gradient-to-r from-blue-500 to-cyan-400"
                  )}
                />

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
                    {relPost.coverImage}
                  </div>

                  <h3 className="text-lg font-bold leading-snug text-gray-900 group-hover:text-blue-600 transition-colors">
                    {relPost.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {relPost.description}
                  </p>

                  <div className="flex-1" />

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-400">
                    <span className="font-medium text-gray-600">
                      {relPost.author.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {relPost.readTime} min
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
