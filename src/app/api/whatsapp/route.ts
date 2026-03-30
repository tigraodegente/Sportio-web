// WhatsApp Webhook API Route
// Receives messages from Evolution API or WhatsApp Cloud API
import { NextRequest, NextResponse } from "next/server";
import { handleWebhook, verifyCloudAPIWebhook } from "@/whatsapp/webhook";

// POST - Receive incoming messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Process webhook asynchronously (don't block the response)
    handleWebhook(body).catch((error) => {
      console.error("[WhatsApp API] Webhook processing error:", error);
    });

    // Return 200 immediately (WhatsApp expects fast response)
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[WhatsApp API] Error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// GET - WhatsApp Cloud API webhook verification
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const challenge = verifyCloudAPIWebhook({
    "hub.mode": searchParams.get("hub.mode") ?? undefined,
    "hub.verify_token": searchParams.get("hub.verify_token") ?? undefined,
    "hub.challenge": searchParams.get("hub.challenge") ?? undefined,
  });

  if (challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}
