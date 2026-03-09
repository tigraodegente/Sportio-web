import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { matches, bets } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { settleBets } from "@/server/services/bet-settlement";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find completed matches
    const completedMatches = await db.query.matches.findMany({
      where: eq(matches.status, "completed"),
      columns: { id: true, winnerId: true, score1: true, score2: true },
    });

    let settled = 0;
    for (const match of completedMatches) {
      if (!match.winnerId) continue;

      // Check if there are pending bets for this match
      const pendingBets = await db.query.bets.findMany({
        where: and(eq(bets.matchId, match.id), eq(bets.result, "pending")),
        columns: { id: true },
        limit: 1,
      });
      if (pendingBets.length === 0) continue;

      await settleBets(match.id, match.winnerId, {
        score1: match.score1 ?? 0,
        score2: match.score2 ?? 0,
      });
      settled++;
    }

    return NextResponse.json({
      settled,
      message: `Settled bets for ${settled} matches`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Bet settlement error:", error);
    return NextResponse.json(
      { error: "Settlement failed", message: String(error) },
      { status: 500 }
    );
  }
}
