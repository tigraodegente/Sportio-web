import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/server/lib/stripe";
import { db } from "@/server/db";
import { users, gcoinTransactions, paymentOrders } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const gcoinAmount = Number(session.metadata?.gcoinAmount ?? 0);
    const packageId = session.metadata?.packageId;

    if (!userId || !gcoinAmount) {
      console.error("Missing metadata in checkout session:", session.id);
      return NextResponse.json({ received: true });
    }

    // Credit GCoins to user
    await db
      .update(users)
      .set({ gcoinsReal: sql`${users.gcoinsReal} + ${gcoinAmount}` })
      .where(eq(users.id, userId));

    // Record payment order
    await db.insert(paymentOrders).values({
      id: crypto.randomUUID(),
      userId,
      gcoinAmount: gcoinAmount.toString(),
      brlAmount: ((session.amount_total ?? 0) / 100).toFixed(2),
      method: "credit_card",
      status: "completed",
      gatewayId: session.id,
      gatewayData: { stripeSessionId: session.id, packageId },
      paidAt: new Date(),
      expiresAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Log transaction
    await db.insert(gcoinTransactions).values({
      id: crypto.randomUUID(),
      userId,
      type: "real",
      category: "purchase",
      amount: gcoinAmount.toString(),
      balanceAfter: null,
      description: `Compra de ${gcoinAmount} GCoins via Stripe`,
      referenceId: session.id,
      referenceType: "stripe_checkout",
      createdAt: new Date(),
    });

    console.log(`Credited ${gcoinAmount} GCoins to user ${userId}`);
  }

  // Handle PIX payment confirmation (payment_intent.succeeded)
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const userId = paymentIntent.metadata?.userId;
    const gcoinAmount = Number(paymentIntent.metadata?.gcoinAmount ?? 0);
    const packageId = paymentIntent.metadata?.packageId;

    // Only process PIX payments (avoid double-processing checkout sessions)
    const isPix = paymentIntent.payment_method_types?.includes("pix");
    if (!isPix || !userId || !gcoinAmount) {
      return NextResponse.json({ received: true });
    }

    // Credit GCoins to user
    await db
      .update(users)
      .set({ gcoinsReal: sql`${users.gcoinsReal} + ${gcoinAmount}` })
      .where(eq(users.id, userId));

    // Record payment order
    await db.insert(paymentOrders).values({
      id: crypto.randomUUID(),
      userId,
      gcoinAmount: gcoinAmount.toString(),
      brlAmount: ((paymentIntent.amount ?? 0) / 100).toFixed(2),
      method: "pix",
      status: "completed",
      gatewayId: paymentIntent.id,
      gatewayData: { stripePaymentIntentId: paymentIntent.id, packageId },
      paidAt: new Date(),
      expiresAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Log transaction
    await db.insert(gcoinTransactions).values({
      id: crypto.randomUUID(),
      userId,
      type: "real",
      category: "purchase",
      amount: gcoinAmount.toString(),
      balanceAfter: null,
      description: `Compra de ${gcoinAmount} GCoins via PIX (Stripe)`,
      referenceId: paymentIntent.id,
      referenceType: "stripe_pix",
      createdAt: new Date(),
    });

    console.log(`PIX: Credited ${gcoinAmount} GCoins to user ${userId}`);
  }

  return NextResponse.json({ received: true });
}
