import { getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: NextRequest) {
  let event;

  try {
    // Construct Stripe webhook event
    event = await stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("Error verifying webhook signature:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  // Check if the event is a charge succeeded event
  if (event.type === "charge.succeeded") {
    const charge = event.data.object as Stripe.Charge;
    const productId = charge.metadata.productId;
    const email = charge.billing_details.email;
    const priceInCents = charge.amount;

    // Check if productId and email are present
    if (!productId || !email) {
      console.error("Missing productId or email in charge metadata");
      return new NextResponse("Bad Request", { status: 400 });
    }

    // Fetch cart items (if necessary)
    const cart = await getCart(); // Remove if unnecessary

    // Find cart item based on productId
    const item = await prisma.cartItem.findUnique({
      where: { id: productId },
    });

    if (!item) {
      console.error("Invalid productId");
      return new NextResponse("Bad Request", { status: 400 });
    }

    // Prepare user fields for upsert
    const userFields = {
      email,
      orders: { create: { productId, priceInCents } },
    };

    console.log("User fields:", userFields);

    // Upsert user (create if not exists, otherwise update)
    await prisma.user.upsert({
      where: { email },
      create: userFields,
      update: userFields,
    });

    // Add any additional logic here, like sending a confirmation email

    return new NextResponse("Order processed", { status: 200 });
  }

  return new NextResponse("Event not handled", { status: 400 });
}
