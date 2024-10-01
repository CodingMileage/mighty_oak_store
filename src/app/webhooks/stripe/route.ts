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

    // if (!email) {
    //   console.error("Missing email in charge metadata");
    //   return new NextResponse("Bad Request", { status: 400 });
    // }

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
    const cart2 = await prisma.cart.findMany({
      include: { items: { include: { product: true } } },
    });
  
    cart2.forEach((cart) => {
      console.log(`Cart ID: ${cart.id}`);
      cart.items.forEach((item) => {
        console.log(
          `Item ID: ${item.id}, Product Name: ${item.product.name}, Quantity: ${item.quantity}`
        );
        // Add more fields if necessary
      });
    });

    // if (!cart) {
    //   console.error("No cart or cart items found for user:", user.id);
    //   return new NextResponse("No items in cart", { status: 400 });
    // }

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: pricePaidInCents,
        status: "completed",
        items: {
          create: cart2.flatMap((cart) =>
            cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price, // Price at the time of purchase
              name: item.product.name, // Include product name
              imageUrl: item.product.imageUrl, // Include product image
            }))
          ),
        },
      },
      include: {
        items: true, // Optionally include the items in the response
      },
    });
    
    

    console.log(order);

    // Clear the cart after the order is processed
    // await prisma.cart.delete({ where: { id: cart.id } });

    // Optionally, send a purchase receipt email
    // await PurchaseReceiptEmail({ email, order });

    console.log("Order processed successfully for:", email);
    return new NextResponse("Order created", { status: 200 });
  }

  return new NextResponse();

}
