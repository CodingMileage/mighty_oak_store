import { ShoppingCart } from "@/lib/db/cart";
import { formatPrice } from "@/lib/format";
import { Button } from "@mui/material";
import Link from "next/link";
import { MdOutlineShoppingCart } from "react-icons/md";

interface ShoppingCartButtonProps {
  cart: ShoppingCart | null;
}

export default function ShoppingCartButton({ cart }: ShoppingCartButtonProps) {
  return (
    <div className="dropdown-end dropdown">
      <label tabIndex={0} className="btn-ghost btn-circle btn">
        <div className="indicator">
          <MdOutlineShoppingCart size={30} />
          <span className="badge badge-sm indicator-item">
            {cart?.size || 0}
          </span>
        </div>
      </label>
      <div
        tabIndex={0}
        className="card dropdown-content card-compact mt-3 w-52 bg-slate-100 shadow z-30"
      >
        <div className="card-body">
          <span className="text-lg font-bold">{cart?.size || 0} Items</span>
          <span className="text-info">
            Subtotal: {formatPrice(cart?.subtotal || 0)}
          </span>
          <Link href={"/cart"}>
            <Button className="bg-emerald-400 text-white">Cart</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
