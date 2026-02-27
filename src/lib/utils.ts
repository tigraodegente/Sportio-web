import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge.
 * Handles conditional classes and resolves Tailwind conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a GCoins amount with locale-aware thousand separators.
 * Example: 1500 -> "1.500 GC" | 1000000 -> "1.000.000 GC"
 */
export function formatGCoins(amount: number): string {
  const formatted = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return `${formatted} GC`;
}

/**
 * Formats a number as Brazilian Real (BRL) currency.
 * Example: 49.90 -> "R$ 49,90" | 1500 -> "R$ 1.500,00"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Converts a string into a URL-friendly slug.
 * Handles accented characters, special chars, and multiple spaces/dashes.
 * Example: "Beach Tennis" -> "beach-tennis" | "Corrida de Rua" -> "corrida-de-rua"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens
}
