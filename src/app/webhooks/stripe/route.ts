import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getCart } from "@/lib/db/cart"; // Assumed function for getting the user's cart
// import PurchaseReceiptEmail from "@/email/PurchaseReceipt"; // For sending an email receipt

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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

  if (event.type === "charge.succeeded") {
    const charge = event.data.object as Stripe.Charge;
    const email = charge.billing_details.email;
    const pricePaidInCents = charge.amount;
    const address = charge.billing_details.address;
    const phone = charge.billing_details.phone;

    if (!email) {
      console.error("Missing email in charge metadata");
      return new NextResponse("Bad Request", { status: 400 });
    }

    // Fetch or create the user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          // You can add other user fields here if necessary
          name: charge.billing_details.name,
          image: null,
        },
      });
    }

    // Get the user's cart and its items (assumed function)
    const cart = await prisma.cart.findMany();
    console.log(cart);
    // if (!cart) {
    //   console.error("No cart or cart items found for user:", user.id);
    //   return new NextResponse("No items in cart", { status: 400 });
    // }

    // Create the order
    // const order = await prisma.order.create({
    //   data: {
    //     userId: user.id,
    //     totalAmount: pricePaidInCents,
    //     status: "completed",
    //     items: {
    //       create: cart?.items.map((cartItem: any) => ({
    //         productId: cartItem.productId,
    //         quantity: cartItem.quantity,
    //         price: cartItem.product.price, // Price at the time of purchase
    //       })),
    //     },
    //   },
    //   include: {
    //     items: true, // Optionally include the items in the response
    //   },
    // });

    // console.log(order);

    // Clear the cart after the order is processed
    // await prisma.cart.delete({ where: { id: cart.id } });

    // Optionally, send a purchase receipt email
    // await PurchaseReceiptEmail({ email, order });

    console.log("Order processed successfully for:", email);
    return new NextResponse("Order created", { status: 200 });
  }

  return new NextResponse("Event not handled", { status: 400 });
}
