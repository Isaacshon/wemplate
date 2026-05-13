import { NextResponse } from "next/server";
import Stripe from "stripe";
import { deliverTemplatePurchase } from "@/lib/delivery";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 503 },
    );
  }

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Invalid Stripe webhook signature.",
      },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const templateId = session.metadata?.itemId;
    const buyerEmail = session.customer_details?.email ?? session.customer_email;

    if (templateId && buyerEmail) {
      await deliverTemplatePurchase({
        stripeSessionId: session.id,
        templateId,
        buyerEmail,
      });
    }
  }

  return NextResponse.json({ received: true });
}
