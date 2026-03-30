// WhatsApp Community & Group auto-management
import { whatsapp } from "./whatsapp-client";
import { db } from "@/server/db";
import { tournaments, enrollments, users, sports } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

// Store group IDs (in production, persist to DB)
const groupRegistry = new Map<string, string>(); // key -> groupJid

type GroupType = "tournament" | "sport_city" | "challenge";

function groupKey(type: GroupType, id: string, extra?: string): string {
  return `${type}:${id}${extra ? `:${extra}` : ""}`;
}

/**
 * Create a WhatsApp group for a tournament
 * Called when tournament is created or when first enrollment happens
 */
export async function createTournamentGroup(tournamentId: string): Promise<string | null> {
  const key = groupKey("tournament", tournamentId);

  // Already exists?
  if (groupRegistry.has(key)) {
    return groupRegistry.get(key)!;
  }

  const tournament = await db.query.tournaments.findFirst({
    where: eq(tournaments.id, tournamentId),
    with: {
      sport: { columns: { name: true } },
      organizer: { columns: { name: true, phone: true } },
    },
  });

  if (!tournament) return null;

  const groupName = `Sportio: ${tournament.name}`.substring(0, 72);

  // Get enrolled users' phone numbers
  const enrolled = await db.query.enrollments.findMany({
    where: and(eq(enrollments.tournamentId, tournamentId), eq(enrollments.status, "confirmed")),
    with: { user: { columns: { phone: true } } },
  });

  const participants = enrolled
    .map((e) => e.user?.phone)
    .filter((p): p is string => !!p);

  // Add organizer
  if (tournament.organizer?.phone) {
    participants.push(tournament.organizer.phone);
  }

  if (participants.length === 0) return null;

  const groupId = await whatsapp.createGroup(groupName, participants);

  if (groupId) {
    groupRegistry.set(key, groupId);

    // Send welcome message
    await whatsapp.sendToGroup(groupId, {
      type: "text",
      text:
        `Bem-vindos ao grupo do torneio *${tournament.name}*!\n\n` +
        `Esporte: ${tournament.sport?.name ?? ""}\n` +
        `Organizador: ${tournament.organizer?.name ?? ""}\n\n` +
        `Aqui voces receberao atualizacoes sobre o torneio, chaves e resultados.`,
    });
  }

  return groupId;
}

/**
 * Add a user to a tournament group when they enroll
 */
export async function addToTournamentGroup(
  tournamentId: string,
  userPhone: string
): Promise<void> {
  const key = groupKey("tournament", tournamentId);
  const groupId = groupRegistry.get(key);

  if (!groupId) {
    // Try to create group
    await createTournamentGroup(tournamentId);
    return;
  }

  try {
    await whatsapp.addToGroup(groupId, [userPhone]);
  } catch (error) {
    console.error(`[CommunityManager] Failed to add ${userPhone} to group:`, error);
  }
}

/**
 * Send update to tournament group
 */
export async function sendTournamentUpdate(
  tournamentId: string,
  message: string
): Promise<void> {
  const key = groupKey("tournament", tournamentId);
  const groupId = groupRegistry.get(key);

  if (!groupId) return;

  await whatsapp.sendToGroup(groupId, { type: "text", text: message });
}

/**
 * Create a sport-city community group
 * e.g., "Beach Tennis - Sao Paulo"
 */
export async function createSportCityGroup(
  sportId: string,
  city: string
): Promise<string | null> {
  const key = groupKey("sport_city", sportId, city);

  if (groupRegistry.has(key)) {
    return groupRegistry.get(key)!;
  }

  const sport = await db.query.sports.findFirst({
    where: eq(sports.id, sportId),
    columns: { name: true },
  });

  if (!sport) return null;

  const groupName = `Sportio: ${sport.name} - ${city}`.substring(0, 72);
  const groupId = await whatsapp.createGroup(groupName, []);

  if (groupId) {
    groupRegistry.set(key, groupId);

    await whatsapp.sendToGroup(groupId, {
      type: "text",
      text:
        `Bem-vindos ao grupo de *${sport.name}* em *${city}*!\n\n` +
        `Aqui voces ficam sabendo de torneios, desafios e noticias do esporte na regiao.`,
    });
  }

  return groupId;
}

/**
 * Send match result to tournament group
 */
export async function notifyMatchResult(
  tournamentId: string,
  winnerName: string,
  loserName: string,
  score: string,
  round?: string
): Promise<void> {
  const message =
    `*RESULTADO*\n\n` +
    (round ? `${round}\n` : "") +
    `${winnerName} venceu ${loserName}\n` +
    `Placar: ${score}\n`;

  await sendTournamentUpdate(tournamentId, message);
}

/**
 * Get all registered groups
 */
export function getRegisteredGroups(): Map<string, string> {
  return groupRegistry;
}
