// src/app/cart/page.tsx or src/pages/cart.tsx
import CartEntry from "./CartEntry";
import { getCart } from "@/lib/db/cart";
import { formatPrice } from "@/lib/format";
import { setProductQuantity } from "./actions";

import { getServerSession } from "next-auth"; // Import the getServerSession function
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EmbeddedCheckoutButton from "@/components/EmbeddedCheckout";

export const metadata = {
  title: "Your Cart - The Mighty Oak Store",
};

export default async function CartPage() {
  const cart = await getCart();
  const session = await getServerSession(authOptions);

  console.log(cart);

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
          Cart total: {formatPrice(cart?.subtotal || 0)}
        </p>
        {session ? ( // Check if the user is logged in
          // <Link href={`cart/${cart?.id}/purchase`}>
          //   <Button>Checkout</Button>
          // </Link>
          <EmbeddedCheckoutButton />
        ) : (
          <p>Please log in to proceed to checkout.</p> // Message for logged-out users
        )}
      </div>
    </div>
  );
}
