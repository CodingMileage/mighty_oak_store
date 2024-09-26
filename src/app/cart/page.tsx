import ProductCard from "@/components/ProductCard";
import { getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import CartEntry from "./CartEntry";
import { setProductQuantity } from "./actions";
import InlineDataScrollerDemo from "@/components/DataScroll";

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
    </div>
  );
}
