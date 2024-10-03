// src/app/cart/page.tsx or src/pages/cart.tsx
import CartEntry from "./CartEntry";
import { getCart } from "@/lib/db/cart";
import { formatPrice } from "@/lib/format";
import CheckoutButton from "@/components/CheckoutButton";
import { setProductQuantity } from "./actions";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth"; // Import the getServerSession function
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata = {
  title: "Your Cart - The Mighty Oak Store",
};

export default async function CartPage() {
  const cart = await getCart();

  return (
    <div>
      {cart?.items.map((cartItem) => (
        <CartEntry
          cartItem={cartItem}
          key={cartItem.id}
          setProductQuantity={setProductQuantity}
        />
      ))}
      {!cart?.items.length && <p>Your cart is empty.</p>}
      <div className="flex flex-col items-end sm:items-center">
        <p className="mb-3 font-bold">
          Subtotal: {formatPrice(cart?.subtotal || 0)}
        </p>
        {/* Pass items to CheckoutButton */}
        <Link href={`cart/${cart?.id}/purchase`}>
          {/* <button>Checkout</button> */}
          <Button>Checkout</Button>
          {/* <CheckoutButton items={cart?.items} /> */}
        </Link>
      </div>
    </div>
  );
}
