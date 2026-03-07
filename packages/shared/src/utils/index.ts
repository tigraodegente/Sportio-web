// ============================================
// Sportio Shared Utilities
// Platform-agnostic utils (no React/DOM dependencies)
// ============================================

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
 * Formats a date as a relative time string in Portuguese.
 * Example: "2 horas atras", "ha 3 dias"
 */
export function formatDistanceToNow(date: Date | string): string {
  const now = new Date();
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 60) return "agora";
  if (diffMinutes < 60) return `${diffMinutes}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  if (diffWeeks < 4) return `${diffWeeks}sem`;
  if (diffMonths < 12) return `${diffMonths}m`;
  return d.toLocaleDateString("pt-BR");
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

/**
 * Calculates the user level from XP.
 * Each level requires 1000 XP.
 */
export function calculateLevel(xp: number): number {
  return Math.floor(xp / 1000) + 1;
}

/**
 * Calculates XP progress within the current level (0-100).
 */
export function calculateLevelProgress(xp: number): number {
  return (xp % 1000) / 10;
}

/**
 * Truncates text to a max length, adding ellipsis if needed.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Generates initials from a name (up to 2 characters).
 * Example: "Joao Silva" -> "JS" | "Maria" -> "MA"
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
