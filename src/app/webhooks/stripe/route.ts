import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { formatPrice } from "@/lib/format";


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

    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("Order created:", order);

    // Clear the cart after the order is processed
    await prisma.cart.delete({ where: { userId: user.id } });

    const logo = "https://themightyoakstore.com/images/logo.png";

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1 style="font-weight: bold;">Thank you for shopping with us!</h1>
      <img src="${logo}" alt="Logo" style="width: 150px; height: auto; margin-bottom: 20px;" />
      
      <h2>Your Order Summary</h2>
      <p>Thank you for your purchase! We're excited to fulfill your order. Here are the details of your order:</p>
      
      <h3>Shipping Information:</h3>
      <p>
        <strong>Name:</strong> ${paymentIntent.shipping?.name}<br/>
        <strong>Address:</strong> ${address?.line1}, ${address?.city}, ${address?.state}, ${address?.postal_code}, ${address?.country}
      </p>
  
      <h3>Order Details:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border-bottom: 1px solid #ccc; padding: 10px; text-align: left;">Product</th>
            <th style="border-bottom: 1px solid #ccc; padding: 10px; text-align: center;">Quantity</th>
            <th style="border-bottom: 1px solid #ccc; padding: 10px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
            <tr>
              <td style="border-bottom: 1px solid #eee; padding: 10px;">
                <strong>${item.name}</strong><br/>

              </td>
              <td style="border-bottom: 1px solid #eee; padding: 10px; text-align: center;">${item.quantity}</td>
              <td style="border-bottom: 1px solid #eee; padding: 10px; text-align: right;">${formatPrice(item.price)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total Amount:</td>
            <td style="padding: 10px; text-align: right; font-weight: bold;">${formatPrice(order.totalAmount)}</td>
          </tr>
        </tfoot>
      </table>
  
      <p>We can't wait to see you again! If you have any questions about your order, feel free to reach out to us at THEMOS@themightyoakstore.com.</p>
  
      <p style="color: #555;">Thank you for choosing The Mighty Oak Tree!</p>
    </div>
  `;
  
  await resend.emails.send({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: [email],
    subject: "The Mighty Oak Tree Order Confirmation",
    html: htmlContent,
  });
  
  

    console.log("Order processed successfully for:", email);
    return new NextResponse("Order created", { status: 200 });
  }

  return new NextResponse();
}
