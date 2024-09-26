"use client";

import { CartItemWithProduct } from "@/lib/db/cart";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { start } from "repl";

import { ProgressBar } from "primereact/progressbar";

import { DataView, DataViewLayoutOptions } from "primereact/dataview";

import { ProgressSpinner } from "primereact/progressspinner";

import { DataScroller } from "primereact/datascroller";

interface CartEntryProps {
  cartItem: CartItemWithProduct;
  setProductQuantity: (productId: string, quantity: number) => Promise<void>;
}

export default function CartEntry({
  cartItem: { product, quantity },
  setProductQuantity,
}: CartEntryProps) {
  const [isPending, startTransistion] = useTransition();
  const quantityOptions: JSX.Element[] = [];
  for (let i = 1; i <= 99; i++) {
    quantityOptions.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Image
          src={product.imageUrl}
          width={200}
          height={200}
          alt={product.name}
          className="rounded-lg"
        />
        <div>
          <Link href={"/products/" + product.id} className="font-bold">
            {product.name}
          </Link>
          <div>Price: {formatPrice(product.price)}</div>
          <div className="my-1 flex items-center gap-2">
            Quantity:
            <select
              className=""
              name=""
              id=""
              defaultValue={quantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.currentTarget.value);
                startTransistion(async () => {
                  await setProductQuantity(product.id, newQuantity);
                });
              }}
            >
              {quantityOptions}
            </select>
          </div>
          <div className="flex itens-center gap-3">
            Total: {formatPrice(product.price * quantity)}
          </div>
          {isPending && (
            <ProgressSpinner
              style={{ width: "25px", height: "25px" }}
              strokeWidth="4"
            />
          )}
        </div>
        {/* <ProgressBar
          mode="indeterminate"
          style={{ height: "6px" }}
        ></ProgressBar> */}
      </div>
      <div className="divider" />
    </div>
  );
}
