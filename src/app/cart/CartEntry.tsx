"use client";

import React, { useRef } from "react";
import { CartItemWithProduct } from "@/lib/db/cart";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Container } from "@mui/material";

interface CartEntryProps {
  cartItem: CartItemWithProduct; // Ensure this includes variants if needed
  setProductQuantity: (productId: string, quantity: number) => Promise<void>;
}

export default function CartEntry({
  cartItem: { product, quantity },
  setProductQuantity,
}: CartEntryProps) {
  const [isPending, startTransition] = useTransition();
  const quantityOptions: JSX.Element[] = [];
  const toast = useRef<Toast>(null);

  for (let i = 1; i <= 99; i++) {
    quantityOptions.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }

  const handleQuantityChange = (newQuantity: number) => {
    startTransition(async () => {
      await setProductQuantity(product.id, newQuantity);

      // Show toast notification based on quantity change
      if (newQuantity === 0) {
        toast.current?.show({
          severity: "warn",
          summary: "Removed",
          detail: `${product.name} was removed from your cart`,
        });
      } else {
        toast.current?.show({
          severity: "success",
          summary: "Updated",
          detail: `${product.name} quantity updated to ${newQuantity}`,
        });
      }
    });
  };

  console.log("HI" + product);

  return (
    <Container maxWidth="md">
      {/* <Toast ref={toast} />
      <div className="flex flex-wrap items-center gap-3">
        <Link href={"/products/" + product.variants.id} className="font-bold">
          <Image
            src={product.imageUrl}
            width={200}
            height={200}
            alt={product.name}
            className="rounded-lg"
          />
        </Link>
        <div>
          <Link href={"/products/" + product.id} className="font-bold text-4xl">
            {product.name}
          </Link>
          <div>Price: {formatPrice(product.price)}</div>
          <div className="my-1 flex items-center gap-2">
            Quantity:
            <select
              className="select w-full max-w-xs select-bordered bg-white"
              defaultValue={quantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.currentTarget.value);
                handleQuantityChange(newQuantity);
              }}
            >
              <option value={0}>0 (Remove)</option>
              {quantityOptions}
            </select>
          </div>
          <div className="flex items-center gap-3">
            SubTotal: {formatPrice(product.price * quantity)}
            {isPending && (
              <ProgressSpinner
                style={{ width: "25px", height: "25px" }}
                strokeWidth="4"
              />
            )}
          </div>
        </div>
      </div>
      <div className="divider" /> */}
    </Container>
  );
}
