import { ShoppingCart } from "@/lib/db/cart";
import { formatPrice } from "@/lib/format";
import { MdOutlineShoppingCart } from "react-icons/md";

interface ShoppingCartButtonProps {
  cart: ShoppingCart | null;
}

export default function ShoppingCartButton({ cart }: ShoppingCartButtonProps) {
  return (
    <div className="">
      <label tabIndex={0} className="">
        <div className="flex">
          <MdOutlineShoppingCart size={30} />
          <span className="">{cart?.size || 0}</span>
        </div>
      </label>
      <div tabIndex={0} className="mt-3 w-52 bg-slate-200 shadow z-30">
        <div className="">
          <span className="text-lg font-bold">{cart?.size || 0} Items</span>
          <span className="">Subtotal: {formatPrice(cart?.subtotal || 0)}</span>
        </div>
      </div>
    </div>
  );
}
