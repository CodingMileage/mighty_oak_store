import ProductCard from "@/components/ProductCard";
import { getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import CartEntry from "./CartEntry";
import { setProductQuantity } from "./actions";
import InlineDataScrollerDemo from "@/components/DataScroll";
import { formatPrice } from "@/lib/format";

export const metadata = {
  title: "Your Cart - The Mighty Oak Store",
};

export default async function CartPage() {
  const cart = await getCart();

  return (
    <div>
      {/* <InlineDataScrollerDemo /> */}
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
          Total: {formatPrice(cart?.subtotal || 0)}
        </p>
        <button className="btn btn-primary sm:w-[200px]">Checkout</button>
      </div>
    </div>
  );
}
