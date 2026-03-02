import { db } from "@/server/db";
import { bets, users, gcoinTransactions } from "@/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { notifyBetResult } from "./notification-service";

/**
 * Liquida todas as apostas pendentes de um desafio 1v1 concluído.
 * Chamado quando submitResult é executado com o winnerId.
 */
export async function settleChallengeBets(challengeId: string, winnerId: string): Promise<void> {
  const pendingBets = await db.query.bets.findMany({
    where: and(eq(bets.challengeId, challengeId), eq(bets.result, "pending")),
  });

  if (pendingBets.length === 0) return;

  for (const bet of pendingBets) {
    const prediction = bet.prediction as Record<string, unknown>;
    const isWinner = prediction.winnerId === winnerId;
    const result = isWinner ? "won" : "lost";

    // Atualizar resultado da aposta
    await db
      .update(bets)
      .set({ result, settledAt: new Date() })
      .where(eq(bets.id, bet.id));

    if (isWinner && bet.potentialWin) {
      const winAmount = Number(bet.potentialWin);

      // Creditar ganhos ao vencedor
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
        description: `Palpite ganho no desafio! +${winAmount} GCoins`,
        referenceId: bet.id,
        referenceType: "bet",
      });

      notifyBetResult(bet.userId, true, winAmount, bet.id).catch(() => {});
    } else {
      notifyBetResult(bet.userId, false, Number(bet.amount), bet.id).catch(() => {});
    }
  }
}

/**
 * Cancela e reembolsa todas as apostas pendentes de um desafio cancelado.
 */
export async function cancelChallengeBets(challengeId: string): Promise<void> {
  const pendingBets = await db.query.bets.findMany({
    where: and(eq(bets.challengeId, challengeId), eq(bets.result, "pending")),
  });

  for (const bet of pendingBets) {
    const refundAmount = Number(bet.amount);

    await db
      .update(bets)
      .set({ result: "refunded", settledAt: new Date() })
      .where(eq(bets.id, bet.id));

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
      description: `Palpite reembolsado (desafio cancelado)`,
      referenceId: bet.id,
      referenceType: "bet",
    });
  }
}
