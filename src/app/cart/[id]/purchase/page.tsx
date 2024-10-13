import Stripe from "stripe";
import { getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { CheckoutForm } from "./_components/CheckoutForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const cart = await getCart();

  console.log(cart?.items.map((item) => item));

  // Ensure cart is valid and has a subtotal
  if (!cart || cart.subtotal <= 0) {
    throw new Error("Cart is empty or invalid.");
  }

  const session = await getServerSession(authOptions); // Retrieve user session

  // Create the payment intent with the necessary user information
  const paymentIntent = await stripe.paymentIntents.create({
    amount: cart.subtotal, // Amount in cents
    currency: "USD",
    metadata: {
      userId: session?.user?.id ?? "unknown", // Attach user ID or default
      email: session?.user?.email ?? "unknown", // Attach user email or default
    },
  });

  if (paymentIntent.client_secret == null) {
    throw new Error("Stripe PaymentIntent creation failed.");
  }

  return (
    <CheckoutForm cart={cart} clientSecret={paymentIntent.client_secret} />
  );
}
