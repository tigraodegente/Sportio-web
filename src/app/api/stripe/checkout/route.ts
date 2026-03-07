import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { getStripe, GCOIN_PACKAGES } from "@/server/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { packageId } = await req.json();
  const pkg = GCOIN_PACKAGES.find((p) => p.id === packageId);
  if (!pkg) {
    return NextResponse.json({ error: "Pacote invalido" }, { status: 400 });
  }

  const checkoutSession = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "boleto"],
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: pkg.label,
            description: `${pkg.gcoins} GCoins para sua carteira Sportio`,
          },
          unit_amount: Math.round(pkg.priceBrl * 100), // centavos
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: session.user.id,
      packageId: pkg.id,
      gcoinAmount: pkg.gcoins.toString(),
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/gcoins?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/gcoins?cancelled=true`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
