// Leaderboard handler
import type { IncomingMessage } from "../types";
import { sessionManager } from "../services/session-manager";
import { whatsapp } from "../services/whatsapp-client";
import { menus } from "../services/menu-builder";
import { db } from "@/server/db";
import { users, bets } from "@/server/db/schema";
import { desc, sql, eq } from "drizzle-orm";

export async function handleLeaderboard(
  phone: string,
  _message: IncomingMessage,
  action: string
): Promise<void> {
  // XP Leaderboard
  if (action === "leaderboard_xp") {
    const topUsers = await db
      .select({ name: users.name, xp: users.xp, level: users.level, city: users.city })
      .from(users)
      .orderBy(desc(users.xp))
      .limit(10);

    let text = "*RANKING XP*\n\n";
    topUsers.forEach((u: { name: string; xp: number | null; level: number | null; city: string | null }, i: number) => {
      const medal = i === 0 ? "[1o]" : i === 1 ? "[2o]" : i === 2 ? "[3o]" : `${i + 1}.`;
      text += `${medal} *${u.name}*\n`;
      text += `   Nivel ${u.level ?? 1} | ${u.xp ?? 0} XP${u.city ? ` | ${u.city}` : ""}\n\n`;
    });

    await whatsapp.sendButtons(phone, text, [
      { id: "leaderboard_bets", title: "Ranking apostas" },
      { id: "menu_main", title: "Menu principal" },
    ]);
    return;
  }

  // Betting leaderboard
  if (action === "leaderboard_bets") {
    const topBettors = await db
      .select({
        name: users.name,
        wins: sql<number>`SUM(CASE WHEN ${bets.result} = 'won' THEN 1 ELSE 0 END)`,
        total: sql<number>`COUNT(*)`,
        earned: sql<number>`COALESCE(SUM(CASE WHEN ${bets.result} = 'won' THEN CAST(${bets.potentialWin} AS DECIMAL) ELSE 0 END), 0)`,
      })
      .from(bets)
      .innerJoin(users, eq(bets.userId, users.id))
      .groupBy(users.id, users.name)
      .orderBy(sql`SUM(CASE WHEN ${bets.result} = 'won' THEN CAST(${bets.potentialWin} AS DECIMAL) ELSE 0 END) DESC`)
      .limit(10);

    let text = "*RANKING APOSTADORES*\n\n";
    if (topBettors.length === 0) {
      text += "Nenhuma aposta realizada ainda.";
    } else {
      topBettors.forEach((b, i) => {
        const medal = i === 0 ? "[1o]" : i === 1 ? "[2o]" : i === 2 ? "[3o]" : `${i + 1}.`;
        text += `${medal} *${b.name}*\n`;
        text += `   ${Number(b.earned).toFixed(0)} GC ganhos | ${b.wins}/${b.total} vitorias\n\n`;
      });
    }

    await whatsapp.sendButtons(phone, text, [
      { id: "leaderboard_xp", title: "Ranking XP" },
      { id: "menu_main", title: "Menu principal" },
    ]);
    return;
  }

  // GCoins leaderboard
  if (action === "leaderboard_gcoins") {
    const topGcoins = await db
      .select({
        name: users.name,
        total: sql<number>`CAST(${users.gcoinsReal} AS DECIMAL) + CAST(${users.gcoinsGamification} AS DECIMAL)`,
      })
      .from(users)
      .orderBy(sql`CAST(${users.gcoinsReal} AS DECIMAL) + CAST(${users.gcoinsGamification} AS DECIMAL) DESC`)
      .limit(10);

    let text = "*RANKING GCOINS*\n\n";
    topGcoins.forEach((u, i) => {
      const medal = i === 0 ? "[1o]" : i === 1 ? "[2o]" : i === 2 ? "[3o]" : `${i + 1}.`;
      text += `${medal} *${u.name}* - ${Number(u.total).toFixed(0)} GCoins\n\n`;
    });

    await whatsapp.sendButtons(phone, text, [
      { id: "leaderboard_xp", title: "Ranking XP" },
      { id: "menu_main", title: "Menu principal" },
    ]);
    return;
  }

  // Default
  await whatsapp.sendMessage(phone, menus.leaderboardMenu());
}
