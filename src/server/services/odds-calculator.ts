import { eq, and } from "drizzle-orm";
import { bets } from "@/server/db/schema";
import type { DB } from "@/server/db";

interface OddsResult {
  odds: number;
  totalPool: number;
  sideBets: number;
}

/**
 * Calculate dynamic odds for a match based on existing bets.
 * Uses a simplified parimutuel model:
 * - Total pool = sum of all bets on this match for this bet type
 * - Side bets = sum of bets on the same prediction
 * - Odds = totalPool / sideBets (with margins)
 * - Minimum odds: 1.1
 * - Maximum odds: 20.0
 * - Default odds when no bets exist: based on bet type
 */
export async function calculateOdds(
  dbInstance: DB,
  matchId: string,
  betType: "winner" | "score" | "mvp" | "custom",
  prediction: Record<string, unknown>
): Promise<OddsResult> {
  // Get all pending bets for this match and bet type
  const allBets = await dbInstance
    .select({
      amount: bets.amount,
      prediction: bets.prediction,
    })
    .from(bets)
    .where(
      and(
        eq(bets.matchId, matchId),
        eq(bets.betType, betType),
        eq(bets.result, "pending")
      )
    );

  if (allBets.length === 0) {
    // Default odds when no bets exist
    const defaultOdds: Record<string, number> = {
      winner: 2.0,
      score: 8.0,
      mvp: 5.0,
      custom: 3.0,
    };
    return {
      odds: defaultOdds[betType] ?? 3.0,
      totalPool: 0,
      sideBets: 0,
    };
  }

  const totalPool = allBets.reduce((sum, b) => sum + Number(b.amount), 0);

  // Count bets on the same prediction
  const predictionKey = JSON.stringify(prediction);
  const samePredictionBets = allBets.filter(
    (b) => JSON.stringify(b.prediction) === predictionKey
  );
  const sideBets = samePredictionBets.reduce((sum, b) => sum + Number(b.amount), 0);

  if (sideBets === 0) {
    // No one has bet on this prediction yet - high odds
    const highOdds = Math.min(totalPool * 2, 20.0);
    return { odds: Math.max(highOdds, 2.5), totalPool, sideBets: 0 };
  }

  // Parimutuel with 10% house margin
  const margin = 0.90;
  let odds = (totalPool * margin) / sideBets;

  // Clamp odds
  odds = Math.max(1.1, Math.min(20.0, odds));
  // Round to 2 decimal places
  odds = Math.round(odds * 100) / 100;

  return { odds, totalPool, sideBets };
}
