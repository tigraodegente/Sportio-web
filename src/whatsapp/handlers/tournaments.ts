// Tournament handler - browse, enroll, create tournaments via WhatsApp
import type { IncomingMessage } from "../types";
import { sessionManager } from "../services/session-manager";
import { whatsapp } from "../services/whatsapp-client";
import { menus } from "../services/menu-builder";
import { db } from "@/server/db";
import {
  tournaments,
  enrollments,
  users,
  gcoinTransactions,
} from "@/server/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { format } from "date-fns";
import { notifyTournamentEnrollment } from "@/server/services/notification-service";

export async function handleTournaments(
  phone: string,
  _message: IncomingMessage,
  action: string
): Promise<void> {
  const session = sessionManager.getSession(phone);
  const userId = session.userId!;

  // List open tournaments
  if (action === "tournaments_list") {
    const openTournaments = await db.query.tournaments.findMany({
      where: eq(tournaments.status, "registration_open"),
      with: { sport: true, organizer: { columns: { name: true } } },
      orderBy: [desc(tournaments.startDate)],
      limit: 10,
    });

    if (openTournaments.length === 0) {
      await whatsapp.sendButtons(phone, "Nenhum torneio com inscricoes abertas no momento.", [
        { id: "tournaments_create", title: "Criar torneio" },
        { id: "menu_main", title: "Menu principal" },
      ]);
      return;
    }

    // Count enrollments for each tournament
    const rows = await Promise.all(
      openTournaments.map(async (t) => {
        const enrollmentCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(enrollments)
          .where(and(eq(enrollments.tournamentId, t.id), eq(enrollments.status, "confirmed")));

        const enrolled = Number(enrollmentCount[0]?.count ?? 0);
        const spots = t.maxParticipants ? `${enrolled}/${t.maxParticipants}` : `${enrolled}`;
        const fee = t.entryFee ? `${t.entryFee} GC` : "Gratis";
        const date = t.startDate ? format(new Date(t.startDate), "dd/MM") : "";

        return {
          id: `tournament_view_${t.id}`,
          title: t.name.substring(0, 24),
          description: `${t.sport?.name ?? ""} | ${date} | ${fee} | ${spots}`.substring(0, 72),
        };
      })
    );

    await whatsapp.sendList(
      phone,
      "Torneios com inscricoes abertas:",
      "Ver torneios",
      [{ title: "Torneios abertos", rows }],
      "TORNEIOS"
    );
    return;
  }

  // View tournament detail
  if (action.startsWith("tournament_view_")) {
    const tournamentId = action.replace("tournament_view_", "");
    const tournament = await db.query.tournaments.findFirst({
      where: eq(tournaments.id, tournamentId),
      with: { sport: true, organizer: { columns: { name: true } } },
    });

    if (!tournament) {
      await whatsapp.sendText(phone, "Torneio nao encontrado.");
      return;
    }

    const enrollmentCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(enrollments)
      .where(and(eq(enrollments.tournamentId, tournamentId), eq(enrollments.status, "confirmed")));

    const enrolled = Number(enrollmentCount[0]?.count ?? 0);

    await whatsapp.sendMessage(
      phone,
      menus.tournamentDetail({
        name: tournament.name,
        sportName: tournament.sport?.name ?? "Esporte",
        city: tournament.city ?? undefined,
        date: tournament.startDate ? format(new Date(tournament.startDate), "dd/MM/yyyy HH:mm") : undefined,
        entryFee: tournament.entryFee ? Number(tournament.entryFee) : undefined,
        enrolled,
        maxParticipants: tournament.maxParticipants ?? undefined,
        status: tournament.status,
        id: tournament.id,
      })
    );

    sessionManager.updateData(phone, { viewingTournament: tournamentId });
    return;
  }

  // Enroll in tournament
  if (action.startsWith("enroll_")) {
    const tournamentId = action.replace("enroll_", "");
    const tournament = await db.query.tournaments.findFirst({
      where: eq(tournaments.id, tournamentId),
    });

    if (!tournament || tournament.status !== "registration_open") {
      await whatsapp.sendText(phone, "Torneio nao disponivel para inscricao.");
      return;
    }

    // Check if already enrolled
    const existing = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.tournamentId, tournamentId),
        eq(enrollments.userId, userId),
      ),
    });

    if (existing) {
      await whatsapp.sendButtons(phone, "Voce ja esta inscrito neste torneio!", [
        { id: "tournaments_list", title: "Outros torneios" },
        { id: "menu_main", title: "Menu principal" },
      ]);
      return;
    }

    // Check spots
    if (tournament.maxParticipants) {
      const enrollmentCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(enrollments)
        .where(and(eq(enrollments.tournamentId, tournamentId), eq(enrollments.status, "confirmed")));

      if (Number(enrollmentCount[0]?.count ?? 0) >= tournament.maxParticipants) {
        await whatsapp.sendText(phone, "Torneio lotado! Nao ha mais vagas.");
        return;
      }
    }

    // Check GCoins balance and deduct entry fee
    const entryFee = Number(tournament.entryFee ?? 0);
    if (entryFee > 0) {
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { gcoinsGamification: true },
      });

      if (Number(user?.gcoinsGamification ?? 0) < entryFee) {
        await whatsapp.sendButtons(
          phone,
          `Saldo insuficiente! Voce precisa de ${entryFee} GCoins.\nSeu saldo: ${Number(user?.gcoinsGamification ?? 0).toFixed(2)} GCoins`,
          [
            { id: "gcoins_buy", title: "Comprar GCoins" },
            { id: "menu_main", title: "Voltar" },
          ]
        );
        return;
      }

      // Deduct GCoins
      await db
        .update(users)
        .set({ gcoinsGamification: sql`${users.gcoinsGamification} - ${entryFee}` })
        .where(eq(users.id, userId));

      await db.insert(gcoinTransactions).values({
        userId,
        type: "gamification",
        category: "tournament_entry",
        amount: (-entryFee).toString(),
        description: `Inscricao: ${tournament.name}`,
        referenceId: tournament.id,
        referenceType: "tournament",
      });
    }

    // Create enrollment
    await db.insert(enrollments).values({
      tournamentId,
      userId,
      status: "confirmed",
    });

    // Notify
    notifyTournamentEnrollment(userId, tournament.name, tournament.id).catch(() => {});

    const message =
      `Inscricao confirmada!\n\n` +
      `*${tournament.name}*\n` +
      (tournament.city ? `Local: ${tournament.city}\n` : "") +
      (tournament.startDate ? `Data: ${format(new Date(tournament.startDate), "dd/MM/yyyy HH:mm")}\n` : "") +
      (entryFee > 0 ? `Taxa: ${entryFee} GCoins debitados\n` : "Gratis!\n") +
      `\nBoa sorte!`;

    await whatsapp.sendButtons(phone, message, [
      { id: "tournaments_list", title: "Outros torneios" },
      { id: "menu_main", title: "Menu principal" },
    ]);
    return;
  }

  // My tournaments
  if (action === "tournaments_mine") {
    const myEnrollments = await db.query.enrollments.findMany({
      where: eq(enrollments.userId, userId),
      with: {
        tournament: {
          with: { sport: true },
        },
      },
      orderBy: [desc(enrollments.createdAt)],
      limit: 10,
    });

    if (myEnrollments.length === 0) {
      await whatsapp.sendButtons(phone, "Voce nao esta inscrito em nenhum torneio.", [
        { id: "tournaments_list", title: "Ver torneios" },
        { id: "menu_main", title: "Menu principal" },
      ]);
      return;
    }

    let text = "*MEUS TORNEIOS*\n\n";
    for (const e of myEnrollments) {
      const t = e.tournament;
      const statusMap: Record<string, string> = {
        confirmed: "Confirmado",
        pending: "Pendente",
        checked_in: "Check-in feito",
        eliminated: "Eliminado",
        winner: "CAMPEAO!",
        cancelled: "Cancelado",
      };
      text += `*${t.name}*\n`;
      text += `${t.sport?.name ?? ""} | Status: ${statusMap[e.status] ?? e.status}\n\n`;
    }

    await whatsapp.sendButtons(phone, text, [
      { id: "tournaments_list", title: "Ver mais torneios" },
      { id: "menu_main", title: "Menu principal" },
    ]);
    return;
  }

  // Create tournament (simplified - redirects to WhatsApp Flow in production)
  if (action === "tournaments_create") {
    sessionManager.setState(phone, "tournament_create", { step: "name" });
    await whatsapp.sendText(phone, "Vamos criar seu torneio!\n\nQual e o nome do torneio?");
    return;
  }

  // Tournament creation flow (multi-step)
  if (session.state === "tournament_create") {
    const data = session.stateData;
    const step = data.step as string;

    if (step === "name") {
      sessionManager.updateData(phone, { tournamentName: action.trim(), step: "sport" });
      await whatsapp.sendMessage(phone, menus.askSports());
      return;
    }

    if (step === "sport") {
      const sportName = action.replace("sport_", "").replace(/_/g, " ");
      sessionManager.updateData(phone, { sportName, step: "city" });
      await whatsapp.sendText(phone, "Em qual cidade sera o torneio?");
      return;
    }

    if (step === "city") {
      sessionManager.updateData(phone, { city: action.trim(), step: "date" });
      await whatsapp.sendText(phone, "Qual a data e horario? (ex: 15/04/2026 14:00)");
      return;
    }

    if (step === "date") {
      sessionManager.updateData(phone, { dateStr: action.trim(), step: "fee" });
      await whatsapp.sendText(phone, "Qual a taxa de inscricao em GCoins? (0 para gratis)");
      return;
    }

    if (step === "fee") {
      const fee = parseInt(action.trim()) || 0;
      sessionManager.updateData(phone, { entryFee: fee, step: "max" });
      await whatsapp.sendText(phone, "Quantos participantes no maximo? (ex: 16, 32)");
      return;
    }

    if (step === "max") {
      const maxP = parseInt(action.trim()) || 16;
      const d = { ...session.stateData, maxParticipants: maxP };

      // Find sport
      const sport = await db.query.sports.findFirst({
        where: eq(sports.name, (d.sportName as string) ?? ""),
        columns: { id: true },
      });

      // Parse date
      let startDate: Date | null = null;
      try {
        const [datePart, timePart] = ((d.dateStr as string) ?? "").split(" ");
        const [day, month, year] = (datePart ?? "").split("/").map(Number);
        const [hour, minute] = (timePart ?? "14:00").split(":").map(Number);
        startDate = new Date(year!, month! - 1, day, hour, minute);
      } catch {
        startDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
      }

      const [newTournament] = await db
        .insert(tournaments)
        .values({
          name: (d.tournamentName as string) ?? "Torneio Sportio",
          sportId: sport?.id,
          organizerId: userId,
          city: (d.city as string) ?? undefined,
          status: "registration_open",
          startDate,
          entryFee: ((d.entryFee as number) ?? 0).toString(),
          maxParticipants: maxP,
          format: "single_elimination",
        })
        .returning();

      if (!newTournament) {
        await whatsapp.sendMessage(phone, menus.error("Erro ao criar torneio"));
        return;
      }

      sessionManager.resetToMenu(phone);

      await whatsapp.sendButtons(
        phone,
        `Torneio criado com sucesso!\n\n*${newTournament.name}*\nStatus: Inscricoes abertas\nVagas: 0/${maxP}\n\nCompartilhe com seus amigos!`,
        [
          { id: `tournament_view_${newTournament.id}`, title: "Ver torneio" },
          { id: "menu_main", title: "Menu principal" },
        ]
      );
      return;
    }
  }

  // Default
  await whatsapp.sendMessage(phone, menus.tournamentsMenu());
}

// Import sports table
import { sports } from "@/server/db/schema";
