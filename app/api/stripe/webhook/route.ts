import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const PRICE_TO_TIER: Record<string, string> = {
  [process.env.STRIPE_PRICE_PRO_MONTHLY ?? ""]: "professional",
  [process.env.STRIPE_PRICE_PRO_ANNUAL ?? ""]: "professional",
  [process.env.STRIPE_PRICE_ELITE_MONTHLY ?? ""]: "elite",
  [process.env.STRIPE_PRICE_ELITE_ANNUAL ?? ""]: "elite",
  [process.env.STRIPE_PRICE_STUDIO_MONTHLY ?? ""]: "studio",
  [process.env.STRIPE_PRICE_STUDIO_ANNUAL ?? ""]: "studio",
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = (await headers()).get("stripe-signature");

  if (!sig)
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createClient();

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.created"
  ) {
    const sub = event.data.object as Stripe.Subscription;
    const firstItem = sub.items.data[0] as Stripe.SubscriptionItem | undefined;
    const priceId = firstItem?.price?.id;
    const tier = (priceId && PRICE_TO_TIER[priceId]) ?? "free";
    const customerId = sub.customer as string;
    const periodEnd = firstItem
      ? new Date(firstItem.current_period_end * 1000).toISOString()
      : null;

    await supabase
      .from("profiles")
      .update({
        subscription_tier: tier,
        subscription_status: sub.status,
        subscription_period_end: periodEnd,
      })
      .eq("stripe_customer_id", customerId);
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    await supabase
      .from("profiles")
      .update({
        subscription_tier: "free",
        subscription_status: "canceled",
      })
      .eq("stripe_customer_id", sub.customer as string);
  }

  return NextResponse.json({ received: true });
}
