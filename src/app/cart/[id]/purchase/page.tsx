import Stripe from "stripe";
import { getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { CheckoutForm } from "./_components/CheckoutForm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage({
  params: { id },
}: {
  params: { id: string };
}) {
  //   const cart = await prisma.cart.findUnique({
  //     where: { id },
  //   });
  const cart = await getCart();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: cart?.subtotal,
    currency: "USD",
  });

  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed");
  }

  return (
    <CheckoutForm cart={cart} clientSecret={paymentIntent.client_secret} />
  );
}
