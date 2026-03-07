import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Implement bet settlement logic
  // 1. Get completed matches that have unsettled bets
  // 2. For each match, get the final result
  // 3. Settle all bets for that match
  // 4. Credit/debit GCoins accordingly

  return NextResponse.json({
    settled: 0,
    message: "Bet settlement cron - ready for implementation",
    timestamp: new Date().toISOString()
  });
}
