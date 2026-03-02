import { eq, and } from "drizzle-orm";
import { bets } from "@/server/db/schema";
import type { DB } from "@/server/db";

interface OddsResult {
  odds: number;
  totalPool: number;
  sideBets: number;
}

/**
 * Calcula odds dinâmicas para uma partida baseado nas apostas existentes.
 * Usa um modelo parimutuel simplificado:
 * - Total pool = soma de todas as apostas nesta partida para este tipo
 * - Side bets = soma de apostas na mesma predição
 * - Odds = totalPool / sideBets (com margem)
 * - Odds mínima: 1.1 | Máxima: 20.0
 */
export async function calculateOdds(
  dbInstance: DB,
  matchId: string,
  betType: "winner" | "score" | "mvp" | "custom",
  prediction: Record<string, unknown>
): Promise<OddsResult> {
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

  return computeOddsFromBets(allBets, betType, prediction);
}

/**
 * Calcula odds dinâmicas para um desafio 1v1 baseado nas apostas existentes.
 */
export async function calculateChallengeOdds(
  dbInstance: DB,
  challengeId: string,
  prediction: Record<string, unknown>
): Promise<OddsResult> {
  const allBets = await dbInstance
    .select({
      amount: bets.amount,
      prediction: bets.prediction,
    })
    .from(bets)
    .where(
      and(
        eq(bets.challengeId, challengeId),
        eq(bets.betType, "winner"),
        eq(bets.result, "pending")
      )
    );

  return computeOddsFromBets(allBets, "winner", prediction);
}

function computeOddsFromBets(
  allBets: Array<{ amount: string; prediction: unknown }>,
  betType: string,
  prediction: Record<string, unknown>
): OddsResult {
  if (allBets.length === 0) {
    const defaultOdds: Record<string, number> = {
      winner: 2.0,
      score: 8.0,
      mvp: 5.0,
      custom: 3.0,
    };
    return {
      odds: defaultOdds[betType] ?? 2.0,
      totalPool: 0,
      sideBets: 0,
    };
  }

  const totalPool = allBets.reduce((sum, b) => sum + Number(b.amount), 0);

  const predictionKey = JSON.stringify(prediction);
  const samePredictionBets = allBets.filter(
    (b) => JSON.stringify(b.prediction) === predictionKey
  );
  const sideBets = samePredictionBets.reduce((sum, b) => sum + Number(b.amount), 0);

  if (sideBets === 0) {
    const highOdds = Math.min(totalPool * 2, 20.0);
    return { odds: Math.max(highOdds, 2.5), totalPool, sideBets: 0 };
  }

  // Parimutuel com 10% de margem da casa
  const margin = 0.90;
  let odds = (totalPool * margin) / sideBets;

  odds = Math.max(1.1, Math.min(20.0, odds));
  odds = Math.round(odds * 100) / 100;

  return { odds, totalPool, sideBets };
}
