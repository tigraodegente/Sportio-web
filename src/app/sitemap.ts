import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  const staticPages = [
    "",
    "/athletes",
    "/organizers",
    "/brands",
    "/fans",
    "/bettors",
    "/referees",
    "/blog",
  ];

  const blogSlugs = [
    "como-jogadores-amadores-futebol-ganham-dinheiro",
    "beach-tennis-transforme-lazer-em-renda",
    "corredor-amador-ganhe-dinheiro-correndo",
    "crossfit-monetize-seus-wods",
    "organizador-de-liga-monetize-cada-torneio",
    "como-marcas-geram-roi-no-sportio",
    "apostas-esportivas-para-iniciantes",
    "arbitro-de-futebol-ganhe-por-partida",
    "nutricionista-esportivo-renda-recorrente",
    "fotografo-esportivo-monetize-eventos",
    "atleta-universitario-bolsas-e-renda",
    "a-nova-economia-do-gcoin",
  ];

  const pages: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pages, ...blogPages];
}
