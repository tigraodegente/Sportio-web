import { db } from "@/server/db";
import { bets, users, gcoinTransactions } from "@/server/db/schema";
import { eq, and, sql } from "drizzle-orm";

/** Multiplier applied to the original bet amount for an exact score prediction. */
const EXACT_SCORE_MULTIPLIER = 3;
/** Multiplier applied to the original bet amount for a correct-winner-only prediction. */
const CORRECT_WINNER_MULTIPLIER = 1.5;

/**
 * Determine the winner from a pair of scores.
 * Returns "player1" | "player2" | "draw".
 */
function scoreWinner(s1: number, s2: number): "player1" | "player2" | "draw" {
  if (s1 > s2) return "player1";
  if (s2 > s1) return "player2";
  return "draw";
}

interface MatchScore {
  score1: number;
  score2: number;
}

/**
 * Settle all pending bets for a completed match.
 * Called when a match status is set to "completed" with a winnerId and final scores.
 */
export async function settleBets(
  matchId: string,
  winnerId: string,
  actualScore?: MatchScore,
): Promise<void> {
  // Find all pending bets for this match
  const pendingBets = await db.query.bets.findMany({
    where: and(eq(bets.matchId, matchId), eq(bets.result, "pending")),
  });

  if (pendingBets.length === 0) return;

  for (const bet of pendingBets) {
    const prediction = bet.prediction as Record<string, unknown>;
    let result: "won" | "lost" = "lost";
    let winAmount = 0;

    // Determine if bet is won based on type
    switch (bet.betType) {
      case "winner":
        if (prediction.winnerId === winnerId) {
          result = "won";
          winAmount = Number(bet.potentialWin ?? 0);
        }
        break;

      case "score": {
        // Score bets: compare predicted score against actual match score.
        // Prediction shape: { score1: number, score2: number }
        const predictedScore1 = Number(prediction.score1 ?? -1);
        const predictedScore2 = Number(prediction.score2 ?? -1);

        if (
          actualScore &&
          !isNaN(predictedScore1) &&
          !isNaN(predictedScore2) &&
          predictedScore1 >= 0 &&
          predictedScore2 >= 0
        ) {
          const exactMatch =
            predictedScore1 === actualScore.score1 &&
            predictedScore2 === actualScore.score2;

          const predictedWinner = scoreWinner(predictedScore1, predictedScore2);
          const actualWinner = scoreWinner(actualScore.score1, actualScore.score2);
          const correctWinner = predictedWinner === actualWinner;

          if (exactMatch) {
            // Exact score prediction: full win with higher multiplier
            result = "won";
            winAmount = Number(bet.amount) * EXACT_SCORE_MULTIPLIER;
          } else if (correctWinner && actualWinner !== "draw") {
            // Correct winner but wrong score: partial win
            result = "won";
            winAmount = Number(bet.amount) * CORRECT_WINNER_MULTIPLIER;
          }
          // Otherwise: wrong prediction, stays "lost"
        }
        break;
      }

      case "mvp":
        if (prediction.mvpId === winnerId) {
          result = "won";
          winAmount = Number(bet.potentialWin ?? 0);
        }
        break;

      case "custom":
        // Custom bets evaluated by prediction match
        if (prediction.winnerId === winnerId) {
          result = "won";
          winAmount = Number(bet.potentialWin ?? 0);
        }
        break;
    }

    // Update bet result
    await db
      .update(bets)
      .set({ result, settledAt: new Date() })
      .where(eq(bets.id, bet.id));

    // If won, credit the user with their winnings
    if (result === "won" && winAmount > 0) {
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
