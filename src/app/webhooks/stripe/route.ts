import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

let email;
let userId;

export async function POST(req: NextRequest) {
  let event;

  try {
    event = await stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("Error verifying webhook signature:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    // Retrieve email and userId from the metadata that was passed during payment intent creation
    email = paymentIntent.metadata.email;
    userId = paymentIntent.metadata.userId;

    console.log("HIIIIII", userId);
    console.log("Pay", paymentIntent);

    if (!email || !userId) {
      console.error("Missing email or userId in payment metadata");
      return new NextResponse("Bad Request", { status: 400 });
    }

    // Fetch the user by email or userId
    let user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return new NextResponse("User not found", { status: 400 });
    }

    // Fetch the user's cart using the userId
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id }, // Search by userId
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      console.error("No cart or cart items found for user:", user.id);
      return new NextResponse("No items in cart", { status: 400 });
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: paymentIntent.amount,
        status: "completed",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price, // Price at the time of purchase
            name: item.product.name, // Include product name
            imageUrl: item.product.imageUrl, // Include product image
          })),
        },
      },
      include: {
        items: true,
      },
    });

    console.log("Order created:", order);

    // // Clear the cart after the order is processed
    await prisma.cart.delete({ where: { userId: user.id } });

    console.log("Order processed successfully for:", email);
    return new NextResponse("Order created", { status: 200 });
  }

  return new NextResponse();
}
