import { db } from "@/server/db";
import { bets, users, gcoinTransactions } from "@/server/db/schema";
import { eq, and, sql } from "drizzle-orm";

/**
 * Settle all pending bets for a completed match.
 * Called when a match status is set to "completed" with a winnerId.
 */
export async function settleBets(matchId: string, winnerId: string): Promise<void> {
  // Find all pending bets for this match
  const pendingBets = await db.query.bets.findMany({
    where: and(eq(bets.matchId, matchId), eq(bets.result, "pending")),
  });

  if (pendingBets.length === 0) return;

  for (const bet of pendingBets) {
    const prediction = bet.prediction as Record<string, unknown>;
    let isWinner = false;

    // Determine if bet is won based on type
    switch (bet.betType) {
      case "winner":
        isWinner = prediction.winnerId === winnerId;
        break;
      case "score":
        // Score bets would need exact score match - for now mark as lost if not exact
        isWinner = false;
        break;
      case "mvp":
        isWinner = prediction.mvpId === winnerId;
        break;
      case "custom":
        // Custom bets evaluated by prediction match
        isWinner = prediction.winnerId === winnerId;
        break;
    }

    const result = isWinner ? "won" : "lost";

    // Update bet result
    await db
      .update(bets)
      .set({ result, settledAt: new Date() })
      .where(eq(bets.id, bet.id));

    // If won, credit the user with their winnings
    if (isWinner && bet.potentialWin) {
      const winAmount = Number(bet.potentialWin);

      await db
        .update(users)
        .set({
          gcoinsGamification: sql`${users.gcoinsGamification} + ${winAmount}`,
        })
        .where(eq(users.id, bet.userId));

      await db.insert(gcoinTransactions).values({
        userId: bet.userId,
        type: "gamification",
        category: "bet_win",
        amount: winAmount.toString(),
        description: `Palpite ganho! Recebeu ${winAmount} GCoins`,
        referenceId: bet.id,
        referenceType: "bet",
      });
    }
  }
}

/**
 * Cancel all pending bets for a cancelled match (refund).
 */
export async function cancelMatchBets(matchId: string): Promise<void> {
  const pendingBets = await db.query.bets.findMany({
    where: and(eq(bets.matchId, matchId), eq(bets.result, "pending")),
  });

  for (const bet of pendingBets) {
    const refundAmount = Number(bet.amount);

    // Mark as refunded
    await db
      .update(bets)
      .set({ result: "refunded", settledAt: new Date() })
      .where(eq(bets.id, bet.id));

    // Refund the user
    await db
      .update(users)
      .set({
        gcoinsGamification: sql`${users.gcoinsGamification} + ${refundAmount}`,
      })
      .where(eq(users.id, bet.userId));

    await db.insert(gcoinTransactions).values({
      userId: bet.userId,
      type: "gamification",
      category: "bet_place",
      amount: refundAmount.toString(),
      description: `Palpite reembolsado (partida cancelada)`,
      referenceId: bet.id,
      referenceType: "bet",
    });
  }
}
