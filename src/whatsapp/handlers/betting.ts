// Betting handler - place bets, view odds, check results
import type { IncomingMessage } from "../types";
import { sessionManager } from "../services/session-manager";
import { whatsapp } from "../services/whatsapp-client";
import { menus } from "../services/menu-builder";
import { db } from "@/server/db";
import {
  bets,
  matches,
  challenges,
  users,
  gcoinTransactions,
  tournaments,
} from "@/server/db/schema";
import { eq, desc, and, sql, inArray } from "drizzle-orm";

export async function handleBetting(
  phone: string,
  _message: IncomingMessage,
  action: string
): Promise<void> {
  const session = sessionManager.getSession(phone);
  const userId = session.userId!;

  // Show open bets (from active matches and challenges)
  if (action === "bets_open") {
    // Get matches with open bets
    const activeMatches = await db.query.matches.findMany({
      where: inArray(matches.status, ["scheduled", "live"]),
      with: {
        tournament: { columns: { name: true } },
        player1: { columns: { name: true } },
        player2: { columns: { name: true } },
        team1: { columns: { name: true } },
        team2: { columns: { name: true } },
      },
      orderBy: [desc(matches.scheduledAt)],
      limit: 10,
    });

    // Get challenges with open bets
    const activeChallenges = await db.query.challenges.findMany({
      where: eq(challenges.status, "betting_open"),
      with: {
        challenger: { columns: { name: true } },
        opponent: { columns: { name: true } },
        sport: { columns: { name: true } },
      },
      orderBy: [desc(challenges.createdAt)],
      limit: 10,
    });

    if (activeMatches.length === 0 && activeChallenges.length === 0) {
      await whatsapp.sendButtons(phone, "Nenhuma aposta disponivel no momento.", [
        { id: "menu_challenges", title: "Ver desafios" },
        { id: "menu_main", title: "Menu principal" },
      ]);
      return;
    }

    const rows: Array<{ id: string; title: string; description?: string }> = [];

    for (const m of activeMatches) {
      const p1 = m.player1?.name ?? m.team1?.name ?? "Jogador 1";
      const p2 = m.player2?.name ?? m.team2?.name ?? "Jogador 2";
      rows.push({
        id: `bet_match_${m.id}`,
        title: `${p1} vs ${p2}`.substring(0, 24),
        description: `${m.tournament?.name ?? "Torneio"} | ${m.status === "live" ? "AO VIVO" : "Agendado"}`.substring(0, 72),
      });
    }

    for (const c of activeChallenges) {
      rows.push({
        id: `bet_challenge_${c.id}`,
        title: `${c.challenger?.name ?? "?"} vs ${c.opponent?.name ?? "?"}`.substring(0, 24),
        description: `Desafio ${c.sport?.name ?? ""} | Apostas abertas`.substring(0, 72),
      });
    }

    await whatsapp.sendList(
      phone,
      "Escolha uma partida para apostar:",
      "Ver partidas",
      [{ title: "Partidas disponiveis", rows }],
      "APOSTAS ABERTAS"
    );
    return;
  }

  // Bet on a match
  if (action.startsWith("bet_match_")) {
    const matchId = action.replace("bet_match_", "");
    const match = await db.query.matches.findFirst({
      where: eq(matches.id, matchId),
      with: {
        player1: { columns: { id: true, name: true } },
        player2: { columns: { id: true, name: true } },
        team1: { columns: { id: true, name: true } },
        team2: { columns: { id: true, name: true } },
        tournament: { columns: { id: true, name: true } },
      },
    });

    if (!match) {
      await whatsapp.sendText(phone, "Partida nao encontrada.");
      return;
    }

    const p1Name = match.player1?.name ?? match.team1?.name ?? "Jogador 1";
    const p2Name = match.player2?.name ?? match.team2?.name ?? "Jogador 2";
    const p1Id = match.player1?.id ?? match.team1?.id ?? "p1";
    const p2Id = match.player2?.id ?? match.team2?.id ?? "p2";

    // Simple odds calculation (2.0 default if no odds engine available)
    const odds1 = 1.85;
    const odds2 = 2.10;

    sessionManager.setState(phone, "bet_select_match", {
      matchId: match.id,
      tournamentId: match.tournament?.id,
      type: "tournament",
      options: {
        [p1Id]: { name: p1Name, odds: odds1 },
        [p2Id]: { name: p2Name, odds: odds2 },
      },
    });

    await whatsapp.sendButtons(
      phone,
      `*${p1Name} vs ${p2Name}*\n${match.tournament?.name ?? ""}\n\nOdds:\n  ${p1Name}: ${odds1.toFixed(2)}x\n  ${p2Name}: ${odds2.toFixed(2)}x\n\nEm quem voce aposta?`,
      [
        { id: `bet_select_${p1Id}`, title: p1Name.substring(0, 20) },
        { id: `bet_select_${p2Id}`, title: p2Name.substring(0, 20) },
        { id: "bets_open", title: "Voltar" },
      ]
    );
    return;
  }

  // Bet on a challenge
  if (action.startsWith("bet_challenge_")) {
    const challengeId = action.replace("bet_challenge_", "");
    const challenge = await db.query.challenges.findFirst({
      where: eq(challenges.id, challengeId),
      with: {
        challenger: { columns: { id: true, name: true } },
        opponent: { columns: { id: true, name: true } },
        sport: { columns: { name: true } },
      },
    });

    if (!challenge) {
      await whatsapp.sendText(phone, "Desafio nao encontrado.");
      return;
    }

    const c = challenge.challenger!;
    const o = challenge.opponent!;

    sessionManager.setState(phone, "bet_select_match", {
      challengeId: challenge.id,
      type: "challenge",
      options: {
        [c.id]: { name: c.name, odds: 1.90 },
        [o.id]: { name: o.name, odds: 1.90 },
      },
    });

    await whatsapp.sendButtons(
      phone,
      `*DESAFIO: ${c.name} vs ${o.name}*\n${challenge.sport?.name ?? ""}\n\nOdds:\n  ${c.name}: 1.90x\n  ${o.name}: 1.90x\n\nEm quem voce aposta?`,
      [
        { id: `bet_select_${c.id}`, title: c.name.substring(0, 20) },
        { id: `bet_select_${o.id}`, title: o.name.substring(0, 20) },
        { id: "bets_open", title: "Voltar" },
      ]
    );
    return;
  }

  // Select who to bet on
  if (action.startsWith("bet_select_")) {
    const selectedId = action.replace("bet_select_", "");
    const options = session.stateData.options as Record<string, { name: string; odds: number }>;
    const selected = options?.[selectedId];

    if (!selected) {
      await whatsapp.sendText(phone, "Opcao invalida.");
      return;
    }

    sessionManager.setState(phone, "bet_place", {
      ...session.stateData,
      selectedId,
      selectedName: selected.name,
      selectedOdds: selected.odds,
    });

    await whatsapp.sendMessage(phone, menus.betAmountPrompt(selected.name, selected.odds));
    return;
  }

  // Place the bet (user types amount)
  if (session.state === "bet_place") {
    const amount = parseInt(action.trim());
    if (isNaN(amount) || amount <= 0) {
      await whatsapp.sendText(phone, "Digite um valor valido (numero positivo). Ex: 50");
      return;
    }

    if (amount > 10000) {
      await whatsapp.sendText(phone, "Valor maximo por aposta: 10.000 GCoins. Digite outro valor:");
      return;
    }

    // Check balance
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { gcoinsGamification: true },
    });

    const balance = Number(user?.gcoinsGamification ?? 0);
    if (balance < amount) {
      await whatsapp.sendButtons(
        phone,
        `Saldo insuficiente! Voce tem ${balance.toFixed(2)} GCoins.`,
        [
          { id: "gcoins_buy", title: "Comprar GCoins" },
          { id: "bets_open", title: "Outras apostas" },
        ]
      );
      return;
    }

    const data = session.stateData;
    const odds = data.selectedOdds as number;
    const potentialWin = amount * odds;

    // Deduct GCoins
    await db
      .update(users)
      .set({ gcoinsGamification: sql`${users.gcoinsGamification} - ${amount}` })
      .where(eq(users.id, userId));

    // Create bet
    if (data.type === "challenge") {
      // Challenge bet
      await db.insert(bets).values({
        userId,
        challengeId: data.challengeId as string,
        betType: "winner",
        prediction: { winnerId: data.selectedId },
        amount: amount.toString(),
        odds: odds.toString(),
        potentialWin: potentialWin.toString(),
      });
    } else {
      // Tournament match bet
      await db.insert(bets).values({
        userId,
        matchId: data.matchId as string,
        tournamentId: data.tournamentId as string,
        betType: "winner",
        prediction: { winnerId: data.selectedId },
        amount: amount.toString(),
        odds: odds.toString(),
        potentialWin: potentialWin.toString(),
      });
    }

    // Record transaction
    await db.insert(gcoinTransactions).values({
      userId,
      type: "gamification",
      category: "bet_place",
      amount: (-amount).toString(),
      description: `Aposta: ${data.selectedName}`,
    });

    sessionManager.resetToMenu(phone);

    await whatsapp.sendButtons(
      phone,
      `Aposta confirmada!\n\n` +
        `Aposta em: *${data.selectedName}*\n` +
        `Valor: ${amount} GCoins\n` +
        `Odds: ${odds.toFixed(2)}x\n` +
        `Retorno potencial: ${potentialWin.toFixed(2)} GCoins\n\n` +
        `Boa sorte!`,
      [
        { id: "bets_mine", title: "Minhas apostas" },
        { id: "menu_main", title: "Menu principal" },
      ]
    );
    return;
  }

  // My bets
  if (action === "bets_mine") {
    const myBets = await db.query.bets.findMany({
      where: eq(bets.userId, userId),
      orderBy: [desc(bets.createdAt)],
      limit: 10,
    });

    if (myBets.length === 0) {
      await whatsapp.sendButtons(phone, "Voce ainda nao fez nenhuma aposta.", [
        { id: "bets_open", title: "Apostar agora" },
        { id: "menu_main", title: "Menu principal" },
      ]);
      return;
    }

    const statusMap: Record<string, string> = {
      pending: "Aguardando",
      won: "GANHOU!",
      lost: "Perdeu",
      cancelled: "Cancelada",
      refunded: "Reembolsada",
    };

    let text = "*MINHAS APOSTAS*\n\n";
    for (const b of myBets) {
      const prediction = b.prediction as Record<string, unknown>;
      text += `${statusMap[b.result ?? "pending"] ?? b.result}\n`;
      text += `Valor: ${Number(b.amount).toFixed(0)} GCoins | Odds: ${Number(b.odds).toFixed(2)}x\n`;
      text += `Retorno: ${Number(b.potentialWin).toFixed(0)} GCoins\n\n`;
    }

    await whatsapp.sendButtons(phone, text, [
      { id: "bets_open", title: "Nova aposta" },
      { id: "menu_main", title: "Menu principal" },
    ]);
    return;
  }

  // Betting leaderboard
  if (action === "bets_leaderboard") {
    const topBettors = await db
      .select({
        name: users.name,
        totalWon: sql<number>`COALESCE(SUM(CASE WHEN ${bets.result} = 'won' THEN CAST(${bets.potentialWin} AS DECIMAL) ELSE 0 END), 0)`,
        totalBets: sql<number>`COUNT(*)`,
        winRate: sql<number>`ROUND(100.0 * SUM(CASE WHEN ${bets.result} = 'won' THEN 1 ELSE 0 END) / GREATEST(COUNT(*), 1), 1)`,
      })
      .from(bets)
      .innerJoin(users, eq(bets.userId, users.id))
      .groupBy(users.id, users.name)
      .orderBy(sql`SUM(CASE WHEN ${bets.result} = 'won' THEN CAST(${bets.potentialWin} AS DECIMAL) ELSE 0 END) DESC`)
      .limit(10);

    let text = "*RANKING DE APOSTADORES*\n\n";
    topBettors.forEach((b, i) => {
      const medal = i === 0 ? "[1o]" : i === 1 ? "[2o]" : i === 2 ? "[3o]" : `${i + 1}.`;
      text += `${medal} ${b.name}\n`;
      text += `   Ganhos: ${Number(b.totalWon).toFixed(0)} GC | ${b.totalBets} apostas | ${b.winRate}% taxa\n\n`;
    });

    await whatsapp.sendButtons(phone, text, [
      { id: "bets_open", title: "Apostar agora" },
      { id: "menu_main", title: "Menu principal" },
    ]);
    return;
  }

  // Default
  await whatsapp.sendMessage(phone, menus.bettingMenu());
}
