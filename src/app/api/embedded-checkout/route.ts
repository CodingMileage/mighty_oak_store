import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Stripe from "stripe";
import { getCart } from "@/lib/db/cart";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(request: Request) {
  let event;

  // try {
  //   // Verify the webhook event using Stripe's secret
  //   event = await stripe.webhooks.constructEvent(
  //     await request.text(),
  //     request.headers.get("stripe-signature") as string,
  //     process.env.STRIPE_WEBHOOK_SECRET as string
  //   );
  // } catch (err) {
  //   console.error("Error verifying webhook signature:", err);
  //   return new NextResponse("Webhook Error", { status: 400 });
  // }

  try {
    const { cartId } = await request.json();

    // Retrieve the cart using Prisma, including variant and product info
    const cart = await getCart();

    // If the cart is not found or is empty, return a 404
    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json(
        { message: "Cart not found or is empty" },
        { status: 404 }
      );
    }

    // Retrieve the user session
    const session = await getServerSession(authOptions);

    // Prepare Stripe line items from the cart items
    const lineItems = cart.items.map((item) => {
      const selectedVariant = item.product.variants.find(
        (variant) => variant.id === item.variantId
      );

      return {
        price_data: {
          currency: "USD",
          product_data: {
            name: item.product.name + " " + selectedVariant?.size, // Get the product name
            // description: selectedVariant?.product.description ?? "", // Optional description
          },
          unit_amount: selectedVariant?.price, // Use the specific variant price in cents
        },
        quantity: item.quantity,
      };
    });

    // Create a Stripe Checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      payment_method_types: ["card"],
      automatic_tax: { enabled: true },
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US"], // Specify allowed countries for shipping
      },
      payment_intent_data: {
        metadata: {
          userId: session?.user?.id ?? "unknown",
          email: session?.user?.email ?? "unknown",
        },
      },
      return_url: `${request.headers.get("origin")}/stripe/purchase-success`,
    });

    return NextResponse.json({
      id: stripeSession.id,
      client_secret: stripeSession.client_secret,
    });
  } catch (error: any) {
    console.error("Stripe session error:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
