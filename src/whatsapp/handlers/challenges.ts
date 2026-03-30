// Challenge/Duel handler
import type { IncomingMessage } from "../types";
import { sessionManager } from "../services/session-manager";
import { whatsapp } from "../services/whatsapp-client";
import { menus } from "../services/menu-builder";
import { db } from "@/server/db";
import {
  challenges,
  challengeParticipants,
  users,
  sports,
  gcoinTransactions,
} from "@/server/db/schema";
import { eq, desc, and, or, ilike, sql, ne } from "drizzle-orm";

export async function handleChallenges(
  phone: string,
  _message: IncomingMessage,
  action: string
): Promise<void> {
  const session = sessionManager.getSession(phone);
  const userId = session.userId!;

  // List active challenges
  if (action === "challenges_list") {
    const activeChallenges = await db.query.challenges.findMany({
      where: eq(challenges.status, "betting_open"),
      with: {
        creator: { columns: { name: true } },
        opponent: { columns: { name: true } },
        sport: { columns: { name: true } },
      },
      orderBy: [desc(challenges.createdAt)],
      limit: 10,
    });

    if (activeChallenges.length === 0) {
      await whatsapp.sendButtons(phone, "Nenhum desafio ativo no momento.", [
        { id: "challenges_create", title: "Criar desafio" },
        { id: "menu_main", title: "Menu principal" },
      ]);
      return;
    }

    const rows = activeChallenges.map((c) => ({
      id: `challenge_view_${c.id}`,
      title: `${c.creator?.name ?? "?"} vs ${c.opponent?.name ?? "?"}`.substring(0, 24),
      description: `${c.sport?.name ?? ""} | ${Number(c.wagerAmount ?? 0)} GCoins`.substring(0, 72),
    }));

    await whatsapp.sendList(
      phone,
      "Desafios ativos:",
      "Ver desafios",
      [{ title: "Desafios", rows }],
      "DESAFIOS"
    );
    return;
  }

  // My challenges
  if (action === "challenges_mine") {
    const myChallenges = await db.query.challenges.findMany({
      where: or(
        eq(challenges.creatorId, userId),
        eq(challenges.opponentId, userId)
      ),
      with: {
        creator: { columns: { name: true } },
        opponent: { columns: { name: true } },
        sport: { columns: { name: true } },
      },
      orderBy: [desc(challenges.createdAt)],
      limit: 10,
    });

    if (myChallenges.length === 0) {
      await whatsapp.sendButtons(phone, "Voce nao tem desafios.", [
        { id: "challenges_create", title: "Criar desafio" },
        { id: "menu_main", title: "Menu principal" },
      ]);
      return;
    }

    const statusMap: Record<string, string> = {
      pending: "Aguardando resposta",
      accepted: "Aceito",
      betting_open: "Apostas abertas",
      in_progress: "Em andamento",
      completed: "Finalizado",
      cancelled: "Cancelado",
    };

    let text = "*MEUS DESAFIOS*\n\n";
    for (const c of myChallenges) {
      text += `*${c.creator?.name ?? "?"} vs ${c.opponent?.name ?? "?"}*\n`;
      text += `${c.sport?.name ?? ""} | ${statusMap[c.status] ?? c.status}\n`;
      text += `Aposta: ${Number(c.wagerAmount ?? 0)} GCoins\n\n`;
    }

    await whatsapp.sendButtons(phone, text, [
      { id: "challenges_create", title: "Novo desafio" },
      { id: "menu_main", title: "Menu principal" },
    ]);
    return;
  }

  // Create challenge flow
  if (action === "challenges_create") {
    sessionManager.setState(phone, "challenge_create", { step: "search_opponent" });
    await whatsapp.sendText(
      phone,
      "Quem voce quer desafiar?\n\nDigite o nome do jogador:"
    );
    return;
  }

  // Challenge creation multi-step
  if (session.state === "challenge_create") {
    const data = session.stateData;
    const step = data.step as string;

    if (step === "search_opponent") {
      // Search for opponent by name
      const searchTerm = action.trim();
      const opponents = await db.query.users.findMany({
        where: and(
          ilike(users.name, `%${searchTerm}%`),
          ne(users.id, userId)
        ),
        columns: { id: true, name: true, city: true },
        limit: 5,
      });

      if (opponents.length === 0) {
        await whatsapp.sendButtons(
          phone,
          `Nenhum jogador encontrado com "${searchTerm}". Tente outro nome.`,
          [
            { id: "challenges_create", title: "Tentar de novo" },
            { id: "menu_main", title: "Voltar" },
          ]
        );
        return;
      }

      const rows = opponents.map((o) => ({
        id: `opponent_${o.id}`,
        title: o.name.substring(0, 24),
        description: o.city ?? "Brasil",
      }));

      sessionManager.updateData(phone, { step: "select_opponent", opponents });

      await whatsapp.sendList(
        phone,
        `Encontrei ${opponents.length} jogador(es):`,
        "Escolher",
        [{ title: "Jogadores", rows }],
        "ESCOLHER OPONENTE"
      );
      return;
    }

    if (step === "select_opponent" && action.startsWith("opponent_")) {
      const opponentId = action.replace("opponent_", "");
      const opponent = await db.query.users.findFirst({
        where: eq(users.id, opponentId),
        columns: { id: true, name: true },
      });

      if (!opponent) {
        await whatsapp.sendText(phone, "Jogador nao encontrado.");
        return;
      }

      sessionManager.updateData(phone, {
        opponentId: opponent.id,
        opponentName: opponent.name,
        step: "sport",
      });

      await whatsapp.sendMessage(phone, menus.askSports());
      return;
    }

    if (step === "sport") {
      const sportName = action.replace("sport_", "").replace(/_/g, " ");
      sessionManager.updateData(phone, { sportName, step: "amount" });
      await whatsapp.sendText(
        phone,
        "Qual o valor da aposta em GCoins? (cada jogador coloca esse valor)\nEx: 50"
      );
      return;
    }

    if (step === "amount") {
      const amount = parseInt(action.trim()) || 0;
      sessionManager.updateData(phone, { amount, step: "confirm" });

      const d = session.stateData;
      await whatsapp.sendMessage(
        phone,
        menus.confirmAction(
          `*CONFIRMAR DESAFIO*\n\n` +
            `Oponente: ${d.opponentName}\n` +
            `Esporte: ${d.sportName}\n` +
            `Aposta: ${amount} GCoins cada\n\n` +
            `Confirmar?`,
          "challenge_confirm",
          "challenge_cancel"
        )
      );
      return;
    }
  }

  // Confirm challenge creation
  if (action === "challenge_confirm") {
    const data = session.stateData;
    const amount = (data.amount as number) ?? 0;

    // Check balance
    if (amount > 0) {
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { gcoinsGamification: true },
      });

      if (Number(user?.gcoinsGamification ?? 0) < amount) {
        await whatsapp.sendButtons(phone, "Saldo insuficiente para o desafio.", [
          { id: "gcoins_buy", title: "Comprar GCoins" },
          { id: "menu_main", title: "Voltar" },
        ]);
        return;
      }
    }

    // Find sport
    const sport = await db.query.sports.findFirst({
      where: ilike(sports.name, `%${data.sportName}%`),
      columns: { id: true },
    });

    // Create challenge
    const [newChallenge] = await db
      .insert(challenges)
      .values({
        type: "duel",
        creatorId: userId,
        opponentId: data.opponentId as string,
        sportId: sport?.id,
        status: "pending",
        wagerAmount: amount.toString(),
        title: `Desafio: ${data.sportName}`,
      })
      .returning();

    if (!newChallenge) {
      await whatsapp.sendMessage(phone, menus.error("Erro ao criar desafio"));
      return;
    }

    sessionManager.resetToMenu(phone);

    await whatsapp.sendText(
      phone,
      `Desafio enviado para *${data.opponentName}*!\n\n` +
        `Quando ele aceitar, as apostas serao abertas para a comunidade.\n` +
        `Voce sera notificado!`
    );

    // Notify opponent (if they have a phone linked)
    const opponent = await db.query.users.findFirst({
      where: eq(users.id, data.opponentId as string),
      columns: { phone: true, name: true },
    });

    if (opponent?.phone) {
      const challengerUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { name: true },
      });

      await whatsapp.sendMessage(
        opponent.phone,
        menus.challengeInvite({
          challengerName: challengerUser?.name ?? "Alguem",
          sport: (data.sportName as string) ?? "Esporte",
          amount,
          id: newChallenge.id,
        })
      );
    }

    await whatsapp.sendMessage(phone, menus.mainMenu());
    return;
  }

  if (action === "challenge_cancel") {
    sessionManager.resetToMenu(phone);
    await whatsapp.sendText(phone, "Desafio cancelado.");
    await whatsapp.sendMessage(phone, menus.mainMenu());
    return;
  }

  // Accept challenge
  if (action.startsWith("challenge_accept_")) {
    const challengeId = action.replace("challenge_accept_", "");
    const challenge = await db.query.challenges.findFirst({
      where: eq(challenges.id, challengeId),
    });

    if (!challenge || challenge.opponentId !== userId) {
      await whatsapp.sendText(phone, "Desafio nao encontrado ou voce nao e o desafiado.");
      return;
    }

    await db
      .update(challenges)
      .set({ status: "accepted" })
      .where(eq(challenges.id, challengeId));

    await whatsapp.sendButtons(phone, "Desafio aceito! Boa sorte!", [
      { id: "challenges_mine", title: "Meus desafios" },
      { id: "menu_main", title: "Menu principal" },
    ]);

    // Notify challenger
    const challenger = await db.query.users.findFirst({
      where: eq(users.id, challenge.creatorId),
      columns: { phone: true },
    });

    if (challenger?.phone) {
      await whatsapp.sendText(
        challenger.phone,
        `Seu desafio foi ACEITO! Prepare-se para a batalha!`
      );
    }
    return;
  }

  // Decline challenge
  if (action.startsWith("challenge_decline_")) {
    const challengeId = action.replace("challenge_decline_", "");
    await db
      .update(challenges)
      .set({ status: "cancelled" })
      .where(eq(challenges.id, challengeId));

    await whatsapp.sendText(phone, "Desafio recusado.");
    await whatsapp.sendMessage(phone, menus.mainMenu());
    return;
  }

  // Default
  await whatsapp.sendMessage(phone, menus.challengesMenu());
}
