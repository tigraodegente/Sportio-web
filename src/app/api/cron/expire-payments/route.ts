import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { paymentOrders } from "@/server/db/schema";
import { eq, and, lt } from "drizzle-orm";

export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Expire pending orders older than 30 min
  const expired = await db
    .update(paymentOrders)
    .set({ status: "expired", updatedAt: now })
    .where(
      and(
        eq(paymentOrders.status, "pending"),
        lt(paymentOrders.expiresAt, now)
      )
    )
    .returning({ id: paymentOrders.id });

  return NextResponse.json({
    expired: expired.length,
    timestamp: now.toISOString()
  });
}
