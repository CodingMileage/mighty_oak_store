import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: NextRequest) {
  let event;
  // let email;
  // let userId;

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

  // if(event.type === "checkout.session.completed") {
  //   const session = event.data.object;
  //   email = session.metadata?.email;
  //   userId = session.metadata?.userId;
  // }

  // Handle successful payment events
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const address = paymentIntent.shipping?.address
    const email = paymentIntent.metadata?.email;
    const userId = paymentIntent.metadata?.userId;

    if (!email || !userId) {
      console.error("Missing email or userId in payment metadata");
      return new NextResponse("Bad Request", { status: 400 });
    }

    const userFields = {
      address: address
        ? `${address.line1}, ${address.city}, ${address.state}, ${address.postal_code}, ${address.country}`
        : "",
    };

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
            variant: true
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
        address: userFields.address,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.variant ? item.variant?.price : item.product.price, // Assume each item has a variant
            name: item.product.name,
            imageUrl: item.product.imageUrl[0], // Store product image
            variantId: item.variant?.id, // Link the item to the variantId
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

    
    const htmlContent = `
    <h1 style="font-weight: bold;">Thank you for shopping with us!</h1>
    <img src=${"/images/logo.png"} alt="Logo" />
    <div>
      <h1>Here are your order details:</h1>
      <h2>Shipping information</h2>
      <p>
        ${address?.line1}, ${address?.city}, ${address?.state}
      </p>
    </div>
    <p>We can't wait to see you again!</p>
  `;
  
  await resend.emails.send({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: [email],
    subject: "The Mighty Oak Tree Order Confirmation",
    html: htmlContent,
  });
  

    console.log("Order processed successfully for:", email);
    await new Promise((resolve) => setTimeout(resolve, 200));
    return new NextResponse("Order created", { status: 200 });
  }

  return new NextResponse();
}
