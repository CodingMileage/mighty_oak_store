import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  let event;

  try {
    // Verify the webhook event using Stripe's secret
    event = await stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("Error verifying webhook signature:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  // Handle successful payment events
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const email = paymentIntent.metadata?.email;
    const userId = paymentIntent.metadata?.userId;

    if (!email || !userId) {
      console.error("Missing email or userId in payment metadata");
      return new NextResponse("Bad Request", { status: 400 });
    }

    // Fetch the user by userId
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      console.error("User not found:", userId);
      return new NextResponse("User not found", { status: 400 });
    }

    // Fetch the user's cart including product variants
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: { include: { variants: true } },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      console.error("No cart or cart items found for user:", user.id);
      return new NextResponse("No items in cart", { status: 400 });
    }

    // Create the order and link items to the appropriate variants
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: paymentIntent.amount,
        status: "completed",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.variants[0].price, // Assume each item has a variant
            name: item.product.name,
            imageUrl: item.product.imageUrl[0], // Store product image
            variantId: item.product.variants[0].id, // Link the item to the variantId
          })),
        },
      },
      include: {
        items: true,
      },
    });

    console.log("Order created:", order);

    // Clear the cart after the order is processed
    await prisma.cart.delete({ where: { userId: user.id } });

    console.log("Order processed successfully for:", email);
    return new NextResponse("Order created", { status: 200 });
  }

  return new NextResponse();
}
