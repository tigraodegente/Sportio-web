import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { stripe, GCOIN_PACKAGES } from "@/server/lib/stripe";

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

  // Create PaymentIntent for PIX
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(pkg.priceBrl * 100),
    currency: "brl",
    payment_method_types: ["pix"],
    metadata: {
      userId: session.user.id,
      packageId: pkg.id,
      gcoinAmount: pkg.gcoins.toString(),
    },
  });

  // Confirm to generate PIX QR code
  const confirmed = await stripe.paymentIntents.confirm(paymentIntent.id, {
    payment_method_data: { type: "pix" },
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/gcoins`,
  });

  const pixAction = confirmed.next_action?.pix_display_qr_code;

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    pixQrCode: pixAction?.data ?? null,
    pixQrCodeUrl: pixAction?.image_url_png ?? null,
    expiresAt: pixAction?.expires_at ?? null,
  });
}
