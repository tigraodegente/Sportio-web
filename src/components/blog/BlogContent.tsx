"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  User,
  Calendar,
  Target,
  Sun,
  Footprints,
  Dumbbell,
  Trophy,
  TrendingUp,
  Dice5,
  Flag,
  Apple,
  Camera,
  GraduationCap,
  Coins,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/lib/blog-data";

const coverIconMap: Record<string, LucideIcon> = {
  target: Target,
  sun: Sun,
  footprints: Footprints,
  dumbbell: Dumbbell,
  trophy: Trophy,
  "trending-up": TrendingUp,
  dice: Dice5,
  flag: Flag,
  apple: Apple,
  camera: Camera,
  "graduation-cap": GraduationCap,
  coins: Coins,
};

function CoverIcon({ name, className }: { name: string; className?: string }) {
  const Icon = coverIconMap[name] || Trophy;
  return <Icon className={className} />;
}

const sportFilters = [
  { id: "todos", label: "Todos" },
  { id: "futebol", label: "Futebol" },
  { id: "beach-tennis", label: "Beach Tennis" },
  { id: "corrida", label: "Corrida" },
  { id: "crossfit", label: "CrossFit" },
];

const accentColors: Record<string, string> = {
  futebol: "bg-blue-600",
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

interface BlogContentProps {
  posts: BlogPost[];
}

export default function BlogContent({ posts }: BlogContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSport, setActiveSport] = useState("todos");

  const filteredPosts = useMemo(() => {
    let result = posts;

    // Filter by sport
    if (activeSport !== "todos") {
      result = result.filter((post) => post.sport === activeSport);
    }

    // Filter by search term (title and description)
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(lower) ||
          post.description.toLowerCase().includes(lower)
      );
    }

    return result;
  }, [posts, searchTerm, activeSport]);

  return (
    <>
      {/* Search & Filters */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 shadow-lg shadow-gray-900/5 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Sport filter tabs */}
          <div className="flex flex-wrap gap-2">
            {sportFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveSport(filter.id)}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  activeSport === filter.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "bg-white text-gray-600 shadow-sm hover:bg-gray-50"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Nenhum artigo encontrado
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Tente buscar por outros termos ou selecione outro esporte.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
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
                      : "bg-gradient-to-r from-blue-500 to-cyan-400"
                  )}
                />

                {/* Card body */}
                <div className="flex flex-1 flex-col p-6">
                  {/* Cover icon */}
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100">
                    <CoverIcon
                      name={post.coverImage}
                      className="h-7 w-7 text-blue-600"
                    />
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold leading-snug text-gray-900 group-hover:text-blue-600 transition-colors">
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
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600">
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
        )}
      </section>
    </>
  );
}
