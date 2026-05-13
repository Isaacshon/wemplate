import { NextResponse } from "next/server";
import type { Currency } from "@/data/templates";
import { getCheckoutItemById } from "@/lib/catalog";
import { getStripe } from "@/lib/stripe";

type CheckoutPayload = {
  itemId?: string;
  currency?: Currency;
};

export async function POST(request: Request) {
  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to enable checkout." },
      { status: 503 },
    );
  }

  const payload = (await request.json()) as CheckoutPayload;
  const item = payload.itemId ? await getCheckoutItemById(payload.itemId) : null;
  const currency: Currency = payload.currency === "cad" ? "cad" : "usd";

  if (!item) {
    return NextResponse.json({ error: "Unknown product." }, { status: 400 });
  }

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";
  const amount = currency === "cad" ? item.priceCad : item.priceUsd;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_creation: "if_required",
    billing_address_collection: "auto",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency,
          unit_amount: amount * 100,
          product_data: {
            name: item.name,
            description: item.description,
            metadata: {
              itemId: item.id,
              tier: item.tier,
              stack: item.stack,
            },
          },
        },
      },
    ],
    metadata: {
      itemId: item.id,
      tier: item.tier,
      stack: item.stack,
      zipPath: item.zipPath ?? "",
      delivery: "Email ZIP or access link after purchase",
    },
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
